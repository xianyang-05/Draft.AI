import React, { useState, useEffect } from 'react';
import SideNavBar from '../components/SideNavBar';
import { champions } from '../data/champions';
import { predictWinRate, generateDraftOverview, optimizeTeamAssignment } from '../utils/predictWinRate';
import { getAIPickOrBan } from '../utils/ollamaClient';

const DRAFT_SEQUENCE = [
  { team: 'blue', action: 'ban', label: 'B1' },
  { team: 'red', action: 'ban', label: 'R1' },
  { team: 'blue', action: 'ban', label: 'B2' },
  { team: 'red', action: 'ban', label: 'R2' },
  { team: 'blue', action: 'ban', label: 'B3' },
  { team: 'red', action: 'ban', label: 'R3' },
  { team: 'blue', action: 'pick', label: 'B1' },
  { team: 'red', action: 'pick', label: 'R1' },
  { team: 'red', action: 'pick', label: 'R2' },
  { team: 'blue', action: 'pick', label: 'B2' },
  { team: 'blue', action: 'pick', label: 'B3' },
  { team: 'red', action: 'pick', label: 'R3' },
  { team: 'red', action: 'ban', label: 'R4' },
  { team: 'blue', action: 'ban', label: 'B4' },
  { team: 'red', action: 'ban', label: 'R5' },
  { team: 'blue', action: 'ban', label: 'B5' },
  { team: 'red', action: 'pick', label: 'R4' },
  { team: 'blue', action: 'pick', label: 'B4' },
  { team: 'blue', action: 'pick', label: 'B5' },
  { team: 'red', action: 'pick', label: 'R5' },
];

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

  const [blueBans, setBlueBans] = useState([null, null, null, null, null]);
  const [redBans, setRedBans] = useState([null, null, null, null, null]);

  const [draftMode, setDraftMode] = useState('simulation');
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);

  const [activeSlot, setActiveSlot] = useState(null);
  const [blueWinChance, setBlueWinChance] = useState(50);
  const [predictionReport, setPredictionReport] = useState({
    blueDetails: [],
    redDetails: [],
    recommendedPicks: [],
    recommendedBans: []
  });

  const [isAITurnProcessing, setIsAITurnProcessing] = useState(false);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [draftLog, setDraftLog] = useState([]);
  const [swapSource, setSwapSource] = useState(null);
  const [swapTarget, setSwapTarget] = useState(null);
  const [reportConfirmed, setReportConfirmed] = useState(false);

  useEffect(() => {
    const targetTeam = draftMode === 'blue' ? 'blue' : (draftMode === 'red' ? 'red' : (currentTurnIndex < DRAFT_SEQUENCE.length ? DRAFT_SEQUENCE[currentTurnIndex].team : 'blue'));
    predictWinRate(blueTeam, redTeam, blueBans, redBans, targetTeam).then(prediction => {
      setBlueWinChance(prediction.blueWinChance);
      setPredictionReport(prediction);
    }).catch(err => {
      console.error("Error predicting win rate:", err);
    });
  }, [blueTeam, redTeam, blueBans, redBans, draftMode, currentTurnIndex]);

  useEffect(() => {
    if (currentTurnIndex >= DRAFT_SEQUENCE.length) return;
    const currentTurn = DRAFT_SEQUENCE[currentTurnIndex];
    
    let isAITurn = false;
    if (draftMode === 'blue' && currentTurn.team === 'red') isAITurn = true;
    if (draftMode === 'red' && currentTurn.team === 'blue') isAITurn = true;

    if (isAITurn && !isAITurnProcessing) {
      setIsAITurnProcessing(true);
      setActiveSlot(null);
      
      const doAITurn = async () => {
        // Delay for realistic pacing without triggering cleanup cancellation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const champ = await getAIPickOrBan({
          blueTeam, redTeam, 
          blueBans: blueBans.filter(c => c).map(c => c.name), 
          redBans: redBans.filter(c => c).map(c => c.name), 
          action: currentTurn.action, 
          team: currentTurn.team
        });
        
        if (champ) {
          let pickedRole = null;
          if (currentTurn.action === 'pick') {
            const teamPicks = currentTurn.team === 'blue' ? [...blueTeam] : [...redTeam];
            const emptyIdx = teamPicks.findIndex(s => s.champion === null);
            if (emptyIdx !== -1) {
              teamPicks[emptyIdx].champion = champ;
              pickedRole = teamPicks[emptyIdx].role;
              if (currentTurn.team === 'blue') setBlueTeam(teamPicks);
              else setRedTeam(teamPicks);
            }
          } else {
            const teamBans = currentTurn.team === 'blue' ? [...blueBans] : [...redBans];
            const emptyIdx = teamBans.findIndex(c => c === null);
            if (emptyIdx !== -1) {
              teamBans[emptyIdx] = champ;
              if (currentTurn.team === 'blue') setBlueBans(teamBans);
              else setRedBans(teamBans);
            }
          }
          
          setDraftLog(prev => [
            ...prev,
            {
              round: prev.length + 1,
              label: currentTurn.label,
              team: currentTurn.team,
              action: currentTurn.action.toUpperCase(),
              champion: champ.name,
              role: pickedRole
            }
          ]);

          setCurrentTurnIndex(prev => prev + 1);
        }
        setIsAITurnProcessing(false);
      };
      
      doAITurn();
    }
  }, [currentTurnIndex, draftMode, blueTeam, redTeam, blueBans, redBans]);

  const isDraftComplete = currentTurnIndex >= DRAFT_SEQUENCE.length;

  const currentTurn = currentTurnIndex < DRAFT_SEQUENCE.length ? DRAFT_SEQUENCE[currentTurnIndex] : null;

  const nextBlueBanIdx = blueBans.findIndex(b => b === null);
  const nextRedBanIdx = redBans.findIndex(b => b === null);
  const nextBluePickIdx = blueTeam.findIndex(t => t.champion === null);
  const nextRedPickIdx = redTeam.findIndex(t => t.champion === null);

  const handleSlotClick = (team, index, type, role = null) => {
    if (isAITurnProcessing) return;
    
    if (draftMode !== 'simulation') {
      if (!currentTurn) return;
      if (draftMode === 'blue' && currentTurn.team === 'red') return;
      if (draftMode === 'red' && currentTurn.team === 'blue') return;
      
      if (currentTurn.team !== team || currentTurn.action !== type) {
        return;
      }
    }

    // Must be clicking an empty slot
    if (type === 'pick') {
      const teamArr = team === 'blue' ? blueTeam : redTeam;
      if (teamArr[index].champion !== null) return;
    } else {
      const teamBansArr = team === 'blue' ? blueBans : redBans;
      if (teamBansArr[index] !== null) return;
    }

    if (activeSlot && activeSlot.team === team && activeSlot.index === index && activeSlot.type === type) {
      setActiveSlot(null);
    } else {
      setActiveSlot({ team, index, type, role });
      setRoleFilter('ALL');
    }
  };

  const handleChampionSelect = (champ) => {
    if (!activeSlot) return;

    if (activeSlot.type === 'pick') {
      if (activeSlot.team === 'blue') {
        const newTeam = [...blueTeam];
        newTeam[activeSlot.index].champion = champ;
        setBlueTeam(newTeam);
      } else {
        const newTeam = [...redTeam];
        newTeam[activeSlot.index].champion = champ;
        setRedTeam(newTeam);
      }
    } else {
      if (activeSlot.team === 'blue') {
        const newBans = [...blueBans];
        newBans[activeSlot.index] = champ;
        setBlueBans(newBans);
      } else {
        const newBans = [...redBans];
        newBans[activeSlot.index] = champ;
        setRedBans(newBans);
      }
    }
    
    let turnLabel = '';
    let actionStr = '';
    
    if (draftMode === 'simulation') {
      const isPick = activeSlot.type === 'pick';
      turnLabel = `${activeSlot.team.charAt(0).toUpperCase()}${isPick ? 'P' : 'B'}`;
      actionStr = isPick ? 'PICK' : 'BAN';
    } else {
      turnLabel = currentTurn ? currentTurn.label : '??';
      actionStr = currentTurn ? currentTurn.action.toUpperCase() : 'ACTION';
    }

    setDraftLog(prev => [
      ...prev,
      {
        round: prev.length + 1,
        label: turnLabel,
        team: activeSlot.team,
        action: actionStr,
        champion: champ.name,
        role: activeSlot.type === 'pick' ? activeSlot.role : null
      }
    ]);

    setActiveSlot(null);
    setCurrentTurnIndex(prev => prev + 1);
  };

  const getChampImageByName = (name) => {
    if (!name) return null;
    const champ = champions.find(c => c.name.toLowerCase() === name.toLowerCase());
    return champ ? champ.image : null;
  };

  const handleRecommendationClick = (champName) => {
    if (!activeSlot) return;
    const champ = champions.find(c => c.name.toLowerCase() === champName.toLowerCase());
    if (champ) {
      handleChampionSelect(champ);
    }
  };

  const resetDraft = () => {
    setBlueTeam(blueTeam.map(s => ({ ...s, champion: null })));
    setRedTeam(redTeam.map(s => ({ ...s, champion: null })));
    setBlueBans([null, null, null, null, null]);
    setRedBans([null, null, null, null, null]);
    setCurrentTurnIndex(0);
    setActiveSlot(null);
    setSwapSource(null);
    setSwapTarget(null);
    setReportConfirmed(false);
    setIsAITurnProcessing(false);
    setDraftLog([]);
  };

  const canSwapTeam = (team) => {
    if (!isDraftComplete || reportConfirmed) return false;
    if (draftMode === 'simulation') return true;
    if (draftMode === 'blue') return team === 'blue';
    if (draftMode === 'red') return team === 'red';
    return false;
  };

  const handlePostDraftPickClick = (team, index) => {
    if (!canSwapTeam(team)) return;
    const teamArr = team === 'blue' ? blueTeam : redTeam;
    if (!teamArr[index].champion) return;

    if (!swapSource) {
      setSwapSource({ team, index });
      setSwapTarget(null);
      return;
    }
    if (swapSource.team === team && swapSource.index === index) {
      setSwapSource(null);
      setSwapTarget(null);
      return;
    }
    if (swapSource.team !== team) {
      setSwapSource({ team, index });
      setSwapTarget(null);
      return;
    }

    if (swapTarget?.team === team && swapTarget?.index === index) {
      setSwapTarget(null);
      return;
    }

    setSwapTarget({ team, index });
  };

  const applyPendingSwap = () => {
    if (!swapSource || !swapTarget || swapSource.team !== swapTarget.team) return;
    const team = swapSource.team;
    const setter = team === 'blue' ? setBlueTeam : setRedTeam;
    setter(prev => {
      const next = prev.map(s => ({ ...s }));
      const tmp = next[swapSource.index].champion;
      next[swapSource.index].champion = next[swapTarget.index].champion;
      next[swapTarget.index].champion = tmp;
      return next;
    });
  };

  const handleAutoSwap = () => {
    if (!isDraftComplete || reportConfirmed) return;
    if (draftMode === 'simulation') {
      setBlueTeam(prev => optimizeTeamAssignment(prev, 'blue'));
      setRedTeam(prev => optimizeTeamAssignment(prev, 'red'));
    } else if (draftMode === 'blue') {
      setBlueTeam(prev => optimizeTeamAssignment(prev, 'blue'));
      setRedTeam(prev => optimizeTeamAssignment(prev, 'red'));
    } else if (draftMode === 'red') {
      setRedTeam(prev => optimizeTeamAssignment(prev, 'red'));
      setBlueTeam(prev => optimizeTeamAssignment(prev, 'blue'));
    }
    setSwapSource(null);
    setSwapTarget(null);
  };

  const handleConfirmReport = () => {
    applyPendingSwap();
    setReportConfirmed(true);
    setSwapSource(null);
    setSwapTarget(null);
  };

  const handlePickSlotClick = (team, index, role) => {
    if (isDraftComplete) {
      handlePostDraftPickClick(team, index);
    } else {
      handleSlotClick(team, index, 'pick', role);
    }
  };

  const handleModeChange = (e) => {
    setDraftMode(e.target.value);
    resetDraft();
  };

  const strengthsList = [];
  const weaknessesList = [];

  if (predictionReport.blueDetails && predictionReport.blueDetails.length > 0) {
    predictionReport.blueDetails.forEach(d => {
      if (d.value > 0) {
        strengthsList.push({
          id: `blue-str-${d.name}-${d.role}`,
          text: `Blue ${d.name} (${d.role}) adds +${(d.value * 100).toFixed(1)}% win chance`
        });
      } else if (d.value < 0) {
        weaknessesList.push({
          id: `blue-weak-${d.name}-${d.role}`,
          text: `Blue ${d.name} (${d.role}) reduces win chance by ${Math.abs(d.value * 100).toFixed(1)}%`
        });
      }
    });
  }

  if (predictionReport.redDetails && predictionReport.redDetails.length > 0) {
    predictionReport.redDetails.forEach(d => {
      if (d.value > 0) {
        strengthsList.push({
          id: `red-str-${d.name}-${d.role}`,
          text: `Opponent ${d.name} (${d.role}) matchup favors us (+${(d.value * 100).toFixed(1)}%)`
        });
      } else if (d.value < 0) {
        weaknessesList.push({
          id: `red-weak-${d.name}-${d.role}`,
          text: `Opponent ${d.name} (${d.role}) reduces our win chance by ${Math.abs(d.value * 100).toFixed(1)}%`
        });
      }
    });
  }

  if (strengthsList.length === 0) {
    strengthsList.push({ id: 'default-str-1', text: "Standard blue side first-pick initiative active (+3.2%)" });
    strengthsList.push({ id: 'default-str-2', text: "Awaiting draft selections to analyze side advantages" });
  }
  if (weaknessesList.length === 0) {
    weaknessesList.push({ id: 'default-weak-1', text: "No composition vulnerabilities detected yet" });
    weaknessesList.push({ id: 'default-weak-2', text: "Awaiting opponent selections to detect composition counters" });
  }

  const isTeamMode = draftMode === 'blue' || draftMode === 'red';
  const userTeam = draftMode === 'blue' ? 'blue' : draftMode === 'red' ? 'red' : null;
  const isUserTurn = !isTeamMode || (currentTurn && currentTurn.team === userTeam);
  const showRecommendedPicks = isUserTurn && currentTurn?.action === 'pick' && predictionReport.recommendedPicks?.length > 0;
  const showRecommendedBans = isUserTurn && currentTurn?.action === 'ban' && predictionReport.recommendedBans?.length > 0;
  const topSuggestedPick = showRecommendedPicks ? predictionReport.recommendedPicks[0] : null;
  const topSuggestedBan = showRecommendedBans ? predictionReport.recommendedBans[0] : null;
  const showFullReport = isDraftComplete && reportConfirmed;
  const draftOverview = showFullReport
    ? generateDraftOverview(blueTeam, redTeam, blueBans, redBans, draftLog, blueWinChance, draftMode)
    : null;

  const ChampBadge = ({ name, teamColor = 'neutral', size = 'sm' }) => {
    const img = getChampImageByName(name);
    const dim = size === 'lg' ? 'w-12 h-12' : size === 'md' ? 'w-10 h-10' : 'w-8 h-8';
    const ring = teamColor === 'blue' ? 'ring-team-blue/50' : teamColor === 'red' ? 'ring-team-red/50' : 'ring-electric-green/30';
    return (
      <span className="inline-flex items-center gap-2">
        {img ? (
          <img src={img} alt={name} className={`${dim} rounded-md object-cover ring-2 ${ring}`} />
        ) : (
          <span className={`${dim} rounded-md bg-surface-container inline-block`} />
        )}
        <span className="text-pure-white font-bold">{name}</span>
      </span>
    );
  };

  const SynergyPairCard = ({ pair, teamColor }) => {
    const accent = teamColor === 'blue' ? 'text-team-blue' : 'text-team-red';
    const bg = teamColor === 'blue' ? 'bg-team-blue/5' : 'bg-team-red/5';
    return (
      <div className={`${bg} rounded-lg p-3 flex flex-col gap-2`}>
        <span className={`font-label-caps text-[10px] ${accent} font-bold`}>{pair.label}</span>
        <div className="flex items-center gap-2 flex-wrap">
          <ChampBadge name={pair.champ1} teamColor={teamColor} size="md" />
          <span className="text-on-surface-variant text-xs">+</span>
          <ChampBadge name={pair.champ2} teamColor={teamColor} size="md" />
        </div>
        <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">{pair.analysis}</p>
      </div>
    );
  };

  return (
    <>
      <SideNavBar />

      <header className={`fixed top-0 right-0 left-0 h-16 bg-black/60 backdrop-blur-md flex justify-between items-center px-gutter z-50 ml-64 border-b border-white/10 ${activeSlot ? 'hidden' : ''}`}>
        <div className="flex items-center gap-4">
          <span className="font-headline-md text-headline-md font-black text-pure-white tracking-tight">Aegis Intelligence</span>
        </div>
        
        <div className="flex items-center gap-4 ml-8">
          <label className="text-on-surface-variant font-label-caps text-xs">DRAFT MODE:</label>
          <select 
            value={draftMode} 
            onChange={handleModeChange}
            className="bg-surface-container-high border border-white/20 text-pure-white text-sm rounded px-3 py-1 focus:outline-none focus:border-electric-green"
          >
            <option value="simulation">Simulation Mode</option>
            <option value="blue">Start with Blue Team</option>
            <option value="red">Start with Red Team</option>
          </select>
          <button onClick={resetDraft} className="text-xs text-on-surface hover:text-white border border-white/10 px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition">
            RESET
          </button>
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

      <main className={`ml-64 pt-16 min-h-screen relative overflow-x-hidden scanline ${activeSlot ? 'invisible pointer-events-none' : ''}`}>
        <div className="relative z-10 p-8 flex flex-col gap-8">

          {isDraftComplete && !reportConfirmed && (
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 rounded-lg bg-black/50 border border-electric-green/20">
              <div className="flex items-center gap-2 text-electric-green font-label-caps text-[10px]">
                <span className="material-symbols-outlined text-sm">swap_horiz</span>
                <span>
                  {draftMode === 'simulation'
                    ? 'Adjust lineups — select two champions to swap, or use Auto-Swap'
                    : 'Adjust your lineup — select two champions to swap, or use Auto-Swap'}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAutoSwap}
                  className="px-4 py-2 rounded text-[10px] font-label-caps bg-team-blue/20 text-team-blue hover:bg-team-blue/30 transition border border-team-blue/40"
                >
                  AUTO-SWAP
                </button>
                <button
                  onClick={handleConfirmReport}
                  className="px-4 py-2 rounded text-[10px] font-label-caps bg-electric-green text-black font-bold hover:bg-electric-green/90 transition"
                >
                  CONFIRM &amp; GENERATE REPORT
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
             <div className="flex gap-2">
                {blueBans.map((ban, i) => (
                  <div key={`bban-${i}`} 
                       onClick={() => handleSlotClick('blue', i, 'ban')}
                       className={`w-12 h-12 rounded overflow-hidden flex items-center justify-center transition border-2 
                         ${ban ? 'border-team-blue bg-team-blue/20' : 'border-white/10 bg-surface-container'}
                         ${(!ban && (draftMode === 'simulation' || (currentTurn && currentTurn.team === 'blue' && currentTurn.action === 'ban'))) ? 'hover:border-team-blue/50 cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.5)]' : ''}
                         ${(activeSlot?.team === 'blue' && activeSlot?.index === i && activeSlot?.type === 'ban') || (!activeSlot && currentTurn?.team === 'blue' && currentTurn?.action === 'ban' && i === nextBlueBanIdx) ? 'border-team-blue animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.8)]' : ''}
                       `}>
                    {ban ? <img src={ban.image} alt={ban.name} className="w-full h-full object-cover grayscale opacity-70" /> : <span className="text-[10px] text-on-surface-variant/50">BAN</span>}
                  </div>
                ))}
             </div>
             <div className="text-center font-headline-md font-bold tracking-widest text-pure-white">
                {isAITurnProcessing ? (
                  <span className="animate-pulse text-electric-green">AI IS THINKING...</span>
                ) : currentTurn ? (
                  <span className={currentTurn.team === 'blue' ? 'text-team-blue' : 'text-team-red'}>
                    {currentTurn.team.toUpperCase()} {currentTurn.action.toUpperCase()}
                  </span>
                ) : (
                  <span className="text-electric-green">DRAFT COMPLETE</span>
                )}
             </div>
             <div className="flex gap-2">
                {redBans.map((ban, i) => (
                  <div key={`rban-${i}`} 
                       onClick={() => handleSlotClick('red', i, 'ban')}
                       className={`w-12 h-12 rounded overflow-hidden flex items-center justify-center transition border-2 
                         ${ban ? 'border-team-red bg-team-red/20' : 'border-white/10 bg-surface-container'}
                         ${(!ban && (draftMode === 'simulation' || (currentTurn && currentTurn.team === 'red' && currentTurn.action === 'ban'))) ? 'hover:border-team-red/50 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.5)]' : ''}
                         ${(activeSlot?.team === 'red' && activeSlot?.index === i && activeSlot?.type === 'ban') || (!activeSlot && currentTurn?.team === 'red' && currentTurn?.action === 'ban' && i === nextRedBanIdx) ? 'border-team-red animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]' : ''}
                       `}>
                    {ban ? <img src={ban.image} alt={ban.name} className="w-full h-full object-cover grayscale opacity-70" /> : <span className="text-[10px] text-on-surface-variant/50">BAN</span>}
                  </div>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-12 gap-6 items-stretch">
            {/* Blue Team Column */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
              <div className="flex items-center justify-between border-l-4 border-team-blue pl-4 py-2 bg-team-blue/5 rounded-r">
                <span className="font-label-caps text-label-caps text-team-blue font-bold">TEAM BLUE</span>
              </div>
              <div className="space-y-3">
                {blueTeam.map((slot, idx) => {
                  const isSelectable = (!slot.champion && !isAITurnProcessing) && (draftMode === 'simulation' || (currentTurn && currentTurn.team === 'blue' && currentTurn.action === 'pick'));
                  const isActive = (activeSlot?.team === 'blue' && activeSlot?.index === idx && activeSlot?.type === 'pick') || (!activeSlot && currentTurn?.team === 'blue' && currentTurn?.action === 'pick' && idx === nextBluePickIdx);
                  const isSwapSource = swapSource?.team === 'blue' && swapSource?.index === idx;
                  const isSwapTarget = swapTarget?.team === 'blue' && swapTarget?.index === idx;
                  const isSwappable = isDraftComplete && !reportConfirmed && canSwapTeam('blue') && slot.champion;
                  
                  return (
                  <div
                    key={idx}
                    onClick={() => handlePickSlotClick('blue', idx, slot.role)}
                    className={`glass-panel p-3 flex items-center gap-4 group transition-colors border-l-2 
                      ${slot.champion ? 'bg-team-blue/5 border-team-blue glow-team-blue' : 
                        isSelectable ? 'cursor-pointer border-team-blue/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] bg-team-blue/10 hover:bg-team-blue/20' : 
                        'opacity-40 border-transparent'}
                      ${isActive ? 'border-team-blue bg-team-blue/30 animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.8)]' : ''}
                      ${isSwapSource ? 'border-l-4 border-l-electric-green border-dashed bg-electric-green/5 shadow-[0_0_16px_rgba(210,255,100,0.25)]' : ''}
                      ${isSwapTarget ? 'border-l-4 border-l-team-blue bg-team-blue/20 shadow-[0_0_16px_rgba(59,130,246,0.4)]' : ''}
                      ${isSwappable && !isSwapSource && !isSwapTarget ? 'cursor-pointer hover:border-electric-green/60' : ''}`}
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
                    {slot.champion && (
                      isSwappable
                        ? <span className="material-symbols-outlined text-electric-green/70">swap_horiz</span>
                        : <span className="material-symbols-outlined text-team-blue/50 drop-glow-team-blue">check_circle</span>
                    )}
                  </div>
                )})}
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
                        <div className="h-full bg-team-blue transition-all duration-1000 glow-team-blue" style={{ width: `${blueWinChance}%` }}></div>
                        <div className="h-full bg-team-red transition-all duration-1000" style={{ width: `${100 - blueWinChance}%` }}></div>
                      </div>
                    </div>
                  </>
                );
              })()}

            </div>

            {/* Red Team Column */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 text-right">
              <div className="flex items-center justify-end border-r-4 border-team-red pr-4 py-2 bg-team-red/5 rounded-l">
                <span className="font-label-caps text-label-caps text-team-red font-bold">TEAM RED</span>
              </div>
              <div className="space-y-3">
                {redTeam.map((slot, idx) => {
                  const isSelectable = (!slot.champion && !isAITurnProcessing) && (draftMode === 'simulation' || (currentTurn && currentTurn.team === 'red' && currentTurn.action === 'pick'));
                  const isActive = (activeSlot?.team === 'red' && activeSlot?.index === idx && activeSlot?.type === 'pick') || (!activeSlot && currentTurn?.team === 'red' && currentTurn?.action === 'pick' && idx === nextRedPickIdx);
                  const isSwapSource = swapSource?.team === 'red' && swapSource?.index === idx;
                  const isSwapTarget = swapTarget?.team === 'red' && swapTarget?.index === idx;
                  const isSwappable = isDraftComplete && !reportConfirmed && canSwapTeam('red') && slot.champion;

                  return (
                  <div
                    key={idx}
                    onClick={() => handlePickSlotClick('red', idx, slot.role)}
                    className={`glass-panel p-3 flex flex-row-reverse items-center gap-4 group transition-colors border-r-2 
                      ${slot.champion ? 'bg-team-red/5 border-team-red glow-team-red' : 
                        isSelectable ? 'cursor-pointer border-team-red/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] bg-team-red/10 hover:bg-team-red/20' : 
                        'opacity-40 border-transparent'}
                      ${isActive ? 'border-team-red bg-team-red/30 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.8)]' : ''}
                      ${isSwapSource ? 'border-r-4 border-r-electric-green border-dashed bg-electric-green/5 shadow-[0_0_16px_rgba(210,255,100,0.25)]' : ''}
                      ${isSwapTarget ? 'border-r-4 border-r-team-red bg-team-red/20 shadow-[0_0_16px_rgba(239,68,68,0.4)]' : ''}
                      ${isSwappable && !isSwapSource && !isSwapTarget ? 'cursor-pointer hover:border-electric-green/60' : ''}`}
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
                    {slot.champion && (
                      isSwappable
                        ? <span className="material-symbols-outlined text-electric-green/70">swap_horiz</span>
                        : <span className="material-symbols-outlined text-team-red/50 drop-glow-team-red">check_circle</span>
                    )}
                  </div>
                )})}
              </div>
            </div>
          </div>

          <div className="glass-panel p-card-padding rounded-xl relative overflow-hidden mt-12">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-team-blue via-electric-green to-team-red opacity-50"></div>
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-electric-green" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
              <h3 className="font-label-caps text-label-caps text-on-surface font-bold">AI DRAFT INTELLIGENCE REPORT</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {!showFullReport ? (
                <>
              {/* Draft Sequence Log — in-draft & pre-confirm */}
              <div className={`${isDraftComplete ? 'lg:col-span-12' : 'lg:col-span-5'} bg-black/40 rounded-lg p-5 ${isDraftComplete ? 'h-auto' : 'h-[480px] overflow-y-auto'} font-label-mono text-sm`}>
                <h4 className="text-electric-green mb-4 pb-2 flex justify-between items-center">
                  <span>DRAFT SEQUENCE LOG</span>
                  <span className="text-[10px] text-on-surface-variant">ROUND-BY-ROUND</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {draftLog.map(log => (
                  <div key={log.round} className={`ml-2 pl-5 py-2 border-l-2 ${log.team === 'blue' ? 'border-team-blue' : 'border-team-red'}`}>
                    <div className="text-on-surface-variant text-[10px] mb-1">STEP {log.round} - {log.label}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={log.team === 'blue' ? 'text-team-blue font-bold' : 'text-team-red font-bold'}>
                        {log.team.toUpperCase()} {log.action}
                      </span>
                      <ChampBadge name={log.champion} teamColor={log.team} size="sm" />
                      {log.role && <span className="text-on-surface-variant text-[10px]">({log.role})</span>}
                    </div>
                  </div>
                ))}
                </div>
                {draftLog.length === 0 && <span className="text-on-surface-variant/50">Awaiting initial selections...</span>}
              </div>

              {!isDraftComplete && (
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
                <div className="bg-surface-container/30 p-4 rounded border border-white/5">
                  <p className="font-label-caps text-[10px] text-team-blue mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-team-blue glow-team-blue"></span> TEAM STRENGTHS
                  </p>
                  <ul className="space-y-2">
                    {strengthsList.map(item => (
                      <li key={item.id} className="font-body-sm text-on-surface-variant flex items-start gap-2">
                        <span className="material-symbols-outlined text-[14px] mt-1 text-team-blue">check</span>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-surface-container/30 p-4 rounded border border-white/5">
                  <p className="font-label-caps text-[10px] text-team-red mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-team-red glow-team-red"></span> TEAM WEAKNESSES
                  </p>
                  <ul className="space-y-2">
                    {weaknessesList.map(item => (
                      <li key={item.id} className="font-body-sm text-on-surface-variant flex items-start gap-2">
                        <span className="material-symbols-outlined text-[14px] mt-1 text-team-red">warning</span>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-surface-container/30 p-4 rounded border border-white/5">
                  <p className="font-label-caps text-[10px] text-electric-green mb-3">RECOMMENDED PICKS</p>
                  <div className="flex gap-3">
                    {showRecommendedPicks ? (
                      predictionReport.recommendedPicks.map((champName, idx) => {
                        const champImg = getChampImageByName(champName);
                        return (
                          <div
                            key={idx}
                            onClick={() => handleRecommendationClick(champName)}
                            className={`w-12 h-12 bg-surface-container rounded border flex items-center justify-center transition-all relative
                              ${idx === 0 ? 'border-electric-green glow-green' : 'border-electric-green/40'}
                              ${activeSlot && activeSlot.type === 'pick' ? 'cursor-pointer hover:border-electric-green hover:glow-green' : 'cursor-default opacity-50'}`}
                            title={activeSlot ? `Select ${champName} for active slot` : champName}
                          >
                            {champImg ? (
                              <img alt={champName} className="w-10 h-10 object-cover rounded-sm" src={champImg} />
                            ) : (
                              <span className="text-[10px] text-electric-green">{champName}</span>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-body-sm text-on-surface-variant">
                        {isTeamMode && !isUserTurn ? 'Awaiting opponent turn...' : currentTurn?.action === 'ban' ? 'Recommendations appear on pick steps' : 'No recommendations available'}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="bg-surface-container/30 p-4 rounded border border-white/5">
                  <p className="font-label-caps text-[10px] text-team-red mb-3">RECOMMENDED BANS</p>
                  <div className="flex gap-3">
                    {showRecommendedBans ? (
                      predictionReport.recommendedBans.map((champName, idx) => {
                        const champImg = getChampImageByName(champName);
                        return (
                          <div
                            key={idx}
                            onClick={() => handleRecommendationClick(champName)}
                            className={`w-12 h-12 bg-surface-container rounded border flex items-center justify-center transition-all grayscale opacity-60 hover:grayscale-0 hover:opacity-100 relative
                              ${idx === 0 ? 'border-team-red glow-red' : 'border-team-red/40'}
                              ${activeSlot && activeSlot.type === 'ban' ? 'cursor-pointer hover:border-team-red' : 'cursor-default opacity-30'}`}
                            title={activeSlot ? `Select ${champName} for active slot` : champName}
                          >
                            {champImg ? (
                              <img alt={champName} className="w-10 h-10 object-cover rounded-sm" src={champImg} />
                            ) : (
                              <span className="text-[10px] text-team-red">{champName}</span>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-body-sm text-on-surface-variant">
                        {isTeamMode && !isUserTurn ? 'Awaiting opponent turn...' : currentTurn?.action === 'pick' ? 'Recommendations appear on ban steps' : 'No recommendations available'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              )}
                </>
              ) : draftOverview && (
              /* Full detailed report after confirm */
              <div className="lg:col-span-12 flex flex-col gap-6">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-black/60 via-surface-container/40 to-black/60 p-6">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-team-blue via-electric-green to-team-red opacity-80" />
                  <p className="font-label-caps text-[10px] text-electric-green mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">summarize</span> EXECUTIVE SUMMARY
                  </p>
                  <p className="font-body-md text-on-surface mb-3">{draftOverview.summary}</p>
                  <p className="font-body-sm text-on-surface-variant">{draftOverview.matchupVerdict}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-xl bg-team-blue/5 p-5">
                    <p className="font-label-caps text-[10px] text-team-blue mb-4 font-bold">BLUE BAN PHASE</p>
                    <ul className="space-y-3">
                      {draftOverview.blueBanAnalysis.map(ban => (
                        <li key={`bb-${ban.slot}`} className="font-body-sm text-on-surface-variant flex items-start gap-3">
                          <span className="text-team-blue font-bold shrink-0">BAN {ban.slot}</span>
                          <div>
                            <ChampBadge name={ban.name} teamColor="blue" size="sm" />
                            <p className="text-xs mt-1 opacity-80">{ban.analysis}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-team-red/5 p-5">
                    <p className="font-label-caps text-[10px] text-team-red mb-4 font-bold">RED BAN PHASE</p>
                    <ul className="space-y-3">
                      {draftOverview.redBanAnalysis.map(ban => (
                        <li key={`rb-${ban.slot}`} className="font-body-sm text-on-surface-variant flex items-start gap-3">
                          <span className="text-team-red font-bold shrink-0">BAN {ban.slot}</span>
                          <div>
                            <ChampBadge name={ban.name} teamColor="red" size="sm" />
                            <p className="text-xs mt-1 opacity-80">{ban.analysis}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-xl bg-gradient-to-b from-team-blue/10 to-transparent p-5">
                    <p className="font-label-caps text-[10px] text-team-blue mb-4 font-bold">BLUE COMPOSITION</p>
                    <ul className="space-y-3">
                      {draftOverview.blueComposition.map(pick => (
                        <li key={`bp-${pick.role}`} className="flex items-start gap-3">
                          <span className="text-team-blue font-label-caps text-[10px] w-14 shrink-0 pt-2">{pick.role}</span>
                          <div className="flex-1">
                            <ChampBadge name={pick.name} teamColor="blue" size="md" />
                            <p className="text-xs text-on-surface-variant mt-1">{pick.analysis}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-gradient-to-b from-team-red/10 to-transparent p-5">
                    <p className="font-label-caps text-[10px] text-team-red mb-4 font-bold">RED COMPOSITION</p>
                    <ul className="space-y-3">
                      {draftOverview.redComposition.map(pick => (
                        <li key={`rp-${pick.role}`} className="flex items-start gap-3">
                          <span className="text-team-red font-label-caps text-[10px] w-14 shrink-0 pt-2">{pick.role}</span>
                          <div className="flex-1">
                            <ChampBadge name={pick.name} teamColor="red" size="md" />
                            <p className="text-xs text-on-surface-variant mt-1">{pick.analysis}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl bg-black/30 p-5">
                  <p className="font-label-caps text-[10px] text-electric-green mb-4 font-bold">PICK ORDER REVIEW</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {draftOverview.pickTimeline.map(entry => (
                      <div key={`pick-${entry.round}`} className={`rounded-lg p-3 ${entry.team === 'blue' ? 'bg-team-blue/5' : 'bg-team-red/5'}`}>
                        <div className="text-on-surface-variant text-[10px] mb-2">STEP {entry.round} — {entry.label}</div>
                        <div className="mb-1">
                          <span className={`text-[10px] font-bold ${entry.team === 'blue' ? 'text-team-blue' : 'text-team-red'}`}>
                            {entry.team.toUpperCase()} PICK
                          </span>
                        </div>
                        <ChampBadge name={entry.champion} teamColor={entry.team} size="sm" />
                        {entry.role && <span className="text-on-surface-variant text-[10px] ml-1">({entry.role})</span>}
                        <p className="text-[10px] text-on-surface-variant mt-2 leading-relaxed">{entry.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-xl bg-team-blue/5 p-5">
                    <p className="font-label-caps text-[10px] text-team-blue mb-2 font-bold">BLUE TEAM SYNERGY</p>
                    <p className="font-body-sm text-on-surface-variant mb-4 text-xs">{draftOverview.blueSynergy.compArchetype}</p>
                    <div className="space-y-3">
                      {draftOverview.blueSynergy.pairs.map((pair, i) => (
                        <SynergyPairCard key={`bs-${i}`} pair={pair} teamColor="blue" />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl bg-team-red/5 p-5">
                    <p className="font-label-caps text-[10px] text-team-red mb-2 font-bold">RED TEAM SYNERGY</p>
                    <p className="font-body-sm text-on-surface-variant mb-4 text-xs">{draftOverview.redSynergy.compArchetype}</p>
                    <div className="space-y-3">
                      {draftOverview.redSynergy.pairs.map((pair, i) => (
                        <SynergyPairCard key={`rs-${i}`} pair={pair} teamColor="red" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-gradient-to-r from-team-blue/5 via-electric-green/5 to-team-red/5 p-5">
                  <p className="font-label-caps text-[10px] text-electric-green mb-4 font-bold">KEY MATCHUP FACTORS</p>
                  <ul className="space-y-2">
                    {draftOverview.keyFactors.map((factor, i) => (
                      <li key={`kf-${i}`} className="font-body-sm text-on-surface-variant flex items-start gap-2">
                        <span className="material-symbols-outlined text-[14px] mt-0.5 text-electric-green shrink-0">insights</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-black/40 p-5">
                  <h4 className="text-electric-green mb-4 pb-2 flex justify-between items-center font-label-caps text-[10px]">
                    <span>DRAFT SEQUENCE LOG</span>
                    <span className="text-on-surface-variant">ROUND-BY-ROUND</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {draftLog.map(log => (
                      <div key={log.round} className={`rounded-lg p-3 ${log.team === 'blue' ? 'bg-team-blue/5' : 'bg-team-red/5'}`}>
                        <div className="text-on-surface-variant text-[10px] mb-2">STEP {log.round} - {log.label}</div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold ${log.team === 'blue' ? 'text-team-blue' : 'text-team-red'}`}>
                            {log.team.toUpperCase()} {log.action}
                          </span>
                          <ChampBadge name={log.champion} teamColor={log.team} size="sm" />
                          {log.role && <span className="text-on-surface-variant text-[10px]">({log.role})</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>

          <div className="mt-auto pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-label-mono text-[10px] text-on-surface-variant uppercase">DRAFT SEQUENCE TIMELINE</h4>
            </div>
            <div className="relative h-16 glass-panel rounded flex items-center px-4 gap-2 overflow-x-auto no-scrollbar">
              {DRAFT_SEQUENCE.map((turn, idx) => {
                const isPast = idx < currentTurnIndex;
                const isCurrent = idx === currentTurnIndex;
                const bgClass = turn.team === 'blue' ? 'bg-team-blue' : 'bg-team-red';
                const borderClass = turn.team === 'blue' ? 'border-team-blue' : 'border-team-red';
                const textColor = turn.team === 'blue' ? 'text-team-blue' : 'text-team-red';
                
                return (
                  <div key={idx} className="flex gap-2 relative flex-shrink-0">
                    <div className={`w-10 h-10 border rounded flex flex-col items-center justify-center transition-all
                      ${isCurrent ? `${bgClass}/20 border-2 ${borderClass} ${turn.team === 'blue' ? 'glow-team-blue' : 'glow-team-red'} scale-110` : 
                        isPast ? `${turn.team === 'blue' ? 'bg-team-blue-light border-2 border-team-blue-light' : 'bg-team-red-light border-2 border-team-red-light'} opacity-90` : 
                        'bg-surface-container border-white/10 opacity-40'}`}>
                      <span className={`text-[8px] font-bold ${isCurrent ? textColor : isPast ? (turn.team === 'blue' ? 'text-team-blue-light' : 'text-team-red-light') : 'text-on-surface-variant'}`}>{turn.label}</span>
                      <span className={`text-[10px] font-label-caps ${isCurrent ? textColor : isPast ? (turn.team === 'blue' ? 'text-team-blue-light' : 'text-team-red-light') : 'text-on-surface-variant'}`}>
                        {turn.action.substring(0,3).toUpperCase()}
                      </span>
                    </div>
                    {isCurrent && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                        <span className={`material-symbols-outlined text-[16px] drop-glow-${turn.team} ${textColor}`}>arrow_drop_down</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Champion Selection Card Overlay */}
      {activeSlot && (() => {
        const filteredChampions = champions.filter(champ =>
          roleFilter !== 'ALL' ? champ.roles.includes(roleFilter) : true
        );

        const sortedChampions = [...filteredChampions].sort((a, b) => {
          const suggestedName = activeSlot.type === 'pick' ? topSuggestedPick : topSuggestedBan;
          if (suggestedName && roleFilter === 'ALL') {
            if (a.name === suggestedName) return -1;
            if (b.name === suggestedName) return 1;
          }
          return 0;
        });
        
        const pickedNames = new Set([
          ...blueTeam.filter(t => t.champion).map(t => t.champion.name),
          ...redTeam.filter(t => t.champion).map(t => t.champion.name),
          ...blueBans.filter(b => b).map(b => b.name),
          ...redBans.filter(b => b).map(b => b.name)
        ]);

        return (
          <div className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-[#16171d] px-8 py-4">
            <div className="glass-panel w-full max-w-container-max mx-auto rounded-xl flex flex-col overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black/30">
                <div className="flex flex-col gap-2">
                  <span className="font-label-caps text-xs text-pure-white font-bold tracking-widest uppercase">
                    SELECTING {activeSlot.team} {activeSlot.type} {activeSlot.role ? `(${activeSlot.role})` : ''}
                  </span>
                  <div className="flex gap-2">
                    {['ALL', 'TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'].map(role => (
                      <button
                        key={role}
                        onClick={() => setRoleFilter(role)}
                        className={`px-3 py-1 rounded text-[10px] font-label-caps transition-colors ${
                          roleFilter === role ? 'bg-electric-green text-black font-bold' : 'bg-surface-container text-on-surface hover:bg-white/10'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setActiveSlot(null)} className="text-on-surface-variant hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
              <div className="p-4 pb-6">
                <div className="flex flex-wrap gap-[6px] justify-center items-start content-start">
                {sortedChampions.map(champ => {
                  const isPicked = pickedNames.has(champ.name);
                  const isSuggestedPick = !isPicked && topSuggestedPick === champ.name && roleFilter === 'ALL' && activeSlot.type === 'pick';
                  const isSuggestedBan = !isPicked && topSuggestedBan === champ.name && roleFilter === 'ALL' && activeSlot.type === 'ban';
                  const isSuggested = isSuggestedPick || isSuggestedBan;
                  return (
                    <div
                      key={champ.id}
                      onClick={() => !isPicked && handleChampionSelect(champ)}
                      className={`group relative w-12 h-16 sm:w-14 sm:h-[72px] lg:w-[60px] lg:h-[84px] overflow-hidden border-2 transition-all z-10
                        ${isPicked ? 'opacity-30 grayscale cursor-not-allowed border-transparent' : 'cursor-pointer hover:-translate-y-1 hover:z-20'}
                        ${isSuggestedPick ? 'border-electric-green glow-green animate-pulse scale-105' : ''}
                        ${isSuggestedBan ? 'border-team-red glow-red animate-pulse scale-105 grayscale-[20%]' : ''}
                        ${!isPicked && !isSuggested ? 'border-transparent hover:border-electric-green shadow-md hover:shadow-electric-green/40' : ''}
                      `}
                    >
                      <img
                        src={champ.image}
                        alt={champ.name}
                        className={`w-full h-full object-cover transition-all duration-300 ${!isPicked && 'grayscale-[30%] group-hover:grayscale-0'}`}
                      />
                      {isPicked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <span className="material-symbols-outlined text-white text-2xl">block</span>
                        </div>
                      )}
                      {!isPicked && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                    </div>
                  );
                })}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </>
  );
}
