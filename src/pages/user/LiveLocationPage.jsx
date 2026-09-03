import React from 'react';
import { FiMapPin, FiShare2, FiExternalLink } from 'react-icons/fi';
import { useGeolocation } from '../../hooks/useGeolocation';
import LiveMap from '../../components/map/LiveMap';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';

const LiveLocationPage = () => {
  const location = useGeolocation(true);
  const { t } = useLanguage();

  const handleShareLocation = async () => {
    const mapsUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
    const shareText = `🚨 SafeHaven Emergency Location Check:\nI am at Lat ${location.latitude.toFixed(4)}, Lng ${location.longitude.toFixed(4)}.\nView Live Map on Google Maps: ${mapsUrl}`;

    // Native Mobile Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SafeHaven Emergency Location',
          text: shareText,
          url: mapsUrl
        });
        toast.success('Location shared successfully!');
        return;
      } catch (err) {
        // User cancelled native share dialog or fallback
      }
    }

    // Fallback: Copy formatting text + Google Maps link to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('Live location message & Google Maps link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy location to clipboard.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="glass-card-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-rose-600/30">
            <FiMapPin />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-zinc-900 dark:text-white">{t('nav.liveLocation')}</h1>
              <span className="mono-tag mono-tag-emerald text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 telemetry-dot"></span> BROADCAST ACTIVE
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Continuous high-accuracy GPS telemetry broadcasting.</p>
          </div>
        </div>

        <button
          onClick={handleShareLocation}
          className="btn-danger py-3 px-5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-rose-600/25"
        >
          <FiShare2 /> Share Live Location
        </button>
      </div>

      {/* Map Card */}
      <div className="glass-card-xl p-6 sm:p-8 rounded-3xl space-y-5 relative z-10">
        <div className="rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 shadow-md">
          <LiveMap latitude={location.latitude} longitude={location.longitude} accuracy={location.accuracy} title="Your Live Coordinates" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60">
            <span className="text-[10px] text-zinc-400 font-bold uppercase font-mono">Latitude</span>
            <p className="font-extrabold text-rose-600 dark:text-rose-400 text-sm mt-0.5 font-mono">{location.latitude.toFixed(6)}° N</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60">
            <span className="text-[10px] text-zinc-400 font-bold uppercase font-mono">Longitude</span>
            <p className="font-extrabold text-purple-600 dark:text-purple-400 text-sm mt-0.5 font-mono">{location.longitude.toFixed(6)}° E</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60">
            <span className="text-[10px] text-zinc-400 font-bold uppercase font-mono">Status</span>
            <p className="font-extrabold text-emerald-500 text-sm mt-0.5 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> GPS Polling Active
            </p>
          </div>
        </div>

        {/* Quick Google Maps Direct External Link */}
        <div className="pt-2 text-right">
          <a
            href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
          >
            Open in Google Maps App <FiExternalLink />
          </a>
        </div>
      </div>
    </div>
  );
};

export default LiveLocationPage;
