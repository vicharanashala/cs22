import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Overview from './pages/Overview';
import FAQPage from './pages/FAQPage';
import VoiceAssistant from './components/VoiceAssistant';

const API_BASE = 'http://localhost:8000/api';
const THEME_KEY = 'vicharanashala_theme';
const LANG_KEY = 'vicharanashala_lang';

function App() {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(THEME_KEY) || 'dark';
    }
    return 'dark';
  });
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LANG_KEY) || 'en';
    }
    return 'en';
  });

  // Sync theme to document root element and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Persist language preference
  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  return (
    <BrowserRouter>
      <Header
        onVoiceToggle={() => setIsVoiceActive(true)}
        theme={theme}
        onThemeToggle={toggleTheme}
        lang={lang}
        onLangToggle={toggleLang}
      />
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/faq" element={<FAQPage lang={lang} />} />
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
