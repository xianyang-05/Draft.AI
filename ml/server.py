from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os
import uvicorn
import json
import sys

# Reconfigure stdout and stderr to use utf-8 to prevent cp1252 encoding crashes on Windows
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

app = FastAPI(title="Draft.AI Prediction API")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Global variables
lgb_model = None
cb_model = None
calibrator = None
le = None
model_json_data = None
model_meta = None  # feature lookup tables from v2 training

ROLE_MAP = {
    'TOP': 'top',
    'JUNGLE': 'jng',
    'MID': 'mid',
    'ADC': 'bot',
    'SUPPORT': 'sup'
}

ROLE_COLS = [
    'blue_top', 'blue_jng', 'blue_mid', 'blue_bot', 'blue_sup',
    'red_top',  'red_jng',  'red_mid',  'red_bot',  'red_sup'
]

ENCODED_COLS = [f'{col}_enc' for col in ROLE_COLS]
ROLES = ['top', 'jng', 'mid', 'bot', 'sup']

def _try_load(prefix=''):
    global lgb_model, cb_model, calibrator, le, model_json_data, model_meta
    lgb_model  = joblib.load(f"{prefix}lgb_model.pkl")
    cb_model   = joblib.load(f"{prefix}cb_model.pkl")
    calibrator = joblib.load(f"{prefix}calibrated_ensemble.pkl")
    le         = joblib.load(f"{prefix}label_encoder.pkl")

    json_path = f"{prefix}../src/data/draft_model.json" if prefix else "../src/data/draft_model.json"
    if not os.path.exists(json_path):
        json_path = "src/data/draft_model.json"
    with open(json_path, "r", encoding="utf-8") as f:
        model_json_data = json.load(f)

    meta_path = f"{prefix}model_meta.json" if prefix else "model_meta.json"
    if os.path.exists(meta_path):
        with open(meta_path, "r", encoding="utf-8") as f:
            model_meta = json.load(f)
        print("✅ v2 feature tables loaded (matchup + synergy features active)")
    else:
        print("⚠  model_meta.json not found — using v1 (encoded-only) features")

@app.on_event("startup")
def load_models():
    try:
        _try_load('')
        print("✅ All model checkpoints loaded!")
    except Exception as e:
        print(f"❌ Load failed from ml/: {e}")
        try:
            _try_load('ml/')
            print("✅ Model checkpoints loaded from root folder!")
        except Exception as err:
            print(f"❌ Critical error loading models: {err}")

class TeamSlot(BaseModel):
    role: str
    champion: dict | None = None

class PredictionRequest(BaseModel):
    blueTeam: list[TeamSlot]
    redTeam: list[TeamSlot]

