import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import IntelligenceDashboard from './pages/IntelligenceDashboard';
import MetaInsights from './pages/MetaInsights';
import DraftSimulator from './pages/DraftSimulator';
import MatchAnalysis from './pages/MatchAnalysis';
import DraftChatbot from './components/DraftChatbot';
import { UserPreferencesProvider } from './context/UserPreferencesContext';
import './App.css';

function App() {
  return (
    <UserPreferencesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<IntelligenceDashboard />} />
          <Route path="/meta" element={<MetaInsights />} />
          <Route path="/draft" element={<DraftSimulator />} />
          <Route path="/match" element={<MatchAnalysis />} />
        </Routes>
        <DraftChatbot />
      </Router>
    </UserPreferencesProvider>
  );
}

export default App;
