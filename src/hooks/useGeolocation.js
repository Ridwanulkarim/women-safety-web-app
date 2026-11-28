import { useState, useEffect, useCallback, useRef } from 'react';

// Helper to detect generic Dhaka IP coordinates (Kalachandpur / Baridhara center)
const isGenericDhaka = (lat, lng) => {
  return Math.abs(lat - 23.8103) < 0.005 && Math.abs(lng - 90.4125) < 0.005;
};

// Clear cached location from localStorage
export const clearLocationCache = () => {
  try {
    localStorage.removeItem('safehaven_user_last_location');
  } catch (e) {}
};

// Default fallback coordinates
const getInitialLocation = () => {
  try {
    const saved = localStorage.getItem('safehaven_user_last_location');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Only restore if user manually pinned or had real GPS (not generic IP fallback)
      if (parsed && parsed.latitude && parsed.longitude && (!isGenericDhaka(parsed.latitude, parsed.longitude) || parsed.source === 'MANUAL')) {
        return {
          latitude: parsed.latitude,
          longitude: parsed.longitude,
          accuracy: parsed.accuracy || 20,
          address: parsed.address || `Lat: ${parsed.latitude.toFixed(4)}°, Lng: ${parsed.longitude.toFixed(4)}°`,
          loading: false,
          error: null,
          source: parsed.source || 'SAVED',
          isApproximate: parsed.accuracy > 500,
          permissionDenied: false
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
    address: 'লাইভ অবস্থান নির্ণয় করা হচ্ছে...',
    loading: true,
    error: null,
    source: 'INITIAL',
    isApproximate: true,
    permissionDenied: false
  };
};

export const useGeolocation = (enableWatch = false) => {
  const [location, setLocation] = useState(getInitialLocation);
  const isManuallySet = useRef(false);

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

  // Save confirmed location to cache (never save generic IP coordinates)
  const saveLocationToCache = (lat, lng, accuracy, address, source) => {
    if (source === 'IP' || (isGenericDhaka(lat, lng) && source !== 'MANUAL')) {
      return;
    }
    try {
      localStorage.setItem('safehaven_user_last_location', JSON.stringify({
        latitude: lat,
        longitude: lng,
        accuracy,
        address,
        source
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
        const addr = `${data.city || 'Dhaka'}, ${data.region || 'Dhaka Division'}, Bangladesh (আইপি ভিত্তিক আনুমানিক)`;
        setLocation(prev => {
          if (isManuallySet.current) return prev;
          return {
            latitude: lat,
            longitude: lng,
            accuracy: 2000,
            address: addr,
            loading: false,
            error: 'GPS hardware signal unavailable. Location approximated via Network/IP.',
            source: 'IP',
            isApproximate: true,
            permissionDenied: prev.permissionDenied
          };
        });
        return true;
      }
    } catch (err) {
      try {
        const altRes = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client');
        const altData = await altRes.json();
        if (altData && altData.latitude && altData.longitude) {
          const lat = parseFloat(altData.latitude);
          const lng = parseFloat(altData.longitude);
          const addr = `${altData.locality || altData.city || 'Dhaka'}, Bangladesh (আইপি ভিত্তিক আনুমানিক)`;
          setLocation(prev => {
            if (isManuallySet.current) return prev;
            return {
              latitude: lat,
              longitude: lng,
              accuracy: 2500,
              address: addr,
              loading: false,
              error: 'GPS unavailable. Location resolved via Network IP.',
              source: 'IP',
              isApproximate: true,
              permissionDenied: prev.permissionDenied
            };
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
        loading: false,
        error: 'Geolocation is not supported by your browser.',
        permissionDenied: true
      }));
      return;
    }

    setLocation(prev => ({ ...prev, loading: true, error: null }));

    const handleSuccess = async (pos, source = 'GPS') => {
      isManuallySet.current = false;
      const { latitude, longitude, accuracy } = pos.coords;
      let address = `Lat: ${latitude.toFixed(4)}°, Lng: ${longitude.toFixed(4)}°`;
      
      // Async reverse geocoding
      fetchReadableAddress(latitude, longitude).then((namedAddr) => {
        if (namedAddr) {
          setLocation(prev => ({
            ...prev,
            address: namedAddr
          }));
          saveLocationToCache(latitude, longitude, accuracy, namedAddr, source);
        }
      });

      setLocation({
        latitude,
        longitude,
        accuracy: Math.round(accuracy),
        address,
        loading: false,
        error: null,
        source,
        isApproximate: accuracy > 500,
        permissionDenied: false
      });
      saveLocationToCache(latitude, longitude, accuracy, address, source);
    };

    // Check permission status if API is available
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'denied') {
          setLocation(prev => ({
            ...prev,
            loading: false,
            permissionDenied: true,
            isApproximate: true,
            error: 'ব্রাউজারে লোকেশন পারমিশন ব্লক করা আছে। সঠিক জিপিএস পেতে অ্যাড্রেস বার থেকে Location Allow করুন।'
          }));
          fetchIpGeolocation();
          return;
        }
      }).catch(() => {});
    }

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
            const isDenied = err2.code === 1;
            const ipSuccess = await fetchIpGeolocation();
            setLocation(prev => ({
              ...prev,
              loading: false,
              permissionDenied: isDenied,
              isApproximate: true,
              error: isDenied 
                ? 'ব্রাউজারে লোকেশন পারমিশন ব্লক করা আছে। অ্যাড্রেস বার থেকে Location Allow করুন।' 
                : 'ডিভাইস থেকে জিপিএস সংকেত পাওয়া যায়নি। নেটওয়ার্কের মাধ্যমে আনুমানিক অবস্থান নির্ধারণ করা হয়েছে।'
            }));
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 30000 }
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }, [fetchIpGeolocation, fetchReadableAddress]);

  useEffect(() => {
    requestLocation();

    let watchId;
    if (enableWatch && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          // Do not overwrite if user explicitly pinned a manual place
          if (isManuallySet.current) return;
          const { latitude, longitude, accuracy } = pos.coords;
          setLocation(prev => ({
            ...prev,
            latitude,
            longitude,
            accuracy: Math.round(accuracy),
            address: `Lat: ${latitude.toFixed(4)}°, Lng: ${longitude.toFixed(4)}°`,
            loading: false,
            error: null,
            source: 'GPS_WATCH',
            isApproximate: accuracy > 500,
            permissionDenied: false
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

  // Function to manually adjust location on map or via search
  const setManualLocation = useCallback((latitude, longitude, customAddress) => {
    isManuallySet.current = true;
    const address = customAddress || `Lat: ${latitude.toFixed(4)}°, Lng: ${longitude.toFixed(4)}° (বাছাইকৃত স্থান)`;
    setLocation({
      latitude,
      longitude,
      accuracy: 10,
      address,
      loading: false,
      error: null,
      source: 'MANUAL',
      isApproximate: false,
      permissionDenied: false
    });
    saveLocationToCache(latitude, longitude, 10, address, 'MANUAL');
  }, []);

  return {
    ...location,
    refreshLocation: requestLocation,
    setManualLocation,
    clearLocationCache
  };
};
