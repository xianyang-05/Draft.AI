import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { sendChatMessage, parsePreferencesFromReply, stripPrefsLine } from '../utils/ollamaChatClient';
import { getDraftContext } from '../utils/draftContextStore';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: 'Hi — I\'m your Draft.AI coach. Tell me your playstyle, champion pool, and draft priorities and I\'ll tailor pick/ban suggestions for you.',
};

export default function DraftChatbot() {
  const location = useLocation();
  const { preferences, mergeFromChat } = useUserPreferences();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const scrollRef = useRef(null);

  const showOnlyOnDraft = location.pathname !== '/draft';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const submitText = async (text) => {
    if (!text || loading) return;
    const userMsg = { role: 'user', content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    try {
      const chatHistory = nextMessages.filter(m => m.role === 'user' || m.role === 'assistant');
      const result = await sendChatMessage({ messages: chatHistory, preferences, draftContext: getDraftContext() });
      let reply = stripPrefsLine(result.reply);
      const parsed = result.preferencesUpdate || parsePreferencesFromReply(result.reply);
      if (parsed) mergeFromChat(parsed);
      if (!reply) reply = result.reply;
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    submitText(input.trim());
  };

  if (showOnlyOnDraft) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-full bg-electric-green text-black shadow-[0_0_24px_rgba(210,255,100,0.35)] flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
        aria-label="Open draft coach chat"
      >
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          {open ? 'close' : 'smart_toy'}
        </span>
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-[200] glass-panel rounded-xl border border-white/10 flex flex-col overflow-hidden shadow-2xl"
          style={{ width: 'min(440px, calc(100vw - 3rem))', height: 'min(580px, calc(100vh - 8rem))' }}
        >
          <div className="px-4 py-3 border-b border-white/10 bg-black/40 flex items-center gap-2">
            <span className="material-symbols-outlined text-electric-green">psychology</span>
            <div>
              <p className="font-label-caps text-[14px] text-pure-white">Draft.AI Coach</p>
              <p className="text-[12px] text-on-surface-variant">Ollama · ML backend</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[90%] rounded-lg px-3 py-2 text-[15px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'ml-auto bg-electric-green/20 text-pure-white border border-electric-green/30'
                    : 'mr-auto bg-surface-container text-on-surface-variant border border-white/10'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="mr-auto bg-surface-container rounded-lg px-3 py-2 text-[15px] text-on-surface-variant animate-pulse">
                Thinking...
              </div>
            )}
          </div>

          <div className="px-3 pt-2 pb-1 border-t border-white/10 bg-black/20 flex flex-wrap gap-1.5">
            {['Prefer scaling', 'Early aggression', 'Split push', 'Teamfight', 'Pick comp', 'Protect the carry'].map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => submitText(preset)}
                disabled={loading}
                className="px-2 py-1 rounded text-[13px] font-bold border border-electric-green/30 text-electric-green bg-electric-green/5 hover:bg-electric-green/15 disabled:opacity-30 transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
          <form onSubmit={handleSend} className="p-3 bg-black/30 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Share your draft plan or preferences..."
              className="flex-1 bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-[15px] text-pure-white focus:outline-none focus:border-electric-green"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-3 py-2 rounded-lg bg-electric-green text-black font-bold text-sm disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
