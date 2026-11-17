import { useState, useEffect, useCallback } from 'react';

// Default fallback coordinates (Chittagong GEC Circle area)
const DEFAULT_FALLBACK = {
  latitude: 22.3569,
  longitude: 91.7832,
  accuracy: null,
  address: 'Chittagong, Bangladesh',
  source: 'DEFAULT'
};

export const useGeolocation = (enableWatch = false) => {
  const [location, setLocation] = useState({
    latitude: 23.8103, // Initial state
    longitude: 90.4125,
    accuracy: null,
    address: 'Detecting live location...',
    loading: true,
    error: null,
    source: 'INITIAL' // 'GPS', 'NETWORK', 'IP', 'MANUAL', 'DEFAULT'
  });

  // Attempt IP Geolocation as an intelligent fallback
  const fetchIpGeolocation = useCallback(async () => {
    try {
      // Free IP Geolocation endpoint with HTTPS support
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('IP service unavailable');
      const data = await response.json();

      if (data && data.latitude && data.longitude) {
        setLocation({
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          accuracy: 2500, // Approximate accuracy in meters
          address: `${data.city || 'Chittagong'}, ${data.region || 'Chittagong Division'}, Bangladesh`,
          loading: false,
          error: 'GPS hardware signal unavailable. Location approximated via Network/IP.',
          source: 'IP'
        });
        return true;
      }
    } catch (err) {
      // Secondary IP fallback
      try {
        const altRes = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client');
        const altData = await altRes.json();
        if (altData && altData.latitude && altData.longitude) {
          setLocation({
            latitude: parseFloat(altData.latitude),
            longitude: parseFloat(altData.longitude),
            accuracy: 3000,
            address: `${altData.locality || altData.city || 'Chittagong'}, ${altData.principalSubdivision || ''}`,
            loading: false,
            error: 'GPS unavailable. Location resolved via Network IP.',
            source: 'IP'
          });
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
        ...DEFAULT_FALLBACK,
        loading: false,
        error: 'Geolocation is not supported by your browser.'
      }));
      return;
    }

    setLocation(prev => ({ ...prev, loading: true, error: null }));

    const handleSuccess = (position, source = 'GPS') => {
      const { latitude, longitude, accuracy } = position.coords;
      setLocation({
        latitude,
        longitude,
        accuracy,
        address: `Lat: ${latitude.toFixed(4)}°, Lng: ${longitude.toFixed(4)}°`,
        loading: false,
        error: null,
        source
      });
    };

    // Tier 1: Try High-Accuracy Hardware GPS first
    navigator.geolocation.getCurrentPosition(
      (pos) => handleSuccess(pos, 'GPS'),
      (err1) => {
        console.warn('High accuracy GPS timed out or failed, falling back to network geolocation...', err1.message);
        
        // Tier 2: Try Low-Accuracy (Wi-Fi / Cell tower triangulation)
        navigator.geolocation.getCurrentPosition(
          (pos) => handleSuccess(pos, 'NETWORK'),
          async (err2) => {
            console.warn('Browser geolocation failed or permission denied:', err2.message);
            
            // Tier 3: Fetch location via IP Geolocation
            const ipSuccess = await fetchIpGeolocation();
            if (!ipSuccess) {
              setLocation(prev => ({
                ...prev,
                ...DEFAULT_FALLBACK,
                loading: false,
                error: err2.code === 1 
                  ? 'Location permission denied. Click the lock icon in your browser URL bar to allow location access.' 
                  : 'Unable to retrieve location coordinates.'
              }));
            }
          },
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
        );
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 10000 }
    );
  }, [fetchIpGeolocation]);

  useEffect(() => {
    requestLocation();

    let watchId;
    if (enableWatch && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = position.coords;
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
        { enableHighAccuracy: true, maximumAge: 15000, timeout: 15000 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [enableWatch, requestLocation]);

  // Function to manually adjust location on map
  const setManualLocation = useCallback((latitude, longitude, customAddress) => {
    setLocation({
      latitude,
      longitude,
      accuracy: 10,
      address: customAddress || `Lat: ${latitude.toFixed(4)}°, Lng: ${longitude.toFixed(4)}° (Pinned)`,
      loading: false,
      error: null,
      source: 'MANUAL'
    });
  }, []);

  return {
    ...location,
    refreshLocation: requestLocation,
    setManualLocation
  };
};
