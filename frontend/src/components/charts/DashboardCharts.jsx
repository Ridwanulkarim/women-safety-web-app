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
    labels: data.map(d => d.month || 'Month'),
    datasets: [
      {
        label: 'SOS Emergency Alerts',
        data: data.map(d => d.count || 0),
        backgroundColor: 'rgba(233, 30, 99, 0.7)',
        borderColor: '#E91E63',
        borderRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94A3B8' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94A3B8' } }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export const UserGrowthChart = () => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Active Users',
        data: [120, 210, 350, 480, 690, 890, 1150],
        borderColor: '#7C3AED',
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94A3B8' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94A3B8' } }
    }
  };

  return <Line data={chartData} options={options} />;
};

export const SeverityPieChart = ({ data = [] }) => {
  const chartData = {
    labels: data.map(d => d.category),
    datasets: [
      {
        data: data.map(d => d.count),
        backgroundColor: ['#E91E63', '#7C3AED', '#3B82F6', '#10B981'],
        borderWidth: 0
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#94A3B8', boxWidth: 12 } }
    }
  };

  return <Pie data={chartData} options={options} />;
};
