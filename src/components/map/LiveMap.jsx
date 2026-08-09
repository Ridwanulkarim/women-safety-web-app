import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

/**
 * Imperatively recenters Leaflet map view whenever position (latitude/longitude) state updates
 */
function RecenterOnUpdate({ latitude, longitude, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (latitude != null && longitude != null) {
      map.setView([latitude, longitude], zoom || map.getZoom());
    }
  }, [latitude, longitude, zoom, map]);
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

const LiveMap = ({ latitude = 23.8103, longitude = 90.4125, accuracy = null, zoom = 14, title = "Live Location", markers = [] }) => {
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    if (googleApiKey && window.google && window.google.maps) {
      setGoogleMapsLoaded(true);
    }
  }, [googleApiKey]);

  // If Google Maps API key exists and loaded, render Google Maps iframe or JS API embed
  if (googleApiKey && googleApiKey.trim() !== '') {
    return (
      <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-xl border border-slate-700/50">
        <iframe
          title={title}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps/embed/v1/place?key=${googleApiKey}&q=${latitude},${longitude}&zoom=${zoom}`}
        ></iframe>
      </div>
    );
  }

  // Universal Fallback: Leaflet + OpenStreetMap (No API Key Required)
  const userIcon = createCustomIcon('#E91E63');
  const alertIcon = createCustomIcon('#EF4444');

  return (
    <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-xl border border-pink-500/20 relative z-0">
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <RecenterOnUpdate latitude={latitude} longitude={longitude} zoom={zoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Current Position */}
        <Marker position={[latitude, longitude]} icon={userIcon}>
          <Popup>
            <div className="p-1 text-center font-heading">
              <strong className="text-pink-600 block text-xs uppercase">{title}</strong>
              <span className="text-[11px] text-slate-700">Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}</span>
            </div>
          </Popup>
        </Marker>

        {/* Accuracy Range Circle */}
        <Circle
          center={[latitude, longitude]}
          radius={accuracy || 400}
          pathOptions={{ fillColor: '#E91E63', fillOpacity: 0.15, color: '#E91E63', weight: 1 }}
        />

        {/* Additional Emergency Markers */}
        {markers.map((m, idx) => (
          <Marker key={idx} position={[m.latitude, m.longitude]} icon={alertIcon}>
            <Popup>
              <div className="p-1">
                <strong className="text-red-600 block text-xs">{m.title || 'Distress Alert'}</strong>
                <span className="text-[10px] text-slate-600">{m.address}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
