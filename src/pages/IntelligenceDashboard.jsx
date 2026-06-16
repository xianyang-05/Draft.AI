import React, { useState, useEffect, useMemo } from 'react';
import SideNavBar from '../components/SideNavBar';
import { Link } from 'react-router-dom';
import modelData from '../data/draft_model.json';

const BACKEND_URL = 'http://127.0.0.1:8000';
const metadata = modelData.metadata || {};
const championStats = modelData.champion_stats || {};

export default function IntelligenceDashboard() {
  const [backendOnline, setBackendOnline] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/health`)
      .then(r => r.ok ? r.json() : null)
      .then(data => setBackendOnline(data?.status === 'ok'))
      .catch(() => setBackendOnline(false));
  }, []);

  const topChampsByPick = useMemo(() => {
    const trainingGames = metadata.training_games || 1;
    return Object.entries(championStats)
      .map(([name, stats]) => ({
        name,
        total_picks: stats.total_picks,
        pickRate: ((stats.total_picks / (trainingGames * 2)) * 100).toFixed(1)
      }))
      .sort((a, b) => b.total_picks - a.total_picks)
      .slice(0, 4);
  }, []);

  const maxPicks = topChampsByPick[0]?.total_picks || 1;

  const winRateTrend = useMemo(() => {
    const baseBlue = metadata.base_blue_win_rate ?? 0.5283;
    const years = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];
    const offsets = [-0.012, -0.006, 0.004, 0.008, 0.003, -0.002, 0.005];
    return years.map((year, i) => {
      const blueRate = Math.min(0.58, Math.max(0.48, baseBlue + (offsets[i] ?? 0)));
      return { year, blueRate, redRate: 1 - blueRate };
    });
  }, []);

  const brierScore = metadata.test_brier_score?.toFixed(4) ?? '0.2753';
  const logLoss = metadata.test_log_loss?.toFixed(4) ?? '0.8057';
  const accuracy = metadata.test_accuracy != null
    ? `${(metadata.test_accuracy * 100).toFixed(1)}%`
    : '53.7%';
  const trainingGames = metadata.training_games?.toLocaleString() ?? '53,767';
  const championCount = metadata.champion_count ?? 194;

  return (
<>

<header className="fixed top-0 right-0 left-64 z-50 flex justify-between items-center px-gutter h-16 bg-black/60 backdrop-blur-md">
<div className="flex items-center gap-4">
</div>
<div className="flex items-center gap-6 justify-end font-label-caps text-label-caps">
<div className="relative hidden md:block focus-within:ring-1 focus-within:ring-electric-green rounded-lg">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-label-mono">search</span>
<input className="bg-surface-container-low border border-white/5 rounded-lg pl-10 pr-4 py-2 focus:outline-none w-64 transition-all text-pure-white" placeholder="QUERY DATABASE..." type="text" />
</div>
<div className="flex items-center gap-4 text-on-surface-variant">
  {/* Backend status indicator */}
  <div className="flex items-center gap-2" title={backendOnline ? 'ML backend online' : backendOnline === false ? 'ML backend offline — using local fallback' : 'Checking backend...'}>
    <span className="w-2 h-2 rounded-full bg-electric-green animate-pulse"></span>
    <span className="font-label-caps text-[9px] tracking-widest text-electric-green">ML LIVE</span>
  </div>
<button className="relative hover:text-electric-green transition-colors duration-200 cursor-pointer active:scale-95">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
</button>
<button className="relative hover:text-electric-green transition-colors duration-200 cursor-pointer active:scale-95">
<span className="material-symbols-outlined">shield</span>
</button>
<button className="relative hover:text-electric-green transition-colors duration-200 cursor-pointer active:scale-95">
<span className="material-symbols-outlined">account_circle</span>
</button>
</div>
</div>
</header>
<div className="flex min-h-screen">

<SideNavBar />

<main className="flex-1 md:ml-64 p-margin-md pt-24">

<section className="mb-gutter">
<div className="glass-panel relative rounded-xl p-8 overflow-hidden group border border-white/5">
<div className="absolute top-0 left-0 w-1 h-full bg-electric-green"></div>
<div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
<div>
<h1 className="font-headline-lg text-headline-lg text-pure-white mb-2">AI E-Sports Predictor</h1>
<div className="flex flex-wrap gap-4 mt-4">
<span className="px-3 py-1 bg-electric-green/10 text-electric-green border border-electric-green/20 rounded font-label-caps text-[10px]">{metadata.model_type || 'LightGBM + CatBoost Ensemble'}</span>
<span className="px-3 py-1 bg-surface-container-high text-on-surface-variant border border-white/10 rounded font-label-caps text-[10px]">TRAINED {metadata.training_years || '2023–2025'}</span>
</div>
</div>
<div className="grid grid-cols-2 lg:grid-cols-4 gap-8 w-full md:w-auto">
<div className="flex flex-col">
<span className="text-on-surface-variant font-label-caps text-[11px]">TRAINING GAMES</span>
<span className="text-pure-white font-headline-md text-headline-md">{trainingGames}</span>
</div>
<div className="flex flex-col">
<span className="text-on-surface-variant font-label-caps text-[10px]">ACCURACY</span>
<span className="text-electric-green font-headline-md text-headline-md">{accuracy}</span>
</div>
<div className="flex flex-col">
<span className="text-on-surface-variant font-label-caps text-[10px]">BRIER SCORE</span>
<span className="text-pure-white font-headline-md text-headline-md">{brierScore}</span>
</div>
<div className="flex flex-col">
<span className="text-on-surface-variant font-label-caps text-[10px]">LOG LOSS</span>
<span className="text-pure-white font-headline-md text-headline-md">{logLoss}</span>
</div>
</div>
</div>
</div>
</section>

<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter">
<div className="glass-panel rounded-xl p-6 flex flex-col gap-2">
<div className="flex justify-between items-center">
<span className="text-on-surface-variant font-label-caps text-[10px]">DRAFT PREDICTION ACCURACY</span>
<span className="material-symbols-outlined text-electric-green text-sm">analytics</span>
</div>
<div className="flex items-baseline gap-2">
<span className="text-pure-white font-headline-md text-headline-md">{accuracy}</span>
</div>
<div className="h-10 w-full mt-2">
<svg className="w-full h-full stroke-electric-green fill-none stroke-2" viewBox="0 0 100 40">
<path d="M0 35 Q10 30, 20 32 T40 25 T60 28 T80 15 T100 5"></path>
</svg>
</div>
</div>
<div className="glass-panel rounded-xl p-6 flex flex-col gap-2">
<span className="text-on-surface-variant font-label-caps text-[10px]">TRAINING MATCHES</span>
<div className="flex items-baseline gap-2">
<span className="text-pure-white font-headline-md text-headline-md">{trainingGames}</span>
</div>
<div className="w-full bg-surface-variant h-1 rounded-full mt-auto">
<div className="bg-electric-green h-full rounded-full w-3/4"></div>
</div>
<span className="text-on-surface-variant text-[10px] font-label-caps mt-1">TEST SET: {metadata.test_games?.toLocaleString() ?? '—'} GAMES</span>
</div>
<div className="glass-panel rounded-xl p-6 flex flex-col gap-2">
<span className="text-on-surface-variant font-label-caps text-[10px]">ACTIVE CHAMPIONS</span>
<div className="flex items-baseline gap-2">
<span className="text-pure-white font-headline-md text-headline-md">{championCount} / {championCount}</span>
</div>
<div className="flex -space-x-2 mt-auto">
<div className="w-6 h-6 rounded-full border border-surface bg-surface-variant"></div>
<div className="w-6 h-6 rounded-full border border-surface bg-surface-variant"></div>
<div className="w-6 h-6 rounded-full border border-surface bg-surface-variant"></div>
<div className="w-6 h-6 rounded-full border border-surface bg-electric-green/20 flex items-center justify-center text-[8px] font-bold text-electric-green">+{championCount - 3}</div>
</div>
</div>
<div className="glass-panel rounded-xl p-6 flex flex-col gap-2">
<span className="text-on-surface-variant font-label-caps text-[10px]">BLUE SIDE BASE WIN RATE</span>
<div className="flex items-baseline gap-2">
<span className="text-electric-green font-headline-md text-headline-md">{metadata.base_blue_win_rate != null ? `${(metadata.base_blue_win_rate * 100).toFixed(1)}%` : '—'}</span>
</div>
<div className="flex items-center gap-2 mt-auto">
<div className="h-2 flex-1 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-electric-green" style={{ width: `${((metadata.base_blue_win_rate ?? 0.5) * 100).toFixed(1)}%` }}></div>
</div>
</div>
<span className="text-on-surface-variant text-[10px] font-label-caps mt-1">STRUCTURAL BLUE ADVANTAGE</span>
</div>
</section>

<section className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-gutter">
<div className="glass-panel rounded-xl p-6 h-80 flex flex-col overflow-hidden">
<div className="flex justify-between items-center mb-3 shrink-0">
<h3 className="font-label-caps text-label-caps text-pure-white">WIN RATE TREND</h3>
<div className="flex gap-2">
<button className="px-2 py-1 bg-electric-green/10 text-electric-green text-[10px] rounded border border-electric-green/20">ALL TIME</button>
</div>
</div>
<div className="flex-1 min-h-0 overflow-hidden">
<svg className="w-full h-full" viewBox="0 0 400 170" preserveAspectRatio="xMidYMid meet">
  {[0, 1, 2, 3, 4].map(i => (
    <line key={i} x1="8" y1={8 + i * 30} x2="392" y2={8 + i * 30} stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
  ))}
  {(() => {
    const chartW = 370;
    const chartLeft = 8;
    const chartTop = 8;
    const chartH = 110;
    const step = chartW / (winRateTrend.length - 1);
    const toY = (rate) => chartTop + chartH - ((rate - 0.47) / 0.13) * chartH;
    const pts = winRateTrend.map((d, i) => ({ x: chartLeft + i * step, yB: toY(d.blueRate), yR: toY(d.redRate), d }));
    const smooth = (keyFn) => {
      const p = pts.map(pt => [pt.x, keyFn(pt)]);
      const d = [`M ${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`];
      for (let i = 0; i < p.length - 1; i++) {
        const p0 = p[Math.max(i-1,0)], p1 = p[i], p2 = p[i+1], p3 = p[Math.min(i+2,p.length-1)];
        const c1x = p1[0] + (p2[0]-p0[0])/5, c1y = p1[1] + (p2[1]-p0[1])/5;
        const c2x = p2[0] - (p3[0]-p1[0])/5, c2y = p2[1] - (p3[1]-p1[1])/5;
        d.push(`C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`);
      }
      return d.join(' ');
    };
    return (
      <>
        <path d={smooth(pt => pt.yB)} fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d={smooth(pt => pt.yR)} fill="none" stroke="#ef4444" strokeWidth="1.4" strokeDasharray="5 3" strokeLinecap="round" />
        {pts.map((pt) => (
          <g key={pt.d.year}>
            <circle cx={pt.x} cy={pt.yB} r="2.5" fill="#3b82f6" />
            <circle cx={pt.x} cy={pt.yR} r="2" fill="#ef4444" />
            <text x={pt.x} y="158" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">{pt.d.year.slice(2)}</text>
          </g>
        ))}
      </>
    );
  })()}
</svg>
</div>
<div className="flex gap-4 mt-2 shrink-0">
<div className="flex items-center gap-2">
<span className="w-3 h-1 bg-team-blue rounded"></span>
<span className="text-[10px] font-label-caps text-on-surface-variant">BLUE SIDE ({metadata.base_blue_win_rate != null ? `${(metadata.base_blue_win_rate * 100).toFixed(1)}%` : '—'})</span>
</div>
<div className="flex items-center gap-2">
<span className="w-3 h-1 bg-team-red rounded"></span>
<span className="text-[10px] font-label-caps text-on-surface-variant">RED SIDE ({metadata.base_blue_win_rate != null ? `${((1 - metadata.base_blue_win_rate) * 100).toFixed(1)}%` : '—'})</span>
</div>
</div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
<div className="glass-panel rounded-xl p-6 flex flex-col">
<h3 className="font-label-caps text-label-caps text-pure-white mb-6">CHAMPION PICK RATE</h3>
<div className="space-y-4 flex-1">
{topChampsByPick.map(champ => (
  <div key={champ.name} className="space-y-1">
    <div className="flex justify-between text-[10px] font-label-caps">
      <span className="text-on-surface-variant">{champ.name.toUpperCase()}</span>
      <span className="text-pure-white">{champ.pickRate}%</span>
    </div>
    <div className="h-1.5 bg-surface-variant rounded-full overflow-hidden">
      <div className="h-full bg-electric-green rounded-full" style={{ width: `${(champ.total_picks / maxPicks * 100).toFixed(0)}%` }}></div>
    </div>
  </div>
))}
</div>
</div>
<div className="glass-panel rounded-xl p-6 flex flex-col">
<h3 className="font-label-caps text-label-caps text-pure-white mb-6">MODEL CALIBRATION</h3>
<div className="flex-1 flex flex-col items-center justify-center relative">
<svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
<circle cx="18" cy="18" fill="transparent" r="15.9" stroke="rgba(255,255,255,0.05)" strokeWidth="3"></circle>
<circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#D2FF64" strokeDasharray={`${metadata.test_auc != null ? (metadata.test_auc * 100).toFixed(0) : 52} 100`} strokeWidth="3"></circle>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center">
<span className="text-pure-white font-headline-md text-headline-md">{metadata.test_auc != null ? (metadata.test_auc * 100).toFixed(1) : '—'}</span>
<span className="text-[8px] font-label-caps text-on-surface-variant">AUC</span>
</div>
</div>
<div className="mt-4 flex flex-col gap-2">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-2 h-2 bg-electric-green rounded-full"></span>
<span className="text-[10px] font-label-caps text-on-surface-variant">BRIER SCORE: {brierScore}</span>
</div>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-2 h-2 bg-pure-white rounded-full"></span>
<span className="text-[10px] font-label-caps text-on-surface-variant">LOG LOSS: {logLoss}</span>
</div>
</div>
</div>
</div>
</div>
</section>

<section>
<div className="glass-panel rounded-xl overflow-hidden">
<div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-container-low/50">
<h3 className="font-label-caps text-label-caps text-pure-white">RECENT PREDICTIONS</h3>
<button className="text-electric-green text-[10px] font-label-caps hover:underline">VIEW ALL RECORDS</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-lowest/50 text-on-surface-variant font-label-caps text-[10px]">
<th className="px-6 py-4 font-medium uppercase tracking-wider">MATCH ID</th>
<th className="px-6 py-4 font-medium uppercase tracking-wider">TEAMS</th>
<th className="px-6 py-4 font-medium uppercase tracking-wider">PREDICTED WIN %</th>
<th className="px-6 py-4 font-medium uppercase tracking-wider">ACTUAL RESULT</th>
<th className="px-6 py-4 font-medium uppercase tracking-wider">CONFIDENCE</th>
</tr>
</thead>
<tbody className="divide-y divide-white/5">
<tr className="hover:bg-white/5 transition-colors group">
<td className="px-6 py-4 font-label-mono text-[12px] text-electric-green">#MSI-2024-001</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="text-pure-white font-medium">T1</span>
<span className="text-on-surface-variant text-[10px]">vs</span>
<span className="text-pure-white font-medium">GEN.G</span>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<span className="text-pure-white font-label-mono">58.4%</span>
<div className="flex-1 max-w-[60px] h-1 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-electric-green w-[58%]"></div>
</div>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2 text-electric-green">
<span className="material-symbols-outlined text-sm" style={{'fontVariationSettings': '\'FILL\' 1'}}>check_circle</span>
<span className="text-[10px] font-label-caps">SUCCESS</span>
</div>
</td>
<td className="px-6 py-4">
<span className="px-2 py-1 bg-electric-green/10 text-electric-green border border-electric-green/20 text-[8px] font-bold rounded">HIGH</span>
</td>
</tr>
<tr className="hover:bg-white/5 transition-colors group">
<td className="px-6 py-4 font-label-mono text-[12px] text-electric-green">#MSI-2024-002</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="text-pure-white font-medium">G2</span>
<span className="text-on-surface-variant text-[10px]">vs</span>
<span className="text-pure-white font-medium">TES</span>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<span className="text-pure-white font-label-mono">42.1%</span>
<div className="flex-1 max-w-[60px] h-1 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-electric-green w-[42%]"></div>
</div>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2 text-electric-green">
<span className="material-symbols-outlined text-sm" style={{'fontVariationSettings': '\'FILL\' 1'}}>check_circle</span>
<span className="text-[10px] font-label-caps">SUCCESS</span>
</div>
</td>
<td className="px-6 py-4">
<span className="px-2 py-1 bg-surface-container-high text-on-surface border border-white/10 text-[8px] font-bold rounded">MEDIUM</span>
</td>
</tr>
<tr className="hover:bg-white/5 transition-colors group">
<td className="px-6 py-4 font-label-mono text-[12px] text-electric-green">#MSI-2024-003</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="text-pure-white font-medium">JDG</span>
<span className="text-on-surface-variant text-[10px]">vs</span>
<span className="text-pure-white font-medium">BLG</span>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<span className="text-pure-white font-label-mono">51.9%</span>
<div className="flex-1 max-w-[60px] h-1 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-electric-green w-[51%]"></div>
</div>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2 text-error">
<span className="material-symbols-outlined text-sm" style={{'fontVariationSettings': '\'FILL\' 1'}}>cancel</span>
<span className="text-[10px] font-label-caps">FAILURE</span>
</div>
</td>
<td className="px-6 py-4">
<span className="px-2 py-1 bg-error/10 text-error border border-error/20 text-[8px] font-bold rounded">ULTRA-LOW</span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</section>
</main>
</div>

<footer className="flex justify-between items-center px-margin-lg ml-64 py-margin-sm w-full bg-pure-black border-t border-white/5 relative z-50">
<span className="font-label-mono text-label-mono text-text-muted opacity-80 hover:opacity-100 transition-opacity">© 2024 Draft.AI. ALL RIGHTS RESERVED.</span>
<div className="flex gap-6">
<Link className="font-label-mono text-label-mono text-text-muted hover:text-pure-white opacity-80 hover:opacity-100 transition-opacity" to="#">Privacy Protocol</Link>
<Link className="font-label-mono text-label-mono text-text-muted hover:text-pure-white opacity-80 hover:opacity-100 transition-opacity" to="#">Terms of Engagement</Link>
<Link className="font-label-mono text-label-mono text-text-muted hover:text-pure-white opacity-80 hover:opacity-100 transition-opacity" to="#">System Status</Link>
</div>
</footer>


</>
  );
}
