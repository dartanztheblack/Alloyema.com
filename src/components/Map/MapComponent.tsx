import { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Yemma } from '../../types';
import { Star } from 'lucide-react';
import './Map.css';

interface MapComponentProps {
  yemmas: Yemma[];
  userLocation?: { lat: number; lng: number };
  onYemmaSelect?: (yemma: Yemma) => void;
}

export function MapComponent({ yemmas, userLocation, onYemmaSelect }: MapComponentProps) {
  const [selectedYemma, setSelectedYemma] = useState<Yemma | null>(null);
  const [viewport, setViewport] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 12
  });

  useEffect(() => {
    if (userLocation) {
      setViewport({
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        zoom: 13
      });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setViewport({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 13
          });
        },
        () => {
          console.log('Geolocation denied or unavailable');
        }
      );
    }
  }, [userLocation]);

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

  return (
    <div className="map-container">
      <Map
        {...viewport}
        onMove={(evt) => setViewport(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={mapboxToken}
      >
        {userLocation && (
          <Marker
            latitude={userLocation.lat}
            longitude={userLocation.lng}
          >
            <div className="user-marker">
              <div className="user-dot" />
            </div>
          </Marker>
        )}

        {yemmas.map((yemma) => (
          <Marker
            key={yemma.id}
            latitude={yemma.location.lat}
            longitude={yemma.location.lng}
          >
            <button
              className="yemma-marker"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedYemma(yemma);
              }}
            >
              <img src={yemma.photoURL} alt={yemma.name} />
            </button>
          </Marker>
        ))}

        {selectedYemma && (
          <Popup
            latitude={selectedYemma.location.lat}
            longitude={selectedYemma.location.lng}
            anchor="bottom"
            onClose={() => setSelectedYemma(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="yemma-popup" onClick={() => onYemmaSelect?.(selectedYemma)}>
              <img src={selectedYemma.photoURL} alt={selectedYemma.name} />
              <div className="popup-content">
                <h3>{selectedYemma.name}</h3>
                <p className="specialties">{selectedYemma.specialties.join(', ')}</p>
                <div className="rating">
                  <Star size={16} fill="#ffc107" color="#ffc107" />
                  <span>{selectedYemma.rating.toFixed(1)} ({selectedYemma.reviewCount})</span>
                </div>
                <p className="address">{selectedYemma.location.address}</p>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
