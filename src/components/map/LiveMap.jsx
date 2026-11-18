import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { FiNavigation, FiSearch, FiMapPin, FiLoader } from 'react-icons/fi';
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
function MapClickHandler({ onLocationChange }) {
  useMapEvents({
    click(e) {
      if (onLocationChange) {
        onLocationChange(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}

// Custom SVG map marker icon for Leaflet
const createCustomIcon = (color = '#E91E63') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="36" height="36"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-svg-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

const LiveMap = ({ 
  latitude = 23.8103, 
  longitude = 90.4125, 
  accuracy = null, 
  zoom = 15, 
  title = "Live Location", 
  markers = [],
  onLocationChange = null,
  allowManualAdjustment = true
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
    toast.loading(isBn ? 'স্যাটেলাইট জিপিএস থেকে সঠিক অবস্থান খোঁজা হচ্ছে...' : 'Acquiring high-precision GPS signal...', { id: 'gps-locating', duration: 3000 });

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
            toast.error(isBn ? 'লোকেশন অ্যাক্সেস দেওয়া হয়নি। ব্রাউজার পারমিশন চেক করুন।' : 'Location permission denied. Please allow GPS access in browser.', { id: 'gps-locating' });
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
          onLocationChange(newLat, newLng, 10, data[0].display_name);
        }
        toast.success(isBn ? `ম্যাপ "${data[0].display_name.split(',')[0]}" এ স্থানান্তরিত হয়েছে!` : `Moved to "${data[0].display_name.split(',')[0]}"!`);
      } else {
        toast.error(isBn ? 'স্থানটি খুঁজে পাওয়া যায়নি। এলাকার নাম সঠিকভাবে লিখুন।' : 'Location not found. Try entering area or street name.');
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
    <div className="w-full rounded-3xl overflow-hidden shadow-xl border border-pink-500/20 relative z-0 flex flex-col">
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
              placeholder={isBn ? '🔍 এলাকা বা ঠিকানা খুঁজুন (যেমন: ধানমন্ডি, মিরপুর, জিইসি)...' : '🔍 Search area or address (e.g. Dhanmondi, Mirpur)...'}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-rose-500 font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-3 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-700 hover:bg-rose-600 hover:text-white text-zinc-700 dark:text-zinc-200 text-xs font-semibold font-mono transition flex items-center gap-1"
          >
            {isSearching ? <FiLoader className="animate-spin" /> : isBn ? 'খুঁজুন' : 'Search'}
          </button>
        </form>

        {/* Locate Me Action Button */}
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-mono transition flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
          title={isBn ? 'আপনার বর্তমান লাইভ স্থান নির্ধারণ করুন' : 'Locate my real-time position'}
        >
          <FiNavigation className={isLocating ? 'animate-spin' : 'animate-pulse'} />
          <span>{isBn ? '🎯 আমার অবস্থান' : '🎯 Locate Me'}</span>
        </button>
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
          {onLocationChange && <MapClickHandler onLocationChange={onLocationChange} />}
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User Current Position */}
          <Marker 
            position={[latitude, longitude]} 
            icon={userIcon}
            draggable={Boolean(onLocationChange && allowManualAdjustment)}
            eventHandlers={{
              dragend: (e) => {
                if (onLocationChange) {
                  const pos = e.target.getLatLng();
                  onLocationChange(pos.lat, pos.lng);
                  toast.success(isBn ? `অবস্থান আপডেট হয়েছে: ${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}` : `Location updated: ${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`);
                }
              }
            }}
          >
            <Popup>
              <div className="p-1 text-center font-heading">
                <strong className="text-pink-600 block text-xs uppercase">{isBn ? 'বর্তমান অবস্থান' : title}</strong>
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
      </div>
    </div>
  );
};

export default LiveMap;
