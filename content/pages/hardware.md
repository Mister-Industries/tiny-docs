---
title: Getting Started with TinyCore ESP32
slug: hardware
image: /images/tinycore-setup.png
---

# Getting Started with TinyCore ESP32

This guide will walk you through setting up your TinyCore ESP32 for the first time and preparing your development environment.

## Prerequisites

Before getting started, make sure you have:

- A computer with USB port
- USB-C cable
- TinyCore ESP32 board

## Installation Steps

### 1. Install Arduino IDE

1. Download the latest version from [arduino.cc](https://arduino.cc)
2. Run the installer and follow the prompts
3. Launch Arduino IDE once installation is complete

### 2. Add ESP32 Board Support

1. Open Arduino IDE
2. Go to File → Preferences
3. In "Additional Board Manager URLs" add: https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json

4. Click OK
5. Go to Tools → Board → Boards Manager
6. Search for "ESP32"
7. Install "ESP32 by Espressif Systems"

### 3. Connect Your Board

1. Plug the USB-C cable into your TinyCore ESP32 board
2. Connect the other end to your computer
3. Wait for drivers to install automatically

## Verifying Your Setup

Let's upload a simple test program to verify everything is working:

1. Select the correct board from Tools → Board → ESP32 
2. Select the correct port from Tools → Port
3. Open a new sketch and paste this code:

```cpp
void setup() {
Serial.begin(115200);
delay(1000);
Serial.println("TinyCore ESP32 is ready!");
}

void loop() {
Serial.println("Hello from TinyCore!");
delay(1000);
}
```

Click the upload button (right arrow icon)
Open Serial Monitor (Tools → Serial Monitor) and set baud rate to 115200
You should see the messages printed every second

Congratulations! Your TinyCore ESP32 is now set up and ready for programming.