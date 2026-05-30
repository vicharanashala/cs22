import React from 'react';
import { NavLink } from 'react-router-dom';

function Header({ onVoiceToggle }) {
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
        </nav>
      </div>
    </header>
  );
}

export default Header;
