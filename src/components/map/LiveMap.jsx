import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { FiNavigation, FiSearch, FiMapPin, FiLoader, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

/**
 * Imperatively recenters Leaflet map view whenever position (latitude/longitude) state updates
 */
function RecenterOnUpdate({ latitude, longitude, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (latitude != null && longitude != null) {
      map.setView([latitude, longitude], zoom || map.getZoom(), { animate: true });
    }
  }, [latitude, longitude, zoom, map]);
  return null;
}

/**
 * Captures user click on map to manually update location
 */
function MapClickHandler({ onLocationChange, isBn }) {
  useMapEvents({
    click(e) {
      if (onLocationChange) {
        onLocationChange(e.latlng.lat, e.latlng.lng, 10);
        toast.success(isBn ? 'ম্যাপে পিন আপডেট করা হয়েছে!' : 'Map pin updated!');
      }
    }
  });
  return null;
}

// Custom SVG map marker icon for Leaflet
const createCustomIcon = (color = '#E91E63') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="38" height="38"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-svg-icon',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });
};

const BANGLADESH_PRESETS = [
  { name_bn: 'ধানমন্ডি', name_en: 'Dhanmondi', lat: 23.7461, lng: 90.3742 },
  { name_bn: 'মিরপুর-১০', name_en: 'Mirpur-10', lat: 23.8069, lng: 90.3687 },
  { name_bn: 'গুলশান', name_en: 'Gulshan', lat: 23.7925, lng: 90.4078 },
  { name_bn: 'উত্তরা', name_en: 'Uttara', lat: 23.8759, lng: 90.3795 },
  { name_bn: 'মোহাম্মদপুর', name_en: 'Mohammadpur', lat: 23.7658, lng: 90.3584 },
  { name_bn: 'মতিঝিল', name_en: 'Motijheel', lat: 23.7330, lng: 90.4172 },
  { name_bn: 'বসুন্ধরা R/A', name_en: 'Bashundhara', lat: 23.8151, lng: 90.4328 },
  { name_bn: 'চট্টগ্রাম', name_en: 'Chittagong', lat: 22.3569, lng: 91.7832 },
  { name_bn: 'সিলেট', name_en: 'Sylhet', lat: 24.8949, lng: 91.8687 },
  { name_bn: 'রাজশাহী', name_en: 'Rajshahi', lat: 24.3745, lng: 88.6042 }
];

