import React from 'react';
import { NavLink } from 'react-router-dom';

function Header({ onVoiceToggle, theme, onThemeToggle }) {
  return (
    <header className="glass-header">
      <div className="header-container">
        <div className="logo">
          <div className="logo-icon"></div>
          <span>Vicharanashala Internship</span>
        </div>
        <nav>
          <NavLink to="/overview" className={({ isActive }) => isActive ? 'active' : ''}>
            Overview
          </NavLink>
          <NavLink to="/faq" className={({ isActive }) => isActive ? 'active' : ''}>
            FAQ
          </NavLink>
          <a
            href="#voice"
            onClick={(e) => {
              e.preventDefault();
              if (onVoiceToggle) onVoiceToggle();
            }}
            className="voice-nav-link"
          >
            Voice
          </a>

          {/* Theme Toggle: Sun (light) / Moon (dark) */}
          <button
            className="theme-toggle-btn"
            onClick={onThemeToggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              /* Sun icon — shown in dark mode, click to go light */
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              /* Moon icon — shown in light mode, click to go dark */
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
