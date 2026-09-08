import React, { useState, useEffect, useCallback } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiMapPin, FiClock, FiShield, FiRadio, FiTrash2 } from 'react-icons/fi';
import LiveMap from '../../components/map/LiveMap';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import api from '../../services/api';
import {
  getGlobalSOSAlerts,
  updateSOSAlertStatus,
  deleteSOSAlert,
  saveGlobalSOSAlert
} from '../../utils/adminDataRegistry';

const AdminAlerts = () => {
  const [alerts, setAlerts] = useState(() => getGlobalSOSAlerts());
  const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, ACKNOWLEDGED, RESOLVED

  const syncAlerts = useCallback(async () => {
    // 1. Instant local read
    const local = getGlobalSOSAlerts();
    setAlerts(local);

    // 2. Background API sync if available
    try {
      const res = await api.get('/sos');
      if (Array.isArray(res.data?.data) && res.data.data.length > 0) {
        res.data.data.forEach((a) => saveGlobalSOSAlert(a));
        setAlerts(getGlobalSOSAlerts());
      }
    } catch (e) {
      // Offline / serverless fallback
    }
  }, []);

  useEffect(() => {
    syncAlerts();

    const handleUpdate = () => {
      setAlerts(getGlobalSOSAlerts());
    };

    window.addEventListener('safehaven_sos_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('safehaven_sos_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [syncAlerts]);

  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      await api.patch(`/sos/${id}/status`, { status: nextStatus });
    } catch (e) {}
    const updated = updateSOSAlertStatus(id, nextStatus);
    setAlerts(updated);
    toast.success(`SOS distress signal marked as ${nextStatus}.`);
  };

  const handleDeleteAlert = (id) => {
    if (!window.confirm('Delete this emergency alert log?')) return;
    const updated = deleteSOSAlert(id);
    setAlerts(updated);
    toast.success('SOS alert record removed.');
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'ALL') return true;
    return a.status === filter;
  });

  const activeCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="mono-tag mono-tag-rose text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 telemetry-dot"></span> LIVE DISPATCH
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            Emergency <span className="gradient-text-rose">SOS Distress Monitor</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time telemetry and dispatch coordination for emergency user distress signals.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 bg-zinc-900/80 p-1 rounded-2xl border border-zinc-800">
          {['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase transition ${
                filter === tab
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab} {tab === 'ACTIVE' && activeCount > 0 && `(${activeCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      {filteredAlerts.length === 0 ? (
        <div className="glass-card p-12 sm:p-16 rounded-3xl text-center space-y-4 border border-zinc-800/80">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-3xl shadow-lg shadow-emerald-500/10">
            <FiCheckCircle />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">All Clear — No Active Distress Signals</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              {filter === 'ALL'
                ? 'There are currently zero emergency distress beacons triggered. The system is actively listening for incoming user SOS broadcasts.'
                : `No emergency alerts match the "${filter}" filter status.`}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            DISPATCH GATEWAY LISTENING
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`glass-card p-6 sm:p-7 rounded-3xl space-y-6 border transition-all duration-300 ${
                alert.status === 'ACTIVE'
                  ? 'border-rose-500/50 bg-rose-950/10 shadow-2xl shadow-rose-900/20 ring-1 ring-rose-500/20'
                  : 'border-zinc-800/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`p-3.5 rounded-2xl text-2xl flex-shrink-0 ${
                      alert.status === 'ACTIVE'
                        ? 'bg-rose-500/20 text-rose-500 animate-pulse border border-rose-500/40'
                        : alert.status === 'ACKNOWLEDGED'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    <FiAlertTriangle />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-extrabold text-zinc-100 font-heading">
                        {alert.userName || 'Anonymous User'}
                      </h3>
                      <span className="text-[10px] font-mono text-zinc-500">#{alert.id}</span>
                    </div>
                    <p className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5 font-mono">
                      <span>Phone: {alert.userPhone || 'Not Given'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FiClock className="text-zinc-500" /> {formatDate(alert.timestamp)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase ${
                      alert.status === 'ACTIVE'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : alert.status === 'ACKNOWLEDGED'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {alert.status}
                  </span>

                  {alert.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleUpdateStatus(alert.id, 'ACKNOWLEDGED')}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-bold text-xs uppercase font-mono transition"
                    >
                      Acknowledge
                    </button>
                  )}

                  {alert.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleUpdateStatus(alert.id, 'RESOLVED')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase font-mono shadow-md shadow-emerald-600/30 transition"
                    >
                      Resolve Safe
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="p-2 rounded-xl bg-zinc-800/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-zinc-700/50 transition"
                    title="Delete Alert Record"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Location telemetry box */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-rose-500 text-sm flex-shrink-0" />
                  <span className="font-semibold text-zinc-200">{alert.address || 'Unknown Location'}</span>
                </div>
                <div className="font-mono text-[11px] text-zinc-400">
                  {alert.latitude?.toFixed(4)}, {alert.longitude?.toFixed(4)}
                </div>
              </div>

              {/* Live interactive map */}
              <div className="rounded-2xl overflow-hidden border border-zinc-800/80">
                <LiveMap
                  latitude={alert.latitude || 23.8103}
                  longitude={alert.longitude || 90.4125}
                  title={`Distress Alert: ${alert.userName || 'User'}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAlerts;
