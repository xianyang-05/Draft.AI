import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
<>


<nav className="fixed top-0 right-0 left-0 z-50 flex justify-between items-center px-6 h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10">
<div className="flex items-center gap-4">
<span className="font-headline-md text-pure-white font-bold tracking-tight">Aegis Intelligence</span>
</div>
<div className="flex items-center gap-margin-sm">
<span className="material-symbols-outlined text-primary cursor-pointer hover:text-electric-green transition-colors duration-200" data-icon="notifications">notifications</span>
<div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
<img alt="Commander Profile Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD98i6G3bc_lIw7ZarCebmJj2NXlnV5PGY4687wK1sXI6faUQDljoiiE7N0GvSrgbuaUkj0UnHOWRpi_kP4i0Yf8_Nr0ai6AAIHPEc80sngrj1KvFLLv6V9Dl4JjXpBeQqASJPyD-7GLDY4KSqfH_oui24-za0429_DNyrSjAqMw2ZFeFXo31kZmncz4_qGa3WA7fkJnAxmJdIK-D_iyoQXwLKXtEAbQMBiDFoyCua1X4fq9Yx7aBSd65nxqzUH4GPkZfN--MU3ZqED"/>
</div>
</div>
</nav>

<section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden" style={{'backgroundImage': 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(19,19,19,1)), url(\'https://lh3.googleusercontent.com/aida/AP1WRLtqUZZ6rtFKY2zlcKinhWj7SWpOVZDZga2rDT_uWJRpyEYr0TD57uW6h_obF6203iwvS-fX9QwJTXFmy2XIvwULtQ_RLJjy2TVbXgjBugtzTShp6FSywbVpFqwrKAylk96VhcPZv4VfdMJvyR3h8XVa7L0vGVXlU7XBTVvkll-_dyMUi5oqJhnNW57_S7aa_zWjLJp7EKhH3rfN1HAgYqgYuHzUOzJ-W8xzrYF7mL6ZpnlmYmu0bvivlg93\')', 'backgroundSize': 'cover', 'backgroundPosition': 'center'}}>
<canvas id="hero-canvas" style={{'position': 'absolute', 'top': '0', 'left': '0', 'width': '100%', 'height': '100%', 'zIndex': '1', 'opacity': '0.4', 'pointerEvents': 'none'}}></canvas>
<div className="absolute inset-0 bg-gradient-to-b from-pure-black/20 via-transparent to-surface z-[1]"></div>
<div className="relative z-10 px-gutter max-w-container-max mx-auto flex flex-col items-center justify-center text-center">
<div className="flex flex-col items-center text-center">
<span className="font-label-caps text-label-caps text-electric-green mb-margin-sm border border-electric-green/30 px-3 py-1 rounded bg-electric-green/5">SYSTEM ONLINE</span>
<h1 className="font-headline-xl text-headline-xl text-pure-white mb-margin-sm uppercase tracking-tighter">
                    Master the Rift with <br/> Predictive Drafting
                </h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-margin-md">
                    Aegis Intelligence provides elite commanders with an unfair advantage. Leverage our Win Probability Engine and real-time synergy analysis to dominate the champion select phase.
                </p>
<div className="flex flex-col sm:flex-row gap-margin-sm w-full sm:w-auto">
<Link to="/dashboard" className="bg-electric-green text-pure-black font-label-caps text-label-caps px-8 py-4 rounded hover:bg-white transition-all duration-300 font-bold tracking-widest flex items-center justify-center gap-2">
                        SIGN UP <span className="material-symbols-outlined text-sm">arrow_outward</span>
</Link>
<button className="glass-panel text-pure-white font-label-caps text-label-caps px-8 py-4 rounded hover:bg-surface-gray transition-all duration-300 tracking-widest flex items-center justify-center gap-2">
                        WATCH TRAILER <span className="material-symbols-outlined text-sm">play_arrow</span>
</button>
</div>
</div>
</div>
</section>

