#!/usr/bin/env python
"""
Draft.AI — Improved Training Pipeline v2
Adds: matchup win-rate features, synergy pairs, patch context,
      sample weighting by recency, full-data training.
Run from: ml/ directory
"""
import sys, os
sys.stdout.reconfigure(encoding='utf-8')

import pandas as pd
import numpy as np
import lightgbm as lgb
import shap
from catboost import CatBoostClassifier
from sklearn.isotonic import IsotonicRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, accuracy_score, log_loss, brier_score_loss
from sklearn.preprocessing import LabelEncoder
import json
import joblib
import warnings
warnings.filterwarnings('ignore')

# ============================================================
# 1. Data Loading — 2020-2026 (more data, recency-weighted)
# ============================================================
DATA_DIR = '../Dataset'
YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026]

dfs = []
for year in YEARS:
    path = os.path.join(DATA_DIR, f'{year}_LoL_esports_match_data_from_OraclesElixir.csv')
    if not os.path.exists(path):
        print(f'⚠  {year} not found, skipping')
        continue
    df = pd.read_csv(path, low_memory=False)
    print(f'✅ {year}: {df["gameid"].nunique():,} games')
    dfs.append(df)

raw_df = pd.concat(dfs, ignore_index=True)
print(f'\n📊 Total: {raw_df["gameid"].nunique():,} unique games\n')

# ============================================================
# 2. Data Wrangling
# ============================================================
raw_df = raw_df[raw_df['datacompleteness'] == 'complete'].copy()

player_df = raw_df[raw_df['position'] != 'team'].copy()
player_df['position'] = player_df['position'].str.lower()
player_df = player_df[player_df['position'].isin(['top', 'jng', 'mid', 'bot', 'sup'])]
player_df = player_df.dropna(subset=['champion'])

player_df['role_side'] = player_df['side'].str.lower() + '_' + player_df['position']
dupes = player_df.groupby(['gameid', 'role_side']).size()
dupe_games = dupes[dupes > 1].reset_index()['gameid'].unique()
player_df = player_df[~player_df['gameid'].isin(dupe_games)]

draft_pivot = player_df.pivot_table(
    index='gameid',
    columns='role_side',
    values='champion',
    aggfunc='first'
).reset_index()

blue_context = player_df[player_df['side'] == 'Blue'].groupby('gameid').agg({
    'result': 'first',
    'patch': 'first',
    'league': 'first',
    'playoffs': 'first',
    'year': 'first'
}).reset_index()

games_df = draft_pivot.merge(blue_context, on='gameid', how='inner')

ROLE_COLS = [
    'blue_top', 'blue_jng', 'blue_mid', 'blue_bot', 'blue_sup',
    'red_top',  'red_jng',  'red_mid',  'red_bot',  'red_sup'
]

games_df = games_df.dropna(subset=ROLE_COLS)
games_df['result'] = games_df['result'].astype(int)
games_df['playoffs'] = pd.to_numeric(games_df['playoffs'], errors='coerce').fillna(0).astype(int)

print(f'✅ Final dataset: {len(games_df):,} games')
print(f'   Blue side win rate: {games_df["result"].mean():.4f}')
print(f'   Years: {sorted(games_df["year"].unique())}')

# ============================================================
# 3. Train / Test Split (temporal)
# ============================================================
train_mask = games_df['year'] < 2026
test_mask  = games_df['year'] >= 2026

train_df = games_df[train_mask].copy()
test_df  = games_df[test_mask].copy()

base_rate = float(train_df['result'].mean())
print(f'\n📊 Train: {len(train_df):,} | Test: {len(test_df):,}')
print(f'   Base rate (blue WR): {base_rate:.4f}')

# ============================================================
# 4. Feature Engineering
# ============================================================
SMOOTHING = 20
ROLES = ['top', 'jng', 'mid', 'bot', 'sup']

# --- 4a. Patch as numeric ---
def parse_patch(p):
    try:
        parts = str(p).split('.')
        return int(parts[0]) * 100 + int(parts[1])
    except Exception:
        return 0

games_df['patch_numeric'] = games_df['patch'].apply(parse_patch)

# --- 4b. Same-role matchup win rates (computed on train only) ---
print('\n🔧 Computing same-role matchup features...')
matchup_tables = {}
for role in ROLES:
    bc = f'blue_{role}'
    rc = f'red_{role}'
    grp = train_df.groupby([bc, rc])['result'].agg(['mean', 'count'])
    grp.columns = ['wr', 'count']
    grp = grp[grp['count'] >= 3]
    grp['smoothed'] = (grp['wr'] * grp['count'] + base_rate * SMOOTHING) / (grp['count'] + SMOOTHING)
    matchup_tables[role] = grp['smoothed'].to_dict()

