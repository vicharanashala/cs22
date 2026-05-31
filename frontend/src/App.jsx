import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Overview from './pages/Overview';
import FAQPage from './pages/FAQPage';
import VoiceAssistant from './components/VoiceAssistant';

const API_BASE = 'http://localhost:8000/api';
const THEME_KEY = 'vicharanashala_theme';

function App() {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Initialize from localStorage or default to dark
    if (typeof window !== 'undefined') {
      return localStorage.getItem(THEME_KEY) || 'dark';
    }
    return 'dark';
  });

  // Sync theme to document root element and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <BrowserRouter>
      <Header
        onVoiceToggle={() => setIsVoiceActive(true)}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/faq" element={<FAQPage />} />
      </Routes>
      <VoiceAssistant
        isOpen={isVoiceActive}
        onClose={() => setIsVoiceActive(false)}
        apiUrl={API_BASE}
      />
    </BrowserRouter>
  );
}

export default App;

