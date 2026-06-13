import React from 'react';
import SideNavBar from '../components/SideNavBar';
import { Link } from 'react-router-dom';

export default function MatchAnalysis() {
  return (
<>
<svg className="inline-defs-container" aria-hidden="true" style={{'position': 'absolute', 'width': '0', 'height': '0', 'overflow': 'hidden'}}></svg>
<meta charset="utf-8" />
<meta content="width=device-width, initial-scale=1.0" name="viewport" />
<title>Match Analysis | Aegis Intelligence</title>

<link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&amp;family=Hanken+Grotesk:wght@100..900&amp;display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />





<div className="fixed inset-0 pointer-events-none z-0">
<div className="scanline"></div>
</div>

<SideNavBar />

<main className="flex-1 flex flex-col min-w-0 md:ml-64 relative z-10">

<header className="sticky top-0 z-50 bg-black/60 backdrop-blur-md w-full flex justify-between items-center px-gutter h-16 border-b border-white/10">
<div className="flex items-center gap-6">
<div className="relative group">
<button className="flex items-center gap-2 px-3 py-1.5 glass-panel rounded text-electric-green hover:border-electric-green transition-colors cursor-pointer active:scale-95 focus-within:ring-1 focus-within:ring-electric-green">
<span className="font-label-caps text-label-caps">MATCH ID #48291</span>
<span className="material-symbols-outlined text-[18px]">expand_more</span>
</button>
<div className="absolute top-full left-0 mt-2 w-48 glass-panel rounded hidden group-hover:block overflow-hidden shadow-2xl z-[70]">
<div className="px-3 py-2 hover:bg-white/5 cursor-pointer text-label-caps font-label-caps border-b border-white/10 text-on-surface">MATCH ID #48290</div>
<div className="px-3 py-2 hover:bg-white/5 cursor-pointer text-label-caps font-label-caps text-on-surface">MATCH ID #48289</div>
</div>
</div>
</div>
<div className="flex items-center gap-4">
<button className="text-on-surface-variant hover:text-electric-green transition-all">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="text-on-surface-variant hover:text-electric-green transition-all">
<span className="material-symbols-outlined">shield</span>
</button>
<button className="text-on-surface-variant hover:text-electric-green transition-all">
<span className="material-symbols-outlined">account_circle</span>
</button>
</div>
</header>

<div className="pt-12 pb-12 px-margin-md flex flex-col gap-gutter max-w-[1440px] mx-auto w-full">

<section className="glass-panel header-accent rounded-xl p-margin-md flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
<div className="absolute -right-20 -top-20 w-64 h-64 bg-electric-green/5 blur-3xl rounded-full"></div>

<div className="flex flex-col items-center md:items-start gap-4 z-10 flex-1">
<div className="flex items-center gap-4">
<div className="w-16 h-16 glass-panel rounded-full flex items-center justify-center p-2 border-electric-green">
<img alt="Team Liquid Logo" className="w-full h-full rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzlJxaTsrMUTuVsKQoban63oMbs7hrMNngPhlI7nSd_eeqXUFOZ1D3mKoXFAgwNHHurAyryrBtNGoTA2L-rYx3z_jwmaB2nRMUD0IpaLAzkLWCG9M3dyEd8UrOpaborxrhf4t6KLyk6YYDr48scEJOD9tglqFgspctYSKR_yooX2pH1np7PVn4Nc4Z7ZcUNonohJjEYyTB1p8aT-sOt83phFo_JOH5zHTKJyS3Qii7rLCpl3AvDh6MatDAkUYQ6MXyEt2JZQ21radf" />
</div>
<div>
<h2 className="font-headline-md text-headline-md text-electric-green">Team Liquid</h2>
<span className="font-label-caps text-label-caps text-electric-green bg-electric-green/10 px-2 py-0.5 rounded border border-electric-green/20">WINNER</span>
</div>
</div>
<div className="grid grid-cols-3 gap-4 w-full max-w-xs">
<div className="text-center md:text-left">
<p className="font-label-mono text-[10px] text-on-surface-variant">KILLS</p>
<p className="font-headline-md text-headline-md text-primary">24</p>
</div>
<div className="text-center md:text-left">
<p className="font-label-mono text-[10px] text-on-surface-variant">GOLD</p>
<p className="font-headline-md text-headline-md text-primary">62.4K</p>
</div>
<div className="text-center md:text-left">
<p className="font-label-mono text-[10px] text-on-surface-variant">TOWERS</p>
<p className="font-headline-md text-headline-md text-primary">9</p>
</div>
</div>
</div>

<div className="flex flex-col items-center gap-2 z-10">
<div className="font-label-mono text-label-mono text-on-surface-variant opacity-60">MATCH DURATION</div>
<div className="font-headline-xl text-headline-xl font-bold tracking-widest text-secondary">32:45</div>
<div className="font-label-mono text-label-mono text-on-surface-variant">PATCH 14.10 | LCS-S12</div>
</div>

<div className="flex flex-col items-center md:items-end gap-4 z-10 flex-1">
<div className="flex items-center gap-4 md:flex-row-reverse">
<div className="w-16 h-16 glass-panel rounded-full flex items-center justify-center p-2 border-white/10">
<img alt="T1 Logo" className="w-full h-full rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKAzdMF0V7YnqHhbCEortdnuVXwFFDS226VY4j-sdzds946IXopKA1HEQJcFP5J1g6AHmNOCIVnKHa92A7WCQ3SbClfgQqCGzZgnqUUdfjidH5SEJxt5AullexUWWNk7T93VvPJy1noDYSDP75Ulz2ZLdvGTWs41ByQzzNvlBFFiLzhJD-o0gVN0V7FrPC5wTgiqGIkbAkdi7IWW0rGO8woZgordy0_XWlu95Msfk-BqqzLzjRuwm2bASKm4-nMwCHnMa0lCaSG8fY" />
</div>
<div className="md:text-right">
<h2 className="font-headline-md text-headline-md text-on-surface">T1</h2>
<span className="font-label-mono text-label-mono text-on-surface-variant opacity-50">DEFEAT</span>
</div>
</div>
<div className="grid grid-cols-3 gap-4 w-full max-w-xs md:text-right">
<div>
<p className="font-label-mono text-[10px] text-on-surface-variant">KILLS</p>
<p className="font-headline-md text-headline-md text-primary">11</p>
</div>
<div>
<p className="font-label-mono text-[10px] text-on-surface-variant">GOLD</p>
<p className="font-headline-md text-headline-md text-primary">54.1K</p>
</div>
<div>
<p className="font-label-mono text-[10px] text-on-surface-variant">TOWERS</p>
<p className="font-headline-md text-headline-md text-primary">3</p>
</div>
</div>
</div>
</section>

<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">

<div className="glass-panel p-margin-sm rounded-lg flex flex-col gap-2 relative group overflow-hidden">
<div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
<span className="material-symbols-outlined text-4xl text-electric-green">payments</span>
</div>
<p className="font-label-mono text-label-mono text-on-surface-variant">GOLD DIFFERENCE</p>
<div className="flex items-end gap-2">
<span className="font-headline-md text-headline-md text-electric-green">+8,312</span>
<span className="font-body-md text-electric-green pb-1">▲ 12%</span>
</div>
<div className="w-full h-1 bg-surface-variant rounded-full mt-2 overflow-hidden">
<div className="h-full bg-electric-green" style={{'width': '78%'}}></div>
</div>
</div>

<div className="glass-panel p-margin-sm rounded-lg flex flex-col gap-2 relative group overflow-hidden">
<div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
<span className="material-symbols-outlined text-4xl text-secondary">swords</span>
</div>
<p className="font-label-mono text-label-mono text-on-surface-variant">KDA COMPARISON</p>
<div className="flex items-end gap-2">
<span className="font-headline-md text-headline-md text-secondary">3.41</span>
<span className="font-body-md text-on-surface-variant pb-1">vs 1.82</span>
</div>
<div className="w-full h-1 bg-surface-variant rounded-full mt-2 overflow-hidden flex">
<div className="h-full bg-secondary" style={{'width': '65%'}}></div>
<div className="h-full bg-outline-variant" style={{'width': '35%'}}></div>
</div>
</div>

<div className="glass-panel p-margin-sm rounded-lg flex flex-col gap-2 relative group overflow-hidden">
<div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
<span className="material-symbols-outlined text-4xl text-primary-fixed">trophy</span>
</div>
<p className="font-label-mono text-label-mono text-on-surface-variant">OBJECTIVE CONTROL</p>
<div className="flex items-center gap-4 mt-1">
<div className="flex flex-col items-center">
<span className="material-symbols-outlined text-primary-fixed">brightness_low</span>
<span className="font-body-md text-primary">4/5</span>
</div>
<div className="flex flex-col items-center">
<span className="material-symbols-outlined text-electric-green">fort</span>
<span className="font-body-md text-primary">2/3</span>
</div>
</div>
</div>

<div className="glass-panel p-margin-sm rounded-lg flex flex-col gap-2 relative group overflow-hidden">
<div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
<span className="material-symbols-outlined text-4xl text-electric-green">visibility</span>
</div>
<p className="font-label-mono text-label-mono text-on-surface-variant">VISION SCORE</p>
<div className="flex items-end gap-2">
<span className="font-headline-md text-headline-md text-electric-green">214</span>
<span className="font-body-md text-electric-green/60 pb-1">Wards</span>
</div>
<p className="font-label-mono text-[10px] text-on-surface-variant mt-auto">JUNGLE LEAD: +14%</p>
</div>
</section>

<section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">

<div className="lg:col-span-2 glass-panel rounded-lg p-margin-md flex flex-col gap-4">
<div className="flex justify-between items-center">
<h3 className="font-label-mono text-label-mono text-electric-green flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-electric-green"></span>
                        GOLD OVER TIME
                    </h3>
<div className="flex gap-4">
<span className="font-label-mono text-[10px] text-on-surface-variant flex items-center gap-1">
<span className="w-2 h-0.5 bg-electric-green"></span> TL
                        </span>
<span className="font-label-mono text-[10px] text-on-surface-variant flex items-center gap-1">
<span className="w-2 h-0.5 bg-secondary"></span> T1
                        </span>
</div>
</div>
<div className="h-64 relative mt-4">
<div className="absolute inset-0 flex items-end">
<svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
<defs>
<linearGradient id="goldGrad" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stop-color="#D2FF64" stop-opacity="0.3"></stop>
<stop offset="100%" stop-color="#D2FF64" stop-opacity="0"></stop>
</linearGradient>
</defs>
<path d="M0,80 L50,75 L100,78 L150,60 L200,65 L250,40 L300,30 L350,20 L400,10 L400,100 L0,100 Z" fill="url(#goldGrad)" stroke="#D2FF64" stroke-width="2"></path>
<path d="M0,80 L50,82 L100,85 L150,75 L200,80 L250,70 L300,65 L350,68 L400,75" fill="none" stroke="#c8c6c5" stroke-dasharray="4" stroke-width="1.5"></path>
</svg>
</div>
<div className="absolute bottom-0 left-0 right-0 flex justify-between pt-2 border-t border-white/10">
<span className="font-label-mono text-[8px] text-on-surface-variant">0:00</span>
<span className="font-label-mono text-[8px] text-on-surface-variant">10:00</span>
<span className="font-label-mono text-[8px] text-on-surface-variant">20:00</span>
<span className="font-label-mono text-[8px] text-on-surface-variant">30:00</span>
<span className="font-label-mono text-[8px] text-on-surface-variant">32:45</span>
</div>
</div>
</div>

<div className="lg:col-span-1 glass-panel rounded-lg p-margin-md flex flex-col gap-4">
<h3 className="font-label-mono text-label-mono text-electric-green flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-electric-green"></span>
                    KILL TIMELINE
                </h3>
<div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
<div className="flex items-center gap-3 py-2 border-b border-white/10">
<span className="font-label-mono text-[10px] text-on-surface-variant w-12">24:12</span>
<div className="w-6 h-6 rounded bg-electric-green/20 flex items-center justify-center">
<span className="material-symbols-outlined text-electric-green text-[14px]">bolt</span>
</div>
<div className="flex-1">
<p className="font-body-md text-[12px]"><span className="text-electric-green font-bold">TL CoreJJ</span> killed <span className="text-secondary">T1 Faker</span></p>
<p className="font-label-mono text-[8px] text-on-surface-variant">BARON PIT FIGHT</p>
</div>
</div>
<div className="flex items-center gap-3 py-2 border-b border-white/10">
<span className="font-label-mono text-[10px] text-on-surface-variant w-12">18:45</span>
<div className="w-6 h-6 rounded bg-secondary/20 flex items-center justify-center">
<span className="material-symbols-outlined text-secondary text-[14px]">person</span>
</div>
<div className="flex-1">
<p className="font-body-md text-[12px]"><span className="text-secondary font-bold">T1 Gumayusi</span> killed <span className="text-electric-green">TL Yeon</span></p>
<p className="font-label-mono text-[8px] text-on-surface-variant">BOT GANK</p>
</div>
</div>
<div className="flex items-center gap-3 py-2 opacity-60">
<span className="font-label-mono text-[10px] text-on-surface-variant w-12">12:30</span>
<div className="w-6 h-6 rounded bg-electric-green/20 flex items-center justify-center">
<span className="material-symbols-outlined text-electric-green text-[14px]">bolt</span>
</div>
<div className="flex-1">
<p className="font-body-md text-[12px]"><span className="text-electric-green font-bold">TL APA</span> double kill</p>
<p className="font-label-mono text-[8px] text-on-surface-variant">MIDLANE SKIRMISH</p>
</div>
</div>
</div>
</div>

<div className="lg:col-span-3 glass-panel rounded-lg p-margin-md flex flex-col gap-6 relative overflow-hidden">
<div className="absolute top-0 right-0 px-4 py-2 bg-electric-green/20 rounded-bl-lg font-label-mono text-[10px] text-electric-green animate-pulse">
                    MODEL V2.4 AI ANALYSIS ACTIVE
                </div>
<div className="flex flex-col gap-2 z-10">
<h3 className="font-headline-md text-headline-md text-electric-green">Why the model predicted the outcome</h3>
<p className="font-body-lg text-on-surface-variant max-w-2xl">
                        Our predictive engine identified a 78% win probability for Team Liquid starting at the 18-minute mark. The primary driver was a superior neutral objective control efficiency (+1.2x over T1).
                    </p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-gutter z-10">
<div className="bg-surface-container/50 backdrop-blur-md rounded-lg p-4 border border-white/10 flex gap-4 items-start">
<span className="material-symbols-outlined text-electric-green">priority_high</span>
<div>
<h4 className="font-label-mono text-label-mono text-electric-green mb-1">KEY TURNING POINT</h4>
<p className="font-body-md text-[13px] text-on-surface">The Baron steal at 24:12 shifted win probability from 52% to 84%.</p>
</div>
</div>
<div className="bg-surface-container/50 backdrop-blur-md rounded-lg p-4 border border-white/10 flex gap-4 items-center">
<div className="relative">
<img alt="MVP Player Avatar" className="w-12 h-12 rounded-lg border border-electric-green" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZCBM7WaUp-pnjOwXmAg6yY0Mlfb7BzSLgUVED3T7c6-_AyQOWu2cbdSBMDp_zckLmsUr7bTVGsr-ECOHTCFp7RwOdq2b8AaaRforMYK63imHouf65cHjTeWpZfVdPx9JzmC5tgAQAgKXeOtKFJnGGmT7JeANi2W9hoZ8NmXtvDzpjtRf8BCiN28Qy5JPHFueHNeG9niMGfFApF6VySspG5iGO2jbpq4WdYeyh4CqPxBO8mBsemaaz-cUyzgmUGCYnSWYmL4yLWlgs" />
<span className="absolute -bottom-1 -right-1 bg-electric-green text-pure-black text-[8px] font-bold px-1 rounded">MVP</span>
</div>
<div>
<h4 className="font-label-mono text-label-mono text-electric-green">TL APA (AZIR)</h4>
<p className="font-body-md text-[13px] text-on-surface">8/1/12 | 340 CS</p>
<p className="font-label-mono text-[9px] text-on-surface-variant">SCORE: 9.8/10</p>
</div>
</div>
</div>
</div>
</section>
</div>

<footer className="mt-auto flex justify-between items-center px-margin-lg py-margin-sm w-full bg-pure-black border-t border-white/5">
<div className="font-label-caps text-label-caps text-on-surface">© 2024 AEGIS INTELLIGENCE. ALL RIGHTS RESERVED.</div>
<div className="flex gap-6">
<Link className="font-label-mono text-label-mono text-text-muted hover:text-pure-white transition-opacity opacity-80 hover:opacity-100" to="#">Privacy Protocol</Link>
<Link className="font-label-mono text-label-mono text-text-muted hover:text-pure-white transition-opacity opacity-80 hover:opacity-100" to="#">Terms of Engagement</Link>
<Link className="font-label-mono text-label-mono text-text-muted hover:text-pure-white transition-opacity opacity-80 hover:opacity-100" to="#">System Status</Link>
</div>
</footer>
</main>




</>
  );
}
