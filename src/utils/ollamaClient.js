import { champions } from '../data/champions';

const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'llama3';
const OLLAMA_API_KEY = import.meta.env.VITE_OLLAMA_API_KEY || '';

/**
 * Gets an AI pick or ban decision from Ollama.
 * @param {Object} params
 * @param {Array} params.blueTeam Array of objects { role, champion }
 * @param {Array} params.redTeam Array of objects { role, champion }
 * @param {Array} params.blueBans Array of string names
 * @param {Array} params.redBans Array of string names
 * @param {string} params.action "pick" or "ban"
 * @param {string} params.team "blue" or "red"
 * @returns {Promise<Object>} The champion object selected by the AI
 */
export async function getAIPickOrBan({ blueTeam, redTeam, blueBans, redBans, action, team }) {
  const getNames = (teamArr) => teamArr.filter(t => t.champion).map(t => t.champion.name).join(', ') || 'None';
  
  const prompt = `You are an expert League of Legends draft coach.
Current Draft State:
Blue Team Picks: ${getNames(blueTeam)}
Red Team Picks: ${getNames(redTeam)}
Blue Team Bans: ${blueBans.join(', ') || 'None'}
Red Team Bans: ${redBans.join(', ') || 'None'}

It is currently ${team.toUpperCase()}'s turn to make a ${action.toUpperCase()}.
Based on synergy and counters, what ONE champion should they ${action}?
Respond ONLY with the name of the champion. Do not include any punctuation, explanation, or extra text.`;

  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (OLLAMA_API_KEY) {
      headers['Authorization'] = `Bearer ${OLLAMA_API_KEY}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    let champName = data.response.trim();
    
    // Clean up potential extra text just in case the LLM didn't perfectly follow instructions
    champName = champName.replace(/[.,]/g, '').split('\n')[0].trim();

    // Match with our champions database
    const selectedChamp = champions.find(c => c.name.toLowerCase() === champName.toLowerCase());
    
    if (selectedChamp) {
      return selectedChamp;
    } else {
      console.warn(`AI suggested unknown champion: ${champName}. Falling back to a random valid pick.`);
      return fallbackRandomSelection(blueTeam, redTeam, blueBans, redBans);
    }

  } catch (error) {
    console.error("Failed to fetch from Ollama, using fallback:", error);
    return fallbackRandomSelection(blueTeam, redTeam, blueBans, redBans);
  }
}

function fallbackRandomSelection(blueTeam, redTeam, blueBans, redBans) {
  const pickedNames = new Set([
    ...blueTeam.filter(t => t.champion).map(t => t.champion.name),
    ...redTeam.filter(t => t.champion).map(t => t.champion.name),
    ...blueBans,
    ...redBans
  ]);

  const availableChamps = champions.filter(c => !pickedNames.has(c.name));
  
  if (availableChamps.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * availableChamps.length);
  return availableChamps[randomIndex];
}
