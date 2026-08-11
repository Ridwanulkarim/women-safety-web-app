import axios from 'axios';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('vercel.app')) {
      return '/api';
    }
    if (host !== 'localhost' && host !== '127.0.0.1') {
      // Mobile local Wi-Fi testing: point to host computer's backend API port 5001
      return `http://${host}:5001/api`;
    }
  }
  return 'http://127.0.0.1:5001/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('safehaven_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
