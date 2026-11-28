import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const monoTickFont = { family: "'IBM Plex Mono', monospace", size: 11 };

export const SOSChart = ({ data = [] }) => {
  const counts = data.map((d) => d.count || 0);
  const maxVal = Math.max(...counts, 1);

  const chartData = {
    labels: data.map((d) => d.month || 'Month'),
    datasets: [
      {
        label: 'SOS alerts',
        data: counts,
        backgroundColor: counts.map((v, idx) =>
          v > 0 && (v === maxVal || idx === counts.length - 1) ? '#e11d48' : 'rgba(133, 133, 139, 0.35)'
        ),
        borderRadius: 6,
        maxBarThickness: 36
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#19191b',
        titleColor: '#ededed',
        bodyColor: '#a1a1a6',
        borderColor: 'rgba(237, 237, 237, 0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#85858b', font: monoTickFont }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(133, 133, 139, 0.14)' },
        border: { display: false },
        ticks: { color: '#85858b', font: monoTickFont, stepSize: 1 }
      }
    }
  };

  return (
    <div className="h-[280px] w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export const UserGrowthChart = ({ usersCount = 0, data }) => {
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  const dynamicSeries =
    data ||
    (usersCount === 0
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
        ]);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Verified accounts',
        data: dynamicSeries,
        borderColor: '#e11d48',
        backgroundColor: 'rgba(225, 29, 72, 0.08)',
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#e11d48',
        pointBorderWidth: 0,
        pointRadius: 3,
        pointHoverRadius: 5
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#19191b',
        titleColor: '#ededed',
        bodyColor: '#a1a1a6',
        borderColor: 'rgba(237, 237, 237, 0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#85858b', font: monoTickFont }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(133, 133, 139, 0.14)' },
        border: { display: false },
        ticks: { color: '#85858b', font: monoTickFont, stepSize: 1 }
      }
    }
  };

  return (
    <div className="h-[280px] w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};

export const SeverityPieChart = ({ data = [] }) => {
  const totalCount = data.reduce((acc, d) => acc + (d.count || 0), 0);

  if (totalCount === 0 || data.length === 0) {
    return (
      <div className="h-[280px] flex flex-col items-center justify-center text-center p-6 space-y-2">
        <p className="text-sm font-medium text-[#171717] dark:text-[#ededed]">No distress categories</p>
        <p className="text-xs text-[#737373] dark:text-[#85858b] max-w-xs">
          Distribution appears automatically once users trigger SOS dispatches.
        </p>
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => (b.count || 0) - (a.count || 0));

  return (
    <div className="space-y-4 py-2">
      {sorted.map((item, idx) => {
        const pct = Math.round(((item.count || 0) / totalCount) * 100);
        return (
          <div key={item.category || idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#171717] dark:text-[#ededed] truncate pr-3">
                {item.category}
              </span>
              <span className="font-mono tabular-nums text-[#737373] dark:text-[#85858b] shrink-0">
                {item.count} · {pct}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#f4f4f5] dark:bg-[#232325] overflow-hidden">
              <div
                className={`h-full rounded-full ${idx === 0 ? 'bg-[#e11d48]' : 'bg-[#737373] dark:bg-[#85858b]'}`}
                style={{ width: `${Math.max(4, pct)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
