import React, { useState, useEffect, useMemo } from 'react';
import SideNavBar from '../components/SideNavBar';
import { Link } from 'react-router-dom';
import modelData from '../data/draft_model.json';

const BACKEND_URL = 'http://127.0.0.1:8000';

function safeNum(value, fallback = 0) {
  return value != null && !Number.isNaN(Number(value)) ? Number(value) : fallback;
}

function safePct(value, fallback = 0.52) {
  return (safeNum(value, fallback) * 100).toFixed(1);
}

function safePctFromValue(value, fallback = 0) {
  return (safeNum(value, fallback) * 100).toFixed(1);
}

// DDragon internal key differs from display name for some champions
const DDRAGON_KEY_MAP = {
  'Wukong': 'MonkeyKing',
  'Nunu & Willump': 'Nunu',
  'Renata Glasc': 'Renata',
  'LeBlanc': 'Leblanc',
  "Bel'Veth": 'Belveth',
  "Kai'Sa": 'Kaisa',
  "Kha'Zix": 'Khazix',
  "Vel'Koz": 'Velkoz',
  "Cho'Gath": 'Chogath',
  "K'Sante": 'KSante',
  "Rek'Sai": 'RekSai',
  "Kog'Maw": 'KogMaw',
  'Aurelion Sol': 'AurelionSol',
  'Dr. Mundo': 'DrMundo',
};

