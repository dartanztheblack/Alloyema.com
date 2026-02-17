import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Yemma } from '../../types';
import './Search.css';

interface SearchComponentProps {
  onSearchResults: (yemmas: Yemma[]) => void;
  onLocationSearch: (location: { lat: number; lng: number }) => void;
}

export function SearchComponent({ onSearchResults, onLocationSearch }: SearchComponentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Search by specialty or name
      const yemmasRef = collection(db, 'yemmas');
      const q = query(
        yemmasRef,
        where('isAvailable', '==', true)
      );

      const snapshot = await getDocs(q);
      const results: Yemma[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as Yemma;
        if (
          searchTerm === '' ||
          data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
        ) {
          results.push({ ...data, id: doc.id });
        }
      });

      onSearchResults(results);

      // Geocode location if provided
      if (location) {
        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`;
        const response = await fetch(geocodeUrl);
        const data = await response.json();
        
        if (data.features && data.features[0]) {
          const [lng, lat] = data.features[0].center;
          onLocationSearch({ lat, lng });
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search on term change (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm !== '') {
        handleSearch(new Event('submit') as any);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  return (
    <form className="search-container" onSubmit={handleSearch}>
      <div className="search-box">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher un plat, une spécialité..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="location-box">
        <input
          type="text"
          placeholder="Votre adresse..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      
      <button type="submit" className="search-btn" disabled={loading}>
        {loading ? 'Recherche...' : 'Rechercher'}
      </button>
    </form>
  );
}
