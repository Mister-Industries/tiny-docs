import * as d3 from 'd3';

// Data structure for the constellation
const constellationData = {
  // Main sections
  core: {
    name: "TinyCore ESP32",
    color: "#6bb4ff",
    nodes: [
      { id: "intro", name: "Introduction", x: 0, y: 0 },
      { id: "setup", name: "Getting Started", x: 100, y: -50 },
      { id: "hardware", name: "Hardware Overview", x: 200, y: 0 },
      { id: "programming", name: "Programming Basics", x: 300, y: -50 },
      { id: "wifi", name: "WiFi & Connectivity", x: 400, y: 0 },
      { id: "bt", name: "Bluetooth Features", x: 500, y: -50 },
      { id: "projects", name: "Sample Projects", x: 600, y: 0 },
    ],
    links: [
      { source: "intro", target: "setup" },
      { source: "setup", target: "hardware" },
      { source: "hardware", target: "programming" },
      { source: "programming", target: "wifi" },
      { source: "wifi", target: "bt" },
      { source: "bt", target: "projects" },
    ]
  },

  // Fundamentals (roots) constellation
  fundamentals: {
    name: "Fundamentals",
    color: "#7cbe5f",
    nodes: [
      { id: "electricity", name: "Electricity Basics", x: -100, y: 150 },
      { id: "components", name: "Electronic Components", x: 0, y: 200 },
      { id: "circuits", name: "Circuit Theory", x: 100, y: 250 },
      { id: "ohms", name: "Ohm's Law", x: 200, y: 200 },
      { id: "pcb", name: "PCB Design", x: 300, y: 250 },
      { id: "soldering", name: "Soldering Skills", x: 400, y: 200 },
    ],
    links: [
      { source: "electricity", target: "components" },
      { source: "components", target: "circuits" },
      { source: "circuits", target: "ohms" },
      { source: "ohms", target: "pcb" },
      { source: "pcb", target: "soldering" },
      { source: "intro", target: "electricity" },
    ]
  },

  // Robotics constellation
  robotics: {
    name: "Robotics Platform",
    color: "#ff6b6b",
    nodes: [
      { id: "motors", name: "Motors & Control", x: 250, y: -150 },
      { id: "servos", name: "Servo Operation", x: 350, y: -200 },
      { id: "pwm", name: "PWM Techniques", x: 450, y: -150 },
      { id: "kinematics", name: "Robot Kinematics", x: 550, y: -200 },
      { id: "chassis", name: "Chassis Design", x: 650, y: -150 },
    ],
    links: [
      { source: "motors", target: "servos" },
      { source: "servos", target: "pwm" },
      { source: "pwm", target: "kinematics" },
      { source: "kinematics", target: "chassis" },
      { source: "hardware", target: "motors" },
    ]
  },

  // Sensors constellation
  sensors: {
    name: "Sensors & Inputs",
    color: "#6bffb4",
    nodes: [
      { id: "analog", name: "Analog Sensors", x: -200, y: -150 },
      { id: "digital", name: "Digital Sensors", x: -300, y: -200 },
      { id: "temp", name: "Temperature & Humidity", x: -400, y: -150 },
      { id: "motion", name: "Motion & Acceleration", x: -500, y: -200 },
      { id: "light", name: "Light & Color", x: -600, y: -150 },
    ],
    links: [
      { source: "analog", target: "digital" },
      { source: "digital", target: "temp" },
      { source: "temp", target: "motion" },
      { source: "motion", target: "light" },
      { source: "hardware", target: "analog" },
    ]
  }
};

// Navigation menu structure
const navigationStructure = [
  {
    title: "Getting Started",
    items: [
      { name: "Introduction to TinyCore", id: "intro" },
      { name: "First-time Setup", id: "setup" },
      { name: "Hardware Overview", id: "hardware" },
      { name: "Programming Environment", id: "programming" }
    ]
  },
  {
    title: "Fundamentals",
    items: [
      { name: "Electricity Basics", id: "electricity" },
      { name: "Electronic Components", id: "components" },
      { name: "Circuit Theory", id: "circuits" },
      { name: "Ohm's Law", id: "ohms" },
      { name: "PCB Design", id: "pcb" },
      { name: "Soldering Techniques", id: "soldering" }
    ]
  },
  {
    title: "Connectivity",
    items: [
      { name: "WiFi Configuration", id: "wifi" },
      { name: "Bluetooth Features", id: "bt" },
      { name: "Web Server Setup", id: "webserver" },
      { name: "MQTT Communication", id: "mqtt" }
    ]
  },
  {
    title: "Robotics",
    items: [
      { name: "Motor Control", id: "motors" },
      { name: "Servo Operation", id: "servos" },
      { name: "PWM Techniques", id: "pwm" },
      { name: "Robot Kinematics", id: "kinematics" },
      { name: "Chassis Design", id: "chassis" }
    ]
  },
  {
    title: "Sensors",
    items: [
      { name: "Analog Sensors", id: "analog" },
      { name: "Digital Sensors", id: "digital" },
      { name: "Temperature & Humidity", id: "temp" },
      { name: "Motion & Acceleration", id: "motion" },
      { name: "Light & Color", id: "light" }
    ]
  },
  {
    title: "Projects",
    items: [
      { name: "Weather Station", id: "weather" },
      { name: "Home Automation", id: "home" },
      { name: "Line Following Robot", id: "linerobot" },
      { name: "Smart Garden", id: "garden" }
    ]
  }
];

