import React, { useState, useEffect, useRef } from 'react';
import SideNavBar from '../components/SideNavBar';
import { Link } from 'react-router-dom';

const MATCHES = {
  '#48291': {
    id: '#48291',
    blue: { name: 'Team Liquid', shortName: 'TL', kills: 24, gold: '62.4K', towers: 9, result: 'WINNER' },
    red: { name: 'T1', shortName: 'T1', kills: 11, gold: '54.1K', towers: 3, result: 'DEFEAT' },
    duration: '32:45',
    patch: '14.10 | LCS-S12',
    goldDiffs: [0, -0.5, -1.1, -0.3, 1.2, 2.4, 3.6, 5.1, 6.4, 7.8],
    maxK: 8,
    timeLabels: ['0:00', '05:00', '12:00', '22:00', '32:45'],
    goldDiff: '+8,312',
    goldPct: 78,
    kdaBlue: '3.41',
    kdaRed: '1.82',
    kdaPct: 65,
    drakes: '4/5',
    barons: '2/3',
    visionScore: 214,
    jungleLead: '+14%',
    kills: [
      { time: '24:12', killer: 'TL CoreJJ', victim: 'T1 Faker', event: 'BARON PIT FIGHT', side: 'blue' },
      { time: '18:45', killer: 'T1 Gumayusi', victim: 'TL Yeon', event: 'BOT GANK', side: 'red' },
      { time: '12:30', killer: 'TL APA', victim: null, event: 'MIDLANE SKIRMISH (2x)', side: 'blue' },
    ],
    mvp: { name: 'TL APA (AZIR)', score: '8/1/12 | 340 CS', rating: '9.8/10' },
    prediction: { prob: 78, marker: '18-min mark', driver: 'superior neutral objective control efficiency (+1.2x over T1)', turning: 'Baron steal at 24:12 shifted win probability from 52% to 84%.' },
    blueLegend: 'TL (Blue)',
    redLegend: 'T1 (Red)',
    blueLogoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzlJxaTsrMUTuVsKQoban63oMbs7hrMNngPhlI7nSd_eeqXUFOZ1D3mKoXFAgwNHHurAyryrBtNGoTA2L-rYx3z_jwmaB2nRMUD0IpaLAzkLWCG9M3dyEd8UrOpaborxrhf4t6KLyk6YYDr48scEJOD9tglqFgspctYSKR_yooX2pH1np7PVn4Nc4Z7ZcUNonohJjEYyTB1p8aT-sOt83phFo_JOH5zHTKJyS3Qii7rLCpl3AvDh6MatDAkUYQ6MXyEt2JZQ21radf',
    redLogoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKAzdMF0V7YnqHhbCEortdnuVXwFFDS226VY4j-sdzds946IXopKA1HEQJcFP5J1g6AHmNOCIVnKHa92A7WCQ3SbClfgQqCGzZgnqUUdfjidH5SEJxt5AullexUWWNk7T93VvPJy1noDYSDP75Ulz2ZLdvGTWs41ByQzzNvlBFFiLzhJD-o0gVN0V7FrPC5wTgiqGIkbAkdi7IWW0rGO8woZgordy0_XWlu95Msfk-BqqzLzjRuwm2bASKm4-nMwCHnMa0lCaSG8fY',
    mvpImgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZCBM7WaUp-pnjOwXmAg6yY0Mlfb7BzSLgUVED3T7c6-_AyQOWu2cbdSBMDp_zckLmsUr7bTVGsr-ECOHTCFp7RwOdq2b8AaaRforMYK63imHouf65cHjTeWpZfVdPx9JzmC5tgAQAgKXeOtKFJnGGmT7JeANi2W9hoZ8NmXtvDzpjtRf8BCiN28Qy5JPHFueHNeG9niMGfFApF6VySspG5iGO2jbpq4WdYeyh4CqPxBO8mBsemaaz-cUyzgmUGCYnSWYmL4yLWlgs',
  },
  '#48290': {
    id: '#48290',
    blue: { name: 'G2 Esports', shortName: 'G2', kills: 18, gold: '58.2K', towers: 7, result: 'WINNER' },
    red: { name: 'Cloud9', shortName: 'C9', kills: 14, gold: '55.7K', towers: 5, result: 'DEFEAT' },
    duration: '38:22',
    patch: '14.10 | LCS-S12',
    goldDiffs: [0, 0.3, 0.6, -0.2, -1.4, -0.5, 0.8, 2.1, 3.5, 4.9],
    maxK: 6,
    timeLabels: ['0:00', '05:00', '13:00', '26:00', '38:22'],
    goldDiff: '+2,489',
    goldPct: 52,
    kdaBlue: '2.88',
    kdaRed: '2.14',
    kdaPct: 57,
    drakes: '3/5',
    barons: '1/2',
    visionScore: 189,
    jungleLead: '+6%',
    kills: [
      { time: '31:05', killer: 'G2 Caps', victim: 'C9 Blaber', event: 'MID DIVE', side: 'blue' },
      { time: '22:18', killer: 'C9 Fudge', victim: 'G2 BrokenBlade', event: 'TOP FIGHT', side: 'red' },
      { time: '09:41', killer: 'G2 Yike', victim: 'C9 Blaber', event: 'EARLY SCUTTLE', side: 'blue' },
    ],
    mvp: { name: 'G2 CAPS (Viktor)', score: '7/2/9 | 295 CS', rating: '9.1/10' },
    prediction: { prob: 65, marker: '25-min mark', driver: 'superior mid-lane pressure and vision control', turning: 'Dragon soul secured at 31:05 shifted win probability from 52% to 88%.' },
    blueLegend: 'G2 (Blue)',
    redLegend: 'C9 (Red)',
    blueLogoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzlJxaTsrMUTuVsKQoban63oMbs7hrMNngPhlI7nSd_eeqXUFOZ1D3mKoXFAgwNHHurAyryrBtNGoTA2L-rYx3z_jwmaB2nRMUD0IpaLAzkLWCG9M3dyEd8UrOpaborxrhf4t6KLyk6YYDr48scEJOD9tglqFgspctYSKR_yooX2pH1np7PVn4Nc4Z7ZcUNonohJjEYyTB1p8aT-sOt83phFo_JOH5zHTKJyS3Qii7rLCpl3AvDh6MatDAkUYQ6MXyEt2JZQ21radf',
    redLogoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKAzdMF0V7YnqHhbCEortdnuVXwFFDS226VY4j-sdzds946IXopKA1HEQJcFP5J1g6AHmNOCIVnKHa92A7WCQ3SbClfgQqCGzZgnqUUdfjidH5SEJxt5AullexUWWNk7T93VvPJy1noDYSDP75Ulz2ZLdvGTWs41ByQzzNvlBFFiLzhJD-o0gVN0V7FrPC5wTgiqGIkbAkdi7IWW0rGO8woZgordy0_XWlu95Msfk-BqqzLzjRuwm2bASKm4-nMwCHnMa0lCaSG8fY',
    mvpImgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZCBM7WaUp-pnjOwXmAg6yY0Mlfb7BzSLgUVED3T7c6-_AyQOWu2cbdSBMDp_zckLmsUr7bTVGsr-ECOHTCFp7RwOdq2b8AaaRforMYK63imHouf65cHjTeWpZfVdPx9JzmC5tgAQAgKXeOtKFJnGGmT7JeANi2W9hoZ8NmXtvDzpjtRf8BCiN28Qy5JPHFueHNeG9niMGfFApF6VySspG5iGO2jbpq4WdYeyh4CqPxBO8mBsemaaz-cUyzgmUGCYnSWYmL4yLWlgs',
  },
  '#48289': {
    id: '#48289',
    blue: { name: 'T1', shortName: 'T1', kills: 29, gold: '71.1K', towers: 11, result: 'WINNER' },
    red: { name: 'JDG', shortName: 'JDG', kills: 9, gold: '52.3K', towers: 1, result: 'DEFEAT' },
    duration: '27:11',
    patch: '14.09 | WC2024',
    goldDiffs: [0, 1.2, 3.1, 5.4, 8.2, 11.6, 14.9, 17.3, 19.1, 18.8],
    maxK: 20,
    timeLabels: ['0:00', '03:00', '08:00', '18:00', '27:11'],
    goldDiff: '+18,842',
    goldPct: 98,
    kdaBlue: '8.50',
    kdaRed: '0.90',
    kdaPct: 90,
    drakes: '5/5',
    barons: '2/2',
    visionScore: 261,
    jungleLead: '+38%',
    kills: [
      { time: '08:44', killer: 'T1 Faker', victim: 'JDG Ruler', event: 'ROAM KILL', side: 'blue' },
      { time: '14:22', killer: 'T1 Zeus', victim: 'JDG 369', event: 'TOP DIVE', side: 'blue' },
      { time: '20:05', killer: 'T1 Gumayusi', victim: 'JDG Kanavi', event: 'ACE (5v5)', side: 'blue' },
    ],
    mvp: { name: 'T1 FAKER (Azir)', score: '12/0/8 | 380 CS', rating: '10.0/10' },
    prediction: { prob: 91, marker: '10-min mark', driver: 'dominant early gold advantage and perfect objective control', turning: 'First blood + early drake at 8:44 set a 55%→91% trajectory.' },
    blueLegend: 'T1 (Blue)',
    redLegend: 'JDG (Red)',
    blueLogoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKAzdMF0V7YnqHhbCEortdnuVXwFFDS226VY4j-sdzds946IXopKA1HEQJcFP5J1g6AHmNOCIVnKHa92A7WCQ3SbClfgQqCGzZgnqUUdfjidH5SEJxt5AullexUWWNk7T93VvPJy1noDYSDP75Ulz2ZLdvGTWs41ByQzzNvlBFFiLzhJD-o0gVN0V7FrPC5wTgiqGIkbAkdi7IWW0rGO8woZgordy0_XWlu95Msfk-BqqzLzjRuwm2bASKm4-nMwCHnMa0lCaSG8fY',
    redLogoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzlJxaTsrMUTuVsKQoban63oMbs7hrMNngPhlI7nSd_eeqXUFOZ1D3mKoXFAgwNHHurAyryrBtNGoTA2L-rYx3z_jwmaB2nRMUD0IpaLAzkLWCG9M3dyEd8UrOpaborxrhf4t6KLyk6YYDr48scEJOD9tglqFgspctYSKR_yooX2pH1np7PVn4Nc4Z7ZcUNonohJjEYyTB1p8aT-sOt83phFo_JOH5zHTKJyS3Qii7rLCpl3AvDh6MatDAkUYQ6MXyEt2JZQ21radf',
    mvpImgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZCBM7WaUp-pnjOwXmAg6yY0Mlfb7BzSLgUVED3T7c6-_AyQOWu2cbdSBMDp_zckLmsUr7bTVGsr-ECOHTCFp7RwOdq2b8AaaRforMYK63imHouf65cHjTeWpZfVdPx9JzmC5tgAQAgKXeOtKFJnGGmT7JeANi2W9hoZ8NmXtvDzpjtRf8BCiN28Qy5JPHFueHNeG9niMGfFApF6VySspG5iGO2jbpq4WdYeyh4CqPxBO8mBsemaaz-cUyzgmUGCYnSWYmL4yLWlgs',
  },
};

