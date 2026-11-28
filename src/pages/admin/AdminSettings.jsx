import React, { useState } from 'react';
import { FiSave } from 'react-icons/fi';
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
    toast.success('System configuration saved');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-1">
        <span className="text-xs font-mono text-[#737373] dark:text-[#85858b]">Dispatch configuration</span>
        <h1 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-[#171717] dark:text-[#ededed]">
          System settings
        </h1>
        <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
          Configure emergency dispatch routing, guardian limits, and security parameters
        </p>
      </div>

      <form onSubmit={handleSave} className="surface-panel p-6 sm:p-8 space-y-6">
        <div className="space-y-5">
          <div>
            <label className="human-label">National emergency dispatch gateway</label>
            <input
              type="text"
              value={config.dispatchGateway}
              onChange={(e) => setConfig({ ...config, dispatchGateway: e.target.value })}
              className="human-input"
            />
            <span className="text-xs text-[#737373] dark:text-[#85858b] mt-1.5 block">
              Primary routing endpoint for SOS coordinates across Bangladesh.
            </span>
          </div>

          <div>
            <label className="human-label">SMS broadcast provider</label>
            <input
              type="text"
              value={config.smsGateway}
              onChange={(e) => setConfig({ ...config, smsGateway: e.target.value })}
              className="human-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
            <div>
              <label className="human-label">Max emergency contacts per account</label>
              <input
                type="number"
                value={config.maxContacts}
                disabled
                className="human-input opacity-60 cursor-not-allowed font-mono tabular-nums"
              />
              <span className="text-xs text-[#737373] dark:text-[#85858b] mt-1.5 block">
                Protocol limit fixed at 5 contacts.
              </span>
            </div>

            <div className="space-y-3 pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.autoAlertPolice}
                  onChange={(e) => setConfig({ ...config, autoAlertPolice: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#e11d48]"
                />
                <span className="text-xs text-[#171717] dark:text-[#ededed] font-medium">
                  Auto-route critical SOS to 999
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.highPrioritySiren}
                  onChange={(e) => setConfig({ ...config, highPrioritySiren: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#e11d48]"
                />
                <span className="text-xs text-[#171717] dark:text-[#ededed] font-medium">
                  Enable audible alert prompts
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-900/[0.08] dark:border-white/[0.08] flex justify-end">
          <button type="submit" className="btn-solid h-10 px-5 text-xs">
            <FiSave className="w-4 h-4 dispatch-icon" /> Save configuration
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
