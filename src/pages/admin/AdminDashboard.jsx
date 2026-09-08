import React, { useState, useEffect, useCallback } from 'react';
import { FiUsers, FiAlertTriangle, FiCheckCircle, FiRadio, FiPieChart, FiActivity, FiArrowUpRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import api from '../../services/api';
import { SOSChart, UserGrowthChart } from '../../components/charts/DashboardCharts';
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

    // Firestore real-time users subscription
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
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
    }, (err) => console.warn('Dashboard users stream notice:', err.message));

    // Firestore real-time SOS alerts subscription
    const unsubSOS = onSnapshot(collection(db, 'sos'), (snap) => {
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
    }, (err) => console.warn('Dashboard SOS stream notice:', err.message));

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

  // Build dynamic monthly SOS counts from real alerts
  const monthNames = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const monthlySOSStats = monthNames.map((m) => {
    const count = alerts.filter((a) => {
      if (!a.timestamp) return false;
      const d = new Date(a.timestamp);
      return d.toLocaleString('en-US', { month: 'short' }) === m;
    }).length;
    return { month: m, count };
  });

  const recentAlerts = alerts.slice(0, 5);

  return (
    <div className="space-y-8 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="space-y-1.5 relative z-10">
        <div className="flex items-center gap-2">
          <span className="mono-tag mono-tag-rose text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 telemetry-dot"></span> COMMAND TELEMETRY
          </span>
        </div>
        <h1 className="text-3xl font-extrabold font-heading text-white tracking-tight">
          Admin <span className="gradient-text-rose">Control Center</span>
        </h1>
        <p className="text-xs text-zinc-400">
          Real-time emergency telemetry monitoring, verified citizen registrations, and active incident response.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <div className="glass-card-xl p-6 sm:p-7 border-l-4 border-l-blue-500 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase font-mono">Total Verified Users</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-lg">
              <FiUsers />
            </div>
          </div>
          <p className="text-3xl font-black font-heading text-white">{totalUsers}</p>
          <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500 font-mono">
            <span>Dynamic Registry</span>
            <Link to="/admin/users" className="text-blue-400 hover:underline flex items-center gap-1">
              View <FiArrowUpRight />
            </Link>
          </div>
        </div>

        <div className="glass-card-xl p-6 sm:p-7 border-l-4 border-l-rose-500 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase font-mono">Active Distress Alerts</span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-lg">
              <FiAlertTriangle className={activeAlerts > 0 ? 'animate-pulse' : ''} />
            </div>
          </div>
          <p className="text-3xl font-black font-heading text-rose-500">{activeAlerts}</p>
          <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500 font-mono">
            <span>{activeAlerts === 0 ? 'All beacons clear' : 'Immediate dispatch'}</span>
            <Link to="/admin/alerts" className="text-rose-400 hover:underline flex items-center gap-1">
              Monitor <FiArrowUpRight />
            </Link>
          </div>
        </div>

        <div className="glass-card-xl p-6 sm:p-7 border-l-4 border-l-emerald-500 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase font-mono">Resolved Incidents</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg">
              <FiCheckCircle />
            </div>
          </div>
          <p className="text-3xl font-black font-heading text-emerald-400">{resolvedAlerts}</p>
          <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500 font-mono">
            <span>Completed Dispatches</span>
            <Link to="/admin/sos-reports" className="text-emerald-400 hover:underline flex items-center gap-1">
              Reports <FiArrowUpRight />
            </Link>
          </div>
        </div>

        <div className="glass-card-xl p-6 sm:p-7 border-l-4 border-l-purple-500 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase font-mono">Lifetime SOS Signals</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-lg">
              <FiPieChart />
            </div>
          </div>
          <p className="text-3xl font-black font-heading text-purple-400">{totalSOSAlerts}</p>
          <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500 font-mono">
            <span>Total Logged</span>
            <Link to="/admin/analytics" className="text-purple-400 hover:underline flex items-center gap-1">
              Analytics <FiArrowUpRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Chart Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div className="glass-card-xl p-6 sm:p-8 space-y-4">
          <div className="border-b border-zinc-800/80 pb-3">
            <h3 className="text-base font-extrabold font-heading text-white">Monthly SOS Distress Incident Trends</h3>
            <p className="text-xs text-zinc-500">Real incident telemetry grouped by monthly operational cycles</p>
          </div>
          <SOSChart data={monthlySOSStats} />
        </div>

        <div className="glass-card-xl p-6 sm:p-8 space-y-4">
          <div className="border-b border-zinc-800/80 pb-3">
            <h3 className="text-base font-extrabold font-heading text-white">User Base Growth & Adoption</h3>
            <p className="text-xs text-zinc-500">Dynamic registered user verification curve</p>
          </div>
          <UserGrowthChart usersCount={totalUsers} />
        </div>
      </div>

      {/* Recent SOS Activity Section */}
      <div className="glass-card-xl rounded-3xl overflow-hidden border border-zinc-800/80 relative z-10">
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <FiActivity className="text-rose-500" />
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
              Live SOS Distress Stream ({recentAlerts.length})
            </h3>
          </div>
          <Link to="/admin/alerts" className="text-xs text-rose-400 hover:text-rose-300 font-bold font-mono">
            View Live Dispatch →
          </Link>
        </div>

        {recentAlerts.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs space-y-1">
            <p className="font-semibold text-zinc-400">Zero Active Distress Signals</p>
            <p>All emergency channels quiescent. Incoming distress beacons will appear instantly.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/80">
            {recentAlerts.map((a) => (
              <div key={a.id} className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-zinc-900/40 transition">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${a.status === 'ACTIVE' ? 'bg-rose-500 animate-ping' : 'bg-zinc-600'}`} />
                  <div>
                    <p className="text-xs font-bold text-zinc-200">{a.userName} <span className="text-[10px] text-zinc-500 font-mono">({a.userPhone})</span></p>
                    <p className="text-[11px] text-zinc-400 truncate max-w-sm">{a.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">{formatDate(a.timestamp)}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    a.status === 'ACTIVE' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
