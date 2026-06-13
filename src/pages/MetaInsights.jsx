import React from 'react';
import SideNavBar from '../components/SideNavBar';
import { Link } from 'react-router-dom';

export default function MetaInsights() {
  return (
<>


<SideNavBar />

<header className="fixed top-0 right-0 left-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10 flex justify-between items-center px-gutter h-16 ml-64">
<div className="flex items-center gap-4">
<h2 className="font-headline-md text-headline-md text-pure-white hidden">Aegis Intelligence</h2>
<div className="relative focus-within:ring-1 focus-within:ring-electric-green rounded">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
<input className="bg-white/5 border-none text-pure-white font-label-caps text-label-caps py-2 pl-9 pr-4 rounded focus:ring-0 focus:outline-none w-64 placeholder:text-on-surface-variant" placeholder="Search database..." type="text" />
</div>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center gap-4 font-label-caps text-label-caps">
<span className="text-electric-green">GLOBAL META DATABASE</span>
<span className="text-on-surface-variant">PATCH 14.8.2</span>
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
<h2 className="font-headline-lg text-headline-lg text-pure-white mb-2">Meta Insights</h2>
<p className="font-body-md text-on-surface-variant max-w-2xl">Advanced neural network interpretability layer. Analyzing patch-wide synergies and feature importance using SHAP methodology for elite decision making.</p>
</div>
<div className="flex gap-3">
<div className="glass-panel px-4 py-2 flex items-center gap-2 border border-electric-green/20">
<span className="w-2 h-2 rounded-full bg-electric-green animate-pulse"></span>
<span className="font-label-caps text-electric-green tracking-widest text-[10px]">REAL-TIME SYNC</span>
</div>
</div>
</div>
</section>

<section className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-gutter">

<div className="glass-panel p-6 relative overflow-hidden group hover:border-electric-green/30 transition-colors">
<div className="absolute top-0 left-0 w-full h-[1px] bg-electric-green/50"></div>
<p className="font-label-caps text-[10px] text-on-surface-variant mb-4">STRONGEST CHAMPION</p>
<div className="flex items-center justify-between">
<div>
<h3 className="font-headline-md text-pure-white mb-1">Ahri</h3>
<p className="font-label-mono text-sm text-electric-green">+4.2% IMPACT</p>
</div>
<div className="w-14 h-14 rounded overflow-hidden border border-electric-green/20">
<img alt="Ahri Portrait" className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzYb0l_ALvX3k76TQQkqHOEWqxhbFq5cK9IcY7yi2MRAXSBOtfylkHxcki6EM7KzuDdDJQVKhmlAh7aoanfVlHVdRo7nzMcuA-PBucLcOY14KD8Hjfr-nHUI4b0h8hCmMJEez-glAlY9UeO0HFrnDsEy4E0RWX1Nd976YjZsGPXGWLHrn0ssV7WP37hq4Jg2X-_2Dc0Y6GFee2TF0lcoDmvxQIE4FP5hfCwGxJAxE10y6MtrS0kLH0fC5JwfcYZYRlnAfc3iuZX1v2" />
</div>
</div>
</div>

<div className="glass-panel p-6 relative overflow-hidden group hover:border-error/30 transition-colors">
<div className="absolute top-0 left-0 w-full h-[1px] bg-error/50"></div>
<p className="font-label-caps text-[10px] text-on-surface-variant mb-4">MOST BANNED</p>
<div className="flex items-center justify-between">
<div>
<h3 className="font-headline-md text-pure-white mb-1">Zed</h3>
<p className="font-label-mono text-sm text-error">68.4% RATE</p>
</div>
<div className="w-14 h-14 rounded overflow-hidden border border-white/5 flex items-center justify-center bg-white/5">
<span className="material-symbols-outlined text-error text-3xl">block</span>
</div>
</div>
</div>

<div className="glass-panel p-6 relative overflow-hidden group hover:border-white/20 transition-colors">
<div className="absolute top-0 left-0 w-full h-[1px] bg-white/20"></div>
<p className="font-label-caps text-[10px] text-on-surface-variant mb-4">HIGHEST IMPACT</p>
<div className="flex items-center justify-between">
<div>
<h3 className="font-headline-md text-pure-white mb-1">Dragon Control</h3>
<p className="font-label-mono text-sm text-on-surface-variant">0.72 SHAP VAL</p>
</div>
<div className="w-14 h-14 rounded overflow-hidden border border-white/5 flex items-center justify-center bg-white/5">
<span className="material-symbols-outlined text-on-surface-variant text-3xl">token</span>
</div>
</div>
</div>

<div className="glass-panel p-6 relative overflow-hidden group hover:border-white/20 transition-colors">
<div className="absolute top-0 left-0 w-full h-[1px] bg-white/20"></div>
<p className="font-label-caps text-[10px] text-on-surface-variant mb-4">STRONGEST COMPOSITION</p>
<div className="flex items-center justify-between">
<div>
<h3 className="font-headline-md text-pure-white mb-1">Wombat Combo</h3>
<p className="font-label-mono text-sm text-electric-green">62% WIN RATE</p>
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
                    SHAP Feature Importance
                </h3>
<span className="font-label-caps text-[10px] text-on-surface-variant border border-white/10 px-3 py-1 rounded bg-white/5">MODEL: DRAFT_CORE_V2</span>
</div>
<div className="space-y-6">

<div className="space-y-2">
<div className="flex justify-between font-label-mono text-[12px]">
<span className="text-on-surface">Early Gold Lead (@15m)</span>
<span className="text-electric-green">+0.48</span>
</div>
<div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
<div className="h-full w-[85%] shap-positive rounded-full"></div>
</div>
</div>

<div className="space-y-2">
<div className="flex justify-between font-label-mono text-[12px]">
<span className="text-on-surface">Dragon Control</span>
<span className="text-electric-green">+0.32</span>
</div>
<div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
<div className="h-full w-[65%] shap-positive rounded-full"></div>
</div>
</div>

<div className="space-y-2">
<div className="flex justify-between font-label-mono text-[12px]">
<span className="text-on-surface">Vision Score Gap</span>
<span className="text-electric-green">+0.15</span>
</div>
<div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
<div className="h-full w-[40%] shap-positive rounded-full"></div>
</div>
</div>

<div className="space-y-2">
<div className="flex justify-between font-label-mono text-[12px]">
<span className="text-on-surface">Individual Lane Priority</span>
<span className="text-error">-0.12</span>
</div>
<div className="h-1 w-full bg-surface-container rounded-full flex justify-end">
<div className="h-full w-[25%] shap-negative rounded-full"></div>
</div>
</div>

<div className="space-y-2">
<div className="flex justify-between font-label-mono text-[12px]">
<span className="text-on-surface">Objective Bounty Claim</span>
<span className="text-electric-green">+0.08</span>
</div>
<div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
<div className="h-full w-[15%] shap-positive rounded-full"></div>
</div>
</div>
</div>
<div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
<p className="font-body-md text-sm text-on-surface-variant max-w-md">The SHAP values quantify the contribution of each feature to the winning probability predicted by the model.</p>
<button className="font-label-caps text-electric-green hover:text-pure-white transition-colors tracking-widest text-[10px]">EXPAND DATASET</button>
</div>
</div>

<div className="glass-panel p-6 flex flex-col relative overflow-hidden">
<div className="absolute inset-0 opacity-20 pointer-events-none">
<div className="scanning-line"></div>
</div>
<h3 className="font-headline-md text-pure-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
<span className="material-symbols-outlined text-electric-green">smart_toy</span>
                AI Meta Report
            </h3>
<div className="space-y-6 flex-1">
<div className="bg-white/5 p-5 border-l border-electric-green rounded-r">
<p className="font-body-md text-on-surface italic leading-relaxed text-sm">"The current meta is shifting towards heavy objective control. Early skirmishes are becoming less impactful than sustained map pressure. Recommend prioritizing scaling mid-laners with global presence."</p>
</div>
<div className="space-y-4">
<h4 className="font-label-caps text-[10px] text-electric-green tracking-widest">KEY TRENDS</h4>
<ul className="space-y-3">
<li className="flex items-start gap-3 font-body-md text-sm text-on-surface-variant">
<span className="text-electric-green mt-0.5">↑</span> Tank junglers returning to S-Tier.
                        </li>
<li className="flex items-start gap-3 font-body-md text-sm text-on-surface-variant">
<span className="text-error mt-0.5">↓</span> Lethality builds showing diminishing returns.
                        </li>
<li className="flex items-start gap-3 font-body-md text-sm text-on-surface-variant">
<span className="text-white mt-0.5">→</span> Burst mages stable in high ELO.
                        </li>
</ul>
</div>
</div>
<div className="mt-8 pt-4 border-t border-white/5">
<div className="flex justify-between items-center">
<span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest">STRATEGY CONFIDENCE</span>
<span className="font-label-mono text-electric-green text-lg">94.2%</span>
</div>
</div>
</div>
</section>

<section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-margin-lg">

<div className="lg:col-span-2 glass-panel p-0 overflow-hidden">
<div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
<h3 className="font-headline-md text-pure-white">Champion Meta Rankings</h3>
<div className="flex gap-2">
<div className="relative">
<input className="bg-black/50 border border-white/10 text-sm rounded py-1.5 pl-9 pr-4 font-body-md focus:ring-1 focus:ring-electric-green focus:border-electric-green text-pure-white placeholder:text-on-surface-variant" placeholder="Filter champions..." type="text" />
<span className="material-symbols-outlined absolute left-3 top-1.5 text-[18px] text-on-surface-variant">search</span>
</div>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-black/20">
<th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant tracking-widest">CHAMPION</th>
<th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant tracking-widest">PICK RATE</th>
<th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant tracking-widest">BAN RATE</th>
<th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant tracking-widest">WIN RATE</th>
<th className="px-6 py-4 font-label-caps text-[10px] text-on-surface-variant tracking-widest text-right">META IMPACT</th>
</tr>
</thead>
<tbody className="divide-y divide-white/5">
<tr className="group hover:bg-white/5 transition-colors cursor-pointer">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center font-label-caps text-electric-green">A</div>
<span className="font-body-md text-pure-white">Ahri</span>
</div>
</td>
<td className="px-6 py-4 font-label-mono text-sm text-on-surface-variant">15.4%</td>
<td className="px-6 py-4 font-label-mono text-sm text-on-surface-variant">22.1%</td>
<td className="px-6 py-4 font-label-mono text-sm text-electric-green">54.2%</td>
<td className="px-6 py-4 text-right">
<span className="bg-electric-green/10 border border-electric-green/30 text-electric-green px-3 py-1 rounded font-label-mono text-sm active-glow inline-block">9.8</span>
</td>
</tr>
<tr className="group hover:bg-white/5 transition-colors cursor-pointer">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center font-label-caps text-pure-white">K</div>
<span className="font-body-md text-pure-white">K'Sante</span>
</div>
</td>
<td className="px-6 py-4 font-label-mono text-sm text-on-surface-variant">12.1%</td>
<td className="px-6 py-4 font-label-mono text-sm text-on-surface-variant">45.0%</td>
<td className="px-6 py-4 font-label-mono text-sm text-on-surface-variant">50.8%</td>
<td className="px-6 py-4 text-right">
<span className="bg-white/5 border border-white/10 text-pure-white px-3 py-1 rounded font-label-mono text-sm inline-block">8.4</span>
</td>
</tr>
<tr className="group hover:bg-white/5 transition-colors cursor-pointer">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center font-label-caps text-error">Z</div>
<span className="font-body-md text-pure-white">Zed</span>
</div>
</td>
<td className="px-6 py-4 font-label-mono text-sm text-on-surface-variant">8.9%</td>
<td className="px-6 py-4 font-label-mono text-sm text-on-surface-variant">68.4%</td>
<td className="px-6 py-4 font-label-mono text-sm text-error">47.5%</td>
<td className="px-6 py-4 text-right">
<span className="bg-error/10 border border-error/30 text-error px-3 py-1 rounded font-label-mono text-sm inline-block">7.2</span>
</td>
</tr>
<tr className="group hover:bg-white/5 transition-colors cursor-pointer">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center font-label-caps text-pure-white">L</div>
<span className="font-body-md text-pure-white">Lee Sin</span>
</div>
</td>
<td className="px-6 py-4 font-label-mono text-sm text-on-surface-variant">18.2%</td>
<td className="px-6 py-4 font-label-mono text-sm text-on-surface-variant">15.4%</td>
<td className="px-6 py-4 font-label-mono text-sm text-on-surface-variant">49.1%</td>
<td className="px-6 py-4 text-right">
<span className="bg-white/5 border border-white/10 text-pure-white px-3 py-1 rounded font-label-mono text-sm inline-block">6.9</span>
</td>
</tr>
</tbody>
</table>
</div>
</div>

<div className="glass-panel p-6 flex flex-col bg-gradient-to-b from-transparent to-black/20">
<h3 className="font-headline-md text-pure-white mb-6 border-b border-white/5 pb-4">Composition Analysis</h3>
<div className="flex-1 space-y-8">

<div>
<h4 className="font-label-caps text-[10px] text-electric-green mb-4 flex items-center justify-between tracking-widest">
                        S-TIER SYNERGIES
                        <span className="material-symbols-outlined text-[14px]">bolt</span>
</h4>
<div className="space-y-3">
<div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded hover:border-electric-green/30 transition-colors">
<div className="flex -space-x-3">
<div className="w-10 h-10 rounded border-2 border-surface bg-surface-container overflow-hidden">
<img alt="Champ 1" className="grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKXYT40XODsRstbbNy18irkmqvGQTjaHvcjUxoHebZeNF29hNbfixfAX7tN6I3jpE09OOScPCUINv90JH1xZLK0qN3KoMr4fQQPXEQ_kgL6pnngFoMuNgTHCbQfEAyBgqYFI3Q-l_OMFrnqHZUsZzWhZhaDFQp0dsHOAD7jbN0fLsXgm48GT0F9FD871_r8S275e3mt9oj7aAIXQcV4IwylvnzQJCZg1nUTf--hxdUcUu3ne-ReTnwYFcMwowe-1VF3Vn8lPHHFJdi" />
</div>
<div className="w-10 h-10 rounded border-2 border-surface bg-surface-container overflow-hidden">
<img alt="Champ 2" className="grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCh7UwHeZvKWKmONTbqT6dGfil0kf-Z7YuBqAlmFoThuOlWk4OaZqTiZFllIOpNKeIM_80EIso4hJUT3zk3jYnWSigU8u5W4oH9Kac7Gh49iA00nYkJrDt_Ww61r29rgk7bRXVUXysJ-srorL8l8DnjXuhNR7h8oPp2nQrhlUeRCfJBG3WzfETuREmSwlTCSg0qLDJpPzbuT2_geEEn1I0UJ_ZZ2svmEsaqMlpCvZe8CLIqu8b_TIMfUeooNxkMGIjo8E7f-eIlLhLh" />
</div>
</div>
<div>
<p className="font-label-caps text-[10px] text-pure-white mb-1">THE CC CHAIN</p>
<p className="font-label-mono text-electric-green text-sm">Win Rate: 64.2%</p>
</div>
</div>
<div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded hover:border-white/30 transition-colors">
<div className="flex -space-x-3">
<div className="w-10 h-10 rounded border-2 border-surface bg-surface-container overflow-hidden">
<img alt="Champ 3" className="grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBu5Zsh6tRRZeqZsCDgUspsO-Pm8PMOtCCBGlalvL-yDDnP3u0-B9KRFzUnQLfaKMoiExfcLCdMqzqcY6dc2q6m-HGyB6D7cRQWJ33DQw8p6ttG9y4ZEl2qjraBCbumAZQUEGFHwlpfguU-oGFNJoXwmRPAgwwQ350UWQ1TGMsHb0uo5GOAXp7QPrX504FwbTx8B75srsiNgCdedXpsPFfDfBFiL80tvOV3FJtmQpdaifO5Yf0FtoV5NIOje5m05WOTF98E0u9NxuUd" />
</div>
<div className="w-10 h-10 rounded border-2 border-surface bg-surface-container overflow-hidden">
<img alt="Champ 4" className="grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7gxJmGQqw1aWV0sUbN04pg82O1jvclpCb_vj4zPt0kdSENa7ENeTl0irtBGcKHLZtvjy-EustN2c50Y7buWQeyyxdHEZkjip7mXdbsaWNQfg1o_smWT3QASQmf2zZS8GYg-C8hQjTjwtwmnYtSiMn2R64CMniqa1_4LlHJyUivtPNmMburlUipla809uB10gqJ9bArbC92Pq1e3Lmpy99WugXZi09_2F8R1oWC79VgLSU9WXyOpbaiLROAKGstx6mVu0YdXEKBv0A" />
</div>
</div>
<div>
<p className="font-label-caps text-[10px] text-pure-white mb-1">GLOBAL THREAT</p>
<p className="font-label-mono text-electric-green text-sm">Win Rate: 58.9%</p>
</div>
</div>
</div>
</div>

<div className="pt-6 border-t border-white/5">
<div className="grid grid-cols-2 gap-6">
<div>
<h4 className="font-label-caps text-[10px] text-electric-green mb-3 tracking-widest">RISING</h4>
<ul className="space-y-2">
<li className="font-body-md text-sm text-pure-white flex items-center gap-2">
<span className="material-symbols-outlined text-[14px] text-electric-green">trending_up</span> Jinx
                                </li>
<li className="font-body-md text-sm text-pure-white flex items-center gap-2">
<span className="material-symbols-outlined text-[14px] text-electric-green">trending_up</span> Nautilus
                                </li>
</ul>
</div>
<div>
<h4 className="font-label-caps text-[10px] text-error mb-3 tracking-widest">DECLINING</h4>
<ul className="space-y-2">
<li className="font-body-md text-sm text-on-surface-variant flex items-center gap-2">
<span className="material-symbols-outlined text-[14px] text-error">trending_down</span> Yasuo
                                </li>
<li className="font-body-md text-sm text-on-surface-variant flex items-center gap-2">
<span className="material-symbols-outlined text-[14px] text-error">trending_down</span> Vi
                                </li>
</ul>
</div>
</div>
</div>
</div>
</div>
</section>
</main>

<footer className="fixed bottom-0 right-0 left-64 bg-pure-black border-t border-white/5 flex justify-between items-center px-margin-lg py-margin-sm z-40">
<span className="font-label-caps text-label-caps text-on-surface opacity-80">© 2024 AEGIS INTELLIGENCE. ALL RIGHTS RESERVED.</span>
<div className="flex gap-6">
<Link className="font-label-mono text-label-mono text-text-muted hover:text-pure-white opacity-80 hover:opacity-100 transition-opacity" to="#">Privacy Protocol</Link>
<Link className="font-label-mono text-label-mono text-text-muted hover:text-pure-white opacity-80 hover:opacity-100 transition-opacity" to="#">Terms of Engagement</Link>
<Link className="font-label-mono text-label-mono text-text-muted hover:text-pure-white opacity-80 hover:opacity-100 transition-opacity" to="#">System Status</Link>
</div>
</footer>




</>
  );
}
