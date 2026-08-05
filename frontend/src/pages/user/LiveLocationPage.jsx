import React from 'react';
import { FiMapPin, FiNavigation, FiShare2, FiRefreshCw } from 'react-icons/fi';
import { useGeolocation } from '../../hooks/useGeolocation';
import LiveMap from '../../components/map/LiveMap';
import toast from 'react-hot-toast';

const LiveLocationPage = () => {
  const location = useGeolocation(true);

  const handleShareLocation = () => {
    const shareText = `Emergency Safety Location Check: I am at Lat ${location.latitude.toFixed(4)}, Lng ${location.longitude.toFixed(4)}. Track me on SafeHaven.`;
    navigator.clipboard.writeText(shareText);
    toast.success('Live location link copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
            <FiMapPin />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-heading">Live Geolocation Tracking</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time continuous GPS tracking and location broadcast engine.</p>
          </div>
        </div>

        <button
          onClick={handleShareLocation}
          className="px-5 py-3 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-pink-600/30 transition"
        >
          <FiShare2 /> Share Live Location
        </button>
      </div>

      {/* Map Card */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <LiveMap latitude={location.latitude} longitude={location.longitude} title="Your Live Coordinates" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Latitude</span>
            <p className="font-extrabold text-pink-600 dark:text-pink-400 text-sm mt-0.5">{location.latitude.toFixed(6)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Longitude</span>
            <p className="font-extrabold text-purple-600 dark:text-purple-400 text-sm mt-0.5">{location.longitude.toFixed(6)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Status</span>
            <p className="font-extrabold text-emerald-500 text-sm mt-0.5 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> GPS Polling Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveLocationPage;
