import React from 'react';
import SideNavBar from '../components/SideNavBar';
import { Link } from 'react-router-dom';

export default function IntelligenceDashboard() {
  return (
<>


<header className="fixed top-0 right-0 left-64 z-50 flex justify-between items-center px-gutter h-16 bg-black/60 backdrop-blur-md">
<div className="flex items-center gap-4">
<span className="font-headline-md text-headline-md text-pure-white tracking-tight">Aegis Intelligence</span>
</div>
<div className="flex items-center gap-6 justify-end font-label-caps text-label-caps">
<div className="relative hidden md:block focus-within:ring-1 focus-within:ring-electric-green rounded-lg">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-label-mono">search</span>
<input className="bg-surface-container-low border border-white/5 rounded-lg pl-10 pr-4 py-2 focus:outline-none w-64 transition-all text-pure-white" placeholder="QUERY DATABASE..." type="text" />
</div>
<div className="flex items-center gap-4 text-on-surface-variant hover:text-electric-green transition-all">
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
<span className="px-3 py-1 bg-electric-green/10 text-electric-green border border-electric-green/20 rounded font-label-caps text-[10px]">PATCH 14.10</span>
<span className="px-3 py-1 bg-surface-container-high text-on-surface-variant border border-white/10 rounded font-label-caps text-[10px]">NEURAL ENGINE ACTIVE</span>
</div>
</div>
<div className="grid grid-cols-2 lg:grid-cols-4 gap-8 w-full md:w-auto">
<div className="flex flex-col">
<span className="text-on-surface-variant font-label-caps text-[10px]">TOTAL MATCHES</span>
<span className="text-pure-white font-headline-md text-headline-md">1.2M</span>
</div>
<div className="flex flex-col">
<span className="text-on-surface-variant font-label-caps text-[10px]">ACCURACY</span>
<span className="text-electric-green font-headline-md text-headline-md">84.2%</span>
</div>
<div className="flex flex-col">
<span className="text-on-surface-variant font-label-caps text-[10px]">BRIER SCORE</span>
<span className="text-pure-white font-headline-md text-headline-md">0.18</span>
</div>
<div className="flex flex-col">
<span className="text-on-surface-variant font-label-caps text-[10px]">LOG LOSS</span>
<span className="text-pure-white font-headline-md text-headline-md">0.42</span>
</div>
</div>
</div>
</div>
</section>

<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter">
<div className="glass-panel rounded-xl p-6 flex flex-col gap-2">
<div className="flex justify-between items-center">
<span className="text-on-surface-variant font-label-caps text-[10px]">PREDICTION ACCURACY</span>
<span className="material-symbols-outlined text-electric-green text-sm">trending_up</span>
</div>
<div className="flex items-baseline gap-2">
<span className="text-pure-white font-headline-md text-headline-md">84.2%</span>
<span className="text-electric-green text-[10px] font-label-caps">+1.4%</span>
</div>
<div className="h-10 w-full mt-2">
<svg className="w-full h-full stroke-electric-green fill-none stroke-2" viewBox="0 0 100 40">
<path d="M0 35 Q10 30, 20 32 T40 25 T60 28 T80 15 T100 5"></path>
</svg>
</div>
</div>
<div className="glass-panel rounded-xl p-6 flex flex-col gap-2">
<span className="text-on-surface-variant font-label-caps text-[10px]">TOTAL MATCHES</span>
<div className="flex items-baseline gap-2">
<span className="text-pure-white font-headline-md text-headline-md">1,248,012</span>
</div>
<div className="w-full bg-surface-variant h-1 rounded-full mt-auto">
<div className="bg-electric-green h-full rounded-full w-3/4"></div>
</div>
<span className="text-on-surface-variant text-[10px] font-label-caps mt-1">PROCESSED TODAY: 12,402</span>
</div>
<div className="glass-panel rounded-xl p-6 flex flex-col gap-2">
<span className="text-on-surface-variant font-label-caps text-[10px]">ACTIVE CHAMPIONS</span>
<div className="flex items-baseline gap-2">
<span className="text-pure-white font-headline-md text-headline-md">168 / 168</span>
</div>
<div className="flex -space-x-2 mt-auto">
<div className="w-6 h-6 rounded-full border border-surface bg-surface-variant"></div>
<div className="w-6 h-6 rounded-full border border-surface bg-surface-variant"></div>
<div className="w-6 h-6 rounded-full border border-surface bg-surface-variant"></div>
<div className="w-6 h-6 rounded-full border border-surface bg-electric-green/20 flex items-center justify-center text-[8px] font-bold text-electric-green">+165</div>
</div>
</div>
<div className="glass-panel rounded-xl p-6 flex flex-col gap-2">
<span className="text-on-surface-variant font-label-caps text-[10px]">CURRENT META SCORE</span>
<div className="flex items-baseline gap-2">
<span className="text-electric-green font-headline-md text-headline-md">94.8</span>
</div>
<div className="flex items-center gap-2 mt-auto">
<div className="h-2 flex-1 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-electric-green w-[94.8%]"></div>
</div>
</div>
<span className="text-on-surface-variant text-[10px] font-label-caps mt-1">VOLATILITY: LOW</span>
</div>
</section>

<section className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-gutter">
<div className="glass-panel rounded-xl p-6 h-80 flex flex-col">
<div className="flex justify-between items-center mb-6">
<h3 className="font-label-caps text-label-caps text-pure-white">WIN RATE TREND</h3>
<div className="flex gap-2">
<button className="px-2 py-1 bg-electric-green/10 text-electric-green text-[10px] rounded border border-electric-green/20">24H</button>
<button className="px-2 py-1 text-on-surface-variant text-[10px] rounded hover:bg-white/5 border border-transparent">7D</button>
</div>
</div>
<div className="flex-1 relative">
<div className="absolute bottom-4 left-4 flex gap-4">
<div className="flex items-center gap-2">
<span className="w-3 h-1 bg-electric-green rounded"></span>
<span className="text-[10px] font-label-caps text-on-surface-variant">BLUE SIDE</span>
</div>
<div className="flex items-center gap-2">
<span className="w-3 h-1 bg-pure-white rounded"></span>
<span className="text-[10px] font-label-caps text-on-surface-variant">RED SIDE</span>
</div>
</div>
</div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
<div className="glass-panel rounded-xl p-6 flex flex-col">
<h3 className="font-label-caps text-label-caps text-pure-white mb-6">CHAMPION PICK RATE</h3>
<div className="space-y-4 flex-1">
<div className="space-y-1">
<div className="flex justify-between text-[10px] font-label-caps">
<span className="text-on-surface-variant">LEE SIN</span>
<span className="text-pure-white">42.4%</span>
</div>
<div className="h-1.5 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-electric-green w-[42.4%]"></div>
</div>
</div>
<div className="space-y-1">
<div className="flex justify-between text-[10px] font-label-caps">
<span className="text-on-surface-variant">EZREAL</span>
<span className="text-pure-white">38.1%</span>
</div>
<div className="h-1.5 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-electric-green w-[38.1%]"></div>
</div>
</div>
<div className="space-y-1">
<div className="flex justify-between text-[10px] font-label-caps">
<span className="text-on-surface-variant">THRESH</span>
<span className="text-pure-white">29.8%</span>
</div>
<div className="h-1.5 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-electric-green w-[29.8%]"></div>
</div>
</div>
<div className="space-y-1">
<div className="flex justify-between text-[10px] font-label-caps">
<span className="text-on-surface-variant">LEONA</span>
<span className="text-pure-white">22.1%</span>
</div>
<div className="h-1.5 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-electric-green w-[22.1%]"></div>
</div>
</div>
</div>
</div>
<div className="glass-panel rounded-xl p-6 flex flex-col">
<h3 className="font-label-caps text-label-caps text-pure-white mb-6">MATCH OUTCOME</h3>
<div className="flex-1 flex flex-col items-center justify-center relative">
<svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
<circle cx="18" cy="18" fill="transparent" r="15.9" stroke="rgba(255,255,255,0.05)" stroke-width="3"></circle>
<circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#D2FF64" stroke-dasharray="65 100" stroke-width="3"></circle>
<circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#FFFFFF" stroke-dasharray="25 100" stroke-dashoffset="-65" stroke-width="3"></circle>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center">
<span className="text-pure-white font-headline-md text-headline-md">92%</span>
<span className="text-[8px] font-label-caps text-on-surface-variant">CERTAINTY</span>
</div>
</div>
<div className="mt-4 flex flex-col gap-2">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-2 h-2 bg-electric-green rounded-full"></span>
<span className="text-[10px] font-label-caps text-on-surface-variant">STOMP (65%)</span>
</div>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-2 h-2 bg-pure-white rounded-full"></span>
<span className="text-[10px] font-label-caps text-on-surface-variant">CLOSE (25%)</span>
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
<span className="font-label-mono text-label-mono text-text-muted opacity-80 hover:opacity-100 transition-opacity">© 2024 AEGIS INTELLIGENCE. ALL RIGHTS RESERVED.</span>
<div className="flex gap-6">
<Link className="font-label-mono text-label-mono text-text-muted hover:text-pure-white opacity-80 hover:opacity-100 transition-opacity" to="#">Privacy Protocol</Link>
<Link className="font-label-mono text-label-mono text-text-muted hover:text-pure-white opacity-80 hover:opacity-100 transition-opacity" to="#">Terms of Engagement</Link>
<Link className="font-label-mono text-label-mono text-text-muted hover:text-pure-white opacity-80 hover:opacity-100 transition-opacity" to="#">System Status</Link>
</div>
</footer>


</>
  );
}
