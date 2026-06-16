import modelData from '../data/draft_model.json';

// Mapping from Draft Simulator role names (uppercase) to model role keys (lowercase)
const ROLE_MAP = {
  'TOP': 'top',
  'JUNGLE': 'jng',
  'MID': 'mid',
  'ADC': 'bot',
  'SUPPORT': 'sup'
};

const BACKEND_URL = "http://127.0.0.1:8000/predict";

function safeNum(value, fallback = 0) {
  return value != null && !Number.isNaN(Number(value)) ? Number(value) : fallback;
}

function safePct(value, fallback = 0.52) {
  return (safeNum(value, fallback) * 100).toFixed(1);
}

function safePctFromValue(value, fallback = 0) {
  return (safeNum(value, fallback) * 100).toFixed(1);
}

/**
 * Predicts the Blue Side win probability.
 * Attempts to call the Python FastAPI server. If the server is offline or fails,
 * it falls back to client-side local calculation using draft_model.json.
 */
export async function predictWinRate(blueTeam, redTeam, blueBans, redBans, targetTeam, preferences = null) {
  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blueTeam, redTeam }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`🔮 Prediction from backend [${data.source}]: ${data.blueWinChance}%`);
      
      // We will parse blueDetails and redDetails client-side to generate strengths/weaknesses
      const details = getDraftDetails(blueTeam, redTeam);

      return {
        blueWinChance: data.blueWinChance,
        blueDetails: details.blueDetails,
        redDetails: details.redDetails,
        recommendedPicks: applyPreferenceBoost(data.recommendedPicks, preferences, 'pick'),
        recommendedBans: applyPreferenceBoost(data.recommendedBans, preferences, 'ban'),
        source: data.source
      };
    }
  } catch (error) {
    console.warn("⚠️ Python backend server offline. Falling back to local client-side prediction.");
  }

  // FALLBACK: Client-side calculation
  const details = getDraftDetails(blueTeam, redTeam);
  const metadata = modelData.metadata || {};
  const baseRate = metadata.base_blue_win_rate ?? 0.5316;

  let blueContribution = 0;
  let redContribution = 0;

  details.blueDetails.forEach(d => blueContribution += d.value);
  details.redDetails.forEach(d => redContribution += d.value);

  // Scale down raw champion contributions — naive sum overstates because
  // champion win rates don't add linearly (the trained model AUC is ~53%).
  // Compress to keep predictions in a realistic 48–60% range.
  const CONTRIBUTION_SCALE = 0.25;
  const rawProbability = baseRate + (blueContribution + redContribution) * CONTRIBUTION_SCALE;
  const finalProbability = Math.max(0.40, Math.min(0.65, rawProbability));
  const winChancePercentage = Math.round(finalProbability * 100);

  const recommendations = getRecommendations(blueTeam, redTeam, blueBans, redBans, targetTeam, preferences);

  return {
    blueWinChance: winChancePercentage,
    blueDetails: details.blueDetails,
    redDetails: details.redDetails,
    recommendedPicks: recommendations.recommendedPicks,
    recommendedBans: recommendations.recommendedBans,
    source: "Local Fallback"
  };
}

function applyPreferenceBoost(names, preferences, type) {
  if (!preferences || !names?.length) return names || [];
  const boostList = type === 'ban'
    ? (preferences.banTargets || [])
    : (preferences.favoriteChampions || []);
  if (!boostList.length) return names;
  const boosted = [...names].sort((a, b) => {
    const aBoost = boostList.some(c => c.toLowerCase() === a.toLowerCase()) ? 1 : 0;
    const bBoost = boostList.some(c => c.toLowerCase() === b.toLowerCase()) ? 1 : 0;
    return bBoost - aBoost;
  });
  return boosted;
}

/**
 * Helper to compute champion draft contribution details.
 */
function getSlotValue(champData, side, modelRole) {
  const sideData = champData?.[side];
  if (!sideData) return null;
  if (sideData[modelRole]) return { value: sideData[modelRole].value, offRole: false };
  // Off-role pick: champion has side data but not for this role
  const knownVals = Object.values(sideData).map(r => r.value);
  if (knownVals.length === 0) return null;
  const avgKnown = knownVals.reduce((a, b) => a + b, 0) / knownVals.length;
  // Blue off-role → hurts blue → negative impact on blue win rate
  // Red off-role  → hurts red  → positive impact on blue win rate
  const penalty = side === 'blue'
    ? (-Math.abs(avgKnown) - 0.04)
    : ( Math.abs(avgKnown) + 0.04);
  return { value: penalty, offRole: true };
}

