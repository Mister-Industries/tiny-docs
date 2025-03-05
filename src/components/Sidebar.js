import React, { useState } from 'react';
import { Link } from 'gatsby';
import { navigationStructure } from '../data/navigationData';

const Sidebar = () => {
  const [openSections, setOpenSections] = useState([0]); // Open first section by default

  const toggleSection = (index) => {
    setOpenSections(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <h1>TinyCore ESP32</h1>
        <svg className="logo-icon" viewBox="0 0 100 100">
          <rect x="40" y="40" width="20" height="20" fill="#6bb4ff" />
          <circle cx="50" cy="50" r="30" stroke="#ffd76b" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="40" stroke="#ffd76b" strokeWidth="1" strokeDasharray="4 4" fill="none" />
        </svg>
      </div>
      <nav className="navigation">
        {navigationStructure.map((section, index) => (
          <div 
            key={index} 
            className={`nav-section ${openSections.includes(index) ? 'open' : ''}`}
          >
            <div 
              className="nav-section-title" 
              onClick={() => toggleSection(index)}
            >
              {section.title}
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path d="M2 4 L6 8 L10 4" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div className="nav-section-content">
              {section.items.map((item, itemIndex) => (
                <Link 
                  key={itemIndex} 
                  to={`/page/${item.id}`} 
                  className="nav-link"
                  activeClassName="active"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;