for role in ROLES:
    bc = f'blue_{role}'
    rc = f'red_{role}'
    games_df[f'{role}_matchup_wr'] = [
        matchup_tables[role].get((b, r), base_rate)
        for b, r in zip(games_df[bc], games_df[rc])
    ]

MATCHUP_COLS = [f'{role}_matchup_wr' for role in ROLES]
print(f'   ✅ {len(MATCHUP_COLS)} matchup features added')

# --- 4c. Intra-team synergy pairs (computed on train only) ---
print('🔧 Computing synergy pair features...')
SYNERGY_PAIRS = [
    ('blue', 'bot',  'sup'),
    ('blue', 'mid',  'jng'),
    ('blue', 'top',  'jng'),
    ('red',  'bot',  'sup'),
    ('red',  'mid',  'jng'),
    ('red',  'top',  'jng'),
]

synergy_tables = {}
for side, r1, r2 in SYNERGY_PAIRS:
    c1 = f'{side}_{r1}'
    c2 = f'{side}_{r2}'
    key = f'{side}_{r1}_{r2}_synergy_wr'
    grp = train_df.groupby([c1, c2])['result']
    if side == 'red':
        grp_vals = train_df.groupby([c1, c2])['result'].agg(
            wr=lambda x: 1.0 - x.mean(), count='count'
        )
    else:
        grp_vals = train_df.groupby([c1, c2])['result'].agg(
            wr='mean', count='count'
        )
    grp_vals = grp_vals[grp_vals['count'] >= 3]
    grp_vals['smoothed'] = (
        grp_vals['wr'] * grp_vals['count'] + base_rate * SMOOTHING
    ) / (grp_vals['count'] + SMOOTHING)
    synergy_tables[key] = grp_vals['smoothed'].to_dict()
    games_df[key] = [
        synergy_tables[key].get((a, b), base_rate)
        for a, b in zip(games_df[c1], games_df[c2])
    ]

SYNERGY_COLS = [f'{s}_{r1}_{r2}_synergy_wr' for s, r1, r2 in SYNERGY_PAIRS]
print(f'   ✅ {len(SYNERGY_COLS)} synergy features added')

# --- 4d. Champion label encoding ---
le = LabelEncoder()
all_champions = pd.concat([games_df[c] for c in ROLE_COLS]).dropna().unique()
le.fit(all_champions)

ENCODED_COLS = []
for col in ROLE_COLS:
    enc_col = f'{col}_enc'
    games_df[enc_col] = le.transform(games_df[col])
    ENCODED_COLS.append(enc_col)

print(f'   ✅ {len(le.classes_)} champions label-encoded')

# --- 4e. League tier feature ---
TIER1_LEAGUES = {'LCK', 'LPL', 'LEC', 'LCS', 'MSI', 'Worlds'}
games_df['is_tier1'] = games_df['league'].isin(TIER1_LEAGUES).astype(int)

# --- Final feature set ---
FEATURE_COLS = ENCODED_COLS + MATCHUP_COLS + SYNERGY_COLS + ['patch_numeric', 'playoffs', 'is_tier1']
print(f'\n📐 Total features: {len(FEATURE_COLS)}')
print(f'   - Champion encodings: {len(ENCODED_COLS)}')
print(f'   - Matchup win rates:  {len(MATCHUP_COLS)}')
print(f'   - Synergy pairs:      {len(SYNERGY_COLS)}')
print(f'   - Context:            patch, playoffs, tier')

# ============================================================
# 5. Prepare Train / Test arrays
# ============================================================
# Sample weights: recent data weighted higher
WEIGHT_MAP = {2020: 0.3, 2021: 0.4, 2022: 0.5, 2023: 0.8, 2024: 1.0, 2025: 1.2}

X_train = games_df.loc[train_mask, FEATURE_COLS].astype(float)
X_test  = games_df.loc[test_mask,  FEATURE_COLS].astype(float)
y_train = games_df.loc[train_mask, 'result']
y_test  = games_df.loc[test_mask,  'result']
w_train = games_df.loc[train_mask, 'year'].map(WEIGHT_MAP).fillna(1.0)

# Hold out 20% of train for calibration (stratified)
X_fit, X_cal, y_fit, y_cal, w_fit, _ = train_test_split(
    X_train, y_train, w_train,
    test_size=0.20, random_state=42, stratify=y_train
)

