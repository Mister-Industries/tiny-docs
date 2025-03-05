// Data structure for the constellation
export const constellationData = {
  // Main sections
  core: {
    name: "tinyDocs",
    color: "#6bb4ff",
    nodes: [
      { id: "intro", name: "Introduction", x: 0, y: 0, difficulty: 1 },
      { id: "setup", name: "Getting Started", x: 100, y: -50, difficulty: 1 },
      { id: "hardware", name: "Hardware Overview", x: 200, y: 0, difficulty: 2 },
      { id: "programming", name: "Programming Basics", x: 300, y: -50, difficulty: 2 },
      { id: "wifi", name: "WiFi & Connectivity", x: 400, y: 0, difficulty: 3 },
      { id: "bt", name: "Bluetooth Features", x: 500, y: -50, difficulty: 3 },
      { id: "projects", name: "Sample Projects", x: 600, y: 0, difficulty: 3 },
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
      { id: "electricity", name: "Electricity Basics", x: -100, y: 150, difficulty: 1 },
      { id: "components", name: "Electronic Components", x: 0, y: 200, difficulty: 1 },
      { id: "circuits", name: "Circuit Theory", x: 100, y: 250, difficulty: 1 },
      { id: "ohms", name: "Ohm's Law", x: 200, y: 200, difficulty: 1 },
      { id: "pcb", name: "PCB Design", x: 300, y: 250, difficulty: 2 },
      { id: "soldering", name: "Soldering Skills", x: 400, y: 200, difficulty: 2 },
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
      { source: "hardware", target: "motors" },
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
      { source: "hardware", target: "analog" },
    ]
  }
};