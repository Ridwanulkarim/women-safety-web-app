import { useState, useEffect, useCallback } from 'react';

// Default fallback coordinates (Dhaka center or previously stored user coordinates)
const getInitialLocation = () => {
  try {
    const saved = localStorage.getItem('safehaven_user_last_location');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.latitude && parsed.longitude) {
        return {
          latitude: parsed.latitude,
          longitude: parsed.longitude,
          accuracy: parsed.accuracy || 20,
          address: parsed.address || `Lat: ${parsed.latitude.toFixed(4)}°, Lng: ${parsed.longitude.toFixed(4)}° (Saved)`,
          loading: false,
          error: null,
          source: 'SAVED'
        };
      }
    }
  } catch (e) {
    // Ignore storage parse issues
  }
  return {
    latitude: 23.8103,
    longitude: 90.4125,
    accuracy: null,
    address: 'Detecting live location...',
    loading: true,
    error: null,
    source: 'INITIAL'
  };
};

export const useGeolocation = (enableWatch = false) => {
  const [location, setLocation] = useState(getInitialLocation);

  // Attempt reverse geocoding for a friendly locality name
  const fetchReadableAddress = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`, {
        headers: { 'Accept-Language': 'bn,en' }
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.display_name) {
        const parts = data.display_name.split(',');
        const brief = parts.slice(0, 3).join(',').trim();
        return brief;
      }
    } catch (e) {
      // Ignore network geocode failures
    }
    return null;
  }, []);

  // Save confirmed location to cache
  const saveLocationToCache = (lat, lng, accuracy, address) => {
    try {
      localStorage.setItem('safehaven_user_last_location', JSON.stringify({
        latitude: lat,
        longitude: lng,
        accuracy,
        address
      }));
    } catch (e) {}
  };

  // Attempt IP Geolocation as an intelligent fallback
  const fetchIpGeolocation = useCallback(async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('IP service unavailable');
      const data = await response.json();

      if (data && data.latitude && data.longitude) {
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);
        const addr = `${data.city || 'Dhaka'}, ${data.region || 'Dhaka Division'}, Bangladesh`;
        setLocation({
          latitude: lat,
          longitude: lng,
          accuracy: 1500,
          address: addr,
          loading: false,
          error: 'GPS hardware signal unavailable. Location approximated via Network/IP.',
          source: 'IP'
        });
        saveLocationToCache(lat, lng, 1500, addr);
        return true;
      }
    } catch (err) {
      try {
        const altRes = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client');
        const altData = await altRes.json();
        if (altData && altData.latitude && altData.longitude) {
          const lat = parseFloat(altData.latitude);
          const lng = parseFloat(altData.longitude);
          const addr = `${altData.locality || altData.city || 'Dhaka'}, ${altData.principalSubdivision || ''}`;
          setLocation({
            latitude: lat,
            longitude: lng,
            accuracy: 2000,
            address: addr,
            loading: false,
            error: 'GPS unavailable. Location resolved via Network IP.',
            source: 'IP'
          });
          saveLocationToCache(lat, lng, 2000, addr);
          return true;
        }
      } catch (err2) {
        console.warn('IP Geolocation fallback failed:', err2);
      }
    }
    return false;
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser.'
      }));
      return;
    }

    setLocation(prev => ({ ...prev, loading: true, error: null }));

    const handleSuccess = async (pos, source = 'GPS') => {
      const { latitude, longitude, accuracy } = pos.coords;
      let address = `Lat: ${latitude.toFixed(4)}°, Lng: ${longitude.toFixed(4)}°`;
      
      // Async reverse geocoding
      fetchReadableAddress(latitude, longitude).then((namedAddr) => {
        if (namedAddr) {
          setLocation(prev => ({
            ...prev,
            address: namedAddr
          }));
          saveLocationToCache(latitude, longitude, accuracy, namedAddr);
        }
      });

      setLocation({
        latitude,
        longitude,
        accuracy,
        address,
        loading: false,
        error: null,
        source
      });
      saveLocationToCache(latitude, longitude, accuracy, address);
    };

    // Tier 1: High-Accuracy Hardware GPS
    navigator.geolocation.getCurrentPosition(
      (pos) => handleSuccess(pos, 'GPS'),
      (err1) => {
        console.warn('High accuracy GPS timed out, trying low-accuracy network triangulation...', err1.message);
        
        // Tier 2: Low-Accuracy (Wi-Fi / Cell tower)
        navigator.geolocation.getCurrentPosition(
          (pos) => handleSuccess(pos, 'NETWORK'),
          async (err2) => {
            console.warn('Browser geolocation failed or denied:', err2.message);
            const ipSuccess = await fetchIpGeolocation();
            if (!ipSuccess) {
              setLocation(prev => ({
                ...prev,
                loading: false,
                error: err2.code === 1 
                  ? 'Location permission denied. Click the lock icon in your browser URL bar to allow location access.' 
                  : 'Unable to retrieve location coordinates.'
              }));
            }
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 30000 }
        );
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 5000 }
    );
  }, [fetchIpGeolocation, fetchReadableAddress]);

  useEffect(() => {
    requestLocation();

    let watchId;
    if (enableWatch && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          setLocation(prev => ({
            ...prev,
            latitude,
            longitude,
            accuracy,
            address: `Lat: ${latitude.toFixed(4)}°, Lng: ${longitude.toFixed(4)}°`,
            loading: false,
            error: null,
            source: 'GPS_WATCH'
          }));
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [enableWatch, requestLocation]);

  // Function to manually adjust location on map
  const setManualLocation = useCallback((latitude, longitude, customAddress) => {
    const address = customAddress || `Lat: ${latitude.toFixed(4)}°, Lng: ${longitude.toFixed(4)}° (Pinned)`;
    setLocation({
      latitude,
      longitude,
      accuracy: 10,
      address,
      loading: false,
      error: null,
      source: 'MANUAL'
    });
    saveLocationToCache(latitude, longitude, 10, address);
  }, []);

  return {
    ...location,
    refreshLocation: requestLocation,
    setManualLocation
  };
};
