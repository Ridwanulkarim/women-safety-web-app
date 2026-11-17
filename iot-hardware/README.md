# SafeHaven &mdash; ESP32 IoT Hardware Panic Beacon

This directory contains the embedded C++ firmware for the **SafeHaven IoT Hardware Panic Device**, built using the **ESP32 microcontroller**.

## Overview
In high-stress emergency situations, women may not be able to unlock their smartphones or navigate through an app screen. This physical wearable device allows instantaneous, covert SOS triggering with a single mechanical button press.

## Hardware Components Required
1. **ESP32 NodeMCU / DevKit V1** (30-pin or 38-pin)
2. **Tactile Push Button** (Normally Open)
3. **Micro-USB / Type-C Cable** or **3.7V Li-ion Battery with TP4056 charger**
4. Connecting Jumper Wires

## Circuit Connection Diagram
```text
  ESP32 Microcontroller          External Component
 ┌─────────────────────┐
 │                     │
 │             GPIO 4  ├────────[ Push Button Pin 1 ]
 │                     │
 │               GND   ├────────[ Push Button Pin 2 ]
 │                     │
 │             GPIO 2  ├────────[ Onboard Status Blue LED ]
 └─────────────────────┘
```
> **Note:** The internal pull-up resistor (`INPUT_PULLUP`) is enabled inside the firmware, so no external pull-up resistor is required.

## How to Flash the Firmware
1. Open **Arduino IDE**.
2. Go to **Tools > Board > esp32 > ESP32 Dev Module**.
3. Install the `ESP32` board definitions if not already installed (via Boards Manager).
4. Open `safehaven_esp32_sos.ino`.
5. Update your mobile hotspot or Wi-Fi name (`ssid`) and password (`password`).
6. Connect the ESP32 via USB and click **Upload**.
7. Once connected, pressing the button connected to GPIO 4 immediately dispatches an HTTP POST emergency payload to the SafeHaven cloud API.