<section className="py-margin-lg px-gutter max-w-container-max mx-auto relative z-10">
<div className="text-center mb-margin-lg">
<span className="font-label-mono text-label-mono text-text-muted uppercase tracking-widest">/// Systems</span>
<h2 className="font-headline-lg text-headline-lg text-pure-white mt-2">Core Capabilities</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
<div className="glass-panel rounded-lg p-margin-md flex flex-col group">
<span className="material-symbols-outlined text-electric-green text-4xl mb-4 group-hover:scale-110 transition-transform">monitoring</span>
<h3 className="font-headline-md text-headline-md text-pure-white mb-2">Win Probability Engine</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Real-time percentage calculations based on millions of historical matches and current meta.</p>
</div>
<div className="glass-panel rounded-lg p-margin-md flex flex-col group">
<span className="material-symbols-outlined text-electric-green text-4xl mb-4 group-hover:scale-110 transition-transform">hub</span>
<h3 className="font-headline-md text-headline-md text-pure-white mb-2">Live Synergy Analysis</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Instantly identify champion combos and counter-picks as the draft unfolds.</p>
</div>
<div className="glass-panel rounded-lg p-margin-md flex flex-col group">
<span className="material-symbols-outlined text-electric-green text-4xl mb-4 group-hover:scale-110 transition-transform">science</span>
<h3 className="font-headline-md text-headline-md text-pure-white mb-2">Draft Simulator</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Practice against our advanced AI to test strategies before stepping onto the rift.</p>
</div>
</div>
</section>

<section className="py-margin-lg px-gutter max-w-container-max mx-auto relative z-10">
<div className="glass-panel rounded-xl overflow-hidden flex flex-col lg:flex-row border border-white/10">
<div className="p-margin-lg flex-1 flex flex-col justify-center">
<span className="font-label-mono text-label-mono text-electric-green uppercase tracking-widest mb-2 block">/// Data Visualization</span>
<h2 className="font-headline-lg text-headline-lg text-pure-white mb-4">AI Intelligence Report</h2>
<p className="font-body-md text-body-md text-on-surface-variant mb-6">Gain deeper insights into team compositions, power spikes, and objective control metrics before the game even begins.</p>
<ul className="space-y-3 font-label-mono text-label-mono text-text-muted">
<li className="flex items-center gap-2"><span className="material-symbols-outlined text-electric-green text-sm">check_circle</span> Early Game Dominance Matrix</li>
<li className="flex items-center gap-2"><span className="material-symbols-outlined text-electric-green text-sm">check_circle</span> Scaling Threshold Analysis</li>
<li className="flex items-center gap-2"><span className="material-symbols-outlined text-electric-green text-sm">check_circle</span> Damage Type Distribution</li>
</ul>
</div>
<div className="flex-1 bg-surface-container-lowest/50 p-6 flex items-center justify-center relative border-t lg:border-t-0 lg:border-l border-white/5">
<div className="w-full h-full min-h-[300px] border border-white/10 rounded-lg bg-surface flex flex-col p-4 relative z-10 shadow-2xl">
<div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
<span className="font-label-caps text-label-caps text-pure-white">MATCHUP ANALYSIS</span>
<span className="font-label-mono text-label-mono text-electric-green">78.4% WIN RATE</span>
</div>
<div className="flex-1 flex items-end gap-2">
<div className="w-1/6 bg-white/10 h-[30%] rounded-t"></div>
<div className="w-1/6 bg-white/10 h-[50%] rounded-t"></div>
<div className="w-1/6 bg-electric-green/40 h-[80%] rounded-t border-t-2 border-electric-green"></div>
<div className="w-1/6 bg-white/10 h-[40%] rounded-t"></div>
<div className="w-1/6 bg-white/10 h-[60%] rounded-t"></div>
<div className="w-1/6 bg-white/10 h-[20%] rounded-t"></div>
</div>
</div>
</div>
</div>
</section>