const LiveMap = ({ 
  latitude = 23.8103, 
  longitude = 90.4125, 
  accuracy = null, 
  zoom = 15, 
  title = "Live Location", 
  markers = [],
  onLocationChange = null,
  allowManualAdjustment = true,
  source = null,
  isApproximate = false,
  permissionDenied = false,
  onRefreshGPS = null
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Direct High-Accuracy Geolocation Handler
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error(isBn ? 'আপনার ব্রাউজারে জিপিএস সমর্থিত নয়।' : 'Geolocation not supported by browser.');
      return;
    }

    setIsLocating(true);
    toast.loading(isBn ? 'স্যাটেলাইট জিপিএস থেকে সঠিক অবস্থান খোঁজা হচ্ছে...' : 'Acquiring high-precision GPS signal...', { id: 'gps-locating', duration: 4000 });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy: acc } = pos.coords;
        if (onLocationChange) {
          onLocationChange(lat, lng, acc);
        }
        setIsLocating(false);
        toast.success(isBn ? `সঠিক অবস্থান পাওয়া গেছে! (±${Math.round(acc)} মিটার নির্ভুল)` : `Exact location acquired! (±${Math.round(acc)}m precision)`, { id: 'gps-locating' });
      },
      (err) => {
        console.warn('High precision GPS failed:', err.message);
        // Fallback low-accuracy
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude: lat, longitude: lng, accuracy: acc } = pos.coords;
            if (onLocationChange) {
              onLocationChange(lat, lng, acc);
            }
            setIsLocating(false);
            toast.success(isBn ? 'নেটওয়ার্কের মাধ্যমে অবস্থান পাওয়া গেছে।' : 'Location resolved via network.', { id: 'gps-locating' });
          },
          (err2) => {
            setIsLocating(false);
            toast.error(
              isBn 
                ? 'লোকেশন পারমিশন পাওয়া যায়নি। ব্রাউজারের অ্যাড্রেস বারের লক (🔒) আইকনে ক্লিক করে Allow করুন।' 
                : 'Location permission denied. Click the lock icon in your address bar to allow GPS.', 
              { id: 'gps-locating', duration: 5000 }
            );
          },
          { enableHighAccuracy: false, timeout: 8000 }
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Search locality via OpenStreetMap Nominatim
  const handleSearchLocation = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=bd&limit=1`, {
        headers: { 'Accept-Language': 'bn,en' }
      });
      const data = await res.json();
      if (data && data.length > 0) {
        const newLat = parseFloat(data[0].lat);
        const newLng = parseFloat(data[0].lon);
        if (onLocationChange) {
          onLocationChange(newLat, newLng, 15, data[0].display_name);
        }
        toast.success(isBn ? `ম্যাপ "${data[0].display_name.split(',')[0]}" এ স্থানান্তরিত হয়েছে!` : `Moved to "${data[0].display_name.split(',')[0]}"!`);
      } else {
        toast.error(isBn ? 'স্থানটি খুঁজে পাওয়া যায়নি। এলাকার নাম বা রোড সঠিকভাবে লিখুন।' : 'Location not found. Try entering area or street name.');
      }
    } catch (err) {
      toast.error(isBn ? 'অনুসন্ধান ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।' : 'Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const userIcon = createCustomIcon('#E91E63');
  const alertIcon = createCustomIcon('#EF4444');

  return (
    <div className="w-full rounded-3xl overflow-hidden shadow-xl border border-pink-500/20 relative z-0 flex flex-col font-sans">
      
      {/* Permission Warning Advisory Banner */}
      {permissionDenied && (
        <div className="bg-amber-500/10 dark:bg-amber-950/40 border-b border-amber-500/30 px-3.5 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2 text-amber-800 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="text-amber-500 shrink-0 text-base" />
            <span className="leading-tight">
              {isBn 
                ? '⚠️ ব্রাউজারে লোকেশন পারমিশন বন্ধ থাকায় আনুমানিক পয়েন্ট দেখানো হচ্ছে। সঠিক স্থান পেতে ব্রাউজারের অ্যাড্রেস বারের লক (🔒) আইকনে ক্লিক করে Location "Allow" করুন।' 
                : '⚠️ Browser location permission is blocked. Showing approximate spot. Click lock (🔒) in URL bar to Allow location.'}
            </span>
          </div>
          <button 
            type="button"
            onClick={handleLocateMe}
            className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] transition shadow-xs shrink-0"
          >
            {isBn ? '🔄 পারমিশন দিয়ে চেষ্টা করুন' : 'Retry Permission'}
          </button>
        </div>
      )}

      {/* Interactive Map Toolbar: Quick Search & Locate Me button */}
      <div className="bg-zinc-100/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 z-10">
        {/* Search Bar */}
        <form onSubmit={handleSearchLocation} className="flex-1 min-w-[200px] flex items-center gap-1.5">
          <div className="relative flex-1">
            <FiSearch className="absolute left-2.5 top-2.5 text-zinc-400 text-xs" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? '🔍 এলাকা বা ঠিকানা খুঁজুন (যেমন: ধানমন্ডি ২৭, মিরপুর ১০, আগ্রাবাদ)...' : '🔍 Search area or address (e.g. Dhanmondi, Mirpur 10)...'}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-rose-500 font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-3 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-700 hover:bg-rose-600 hover:text-white text-zinc-700 dark:text-zinc-200 text-xs font-semibold font-mono transition flex items-center gap-1 shrink-0"
          >
            {isSearching ? <FiLoader className="animate-spin" /> : isBn ? 'খুঁজুন' : 'Search'}
          </button>
        </form>

        {/* Locate Me Action Button */}
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-mono transition flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
          title={isBn ? 'আপনার বর্তমান লাইভ স্থান নির্ধারণ করুন' : 'Locate my real-time position'}
        >
          <FiNavigation className={isLocating ? 'animate-spin' : 'animate-pulse text-amber-300'} />
          <span>{isBn ? '🎯 আমার সঠিক অবস্থান' : '🎯 Locate Me'}</span>
        </button>
      </div>

      {/* Quick-Jump Preset Location Pills */}
      <div className="bg-white/95 dark:bg-zinc-950/95 px-3 py-1.5 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono no-scrollbar">
        <span className="text-zinc-400 dark:text-zinc-500 shrink-0 text-[10px] uppercase font-bold flex items-center gap-1">
          <FiMapPin className="text-rose-500 text-xs" /> {isBn ? 'জনপ্রিয় এলাকা:' : 'Quick Jump:'}
        </span>
        {BANGLADESH_PRESETS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              if (onLocationChange) {
                onLocationChange(p.lat, p.lng, 15, `${isBn ? p.name_bn : p.name_en}, Bangladesh`);
              }
              toast.success(isBn ? `ম্যাপ "${p.name_bn}" এ সেট হয়েছে!` : `Moved to ${p.name_en}!`);
            }}
            className="px-2.5 py-0.5 rounded-lg bg-zinc-100 hover:bg-rose-50 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 whitespace-nowrap transition border border-zinc-200/60 dark:border-zinc-700/60 font-sans text-xs"
          >
            {isBn ? p.name_bn : p.name_en}
          </button>
        ))}
      </div>

      {/* Leaflet Map Canvas */}
      <div className="w-full h-80 sm:h-96 relative">
        <MapContainer
          center={[latitude, longitude]}
          zoom={zoom}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <RecenterOnUpdate latitude={latitude} longitude={longitude} zoom={zoom} />
          {onLocationChange && <MapClickHandler onLocationChange={onLocationChange} isBn={isBn} />}
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User Current Position (Draggable for pixel-perfect fine tuning) */}
          <Marker 
            position={[latitude, longitude]} 
            icon={userIcon}
            draggable={Boolean(onLocationChange && allowManualAdjustment)}
            eventHandlers={{
              dragend: (e) => {
                if (onLocationChange) {
                  const pos = e.target.getLatLng();
                  onLocationChange(pos.lat, pos.lng, 10);
                  toast.success(isBn ? `অবস্থান আপডেট হয়েছে: ${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}` : `Location updated: ${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`);
                }
              }
            }}
          >
            <Popup>
              <div className="p-1 text-center font-heading">
                <strong className="text-pink-600 block text-xs uppercase">{isBn ? 'আপনার নির্বাচিত অবস্থান' : title}</strong>
                <span className="text-[11px] text-slate-700 block font-mono">
                  {isBn ? `অক্ষাংশ: ${latitude.toFixed(5)}, দ্রাঘিমাংশ: ${longitude.toFixed(5)}` : `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`}
                </span>
                {onLocationChange && allowManualAdjustment && (
                  <span className="text-[9px] text-zinc-500 italic mt-0.5 block">
                    {isBn ? 'মার্কার টেনে বা ম্যাপে ক্লিক করে সঠিক স্থান ঠিক করুন' : 'Drag marker or tap map to fine-tune'}
                  </span>
                )}
              </div>
            </Popup>
          </Marker>

          {/* Accuracy Range Circle */}
          <Circle
            center={[latitude, longitude]}
            radius={accuracy || 200}
            pathOptions={{ fillColor: '#E91E63', fillOpacity: 0.15, color: '#E91E63', weight: 1 }}
          />

          {/* Additional Emergency Markers */}
          {markers.map((m, idx) => (
            <Marker key={idx} position={[m.latitude, m.longitude]} icon={alertIcon}>
              <Popup>
                <div className="p-1">
                  <strong className="text-red-600 block text-xs">{m.title || (isBn ? 'জরুরি অ্যালার্ট' : 'Distress Alert')}</strong>
                  <span className="text-[10px] text-slate-600">{m.address}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Bottom Helper Bar */}
        <div className="absolute bottom-2 left-2 right-2 z-[400] pointer-events-none flex justify-center">
          <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-sans px-3 py-1 rounded-full shadow-lg border border-white/10 pointer-events-auto">
            💡 {isBn ? 'ম্যাপে যে কোনো স্থানে ক্লিক করে বা মার্কার টেনে নিজের বাড়ি/এলাকা নিশ্চিত করুন' : 'Click anywhere on map or drag the pink pin to lock your exact location'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
