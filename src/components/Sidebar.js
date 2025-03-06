import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import { navigationStructure } from '../data/navigationData';
import { constellationData } from '../data/constellationData';

const Sidebar = () => {
  const [openSections, setOpenSections] = useState([0]); // Open first section by default
  const [expandedItems, setExpandedItems] = useState([]);
  
  // Check if we're in the browser before using window.location
  const isBrowser = typeof window !== 'undefined';
  
  // Determine current section and subpage from URL
  useEffect(() => {
    if (!isBrowser) return;
    
    const currentPath = window.location.pathname;
    const match = currentPath.match(/\/page\/([^/]+)(?:\/([^/]+))?/);
    
    if (match) {
      const currentSection = match[1];
      // const currentSubpage = match[2] || 'index';
      
      // Find and open the current section
      const sectionIndex = navigationStructure.findIndex(section => 
        section.items.some(item => item.id === currentSection)
      );
      
      if (sectionIndex >= 0 && !openSections.includes(sectionIndex)) {
        setOpenSections(prev => [...prev, sectionIndex]);
      }
      
      // Expand the current item to show subpages
      setExpandedItems(prev => {
        if (!prev.includes(currentSection)) {
          return [...prev, currentSection];
        }
        return prev;
      });
    }
  }, [isBrowser]);

  const toggleSection = (index) => {
    setOpenSections(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };
  
  const toggleItem = (id) => {
    setExpandedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Helper to get subpages for a given section item
  const getSubpages = (itemId) => {
    // Find the node in constellation data
    for (const key in constellationData) {
      const node = constellationData[key].nodes.find(node => node.id === itemId);
      if (node && node.subpages) {
        return node.subpages;
      }
    }
    return [];
  };
  
  // Check if a link is currently active
  const isActive = (section, subpage = null) => {
    if (!isBrowser) return false;
    
    const currentPath = window.location.pathname;
    
    if (subpage) {
      return currentPath === `/page/${section}/${subpage}`;
    } else {
      // Check if we're on any page in this section
      return currentPath.startsWith(`/page/${section}`);
    }
  };
  
  // Listen for URL changes
  useEffect(() => {
    if (!isBrowser) return;
    
    const handleLocationChange = () => {
      // Re-check which sections/items should be open based on new URL
      const currentPath = window.location.pathname;
      const match = currentPath.match(/\/page\/([^/]+)(?:\/([^/]+))?/);
      
      if (match) {
        const currentSection = match[1];
        
        // Find and open the current section
        const sectionIndex = navigationStructure.findIndex(section => 
          section.items.some(item => item.id === currentSection)
        );
        
        if (sectionIndex >= 0 && !openSections.includes(sectionIndex)) {
          setOpenSections(prev => [...prev, sectionIndex]);
        }
        
        // Expand the current item to show subpages
        setExpandedItems(prev => {
          if (!prev.includes(currentSection)) {
            return [...prev, currentSection];
          }
          return prev;
        });
      }
    };
    
    // Listen for URL changes
    window.addEventListener('popstate', handleLocationChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [isBrowser, openSections]);

  return (
    <div className="sidebar">
      <div className="logo">
        <svg className="logo-icon" viewBox="0 0 100 100">
          <rect x="40" y="40" width="20" height="20" fill="#6bb4ff" />
          <circle cx="50" cy="50" r="30" stroke="#ffd76b" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="40" stroke="#ffd76b" strokeWidth="1" strokeDasharray="4 4" fill="none" />
        </svg>
        <h1>tinyDocs</h1>
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
              {section.items.map((item, itemIndex) => {
                const subpages = getSubpages(item.id);
                const hasSubpages = subpages && subpages.length > 0;
                const isItemExpanded = expandedItems.includes(item.id);
                const isItemActive = isActive(item.id);
                
                return (
                  <div key={itemIndex} className="nav-item-container">
                    <div className="nav-item">
                      <Link 
                        to={`/page/${item.id}/index`} 
                        className={`nav-link ${isItemActive ? 'active' : ''}`}
                      >
                        {item.name}
                      </Link>
                      
                      {hasSubpages && (
                        <button 
                          className={`subpage-toggle ${isItemExpanded ? 'expanded' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleItem(item.id);
                          }}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10">
                            <path d="M2 4 L5 7 L8 4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    {/* Subpages */}
                    {hasSubpages && isItemExpanded && (
                      <div className="subpage-list">
                        {subpages.map((subpage, spIndex) => (
                          <Link
                            key={spIndex}
                            to={`/page/${item.id}/${subpage.id}`}
                            className={`subpage-link ${isActive(item.id, subpage.id) ? 'active' : ''}`}
                          >
                            {subpage.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;