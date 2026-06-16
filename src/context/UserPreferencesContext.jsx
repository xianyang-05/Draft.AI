import React, { createContext, useContext, useState, useCallback } from 'react';

const defaultPreferences = {
  playstyle: 'balanced',
  priorities: [],
  favoriteChampions: [],
  banTargets: [],
  strategyNotes: '',
  riskTolerance: 'medium',
};

const UserPreferencesContext = createContext(null);

export function UserPreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(defaultPreferences);

  const updatePreferences = useCallback((updates) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  }, []);

  const mergeFromChat = useCallback((extracted) => {
    if (!extracted || typeof extracted !== 'object') return;
    setPreferences(prev => ({
      ...prev,
      playstyle: extracted.playstyle || prev.playstyle,
      priorities: extracted.priorities?.length ? extracted.priorities : prev.priorities,
      favoriteChampions: extracted.favoriteChampions?.length ? extracted.favoriteChampions : prev.favoriteChampions,
      banTargets: extracted.banTargets?.length ? extracted.banTargets : prev.banTargets,
      strategyNotes: extracted.strategyNotes || prev.strategyNotes,
      riskTolerance: extracted.riskTolerance || prev.riskTolerance,
    }));
  }, []);

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreferences, mergeFromChat }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const ctx = useContext(UserPreferencesContext);
  if (!ctx) {
    return {
      preferences: defaultPreferences,
      updatePreferences: () => {},
      mergeFromChat: () => {},
    };
  }
  return ctx;
}