# ============================================================
# 6. LightGBM
# ============================================================
print('\n🚀 Training LightGBM...')
lgb_params = {
    'objective': 'binary',
    'metric': ['binary_logloss', 'auc'],
    'boosting_type': 'gbdt',
    'num_leaves': 127,
    'learning_rate': 0.03,
    'feature_fraction': 0.8,
    'bagging_fraction': 0.8,
    'bagging_freq': 5,
    'min_child_samples': 30,
    'lambda_l1': 0.1,
    'lambda_l2': 0.1,
    'verbose': -1,
    'seed': 42
}

lgb_train_ds = lgb.Dataset(X_fit, label=y_fit, weight=w_fit, free_raw_data=False)
lgb_val_ds   = lgb.Dataset(X_cal, label=y_cal, reference=lgb_train_ds, free_raw_data=False)

lgb_model = lgb.train(
    lgb_params,
    lgb_train_ds,
    num_boost_round=2000,
    valid_sets=[lgb_val_ds],
    valid_names=['valid'],
    callbacks=[lgb.early_stopping(100), lgb.log_evaluation(200)]
)

lgb_cal_pred  = lgb_model.predict(X_cal)
lgb_test_pred = lgb_model.predict(X_test)
print(f'   LGB cal AUC:  {roc_auc_score(y_cal, lgb_cal_pred):.4f}')
print(f'   LGB test AUC: {roc_auc_score(y_test, lgb_test_pred):.4f}')

# ============================================================
# 7. CatBoost
# ============================================================
print('\n🚀 Training CatBoost...')

# CatBoost with encoded categoricals (only the 10 role cols)
cat_indices = list(range(len(ENCODED_COLS)))

cb_model = CatBoostClassifier(
    iterations=2000,
    learning_rate=0.03,
    depth=7,
    l2_leaf_reg=3,
    random_seed=42,
    verbose=200,
    eval_metric='AUC',
    early_stopping_rounds=100,
)

cb_model.fit(
    X_fit, y_fit,
    sample_weight=w_fit.values,
    eval_set=(X_cal, y_cal),
    use_best_model=True
)

cb_cal_pred  = cb_model.predict_proba(X_cal)[:, 1]
cb_test_pred = cb_model.predict_proba(X_test)[:, 1]
print(f'   CB cal AUC:   {roc_auc_score(y_cal, cb_cal_pred):.4f}')
print(f'   CB test AUC:  {roc_auc_score(y_test, cb_test_pred):.4f}')

# ============================================================
# 8. Ensemble + Isotonic Calibration
# ============================================================
print('\n🔧 Calibrating ensemble...')

ens_cal  = (lgb_cal_pred  + cb_cal_pred)  / 2
ens_test = (lgb_test_pred + cb_test_pred) / 2

calibrator = IsotonicRegression(out_of_bounds='clip')
calibrator.fit(ens_cal, y_cal)

cal_pred_test = calibrator.transform(ens_test)

# ============================================================
# 9. Final Evaluation
# ============================================================
final_auc  = roc_auc_score(y_test, cal_pred_test)
final_acc  = accuracy_score(y_test, (cal_pred_test > 0.5).astype(int))
final_ll   = log_loss(y_test, cal_pred_test)
final_bs   = brier_score_loss(y_test, cal_pred_test)

print('\n' + '='*60)
print('📊 FINAL RESULTS (Calibrated LGB+CB Ensemble)')
print('='*60)
print(f'   Test AUC:      {final_auc:.4f}')
print(f'   Test Accuracy: {final_acc:.4f}  ({final_acc*100:.1f}%)')
print(f'   Test Log Loss: {final_ll:.4f}')
print(f'   Test Brier:    {final_bs:.4f}')
print('='*60)

# ============================================================
# 9b. SHAP Analysis (LightGBM TreeExplainer)
# ============================================================
print('\n🔧 Computing SHAP values on test set...')

FEATURE_DISPLAY = {
    'blue_top_enc':             'Blue Top Pick',
    'blue_jng_enc':             'Blue Jungle Pick',
    'blue_mid_enc':             'Blue Mid Pick',
    'blue_bot_enc':             'Blue Bot Pick',
    'blue_sup_enc':             'Blue Support Pick',
    'red_top_enc':              'Red Top Pick',
    'red_jng_enc':              'Red Jungle Pick',
    'red_mid_enc':              'Red Mid Pick',
    'red_bot_enc':              'Red Bot Pick',
    'red_sup_enc':              'Red Support Pick',
    'top_matchup_wr':           'Top Lane Matchup',
    'jng_matchup_wr':           'Jungle Matchup',
    'mid_matchup_wr':           'Mid Lane Matchup',
    'bot_matchup_wr':           'Bot Lane Matchup',
    'sup_matchup_wr':           'Support Matchup',
    'blue_bot_sup_synergy_wr':  'Blue Bot-Sup Synergy',
    'blue_mid_jng_synergy_wr':  'Blue Mid-Jng Synergy',
    'blue_top_jng_synergy_wr':  'Blue Top-Jng Synergy',
    'red_bot_sup_synergy_wr':   'Red Bot-Sup Synergy',
    'red_mid_jng_synergy_wr':   'Red Mid-Jng Synergy',
    'red_top_jng_synergy_wr':   'Red Top-Jng Synergy',
    'patch_numeric':            'Patch / Meta Recency',
    'playoffs':                 'Playoffs Game',
    'is_tier1':                 'Tier-1 League',
}

