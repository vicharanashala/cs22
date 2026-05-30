import React, { useState, useRef, useEffect } from 'react';

function Chatbot({ apiUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: '1', text: "Hi! I'm Yaksha. Ask me anything about the Vicharanashala Internship.", sender: 'system' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const query = input.trim();
    if (!query) return;

    // Add user message
    const userMsg = { id: Date.now().toString(), text: query, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: data.answer,
        sender: 'system'
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "Sorry, I encountered an error. Please try again later.",
        sender: 'system'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-widget">
      <button 
        className="chat-toggle-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Chat"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </button>

      <div className={`chat-window glass-panel ${!isOpen ? 'hidden' : ''}`}>
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </div>
            <div>
              <h3>Yaksha Assistant</h3>
              <span className="status"><span className="dot"></span> Online</span>
            </div>
          </div>
          <button className="chat-close-btn" onClick={() => setIsOpen(false)}>&times;</button>
        </div>
        
        <div className="chat-body" ref={bodyRef}>
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <p>{msg.text}</p>
            </div>
          ))}
          
          {isTyping && (
            <div className="message loading">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          )}
        </div>
        
        <div className="chat-footer">
          <form id="chat-form" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Type your question..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off" 
            />
            <button type="submit" className="send-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
