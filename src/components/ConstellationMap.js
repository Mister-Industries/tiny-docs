import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { navigate } from 'gatsby';
import { constellationData } from '../data/constellationData';

// Utility functions for tracking page progress
const getVisitedPages = () => {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem('visitedPages');
  return stored ? JSON.parse(stored) : {};
};

const markPageVisited = (section, subpage) => {
  if (typeof window === 'undefined') return;
  
  const visited = getVisitedPages();
  
  // Initialize section if it doesn't exist
  if (!visited[section]) {
    visited[section] = [];
  }
  
  // Add subpage if not already marked
  if (!visited[section].includes(subpage)) {
    visited[section].push(subpage);
    localStorage.setItem('visitedPages', JSON.stringify(visited));
  }
};

// Check if a specific page has been visited
const isPageVisited = (section, subpage) => {
  if (typeof window === 'undefined') return false;
  
  const visited = getVisitedPages();
  return visited[section] && visited[section].includes(subpage);
};

// Calculate completion percentage for a section
const getSectionCompletion = (section) => {
  const visited = getVisitedPages();
  const sectionData = findSectionData(section);
  
  if (!sectionData || !sectionData.subpages || !visited[section]) {
    return 0;
  }
  
  // +1 for the main page
  const totalPages = sectionData.subpages.length + 1;
  const visitedCount = visited[section].length;
  
  return Math.min(1, visitedCount / totalPages);
};

// Find section data in constellation
const findSectionData = (sectionId) => {
  for (const key in constellationData) {
    const found = constellationData[key].nodes.find(n => n.id === sectionId);
    if (found) return found;
  }
  return null;
};