// Content for each node
const nodeContent = {
  intro: {
    title: "Introduction to TinyCore ESP32",
    content: "<p>The TinyCore ESP32 is a compact, powerful microcontroller based on the ESP32 chip. It combines Wi-Fi and Bluetooth connectivity with dual-core processing power, making it ideal for IoT applications, robotics, and multimedia projects.</p><p>This learning path will guide you through all aspects of the TinyCore ecosystem, from basic electronics to advanced applications.</p>"
  },
  setup: {
    title: "Getting Started with TinyCore",
    content: "<p>Setting up your TinyCore ESP32 involves a few simple steps:</p><ul><li>Installing the Arduino IDE or PlatformIO</li><li>Adding ESP32 board support</li><li>Installing required libraries</li><li>Connecting the TinyCore to your computer</li><li>Uploading your first sketch</li></ul>"
  },
  hardware: {
    title: "TinyCore Hardware Overview",
    content: "<p>The TinyCore ESP32 features:</p><ul><li>Dual-core ESP32 processor running at 240MHz</li><li>4MB Flash memory</li><li>2.4GHz Wi-Fi and Bluetooth 4.2</li><li>Multiple GPIO pins with ADC, DAC, PWM capabilities</li><li>UART, SPI, I2C interfaces</li><li>USB-C connector for power and programming</li><li>Built-in battery management for LiPo batteries</li></ul>"
  },
  electricity: {
    title: "Electricity Basics",
    content: "<p>Understanding electricity is fundamental to working with microcontrollers. Key concepts include:</p><ul><li>Voltage, current, and resistance</li><li>Direct current (DC) vs. alternating current (AC)</li><li>Series and parallel circuits</li><li>Power calculation (P = V × I)</li><li>Safety considerations when working with electricity</li></ul>"
  },
  motors: {
    title: "Motors & Control Systems",
    content: "<p>Motors are essential components in robotics projects. The TinyCore ESP32 can control various types of motors:</p><ul><li>DC motors with H-bridge drivers</li><li>Servo motors using PWM</li><li>Stepper motors for precise positioning</li><li>Brushless DC motors with ESCs</li></ul><p>This section covers motor selection, wiring techniques, and control algorithms.</p>"
  },
  analog: {
    title: "Analog Sensors",
    content: "<p>Analog sensors convert physical quantities into varying voltage levels. The TinyCore ESP32 includes ADC channels to read these values.</p><p>Common analog sensors include:</p><ul><li>Potentiometers</li><li>Light-dependent resistors (LDRs)</li><li>Thermistors for temperature sensing</li><li>Flex sensors for measuring bending</li><li>Pressure and force sensors</li></ul><p>Learn how to connect, calibrate, and interpret analog sensor data.</p>"
  }
  // Additional node content would be defined here
};

// Initialize the visualization
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeConstellation();
});

function initializeNavigation() {
  const navigationElement = document.querySelector('.navigation');
  
  navigationStructure.forEach(section => {
    const sectionElement = document.createElement('div');
    sectionElement.className = 'nav-section';
    
    const titleElement = document.createElement('div');
    titleElement.className = 'nav-section-title';
    titleElement.textContent = section.title;
    titleElement.innerHTML += '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 4 L6 8 L10 4" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
    
    const contentElement = document.createElement('div');
    contentElement.className = 'nav-section-content';
    
    section.items.forEach(item => {
      const linkElement = document.createElement('a');
      linkElement.href = '#' + item.id;
      linkElement.className = 'nav-link';
      linkElement.textContent = item.name;
      linkElement.setAttribute('data-id', item.id);
      linkElement.addEventListener('click', (e) => {
        e.preventDefault();
        selectNode(item.id);
      });
      
      contentElement.appendChild(linkElement);
    });
    
    sectionElement.appendChild(titleElement);
    sectionElement.appendChild(contentElement);
    navigationElement.appendChild(sectionElement);
    
    // Toggle dropdown
    titleElement.addEventListener('click', () => {
      sectionElement.classList.toggle('open');
    });
  });
  
  // Open the first section by default
  document.querySelector('.nav-section').classList.add('open');
}