function smoothCurvePath(pts) {
  if (pts.length < 2) return '';
  const d = [`M ${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 3;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 3;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 3;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 3;
    d.push(`C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`);
  }
  return d.join(' ');
}

export default function MatchAnalysis() {
  const [selectedId, setSelectedId] = useState('#48291');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const match = MATCHES[selectedId];

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const { goldDiffs, maxK } = match;
  const centerY = 80;
  const scale = 70 / maxK;
  const step = 400 / (goldDiffs.length - 1);
  const toY = (d) => centerY - d * scale;
  const pts = goldDiffs.map((d, i) => [i * step, toY(d)]);

  const topMaxK = Math.ceil(maxK);
  const halfK = (topMaxK / 2).toFixed(1).replace('.0', '');

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="scanline"></div>
      </div>

      <SideNavBar />

      <main className="flex-1 flex flex-col min-w-0 md:ml-64 relative z-10">

        <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-md w-full flex justify-between items-center px-gutter h-16 border-b border-white/10">
          <div className="flex items-center gap-6">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(v => !v)}
                className="flex items-center gap-2 px-3 py-1.5 glass-panel rounded text-electric-green hover:border-electric-green transition-colors cursor-pointer active:scale-95"
              >
                <span className="font-label-caps text-label-caps">MATCH ID {selectedId}</span>
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 glass-panel rounded overflow-hidden shadow-2xl z-[70]">
                  {Object.keys(MATCHES).filter(id => id !== selectedId).map(id => (
                    <div
                      key={id}
                      onClick={() => { setSelectedId(id); setDropdownOpen(false); }}
                      className="px-3 py-2 hover:bg-white/5 cursor-pointer text-label-caps font-label-caps border-b border-white/10 last:border-0 text-on-surface flex justify-between items-center"
                    >
                      <span>MATCH ID {id}</span>
                      <span className="text-[9px] text-on-surface-variant">{MATCHES[id].blue.shortName} vs {MATCHES[id].red.shortName}</span>
                    </div>
                  ))}
                </div>
              )}
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

          {/* Match Header */}
          <section className="glass-panel header-accent rounded-xl p-margin-md flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-electric-green/5 blur-3xl rounded-full"></div>
            <div className="flex flex-col items-center md:items-start gap-4 z-10 flex-1">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 glass-panel rounded-full flex items-center justify-center p-2 border-electric-green">
                  <img alt={match.blue.name} className="w-full h-full rounded-full" src={match.blueLogoUrl} />
                </div>
                <div>
                  <h2 className="font-headline-md text-headline-md text-electric-green">{match.blue.name}</h2>
                  <span className="font-label-caps text-label-caps text-electric-green bg-electric-green/10 px-2 py-0.5 rounded border border-electric-green/20">{match.blue.result}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
                <div className="text-center md:text-left">
                  <p className="font-label-mono text-[11px] text-on-surface-variant">KILLS</p>
                  <p className="font-headline-md text-headline-md text-primary">{match.blue.kills}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="font-label-mono text-[11px] text-on-surface-variant">GOLD</p>
                  <p className="font-headline-md text-headline-md text-primary">{match.blue.gold}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="font-label-mono text-[11px] text-on-surface-variant">TOWERS</p>
                  <p className="font-headline-md text-headline-md text-primary">{match.blue.towers}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 z-10">
              <div className="font-label-mono text-label-mono text-on-surface-variant opacity-60">MATCH DURATION</div>
              <div className="font-headline-xl text-headline-xl font-bold tracking-widest text-secondary">{match.duration}</div>
              <div className="font-label-mono text-label-mono text-on-surface-variant">PATCH {match.patch}</div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-4 z-10 flex-1">
              <div className="flex items-center gap-4 md:flex-row-reverse">
                <div className="w-16 h-16 glass-panel rounded-full flex items-center justify-center p-2 border-white/10">
                  <img alt={match.red.name} className="w-full h-full rounded-full" src={match.redLogoUrl} />
                </div>
                <div className="md:text-right">
                  <h2 className="font-headline-md text-headline-md text-on-surface">{match.red.name}</h2>
                  <span className="font-label-mono text-label-mono text-on-surface-variant opacity-50">{match.red.result}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 w-full max-w-xs md:text-right">
                <div>
                  <p className="font-label-mono text-[11px] text-on-surface-variant">KILLS</p>
                  <p className="font-headline-md text-headline-md text-primary">{match.red.kills}</p>
                </div>
                <div>
                  <p className="font-label-mono text-[11px] text-on-surface-variant">GOLD</p>
                  <p className="font-headline-md text-headline-md text-primary">{match.red.gold}</p>
                </div>
                <div>
                  <p className="font-label-mono text-[11px] text-on-surface-variant">TOWERS</p>
                  <p className="font-headline-md text-headline-md text-primary">{match.red.towers}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Stat cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            <div className="glass-panel p-margin-sm rounded-lg flex flex-col gap-2 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                <span className="material-symbols-outlined text-4xl text-electric-green">payments</span>
              </div>
              <p className="font-label-mono text-[12px] text-on-surface-variant">GOLD DIFFERENCE</p>
              <div className="flex items-end gap-2">
                <span className="font-headline-md text-headline-md text-electric-green">{match.goldDiff}</span>
                <span className="font-body-md text-electric-green pb-1">▲ {match.goldPct - 50}%</span>
              </div>
              <div className="w-full h-1 bg-surface-variant rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-electric-green transition-all duration-500" style={{ width: `${match.goldPct}%` }}></div>
              </div>
            </div>
            <div className="glass-panel p-margin-sm rounded-lg flex flex-col gap-2 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                <span className="material-symbols-outlined text-4xl text-secondary">swords</span>
              </div>
              <p className="font-label-mono text-[12px] text-on-surface-variant">KDA COMPARISON</p>
              <div className="flex items-end gap-2">
                <span className="font-headline-md text-headline-md text-secondary">{match.kdaBlue}</span>
                <span className="font-body-md text-on-surface-variant pb-1">vs {match.kdaRed}</span>
              </div>
              <div className="w-full h-1 bg-surface-variant rounded-full mt-2 overflow-hidden flex">
                <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${match.kdaPct}%` }}></div>
                <div className="h-full bg-outline-variant" style={{ width: `${100 - match.kdaPct}%` }}></div>
              </div>
            </div>
            <div className="glass-panel p-margin-sm rounded-lg flex flex-col gap-2 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                <span className="material-symbols-outlined text-4xl text-primary-fixed">trophy</span>
              </div>
              <p className="font-label-mono text-[12px] text-on-surface-variant">OBJECTIVE CONTROL</p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-primary-fixed">brightness_low</span>
                  <span className="font-body-md text-primary">{match.drakes}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-electric-green">fort</span>
                  <span className="font-body-md text-primary">{match.barons}</span>
                </div>
              </div>
            </div>
            <div className="glass-panel p-margin-sm rounded-lg flex flex-col gap-2 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                <span className="material-symbols-outlined text-4xl text-electric-green">visibility</span>
              </div>
              <p className="font-label-mono text-[12px] text-on-surface-variant">VISION SCORE</p>
              <div className="flex items-end gap-2">
                <span className="font-headline-md text-headline-md text-electric-green">{match.visionScore}</span>
                <span className="font-body-md text-electric-green/60 pb-1">Wards</span>
              </div>
              <p className="font-label-mono text-[11px] text-on-surface-variant mt-auto">JUNGLE LEAD: {match.jungleLead}</p>
            </div>
          </section>

          {/* Gold chart + Kill timeline */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">

            <div className="lg:col-span-2 glass-panel rounded-lg p-margin-md flex flex-col">
              <div className="flex justify-between items-center mb-3 shrink-0">
                <h3 className="font-label-mono text-label-mono text-electric-green flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-electric-green"></span>
                  GOLD OVER TIME
                </h3>
                <div className="flex gap-4">
                  <span className="font-label-mono text-[10px] text-on-surface-variant flex items-center gap-1">
                    <span className="w-3 h-0.5 bg-team-blue inline-block rounded"></span> {match.blueLegend}
                  </span>
                  <span className="font-label-mono text-[10px] text-on-surface-variant flex items-center gap-1">
                    <span className="w-3 h-0.5 bg-team-red inline-block rounded"></span> {match.redLegend}
                  </span>
                </div>
              </div>

              {/* Phase labels */}
              <div className="flex text-[9px] font-label-caps text-on-surface-variant mb-1 shrink-0 pr-12">
                <span style={{ width: '33%' }}>EARLY</span>
                <span style={{ width: '33%' }}>MID</span>
                <span style={{ width: '34%' }}>LATE</span>
              </div>

              {/* Chart area — flex-1 to fill card */}
              <div className="flex-1 min-h-0 flex" style={{ minHeight: '160px' }}>
                <div className="flex-1 min-w-0 relative">
                  {(() => {
                    const fullPath = smoothCurvePath(pts);
                    const areaClose = `${fullPath} L ${pts[pts.length-1][0]},${centerY} L ${pts[0][0]},${centerY} Z`;
                    return (
                    <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="bgGrad" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.03" />
                        </linearGradient>
                        <linearGradient id="rgGrad" x1="0" x2="0" y1="1" y2="0">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.03" />
                        </linearGradient>
                        <clipPath id="clipBlueArea">
                          <rect x="0" y="0" width="400" height={centerY + 1} />
                        </clipPath>
                        <clipPath id="clipRedArea">
                          <rect x="0" y={centerY - 1} width="400" height={160 - centerY + 2} />
                        </clipPath>
                      </defs>
                      {/* Grid */}
                      {[20, 40, 60, 100, 120, 140].map(y => (
                        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 3" />
                      ))}
                      {/* Phase dividers */}
                      <line x1="133" y1="0" x2="133" y2="160" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="2 3" />
                      <line x1="267" y1="0" x2="267" y2="160" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="2 3" />
                      {/* Center line */}
                      <line x1="0" y1={centerY} x2="400" y2={centerY} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                      {/* Fill areas — full smooth path clipped above/below */}
                      <path d={areaClose} fill="url(#bgGrad)" clipPath="url(#clipBlueArea)" />
                      <path d={areaClose} fill="url(#rgGrad)" clipPath="url(#clipRedArea)" />
                      {/* Curve lines clipped blue/red */}
                      <path d={fullPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#clipBlueArea)" />
                      <path d={fullPath} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#clipRedArea)" />
                    </svg>
                    );
                  })()}
                </div>
                {/* Y-axis */}
                <div className="flex flex-col justify-between items-end py-0.5 pl-1" style={{ width: '44px' }}>
                  <span className="font-label-mono text-[9px] text-team-blue">+{topMaxK}k</span>
                  <span className="font-label-mono text-[9px] text-team-blue">+{halfK}k</span>
                  <span className="font-label-mono text-[9px] text-on-surface-variant font-bold">0</span>
                  <span className="font-label-mono text-[9px] text-team-red">+{halfK}k</span>
                  <span className="font-label-mono text-[9px] text-team-red">+{topMaxK}k</span>
                </div>
              </div>

              {/* Time labels */}
              <div className="flex justify-between pr-12 mt-1 shrink-0">
                {match.timeLabels.map(t => (
                  <span key={t} className="font-label-mono text-[9px] text-on-surface-variant">{t}</span>
                ))}
              </div>
            </div>

            {/* Kill timeline */}
            <div className="lg:col-span-1 glass-panel rounded-lg p-margin-md flex flex-col gap-4">
              <h3 className="font-label-mono text-label-mono text-electric-green flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-electric-green"></span>
                KILL TIMELINE
              </h3>
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                {match.kills.map((kill, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2 border-b border-white/10 last:border-0">
                    <span className="font-label-mono text-[10px] text-on-surface-variant w-12">{kill.time}</span>
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${kill.side === 'blue' ? 'bg-team-blue/20' : 'bg-team-red/20'}`}>
                      <span className={`material-symbols-outlined text-[14px] ${kill.side === 'blue' ? 'text-team-blue' : 'text-team-red'}`}>
                        {kill.side === 'blue' ? 'bolt' : 'person'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-body-md text-[12px]">
                        <span className={`font-bold ${kill.side === 'blue' ? 'text-team-blue' : 'text-team-red'}`}>{kill.killer}</span>
                        {kill.victim && <> killed <span className={`${kill.side === 'blue' ? 'text-team-red' : 'text-team-blue'}`}>{kill.victim}</span></>}
                      </p>
                      <p className="font-label-mono text-[9px] text-on-surface-variant">{kill.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Analysis */}
            <div className="lg:col-span-3 glass-panel rounded-lg p-margin-md flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-2 bg-electric-green/20 rounded-bl-lg font-label-mono text-[10px] text-electric-green animate-pulse">
                MODEL V2.4 AI ANALYSIS ACTIVE
              </div>
              <div className="flex flex-col gap-2 z-10">
                <h3 className="font-headline-md text-headline-md text-electric-green">Why the model predicted the outcome</h3>
                <p className="font-body-lg text-on-surface-variant max-w-2xl">
                  Our predictive engine identified a {match.prediction.prob}% win probability for {match.blue.name} starting at the {match.prediction.marker}. The primary driver was {match.prediction.driver}.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter z-10">
                <div className="bg-surface-container/50 backdrop-blur-md rounded-lg p-4 border border-white/10 flex gap-4 items-start">
                  <span className="material-symbols-outlined text-electric-green">priority_high</span>
                  <div>
                    <h4 className="font-label-mono text-label-mono text-electric-green mb-1">KEY TURNING POINT</h4>
                    <p className="font-body-md text-[13px] text-on-surface">{match.prediction.turning}</p>
                  </div>
                </div>
                <div className="bg-surface-container/50 backdrop-blur-md rounded-lg p-4 border border-white/10 flex gap-4 items-center">
                  <div className="relative shrink-0">
                    <img alt="MVP" className="w-12 h-12 rounded-lg border border-electric-green" src={match.mvpImgUrl} />
                    <span className="absolute -bottom-1 -right-1 bg-electric-green text-pure-black text-[8px] font-bold px-1 rounded">MVP</span>
                  </div>
                  <div>
                    <h4 className="font-label-mono text-label-mono text-electric-green">{match.mvp.name}</h4>
                    <p className="font-body-md text-[13px] text-on-surface">{match.mvp.score}</p>
                    <p className="font-label-mono text-[9px] text-on-surface-variant">SCORE: {match.mvp.rating}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-auto flex justify-between items-center px-margin-lg py-margin-sm w-full bg-pure-black border-t border-white/5">
          <div className="font-label-caps text-label-caps text-on-surface">© 2024 Draft.AI. ALL RIGHTS RESERVED.</div>
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
