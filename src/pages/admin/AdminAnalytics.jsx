import React, { useState, useEffect } from 'react';
import { FiCpu } from 'react-icons/fi';
import { UserGrowthChart, SeverityPieChart } from '../../components/charts/DashboardCharts';
import { getGlobalSOSAlerts, getRegisteredUsers } from '../../utils/adminDataRegistry';
import AdminAIAgentDrawer from '../../components/admin/AdminAIAgentDrawer';

const AdminAnalytics = () => {
  const [alerts, setAlerts] = useState(() => getGlobalSOSAlerts());
  const [users, setUsers] = useState(() => getRegisteredUsers());
  const [isAIAgentOpen, setIsAIAgentOpen] = useState(false);

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

  const categoriesMap = {};
  alerts.forEach((a) => {
    const cat = a.category || 'Direct SOS distress';
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono text-[#737373] dark:text-[#85858b]">Platform metrics</span>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-[#171717] dark:text-[#ededed]">
            System analytics
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
            Distress incident distribution, resolution rate, and registered account growth
          </p>
        </div>

        <button onClick={() => setIsAIAgentOpen(true)} className="btn-solid h-10 px-4 text-xs shrink-0">
          <FiCpu className="w-4 h-4 dispatch-icon" /> AI analytics copilot
        </button>
      </div>

      <AdminAIAgentDrawer
        defaultMode="ANALYTICS"
        isOpen={isAIAgentOpen}
        onClose={() => setIsAIAgentOpen(false)}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="surface-card p-5 space-y-2">
          <span className="text-xs text-[#737373] dark:text-[#85858b] block">Resolution rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-medium font-mono tabular-nums text-[#16a34a] dark:text-[#4cc38a]">{resolutionRate}%</span>
            <span className="text-xs text-[#737373] dark:text-[#85858b] font-mono tabular-nums">
              {resolvedAlerts} of {totalAlerts} cases
            </span>
          </div>
          <p className="text-xs text-[#737373] dark:text-[#85858b]">Completed dispatches vs total alerts</p>
        </div>

        <div className="surface-card p-5 space-y-2">
          <span className="text-xs text-[#737373] dark:text-[#85858b] block">Dispatch gateway readiness</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-medium font-mono tabular-nums text-[#171717] dark:text-[#ededed]">100%</span>
            <span className="status-tag mono-tag-emerald">Online</span>
          </div>
          <p className="text-xs text-[#737373] dark:text-[#85858b]">National 999 and helpline relays ready</p>
        </div>

        <div className="surface-card p-5 space-y-2">
          <span className="text-xs text-[#737373] dark:text-[#85858b] block">Verified accounts</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-medium font-mono tabular-nums text-[#171717] dark:text-[#ededed]">{users.length}</span>
            <span className="text-xs text-[#737373] dark:text-[#85858b]">registered users</span>
          </div>
          <p className="text-xs text-[#737373] dark:text-[#85858b]">Active citizens synced in Firestore</p>
        </div>
      </div>

      {/* Main Chart + Ranked Share Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 surface-panel p-6 space-y-4">
          <div className="border-b border-zinc-900/[0.08] dark:border-white/[0.08] pb-3">
            <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">Verified account adoption</h2>
            <p className="text-xs text-[#737373] dark:text-[#85858b]">Monthly account registration trend</p>
          </div>
          <UserGrowthChart usersCount={users.length} />
        </div>

        <div className="lg:col-span-4 surface-panel p-6 space-y-4">
          <div className="border-b border-zinc-900/[0.08] dark:border-white/[0.08] pb-3">
            <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">Category share</h2>
            <p className="text-xs text-[#737373] dark:text-[#85858b]">Distress triggers by source category</p>
          </div>
          <SeverityPieChart data={categoryData} />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
