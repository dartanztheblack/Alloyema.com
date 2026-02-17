import { useState, useEffect } from 'react';

interface GeolocationState {
  location: { lat: number; lng: number } | null;
  address: string;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    address: '',
    loading: false,
    error: null,
  });

  const getCurrentPosition = () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'La géolocalisation n\'est pas supportée par votre navigateur'
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocoding with Mapbox
        try {
          const token = import.meta.env.VITE_MAPBOX_TOKEN;
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}&language=fr&limit=1`
          );
          const data = await response.json();
          const address = data.features?.[0]?.place_name || 'Position actuelle';

          setState({
            location: { lat: latitude, lng: longitude },
            address,
            loading: false,
            error: null,
          });
        } catch (err) {
          setState({
            location: { lat: latitude, lng: longitude },
            address: 'Position actuelle',
            loading: false,
            error: null,
          });
        }
      },
      (error) => {
        let errorMsg = 'Erreur de géolocalisation';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Vous avez refusé la géolocalisation';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Position non disponible';
            break;
          case error.TIMEOUT:
            errorMsg = 'Délai dépassé';
            break;
        }
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMsg
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const geocodeAddress = async (address: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const token = import.meta.env.VITE_MAPBOX_TOKEN;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}&language=fr&limit=1`
      );
      const data = await response.json();

      if (data.features && data.features[0]) {
        const [lng, lat] = data.features[0].center;
        setState({
          location: { lat, lng },
          address: data.features[0].place_name,
          loading: false,
          error: null,
        });
        return { lat, lng };
      } else {
        throw new Error('Adresse non trouvée');
      }
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Erreur de géocodage'
      }));
      return null;
    }
  };

  return {
    ...state,
    getCurrentPosition,
    geocodeAddress,
  };
}
