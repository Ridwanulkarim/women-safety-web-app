import React, { useState, useEffect, useCallback } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { SOSChart } from '../../components/charts/DashboardCharts';
import { getRegisteredUsers, getGlobalSOSAlerts, sanitizeUsers, sanitizeAlerts } from '../../utils/adminDataRegistry';
import { formatDate } from '../../utils/helpers';

const AdminDashboard = () => {
  const [users, setUsers] = useState(() => getRegisteredUsers());
  const [alerts, setAlerts] = useState(() => getGlobalSOSAlerts());

  const refreshData = useCallback(() => {
    setUsers(getRegisteredUsers());
    setAlerts(getGlobalSOSAlerts());
  }, []);

  useEffect(() => {
    refreshData();

    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snap) => {
        const cloudUsers = [];
        snap.forEach((d) => {
          const data = d.data();
          if (data && data.email) cloudUsers.push({ uid: d.id, ...data });
        });
        if (cloudUsers.length > 0) {
          const local = getRegisteredUsers();
          const map = new Map();
          local.forEach((u) => map.set(u.email.toLowerCase().trim(), u));
          cloudUsers.forEach((u) => map.set(u.email.toLowerCase().trim(), { ...map.get(u.email.toLowerCase().trim()), ...u }));
          const merged = sanitizeUsers(Array.from(map.values()));
          setUsers(merged);
          localStorage.setItem('safehaven_registered_users', JSON.stringify(merged));
        }
      },
      (err) => console.warn('Dashboard users stream notice:', err.message)
    );

    const unsubSOS = onSnapshot(
      collection(db, 'sos'),
      (snap) => {
        const cloudAlerts = [];
        snap.forEach((d) => {
          const data = d.data();
          if (data) cloudAlerts.push({ id: d.id, ...data });
        });
        if (cloudAlerts.length > 0) {
          const local = getGlobalSOSAlerts();
          const map = new Map();
          local.forEach((a) => map.set(a.id, a));
          cloudAlerts.forEach((a) => map.set(a.id, { ...map.get(a.id), ...a }));
          const merged = sanitizeAlerts(Array.from(map.values()));
          setAlerts(merged);
          localStorage.setItem('safehaven_global_sos_alerts', JSON.stringify(merged));
        }
      },
      (err) => console.warn('Dashboard SOS stream notice:', err.message)
    );

    window.addEventListener('safehaven_users_updated', refreshData);
    window.addEventListener('safehaven_sos_updated', refreshData);
    window.addEventListener('storage', refreshData);

    return () => {
      unsubUsers();
      unsubSOS();
      window.removeEventListener('safehaven_users_updated', refreshData);
      window.removeEventListener('safehaven_sos_updated', refreshData);
      window.removeEventListener('storage', refreshData);
    };
  }, [refreshData]);

  const totalUsers = users.length;
  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE').length;
  const resolvedAlerts = alerts.filter((a) => a.status === 'RESOLVED').length;
  const totalSOSAlerts = alerts.length;
  const resolutionRate = totalSOSAlerts > 0 ? Math.round((resolvedAlerts / totalSOSAlerts) * 100) : 100;

  const monthNames = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const monthlySOSStats = monthNames.map((m) => {
    const count = alerts.filter((a) => {
      if (!a.timestamp) return false;
      const d = new Date(a.timestamp);
      return d.toLocaleString('en-US', { month: 'short' }) === m;
    }).length;
    return { month: m, count };
  });

  const recentAlerts = alerts.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-mono text-[#737373] dark:text-[#85858b]">Command telemetry</span>
        <h1 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-[#171717] dark:text-[#ededed]">
          Dispatch overview
        </h1>
        <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
          Live incident monitoring, registered accounts, and resolution status
        </p>
      </div>

      {/* Stat Cards Row: Clean numbers, comparison note, zero decorative icons/borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface-card p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-[#737373] dark:text-[#85858b]">
            <span>Verified accounts</span>
            <Link to="/admin/users" className="hover:text-[#171717] dark:hover:text-[#ededed] inline-flex items-center gap-0.5">
              Directory <FiArrowUpRight className="w-3.5 h-3.5 dispatch-icon" />
            </Link>
          </div>
          <p className="text-3xl font-medium font-mono tabular-nums text-[#171717] dark:text-[#ededed]">{totalUsers}</p>
          <p className="text-xs text-[#737373] dark:text-[#85858b]">Cloud Firestore user registry</p>
        </div>

        <div className="surface-card p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-[#737373] dark:text-[#85858b]">
            <span>Active alerts</span>
            <Link to="/admin/alerts" className="hover:text-[#171717] dark:hover:text-[#ededed] inline-flex items-center gap-0.5">
              Monitor <FiArrowUpRight className="w-3.5 h-3.5 dispatch-icon" />
            </Link>
          </div>
          <p className={`text-3xl font-medium font-mono tabular-nums ${activeAlerts > 0 ? 'text-[#e11d48]' : 'text-[#171717] dark:text-[#ededed]'}`}>
            {activeAlerts}
          </p>
          <p className="text-xs text-[#737373] dark:text-[#85858b]">
            {activeAlerts === 0 ? 'All beacons clear' : `${activeAlerts} of ${totalSOSAlerts} open`}
          </p>
        </div>

        <div className="surface-card p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-[#737373] dark:text-[#85858b]">
            <span>Resolved incidents</span>
            <Link to="/admin/sos-reports" className="hover:text-[#171717] dark:hover:text-[#ededed] inline-flex items-center gap-0.5">
              Reports <FiArrowUpRight className="w-3.5 h-3.5 dispatch-icon" />
            </Link>
          </div>
          <p className="text-3xl font-medium font-mono tabular-nums text-[#171717] dark:text-[#ededed]">{resolvedAlerts}</p>
          <p className="text-xs text-[#16a34a] dark:text-[#4cc38a] font-mono tabular-nums">
            {resolutionRate}% of {totalSOSAlerts} logged
          </p>
        </div>

        <div className="surface-card p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-[#737373] dark:text-[#85858b]">
            <span>Total SOS dispatches</span>
            <Link to="/admin/analytics" className="hover:text-[#171717] dark:hover:text-[#ededed] inline-flex items-center gap-0.5">
              Analytics <FiArrowUpRight className="w-3.5 h-3.5 dispatch-icon" />
            </Link>
          </div>
          <p className="text-3xl font-medium font-mono tabular-nums text-[#171717] dark:text-[#ededed]">{totalSOSAlerts}</p>
          <p className="text-xs text-[#737373] dark:text-[#85858b]">Cumulative audit log entries</p>
        </div>
      </div>

      {/* Primary Chart (8 Cols) + Narrow Dispatch Feed (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 surface-panel p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900/[0.08] dark:border-white/[0.08] pb-3">
            <div>
              <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">Monthly SOS incident trend</h2>
              <p className="text-xs text-[#737373] dark:text-[#85858b]">Emergency activations grouped by month</p>
            </div>
            <span className="status-tag font-mono tabular-nums">{totalSOSAlerts} total</span>
          </div>
          <SOSChart data={monthlySOSStats} />
        </div>

        <div className="lg:col-span-4 surface-panel p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900/[0.08] dark:border-white/[0.08] pb-3">
            <div>
              <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">Recent stream</h2>
              <p className="text-xs text-[#737373] dark:text-[#85858b] font-mono tabular-nums">
                Latest {recentAlerts.length} dispatches
              </p>
            </div>
            <Link to="/admin/alerts" className="text-xs font-medium text-[#e11d48] dark:text-[#fb7185] hover:underline">
              View all
            </Link>
          </div>

          {recentAlerts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center space-y-1">
              <p className="text-sm font-medium text-[#171717] dark:text-[#ededed]">No active signals</p>
              <p className="text-xs text-[#737373] dark:text-[#85858b]">Incoming beacons appear here automatically.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-900/[0.08] dark:divide-white/[0.08] flex-1">
              {recentAlerts.map((a) => (
                <div key={a.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#171717] dark:text-[#ededed] truncate">
                      {a.userName || 'Anonymous'}
                    </p>
                    <p className="text-[11px] text-[#737373] dark:text-[#85858b] truncate">
                      {a.address || 'Location recorded'}
                    </p>
                    <span className="text-[11px] text-[#737373] dark:text-[#85858b] font-mono tabular-nums">
                      {formatDate(a.timestamp)}
                    </span>
                  </div>
                  <span
                    className={`status-tag shrink-0 ${
                      a.status === 'ACTIVE' ? 'mono-tag-rose' : 'mono-tag-emerald'
                    }`}
                  >
                    {a.status === 'ACTIVE' ? 'Active' : 'Resolved'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