explainer = shap.TreeExplainer(lgb_model)

# Use a sample of test set (up to 2000 games) for speed
shap_sample = X_test.iloc[:2000] if len(X_test) > 2000 else X_test
shap_arr = explainer.shap_values(shap_sample)
# LGB binary returns single array (positive class SHAP)
if isinstance(shap_arr, list):
    shap_arr = shap_arr[1]

expected_value = explainer.expected_value
if isinstance(expected_value, (list, np.ndarray)):
    expected_value = float(expected_value[1])
else:
    expected_value = float(expected_value)

# --- Global feature importance (mean |SHAP|) ---
mean_abs_shap = np.abs(shap_arr).mean(axis=0)
global_importance = sorted([
    {
        'feature': col,
        'display': FEATURE_DISPLAY.get(col, col),
        'mean_abs_shap': round(float(mean_abs_shap[i]), 6),
        'normalized': round(float(mean_abs_shap[i] / mean_abs_shap.sum()), 4),
    }
    for i, col in enumerate(FEATURE_COLS)
], key=lambda x: x['mean_abs_shap'], reverse=True)

print(f'   Expected value (base): {expected_value:.4f}')
print(f'   Top 5 features by |SHAP|:')
for f in global_importance[:5]:
    print(f'     {f["display"]:<30}  {f["mean_abs_shap"]:.6f}  ({f["normalized"]*100:.1f}%)')

# --- Per-champion SHAP: average SHAP for each champion in each role slot ---
print('   Computing per-champion SHAP values...')
champion_shap = {}
test_games_aligned = games_df[test_mask].reset_index(drop=True).iloc[:len(shap_sample)]

for i, col in enumerate(ENCODED_COLS):
    role_col = col.replace('_enc', '')  # e.g. blue_top
    col_shap = shap_arr[:, i]           # SHAP values for this role slot across all test games

    for champ in le.classes_:
        enc_val = int(le.transform([champ])[0])
        mask = shap_sample[col].values == enc_val
        if mask.sum() < 5:
            continue
        avg_shap = float(col_shap[mask].mean())
        champion_shap.setdefault(champ, {})[role_col] = {
            'shap_value': round(avg_shap, 5),
            'count': int(mask.sum()),
        }

# Build ranked lists: top blue/red contributors by SHAP
blue_champ_shap = []
red_champ_shap  = []
for champ, slots in champion_shap.items():
    blue_slots_data = {k: v for k, v in slots.items() if k.startswith('blue_')}
    red_slots_data  = {k: v for k, v in slots.items() if k.startswith('red_')}
    if blue_slots_data:
        best = max(blue_slots_data.items(), key=lambda x: x[1]['shap_value'])
        blue_champ_shap.append({'champion': champ, 'role': best[0].replace('blue_','').upper(),
                                  'shap_value': best[1]['shap_value'], 'count': best[1]['count']})
    if red_slots_data:
        best = max(red_slots_data.items(), key=lambda x: x[1]['shap_value'])
        red_champ_shap.append({'champion': champ, 'role': best[0].replace('red_','').upper(),
                                 'shap_value': best[1]['shap_value'], 'count': best[1]['count']})

blue_champ_shap.sort(key=lambda x: x['shap_value'], reverse=True)
red_champ_shap.sort(key=lambda x: x['shap_value'], reverse=True)

print(f'\n   Top 5 blue-side champions by SHAP:')
for c in blue_champ_shap[:5]:
    print(f'     {c["champion"]:<20} {c["role"]:<8} SHAP={c["shap_value"]:+.5f}  n={c["count"]}')

shap_export = {
    'expected_value': round(expected_value, 4),
    'global_importance': global_importance,
    'top_blue_by_shap': blue_champ_shap[:20],
    'top_red_by_shap':  red_champ_shap[:20],
    'champion_shap':    champion_shap,
}
print('   ✅ SHAP analysis complete')

