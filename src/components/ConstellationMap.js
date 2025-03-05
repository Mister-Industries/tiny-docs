import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { navigate } from 'gatsby';
import { constellationData } from '../data/constellationData';

const ConstellationMap = ({ nodes }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    
    // Clear any existing content to prevent ghosting
    d3.select(svgRef.current).selectAll("*").remove();
    
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
      
      // Get mouse position relative to container
      const containerRect = containerRef.current.getBoundingClientRect();
      const mouseX = event.clientX - containerRect.left;
      const mouseY = event.clientY - containerRect.top;
      
      // Position tooltip near mouse but ensure it stays within view
      tooltip.html(`
        <h3 style="margin: 0 0 8px 0; color: var(--highlight-color)">${node.name}</h3>
        <p style="margin: 0; line-height: 1.5">${description}</p>
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
          .on('click', () => {
            // Save view state explicitly before navigation
            const currentTransform = d3.zoomTransform(svg.node());
            saveViewState(currentTransform);
            
            // Navigate to the full page view
            navigate(`/page/${node.id}`);
          })
          .on("mouseover", (event) => {
            showTooltip(event, node, nodeData);
          })
          .on("mouseout", hideTooltip);
        
        // Calculate star points based on difficulty
        const difficulty = node.difficulty || 3; // Default to 3 points if not specified
        const starPoints = generateStarPoints(0, 0, difficulty + 3, 12, 6); // points = difficulty + 3

        // Node shape (star based on difficulty)
        group.append('polygon')
          .attr('class', 'node-star')
          .attr('points', starPoints)
          .attr('fill', constellation.color)
          .attr('stroke', 'rgba(255, 255, 255, 0.6)')
          .attr('stroke-width', 1);
        
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
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      // Remove tooltip when component unmounts
      tooltip.remove();
    };
  }, [nodes]); // Only re-run if nodes change
  
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
  
  return (
    <div className="constellation-container" ref={containerRef}>
      <div className="zoom-controls">
        <button id="zoom-in" onClick={handleZoomIn}>+</button>
        <button id="zoom-out" onClick={handleZoomOut}>-</button>
        <button id="reset-view" onClick={handleResetView}>Reset</button>
      </div>
      <svg id="constellation-map" ref={svgRef}></svg>
    </div>
  );
};

export default ConstellationMap;