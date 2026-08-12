import React from 'react';
import { FiShield, FiLock, FiCheckCircle, FiMapPin, FiCamera, FiPhoneCall } from 'react-icons/fi';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 font-sans">
      
      {/* Header */}
      <div className="product-card p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2">
          <span className="mono-tag mono-tag-rose">
            <FiLock /> OFFICIAL PRIVACY DISCLOSURE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-zinc-900 dark:text-white">
          SafeHaven Privacy & Safety Compliance Policy
        </h1>
        <p className="text-xs text-zinc-500 font-mono">
          Last Updated: August 12, 2026 • Google Play Store & iOS App Store Compliance
        </p>
      </div>

      {/* Content Section */}
      <div className="product-card p-6 sm:p-8 space-y-6 text-sm text-zinc-700 dark:text-zinc-300">
        
        <div className="space-y-2">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 font-heading">
            <FiShield className="text-rose-600" /> 1. Commitment to User Privacy & Safety
          </h2>
          <p className="text-xs leading-relaxed">
            SafeHaven is a mission-critical personal protection application designed to safeguard individuals during emergency distress situations. We prioritize absolute user privacy, zero commercial data monetization, and end-to-end user data ownership.
          </p>
        </div>

        <div className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 font-heading">
            <FiMapPin className="text-rose-600" /> 2. Geolocation & Hardware GPS Data Usage
          </h2>
          <p className="text-xs leading-relaxed">
            SafeHaven collects real-time hardware GPS location coordinates (<code className="font-mono text-rose-500">Latitude, Longitude</code>) strictly to power the SOS Distress Broadcast feature. GPS data is transmitted to your designated emergency contacts and displayed on live telemetry maps only when an emergency alert is actively triggered by you.
          </p>
        </div>

        <div className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 font-heading">
            <FiCamera className="text-rose-600" /> 3. Evidence Locker (Camera & Microphone Access)
          </h2>
          <p className="text-xs leading-relaxed">
            When using the Evidence Locker features (Voice Recorder & Camera Capture), audio blobs and photo evidence are captured and stored locally on your device with cryptographic SHA-256 chain-of-custody verification. SafeHaven never accesses your camera or microphone in the background without explicit user action.
          </p>
        </div>

        <div className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 font-heading">
            <FiPhoneCall className="text-rose-600" /> 4. Emergency Contacts & Speed Dialing
          </h2>
          <p className="text-xs leading-relaxed">
            Emergency contacts saved by you are stored securely using dual persistence (local storage and encrypted database). National emergency helpline links (<code className="font-mono text-emerald-500">tel:999</code>, <code className="font-mono text-emerald-500">tel:109</code>) dial directly over your device’s mobile cellular network without transferring data to third parties.
          </p>
        </div>

        <div className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 font-heading">
            <FiCheckCircle className="text-rose-600" /> 5. Data Security & Storage Transparency
          </h2>
          <p className="text-xs leading-relaxed">
            SafeHaven uses Firebase Authentication and encrypted HTTPS transport for all server communications. Users retain full rights to delete their evidence files, clear saved emergency contacts, or request complete account deletion at any time.
          </p>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