@app.post("/predict")
def predict_draft(request: PredictionRequest):
    if lgb_model is None or cb_model is None or calibrator is None or le is None:
        raise HTTPException(status_code=500, detail="Models are not loaded on backend server.")

    # 1. Map request slots to role structure
    blue_slots = {slot.role: slot.champion['name'] if slot.champion else None for slot in request.blueTeam}
    red_slots = {slot.role: slot.champion['name'] if slot.champion else None for slot in request.redTeam}
    
    # 2. Count picked champions
    blue_picked = [name for name in blue_slots.values() if name is not None]
    red_picked = [name for name in red_slots.values() if name is not None]
    total_picked = len(blue_picked) + len(red_picked)

    # 3. Handle incomplete drafts (fallback to Bayesian empirical lookup)
    if total_picked < 10:
        return calculate_incomplete_prediction(blue_slots, red_slots)

    # 4. Full draft: run ML models
    try:
        input_data = {}
        for role_name, key in ROLE_MAP.items():
            input_data[f'blue_{key}'] = blue_slots.get(role_name)
            input_data[f'red_{key}'] = red_slots.get(role_name)

        # --- Encode champion slots ---
        encoded_input = []
        for col in ROLE_COLS:
            val = input_data[col]
            encoded_input.append(int(le.transform([val])[0]) if val in le.classes_ else 0)

        row = dict(zip(ENCODED_COLS, encoded_input))

        # --- Add v2 features if model_meta is available ---
        if model_meta:
            base_rate = model_meta.get('base_rate', 0.5316)
            mtables = model_meta.get('matchup_tables', {})
            stables = model_meta.get('synergy_tables', {})

            for role in ROLES:
                bc = f'blue_{role}'
                rc = f'red_{role}'
                key_str = str((input_data[bc], input_data[rc]))
                row[f'{role}_matchup_wr'] = mtables.get(role, {}).get(key_str, base_rate)

            for side, r1, r2 in model_meta.get('synergy_pair_defs', []):
                c1 = f'{side}_{r1}'
                c2 = f'{side}_{r2}'
                skey = f'{side}_{r1}_{r2}_synergy_wr'
                key_str = str((input_data[c1], input_data[c2]))
                row[skey] = stables.get(skey, {}).get(key_str, base_rate)

            # Context features (neutral defaults for live prediction)
            row['patch_numeric'] = 1401   # approximate current patch
            row['playoffs'] = 0
            row['is_tier1'] = 1

            feature_cols = model_meta.get('feature_cols', ENCODED_COLS)
            X = pd.DataFrame([[row.get(c, base_rate) for c in feature_cols]], columns=feature_cols)
            source = "ML Ensemble v2 (Calibrated)"
        else:
            X = pd.DataFrame([encoded_input], columns=ENCODED_COLS)
            source = "ML Ensemble v1 (Calibrated)"

        lgb_prob = float(lgb_model.predict_proba(X)[:, 1][0])
        cb_prob  = float(cb_model.predict_proba(X)[:, 1][0])
        ens_prob = (lgb_prob + cb_prob) / 2

        calibrated_prob = float(calibrator.transform([ens_prob])[0])
        final_prob = max(0.15, min(0.85, calibrated_prob))
        win_chance_percentage = int(round(final_prob * 100))

        recommendations = get_recommendations_from_json(blue_picked + red_picked)

        return {
            "source": source,
            "blueWinChance": win_chance_percentage,
            "recommendedPicks": recommendations["picks"],
            "recommendedBans": recommendations["bans"]
        }
    except Exception as e:
        print(f"Prediction failed, falling back to empirical. Error: {e}")
        return calculate_incomplete_prediction(blue_slots, red_slots)

def calculate_incomplete_prediction(blue_slots, red_slots):
    """Fallback calculation using Bayesian-smoothed empirical rates."""
    if model_json_data is None:
        return {
            "source": "Default Baseline",
            "blueWinChance": 53,
            "recommendedPicks": [],
            "recommendedBans": []
        }
        
    metadata = model_json_data.get("metadata", {})
    champion_values = model_json_data.get("champion_values", {})
    base_rate = metadata.get("base_blue_win_rate", 0.5316)
    
    blue_contribution = 0.0
    red_contribution = 0.0
    
    def slot_value(champ_data, side, model_role):
        side_data = champ_data.get(side, {})
        if not side_data:
            return 0.0
        if model_role in side_data:
            return side_data[model_role].get("value", 0.0)
        # Off-role pick: champion has side data but not for this role
        known_vals = [r.get("value", 0.0) for r in side_data.values()]
        if not known_vals:
            return 0.0
        avg = sum(known_vals) / len(known_vals)
        # Blue off-role → hurts blue → negative impact on blue win rate
        # Red off-role  → hurts red  → positive impact on blue win rate
        return (-abs(avg) - 0.04) if side == "blue" else (abs(avg) + 0.04)

    # Calculate blue picks
    for role_name, champ_name in blue_slots.items():
        if champ_name:
            model_role = ROLE_MAP.get(role_name)
            champ_data = champion_values.get(champ_name, {})
            blue_contribution += slot_value(champ_data, "blue", model_role)

    # Calculate red picks
    for role_name, champ_name in red_slots.items():
        if champ_name:
            model_role = ROLE_MAP.get(role_name)
            champ_data = champion_values.get(champ_name, {})
            red_contribution += slot_value(champ_data, "red", model_role)
            
    raw_prob = base_rate + blue_contribution + red_contribution
    final_prob = max(0.15, min(0.85, raw_prob))
    win_chance_percentage = int(round(final_prob * 100))
    
    all_picked = [name for name in list(blue_slots.values()) + list(red_slots.values()) if name]
    recommendations = get_recommendations_from_json(all_picked)
    
    return {
        "source": "Empirical Bayesian Prior Lookup",
        "blueWinChance": win_chance_percentage,
        "recommendedPicks": recommendations["picks"],
        "recommendedBans": recommendations["bans"]
    }

