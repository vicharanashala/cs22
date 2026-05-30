import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Overview from './pages/Overview';
import FAQPage from './pages/FAQPage';
import VoiceAssistant from './components/VoiceAssistant';

const API_BASE = 'http://localhost:8000/api';

function App() {
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  return (
    <BrowserRouter>
      <Header onVoiceToggle={() => setIsVoiceActive(true)} />
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
