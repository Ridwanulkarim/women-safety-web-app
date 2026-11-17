# SafeHaven &mdash; AI Development & Prompt Engineering Journal

This document serves as the official **AI Prompt Journal** for the SafeHaven project, recording key prompts, technical rationales, architectural iterations, and validation procedures implemented throughout development.

---

## 1. Project Inception & Threat Model Specification
- **Objective:** Define a reliable, multi-tier distress broadcasting architecture for women safety.
- **Prompt:**
  > *"Design a real-time distress response system for women safety that does not rely exclusively on mobile app stores or voice calls. The system must support progressive web app installation, sub-second telemetry acquisition, and automated notification failover."*
- **Outcome & Engineering Decision:**
  - Selected a Progressive Web Application (PWA) with Service Worker background synchronization.
  - Implemented client-side geolocation caching with 3-tier fallback (Satellite GPS ➔ Cellular/Wi-Fi ➔ Network IP Geolocation).

---

## 2. LangGraph & Autonomous Agent Architecture
- **Objective:** Create an intelligent incident diagnostics and analytics agent that goes beyond generic API wrappers.
- **Prompt:**
  > *"Structure an autonomous incident intelligence agent using LangGraph-style state machine principles. The agent must have explicit nodes for Intent Routing, Tool Calling (querying real SOS databases and computing analytics metrics), and LLM Reasoning. It must also support voice-to-text input and natural text-to-speech output."*
- **Agent State Graph:**
  ```text
  [Input: Text or Voice STT]
             │
             ▼
      (Node: INTENT_ROUTER)
             │
    ┌────────┴────────┐
    ▼                 ▼
  (Tool: SOS DB)   (Tool: Analytics Aggregator)
    │                 │
    └────────┬────────┘
             ▼
    (Node: LLM_SYNTHESIS)
             │
             ▼
  [Output: Structured Insights + Natural Voice Synthesis]
  ```
- **Validation:** Tested with queries like *"Summarize all SOS incident reports"*, *"What were the main root causes?"*, and *"How many incidents occurred and what is the resolution rate?"*.

---

## 3. High-Accuracy Geolocation & Map Rectification
- **Objective:** Resolve edge cases where desktop browsers or indoor Wi-Fi default to hardcoded fallback coordinates.
- **Prompt:**
  > *"Refactor useGeolocation hook to implement a 3-tier progressive acquisition strategy: first attempt high-accuracy GPS; if timed out, attempt network Wi-Fi triangulation; if blocked or unavailable, fall back to IP-based regional geolocation. In addition, allow user manual pin drag-and-drop on the Leaflet map."*
- **Outcome:** Replaced static coordinate fallback with dynamic `requestLocation`, `fetchIpGeolocation`, and draggable `onLocationChange` bindings in `LiveMap.jsx`.

---

## 4. Cyber-Physical IoT Integration (ESP32 Firmware)
- **Objective:** Enable physical trigger for victims who cannot unlock smartphones.
- **Prompt:**
  > *"Write an embedded C++ sketch for ESP32 DevKit to connect to a mobile hotspot and make an HTTP POST request to our cloud SOS endpoint upon pressing a hardware button connected to GPIO 4. Include software debouncing and status LED feedback."*
- **Outcome:** Saved and committed `iot-hardware/safehaven_esp32_sos.ino` with circuit diagram in `iot-hardware/README.md`.

---

## 5. Security & Verification Audit
- **Verification Routine:**
  - Automated JWT verification on protected backend API routes.
  - Rate limiting and input sanitization via `express-validator` and `helmet`.
  - Security vulnerability reporting policy maintained in `SECURITY.md`.