# ============================================================
# 10. Export champion values + JSON (same format as v1)
# ============================================================
print('\n📦 Exporting model artifacts...')

SMOOTHING_EXPORT = 20
train_games_df = games_df[train_mask]
base_rate_export = float(train_games_df['result'].mean())

champion_values = {}
for role_col in ROLE_COLS:
    side, role = role_col.split('_', 1)
    champ_wr = train_games_df.groupby(role_col)['result'].agg(['mean', 'count'])
    champ_wr.columns = ['win_rate', 'games']
    champ_wr = champ_wr[champ_wr['games'] >= 5]
    for champ, row in champ_wr.iterrows():
        smoothed = (row['win_rate'] * row['games'] + base_rate_export * SMOOTHING_EXPORT) / (row['games'] + SMOOTHING_EXPORT)
        champion_values.setdefault(champ, {}).setdefault(side, {})[role] = {
            'win_rate': round(float(smoothed), 4),
            'raw_win_rate': round(float(row['win_rate']), 4),
            'games': int(row['games']),
            'value': round(float(smoothed - base_rate_export), 4)
        }

champion_stats = {}
blue_cols = [c for c in ROLE_COLS if c.startswith('blue_')]
red_cols  = [c for c in ROLE_COLS if c.startswith('red_')]

for champ in sorted(le.classes_):
    b_mask = train_games_df[blue_cols].eq(champ).any(axis=1)
    r_mask = train_games_df[red_cols].eq(champ).any(axis=1)
    b_count = int(b_mask.sum())
    r_count = int(r_mask.sum())
    total = b_count + r_count
    if total == 0:
        continue
    b_wr = float(train_games_df.loc[b_mask, 'result'].mean()) if b_count > 0 else 0.5
    r_wr = 1.0 - float(train_games_df.loc[r_mask, 'result'].mean()) if r_count > 0 else 0.5
    overall = (b_wr * b_count + r_wr * r_count) / total
    champion_stats[champ] = {
        'total_picks': total,
        'blue_picks': b_count,
        'red_picks': r_count,
        'blue_win_rate': round(b_wr, 4),
        'red_win_rate': round(r_wr, 4),
        'overall_win_rate': round(overall, 4)
    }

model_export = {
    'metadata': {
        'model_type': 'LightGBM + CatBoost Ensemble v2 (Isotonic Calibration)',
        'training_years': '2020-2025',
        'test_year': '2026',
        'training_games': int(len(y_train)),
        'test_games': int(len(y_test)),
        'test_auc': round(final_auc, 4),
        'test_accuracy': round(final_acc, 4),
        'test_log_loss': round(final_ll, 4),
        'test_brier_score': round(final_bs, 4),
        'base_blue_win_rate': round(base_rate_export, 4),
        'champion_count': len(le.classes_),
        'features': FEATURE_COLS,
    },
    'champion_values': champion_values,
    'champion_stats': champion_stats,
    'label_encoder_classes': le.classes_.tolist()
}

json_path = '../src/data/draft_model.json'
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(model_export, f, indent=2)

print(f'   ✅ JSON exported → {json_path}')
print(f'      Size: {os.path.getsize(json_path) / 1024:.1f} KB')

joblib.dump(lgb_model, 'lgb_model.pkl')
joblib.dump(cb_model,  'cb_model.pkl')
joblib.dump(calibrator,'calibrated_ensemble.pkl')
joblib.dump(le,        'label_encoder.pkl')

# Also save feature list so server.py knows which features to build
meta = {
    'feature_cols': FEATURE_COLS,
    'encoded_cols': ENCODED_COLS,
    'matchup_cols': MATCHUP_COLS,
    'synergy_cols': SYNERGY_COLS,
    'matchup_tables': {
        role: {str(k): float(v) for k, v in tbl.items()}
        for role, tbl in matchup_tables.items()
    },
    'synergy_tables': {
        key: {str(k): float(v) for k, v in tbl.items()}
        for key, tbl in synergy_tables.items()
    },
    'base_rate': base_rate_export,
    'synergy_pair_defs': SYNERGY_PAIRS,
    'shap': shap_export,
}
with open('model_meta.json', 'w', encoding='utf-8') as f:
    json.dump(meta, f)

print('   ✅ model_meta.json saved (feature lookup tables for server.py)')
print('\n✅ Training complete!')
print(f'\n🎯 ACCURACY: {final_acc*100:.1f}%  |  AUC: {final_auc:.4f}  |  LOG-LOSS: {final_ll:.4f}  |  BRIER: {final_bs:.4f}')
