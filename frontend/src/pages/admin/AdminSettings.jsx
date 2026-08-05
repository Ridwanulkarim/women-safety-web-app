import React from 'react';
import { FiSettings, FiShield, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Admin system configuration updated.');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading text-purple-400">Admin System Settings</h1>
        <p className="text-xs text-slate-400">Configure emergency dispatch protocols and system thresholds.</p>
      </div>

      <form onSubmit={handleSave} className="glass-card p-8 rounded-3xl space-y-6 border border-slate-800">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-300">National Emergency Dispatch Gateway</label>
            <input
              type="text"
              defaultValue="Bangladesh National Emergency 999 Gateway"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-300">Max Contacts Allowed Per User</label>
            <input
              type="number"
              defaultValue={5}
              disabled
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition"
        >
          <FiSave /> Save Configuration
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