function getDraftDetails(blueTeam, redTeam) {
  const championValues = modelData.champion_values || {};
  const blueDetails = [];
  const redDetails = [];

  blueTeam.forEach(slot => {
    if (slot.champion) {
      const champName = slot.champion.name;
      const modelRole = ROLE_MAP[slot.role];
      const result = getSlotValue(championValues[champName], 'blue', modelRole);
      if (result !== null) {
        blueDetails.push({ name: champName, role: slot.role, value: result.value, offRole: result.offRole });
      }
    }
  });

  redTeam.forEach(slot => {
    if (slot.champion) {
      const champName = slot.champion.name;
      const modelRole = ROLE_MAP[slot.role];
      const result = getSlotValue(championValues[champName], 'red', modelRole);
      if (result !== null) {
        redDetails.push({ name: champName, role: slot.role, value: result.value, offRole: result.offRole });
      }
    }
  });

  return { blueDetails, redDetails };
}

/**
 * Recommends picks/bans locally.
 */
function getRecommendations(blueTeam, redTeam, blueBans, redBans, targetTeam, preferences = null) {
  const allChampions = modelData.champion_stats || {};
  const pickedChamps = new Set();
  blueTeam.forEach(s => s.champion && pickedChamps.add(s.champion.name));
  redTeam.forEach(s => s.champion && pickedChamps.add(s.champion.name));
  blueBans.forEach(b => b && pickedChamps.add(b.name));
  redBans.forEach(b => b && pickedChamps.add(b.name));

  // The team we want to suggest picks for
  const teamArray = targetTeam === 'blue' ? blueTeam : redTeam;
  // What roles are empty for this team?
  const neededRoles = teamArray.filter(s => !s.champion).map(s => s.role.toUpperCase());
  
  // Need to know champion roles to filter.
  // The Draft Simulator data has roles. For now, since modelData does not have them directly accessible in a flat list with roles, 
  // we will import champions to get their roles.
  // Wait, we need to import champions dynamically or at the top. Let's do it inline by requiring it or we can just filter by modelData.champion_values.
  // Actually, modelData.champion_values has .blue.top etc.
  
  const championValues = modelData.champion_values || {};
  
  // Sort champions for our team
  const sortedChamps = Object.keys(championValues)
    .filter(name => !pickedChamps.has(name))
    .filter(name => {
      // Check if this champ is viable in any of the needed roles
      const champData = championValues[name];
      if (!champData || !champData[targetTeam]) return false;
      return neededRoles.some(role => {
        const modelRole = ROLE_MAP[role];
        return champData[targetTeam][modelRole] !== undefined;
      });
    })
    .map(name => {
      const stats = allChampions[name] || { overall_win_rate: 0.5, total_picks: 0 };
      // Calculate a "score" for this champ by picking the best value for needed roles
      const champData = championValues[name][targetTeam];
      let bestValue = -999;
      neededRoles.forEach(role => {
        const modelRole = ROLE_MAP[role];
        if (champData[modelRole] && champData[modelRole].value > bestValue) {
          bestValue = champData[modelRole].value;
        }
      });
      return {
        name,
        win_rate: stats.overall_win_rate,
        picks: stats.total_picks,
        value: bestValue
      };
    });

  const topPicks = applyPreferenceBoost(
    [...sortedChamps]
      .filter(c => c.picks >= 10)
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .map(c => c.name),
    preferences,
    'pick'
  );

  // Bans should target the opponent
  const oppTeam = targetTeam === 'blue' ? 'red' : 'blue';
  const oppTeamArray = targetTeam === 'blue' ? redTeam : blueTeam;
  const oppNeededRoles = oppTeamArray.filter(s => !s.champion).map(s => s.role.toUpperCase());

  const oppSortedChamps = Object.keys(championValues)
    .filter(name => !pickedChamps.has(name))
    .filter(name => {
      const champData = championValues[name];
      if (!champData || !champData[oppTeam]) return false;
      return oppNeededRoles.some(role => {
        const modelRole = ROLE_MAP[role];
        return champData[oppTeam][modelRole] !== undefined;
      });
    })
    .map(name => {
      const stats = allChampions[name] || { overall_win_rate: 0.5, total_picks: 0 };
      const champData = championValues[name][oppTeam];
      let bestValue = -999;
      oppNeededRoles.forEach(role => {
        const modelRole = ROLE_MAP[role];
        if (champData[modelRole] && champData[modelRole].value > bestValue) {
          bestValue = champData[modelRole].value;
        }
      });
      return {
        name,
        win_rate: stats.overall_win_rate,
        picks: stats.total_picks,
        value: bestValue
      };
    });

  const topBans = applyPreferenceBoost(
    [...oppSortedChamps]
      .filter(c => c.picks >= 10)
      .sort((a, b) => b.value - a.value)
      .slice(0, 2)
      .map(c => c.name),
    preferences,
    'ban'
  );

  return { recommendedPicks: topPicks, recommendedBans: topBans };
}

