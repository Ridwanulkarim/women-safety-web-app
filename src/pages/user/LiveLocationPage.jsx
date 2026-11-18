import React from 'react';
import { FiMapPin, FiShare2, FiExternalLink, FiRefreshCw, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { useGeolocation } from '../../hooks/useGeolocation';
import LiveMap from '../../components/map/LiveMap';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';

const LiveLocationPage = () => {
  const location = useGeolocation(true);
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const handleShareLocation = async () => {
    const mapsUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
    const shareText = isBn
      ? `🚨 সেফহ্যাভেন জরুরি লোকেশন চেক:\nআমি বর্তমানে অবস্থান করছি: অক্ষাংশ ${location.latitude.toFixed(4)}, দ্রাঘিমাংশ ${location.longitude.toFixed(4)}।\nগুগল ম্যাপসে লাইভ লোকেশন দেখুন: ${mapsUrl}`
      : `🚨 SafeHaven Emergency Location Check:\nI am at Lat ${location.latitude.toFixed(4)}, Lng ${location.longitude.toFixed(4)}.\nView Live Map on Google Maps: ${mapsUrl}`;

    // Native Mobile Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: isBn ? 'সেফহ্যাভেন লাইভ লোকেশন' : 'SafeHaven Emergency Location',
          text: shareText,
          url: mapsUrl
        });
        toast.success(isBn ? 'লোকেশন সফলভাবে শেয়ার করা হয়েছে!' : 'Location shared successfully!');
        return;
      } catch (err) {
        // User cancelled native share dialog
      }
    }

    // Fallback: Copy formatting text + Google Maps link to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success(isBn ? 'লাইভ লোকেশন ও গুগল ম্যাপস লিঙ্ক ক্লিপবোর্ডে কপি হয়েছে!' : 'Live location message & Google Maps link copied to clipboard!');
    } catch (err) {
      toast.error(isBn ? 'ক্লিপবোর্ডে কপি করা যায়নি।' : 'Failed to copy location to clipboard.');
    }
  };

  const handleRefreshGPS = () => {
    toast.loading(isBn ? 'স্যাটেলাইট জিপিএস সিগন্যাল রিফ্রেশ করা হচ্ছে...' : 'Polling high-accuracy GPS satellites...', { duration: 2500 });
    location.refreshLocation();
  };

  const getSourceBadge = () => {
    switch (location.source) {
      case 'GPS':
      case 'GPS_WATCH':
        return {
          label: isBn ? 'স্যাটেলাইট জিপিএস (নির্ভুল)' : 'Hardware GPS Satellite (Accurate)',
          color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
        };
      case 'NETWORK':
        return {
          label: isBn ? 'ওয়াই-ফাই / সেলুলার ট্রায়াঙ্গুলেশন' : 'Wi-Fi / Cell Triangulation',
          color: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
        };
      case 'IP':
        return {
          label: isBn ? 'নেটওয়ার্ক আইপি লোকেশন (আনুমানিক)' : 'Network IP Geolocation (Approx)',
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
        };
      case 'MANUAL':
        return {
          label: isBn ? 'ব্যবহারকারী কর্তৃক পিন করা স্থান' : 'User Pinned on Map',
          color: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
        };
      default:
        return {
          label: isBn ? 'জিপিএস সংযোগ স্থাপিত হচ্ছে...' : 'GPS Resolving...',
          color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30'
        };
    }
  };

  const sourceBadge = getSourceBadge();

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header bar */}
      <div className="glass-card-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-rose-600/30">
            <FiMapPin />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-zinc-900 dark:text-white">
                {isBn ? 'লাইভ লোকেশন রাডার' : 'Live Geolocation Radar'}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${sourceBadge.color}`}>
                {sourceBadge.label}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {location.address || (isBn ? 'ধারাবাহিক রিয়েল-টাইম অবস্থান টেলিমেট্রি' : 'Continuous real-time spatial telemetry')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleRefreshGPS}
            disabled={location.loading}
            className="flex-1 sm:flex-initial py-3 px-4 rounded-xl text-xs font-mono font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 transition-all flex items-center justify-center gap-2"
            title={isBn ? 'উচ্চ নির্ভুলতার জিপিএস রিফ্রেশ করুন' : 'Force refresh high-accuracy GPS'}
          >
            <FiRefreshCw className={location.loading ? 'animate-spin' : ''} /> {isBn ? 'জিপিএস রিফ্রেশ' : 'Refresh GPS'}
          </button>

          <button
            onClick={handleShareLocation}
            className="flex-1 sm:flex-initial btn-danger py-3 px-5 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25"
          >
            <FiShare2 /> {isBn ? 'লোকেশন শেয়ার করুন' : 'Share Location'}
          </button>
        </div>
      </div>

      {/* Permission / Accuracy Advisory Banner */}
      {location.error && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
          <FiAlertTriangle className="text-amber-400 text-base shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-300">{isBn ? 'জিপিএস নির্ভুলতা সংক্রান্ত নোটিশ:' : 'GPS Accuracy Notice:'}</p>
            <p className="text-amber-200/80 leading-relaxed">
              {location.error}
            </p>
            <p className="text-zinc-400 text-[11px] mt-1">
              💡 <strong>{isBn ? 'পরামর্শ:' : 'Tip:'}</strong> {isBn ? 'আপনি ম্যাপের সার্চবারে এলাকা লিখে খুঁজতে পারেন অথবা সরাসরি গোলাপি মার্কারটি টেনে আপনার সঠিক অবস্থান সেট করতে পারেন!' : 'You can search area or click anywhere on the map or drag the pink pin directly to lock your 100% exact location!'}
            </p>
          </div>
        </div>
      )}

      {/* Map Card */}
      <div className="glass-card-xl p-6 sm:p-8 rounded-3xl space-y-5 relative z-10">
        <div className="rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 shadow-md">
          <LiveMap 
            latitude={location.latitude} 
            longitude={location.longitude} 
            accuracy={location.accuracy} 
            source={location.source}
            isApproximate={location.isApproximate}
            permissionDenied={location.permissionDenied}
            title={isBn ? 'আপনার লাইভ অবস্থান' : 'Your Live Coordinates'}
            onLocationChange={(lat, lng, acc, addr) => {
              location.setManualLocation(lat, lng, addr);
              toast.success(isBn ? `অবস্থান আপডেট হয়েছে: অক্ষাংশ ${lat.toFixed(4)}, দ্রাঘিমাংশ ${lng.toFixed(4)}!` : `Location updated to Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}!`);
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60">
            <span className="text-[10px] text-zinc-400 font-bold uppercase font-mono">{isBn ? 'অক্ষাংশ (Latitude)' : 'Latitude'}</span>
            <p className="font-extrabold text-rose-600 dark:text-rose-400 text-sm mt-0.5 font-mono">{location.latitude.toFixed(6)}° {isBn ? 'উত্তর' : 'N'}</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60">
            <span className="text-[10px] text-zinc-400 font-bold uppercase font-mono">{isBn ? 'দ্রাঘিমাংশ (Longitude)' : 'Longitude'}</span>
            <p className="font-extrabold text-purple-600 dark:text-purple-400 text-sm mt-0.5 font-mono">{location.longitude.toFixed(6)}° {isBn ? 'পূর্ব' : 'E'}</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60">
            <span className="text-[10px] text-zinc-400 font-bold uppercase font-mono">{isBn ? 'নির্ভুলতার সীমা' : 'Precision Radius'}</span>
            <p className="font-extrabold text-blue-500 text-sm mt-0.5 font-mono">
              &plusmn;{location.accuracy ? Math.round(location.accuracy) : 25} {isBn ? 'মিটার' : 'meters'}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60">
            <span className="text-[10px] text-zinc-400 font-bold uppercase font-mono">{isBn ? 'টেলিমেট্রি স্ট্যাটাস' : 'Telemetry Status'}</span>
            <p className="font-extrabold text-emerald-500 text-sm mt-0.5 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> {isBn ? 'সক্রিয় (Active)' : 'Active'}
            </p>
          </div>
        </div>

        {/* Quick Google Maps Direct External Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-xs">
          <span className="text-[11px] text-zinc-500 italic">
            {isBn ? '* এলাকা খুঁজতে ওপরের সার্চবার ব্যবহার করুন অথবা মার্কারটি ড্র্যাগ করে সঠিক স্থানে রাখুন।' : '* Drag the marker on the map or use the search bar above to manually fine-tune your precise room or street.'}
          </span>
          <a
            href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-rose-600 dark:text-rose-400 hover:underline"
          >
            {isBn ? 'গুগল ম্যাপস অ্যাপে দেখুন' : 'Open in Google Maps App'} <FiExternalLink />
          </a>
        </div>
      </div>
    </div>
  );
};

export default LiveLocationPage;
