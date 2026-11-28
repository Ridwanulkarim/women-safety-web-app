import React, { useState, useEffect, useCallback } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiMapPin, FiClock, FiShield, FiRadio, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { collection, onSnapshot, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import LiveMap from '../../components/map/LiveMap';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import api from '../../services/api';
import {
  getGlobalSOSAlerts,
  updateSOSAlertStatus,
  deleteSOSAlert,
  saveGlobalSOSAlert,
  fetchFirestoreSOSAlerts,
  sanitizeAlerts
} from '../../utils/adminDataRegistry';

const AdminAlerts = () => {
  const [alerts, setAlerts] = useState(() => getGlobalSOSAlerts());
  const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, ACKNOWLEDGED, RESOLVED
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setAlerts(getGlobalSOSAlerts());

    // Cloud Firestore Real-time Alert Stream
    const unsubscribe = onSnapshot(
      collection(db, 'sos'),
      (snapshot) => {
        if (!isMounted) return;
        const cloudAlerts = [];
        snapshot.forEach((d) => {
          const data = d.data();
          if (data) {
            cloudAlerts.push({ id: d.id, ...data });
          }
        });

        const localAlerts = getGlobalSOSAlerts();
        const map = new Map();
        localAlerts.forEach((a) => map.set(a.id, a));
        cloudAlerts.forEach((a) => map.set(a.id, { ...map.get(a.id), ...a }));

        const merged = sanitizeAlerts(Array.from(map.values()));
        setAlerts(merged);
        localStorage.setItem('safehaven_global_sos_alerts', JSON.stringify(merged));
      },
      (err) => {
        console.warn('Firestore SOS stream notice:', err.message);
      }
    );

    const handleLocalUpdate = () => {
      setAlerts(getGlobalSOSAlerts());
    };

    window.addEventListener('safehaven_sos_updated', handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);

    return () => {
      isMounted = false;
      unsubscribe();
      window.removeEventListener('safehaven_sos_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
    };
  }, []);

  const handleManualSync = async () => {
    setSyncing(true);
    const updated = await fetchFirestoreSOSAlerts();
    setAlerts(updated);
    setSyncing(false);
    toast.success('Live distress beacons refreshed from cloud.');
  };

  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      await updateDoc(doc(db, 'sos', id), { status: nextStatus });
    } catch (e) {}
    try {
      await api.patch(`/sos/${id}/status`, { status: nextStatus });
    } catch (e) {}

    const updated = await updateSOSAlertStatus(id, nextStatus);
    setAlerts(updated);
    toast.success(`SOS distress signal marked as ${nextStatus}.`);
  };

  const handleDeleteAlert = async (id) => {
    if (!window.confirm('Delete this emergency alert log?')) return;
    try {
      await deleteDoc(doc(db, 'sos', id));
    } catch (e) {}

    const updated = await deleteSOSAlert(id);
    setAlerts(updated);
    toast.success('SOS alert record removed.');
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'ALL') return true;
    return a.status === filter;
  });

  const activeCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono text-[#737373] dark:text-[#85858b]">Live dispatch</span>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-[#171717] dark:text-[#ededed]">
            Emergency SOS monitor
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
            Real-time location telemetry and status coordination for incoming distress alerts
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 bg-[#f4f4f5] dark:bg-[#19191b] p-1 rounded-lg border border-zinc-900/[0.08] dark:border-white/[0.08]">
            {['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'].map((tab) => {
              const label =
                tab === 'ALL' ? 'All' : tab === 'ACTIVE' ? 'Active' : tab === 'ACKNOWLEDGED' ? 'Acknowledged' : 'Resolved';
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`h-8 px-3 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    filter === tab
                      ? 'bg-[#171717] dark:bg-[#ededed] text-[#ffffff] dark:text-[#141415]'
                      : 'text-[#525252] dark:text-[#a1a1a6] hover:text-[#171717] dark:hover:text-[#ededed]'
                  }`}
                >
                  {label}
                  {tab === 'ACTIVE' && activeCount > 0 && (
                    <span className="ml-1.5 font-mono tabular-nums">({activeCount})</span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="btn-outline h-10 w-10 px-0"
            title="Refresh from Cloud"
          >
            <FiRefreshCw className={`w-4 h-4 dispatch-icon ${syncing ? 'animate-spin text-[#e11d48]' : ''}`} />
          </button>
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="surface-panel p-12 text-center space-y-4">
          <div className="w-10 h-10 mx-auto rounded-lg bg-[#16a34a]/10 dark:bg-[#4cc38a]/15 text-[#16a34a] dark:text-[#4cc38a] flex items-center justify-center">
            <FiCheckCircle className="w-5 h-5 dispatch-icon" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">
              All clear — no active distress alerts
            </h2>
            <p className="text-sm text-[#525252] dark:text-[#a1a1a6] max-w-md mx-auto">
              {filter === 'ALL'
                ? 'No emergency distress beacons have been triggered. The dispatch monitor listens continuously.'
                : `No emergency alerts match the "${filter.toLowerCase()}" filter.`}
            </p>
          </div>
          <span className="status-tag mono-tag-emerald">Gateway listening</span>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`surface-panel p-6 space-y-5 ${
                alert.status === 'ACTIVE' ? 'border-[#dc2626]/45' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      alert.status === 'ACTIVE'
                        ? 'bg-[#dc2626]/10 text-[#dc2626] dark:text-[#e5484d]'
                        : alert.status === 'ACKNOWLEDGED'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-[#16a34a]/10 dark:bg-[#4cc38a]/15 text-[#16a34a] dark:text-[#4cc38a]'
                    }`}
                  >
                    <FiAlertTriangle className="w-5 h-5 dispatch-icon" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">
                        {alert.userName || 'Anonymous user'}
                      </h2>
                      <span className="text-xs font-mono tabular-nums text-[#737373] dark:text-[#85858b]">
                        #{alert.id}
                      </span>
                    </div>
                    <p className="text-xs text-[#737373] dark:text-[#85858b] flex flex-wrap items-center gap-2 mt-0.5 font-mono tabular-nums">
                      <span>{alert.userPhone || 'No phone'}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3.5 h-3.5 dispatch-icon" /> {formatDate(alert.timestamp)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                  <span
                    className={`status-tag ${
                      alert.status === 'ACTIVE'
                        ? 'mono-tag-rose'
                        : alert.status === 'RESOLVED'
                        ? 'mono-tag-emerald'
                        : ''
                    }`}
                  >
                    {alert.status === 'ACTIVE' ? 'Active' : alert.status === 'ACKNOWLEDGED' ? 'Acknowledged' : 'Resolved'}
                  </span>

                  {alert.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleUpdateStatus(alert.id, 'ACKNOWLEDGED')}
                      className="btn-outline h-8 px-3 text-xs"
                    >
                      Acknowledge
                    </button>
                  )}

                  {alert.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleUpdateStatus(alert.id, 'RESOLVED')}
                      className="btn-solid h-8 px-3 text-xs"
                    >
                      Resolve safe
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="h-8 w-8 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#737373] dark:text-[#85858b] hover:text-[#dc2626] dark:hover:text-[#e5484d] border border-zinc-900/[0.08] dark:border-white/[0.08] flex items-center justify-center transition-colors cursor-pointer"
                    title="Delete alert record"
                  >
                    <FiTrash2 className="w-3.5 h-3.5 dispatch-icon" />
                  </button>
                </div>
              </div>

              <div className="surface-raised px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <FiMapPin className="w-4 h-4 text-[#e11d48] shrink-0 dispatch-icon" />
                  <span className="font-medium text-[#171717] dark:text-[#ededed] truncate">
                    {alert.address || 'Unknown location'}
                  </span>
                </div>
                <div className="font-mono tabular-nums text-[#737373] dark:text-[#85858b] shrink-0">
                  {alert.latitude?.toFixed(4)}° N · {alert.longitude?.toFixed(4)}° E
                </div>
              </div>

              <LiveMap
                latitude={alert.latitude || 23.8103}
                longitude={alert.longitude || 90.4125}
                title={`Distress alert: ${alert.userName || 'User'}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAlerts;
