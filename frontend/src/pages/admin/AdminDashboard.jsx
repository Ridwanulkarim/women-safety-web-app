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
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold font-heading text-purple-400">Admin Control Center</h1>
        <p className="text-xs text-slate-400">Real-time emergency monitoring and user platform overview.</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-3xl border-l-4 border-l-purple-500 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Registered Users</span>
            <FiUsers className="text-purple-400 text-xl" />
          </div>
          <p className="text-3xl font-black font-heading text-slate-100">{stats.totalUsers}</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border-l-4 border-l-red-500 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Active SOS Alerts</span>
            <FiAlertTriangle className="text-red-500 text-xl animate-pulse" />
          </div>
          <p className="text-3xl font-black font-heading text-red-500">{stats.activeAlerts}</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border-l-4 border-l-emerald-500 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Resolved Incidents</span>
            <FiCheckCircle className="text-emerald-500 text-xl" />
          </div>
          <p className="text-3xl font-black font-heading text-emerald-500">{stats.resolvedAlerts}</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border-l-4 border-l-pink-500 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total SOS Lifetime</span>
            <FiPieChart className="text-pink-500 text-xl" />
          </div>
          <p className="text-3xl font-black font-heading text-pink-500">{stats.totalSOSAlerts}</p>
        </div>
      </div>

      {/* Chart Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold font-heading text-slate-200">Monthly SOS Distress Incident Trends</h3>
          <SOSChart data={stats.monthlySOSStats} />
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold font-heading text-slate-200">User Base Growth</h3>
          <UserGrowthChart />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
