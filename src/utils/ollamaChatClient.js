const OLLAMA_CHAT_URL = import.meta.env.VITE_OLLAMA_CHAT_URL || 'http://localhost:11434/api/chat';
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'llama3';
const BACKEND_CHAT_URL = 'http://127.0.0.1:8000/chat';

/**
 * Send a chat message to the draft coach. Tries backend first, then direct Ollama.
 */
export async function sendChatMessage({ messages, preferences, draftContext }) {
  try {
    const response = await fetch(BACKEND_CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, preferences, draftContext }),
    });
    if (response.ok) {
      const data = await response.json();
      return {
        reply: data.reply,
        preferencesUpdate: data.preferences_update || null,
        source: data.source || 'backend',
      };
    }
  } catch {
    // fall through to direct Ollama
  }

  return sendDirectOllamaChat({ messages, preferences, draftContext });
}

async function sendDirectOllamaChat({ messages, preferences, draftContext }) {
  const systemPrompt = buildSystemPrompt(preferences, draftContext);
  const ollamaMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ];

  try {
    const response = await fetch(OLLAMA_CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: ollamaMessages,
        stream: false,
      }),
    });

    if (!response.ok) throw new Error('Ollama chat failed');

    const data = await response.json();
    const reply = data.message?.content?.trim() || data.response?.trim() || 'I could not generate a response.';
    return { reply, preferencesUpdate: null, source: 'ollama-direct' };
  } catch (error) {
    console.error('Chat error:', error);
    return {
      reply: 'Draft coach is offline. Start Ollama locally or run the ML backend (`python ml/server.py`). I can still help once connected.',
      preferencesUpdate: null,
      source: 'fallback',
    };
  }
}

function buildSystemPrompt(preferences, draftContext) {
  const prefs = preferences || {};
  const ctx = draftContext || {};
  return `You are Draft.AI, an expert League of Legends draft coach connected to a win-rate prediction model.

User preferences:
- Playstyle: ${prefs.playstyle || 'balanced'}
- Priorities: ${(prefs.priorities || []).join(', ') || 'none set'}
- Favorite champions: ${(prefs.favoriteChampions || []).join(', ') || 'none set'}
- Ban targets: ${(prefs.banTargets || []).join(', ') || 'none set'}
- Risk tolerance: ${prefs.riskTolerance || 'medium'}
- Notes: ${prefs.strategyNotes || 'none'}

Current draft context:
- Blue win chance: ${ctx.blueWinChance ?? 50}%
- Mode: ${ctx.draftMode || 'simulation'}
- Blue picks: ${ctx.bluePicks || 'none'}
- Red picks: ${ctx.redPicks || 'none'}

Ask clarifying questions about the user's draft plan, preferences, and strategy. Give concise actionable advice aligned with their preferences. When you learn new preferences, summarize them at the end in a line starting with "PREFS:" followed by JSON like {"playstyle":"aggressive","priorities":["early game"],"favoriteChampions":["Lee Sin"]}.`;
}

export function parsePreferencesFromReply(reply) {
  const match = reply.match(/PREFS:\s*(\{[\s\S]*?\})/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

export function stripPrefsLine(reply) {
  return reply.replace(/\n?PREFS:\s*\{[\s\S]*?\}\s*$/, '').trim();
}
