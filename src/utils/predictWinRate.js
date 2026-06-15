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
export async function predictWinRate(blueTeam, redTeam) {
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

  const recommendations = getRecommendations(blueTeam, redTeam);

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
function getRecommendations(blueTeam, redTeam) {
  const allChampions = modelData.champion_stats || {};
  const pickedChamps = new Set();
  blueTeam.forEach(s => s.champion && pickedChamps.add(s.champion.name));
  redTeam.forEach(s => s.champion && pickedChamps.add(s.champion.name));

  const sortedChamps = Object.entries(allChampions)
    .filter(([name]) => !pickedChamps.has(name))
    .map(([name, stats]) => ({
      name,
      overall_win_rate: stats.overall_win_rate,
      total_picks: stats.total_picks
    }));

  const topPicks = [...sortedChamps]
    .filter(c => c.total_picks >= 50)
    .sort((a, b) => b.overall_win_rate - a.overall_win_rate)
    .slice(0, 3)
    .map(c => c.name);

  const topBans = [...sortedChamps]
    .filter(c => c.total_picks >= 50)
    .sort((a, b) => b.overall_win_rate - a.overall_win_rate)
    .slice(0, 2)
    .map(c => c.name);

  return { recommendedPicks: topPicks, recommendedBans: topBans };
}
