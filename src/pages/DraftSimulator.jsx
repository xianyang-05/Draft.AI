import React from 'react';
import SideNavBar from '../components/SideNavBar';
import { Link } from 'react-router-dom';

export default function DraftSimulator() {
  return (
<>


<SideNavBar />

<header className="fixed top-0 right-0 left-0 h-16 bg-black/60 backdrop-blur-md flex justify-between items-center px-gutter z-50 ml-64 border-b border-white/10">
<div className="flex items-center gap-4">
<span className="font-headline-md text-headline-md font-black text-pure-white tracking-tight">Aegis Intelligence</span>
</div>
<div className="flex items-center gap-6 justify-end flex-grow">
<div className="flex items-center gap-4 text-electric-green">
<span className="material-symbols-outlined cursor-pointer hover:text-pure-white transition-all duration-200">notifications</span>
<span className="material-symbols-outlined cursor-pointer hover:text-pure-white transition-all duration-200">shield</span>
<div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden border border-white/15 cursor-pointer active:scale-95 hover:border-electric-green transition-all">
<img alt="Commander Profile Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDeUkqFFhM_dJEFFPEIBSdIc2y8wCIUSuYnu0q95TaR8ZvUgAVT69KU8jDvawr217oPG-vbiuLjYdfzV2TpggZcGDlYVMIgrk4H1tcxwBdgeUxupRRjBXvn37dsgaVKdie36IkSe8dt4iW_8VL052be9DaI0WoDFUyx6pl_WO_wJDb9Zzi6bAnhhUg0PulJTVkHjgp1gBWQ2mdrgxDGF8gTJW3N6aIHckOELNrdQOkaMpybC1rlnKsKV1WrJjTSoMB951xUU7auVw9" />
</div>
</div>
</div>
</header>

<main className="ml-64 pt-16 min-h-screen relative overflow-x-hidden scanline">
<div className="relative z-10 p-8 flex flex-col gap-8">

<div className="grid grid-cols-12 gap-6 items-stretch">

<div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
<div className="flex items-center justify-between border-l-4 border-electric-green pl-4 py-2 bg-electric-green/5 rounded-r">
<span className="font-label-caps text-label-caps text-electric-green font-bold">TEAM BLUE</span>
<span className="font-data-display text-data-display text-electric-green">BLUE_SIDE_A</span>
</div>
<div className="space-y-3">
<div className="glass-panel p-3 flex items-center gap-4 group cursor-pointer hover:bg-electric-green/5 transition-colors border-l-2 border-transparent hover:border-electric-green">
<div className="w-14 h-14 bg-surface-container-high rounded overflow-hidden border border-white/10">
<img alt="Top Portrait" className="w-full h-full grayscale group-hover:grayscale-0 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe8303kgM9LrgNneldyCzLs5hgEW3D57qjkNkNe03MLtm-o1l9Hlwr0oLUnmLvsoE2N_SAjacK9HLmbJ_A6fFmHg5LTLh_cC_fXzes4IMf7bRbmWUYFe0tC4Wz2pZ0HqC18VbrnhAe1mH0VwLM_aP81D3Iu3S3akpAINGwayiaShKwiT4RzYdiVD9bmGdY9OWHIhUsE2Lmo_kIJLodtvIHl7lhel1iwhZh6dOdUmdTm19PBh2tkmzXoL0XZIfK5CqCWArT5dSKnIYG" />
</div>
<div className="flex-grow">
<p className="font-label-caps text-[10px] text-on-surface-variant">TOP</p>
<p className="font-body-md text-on-surface font-bold">ORNITHOPTER</p>
</div>
<span className="material-symbols-outlined text-electric-green/50 group-hover:text-electric-green drop-glow-green">check_circle</span>
</div>
<div className="glass-panel p-3 flex items-center gap-4 group cursor-pointer bg-electric-green/5 transition-colors border-l-2 border-electric-green glow-green">
<div className="w-14 h-14 bg-electric-green/20 rounded overflow-hidden border border-electric-green animate-pulse-glow">
<img alt="Jungle Portrait" className="w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAluIytVJuuzHUjJ8oMcmQTyswLW0MINzhTXa4Ku9cF7NsRsSEx68Isjd31_TxG3iDrM3TGvvaYdLFgZTS5cQFYG3GCF65nxRTn8azAFCf2RMvJ1kiMyRvUCgqi2mIM2aR7sPDju5kTdGXVpfYqbVEHtYff4boI5f3QQhPTzvAgplHwqKNCwLzSJcFC7F0g13_I-_3WIAaXV_t52askQeuaDxUHCwNnHfw0TFHc5EOtGX2zcvGnTGy8eW7TPsR1fW6hlwpt4JVP_AEu" />
</div>
<div className="flex-grow">
<p className="font-label-caps text-[10px] text-electric-green">SELECTING...</p>
<p className="font-body-md text-on-surface italic opacity-50">LOCKED_DRAFT</p>
</div>
</div>
<div className="glass-panel p-3 flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity border-l-2 border-transparent hover:border-electric-green/50">
<div className="w-14 h-14 bg-surface-container-high rounded border border-white/10 flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface-variant">add</span>
</div>
<div className="flex-grow">
<p className="font-label-caps text-[10px] text-on-surface-variant">MID</p>
<p className="font-body-md text-on-surface">EMPTY_SLOT</p>
</div>
</div>
<div className="glass-panel p-3 flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity border-l-2 border-transparent hover:border-electric-green/50">
<div className="w-14 h-14 bg-surface-container-high rounded border border-white/10 flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface-variant">add</span>
</div>
<div className="flex-grow">
<p className="font-label-caps text-[10px] text-on-surface-variant">ADC</p>
<p className="font-body-md text-on-surface">EMPTY_SLOT</p>
</div>
</div>
<div className="glass-panel p-3 flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity border-l-2 border-transparent hover:border-electric-green/50">
<div className="w-14 h-14 bg-surface-container-high rounded border border-white/10 flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface-variant">add</span>
</div>
<div className="flex-grow">
<p className="font-label-caps text-[10px] text-on-surface-variant">SUPPORT</p>
<p className="font-body-md text-on-surface">EMPTY_SLOT</p>
</div>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-4 flex flex-col items-center justify-center py-10 relative">
<div className="relative w-64 h-64 flex flex-col items-center justify-center">
<svg className="w-full h-full transform -rotate-90 drop-glow-green">
<circle className="text-surface-container-high" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" stroke-width="8"></circle>
<circle className="text-electric-green transition-all duration-1000" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" stroke-dasharray="691" stroke-dashoffset="262" stroke-width="8"></circle>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
<p className="font-label-caps text-label-caps text-on-surface-variant mb-1">WIN CHANCE</p>
<h2 className="font-data-display text-6xl text-electric-green font-black drop-glow-green">62%</h2>
<p className="font-label-caps text-[10px] text-electric-green mt-2 tracking-widest">+4.2% ADVANTAGE</p>
</div>
</div>
<div className="w-full mt-10 space-y-4 px-6">
<div className="flex justify-between font-label-caps text-[10px]">
<span className="text-electric-green">TEAM BLUE</span>
<span className="text-secondary">TEAM RED</span>
</div>
<div className="w-full h-2 bg-surface-container rounded-full overflow-hidden flex border border-white/5">
<div className="h-full bg-electric-green transition-all duration-1000 glow-green" style={{'width': '62%'}}></div>
<div className="h-full bg-secondary/50 transition-all duration-1000" style={{'width': '38%'}}></div>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-4 flex flex-col gap-4 text-right">
<div className="flex items-center justify-between border-r-4 border-secondary pr-4 py-2 bg-secondary/5 rounded-l">
<span className="font-data-display text-data-display text-secondary">RED_SIDE_B</span>
<span className="font-label-caps text-label-caps text-secondary font-bold">TEAM RED</span>
</div>
<div className="space-y-3">
<div className="glass-panel p-3 flex flex-row-reverse items-center gap-4 group cursor-pointer hover:bg-secondary/5 transition-colors border-r-2 border-transparent hover:border-secondary">
<div className="w-14 h-14 bg-surface-container-high rounded overflow-hidden border border-white/10">
<img alt="Top Portrait Red" className="w-full h-full grayscale group-hover:grayscale-0 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaegruIFSvwlvc_Ro_ZlHfiSkbamvqE34JRHkW8jhDgPzZENo3mPiwEF06vcRz6GuMBGKWzXZblLPX1IKoNvKGeXZxhmTH7O-ki46Zn5TrmJ4FwOvmOX53ylxAXHbrMzlLrsu-Q9jQ1uK0dF_rGWFNX9e2a8hMHxvv4qA11K87pWtltJR3xFTrNiDTOPke7-y7-6Q2OL6AEeLNgf0wmI1xwxiy_74J3RkaHdEA1Hudj42US93BBnNL0IdY-pRx4dudnUZdRjYrJorq" />
</div>
<div className="flex-grow">
<p className="font-label-caps text-[10px] text-on-surface-variant">TOP</p>
<p className="font-body-md text-on-surface font-bold">MALPH_X</p>
</div>
<span className="material-symbols-outlined text-secondary/50 group-hover:text-secondary">check_circle</span>
</div>
<div className="glass-panel p-3 flex flex-row-reverse items-center gap-4 group cursor-pointer hover:bg-secondary/5 transition-colors border-r-2 border-transparent hover:border-secondary">
<div className="w-14 h-14 bg-surface-container-high rounded overflow-hidden border border-white/10">
<img alt="Jungle Portrait Red" className="w-full h-full grayscale group-hover:grayscale-0 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASB-5S7wRXs4-NYLXtAuu2vIpK3doh12CPdbsuPlk5JVp9_LUI2saFf3OE5lNSlRi_MWMso6k4ytWBXNFDLQXX92XIKGtYWyrmK5dRX33xSO33_vzeXkwQW29lvGbwenVP7TDpSIOfvr5pRTLQqrtxhVoTD0PCNebo2AjlbkGstUNcfqdVHzXHplWRLDhGa_jCCa1GJSPp8MRZORBGjO-zsHB6mL08WYDlsD7tq3mAtDUo6Rw7p6B2dROkiha5l5Xd6TAVgfwygWI7" />
</div>
<div className="flex-grow">
<p className="font-label-caps text-[10px] text-on-surface-variant">JUNGLE</p>
<p className="font-body-md text-on-surface font-bold">VOID_LURKER</p>
</div>
<span className="material-symbols-outlined text-secondary/50 group-hover:text-secondary">check_circle</span>
</div>
<div className="glass-panel p-3 flex flex-row-reverse items-center gap-4 opacity-40 hover:opacity-100 transition-opacity border-r-2 border-transparent hover:border-secondary/50">
<div className="w-14 h-14 bg-surface-container-high rounded border border-white/10 flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface-variant">add</span>
</div>
<div className="flex-grow">
<p className="font-label-caps text-[10px] text-on-surface-variant">MID</p>
<p className="font-body-md text-on-surface">EMPTY_SLOT</p>
</div>
</div>
<div className="glass-panel p-3 flex flex-row-reverse items-center gap-4 opacity-40 hover:opacity-100 transition-opacity border-r-2 border-transparent hover:border-secondary/50">
<div className="w-14 h-14 bg-surface-container-high rounded border border-white/10 flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface-variant">add</span>
</div>
<div className="flex-grow">
<p className="font-label-caps text-[10px] text-on-surface-variant">ADC</p>
<p className="font-body-md text-on-surface">EMPTY_SLOT</p>
</div>
</div>
<div className="glass-panel p-3 flex flex-row-reverse items-center gap-4 opacity-40 hover:opacity-100 transition-opacity border-r-2 border-transparent hover:border-secondary/50">
<div className="w-14 h-14 bg-surface-container-high rounded border border-white/10 flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface-variant">add</span>
</div>
<div className="flex-grow">
<p className="font-label-caps text-[10px] text-on-surface-variant">SUPPORT</p>
<p className="font-body-md text-on-surface">EMPTY_SLOT</p>
</div>
</div>
</div>
</div>
</div>

<div className="glass-panel p-card-padding rounded-xl relative overflow-hidden">
<div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-electric-green via-secondary to-electric-green opacity-50"></div>
<div className="flex items-center gap-2 mb-6">
<span className="material-symbols-outlined text-electric-green" style={{'fontVariationSettings': '\'FILL\' 1'}}>analytics</span>
<h3 className="font-label-caps text-label-caps text-on-surface font-bold">AI DRAFT INTELLIGENCE REPORT</h3>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
<div>
<p className="font-label-caps text-[10px] text-electric-green mb-3 flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-electric-green glow-green"></span> TEAM STRENGTHS
                    </p>
<ul className="space-y-2">
<li className="font-body-sm text-on-surface-variant flex items-start gap-2">
<span className="material-symbols-outlined text-[14px] mt-1 text-electric-green">check</span>
                            Strong front-to-back teamfight potential with Ornithopter.
                        </li>
<li className="font-body-sm text-on-surface-variant flex items-start gap-2">
<span className="material-symbols-outlined text-[14px] mt-1 text-electric-green">check</span>
                            High objective control scaling (Model Alpha).
                        </li>
</ul>
</div>
<div>
<p className="font-label-caps text-[10px] text-data-danger mb-3 flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-data-danger shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span> TEAM WEAKNESSES
                    </p>
<ul className="space-y-2">
<li className="font-body-sm text-on-surface-variant flex items-start gap-2">
<span className="material-symbols-outlined text-[14px] mt-1 text-data-danger">warning</span>
                            Vulnerable to early invade from Void_Lurker.
                        </li>
<li className="font-body-sm text-on-surface-variant flex items-start gap-2">
<span className="material-symbols-outlined text-[14px] mt-1 text-data-danger">warning</span>
                            Lack of magic damage profile in current locks.
                        </li>
</ul>
</div>
<div>
<p className="font-label-caps text-[10px] text-electric-green mb-3">RECOMMENDED PICKS</p>
<div className="flex gap-3">
<div className="w-12 h-12 bg-surface-container rounded border border-electric-green/40 flex items-center justify-center group cursor-pointer hover:border-electric-green transition-all hover:glow-green">
<img alt="Pick 1" className="w-10 h-10 object-cover rounded-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBHhzpbPyLSNk6mM3poTAGFg87oaBb0sf9eajRPUadT1CHaRieMm8h-JcaQ_52kZzKXC0sHZcZhqbYXuz_UWP08cmTG3log1GvL4ep2h3EQMjR3i_owmgEd3daXX-Qzb8Jr7pB4syOsgcVT_fBPH1u5s6d4RyaQ7NBFuazOhqFlcL-Fbo1q8bEKM99vEWSnWlfqa8megTIn8_GQWXgO0y4M1VYTkJu4PZIHI7xEiTWXPlI6seZZF5E6BrhZ-ZV23q97GzhgqR0sQIB" />
</div>
<div className="w-12 h-12 bg-surface-container rounded border border-electric-green/40 flex items-center justify-center group cursor-pointer hover:border-electric-green transition-all hover:glow-green">
<img alt="Pick 2" className="w-10 h-10 object-cover rounded-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP9Ba-nNFk0Xtt8CGCvUeMxIcMOhq1tEYoi6AhyTEo1dJjUTgPyfCBaghUTnybfA5IcYbwFOg-O1tY-39ldn7cioYKHGEjClVw0a4cpbJ_BVbPnnwfvGLi7YWpxNWOZ_LH7xDnXruLV4cQXcdZ26-hfcNCNErdu6VR6BA9Owk2guzPCt17nxrgjHqo5wSmTkNhtZAAUOl0C7IseMaMMUlK16KUIyHIOT7XqfUmiBdzjArnglzySvQsYFZGVR4yM-aTWVlc9v0O-ZEn" />
</div>
<div className="w-12 h-12 bg-surface-container rounded border border-electric-green/40 flex items-center justify-center group cursor-pointer hover:border-electric-green transition-all hover:glow-green">
<img alt="Pick 3" className="w-10 h-10 object-cover rounded-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9YauEYOJEAF2R6fN7Lu2RhXrFpAmURJ2NcuoN9WglOYYSbF3Y5vN7jNzniIpw3dupJH4NPTluOMxFspjlXfTc3BMUy6CVoZnwC3j7iO0LbkBBfXKiXp6DMUh21RL4TAV0rt4iZQwfWlGhlTfjlseoYKh4QZKIB-inKWu5hIrWGOWdRLj0Tvu1UGT-DFGEu9686nygX1Bqc7QBtC5rAIiiz3xJB1270x5H8CNSeQPU4yoHZnrptLvXO_WzB2DlUz0YhP4djwmlV0SL" />
</div>
</div>
</div>
<div>
<p className="font-label-caps text-[10px] text-secondary mb-3">RECOMMENDED BANS</p>
<div className="flex gap-3">
<div className="w-12 h-12 bg-surface-container rounded border border-secondary/40 flex items-center justify-center group cursor-pointer hover:border-secondary transition-all grayscale opacity-60 hover:grayscale-0 hover:opacity-100">
<img alt="Ban 1" className="w-10 h-10 object-cover rounded-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD26OWsvzFd5woKSw71oPFXJ0YUaDUEg3bJR7vn26NvHzRAtaXGtw53LB5D-Ifi2NfSth-Mn-JS9MFYj0xqvtkrhL0CrkZh7wUSnk01dqCmAXGX7IZidRRD32Oio551Ozc-n3BHBwkx3oV7qbP-PlTsmR5ApWnCzPEGrtVxbu0-KBhlVTHvvE3PW5FABDS3mS0b6WvfDKDpGMwexjmNzy4LUfRu_rdCVlkJl3bPWIyV9HQNJdob2AP6pcTGwOffhckTYW-zt9XqICgL" />
</div>
<div className="w-12 h-12 bg-surface-container rounded border border-secondary/40 flex items-center justify-center group cursor-pointer hover:border-secondary transition-all grayscale opacity-60 hover:grayscale-0 hover:opacity-100">
<img alt="Ban 2" className="w-10 h-10 object-cover rounded-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABu-iR0JA3WfOtw0XYnkDl1aXQkwRFEiKwduh98SR-J2bGKg_qzoyC1a03kzBiXsRtwAeEdfF-cZlKPj0zHDKHRnZDuF-WDo7rvBkSm8ko1A3Xl06sGyDOrn0si5-JsulOU5RnT_YKyDEdB80CiFStzBxNVfKF_f7pSpEU6vW4kOc4gOuFe4p7CyHKa6QNUOBM4JHiYmrGmQ3rfeuIce4ZIR7g7JdxzQo_QHy7dvVTHFsqYbLbRr9caaMFANQKnafHJxY-wBxN08rx" />
</div>
</div>
</div>
</div>
</div>

<div className="mt-auto pt-6">
<div className="flex justify-between items-center mb-4">
<h4 className="font-label-mono text-[10px] text-on-surface-variant uppercase">DRAFT SEQUENCE TIMELINE</h4>
<span className="font-label-mono text-[10px] text-electric-green uppercase">PHASE 2: MID-BANS</span>
</div>
<div className="relative h-16 glass-panel rounded flex items-center px-4 gap-4 overflow-x-auto no-scrollbar">
<div className="flex gap-2 border-r border-white/10 pr-4">
<div className="w-10 h-10 bg-secondary/20 border border-secondary/40 rounded flex items-center justify-center text-[10px] font-label-caps text-secondary">BAN</div>
<div className="w-10 h-10 bg-secondary/20 border border-secondary/40 rounded flex items-center justify-center text-[10px] font-label-caps text-secondary">BAN</div>
<div className="w-10 h-10 bg-electric-green/10 border border-electric-green/40 rounded flex items-center justify-center text-[10px] font-label-caps text-electric-green">BAN</div>
</div>
<div className="flex gap-2 border-r border-white/10 pr-4">
<div className="w-10 h-10 bg-electric-green border border-electric-green rounded flex items-center justify-center text-[10px] font-label-caps text-on-primary shadow-[0_0_10px_rgba(210,255,100,0.5)]">PICK</div>
<div className="w-10 h-10 bg-secondary border border-secondary rounded flex items-center justify-center text-[10px] font-label-caps text-on-secondary">PICK</div>
<div className="w-10 h-10 bg-secondary border border-secondary rounded flex items-center justify-center text-[10px] font-label-caps text-on-secondary">PICK</div>
</div>
<div className="flex gap-2 relative">
<div className="w-12 h-12 bg-electric-green/10 border-2 border-electric-green rounded flex flex-col items-center justify-center animate-pulse-glow">
<span className="text-[10px] font-bold text-electric-green">0:18</span>
<div className="absolute -top-6 left-1/2 -translate-x-1/2">
<span className="material-symbols-outlined text-electric-green text-[16px] drop-glow-green">arrow_drop_down</span>
</div>
</div>
<div className="w-10 h-10 bg-surface-container-highest border border-white/10 rounded flex items-center justify-center text-[10px] font-label-caps text-on-surface-variant opacity-50">...</div>
</div>
</div>
</div>
</div>

<footer className="mt-10 border-t border-white/5 py-margin-sm px-margin-lg flex justify-between items-center bg-pure-black w-full ml-64 max-w-[calc(100%-16rem)]">
<span className="font-label-caps text-label-caps text-on-surface">© 2024 AEGIS INTELLIGENCE. ALL RIGHTS RESERVED.</span>
<div className="flex gap-8">
<Link className="font-label-mono text-label-mono text-text-muted hover:text-pure-white opacity-80 hover:opacity-100 transition-opacity" to="#">Privacy Protocol</Link>
<Link className="font-label-mono text-label-mono text-text-muted hover:text-pure-white opacity-80 hover:opacity-100 transition-opacity" to="#">Terms of Engagement</Link>
<Link className="font-label-mono text-label-mono text-text-muted hover:text-pure-white opacity-80 hover:opacity-100 transition-opacity" to="#">System Status</Link>
</div>
</footer>
</main>


</>
  );
}
