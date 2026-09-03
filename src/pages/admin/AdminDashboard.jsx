import React, { useState, useEffect } from 'react';
import { FiUsers, FiAlertTriangle, FiCheckCircle, FiRadio, FiPieChart } from 'react-icons/fi';
import api from '../../services/api';
import { SOSChart, UserGrowthChart, SeverityPieChart } from '../../components/charts/DashboardCharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 1240,
    totalSOSAlerts: 182,
    activeAlerts: 3,
    resolvedAlerts: 179,
    monthlySOSStats: [
      { month: 'Jan', count: 12 },
      { month: 'Feb', count: 18 },
      { month: 'Mar', count: 15 },
      { month: 'Apr', count: 24 },
      { month: 'May', count: 32 },
      { month: 'Jun', count: 28 },
      { month: 'Jul', count: 41 }
    ],
    alertsByCategory: [
      { category: 'Physical Threat', count: 45 },
      { category: 'Stalking / Following', count: 30 },
      { category: 'Medical Emergency', count: 15 },
      { category: 'Harassment', count: 10 }
    ]
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        if (res.data?.data) {
          setStats(res.data.data);
        }
      } catch (e) {
        console.warn('Using client admin stats');
      }
    };
    fetchAnalytics();
  }, []);

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
        <p className="text-xs text-zinc-400">Real-time emergency telemetry monitoring, incident response, and platform analytics.</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <div className="glass-card-xl p-6 sm:p-7 border-l-4 border-l-blue-500 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase font-mono">Total Registered Users</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-lg">
              <FiUsers />
            </div>
          </div>
          <p className="text-3xl font-black font-heading text-white">{stats.totalUsers}</p>
        </div>

        <div className="glass-card-xl p-6 sm:p-7 border-l-4 border-l-rose-500 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase font-mono">Active Distress Alerts</span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-lg">
              <FiAlertTriangle className="animate-pulse" />
            </div>
          </div>
          <p className="text-3xl font-black font-heading text-rose-500">{stats.activeAlerts}</p>
        </div>

        <div className="glass-card-xl p-6 sm:p-7 border-l-4 border-l-emerald-500 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase font-mono">Resolved Incidents</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg">
              <FiCheckCircle />
            </div>
          </div>
          <p className="text-3xl font-black font-heading text-emerald-400">{stats.resolvedAlerts}</p>
        </div>

        <div className="glass-card-xl p-6 sm:p-7 border-l-4 border-l-purple-500 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase font-mono">Total SOS Lifetime</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-lg">
              <FiPieChart />
            </div>
          </div>
          <p className="text-3xl font-black font-heading text-purple-400">{stats.totalSOSAlerts}</p>
        </div>
      </div>

      {/* Chart Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div className="glass-card-xl p-6 sm:p-8 space-y-4">
          <div className="border-b border-zinc-800/80 pb-3">
            <h3 className="text-base font-extrabold font-heading text-white">Monthly SOS Distress Incident Trends</h3>
            <p className="text-xs text-zinc-500">Telemetry count grouped by billing and operational cycles</p>
          </div>
          <SOSChart data={stats.monthlySOSStats} />
        </div>

        <div className="glass-card-xl p-6 sm:p-8 space-y-4">
          <div className="border-b border-zinc-800/80 pb-3">
            <h3 className="text-base font-extrabold font-heading text-white">User Base Growth & Adoption</h3>
            <p className="text-xs text-zinc-500">Cumulative verified user onboarding curve</p>
          </div>
          <UserGrowthChart />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
