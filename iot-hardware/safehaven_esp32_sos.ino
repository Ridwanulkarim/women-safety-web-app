/*
 * SafeHaven - ESP32 Hardware SOS Panic Device
 * Microcontroller: ESP32 NodeMCU / DevKit
 * Features:
 *   - Wi-Fi / Mobile Hotspot auto-connect
 *   - Debounced hardware panic button (GPIO 4 to GND)
 *   - Status LED indicator (GPIO 2)
 *   - Direct cloud POST request to SafeHaven SOS Telemetry API
 */

#include <WiFi.h>
#include <HTTPClient.h>

// Wi-Fi or Mobile Hotspot credentials
const char* ssid = "YOUR_WIFI_OR_HOTSPOT_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

// SafeHaven Production Cloud API Endpoint
const char* serverUrl = "https://women-safety-web-app-three.vercel.app/api/sos";

// Hardware Pin Configuration
const int PANIC_BUTTON_PIN = 4; // GPIO 4 (Button connected to GND with INPUT_PULLUP)
const int STATUS_LED_PIN = 2;    // Built-in Blue LED on ESP32

void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(PANIC_BUTTON_PIN, INPUT_PULLUP);
  pinMode(STATUS_LED_PIN, OUTPUT);
  digitalWrite(STATUS_LED_PIN, LOW);

  Serial.println("\n====================================");
  Serial.println("  SafeHaven ESP32 IoT Panic Beacon   ");
  Serial.println("====================================");

  // Connect to Wi-Fi / Mobile Hotspot
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(ssid);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 25) {
    delay(500);
    Serial.print(".");
    digitalWrite(STATUS_LED_PIN, !digitalRead(STATUS_LED_PIN)); // Blink during connection
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connected successfully!");
    Serial.print("[WiFi] IP Address: ");
    Serial.println(WiFi.localIP());

    // Connection confirmation: Flash LED twice
    digitalWrite(STATUS_LED_PIN, HIGH); delay(200);
    digitalWrite(STATUS_LED_PIN, LOW); delay(200);
    digitalWrite(STATUS_LED_PIN, HIGH); delay(200);
    digitalWrite(STATUS_LED_PIN, LOW);
  } else {
    Serial.println("\n[WiFi] Connection timed out. Will auto-retry on button press.");
    digitalWrite(STATUS_LED_PIN, LOW);
  }
}

void loop() {
  // Check if physical panic button is pressed (Active LOW)
  if (digitalRead(PANIC_BUTTON_PIN) == LOW) {
    Serial.println("\n🚨 [ALERT] Hardware Panic Button Triggered!");
    
    // Immediate visual feedback
    digitalWrite(STATUS_LED_PIN, HIGH);

    // Send distress signal to SafeHaven Cloud
    sendHardwareSOSTrigger();

    // Debounce delay (3 seconds) to prevent duplicate rapid spamming
    delay(3000);
    digitalWrite(STATUS_LED_PIN, LOW);
  }

  delay(50);
}

void sendHardwareSOSTrigger() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Reconnecting...");
    WiFi.reconnect();
    int wait = 0;
    while (WiFi.status() != WL_CONNECTED && wait < 10) {
      delay(300);
      wait++;
    }
  }

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // JSON Payload structured for SafeHaven backend
    String payload = "{"
      "\"userName\": \"ESP32 Hardware Beacon\","
      "\"userPhone\": \"IoT Device\","
      "\"triggerSource\": \"HARDWARE_PANIC_BUTTON\","
      "\"deviceId\": \"SAFEHAVEN_ESP32_01\","
      "\"status\": \"ACTIVE\","
      "\"timestamp\": \"" + String(millis()) + "\""
    "}";

    Serial.println("[HTTP] Dispatching SOS distress to SafeHaven server...");
    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      Serial.print("[HTTP] Server Response Code: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.println("[HTTP] Response: " + response);
    } else {
      Serial.print("[HTTP] Error on POST: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("[Error] Cannot send SOS: Wi-Fi unavailable.");
  }
}
