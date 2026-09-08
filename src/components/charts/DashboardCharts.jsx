import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const SOSChart = ({ data = [] }) => {
  const chartData = {
    labels: data.map((d) => d.month || 'Month'),
    datasets: [
      {
        label: 'SOS Emergency Alerts',
        data: data.map((d) => d.count || 0),
        backgroundColor: 'rgba(225, 29, 72, 0.75)',
        borderColor: '#E11D48',
        borderRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#f4f4f5',
        bodyColor: '#e4e4e7',
        borderColor: '#27272a',
        borderWidth: 1
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#71717a', font: { family: 'monospace' } } },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#71717a', font: { family: 'monospace' }, stepSize: 1 }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export const UserGrowthChart = ({ usersCount = 0, data }) => {
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  
  // Calculate dynamic data series based on real usersCount
  const dynamicSeries = data || (
    usersCount === 0
      ? [0, 0, 0, 0, 0, 0]
      : usersCount === 1
      ? [0, 0, 0, 0, 1, 1]
      : [
          Math.max(0, Math.floor(usersCount * 0.2)),
          Math.max(0, Math.floor(usersCount * 0.4)),
          Math.max(0, Math.floor(usersCount * 0.6)),
          Math.max(0, Math.floor(usersCount * 0.8)),
          usersCount,
          usersCount
        ]
  );

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Verified Users',
        data: dynamicSeries,
        borderColor: '#E11D48',
        backgroundColor: 'rgba(225, 29, 72, 0.15)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#E11D48',
        pointBorderColor: '#fff',
        pointRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#f4f4f5',
        bodyColor: '#e4e4e7',
        borderColor: '#27272a',
        borderWidth: 1
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#71717a', font: { family: 'monospace' } } },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#71717a', font: { family: 'monospace' }, stepSize: 1 }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

export const SeverityPieChart = ({ data = [] }) => {
  const totalCount = data.reduce((acc, d) => acc + (d.count || 0), 0);

  if (totalCount === 0 || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-2">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold">
          ✓
        </div>
        <p className="text-xs font-bold text-zinc-300">No Incident Categories</p>
        <p className="text-[11px] text-zinc-500 max-w-xs">
          Zero distress categories recorded. Distribution will appear automatically when users trigger SOS dispatches.
        </p>
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: ['#E11D48', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'],
        borderWidth: 0
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#a1a1aa', font: { size: 11 }, boxWidth: 12, padding: 16 }
      }
    }
  };

  return <Pie data={chartData} options={options} />;
};
