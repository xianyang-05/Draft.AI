import React, { useState } from 'react';
import SideNavBar from '../components/SideNavBar';
import { Link } from 'react-router-dom';
import { champions } from '../data/champions';

export default function DraftSimulator() {
  const [blueTeam, setBlueTeam] = useState([
    { role: 'TOP', champion: null },
    { role: 'JUNGLE', champion: null },
    { role: 'MID', champion: null },
    { role: 'ADC', champion: null },
    { role: 'SUPPORT', champion: null },
  ]);

  const [redTeam, setRedTeam] = useState([
    { role: 'TOP', champion: null },
    { role: 'JUNGLE', champion: null },
    { role: 'MID', champion: null },
    { role: 'ADC', champion: null },
    { role: 'SUPPORT', champion: null },
  ]);

  const [activeSlot, setActiveSlot] = useState(null);
  const [blueWinChance, setBlueWinChance] = useState(50);

  const handleSlotClick = (team, index, role) => {
    if (activeSlot && activeSlot.team === team && activeSlot.index === index) {
      setActiveSlot(null);
    } else {
      setActiveSlot({ team, index, role });
    }
  };

  const handleChampionSelect = (champ) => {
    if (activeSlot.team === 'blue') {
      const newTeam = [...blueTeam];
      newTeam[activeSlot.index].champion = champ;
      setBlueTeam(newTeam);
    } else {
      const newTeam = [...redTeam];
      newTeam[activeSlot.index].champion = champ;
      setRedTeam(newTeam);
    }
    // Randomize win chance to simulate AI prediction
    setBlueWinChance(Math.floor(Math.random() * 41) + 30); // 30% to 70%
    setActiveSlot(null);
  };

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
            {/* Blue Team Column */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
              <div className="flex items-center justify-between border-l-4 border-team-blue pl-4 py-2 bg-team-blue/5 rounded-r">
                <span className="font-label-caps text-label-caps text-team-blue font-bold">TEAM BLUE</span>
              </div>
              <div className="space-y-3">
                {blueTeam.map((slot, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleSlotClick('blue', idx, slot.role)}
                    className={`glass-panel p-3 flex items-center gap-4 group cursor-pointer transition-colors border-l-2 
                      ${slot.champion ? 'bg-team-blue/5 border-team-blue glow-team-blue' : 'opacity-40 hover:opacity-100 border-transparent hover:border-team-blue/50'}`}
                  >
                    <div className={`w-14 h-14 rounded overflow-hidden flex items-center justify-center
                      ${slot.champion ? 'bg-team-blue/20 border border-team-blue' : 'bg-surface-container-high border border-white/10'}`}>
                      {slot.champion ? (
                        <img alt={slot.role} className="w-full h-full object-cover" src={slot.champion.image} />
                      ) : (
                        <span className="material-symbols-outlined text-on-surface-variant">add</span>
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className={`font-label-caps text-[10px] ${slot.champion ? 'text-team-blue' : 'text-on-surface-variant'}`}>{slot.role}</p>
                      <p className="font-body-md text-on-surface font-bold">{slot.champion ? slot.champion.name : 'EMPTY_SLOT'}</p>
                    </div>
                    {slot.champion && <span className="material-symbols-outlined text-team-blue/50 group-hover:text-team-blue drop-glow-team-blue">check_circle</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Center Graphic */}
            <div className="col-span-12 lg:col-span-4 flex flex-col items-center justify-center py-10 relative">
              {/* Always show win chance graphic in background */}
              {(() => {
                const advColor = blueWinChance >= 50 ? 'team-blue' : 'team-red';
                const displayChance = blueWinChance >= 50 ? blueWinChance : 100 - blueWinChance;
                const advAmount = (displayChance - 50).toFixed(1);
                const dashOffset = 691 - (691 * (displayChance / 100));
                
                return (
                  <>
                    <div className="relative w-64 h-64 flex flex-col items-center justify-center">
                      <svg className={`w-full h-full transform -rotate-90 drop-glow-${advColor}`}>
                        <circle className="text-surface-container-high" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" strokeWidth="8"></circle>
                        <circle className={`text-${advColor} transition-all duration-1000`} cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" strokeDasharray="691" strokeDashoffset={dashOffset} strokeWidth="8"></circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">WIN CHANCE</p>
                        <h2 className={`font-data-display text-6xl text-${advColor} font-black drop-glow-${advColor}`}>{displayChance}%</h2>
                        <p className={`font-label-caps text-[10px] text-${advColor} mt-2 tracking-widest`}>+{advAmount}% ADVANTAGE</p>
                      </div>
                    </div>
                    <div className="w-full mt-10 space-y-4 px-6">
                      <div className="flex justify-between font-label-caps text-[10px]">
                        <span className="text-team-blue">TEAM BLUE</span>
                        <span className="text-team-red">TEAM RED</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden flex border border-white/5">
                        <div className="h-full bg-team-blue transition-all duration-1000 glow-team-blue" style={{width: `${blueWinChance}%`}}></div>
                        <div className="h-full bg-team-red transition-all duration-1000" style={{width: `${100 - blueWinChance}%`}}></div>
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* Champion Selection Card Overlay */}
              {activeSlot && (() => {
                const roleFilter = activeSlot.role;
                const filteredChampions = champions.filter(champ => 
                  roleFilter ? champ.roles.includes(roleFilter.toUpperCase()) : true
                );

                return (
                  <div className="fixed top-16 left-64 right-0 z-[100] flex items-start justify-center p-6 bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]">
                    <div className="relative w-full max-w-6xl bg-transparent flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-label-caps text-xs text-pure-white font-bold tracking-widest uppercase">
                          SELECTING {activeSlot.team} {activeSlot.role}
                        </span>
                        <button onClick={() => setActiveSlot(null)} className="text-on-surface-variant hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-[6px] justify-center items-start content-start mt-2">
                        {filteredChampions.map(champ => {
                          return (
                            <div 
                              key={champ.id}
                              onClick={() => handleChampionSelect(champ)}
                              className="group relative w-12 h-16 sm:w-14 sm:h-[72px] lg:w-[60px] lg:h-[84px] cursor-pointer overflow-hidden border-2 border-transparent hover:border-electric-green transition-all shadow-md hover:shadow-electric-green/40 hover:-translate-y-1 z-10 hover:z-20"
                            >
                              <img 
                                src={champ.image} 
                                alt={champ.name} 
                                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                          );
                        })}
                        <div className="w-12 h-16 sm:w-14 sm:h-[72px] lg:w-[60px] lg:h-[84px] border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-white/50 hover:bg-white/5 transition-all text-white/30 hover:text-white">
                          <span className="material-symbols-outlined text-2xl">add</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Red Team Column */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 text-right">
              <div className="flex items-center justify-end border-r-4 border-team-red pr-4 py-2 bg-team-red/5 rounded-l">
                <span className="font-label-caps text-label-caps text-team-red font-bold">TEAM RED</span>
              </div>
              <div className="space-y-3">
                {redTeam.map((slot, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleSlotClick('red', idx, slot.role)}
                    className={`glass-panel p-3 flex flex-row-reverse items-center gap-4 group cursor-pointer transition-colors border-r-2 
                      ${slot.champion ? 'bg-team-red/5 border-team-red glow-team-red' : 'opacity-40 hover:opacity-100 border-transparent hover:border-team-red/50'}`}
                  >
                    <div className={`w-14 h-14 rounded overflow-hidden flex items-center justify-center
                      ${slot.champion ? 'bg-team-red/20 border border-team-red' : 'bg-surface-container-high border border-white/10'}`}>
                      {slot.champion ? (
                        <img alt={slot.role} className="w-full h-full object-cover" src={slot.champion.image} />
                      ) : (
                        <span className="material-symbols-outlined text-on-surface-variant">add</span>
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className={`font-label-caps text-[10px] ${slot.champion ? 'text-team-red' : 'text-on-surface-variant'}`}>{slot.role}</p>
                      <p className="font-body-md text-on-surface font-bold">{slot.champion ? slot.champion.name : 'EMPTY_SLOT'}</p>
                    </div>
                    {slot.champion && <span className="material-symbols-outlined text-team-red/50 group-hover:text-team-red drop-glow-team-red">check_circle</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-card-padding rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-team-blue via-electric-green to-team-red opacity-50"></div>
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-electric-green" style={{fontVariationSettings: "'FILL' 1"}}>analytics</span>
              <h3 className="font-label-caps text-label-caps text-on-surface font-bold">AI DRAFT INTELLIGENCE REPORT</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <p className="font-label-caps text-[10px] text-team-blue mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-team-blue glow-team-blue"></span> TEAM STRENGTHS
                </p>
                <ul className="space-y-2">
                  <li className="font-body-sm text-on-surface-variant flex items-start gap-2">
                    <span className="material-symbols-outlined text-[14px] mt-1 text-team-blue">check</span>
                    Strong front-to-back teamfight potential with current locks.
                  </li>
                  <li className="font-body-sm text-on-surface-variant flex items-start gap-2">
                    <span className="material-symbols-outlined text-[14px] mt-1 text-team-blue">check</span>
                    High objective control scaling (Model Alpha).
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-label-caps text-[10px] text-team-red mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-team-red glow-team-red"></span> TEAM WEAKNESSES
                </p>
                <ul className="space-y-2">
                  <li className="font-body-sm text-on-surface-variant flex items-start gap-2">
                    <span className="material-symbols-outlined text-[14px] mt-1 text-team-red">warning</span>
                    Vulnerable to early invade from enemy composition.
                  </li>
                  <li className="font-body-sm text-on-surface-variant flex items-start gap-2">
                    <span className="material-symbols-outlined text-[14px] mt-1 text-team-red">warning</span>
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
                <p className="font-label-caps text-[10px] text-team-red mb-3">RECOMMENDED BANS</p>
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-surface-container rounded border border-team-red/40 flex items-center justify-center group cursor-pointer hover:border-team-red transition-all grayscale opacity-60 hover:grayscale-0 hover:opacity-100">
                    <img alt="Ban 1" className="w-10 h-10 object-cover rounded-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD26OWsvzFd5woKSw71oPFXJ0YUaDUEg3bJR7vn26NvHzRAtaXGtw53LB5D-Ifi2NfSth-Mn-JS9MFYj0xqvtkrhL0CrkZh7wUSnk01dqCmAXGX7IZidRRD32Oio551Ozc-n3BHBwkx3oV7qbP-PlTsmR5ApWnCzPEGrtVxbu0-KBhlVTHvvE3PW5FABDS3mS0b6WvfDKDpGMwexjmNzy4LUfRu_rdCVlkJl3bPWIyV9HQNJdob2AP6pcTGwOffhckTYW-zt9XqICgL" />
                  </div>
                  <div className="w-12 h-12 bg-surface-container rounded border border-team-red/40 flex items-center justify-center group cursor-pointer hover:border-team-red transition-all grayscale opacity-60 hover:grayscale-0 hover:opacity-100">
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
                <div className="w-10 h-10 bg-team-red/20 border border-team-red/40 rounded flex items-center justify-center text-[10px] font-label-caps text-team-red">BAN</div>
                <div className="w-10 h-10 bg-team-red/20 border border-team-red/40 rounded flex items-center justify-center text-[10px] font-label-caps text-team-red">BAN</div>
                <div className="w-10 h-10 bg-team-blue/10 border border-team-blue/40 rounded flex items-center justify-center text-[10px] font-label-caps text-team-blue">BAN</div>
              </div>
              <div className="flex gap-2 border-r border-white/10 pr-4">
                <div className="w-10 h-10 bg-team-blue border border-team-blue rounded flex items-center justify-center text-[10px] font-label-caps text-on-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]">PICK</div>
                <div className="w-10 h-10 bg-team-red border border-team-red rounded flex items-center justify-center text-[10px] font-label-caps text-on-secondary">PICK</div>
                <div className="w-10 h-10 bg-team-red border border-team-red rounded flex items-center justify-center text-[10px] font-label-caps text-on-secondary">PICK</div>
              </div>
              <div className="flex gap-2 relative">
                <div className="w-12 h-12 bg-team-blue/10 border-2 border-team-blue rounded flex flex-col items-center justify-center glow-team-blue">
                  <span className="text-[10px] font-bold text-team-blue">0:18</span>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    <span className="material-symbols-outlined text-team-blue text-[16px] drop-glow-team-blue">arrow_drop_down</span>
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
