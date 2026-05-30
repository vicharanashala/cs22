import React, { useState, useEffect, useRef } from 'react';

function VoiceAssistant({ isOpen, onClose, apiUrl }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking' | 'error'
  const [transcriptList, setTranscriptList] = useState([]);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [micPermission, setMicPermission] = useState('prompt'); // 'prompt' | 'granted' | 'denied'
  const [voiceList, setVoiceList] = useState([]);

  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);
  const transcriptEndRef = useRef(null);
  
  // Keep track of active state and status in refs to prevent closures/race conditions
  const isOpenRef = useRef(isOpen);
  const statusRef = useRef(status);
  
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Load and monitor available TTS voices
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        setVoiceList(window.speechSynthesis.getVoices());
      }
    };
    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Scroll transcript window to bottom on new updates
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcriptList, interimTranscript]);

  // Main coordinator when overlay is opened/closed
  useEffect(() => {
    if (isOpen) {
      // Clear history when starting a new session
      setTranscriptList([
        { sender: 'system-info', text: "Yaksha is ready. Click the mic button if not listening." }
      ]);
      setInterimTranscript('');
      setStatus('idle');
      
      // Auto-start listening after a short delay for smooth transitions
      const timer = setTimeout(() => {
        if (isOpenRef.current) {
          startSpeechRecognition();
        }
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      // Cleanup thoroughly on close
      stopSpeechRecognition();
      silenceSpeechSynthesis();
    }
  }, [isOpen]);

  // Web Speech API: Stop Synthesis
  const silenceSpeechSynthesis = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (utteranceRef.current) {
      utteranceRef.current.onend = null;
      utteranceRef.current.onerror = null;
      utteranceRef.current = null;
    }
  };

  // Web Speech API: Stop Recognition
  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onstart = null;
      recognitionRef.current.onresult = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onend = null;
      try {
        recognitionRef.current.abort();
      } catch (err) {
        // ignore if already stopped
      }
      recognitionRef.current = null;
    }
  };

  // Web Speech API: Start Recognition
  const startSpeechRecognition = () => {
    // 1. Double check browser compatibility
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus('error');
      setTranscriptList(prev => [
        ...prev,
        { sender: 'system-info', text: "Web Speech Recognition is not supported by your browser. Please try Chrome, Edge, or Safari." }
      ]);
      return;
    }

    // 2. Shut down existing instances
    stopSpeechRecognition();
    silenceSpeechSynthesis();

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // Configure recognition settings
      recognition.continuous = false;      // Stop when speech ends for natural turn-taking
      recognition.interimResults = true;    // Real-time voice to text transcribing
      recognition.lang = 'en-IN';           // Indian-accented English is ideal for IIT Ropar

      recognition.onstart = () => {
        setStatus('listening');
        setMicPermission('granted');
        setInterimTranscript('');
      };

      recognition.onresult = (event) => {
        let interimText = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interimText += event.results[i][0].transcript;
          }
        }

        setInterimTranscript(interimText);

        if (final.trim()) {
          setInterimTranscript('');
          handleFinalInput(final.trim());
        }
      };

      recognition.onerror = (e) => {
        console.error('Speech recognition error:', e.error);
        if (e.error === 'not-allowed') {
          setMicPermission('denied');
          setStatus('error');
          setTranscriptList(prev => [
            ...prev,
            { sender: 'system-info', text: "Microphone blocked. Please grant access in your browser search/address bar." }
          ]);
        } else if (e.error === 'no-speech') {
          // Restart silently if we are still active
          if (isOpenRef.current && statusRef.current === 'listening') {
            restartListeningGracefully();
          }
        } else {
          setStatus('error');
          setTranscriptList(prev => [
            ...prev,
            { sender: 'system-info', text: `Error: ${e.error}. Try clicking the mic button.` }
          ]);
        }
      };

      recognition.onend = () => {
        // If recognition stops but we haven't moved to another state, auto-restart
        if (isOpenRef.current && statusRef.current === 'listening') {
          restartListeningGracefully();
        }
      };

      recognition.start();
    } catch (err) {
      console.error('Error starting recognition:', err);
      setStatus('error');
    }
  };

  // Helper to restart speech recognition without jarring UI flash
  const restartListeningGracefully = () => {
    if (!isOpenRef.current) return;
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        startSpeechRecognition();
      }
    } catch (err) {
      // if already starting, ignore
    }
  };

  // Handle final transcribed input: send to Yaksha agent
  const handleFinalInput = async (userInput) => {
    // 1. Stop mic while backend processes the request
    stopSpeechRecognition();
    setStatus('thinking');

    // 2. Append user transcript bubble
    setTranscriptList(prev => [
      ...prev,
      { sender: 'user', text: userInput }
    ]);

    try {
      // 3. Assemble chat query & basic history context (skipping instruction messages)
      const chatHistory = transcriptList
        .filter(t => t.sender === 'user' || t.sender === 'yaksha')
        .map(t => ({
          role: t.sender === 'user' ? 'user' : 'model',
          text: t.text
        }));

      // 4. Send request to backend
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userInput,
          history: chatHistory
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      
      // 5. Playback answer audibly
      speakTextBack(data.answer);

    } catch (err) {
      console.error('Voice assistant chat fetch error:', err);
      setStatus('error');
      setTranscriptList(prev => [
        ...prev,
        { sender: 'system-info', text: "Yaksha had trouble processing that question. Click the mic button to try again." }
      ]);
    }
  };

  // Web Speech API: Playback Yaksha Response Aloud
  const speakTextBack = (answerText) => {
    if (!window.speechSynthesis) {
      // No TTS: fall back to text only and listen again
      setTranscriptList(prev => [
        ...prev,
        { sender: 'yaksha', text: answerText }
      ]);
      setStatus('idle');
      startSpeechRecognition();
      return;
    }

    silenceSpeechSynthesis();

    try {
      const utterance = new SpeechSynthesisUtterance(answerText);
      utteranceRef.current = utterance;

      // Select high quality English voice (preferably Indian accent or female)
      let voice = voiceList.find(v => v.lang === 'en-IN' && v.name.toLowerCase().includes('google'));
      if (!voice) voice = voiceList.find(v => v.lang === 'en-IN');
      if (!voice) voice = voiceList.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'));
      if (!voice) voice = voiceList.find(v => v.lang.startsWith('en'));
      
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.rate = 1.05; // Slightly faster for dynamic interaction
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setStatus('speaking');
        setTranscriptList(prev => [
          ...prev,
          { sender: 'yaksha', text: answerText }
        ]);
      };

      utterance.onend = () => {
        utteranceRef.current = null;
        if (isOpenRef.current) {
          // Resume conversational listen loop automatically
          setStatus('listening');
          startSpeechRecognition();
        }
      };

      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        utteranceRef.current = null;
        if (isOpenRef.current) {
          setStatus('listening');
          startSpeechRecognition();
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Error speaking text:', err);
      // Fallback
      setTranscriptList(prev => [...prev, { sender: 'yaksha', text: answerText }]);
      setStatus('listening');
      startSpeechRecognition();
    }
  };

  // User Actions: Manual Click to Start/Restart Mic
  const handleMicToggle = () => {
    if (status === 'listening') {
      stopSpeechRecognition();
      setStatus('idle');
    } else {
      startSpeechRecognition();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`voice-overlay ${isOpen ? 'active' : ''}`}>
      {/* Header Controls */}
      <div className="voice-header">
        <div className="voice-title-container">
          <span className="voice-title-icon"></span>
          <h2>Yaksha Voice Assistant</h2>
        </div>
        <button 
          className="voice-close-btn" 
          onClick={onClose} 
          aria-label="Close Voice Assistant"
          title="Exit Voice Mode"
        >
          &times;
        </button>
      </div>

      {/* Pulsing visual wave and core states */}
      <div className="voice-visualizer-container">
        <div 
          className={`voice-orb ${status === 'listening' ? 'listening' : ''} ${status === 'thinking' ? 'thinking' : ''} ${status === 'speaking' ? 'speaking' : ''} ${status === 'error' ? 'error-state' : ''}`}
        ></div>

        <div className={`voice-status-text ${status === 'listening' ? 'listening' : ''} ${status === 'thinking' ? 'thinking' : ''} ${status === 'speaking' ? 'speaking' : ''} ${status === 'error' ? 'error-state' : ''}`}>
          {status === 'idle' && "Click mic button to speak"}
          {status === 'listening' && "Listening... Speak now"}
          {status === 'thinking' && "Thinking..."}
          {status === 'speaking' && "Yaksha speaking..."}
          {status === 'error' && "Assistant inactive"}
        </div>
      </div>

      {/* Floating real-time dialogue transcripts */}
      <div className="voice-transcript-window">
        {transcriptList.map((item, idx) => (
          <div key={idx} className={`voice-transcript-bubble ${item.sender}`}>
            {item.text}
          </div>
        ))}
        {interimTranscript && (
          <div className="voice-transcript-bubble user" style={{ opacity: 0.7 }}>
            {interimTranscript}
          </div>
        )}
        <div ref={transcriptEndRef} />
      </div>

      {/* Footer controls */}
      <div className="voice-controls">
        <button
          className={`voice-btn-round ${status === 'listening' ? 'mic-active' : ''}`}
          onClick={handleMicToggle}
          disabled={status === 'thinking'}
          title={status === 'listening' ? 'Mute microphone' : 'Turn on microphone'}
        >
          {status === 'listening' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="1" x2="23" y2="23"></line>
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
              <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default VoiceAssistant;
