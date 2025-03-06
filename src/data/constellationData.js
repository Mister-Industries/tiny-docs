// Data structure for the constellation
export const constellationData = {
  // Main sections
  core: {
    name: "TinyCore ESP32",
    color: "#6bb4ff",
    nodes: [
      { 
        id: "intro", 
        name: "Introduction", 
        x: 0, 
        y: 0, 
        difficulty: 1,
        subpages: [
          { id: "overview", title: "ESP32 Overview" },
          { id: "features", title: "Key Features" },
          { id: "comparison", title: "ESP32 vs Other MCUs" },
          { id: "ecosystem", title: "TinyCore Ecosystem" }
        ]
      },
      { 
        id: "setup", 
        name: "Getting Started", 
        x: 100, 
        y: -50, 
        difficulty: 2,
        subpages: [
          { id: "prerequisites", title: "Prerequisites" },
          { id: "installation", title: "Software Installation" },
          { id: "first-connection", title: "First Connection" },
          { id: "troubleshooting", title: "Common Issues" }
        ]
      },
      { 
        id: "hardware", 
        name: "Hardware Overview", 
        x: 200, 
        y: 0, 
        difficulty: 3,
        subpages: [
          { id: "pinout", title: "Board Pinout" },
          { id: "peripherals", title: "Built-in Peripherals" },
          { id: "power", title: "Power Management" },
          { id: "memory", title: "Memory Architecture" }
        ]
      },
      { 
        id: "programming", 
        name: "Programming Basics", 
        x: 300, 
        y: -50, 
        difficulty: 3,
        subpages: [
          { id: "arduino", title: "Arduino Framework" },
          { id: "espidf", title: "ESP-IDF Framework" },
          { id: "micropython", title: "MicroPython" },
          { id: "debugging", title: "Debugging Techniques" }
        ]
      },
      { 
        id: "wifi", 
        name: "WiFi & Connectivity", 
        x: 400, 
        y: 0, 
        difficulty: 3,
        subpages: [
          { id: "wifi-basics", title: "WiFi Basics" },
          { id: "http-client", title: "HTTP Client" },
          { id: "web-server", title: "Web Server" },
          { id: "ota", title: "OTA Updates" }
        ]
      },
      { 
        id: "bt", 
        name: "Bluetooth Features", 
        x: 500, 
        y: -50, 
        difficulty: 4,
        subpages: [
          { id: "bt-classic", title: "Bluetooth Classic" },
          { id: "ble", title: "Bluetooth Low Energy" },
          { id: "pairing", title: "Pairing & Security" },
          { id: "gatt", title: "GATT Services & Characteristics" }
        ]
      },
      { 
        id: "projects", 
        name: "Sample Projects", 
        x: 600, 
        y: 0, 
        difficulty: 2,
        subpages: [
          { id: "weather", title: "Weather Station" },
          { id: "home-automation", title: "Home Automation" },
          { id: "robot", title: "Line Following Robot" },
          { id: "datalogger", title: "Data Logger" }
        ]
      },
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
      { 
        id: "electricity", 
        name: "Electricity Basics", 
        x: -100, 
        y: 150, 
        difficulty: 1,
        subpages: [
          { id: "voltage", title: "Voltage & Current" },
          { id: "resistance", title: "Resistance & Ohm's Law" },
          { id: "circuits", title: "Circuit Types" },
          { id: "safety", title: "Electrical Safety" }
        ]
      },
      { 
        id: "components", 
        name: "Electronic Components", 
        x: 0, 
        y: 200, 
        difficulty: 2,
        subpages: [
          { id: "passive", title: "Passive Components" },
          { id: "active", title: "Active Components" },
          { id: "logic", title: "Logic Components" },
          { id: "modules", title: "Common Modules" }
        ]
      },
      { 
        id: "circuits", 
        name: "Circuit Theory", 
        x: 100, 
        y: 250, 
        difficulty: 3,
        subpages: [
          { id: "series", title: "Series Circuits" },
          { id: "parallel", title: "Parallel Circuits" },
          { id: "kirchhoff", title: "Kirchhoff's Laws" },
          { id: "analysis", title: "Circuit Analysis" }
        ]
      },
      // ... other nodes with subpages
    ],
    links: [
      { source: "electricity", target: "components" },
      { source: "components", target: "circuits" },
      //{ source: "intro", target: "electricity" },
      // ... other links
    ]
  },

  // Robotics constellation
  robotics: {
    name: "Robotics Platform",
    color: "#ff6b6b",
    nodes: [
      { id: "motors", name: "Motors & Control", x: 250, y: -150, difficulty: 3 },
      { id: "servos", name: "Servo Operation", x: 350, y: -200, difficulty: 4 },
      { id: "pwm", name: "PWM Techniques", x: 450, y: -150, difficulty: 4 },
      { id: "kinematics", name: "Robot Kinematics", x: 550, y: -200, difficulty: 5 },
      { id: "chassis", name: "Chassis Design", x: 600, y: -350, difficulty: 6 },
    ],
    links: [
      { source: "motors", target: "servos" },
      { source: "servos", target: "pwm" },
      { source: "pwm", target: "kinematics" },
      { source: "kinematics", target: "chassis" },
      //{ source: "hardware", target: "motors" },
    ]
  },

  // Sensors constellation
  sensors: {
    name: "Sensors & Inputs",
    color: "#6bffb4",
    nodes: [
      { id: "analog", name: "Analog Sensors", x: -200, y: -150, difficulty: 1 },
      { id: "digital", name: "Digital Sensors", x: -300, y: -200, difficulty: 1 },
      { id: "temp", name: "Temperature & Humidity", x: -400, y: -150, difficulty: 1 },
      { id: "motion", name: "Motion & Acceleration", x: -500, y: -200, difficulty: 1 },
      { id: "light", name: "Light & Color", x: -600, y: -150, difficulty: 1 },
    ],
    links: [
      { source: "analog", target: "digital" },
      { source: "digital", target: "temp" },
      { source: "temp", target: "motion" },
      { source: "motion", target: "light" },
      //{ source: "hardware", target: "analog" },
    ]
  }
};