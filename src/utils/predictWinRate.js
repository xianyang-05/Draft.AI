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

/**
 * Predicts the Blue Side win probability.
 * Attempts to call the Python FastAPI server. If the server is offline or fails,
 * it falls back to client-side local calculation using draft_model.json.
 */
export async function predictWinRate(blueTeam, redTeam, blueBans, redBans, targetTeam) {
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
        recommendedPicks: data.recommendedPicks,
        recommendedBans: data.recommendedBans,
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

  const rawProbability = baseRate + blueContribution + redContribution;
  const finalProbability = Math.max(0.15, Math.min(0.85, rawProbability));
  const winChancePercentage = Math.round(finalProbability * 100);

  const recommendations = getRecommendations(blueTeam, redTeam, blueBans, redBans, targetTeam);

  return {
    blueWinChance: winChancePercentage,
    blueDetails: details.blueDetails,
    redDetails: details.redDetails,
    recommendedPicks: recommendations.recommendedPicks,
    recommendedBans: recommendations.recommendedBans,
    source: "Local Fallback"
  };
}

/**
 * Helper to compute champion draft contribution details.
 */
function getDraftDetails(blueTeam, redTeam) {
  const championValues = modelData.champion_values || {};
  const blueDetails = [];
  const redDetails = [];

  blueTeam.forEach(slot => {
    if (slot.champion) {
      const champName = slot.champion.name;
      const modelRole = ROLE_MAP[slot.role];
      const champData = championValues[champName];
      if (champData && champData.blue && champData.blue[modelRole]) {
        const val = champData.blue[modelRole].value;
        blueDetails.push({ name: champName, role: slot.role, value: val });
      }
    }
  });

  redTeam.forEach(slot => {
    if (slot.champion) {
      const champName = slot.champion.name;
      const modelRole = ROLE_MAP[slot.role];
      const champData = championValues[champName];
      if (champData && champData.red && champData.red[modelRole]) {
        const val = champData.red[modelRole].value;
        redDetails.push({ name: champName, role: slot.role, value: val });
      }
    }
  });

  return { blueDetails, redDetails };
}

/**
 * Recommends picks/bans locally.
 */
function getRecommendations(blueTeam, redTeam, blueBans, redBans, targetTeam) {
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

  const topPicks = [...sortedChamps]
    .filter(c => c.picks >= 10)
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map(c => c.name);

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

  const topBans = [...oppSortedChamps]
    .filter(c => c.picks >= 10)
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)
    .map(c => c.name);

  return { recommendedPicks: topPicks, recommendedBans: topBans };
}