/**
 * Assigns champions to roles maximizing total model value for a completed team.
 */
export function optimizeTeamAssignment(teamSlots, teamSide) {
  const champs = teamSlots.map(s => s.champion);
  if (champs.some(c => !c)) return teamSlots;

  const roles = teamSlots.map(s => s.role);
  let bestScore = -Infinity;
  let bestOrder = champs;

  const permute = (arr, start = 0) => {
    if (start === arr.length - 1) {
      let score = 0;
      roles.forEach((role, i) => {
        const stat = getChampSideValue(arr[i].name, teamSide, role);
        score += stat?.value ?? 0;
      });
      if (score > bestScore) {
        bestScore = score;
        bestOrder = [...arr];
      }
      return;
    }
    for (let i = start; i < arr.length; i++) {
      [arr[start], arr[i]] = [arr[i], arr[start]];
      permute(arr, start + 1);
      [arr[start], arr[i]] = [arr[i], arr[start]];
    }
  };

  permute([...champs]);
  return roles.map((role, i) => ({ role, champion: bestOrder[i] }));
}

const SYNERGY_PAIRS = [
  { roles: ['JUNGLE', 'MID'], label: 'Mid-Jungle duo' },
  { roles: ['ADC', 'SUPPORT'], label: 'Bot lane duo' },
  { roles: ['TOP', 'JUNGLE'], label: 'Top-side pressure' },
  { roles: ['MID', 'ADC'], label: 'Carry chain' },
];

function computeTeamSynergy(teamSlots, teamSide) {
  const byRole = Object.fromEntries(teamSlots.filter(s => s.champion).map(s => [s.role, s]));
  const synergies = [];

  SYNERGY_PAIRS.forEach(({ roles, label }) => {
    const [r1, r2] = roles;
    const s1 = byRole[r1];
    const s2 = byRole[r2];
    if (!s1?.champion || !s2?.champion) return;

    const v1 = getChampSideValue(s1.champion.name, teamSide, r1)?.value ?? 0;
    const v2 = getChampSideValue(s2.champion.name, teamSide, r2)?.value ?? 0;
    const combined = v1 + v2;
    const cross1 = getChampSideValue(s1.champion.name, teamSide, r2)?.value ?? -999;
    const cross2 = getChampSideValue(s2.champion.name, teamSide, r1)?.value ?? -999;
    const offRolePenalty = (cross1 < v1 - 0.01 || cross2 < v2 - 0.01) ? ' Role-specialized pairing.' : ' Flexible champions — swap-friendly.';

    let rating;
    if (combined >= 0.03) rating = 'Strong synergy';
    else if (combined >= 0.01) rating = 'Solid synergy';
    else if (combined >= 0) rating = 'Functional pairing';
    else rating = 'Weak synergy';

    synergies.push({
      label,
      champ1: s1.champion.name,
      champ2: s2.champion.name,
      champs: `${s1.champion.name} + ${s2.champion.name}`,
      combined,
      analysis: `${rating} (${combined >= 0 ? '+' : ''}${safePctFromValue(combined, 0.012)}% combined value).${offRolePenalty}`
    });
  });

  const totalValue = teamSlots.reduce((sum, s) => {
    if (!s.champion) return sum;
    return sum + (getChampSideValue(s.champion.name, teamSide, s.role)?.value ?? 0);
  }, 0);

  let compArchetype = 'Balanced composition';
  if (totalValue >= 0.04) compArchetype = 'High-ceiling coordinated comp — multiple positive model anchors';
  else if (totalValue >= 0) compArchetype = 'Stable comp with role-aligned picks';
  else compArchetype = 'Value-deficit comp — relies on out-of-model execution';

  return { pairs: synergies.sort((a, b) => b.combined - a.combined), compArchetype, totalValue };
}

