import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { FiNavigation, FiSearch, FiMapPin, FiLoader, FiAlertTriangle } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { toBengaliDigits } from '../../utils/helpers';
import toast from 'react-hot-toast';

function RecenterOnUpdate({ latitude, longitude, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (latitude != null && longitude != null) {
      map.setView([latitude, longitude], zoom || map.getZoom(), { animate: true });
    }
  }, [latitude, longitude, zoom, map]);
  return null;
}

function MapClickHandler({ onLocationChange, isBn }) {
  useMapEvents({
    click(e) {
      if (onLocationChange) {
        onLocationChange(e.latlng.lat, e.latlng.lng, 10);
        toast.success(isBn ? 'ম্যাপে পিন আপডেট করা হয়েছে' : 'Map pin updated');
      }
    }
  });
  return null;
}

const createCustomIcon = (color = '#E11D48') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="36" height="36"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-svg-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

const BANGLADESH_PRESETS = [
  { name_bn: 'ধানমন্ডি', name_en: 'Dhanmondi', lat: 23.7461, lng: 90.3742 },
  { name_bn: 'মিরপুর-১০', name_en: 'Mirpur-10', lat: 23.8069, lng: 90.3687 },
  { name_bn: 'গুলশান', name_en: 'Gulshan', lat: 23.7925, lng: 90.4078 },
  { name_bn: 'উত্তরা', name_en: 'Uttara', lat: 23.8759, lng: 90.3795 },
  { name_bn: 'মোহাম্মদপুর', name_en: 'Mohammadpur', lat: 23.7658, lng: 90.3584 },
  { name_bn: 'মতিঝিল', name_en: 'Motijheel', lat: 23.7330, lng: 90.4172 },
  { name_bn: 'বসুন্ধরা', name_en: 'Bashundhara', lat: 23.8151, lng: 90.4328 },
  { name_bn: 'চট্টগ্রাম', name_en: 'Chittagong', lat: 22.3569, lng: 91.7832 },
  { name_bn: 'সিলেট', name_en: 'Sylhet', lat: 24.8949, lng: 91.8687 },
  { name_bn: 'রাজশাহী', name_en: 'Rajshahi', lat: 24.3745, lng: 88.6042 }
];

