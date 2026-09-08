import React, { useState } from 'react';
import { FiSettings, FiShield, FiSave, FiRadio, FiLock, FiBell } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [config, setConfig] = useState(() => {
    try {
      const stored = localStorage.getItem('safehaven_admin_config');
      return stored
        ? JSON.parse(stored)
        : {
            dispatchGateway: 'Bangladesh National Emergency 999 Gateway',
            smsGateway: 'Twilio / Infobip Telemetry Direct',
            maxContacts: 5,
            autoAlertPolice: true,
            highPrioritySiren: true
          };
    } catch (e) {
      return {
        dispatchGateway: 'Bangladesh National Emergency 999 Gateway',
        smsGateway: 'Twilio / Infobip Telemetry Direct',
        maxContacts: 5,
        autoAlertPolice: true,
        highPrioritySiren: true
      };
    }
  });

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('safehaven_admin_config', JSON.stringify(config));
    toast.success('Admin system configuration saved successfully.');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto font-sans">
      <div>
        <div className="flex items-center gap-2">
          <span className="mono-tag mono-tag-rose text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 telemetry-dot"></span> DISPATCH CONFIG
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
          Admin System <span className="gradient-text-rose">Settings</span>
        </h1>
        <p className="text-xs text-zinc-400">
          Configure national dispatch gateway routing, platform thresholds, and security parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-zinc-800 shadow-2xl">
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold mb-1 text-zinc-300 font-mono uppercase">
              National Emergency Dispatch Gateway
            </label>
            <input
              type="text"
              value={config.dispatchGateway}
              onChange={(e) => setConfig({ ...config, dispatchGateway: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-rose-500 transition"
            />
            <span className="text-[11px] text-zinc-500 mt-1 block">
              Primary routing destination for SOS distress coordinates in Bangladesh.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-zinc-300 font-mono uppercase">
              SMS / Telephony Broadcast Provider
            </label>
            <input
              type="text"
              value={config.smsGateway}
              onChange={(e) => setConfig({ ...config, smsGateway: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-rose-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-zinc-300 font-mono uppercase">
                Max Contacts Allowed Per User
              </label>
              <input
                type="number"
                value={config.maxContacts}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-500 cursor-not-allowed font-mono"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">Safety protocol standard: 5 contacts.</span>
            </div>

            <div className="space-y-3 pt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.autoAlertPolice}
                  onChange={(e) => setConfig({ ...config, autoAlertPolice: e.target.checked })}
                  className="w-4 h-4 rounded text-rose-600 bg-zinc-900 border-zinc-700 focus:ring-rose-500"
                />
                <span className="text-xs text-zinc-300 font-medium">Auto-dispatch to 999 on Critical SOS</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.highPrioritySiren}
                  onChange={(e) => setConfig({ ...config, highPrioritySiren: e.target.checked })}
                  className="w-4 h-4 rounded text-rose-600 bg-zinc-900 border-zinc-700 focus:ring-rose-500"
                />
                <span className="text-xs text-zinc-300 font-medium">Enable high-priority audible alarms</span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-2 shadow-lg shadow-rose-600/30 transition"
          >
            <FiSave /> Save System Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
