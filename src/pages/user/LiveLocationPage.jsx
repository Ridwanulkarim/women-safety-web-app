import React from 'react';
import { FiMapPin, FiShare2, FiExternalLink, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import { useGeolocation } from '../../hooks/useGeolocation';
import LiveMap from '../../components/map/LiveMap';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';
import { toBengaliDigits, localizeNum } from '../../utils/helpers';

const LiveLocationPage = () => {
  const location = useGeolocation(true);
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const handleShareLocation = async () => {
    const mapsUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
    const shareText = isBn
      ? `সেফহেভেন জরুরি লোকেশন:\nঅক্ষাংশ ${toBengaliDigits(location.latitude.toFixed(4))}, দ্রাঘিমাংশ ${toBengaliDigits(location.longitude.toFixed(4))}।\nগুগল ম্যাপস: ${mapsUrl}`
      : `SafeHaven live location:\nLat ${location.latitude.toFixed(4)}, Lng ${location.longitude.toFixed(4)}.\nGoogle Maps: ${mapsUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: isBn ? 'সেফহ্যাভেন লাইভ লোকেশন' : 'SafeHaven emergency location',
          text: shareText,
          url: mapsUrl
        });
        toast.success(isBn ? 'লোকেশন শেয়ার করা হয়েছে' : 'Location shared');
        return;
      } catch (err) {}
    }

    try {
      await navigator.clipboard.writeText(shareText);
      toast.success(isBn ? 'লোকেশন ও গুগল ম্যাপস লিঙ্ক কপি হয়েছে' : 'Location and Google Maps link copied');
    } catch (err) {
      toast.error(isBn ? 'ক্লিপবোর্ডে কপি করা যায়নি' : 'Failed to copy location');
    }
  };

  const handleRefreshGPS = () => {
    toast.loading(isBn ? 'জিপিএস অবস্থান আপডেট করা হচ্ছে' : 'Refreshing GPS coordinates', { duration: 2500 });
    location.refreshLocation();
  };

  const getSourceLabel = () => {
    switch (location.source) {
      case 'GPS':
      case 'GPS_WATCH':
        return isBn ? 'স্যাটেলাইট জিপিএস' : 'Hardware GPS';
      case 'NETWORK':
        return isBn ? 'নেটওয়ার্ক অবস্থান' : 'Network triangulation';
      case 'IP':
        return isBn ? 'আইপি আনুমানিক অবস্থান' : 'Network IP approx';
      case 'MANUAL':
        return isBn ? 'ম্যাপে নির্ধারিত পিন' : 'Pinned manually';
      default:
        return isBn ? 'জিপিএস খোঁজা হচ্ছে' : 'Resolving GPS';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="surface-panel p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-medium text-[#171717] dark:text-[#ededed]">
              {isBn ? 'লাইভ লোকেশন রাডার' : 'Live geolocation radar'}
            </h1>
            <span className="status-tag">{getSourceLabel()}</span>
          </div>
          <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
            {location.address || (isBn ? 'রিয়েল-টাইম অবস্থান টেলিমেট্রি' : 'Continuous spatial coordinates')}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleRefreshGPS}
            disabled={location.loading}
            className="flex-1 sm:flex-initial btn-outline h-10 px-4 text-xs"
          >
            <FiRefreshCw className={`w-4 h-4 dispatch-icon ${location.loading ? 'animate-spin' : ''}`} />
            {isBn ? 'জিপিএস রিফ্রেশ' : 'Refresh GPS'}
          </button>

          <button
            onClick={handleShareLocation}
            className="flex-1 sm:flex-initial btn-danger h-10 px-4 text-xs"
          >
            <FiShare2 className="w-4 h-4 dispatch-icon" /> {isBn ? 'লোকেশন শেয়ার' : 'Share location'}
          </button>
        </div>
      </div>

      {location.error && (
        <div className="p-4 rounded-xl bg-[#f4f4f5] dark:bg-[#232325] border border-zinc-900/[0.08] dark:border-white/[0.08] flex items-start gap-3 text-xs text-[#525252] dark:text-[#a1a1a6]">
          <FiAlertTriangle className="w-4 h-4 text-[#e11d48] shrink-0 mt-0.5 dispatch-icon" />
          <div className="space-y-1">
            <p className="font-medium text-[#171717] dark:text-[#ededed]">
              {isBn ? 'জিপিএস নির্ভুলতা সংক্রান্ত তথ্য' : 'GPS precision notice'}
            </p>
            <p>{location.error}</p>
            <p className="text-[#737373] dark:text-[#85858b]">
              {isBn
                ? 'ম্যাপের সার্চবারে এলাকা লিখে খুঁজতে পারেন অথবা মার্কারটি টেনে সঠিক অবস্থান নির্ধারণ করতে পারেন।'
                : 'Search your neighborhood above or drag the map marker directly to set your exact spot.'}
            </p>
          </div>
        </div>
      )}

      <LiveMap
        latitude={location.latitude}
        longitude={location.longitude}
        accuracy={location.accuracy}
        source={location.source}
        isApproximate={location.isApproximate}
        permissionDenied={location.permissionDenied}
        title={isBn ? 'আপনার লাইভ অবস্থান' : 'Your live coordinates'}
        onLocationChange={(lat, lng, acc, addr) => {
          location.setManualLocation(lat, lng, addr);
          toast.success(
            isBn
              ? `অবস্থান আপডেট হয়েছে: ${toBengaliDigits(lat.toFixed(4))}, ${toBengaliDigits(lng.toFixed(4))}`
              : `Location updated: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
          );
        }}
      />

      {/* Tabular Coordinate Strip */}
      <div className="surface-panel p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="surface-raised p-4">
            <span className="text-[#737373] dark:text-[#85858b] block">{isBn ? 'অক্ষাংশ' : 'Latitude'}</span>
            <p className="font-mono tabular-nums text-sm font-medium text-[#171717] dark:text-[#ededed] mt-1">
              {localizeNum(location.latitude.toFixed(6), isBn)}° {isBn ? 'উত্তর' : 'N'}
            </p>
          </div>

          <div className="surface-raised p-4">
            <span className="text-[#737373] dark:text-[#85858b] block">{isBn ? 'দ্রাঘিমাংশ' : 'Longitude'}</span>
            <p className="font-mono tabular-nums text-sm font-medium text-[#171717] dark:text-[#ededed] mt-1">
              {localizeNum(location.longitude.toFixed(6), isBn)}° {isBn ? 'পূর্ব' : 'E'}
            </p>
          </div>

          <div className="surface-raised p-4">
            <span className="text-[#737373] dark:text-[#85858b] block">{isBn ? 'নির্ভুলতা' : 'Accuracy radius'}</span>
            <p className="font-mono tabular-nums text-sm font-medium text-[#171717] dark:text-[#ededed] mt-1">
              ±{localizeNum(location.accuracy ? Math.round(location.accuracy) : 25, isBn)} {isBn ? 'মি.' : 'm'}
            </p>
          </div>

          <div className="surface-raised p-4">
            <span className="text-[#737373] dark:text-[#85858b] block">{isBn ? 'স্ট্যাটাস' : 'Status'}</span>
            <p className="text-sm font-medium text-[#16a34a] dark:text-[#4cc38a] mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16a34a] dark:bg-[#4cc38a]"></span>
              {isBn ? 'সক্রিয়' : 'Active'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-xs border-t border-zinc-900/[0.08] dark:border-white/[0.08]">
          <span className="text-[#737373] dark:text-[#85858b]">
            {isBn
              ? 'এলাকা খুঁজতে ওপরের সার্চবার ব্যবহার করুন বা মার্কার টেনে অবস্থান নিশ্চিত করুন।'
              : 'Use search or drag the map marker to adjust precision.'}
          </span>
          <a
            href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-[#e11d48] dark:text-[#fb7185] hover:underline"
          >
            {isBn ? 'গুগল ম্যাপসে খুলুন' : 'Open in Google Maps'} <FiExternalLink className="w-3.5 h-3.5 dispatch-icon" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default LiveLocationPage;