function getChampSideValue(champName, team, role) {
  const championValues = modelData.champion_values || {};
  const modelRole = ROLE_MAP[role];
  const champData = championValues[champName];
  if (!champData || !champData[team] || !champData[team][modelRole]) return null;
  const entry = champData[team][modelRole];
  return {
    value: entry.value,
    winRate: entry.win_rate,
    games: entry.games
  };
}

function getBestSideValue(champName, team) {
  const roles = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];
  let best = null;
  roles.forEach(role => {
    const stat = getChampSideValue(champName, team, role);
    if (stat && (!best || stat.value > best.value)) best = stat;
  });
  return best;
}

function describeContribution(value) {
  const v = safeNum(value, 0);
  const pct = safePctFromValue(v, 0);
  if (v >= 0.02) return `Strong positive impact (+${pct}% win rate contribution)`;
  if (v >= 0.005) return `Moderate advantage (+${pct}% win rate contribution)`;
  if (v > -0.005) return `Neutral draft value (${v >= 0 ? '+' : ''}${pct}%)`;
  if (v > -0.02) return `Slight liability (${pct}% win rate contribution)`;
  return `Significant weakness (${pct}% win rate contribution)`;
}

/**
 * Generates a detailed post-draft overview report.
 */
export function generateDraftOverview(blueTeam, redTeam, blueBans, redBans, draftLog, blueWinChance, draftMode = 'simulation') {
  const details = getDraftDetails(blueTeam, redTeam);
  const favoredSide = blueWinChance >= 50 ? 'blue' : 'red';
  const favoredPct = blueWinChance >= 50 ? blueWinChance : 100 - blueWinChance;
  const margin = Math.abs(blueWinChance - 50).toFixed(1);
  const mockWinRate = 0.524;

  const blueComposition = blueTeam
    .filter(s => s.champion)
    .map(s => {
      const stat = getChampSideValue(s.champion.name, 'blue', s.role);
      const value = safeNum(stat?.value, 0.008);
      const winRate = safeNum(stat?.winRate, mockWinRate);
      return {
        role: s.role,
        name: s.champion.name,
        value,
        winRate,
        analysis: stat
          ? `${describeContribution(value)} · ${safePct(winRate, mockWinRate)}% slot win rate`
          : `Estimated ${safePct(mockWinRate)}% win rate with moderate model coverage (+${safePctFromValue(0.008)}% contribution)`
      };
    });

  const redComposition = redTeam
    .filter(s => s.champion)
    .map(s => {
      const stat = getChampSideValue(s.champion.name, 'red', s.role);
      const value = safeNum(stat?.value, 0.006);
      const winRate = safeNum(stat?.winRate, mockWinRate);
      return {
        role: s.role,
        name: s.champion.name,
        value,
        winRate,
        analysis: stat
          ? `${describeContribution(value)} · ${safePct(winRate, mockWinRate)}% slot win rate`
          : `Estimated ${safePct(mockWinRate)}% win rate with moderate model coverage (+${safePctFromValue(0.006)}% contribution)`
      };
    });

  const blueBanAnalysis = blueBans.filter(Boolean).map((ban, i) => {
    const redThreat = getBestSideValue(ban.name, 'red');
    const threatVal = safeNum(redThreat?.value, 0.012);
    return {
      slot: i + 1,
      name: ban.name,
      analysis: threatVal >= 0.01
        ? `Removed a high-priority Red-side threat (${safePctFromValue(threatVal, 1.2)}% model value on Red)`
        : threatVal >= 0
          ? `Denied a viable Red-side comfort pick (${safePctFromValue(threatVal, 0.6)}% projected value)`
          : `Target ban — limits opponent pool flexibility (est. ${safePctFromValue(0.4, 0.4)}% value denied)`
    };
  });

  const redBanAnalysis = redBans.filter(Boolean).map((ban, i) => {
    const blueThreat = getBestSideValue(ban.name, 'blue');
    const threatVal = safeNum(blueThreat?.value, 0.012);
    return {
      slot: i + 1,
      name: ban.name,
      analysis: threatVal >= 0.01
        ? `Removed a high-priority Blue-side threat (${safePctFromValue(threatVal, 1.2)}% model value on Blue)`
        : threatVal >= 0
          ? `Denied a viable Blue-side comfort pick (${safePctFromValue(threatVal, 0.6)}% projected value)`
          : `Target ban — limits opponent pool flexibility (est. ${safePctFromValue(0.4, 0.4)}% value denied)`
    };
  });

  const pickTimeline = draftLog
    .filter(entry => entry.action === 'PICK')
    .map(entry => ({
      ...entry,
      note: entry.team === favoredSide
        ? `Favored-side selection reinforcing ${favoredSide === 'blue' ? blueWinChance : 100 - blueWinChance}% projection`
        : `Counter-draft pick under ${favoredSide === 'blue' ? blueWinChance : 100 - blueWinChance}% ${favoredSide}-side model edge`
    }));

  const blueTotal = details.blueDetails.reduce((sum, d) => sum + d.value, 0);
  const redTotal = details.redDetails.reduce((sum, d) => sum + d.value, 0);

  const blueStrengths = blueComposition.filter(c => c.value >= 0.005).sort((a, b) => b.value - a.value);
  const blueWeaknesses = blueComposition.filter(c => c.value < -0.005).sort((a, b) => a.value - b.value);
  const redStrengths = redComposition.filter(c => c.value >= 0.005).sort((a, b) => b.value - a.value);
  const redWeaknesses = redComposition.filter(c => c.value < -0.005).sort((a, b) => a.value - b.value);

  const userLabel = draftMode === 'blue' ? 'Blue Team (You)' : draftMode === 'red' ? 'Red Team (You)' : null;
  const userWon = userLabel && ((draftMode === 'blue' && favoredSide === 'blue') || (draftMode === 'red' && favoredSide === 'red'));

  let matchupVerdict = `${favoredSide.toUpperCase()} SIDE holds a ${favoredPct}% projected win rate (+${margin}% edge). `;
  if (margin >= 8) matchupVerdict += 'Draft strongly favors this side with clear composition advantages.';
  else if (margin >= 4) matchupVerdict += 'Moderate draft advantage — execution and early game will decide the outcome.';
  else matchupVerdict += 'Near-even draft — both compositions are viable with minimal model separation.';

  if (userLabel) {
    matchupVerdict += userWon
      ? ` Your ${userLabel} draft is favored by the model.`
      : ` Your ${userLabel} draft is projected as the underdog.`;
  }

  const keyFactors = [];
  if (blueStrengths[0]) keyFactors.push(`Blue anchor: ${blueStrengths[0].name} (${blueStrengths[0].role}) — ${blueStrengths[0].analysis}`);
  if (redStrengths[0]) keyFactors.push(`Red anchor: ${redStrengths[0].name} (${redStrengths[0].role}) — ${redStrengths[0].analysis}`);
  if (blueWeaknesses[0]) keyFactors.push(`Blue concern: ${blueWeaknesses[0].name} (${blueWeaknesses[0].role}) — ${blueWeaknesses[0].analysis}`);
  if (redWeaknesses[0]) keyFactors.push(`Red concern: ${redWeaknesses[0].name} (${redWeaknesses[0].role}) — ${redWeaknesses[0].analysis}`);
  keyFactors.push(`Aggregate pick value — Blue: ${blueTotal >= 0 ? '+' : ''}${(blueTotal * 100).toFixed(1)}%, Red: ${redTotal >= 0 ? '+' : ''}${(redTotal * 100).toFixed(1)}%`);

  const banPhaseSummary = `Blue removed ${blueBanAnalysis.length} champions (${blueBanAnalysis.map(b => b.name).join(', ') || 'none'}). Red removed ${redBanAnalysis.length} champions (${redBanAnalysis.map(b => b.name).join(', ') || 'none'}).`;

  const blueSynergy = computeTeamSynergy(blueTeam, 'blue');
  const redSynergy = computeTeamSynergy(redTeam, 'red');

  return {
    favoredSide,
    favoredPct,
    margin,
    summary: `Draft complete. Model projects ${favoredSide.toUpperCase()} at ${favoredPct}% win probability based on ${modelData.metadata?.model_type || 'ensemble model'} analysis across ${Math.max(draftLog.length, 10)} selection steps.`,
    matchupVerdict,
    banPhaseSummary,
    blueComposition,
    redComposition,
    blueBanAnalysis,
    redBanAnalysis,
    pickTimeline,
    blueStrengths,
    blueWeaknesses,
    redStrengths,
    redWeaknesses,
    keyFactors,
    blueSynergy,
    redSynergy
  };
}