def get_recommendations_from_json(picked_champs):
    if model_json_data is None:
        return {"picks": [], "bans": []}
        
    all_champs = model_json_data.get("champion_stats", {})
    picked_set = set(picked_champs)
    
    sorted_champs = []
    for name, stats in all_champs.items():
        if name not in picked_set and stats.get("total_picks", 0) >= 50:
            sorted_champs.append({
                "name": name,
                "overall_win_rate": stats.get("overall_win_rate", 0.5)
            })
            
    sorted_champs.sort(key=lambda x: x["overall_win_rate"], reverse=True)
    picks = [c["name"] for c in sorted_champs[:3]]
    bans = [c["name"] for c in sorted_champs[3:5]]
    
    return {"picks": picks, "bans": bans}

FEATURE_DISPLAY_NAMES = {
    # Champion slot encodings
    'blue_top_enc': 'Blue Top Pick',
    'blue_jng_enc': 'Blue Jungle Pick',
    'blue_mid_enc': 'Blue Mid Pick',
    'blue_bot_enc': 'Blue ADC Pick',
    'blue_sup_enc': 'Blue Support Pick',
    'red_top_enc':  'Red Top Pick',
    'red_jng_enc':  'Red Jungle Pick',
    'red_mid_enc':  'Red Mid Pick',
    'red_bot_enc':  'Red ADC Pick',
    'red_sup_enc':  'Red Support Pick',
    # Matchup win rate features
    'top_matchup_wr': 'Top Lane Matchup Win Rate',
    'jng_matchup_wr': 'Jungle Matchup Win Rate',
    'mid_matchup_wr': 'Mid Lane Matchup Win Rate',
    'bot_matchup_wr': 'Bot Lane Matchup Win Rate',
    'sup_matchup_wr': 'Support Matchup Win Rate',
    # Synergy features
    'blue_bot_sup_synergy_wr': 'Blue Bot+Support Synergy',
    'blue_mid_jng_synergy_wr': 'Blue Mid+Jungle Synergy',
    'blue_top_jng_synergy_wr': 'Blue Top+Jungle Synergy',
    'red_bot_sup_synergy_wr':  'Red Bot+Support Synergy',
    'red_mid_jng_synergy_wr':  'Red Mid+Jungle Synergy',
    'red_top_jng_synergy_wr':  'Red Top+Jungle Synergy',
    # Context features
    'patch_numeric': 'Patch Number',
    'playoffs':      'Playoff Game',
    'is_tier1':      'Tier-1 League',
}

@app.get("/health")
def health_check():
    models_loaded = all(m is not None for m in [lgb_model, cb_model, calibrator, le])
    metadata = model_json_data.get("metadata", {}) if model_json_data else {}
    return {
        "status": "ok" if models_loaded else "degraded",
        "models_loaded": models_loaded,
        "metrics": metadata
    }