const ConstellationMap = ({ nodes }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  
  // Track current page for automatic marking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Get current page path
    const path = window.location.pathname;
    const match = path.match(/\/page\/([^/]+)\/([^/]+)/);
    
    if (match) {
      const section = match[1];
      const subpage = match[2];
      
      // Mark this page as visited
      markPageVisited(section, subpage);
    }
  }, []);
  
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    
    // Clear any existing content to prevent ghosting
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Remove any existing tooltips or legends from previous renders
    d3.select(containerRef.current).selectAll(".node-tooltip").remove();
    d3.select(containerRef.current).selectAll(".constellation-legend").remove();
    
    const svg = d3.select(svgRef.current);
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    // Set initial dimensions
    svg.attr('width', width)
       .attr('height', height);
    
    // Save current transform when navigating away
    const saveViewState = (transform) => {
      if (transform) {
        localStorage.setItem('constellation_x', transform.x);
        localStorage.setItem('constellation_y', transform.y);
        localStorage.setItem('constellation_k', transform.k); // zoom level
      }
    };
    
    // Create container group for all content
    const container = svg.append('g');
    
    // Create tooltip div
    const tooltip = d3.select(containerRef.current)
      .append("div")
      .attr("class", "node-tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "rgba(22, 28, 44, 0.95)")
      .style("color", "white")
      .style("border-radius", "6px")
      .style("padding", "12px 16px")
      .style("box-shadow", "0 4px 12px rgba(0, 0, 0, 0.5)")
      .style("pointer-events", "none")
      .style("max-width", "300px")
      .style("z-index", "1000")
      .style("transition", "opacity 0.2s ease");
    
    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.2, 3])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
        // Hide tooltip when zooming
        tooltip.style("opacity", 0);
        
        // Only save state on user-initiated zoom events
        if (event.sourceEvent) {
          saveViewState(event.transform);
        }
      });
    
    // Apply zoom behavior to SVG
    svg.call(zoom)
      .on("dblclick.zoom", null);
    
    // Add background stars
    addBackgroundStars(container, width, height, 250);
    
    // Create a group for each constellation
    const constellations = {};
    Object.keys(constellationData).forEach(key => {
      constellations[key] = container.append('g')
        .attr('class', 'constellation-group')
        .attr('id', `constellation-${key}`);
    });
    
    // Draw links for each constellation
    Object.keys(constellationData).forEach(key => {
      const constellation = constellationData[key];
      
      // Create map of node IDs to node objects
      const nodeMap = {};
      constellation.nodes.forEach(node => {
        nodeMap[node.id] = node;
      });
      
      // Draw links
      constellation.links.forEach(link => {
        const sourceNode = nodeMap[link.source];
        const targetNode = nodeMap[link.target];
        
        // Handle links to nodes in other constellations
        const sourceX = sourceNode ? sourceNode.x : findNodeById(link.source).x;
        const sourceY = sourceNode ? sourceNode.y : findNodeById(link.source).y;
        const targetX = targetNode ? targetNode.x : findNodeById(link.target).x;
        const targetY = targetNode ? targetNode.y : findNodeById(link.target).y;
        
        constellations[key].append('line')
          .attr('class', 'link')
          .attr('x1', sourceX)
          .attr('y1', sourceY)
          .attr('x2', targetX)
          .attr('y2', targetY);
      });
    });
    
    // Create a function to show tooltip
    const showTooltip = (event, node, nodeData) => {
      // Extract description from markdown (first paragraph or excerpt)
      let description = "No description available";
      
      if (nodeData) {
        // Try to get description from excerpt or first paragraph of content
        if (nodeData.excerpt) {
          description = nodeData.excerpt;
        } else if (nodeData.html) {
          // Try to extract first paragraph from HTML
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = nodeData.html;
          const firstParagraph = tempDiv.querySelector("p");
          if (firstParagraph) {
            description = firstParagraph.textContent;
          }
        }
      }
      
      // Limit description length
      if (description.length > 150) {
        description = description.substring(0, 147) + "...";
      }
      
      // Get completion percentage
      const completion = getSectionCompletion(node.id) * 100;
      const progressText = completion > 0 
        ? `<div style="margin-bottom: 8px;">Progress: ${Math.round(completion)}%</div>` 
        : '';
      
      // Generate difficulty stars (using regular 5-point stars)
      const generateDifficultyStars = () => {
        const difficulty = node.difficulty || 0;
        let starsHTML = '';
        
        // Create 5 stars, filling in the number based on difficulty
        for (let i = 0; i < 5; i++) {
          if (i < difficulty) {
            starsHTML += '<span style="color: gold; font-size: 16px; margin-right: 3px;">★</span>';
          } else {
            starsHTML += '<span style="color: #555; font-size: 16px; margin-right: 3px;">☆</span>';
          }
        }
        
        return starsHTML;
      };
      
      // Get mouse position relative to container
      const containerRect = containerRef.current.getBoundingClientRect();
      const mouseX = event.clientX - containerRect.left;
      const mouseY = event.clientY - containerRect.top;
      
      // Position tooltip near mouse but ensure it stays within view
      tooltip.html(`
        <h3 style="margin: 0 0 8px 0; color: var(--highlight-color)">${node.name}</h3>
        <div style="margin-bottom: 8px;">Difficulty: ${generateDifficultyStars()}</div>
        ${progressText}
        <p style="margin: 0; line-height: 1.5">${description}</p>
        ${node.subpages && node.subpages.length > 0 ? 
          '<div style="margin-top: 8px; color: var(--highlight-color); font-size: 0.9em;">Click to view sub-pages</div>' : ''}
      `)
      .style("left", `${mouseX + 15}px`)
      .style("top", `${mouseY - 15}px`)
      .style("opacity", 1);
    };
    
    // Create a function to hide tooltip
    const hideTooltip = () => {
      tooltip.style("opacity", 0);
    };
    
    // Draw nodes for each constellation
    Object.keys(constellationData).forEach(key => {
      const constellation = constellationData[key];
      
      // Draw nodes
      constellation.nodes.forEach(node => {
        // Find matching markdown data
        const nodeData = nodes.find(n => n.frontmatter.slug === node.id);
        
        const group = constellations[key].append('g')
          .attr('class', 'node')
          .attr('transform', `translate(${node.x}, ${node.y})`)
          .attr('data-id', node.id)
          .on('click', (event) => {
            // Save view state explicitly before navigation
            const currentTransform = d3.zoomTransform(svg.node());
            saveViewState(currentTransform);
            
            // Get mouse position for the modal
            const containerRect = containerRef.current.getBoundingClientRect();
            const mouseX = event.clientX - containerRect.left;
            const mouseY = event.clientY - containerRect.top;
            
            // Check if node has subpages
            const subpages = node.subpages || [];
            const nodeWithSubpages = {
              ...node,
              constellation: key,
              color: constellation.color,
              subpages: subpages
            };
            
            if (subpages.length > 0) {
              // Show sub-page modal
              setSelectedNode(nodeWithSubpages);
              setModalPosition({ x: mouseX, y: mouseY });
              setIsModalOpen(true);
            } else {
              // Navigate directly if no subpages
              navigate(`/page/${node.id}/index`);
            }
          })
          .on("mouseover", (event) => {
            showTooltip(event, node, nodeData);
          })
          .on("mouseout", hideTooltip);
        
        // Calculate star points based on difficulty
        const difficulty = node.difficulty || 3; // Default to 3 points if not specified
        const starPoints = generateStarPoints(0, 0, difficulty + 3, 12, 6); // points = difficulty + 3
        
        // Calculate progress percentage
        const progressPercentage = getSectionCompletion(node.id);
        
        // Background/unfilled star (dimmed)
        group.append('polygon')
          .attr('class', 'node-star-bg')
          .attr('points', starPoints)
          .attr('fill', constellation.color)
          .attr('opacity', 0.3)
          .attr('stroke', 'rgba(255, 255, 255, 0.3)')
          .attr('stroke-width', 1);
          
        // Handle the progress indicator
        if (progressPercentage > 0) {
          // Create progress indicator clipping mask
          const clipPathId = `clip-${node.id}`;
          svg.append("defs")
            .append("clipPath")
            .attr("id", clipPathId)
            .append("path")
            .attr("d", createProgressArc(0, 0, 15, 0, progressPercentage * 360));
          
          // Foreground/filled star (progress indicator)
          // Only add if there's some progress (> 0%)
          group.append('polygon')
            .attr('class', 'node-star-progress')
            .attr('points', starPoints)
            .attr('fill', constellation.color)
            .attr('stroke', 'rgba(255, 255, 255, 0.6)')
            .attr('stroke-width', 1)
            .attr('clip-path', `url(#${clipPathId})`);
          
          // If progress is 100%, add a fully opaque star on top
          if (progressPercentage >= 0.999) {
            group.append('polygon')
              .attr('class', 'node-star-complete')
              .attr('points', starPoints)
              .attr('fill', constellation.color)
              .attr('stroke', 'rgba(255, 255, 255, 0.6)')
              .attr('stroke-width', 1);
          }
        }
        
        // Small decorative elements to make it look like a constellation point
        group.append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', 2)
          .attr('fill', 'white');
        
        // Node label
        group.append('text')
          .attr('class', 'node-label')
          .attr('x', 0)
          .attr('y', 30)
          .attr('text-anchor', 'middle')
          .style('fill', 'white')
          .text(node.name);
      });
    });
    
    // Create legend for star points and progress
    const legend = d3.select(containerRef.current)
      .append("div")
      .attr("class", "constellation-legend")
      .style("position", "absolute")
      .style("bottom", "20px")
      .style("right", "20px")
      .style("background-color", "rgba(22, 28, 44, 0.9)")
      .style("padding", "12px")
      .style("border-radius", "6px")
      .style("z-index", "10")
      .style("max-width", "250px")
      .style("box-shadow", "0 2px 10px rgba(0, 0, 0, 0.3)");
    
    legend.append("div")
      .style("color", "var(--highlight-color)")
      .style("font-weight", "600")
      .style("margin-bottom", "10px")
      .style("text-align", "center")
      .text("Star Points Legend");
    
    // Define the difficulty levels and corresponding points
    const legendItems = [
      { level: "Beginner (Level 1)", points: 4, difficulty: 1 },
      { level: "Intermediate (Level 3)", points: 6, difficulty: 3 },
      { level: "Advanced (Level 5)", points: 8, difficulty: 5 }
    ];
    
    // Create legend items for difficulty
    legendItems.forEach(item => {
      const legendItem = legend.append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("margin-bottom", "8px");
      
      // Create SVG for the star example
      const legendSvg = legendItem.append("svg")
        .attr("width", 24)
        .attr("height", 24)
        .attr("viewBox", "-12 -12 24 24");
      
      // Draw star with the specified points
      const starPoints = generateStarPoints(0, 0, item.points, 10, 5);
      legendSvg.append("polygon")
        .attr("points", starPoints)
        .attr("fill", "#6bb4ff")
        .attr("stroke", "rgba(255, 255, 255, 0.6)")
        .attr("stroke-width", 0.5);
      
      // Create difficulty stars visualization
      const difficultyStars = legendItem.append("div")
        .style("display", "inline-flex")
        .style("margin-left", "8px")
        .style("margin-right", "8px");
      
      // Add difficulty stars
      for (let i = 0; i < 5; i++) {
        difficultyStars.append("span")
          .style("color", i < item.difficulty ? "gold" : "#555")
          .style("font-size", "12px")
          .style("margin-right", "2px")
          .text("★");
      }
      
      // Add label
      legendItem.append("span")
        .style("font-size", "0.9rem")
        .text(item.level);
    });
    
    // Restore the view based on saved position or reset to default
    restoreView();
    
    function restoreView() {
      // Get saved position values with fallbacks
      const savedX = parseFloat(localStorage.getItem('constellation_x'));
      const savedY = parseFloat(localStorage.getItem('constellation_y'));
      const savedK = parseFloat(localStorage.getItem('constellation_k'));
      
      // Only restore if we have valid saved values
      if (!isNaN(savedX) && !isNaN(savedY) && !isNaN(savedK)) {
        console.log("Restoring saved view:", savedX, savedY, savedK);
        
        // Create a transform with the saved values
        const transform = d3.zoomIdentity
          .translate(savedX, savedY)
          .scale(savedK);
        
        // Apply the transform
        svg.call(zoom.transform, transform);
      } else {
        // Default view if no saved state
        resetView();
      }
    }
    
    function resetView() {
      const viewportWidth = containerRef.current.clientWidth;
      const viewportHeight = containerRef.current.clientHeight;
      
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity
          .translate(viewportWidth / 2, viewportHeight / 2)
          .scale(0.6)
      );
    }
    
    function findNodeById(id) {
      for (const key in constellationData) {
        const found = constellationData[key].nodes.find(n => n.id === id);
        if (found) return found;
      }
      return { x: 0, y: 0 };
    }
    
    // Resize handler
    const handleResize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        
        svg.attr('width', newWidth)
           .attr('height', newHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Add event listener to close modal when clicking outside
    const handleDocumentClick = (event) => {
      const modalElement = document.querySelector('.subpage-modal');
      if (isModalOpen && modalElement && !modalElement.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleDocumentClick);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleDocumentClick);
      // Remove tooltip and legend when component unmounts
      tooltip.remove();
      legend.remove();
    };
  }, [nodes, isModalOpen]); // Re-run if nodes or modal state changes
  
  // Function to generate star polygon points
  function generateStarPoints(centerX, centerY, points, outerRadius, innerRadius) {
    let angleStep = Math.PI / points;
    let pointsArray = [];
    
    for (let i = 0; i < points * 2; i++) {
      let radius = i % 2 === 0 ? outerRadius : innerRadius;
      let x = centerX + radius * Math.sin(i * angleStep);
      let y = centerY + radius * Math.cos(i * angleStep);
      pointsArray.push([x, y]);
    }
    
    return pointsArray.map(point => point.join(',')).join(' ');
  }
  
  // Function to create progress arc path
  function createProgressArc(cx, cy, radius, startAngle, endAngle) {
    // Handle 360° case specially to avoid path rendering issues
    if (endAngle >= 359.99) {
      return `M ${cx-radius-1} ${cy} A ${radius} ${radius} 0 1 1 ${cx-radius} ${cy} Z`;
    }
    
    // Convert angles from degrees to radians
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    // Calculate start and end points
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    
    // Determine if we're doing more than 180 degrees (large-arc-flag)
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    // Create SVG path
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  }

  function addBackgroundStars(container, width, height, count) {
    for (let i = 0; i < count; i++) {
      const x = Math.random() * width * 2 - width/2;
      const y = Math.random() * height * 2 - height/2;
      const size = Math.random() * 1.5;
      const opacity = Math.random() * 0.7 + 0.2;
      
      container.append('circle')
        .attr('class', 'background-star')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', size)
        .style('opacity', opacity);
    }
  }
  
  // Handle button clicks with proper transform saving
  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(d3.zoom().scaleBy, 1.3);
    
    // Save the new transform after zoom
    setTimeout(() => {
      const currentTransform = d3.zoomTransform(svg.node());
      localStorage.setItem('constellation_x', currentTransform.x);
      localStorage.setItem('constellation_y', currentTransform.y);
      localStorage.setItem('constellation_k', currentTransform.k);
    }, 350); // Wait for transition to complete
  };
  
  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(d3.zoom().scaleBy, 0.7);
    
    // Save the new transform after zoom
    setTimeout(() => {
      const currentTransform = d3.zoomTransform(svg.node());
      localStorage.setItem('constellation_x', currentTransform.x);
      localStorage.setItem('constellation_y', currentTransform.y);
      localStorage.setItem('constellation_k', currentTransform.k);
    }, 350); // Wait for transition to complete
  };
  
  const handleResetView = () => {
    // Clear saved position
    localStorage.removeItem('constellation_x');
    localStorage.removeItem('constellation_y');
    localStorage.removeItem('constellation_k');
    
    // Reset view
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const svg = d3.select(svgRef.current);
    
    svg.transition().duration(750).call(
      d3.zoom().transform,
      d3.zoomIdentity.translate(width / 2, height / 2).scale(0.6)
    );
  };
  
  const handleSubpageSelect = (pageId) => {
    setIsModalOpen(false);
    navigate(`/page/${selectedNode.id}/${pageId}`);
  };
  
  // Reset progress for all sections (for testing)
  const resetAllProgress = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('visitedPages');
      // Force refresh to update stars
      window.location.reload();
    }
  };
  
  // Check if a page has been completed for the checkboxes
  const isSubpageCompleted = (sectionId, subpageId) => {
    return isPageVisited(sectionId, subpageId);
  };
  
  return (
    <div className="constellation-container" ref={containerRef}>
      <div className="zoom-controls">
        <button id="zoom-in" onClick={handleZoomIn}>+</button>
        <button id="zoom-out" onClick={handleZoomOut}>-</button>
        <button id="reset-view" onClick={handleResetView}>Reset</button>
      </div>
      
      {/* Reset Progress Button (only for development/testing) */}
      <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 100 }}>
        <button 
          onClick={resetAllProgress}
          style={{
            background: 'rgba(255, 100, 100, 0.8)',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Reset Progress (Testing)
        </button>
      </div>
      
      <svg id="constellation-map" ref={svgRef}></svg>
      
      {/* Sub-page Selection Modal */}
      {isModalOpen && selectedNode && (
        <div 
          className="subpage-modal"
          style={{
            position: 'absolute',
            left: `${modalPosition.x}px`,
            top: `${modalPosition.y}px`,
            backgroundColor: 'rgba(22, 28, 44, 0.95)',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            maxHeight: '400px',
            overflowY: 'auto',
            maxWidth: '300px',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div style={{ marginBottom: '12px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px 0', color: selectedNode.color || 'var(--highlight-color)' }}>
              {selectedNode.name}
            </h3>
            <div style={{ fontSize: '0.9em', opacity: 0.8 }}>Select a page:</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Index/Overview page */}
            <button
              onClick={() => handleSubpageSelect('index')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '4px',
                color: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 0.2s',
                fontWeight: 'bold'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              <span>Overview</span>
              {isSubpageCompleted(selectedNode.id, 'index') && (
                <span style={{ color: '#4CAF50', fontSize: '16px' }}>✓</span>
              )}
            </button>
            
            {/* Subpages */}
            {selectedNode.subpages.map((page, index) => (
              <button
                key={index}
                onClick={() => handleSubpageSelect(page.id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '4px',
                  color: 'white',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                <span>{page.title}</span>
                {isSubpageCompleted(selectedNode.id, page.id) && (
                  <span style={{ color: '#4CAF50', fontSize: '16px' }}>✓</span>
                )}
              </button>
            ))}
          </div>
          
          {/* Progress indicator */}
          <div 
            style={{ 
              marginTop: '16px', 
              textAlign: 'center',
              padding: '8px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ fontSize: '0.85em', marginBottom: '5px' }}>
              {Math.round(getSectionCompletion(selectedNode.id) * 100)}% Complete
            </div>
            <div style={{ 
              height: '4px', 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                height: '100%', 
                width: `${getSectionCompletion(selectedNode.id) * 100}%`,
                backgroundColor: selectedNode.color || 'var(--highlight-color)',
                borderRadius: '2px'
              }}></div>
            </div>
          </div>
          
          <button
            onClick={() => setIsModalOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              padding: '8px',
              marginTop: '12px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '0.9em',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ConstellationMap;