import React from 'react';
import { SOSChart, UserGrowthChart, SeverityPieChart } from '../../components/charts/DashboardCharts';

const AdminAnalytics = () => {
  const categoryData = [
    { category: 'Physical Threat', count: 45 },
    { category: 'Stalking / Following', count: 30 },
    { category: 'Medical Emergency', count: 15 },
    { category: 'Harassment', count: 10 }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-purple-400">Emergency System Analytics</h1>
        <p className="text-xs text-slate-400">Statistical distribution of distress alerts, response times, and user growth.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold font-heading text-slate-200">Incident Trends</h3>
          <UserGrowthChart />
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold font-heading text-slate-200">Distress Category Breakdown</h3>
          <SeverityPieChart data={categoryData} />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