const LiveMap = ({
  latitude = 23.8103,
  longitude = 90.4125,
  accuracy = null,
  zoom = 15,
  title = 'Live location',
  markers = [],
  onLocationChange = null,
  allowManualAdjustment = true,
  permissionDenied = false
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error(isBn ? 'ব্রাউজারে জিপিএস সমর্থিত নয়' : 'Geolocation unsupported by browser');
      return;
    }

    setIsLocating(true);
    toast.loading(isBn ? 'জিপিএস অবস্থান খোঁজা হচ্ছে' : 'Acquiring GPS coordinates', { id: 'gps-locating', duration: 4000 });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy: acc } = pos.coords;
        if (onLocationChange) onLocationChange(lat, lng, acc);
        setIsLocating(false);
        toast.success(
          isBn
            ? `সঠিক অবস্থান পাওয়া গেছে (±${toBengaliDigits(Math.round(acc))} মি.)`
            : `Coordinates updated (±${Math.round(acc)} m)`,
          { id: 'gps-locating' }
        );
      },
      () => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude: lat, longitude: lng, accuracy: acc } = pos.coords;
            if (onLocationChange) onLocationChange(lat, lng, acc);
            setIsLocating(false);
            toast.success(isBn ? 'নেটওয়ার্কের মাধ্যমে অবস্থান পাওয়া গেছে' : 'Coordinates resolved via network', { id: 'gps-locating' });
          },
          () => {
            setIsLocating(false);
            toast.error(
              isBn
                ? 'লোকেশন পারমিশন পাওয়া যায়নি। ব্রাউজারের অ্যাড্রেস বার থেকে Location Allow করুন।'
                : 'Location permission blocked. Allow location access in your browser address bar.',
              { id: 'gps-locating', duration: 5000 }
            );
          },
          { enableHighAccuracy: false, timeout: 8000 }
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const handleSearchLocation = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=bd&limit=1`,
        { headers: { 'Accept-Language': 'bn,en' } }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const newLat = parseFloat(data[0].lat);
        const newLng = parseFloat(data[0].lon);
        if (onLocationChange) {
          onLocationChange(newLat, newLng, 15, data[0].display_name);
        }
        toast.success(isBn ? `ম্যাপ "${data[0].display_name.split(',')[0]}" এ সেট হয়েছে` : `Moved to ${data[0].display_name.split(',')[0]}`);
      } else {
        toast.error(isBn ? 'স্থানটি খুঁজে পাওয়া যায়নি। এলাকার নাম বা রাস্তা লিখুন।' : 'Location not found. Try a neighborhood or street name.');
      }
    } catch (err) {
      toast.error(isBn ? 'অনুসন্ধান ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' : 'Search failed. Try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const userIcon = createCustomIcon('#E11D48');
  const alertIcon = createCustomIcon('#DC2626');

  return (
    <div className="w-full surface-panel overflow-hidden relative z-0 flex flex-col">
      {permissionDenied && (
        <div className="bg-[#f4f4f5] dark:bg-[#232325] border-b border-zinc-900/[0.08] dark:border-white/[0.08] px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2 text-[#525252] dark:text-[#a1a1a6]">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="w-4 h-4 text-[#e11d48] shrink-0 dispatch-icon" />
            <span>
              {isBn
                ? 'ব্রাউজারে লোকেশন পারমিশন বন্ধ থাকায় আনুমানিক অবস্থান দেখানো হচ্ছে। সঠিক অবস্থান পেতে Location Allow করুন।'
                : 'Location permission is blocked. Showing approximate area until GPS permission is enabled.'}
            </span>
          </div>
          <button type="button" onClick={handleLocateMe} className="btn-outline h-8 px-3 text-xs shrink-0">
            {isBn ? 'আবার চেষ্টা করুন' : 'Retry GPS'}
          </button>
        </div>
      )}

      {/* Search & Locate Toolbar */}
      <div className="bg-[#fafafa] dark:bg-[#19191b] px-3 py-2.5 border-b border-zinc-900/[0.08] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-2 z-10">
        <form onSubmit={handleSearchLocation} className="flex-1 min-w-[200px] flex items-center gap-2">
          <div className="relative flex-1">
            <FiSearch className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#737373] dark:text-[#85858b] dispatch-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'এলাকা বা ঠিকানা খুঁজুন' : 'Search area or street'}
              className="w-full h-9 pl-8 pr-3 text-xs rounded-lg bg-[#ffffff] dark:bg-[#141415] border border-zinc-900/15 dark:border-white/15 text-[#171717] dark:text-[#ededed] focus:outline-none focus:border-[#e11d48]"
            />
          </div>
          <button type="submit" disabled={isSearching} className="btn-outline h-9 px-3 text-xs shrink-0">
            {isSearching ? <FiLoader className="w-3.5 h-3.5 animate-spin dispatch-icon" /> : isBn ? 'খুঁজুন' : 'Search'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="btn-danger h-9 px-3.5 text-xs shrink-0"
          title={isBn ? 'আপনার বর্তমান অবস্থান নির্ধারণ করুন' : 'Locate current position'}
        >
          <FiNavigation className={`w-3.5 h-3.5 dispatch-icon ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isBn ? 'আমার অবস্থান' : 'Locate me'}</span>
        </button>
      </div>

      {/* Quick-Jump Presets */}
      <div className="bg-[#ffffff] dark:bg-[#141415] px-3 py-2 border-b border-zinc-900/[0.08] dark:border-white/[0.08] flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[#737373] dark:text-[#85858b] shrink-0 text-xs flex items-center gap-1.5 pr-1">
          <FiMapPin className="w-3.5 h-3.5 text-[#e11d48] dispatch-icon" />
          {isBn ? 'দ্রুত বাছাই:' : 'Presets:'}
        </span>
        {BANGLADESH_PRESETS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              if (onLocationChange) {
                onLocationChange(p.lat, p.lng, 15, `${isBn ? p.name_bn : p.name_en}, Bangladesh`);
              }
              toast.success(isBn ? `ম্যাপ ${p.name_bn}-এ সেট হয়েছে` : `Moved to ${p.name_en}`);
            }}
            className="h-7 px-2.5 rounded-md bg-[#f4f4f5] dark:bg-[#232325] text-[#525252] dark:text-[#a1a1a6] hover:text-[#171717] dark:hover:text-[#ededed] whitespace-nowrap transition-colors border border-zinc-900/[0.08] dark:border-white/[0.08] cursor-pointer"
          >
            {isBn ? p.name_bn : p.name_en}
          </button>
        ))}
      </div>

      {/* Leaflet Map Canvas */}
      <div className="w-full h-80 sm:h-96 relative">
        <MapContainer center={[latitude, longitude]} zoom={zoom} scrollWheelZoom={false} className="w-full h-full">
          <RecenterOnUpdate latitude={latitude} longitude={longitude} zoom={zoom} />
          {onLocationChange && <MapClickHandler onLocationChange={onLocationChange} isBn={isBn} />}

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={[latitude, longitude]}
            icon={userIcon}
            draggable={Boolean(onLocationChange && allowManualAdjustment)}
            eventHandlers={{
              dragend: (e) => {
                if (onLocationChange) {
                  const pos = e.target.getLatLng();
                  onLocationChange(pos.lat, pos.lng, 10);
                  toast.success(
                    isBn
                      ? `অবস্থান আপডেট হয়েছে: ${toBengaliDigits(pos.lat.toFixed(4))}, ${toBengaliDigits(pos.lng.toFixed(4))}`
                      : `Location updated: ${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`
                  );
                }
              }
            }}
          >
            <Popup>
              <div className="p-1 text-center">
                <strong className="text-[#e11d48] block text-xs">{isBn ? 'আপনার নির্বাচিত অবস্থান' : title}</strong>
                <span className="text-[11px] text-zinc-700 block font-mono tabular-nums">
                  {isBn
                    ? `অক্ষাংশ ${toBengaliDigits(latitude.toFixed(5))} · দ্রাঘিমাংশ ${toBengaliDigits(longitude.toFixed(5))}`
                    : `${latitude.toFixed(5)}° N · ${longitude.toFixed(5)}° E`}
                </span>
              </div>
            </Popup>
          </Marker>

          <Circle
            center={[latitude, longitude]}
            radius={accuracy || 200}
            pathOptions={{ fillColor: '#E11D48', fillOpacity: 0.12, color: '#E11D48', weight: 1 }}
          />

          {markers.map((m, idx) => (
            <Marker key={idx} position={[m.latitude, m.longitude]} icon={alertIcon}>
              <Popup>
                <div className="p-1">
                  <strong className="text-[#dc2626] block text-xs">{m.title || (isBn ? 'জরুরি অ্যালার্ট' : 'Distress alert')}</strong>
                  <span className="text-[11px] text-zinc-600">{m.address}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="px-3 py-2 bg-[#fafafa] dark:bg-[#19191b] border-t border-zinc-900/[0.08] dark:border-white/[0.08] text-xs text-[#737373] dark:text-[#85858b]">
        {isBn
          ? 'ম্যাপে ক্লিক করে বা মার্কার টেনে নিজের অবস্থান নিশ্চিত করুন।'
          : 'Click anywhere on the map or drag the pin to refine your exact position.'}
      </div>
    </div>
  );
};

export default LiveMap;