<section className="py-margin-lg px-gutter max-w-container-max mx-auto relative z-10">
<div className="flex flex-col md:flex-row justify-between items-end mb-margin-md border-b border-surface-variant pb-unit">
<div>
<span className="font-label-mono text-label-mono text-text-muted uppercase tracking-widest">/// Live Data Feed</span>
<h2 className="font-headline-lg text-headline-lg text-pure-white mt-2">Active Leagues</h2>
</div>
<Link className="font-label-caps text-label-caps text-electric-green hover:text-white transition-colors flex items-center gap-1 mt-4 md:mt-0" to="#">
                VIEW ALL DATA <span className="material-symbols-outlined text-sm">chevron_right</span>
</Link>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
<div className="glass-panel rounded-lg p-margin-sm flex flex-col relative overflow-hidden group">
<div className="absolute top-0 right-0 w-24 h-24 bg-electric-green/10 rounded-bl-full -mr-4 -mt-4 blur-xl transition-all group-hover:bg-electric-green/20"></div>
<h3 className="font-headline-md text-headline-md text-pure-white uppercase mb-1">LCK</h3>
<p className="font-label-mono text-label-mono text-text-muted mb-margin-sm">KOREA REGIONAL</p>
<div className="mt-auto space-y-4">
<div>
<span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Prize Pool</span>
<span className="font-headline-md text-headline-md text-electric-green">$1,500,000</span>
</div>
<div className="flex justify-between items-end">
<div>
<span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Next Match</span>
<span className="font-body-md text-body-md text-pure-white">AUG 24 // 2024</span>
</div>
<span className="material-symbols-outlined text-outline">query_stats</span>
</div>
</div>
</div>
<div className="glass-panel rounded-lg p-margin-sm flex flex-col relative overflow-hidden group">
<div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 blur-xl transition-all group-hover:bg-blue-500/20"></div>
<h3 className="font-headline-md text-headline-md text-pure-white uppercase mb-1">LPL</h3>
<p className="font-label-mono text-label-mono text-text-muted mb-margin-sm">CHINA REGIONAL</p>
<div className="mt-auto space-y-4">
<div>
<span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Prize Pool</span>
<span className="font-headline-md text-headline-md text-pure-white">$2,200,000</span>
</div>
<div className="flex justify-between items-end">
<div>
<span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Next Match</span>
<span className="font-body-md text-body-md text-pure-white">AUG 25 // 2024</span>
</div>
<span className="material-symbols-outlined text-outline">query_stats</span>
</div>
</div>
</div>
<div className="glass-panel rounded-lg p-margin-sm flex flex-col relative overflow-hidden group">
<div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full -mr-4 -mt-4 blur-xl transition-all group-hover:bg-purple-500/20"></div>
<h3 className="font-headline-md text-headline-md text-pure-white uppercase mb-1">LEC</h3>
<p className="font-label-mono text-label-mono text-text-muted mb-margin-sm">EMEA REGIONAL</p>
<div className="mt-auto space-y-4">
<div>
<span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Prize Pool</span>
<span className="font-headline-md text-headline-md text-pure-white">$850,000</span>
</div>
<div className="flex justify-between items-end">
<div>
<span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Next Match</span>
<span className="font-body-md text-body-md text-pure-white">SEP 02 // 2024</span>
</div>
<span className="material-symbols-outlined text-outline">query_stats</span>
</div>
</div>
</div>
<div className="glass-panel rounded-lg p-margin-sm flex flex-col relative overflow-hidden group">
<div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full -mr-4 -mt-4 blur-xl transition-all group-hover:bg-red-500/20"></div>
<h3 className="font-headline-md text-headline-md text-pure-white uppercase mb-1">LCS</h3>
<p className="font-label-mono text-label-mono text-text-muted mb-margin-sm">NA REGIONAL</p>
<div className="mt-auto space-y-4">
<div>
<span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Prize Pool</span>
<span className="font-headline-md text-headline-md text-pure-white">$500,000</span>
</div>
<div className="flex justify-between items-end">
<div>
<span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Next Match</span>
<span className="font-body-md text-body-md text-pure-white">SEP 08 // 2024</span>
</div>
<span className="material-symbols-outlined text-outline">query_stats</span>
</div>
</div>
</div>
</div>
</section>

