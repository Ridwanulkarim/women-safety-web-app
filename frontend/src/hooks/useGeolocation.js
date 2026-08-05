import { useState, useEffect } from 'react';

export const useGeolocation = (enableWatch = false) => {
  const [location, setLocation] = useState({
    latitude: 23.8103, // Default Dhaka coordinates
    longitude: 90.4125,
    accuracy: null,
    address: 'Dhaka, Bangladesh',
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser.'
      }));
      return;
    }

    const handleSuccess = (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      setLocation({
        latitude,
        longitude,
        accuracy,
        address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
        loading: false,
        error: null
      });
    };

    const handleError = (err) => {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Unable to retrieve location.'
      }));
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

    let watchId;
    if (enableWatch) {
      watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [enableWatch]);

  return location;
};