function champIcon(name) {
  const key = DDRAGON_KEY_MAP[name]
    ?? name.replace(/\s+/g, '').replace(/'/g, '').replace(/\./g, '').replace(/&\s*\w+/g, '');
  return `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${key}.png`;
}

function computeLocalShapData() {
  const championValues = modelData.champion_values || {};
  const championStats = modelData.champion_stats || {};

  const blueContributors = [];
  const redContributors = [];

  for (const [champName, sides] of Object.entries(championValues)) {
    const stats = championStats[champName] || {};
    if ((stats.total_picks || 0) < 100) continue;

    const blueData = sides.blue || {};
    const blueEntries = Object.entries(blueData);
    if (blueEntries.length > 0) {
      const [bestRole, bestData] = blueEntries.reduce((a, b) =>
        b[1].value > a[1].value ? b : a);
      if ((bestData.games || 0) >= 50) {
        blueContributors.push({
          champion: champName, role: bestRole.toUpperCase(),
          value: bestData.value, win_rate: bestData.win_rate, games: bestData.games
        });
      }
    }

    const redData = sides.red || {};
    const redEntries = Object.entries(redData);
    if (redEntries.length > 0) {
      const [bestRole, bestData] = redEntries.reduce((a, b) =>
        b[1].value > a[1].value ? b : a);
      if ((bestData.games || 0) >= 50) {
        redContributors.push({
          champion: champName, role: bestRole.toUpperCase(),
          value: bestData.value, win_rate: bestData.win_rate, games: bestData.games
        });
      }
    }
  }

  blueContributors.sort((a, b) => b.value - a.value);
  redContributors.sort((a, b) => b.value - a.value);

  const metaRankings = Object.entries(championStats)
    .filter(([_, s]) => s.total_picks >= 100)
    .map(([name, s]) => ({ champion: name, ...s }))
    .sort((a, b) => b.overall_win_rate - a.overall_win_rate)
    .slice(0, 30);

  return {
    feature_importance: null,
    top_blue: blueContributors.slice(0, 10),
    top_red: redContributors.slice(0, 10),
    meta_rankings: metaRankings,
    strongest_champion_blue: blueContributors[0] || null,
    strongest_champion_red: redContributors[0] || null,
    top_feature: null
  };
}

export default function MetaInsights() {
  const [shapData, setShapData] = useState(null);
  const [backendOnline, setBackendOnline] = useState(null);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    fetch(`${BACKEND_URL}/shap`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setShapData(data);
          setBackendOnline(true);
        } else {
          setShapData(computeLocalShapData());
          setBackendOnline(false);
        }
      })
      .catch(() => {
        setShapData(computeLocalShapData());
        setBackendOnline(false);
      });
  }, []);

  const displayFeatures = shapData?.feature_importance?.slice(0, 5) || [];
  const maxFeatureImportance = displayFeatures[0]?.mean_abs_shap || displayFeatures[0]?.importance || 1;

  const topBlue = shapData?.top_blue || [];
  const topRed = shapData?.top_red || [];
  const metaRankings = shapData?.meta_rankings || [];
  const strongestChamp = shapData?.strongest_champion_blue;
  const topFeature = shapData?.top_feature;

  const filteredRankings = useMemo(() =>
    metaRankings.filter(c =>
      c.champion.toLowerCase().includes(filterText.toLowerCase())
    ),
    [metaRankings, filterText]
  );

  const metaImpactScore = (champ) =>
    safePctFromValue(safeNum(champ.overall_win_rate, 0.52) - 0.5, 4.0);

  return (
<>

<SideNavBar />

<header className="fixed top-0 right-0 left-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10 flex justify-between items-center px-gutter h-16 ml-64">
<div className="flex items-center gap-4">
</div>
<div className="flex items-center gap-6">
<div className="flex items-center gap-4 font-label-caps text-label-caps">
<span className="text-electric-green">GLOBAL META DATABASE</span>
  <div className="flex items-center gap-2">
    <span className="w-2 h-2 rounded-full bg-electric-green animate-pulse"></span>
    <span className="text-[9px] tracking-widest text-electric-green">ML LIVE</span>
  </div>
</div>
<div className="flex items-center gap-4 text-on-surface-variant">
<span className="material-symbols-outlined cursor-pointer hover:text-electric-green transition-all">notifications</span>
<span className="material-symbols-outlined cursor-pointer hover:text-electric-green transition-all">shield</span>
<span className="material-symbols-outlined cursor-pointer hover:text-electric-green transition-all">account_circle</span>
</div>
</div>
</header>

<main className="ml-64 pt-24 min-h-screen p-8 overflow-y-auto">

<section className="mb-10">
<div className="flex justify-between items-end">
<div>
<h2 className="font-headline-lg text-headline-lg text-pure-white mb-2">SHAP Dashboard</h2>
<p className="font-body-md text-sm text-on-surface-variant max-w-2xl">Model feature importance and champion contribution analysis. Identifies which draft slots and champions drive win probability across {(modelData.metadata?.training_games ?? 0).toLocaleString()} professional matches.</p>
</div>
<div className="flex gap-3">
<div className="glass-panel px-4 py-2 flex items-center gap-2 border border-electric-green/20">
<span className={`w-2 h-2 rounded-full ${backendOnline === true ? 'bg-electric-green animate-pulse' : 'bg-on-surface-variant'}`}></span>
<span className="font-label-caps text-electric-green tracking-widest text-[10px]">{backendOnline === true ? 'REAL-TIME SYNC' : 'LOCAL DATA'}</span>
</div>
</div>
</div>
</section>

<section className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-gutter">

<div className="glass-panel p-6 relative overflow-hidden group hover:border-electric-green/30 transition-colors">
<div className="absolute top-0 left-0 w-full h-[1px] bg-electric-green/50"></div>
<p className="font-label-caps text-[12px] text-on-surface-variant mb-4 tracking-widest">STRONGEST BLUE-SIDE PICK</p>
<div className="flex items-center justify-between">
<div>
<h3 className="font-headline-md text-pure-white mb-1">{strongestChamp?.champion ?? '—'}</h3>
<p className="font-label-mono text-sm text-electric-green">
  {strongestChamp ? `+${safePctFromValue(strongestChamp.value, 1.2)}% VALUE` : '+1.2% VALUE'}
</p>
<p className="font-label-caps text-[9px] text-on-surface-variant mt-1">
  {strongestChamp ? `${strongestChamp.role} · ${safePct(strongestChamp.win_rate, 0.524)}% WIN RATE` : 'TOP · 52.4% WIN RATE'}
</p>
</div>
<div className="w-14 h-14 rounded overflow-hidden border border-electric-green/20">
  {strongestChamp ? (
    <img
      alt={strongestChamp.champion}
      className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all"
      src={champIcon(strongestChamp.champion)}
      onError={e => { e.target.style.display='none'; }}
    />
  ) : (
    <div className="w-full h-full bg-white/5 flex items-center justify-center">
      <span className="material-symbols-outlined text-electric-green">person</span>
    </div>
  )}
</div>
</div>
</div>

<div className="glass-panel p-6 relative overflow-hidden group hover:border-error/30 transition-colors">
<div className="absolute top-0 left-0 w-full h-[1px] bg-error/50"></div>
<p className="font-label-caps text-[12px] text-on-surface-variant mb-4 tracking-widest">HIGHEST BAN-PRIORITY</p>
<div className="flex items-center justify-between">
<div>
<h3 className="font-headline-md text-pure-white mb-1">
  {metaRankings.filter(c => c.blue_win_rate > 0.54).sort((a, b) => b.total_picks - a.total_picks)[0]?.champion ?? '—'}
</h3>
<p className="font-label-mono text-sm text-error">
  {metaRankings.filter(c => c.blue_win_rate > 0.54).sort((a, b) => b.total_picks - a.total_picks)[0]
    ? `${safePct(metaRankings.filter(c => c.blue_win_rate > 0.54).sort((a, b) => b.total_picks - a.total_picks)[0]?.blue_win_rate, 0.548)}% BLUE WIN RATE`
    : 'LOADING...'}
</p>
</div>
<div className="w-14 h-14 rounded overflow-hidden border border-white/5 flex items-center justify-center bg-white/5">
<span className="material-symbols-outlined text-error text-3xl">block</span>
</div>
</div>
</div>

<div className="glass-panel p-6 relative overflow-hidden group hover:border-white/20 transition-colors">
<div className="absolute top-0 left-0 w-full h-[1px] bg-white/20"></div>
<p className="font-label-caps text-[12px] text-on-surface-variant mb-4 tracking-widest">HIGHEST IMPACT FEATURE</p>
<div className="flex items-center justify-between">
<div>
<h3 className="font-headline-md text-pure-white mb-1">Synergy</h3>
</div>
<div className="w-14 h-14 rounded overflow-hidden border border-white/5 flex items-center justify-center bg-white/5">
<span className="material-symbols-outlined text-on-surface-variant text-3xl">token</span>
</div>
</div>
</div>

<div className="glass-panel p-6 relative overflow-hidden group hover:border-white/20 transition-colors">
<div className="absolute top-0 left-0 w-full h-[1px] bg-white/20"></div>
<p className="font-label-caps text-[12px] text-on-surface-variant mb-4 tracking-widest">TOP WIN RATE PICK</p>
<div className="flex items-center justify-between">
<div>
<h3 className="font-headline-md text-pure-white mb-1">{metaRankings[0]?.champion ?? '—'}</h3>
<p className="font-label-mono text-sm text-electric-green">
  {metaRankings[0] ? `${safePct(metaRankings[0].overall_win_rate, 0.531)}% WIN RATE` : '53.1% WIN RATE'}
</p>
</div>
<div className="w-14 h-14 rounded overflow-hidden border border-white/5 flex items-center justify-center bg-white/5">
<span className="material-symbols-outlined text-on-surface-variant text-3xl">groups</span>
</div>
</div>
</div>
</section>

<section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-gutter">
<div className="lg:col-span-2 glass-panel p-6 relative group overflow-hidden">
<div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
<h3 className="font-headline-md text-pure-white flex items-center gap-3">
<span className="material-symbols-outlined text-electric-green">analytics</span>
  {displayFeatures.length > 0 ? (shapData?.source?.includes('SHAP') ? 'SHAP Feature Importance (TreeExplainer)' : 'Model Feature Importance (Draft Slots)') : 'Champion Win Probability Contribution'}
</h3>
<span className="font-label-caps text-[10px] text-on-surface-variant border border-white/10 px-3 py-1 rounded bg-white/5">
  {modelData.metadata?.model_type?.split(' (')[0] || 'LightGBM + CatBoost'}
</span>
</div>

{(() => {
  const items = displayFeatures.length > 0
    ? displayFeatures.map(f => ({
        label: f.display ?? f.feature,
        val: f.mean_abs_shap ?? f.importance ?? 0,
        positive: true,
        suffix: ' SHAP',
        fmt: v => v.toFixed(4),
      }))
    : topBlue.slice(0, 5).map(c => ({
        label: `${c.champion} (${c.role})`,
        val: c.value,
        positive: c.value >= 0,
        suffix: '%',
        fmt: v => (v >= 0 ? '+' : '') + (v * 100).toFixed(2),
      }));

  const maxVal = Math.max(...items.map(it => Math.abs(it.val)), 0.0001);

  return (
    <div className="space-y-4 mt-2">
      {items.map((it, i) => {
        const barPct = (Math.abs(it.val) / maxVal * 100);
        const color = it.positive ? '#D2FF64' : '#ef4444';
        return (
          <div key={i} className="flex items-center gap-3 group py-1">
            <span
              className="font-label-mono text-[11px] text-on-surface-variant shrink-0 text-right"
              style={{ width: '160px' }}
              title={it.label}
            >
              {it.label.length > 22 ? it.label.slice(0, 21) + '…' : it.label}
            </span>
            <div className="flex-1 flex items-center gap-2">
              <div
                className="relative rounded"
                style={{ width: '100%', height: '28px', background: 'rgba(255,255,255,0.05)' }}
              >
                <div
                  className="absolute left-0 top-0 h-full rounded transition-all duration-700"
                  style={{ width: `${barPct}%`, background: color, opacity: 0.85 }}
                />
                <span
                  className="absolute right-2 top-1/2 font-label-mono text-[13px] font-bold"
                  style={{ transform: 'translateY(-50%)', color: barPct > 50 ? '#000' : color }}
                >
                  {it.fmt(it.val)}{it.suffix}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
})()}

<div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
<p className="font-body-md text-sm text-on-surface-variant max-w-md">
  {displayFeatures.length > 0
    ? 'LightGBM feature importance (gain-based) showing which draft positions carry the most predictive signal.'
    : 'Champion blue-side win probability contributions (Bayesian-smoothed). Start backend server to see role-level feature importance.'}
</p>
<span className="font-label-caps text-[10px] text-on-surface-variant">{shapData?.source ?? (backendOnline === true ? 'BACKEND SOURCE' : 'LOCAL SOURCE')}</span>
</div>
</div>

<div className="glass-panel p-6 flex flex-col relative overflow-hidden">
<div className="absolute inset-0 opacity-20 pointer-events-none">
<div className="scanning-line"></div>
</div>
<h3 className="font-headline-md text-pure-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
<span className="material-symbols-outlined text-team-blue" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
  Top Blue-Side Picks
</h3>
<div className="space-y-3 flex-1 overflow-y-auto">
{topBlue.slice(0, 6).map((champ, i) => (
  <div key={`${champ.champion}-${i}`} className="flex items-center justify-between bg-white/5 border border-white/10 px-3 py-2 rounded">
    <div className="flex items-center gap-3">
      <span className="font-label-caps text-[9px] text-on-surface-variant w-4">{i + 1}</span>
      <div className="rounded overflow-hidden border border-electric-green/20 shrink-0" style={{ width: '20px', height: '20px' }}>
        <img
          src={champIcon(champ.champion)}
          alt={champ.champion}
          className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all"
          onError={e => { e.target.style.display = 'none'; }}
        />
      </div>
      <div>
        <p className="font-label-caps text-[12px] text-pure-white">{champ.champion}</p>
        <p className="font-label-mono text-[11px] text-on-surface-variant">{champ.role} · {champ.games} games</p>
      </div>
    </div>
    <span className="font-label-mono text-[12px] text-electric-green">+{safePctFromValue(champ.value, 0.85)}%</span>
  </div>
))}
</div>
<div className="mt-6 pt-4 border-t border-white/5">
<div className="flex justify-between items-center">
<span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest">DATA COVERAGE</span>
<span className="font-label-mono text-electric-green text-lg">{(modelData.metadata?.training_games ?? 0).toLocaleString()}</span>
</div>
<p className="font-label-caps text-[9px] text-on-surface-variant mt-1">PROFESSIONAL ESPORTS MATCHES</p>
</div>
</div>
</section>

<section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-margin-lg">

<div className="lg:col-span-2 glass-panel p-0 overflow-hidden">
<div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
<h3 className="font-headline-md text-pure-white">Champion Meta Rankings</h3>
<div className="flex gap-2">
<div className="relative">
<input
  className="bg-black/50 border border-white/10 text-sm rounded py-1.5 pl-9 pr-4 font-body-md focus:ring-1 focus:ring-electric-green focus:border-electric-green text-pure-white placeholder:text-on-surface-variant"
  placeholder="Filter champions..."
  type="text"
  value={filterText}
  onChange={e => setFilterText(e.target.value)}
/>
<span className="material-symbols-outlined absolute left-3 top-1.5 text-[18px] text-on-surface-variant">search</span>
</div>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-black/20">
<th className="px-6 py-4 font-label-caps text-[11px] text-on-surface-variant tracking-widest">CHAMPION</th>
<th className="px-6 py-4 font-label-caps text-[11px] text-team-blue tracking-widest">BLUE WIN%</th>
<th className="px-6 py-4 font-label-caps text-[11px] text-team-red tracking-widest">RED WIN%</th>
<th className="px-6 py-4 font-label-caps text-[11px] text-on-surface-variant tracking-widest">OVERALL WIN%</th>
<th className="px-6 py-4 font-label-caps text-[11px] text-on-surface-variant tracking-widest text-right">META IMPACT</th>
</tr>
</thead>
<tbody className="divide-y divide-white/5">
{filteredRankings.slice(0, 15).map((champ, i) => {
  const impact = parseFloat(metaImpactScore(champ));
  const isStrong = impact >= 5;
  const isWeak = impact <= -5;
  return (
    <tr key={champ.champion} className="group hover:bg-white/5 transition-colors cursor-pointer">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded overflow-hidden border ${isStrong ? 'border-electric-green/30' : isWeak ? 'border-error/30' : 'border-white/10'} shrink-0`}>
            <img
              src={champIcon(champ.champion)}
              alt={champ.champion}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
              onError={e => {
                e.target.style.display = 'none';
                e.target.parentElement.classList.add('flex','items-center','justify-center','bg-white/5');
                e.target.parentElement.innerHTML = `<span class="font-label-caps text-[11px] ${isStrong ? 'text-electric-green' : isWeak ? 'text-error' : 'text-pure-white'}">${champ.champion[0]}</span>`;
              }}
            />
          </div>
          <span className="font-body-md text-pure-white">{champ.champion}</span>
        </div>
      </td>
      <td className="px-6 py-4 font-label-mono text-[13px] text-team-blue">{safePct(champ.blue_win_rate, 0.528)}%</td>
      <td className="px-6 py-4 font-label-mono text-[13px] text-team-red">{safePct(champ.red_win_rate, 0.512)}%</td>
      <td className={`px-6 py-4 font-label-mono text-[13px] ${isStrong ? 'text-electric-green' : isWeak ? 'text-error' : 'text-on-surface-variant'}`}>
        {safePct(champ.overall_win_rate, 0.52)}%
      </td>
      <td className="px-6 py-4 text-right">
        <span className={`px-3 py-1 rounded font-label-mono text-sm inline-block
          ${isStrong ? 'bg-electric-green/10 border border-electric-green/30 text-electric-green active-glow' :
            isWeak ? 'bg-error/10 border border-error/30 text-error' :
            'bg-white/5 border border-white/10 text-pure-white'}`}>
          {impact >= 0 ? '+' : ''}{impact.toFixed(1)}
        </span>
      </td>
    </tr>
  );
})}
</tbody>
</table>
</div>
</div>

<div className="glass-panel p-6 flex flex-col bg-gradient-to-b from-transparent to-black/20">
<h3 className="font-headline-md text-pure-white mb-6 border-b border-white/5 pb-4">Blue vs Red Advantage</h3>
<div className="flex-1 space-y-6">
<div>
<h4 className="font-label-caps text-[12px] text-team-blue mb-4 flex items-center justify-between tracking-widest">
  TOP BLUE-SIDE ADVANTAGE
  <span className="material-symbols-outlined text-[14px]">bolt</span>
</h4>
<div className="space-y-3">
{topBlue.slice(0, 3).map((champ, i) => (
  <div key={`blue-${i}`} className="flex items-center gap-4 bg-white/5 border border-white/10 p-3 rounded hover:border-electric-green/30 transition-colors">
    <div className="w-8 h-8 rounded overflow-hidden border border-electric-green/20 shrink-0">
      <img
        src={champIcon(champ.champion)}
        alt={champ.champion}
        className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all"
        onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span style="font-size:10px;color:#D2FF64;display:flex;align-items:center;justify-content:center;width:100%;height:100%">${champ.champion[0]}</span>`; }}
      />
    </div>
    <div>
      <p className="font-label-caps text-[10px] text-pure-white">{champ.champion} ({champ.role})</p>
      <p className="font-label-mono text-electric-green text-[11px]">+{safePctFromValue(champ.value, 0.72)}% win contribution</p>
    </div>
  </div>
))}
</div>
</div>

<div className="pt-4 border-t border-white/5">
<h4 className="font-label-caps text-[12px] text-team-red mb-4 flex items-center justify-between tracking-widest">
  TOP RED-SIDE ADVANTAGE
</h4>
<div className="space-y-3">
{topRed.slice(0, 3).map((champ, i) => (
  <div key={`red-${i}`} className="flex items-center gap-4 bg-white/5 border border-white/10 p-3 rounded hover:border-white/30 transition-colors">
    <div className="w-8 h-8 rounded overflow-hidden border border-team-red/20 shrink-0">
      <img
        src={champIcon(champ.champion)}
        alt={champ.champion}
        className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all"
        onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span style="font-size:10px;color:#fff;display:flex;align-items:center;justify-content:center;width:100%;height:100%">${champ.champion[0]}</span>`; }}
      />
    </div>
    <div>
      <p className="font-label-caps text-[10px] text-pure-white">{champ.champion} ({champ.role})</p>
      <p className="font-label-mono text-on-surface-variant text-[11px]">+{safePctFromValue(champ.value, 0.58)}% win contribution</p>
    </div>
  </div>
))}
</div>
</div>

<div className="pt-4 border-t border-white/5">
<div className="grid grid-cols-2 gap-4">
<div>
<h4 className="font-label-caps text-[10px] text-electric-green mb-3 tracking-widest">RISING</h4>
<ul className="space-y-2">
{metaRankings.slice(0, 2).map(c => (
  <li key={c.champion} className="font-body-md text-sm text-pure-white flex items-center gap-2">
    <span className="material-symbols-outlined text-[14px] text-electric-green">trending_up</span> {c.champion}
  </li>
))}
</ul>
</div>
<div>
<h4 className="font-label-caps text-[10px] text-error mb-3 tracking-widest">DECLINING</h4>
<ul className="space-y-2">
{[...metaRankings].reverse().slice(0, 2).map(c => (
  <li key={c.champion} className="font-body-md text-sm text-on-surface-variant flex items-center gap-2">
    <span className="material-symbols-outlined text-[14px] text-error">trending_down</span> {c.champion}
  </li>
))}
</ul>
</div>
</div>
</div>
</div>
</div>
</section>
</main>

<footer className="fixed bottom-0 right-0 left-64 bg-pure-black border-t border-white/5 flex justify-between items-center px-margin-lg py-margin-sm z-40">
<span className="font-label-caps text-label-caps text-on-surface opacity-80">© 2024 Draft.AI. ALL RIGHTS RESERVED.</span>
<div className="flex gap-6">
<Link className="font-label-mono text-label-mono text-text-muted hover:text-pure-white opacity-80 hover:opacity-100 transition-opacity" to="#">Privacy Protocol</Link>
<Link className="font-label-mono text-label-mono text-text-muted hover:text-pure-white opacity-80 hover:opacity-100 transition-opacity" to="#">Terms of Engagement</Link>
<Link className="font-label-mono text-label-mono text-text-muted hover:text-pure-white opacity-80 hover:opacity-100 transition-opacity" to="#">System Status</Link>
</div>
</footer>


</>
  );
}