<section className="py-margin-lg px-gutter max-w-container-max mx-auto relative z-10">
<div className="flex flex-col md:flex-row justify-between items-end mb-margin-md border-b border-surface-variant pb-unit">
<div>
<span className="font-label-mono text-label-mono text-text-muted uppercase tracking-widest">/// Rankings</span>
<h2 className="font-headline-lg text-headline-lg text-pure-white mt-2">Global Leaderboard</h2>
</div>
</div>
<div className="glass-panel rounded-lg overflow-x-auto">
<table className="w-full text-left border-collapse min-w-[600px]">
<thead>
<tr className="border-b border-white/10 bg-white/5 font-label-caps text-label-caps text-on-surface-variant">
<th className="p-4">Rank</th>
<th className="p-4">Commander</th>
<th className="p-4">Win Rate</th>
<th className="p-4">Matches Analyzed</th>
</tr>
</thead>
<tbody className="font-label-mono text-label-mono text-pure-white">
<tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
<td className="p-4 text-electric-green">#1</td>
<td className="p-4 flex items-center gap-2">
<div className="w-6 h-6 rounded-full bg-electric-green/20 border border-electric-green flex items-center justify-center text-xs">F</div>
                            Faker_Clone
                        </td>
<td className="p-4 text-electric-green">68.2%</td>
<td className="p-4">1,402</td>
</tr>
<tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
<td className="p-4 text-white/80">#2</td>
<td className="p-4 flex items-center gap-2">
<div className="w-6 h-6 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-xs">D</div>
                            DraftKing99
                        </td>
<td className="p-4">65.8%</td>
<td className="p-4">984</td>
</tr>
<tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
<td className="p-4 text-white/60">#3</td>
<td className="p-4 flex items-center gap-2">
<div className="w-6 h-6 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-xs">S</div>
                            Synergy_Bot
                        </td>
<td className="p-4">64.1%</td>
<td className="p-4">2,105</td>
</tr>
</tbody>
</table>
</div>
</section>

<section className="py-margin-lg px-gutter max-w-container-max mx-auto mb-margin-lg relative z-10">
<div className="glass-panel rounded-xl p-margin-lg text-center relative overflow-hidden">
<div className="absolute inset-0 bg-electric-green/5 blur-3xl"></div>
<div className="relative z-10 max-w-2xl mx-auto">
<h2 className="font-headline-xl text-headline-xl text-pure-white mb-4 uppercase">Join the Elite</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant mb-8">Stop guessing. Start drafting with intelligence. Gain access to the Aegis platform and elevate your game today.</p>
<div className="flex flex-col sm:flex-row gap-4 justify-center">
<input className="bg-surface-container-highest border border-white/20 rounded px-4 py-3 font-label-mono text-pure-white focus:outline-none focus:border-electric-green w-full sm:w-64" placeholder="ENTER COMM LINK (EMAIL)" type="email"/>
<Link to="/dashboard" className="bg-electric-green text-pure-black font-label-caps text-label-caps px-8 py-3 rounded hover:bg-white transition-all duration-300 font-bold tracking-widest flex items-center justify-center">
                        INITIALIZE <span className="material-symbols-outlined text-sm ml-2">chevron_right</span>
</Link>
</div>
</div>
</div>
</section>

<footer className="flex flex-col sm:flex-row justify-between items-center px-container-margin py-8 w-full bg-surface-container-lowest border-t border-white/5 gap-4 px-gutter relative z-10">
<span className="font-label-caps text-label-caps text-on-surface-variant text-center sm:text-left">© 2024 AEGIS INTELLIGENCE</span>
<div className="flex flex-col sm:flex-row gap-margin-sm items-center">
<span className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-electric-green animate-pulse"></span> System Operational
            </span>
<span className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Model: V2.4.0-Alpha</span>
</div>
</footer>


</>
  );
}