@app.get("/shap")
def get_shap_data():
    if lgb_model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    champion_stats = model_json_data.get("champion_stats", {}) if model_json_data else {}

    # --- Real SHAP data from training (preferred) ---
    if model_meta and "shap" in model_meta:
        shap_data = model_meta["shap"]
        meta_rankings = sorted([
            {
                "champion": name,
                "overall_win_rate": s["overall_win_rate"],
                "blue_win_rate": s.get("blue_win_rate", 0),
                "red_win_rate": s.get("red_win_rate", 0),
                "total_picks": s["total_picks"],
                "blue_picks": s.get("blue_picks", 0),
                "red_picks": s.get("red_picks", 0),
            }
            for name, s in champion_stats.items() if s.get("total_picks", 0) >= 100
        ], key=lambda x: x["overall_win_rate"], reverse=True)

        top_blue = shap_data.get("top_blue_by_shap", [])
        top_red  = shap_data.get("top_red_by_shap", [])

        # Enrich with win_rate from champion_stats
        for entry in top_blue + top_red:
            champ = entry["champion"]
            side = "blue" if entry in top_blue else "red"
            s = champion_stats.get(champ, {})
            entry["win_rate"] = s.get(f"{side}_win_rate", s.get("overall_win_rate", 0.5))
            entry["games"] = s.get("total_picks", 0)
            entry["value"] = entry["shap_value"]

        return {
            "source": "SHAP TreeExplainer (LightGBM)",
            "expected_value": shap_data.get("expected_value"),
            "feature_importance": shap_data.get("global_importance", []),
            "top_blue": top_blue[:10],
            "top_red":  top_red[:10],
            "meta_rankings": meta_rankings[:30],
            "strongest_champion_blue": top_blue[0] if top_blue else None,
            "strongest_champion_red":  top_red[0]  if top_red  else None,
            "top_feature": shap_data.get("global_importance", [{}])[0],
        }

    # --- Fallback: LGB feature_importances_ (no shap library data yet) ---
    importances = lgb_model.feature_importances_.tolist()
    total = sum(importances) or 1
    feature_cols = model_meta.get("feature_cols", ENCODED_COLS) if model_meta else ENCODED_COLS

    feature_importance = sorted([
        {"feature": FEATURE_DISPLAY_NAMES.get(col, col), "display": FEATURE_DISPLAY_NAMES.get(col, col),
         "importance": importances[i], "normalized": importances[i] / total, "mean_abs_shap": importances[i] / total}
        for i, col in enumerate(feature_cols) if i < len(importances)
    ], key=lambda x: x["importance"], reverse=True)

    champion_values = model_json_data.get("champion_values", {}) if model_json_data else {}
    blue_contributors, red_contributors = [], []
    for champ_name, sides in champion_values.items():
        s = champion_stats.get(champ_name, {})
        if s.get("total_picks", 0) < 100:
            continue
        bd = sides.get("blue", {})
        if bd:
            best_r, best_d = max(bd.items(), key=lambda x: x[1].get("value", -999))
            if best_d.get("games", 0) >= 50:
                blue_contributors.append({"champion": champ_name, "role": best_r.upper(),
                    "value": best_d["value"], "shap_value": best_d["value"],
                    "win_rate": best_d["win_rate"], "games": best_d["games"]})
        rd = sides.get("red", {})
        if rd:
            best_r, best_d = max(rd.items(), key=lambda x: x[1].get("value", -999))
            if best_d.get("games", 0) >= 50:
                red_contributors.append({"champion": champ_name, "role": best_r.upper(),
                    "value": best_d["value"], "shap_value": best_d["value"],
                    "win_rate": best_d["win_rate"], "games": best_d["games"]})
    blue_contributors.sort(key=lambda x: x["value"], reverse=True)
    red_contributors.sort(key=lambda x: x["value"], reverse=True)

    meta_rankings = sorted([
        {"champion": name, "overall_win_rate": s["overall_win_rate"],
         "blue_win_rate": s.get("blue_win_rate", 0), "red_win_rate": s.get("red_win_rate", 0),
         "total_picks": s["total_picks"], "blue_picks": s.get("blue_picks", 0), "red_picks": s.get("red_picks", 0)}
        for name, s in champion_stats.items() if s.get("total_picks", 0) >= 100
    ], key=lambda x: x["overall_win_rate"], reverse=True)

    return {
        "source": "LGB Feature Importances (retrain to get SHAP)",
        "feature_importance": feature_importance,
        "top_blue": blue_contributors[:10],
        "top_red":  red_contributors[:10],
        "meta_rankings": meta_rankings[:30],
        "strongest_champion_blue": blue_contributors[0] if blue_contributors else None,
        "strongest_champion_red":  red_contributors[0]  if red_contributors else None,
        "top_feature": feature_importance[0] if feature_importance else None,
        "strongest_champion_blue": blue_contributors[0] if blue_contributors else None,
        "strongest_champion_red": red_contributors[0] if red_contributors else None,
        "top_feature": feature_importance[0] if feature_importance else None
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