function initializeConstellation() {
  const svg = d3.select('#constellation-map');
  const width = document.querySelector('.constellation-container').clientWidth;
  const height = document.querySelector('.constellation-container').clientHeight;
  
  // Create SVG with zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([0.2, 3])
    .on('zoom', (event) => {
      container.attr('transform', event.transform);
    });
  
  svg.call(zoom)
    .on("dblclick.zoom", null);
  
  const container = svg.append('g');
  
  // Add background stars
  addBackgroundStars(container, width, height, 150);
  
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
  
  // Draw nodes for each constellation
  Object.keys(constellationData).forEach(key => {
    const constellation = constellationData[key];
    
    // Draw nodes
    constellation.nodes.forEach(node => {
      const group = constellations[key].append('g')
        .attr('class', 'node')
        .attr('transform', `translate(${node.x}, ${node.y})`)
        .attr('data-id', node.id)
        .on('click', () => selectNode(node.id));
      
      // Node shape (rectangle)
      group.append('rect')
        .attr('class', 'node-rect')
        .attr('x', -12)
        .attr('y', -12)
        .attr('width', 24)
        .attr('height', 24)
        .attr('fill', constellation.color)
        .attr('rx', 2)
        .attr('ry', 2);
      
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
  
  // Center the view initially
  resetView();
  
  // Add zoom controls
  document.getElementById('zoom-in').addEventListener('click', () => {
    svg.transition().call(zoom.scaleBy, 1.3);
  });
  
  document.getElementById('zoom-out').addEventListener('click', () => {
    svg.transition().call(zoom.scaleBy, 0.7);
  });
  
  document.getElementById('reset-view').addEventListener('click', resetView);
  
  // Initial node selection
  selectNode('intro');
  
  function resetView() {
    const viewportWidth = document.querySelector('.constellation-container').clientWidth;
    const viewportHeight = document.querySelector('.constellation-container').clientHeight;
    
    svg.transition().call(
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
}

function selectNode(nodeId) {
  // Update active link in sidebar
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-id') === nodeId) {
      link.classList.add('active');
      
      // Expand the parent section if it's not already open
      const section = link.closest('.nav-section');
      if (!section.classList.contains('open')) {
        section.classList.add('open');
      }
    }
  });
  
  // Highlight the selected node in the constellation
  d3.selectAll('.node').classed('selected', false);
  d3.selectAll(`.node[data-id="${nodeId}"]`).classed('selected', true);
  
  // Update info panel with node content
  const content = nodeContent[nodeId] || { 
    title: "Content Coming Soon", 
    content: "<p>Detailed information for this topic is currently being developed.</p>" 
  };
  
  document.getElementById('info-title').textContent = content.title;
  document.getElementById('info-content').innerHTML = content.content;
  
  // Find which constellation the node belongs to
  let nodeConstellation = null;
  Object.keys(constellationData).forEach(key => {
    if (constellationData[key].nodes.some(node => node.id === nodeId)) {
      nodeConstellation = key;
    }
  });
  
  // Highlight the constellation containing the selected node
  if (nodeConstellation) {
    document.querySelectorAll('.constellation-group').forEach(group => {
      group.classList.add('dim');
    });
    document.getElementById(`constellation-${nodeConstellation}`).classList.remove('dim');
  } else {
    document.querySelectorAll('.constellation-group').forEach(group => {
      group.classList.remove('dim');
    });
  }
}

function addBackgroundStars(container, width, height, count) {
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width * 2 - width/2;
    const y = Math.random() * height * 2 - height/2;
    const size = Math.random() * 1.5;
    const opacity = Math.random() * 0.7 + 0.1;
    
    container.append('circle')
      .attr('class', 'background-star')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', size)
      .style('opacity', opacity);
  }
}

// Handle window resize
window.addEventListener('resize', () => {
  const svg = d3.select('#constellation-map');
  svg.attr('width', document.querySelector('.constellation-container').clientWidth);
  svg.attr('height', document.querySelector('.constellation-container').clientHeight);
});

