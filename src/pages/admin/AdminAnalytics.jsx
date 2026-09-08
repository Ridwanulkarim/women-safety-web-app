import React, { useState, useEffect } from 'react';
import { FiPieChart, FiActivity, FiShield, FiCheckCircle } from 'react-icons/fi';
import { UserGrowthChart, SeverityPieChart, SOSChart } from '../../components/charts/DashboardCharts';
import { getGlobalSOSAlerts, getRegisteredUsers } from '../../utils/adminDataRegistry';

const AdminAnalytics = () => {
  const [alerts, setAlerts] = useState(() => getGlobalSOSAlerts());
  const [users, setUsers] = useState(() => getRegisteredUsers());

  useEffect(() => {
    const handleUpdate = () => {
      setAlerts(getGlobalSOSAlerts());
      setUsers(getRegisteredUsers());
    };

    window.addEventListener('safehaven_sos_updated', handleUpdate);
    window.addEventListener('safehaven_users_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('safehaven_sos_updated', handleUpdate);
      window.removeEventListener('safehaven_users_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Compute real category breakdown from actual alerts
  const categoriesMap = {};
  alerts.forEach((a) => {
    const cat = a.category || 'Direct SOS Distress';
    categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
  });

  const categoryData = Object.keys(categoriesMap).map((k) => ({
    category: k,
    count: categoriesMap[k]
  }));

  const totalAlerts = alerts.length;
  const resolvedAlerts = alerts.filter((a) => a.status === 'RESOLVED').length;
  const resolutionRate = totalAlerts > 0 ? Math.round((resolvedAlerts / totalAlerts) * 100) : 100;

  return (
    <div className="space-y-8 font-sans">
      <div>
        <div className="flex items-center gap-2">
          <span className="mono-tag mono-tag-rose text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 telemetry-dot"></span> PLATFORM METRICS
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
          Emergency System <span className="gradient-text-rose">Analytics</span>
        </h1>
        <p className="text-xs text-zinc-400">
          Statistical telemetry distribution of emergency distress alerts, resolution efficacy, and user growth.
        </p>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-zinc-800 space-y-2">
          <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase">Incident Resolution Rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-heading text-emerald-400">{resolutionRate}%</span>
            <span className="text-xs text-zinc-500 font-mono">({resolvedAlerts}/{totalAlerts || 0})</span>
          </div>
          <p className="text-[11px] text-zinc-400">Resolution efficacy of handled distress signals.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-zinc-800 space-y-2">
          <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase">Gateway Readiness</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-heading text-rose-500">100%</span>
            <span className="text-xs text-emerald-400 font-mono">ONLINE</span>
          </div>
          <p className="text-[11px] text-zinc-400">National 999 & Emergency Hotlines active.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-zinc-800 space-y-2">
          <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase">Total Verified Accounts</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-heading text-white">{users.length}</span>
            <span className="text-xs text-zinc-500 font-mono">CITIZENS</span>
          </div>
          <p className="text-[11px] text-zinc-400">Registered platform user base.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-zinc-800">
          <div>
            <h3 className="text-base font-bold font-heading text-zinc-100">User Growth Adoption Curve</h3>
            <p className="text-xs text-zinc-400">Verified platform member progression</p>
          </div>
          <UserGrowthChart usersCount={users.length} />
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-zinc-800">
          <div>
            <h3 className="text-base font-bold font-heading text-zinc-100">Distress Category Breakdown</h3>
            <p className="text-xs text-zinc-400">Categorical incident distribution</p>
          </div>
          <SeverityPieChart data={categoryData} />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
