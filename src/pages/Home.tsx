import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { SearchComponent } from '../components/Search/SearchComponent';
import { MapComponent } from '../components/Map/MapComponent';
import { Auth } from '../components/Auth/Auth';
import { useAuth } from '../hooks/useAuth';
import { seedYemmas } from '../utils/seedData';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Yemma } from '../types';
import { Star, MapPin } from 'lucide-react';
import './Home.css';

export function Home() {
  const { user, loading } = useAuth();
  const [yemmas, setYemmas] = useState<Yemma[]>([]);
  const [filteredYemmas, setFilteredYemmas] = useState<Yemma[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch yemmas on mount
  useEffect(() => {
    // Create sample data if none exists
    seedYemmas();
    
    const fetchYemmas = async () => {
      try {
        const q = query(
          collection(db, 'yemmas'),
          where('isAvailable', '==', true),
          limit(50)
        );
        
        const snapshot = await getDocs(q);
        const yemmaList: Yemma[] = [];
        
        snapshot.forEach((doc) => {
          yemmaList.push({ ...doc.data(), id: doc.id } as Yemma);
        });
        
        setYemmas(yemmaList);
        setFilteredYemmas(yemmaList);
      } catch (error) {
        console.error('Error fetching yemmas:', error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchYemmas();
  }, []);

  const handleSearchResults = (results: Yemma[]) => {
    setFilteredYemmas(results);
  };

  const handleLocationSearch = (location: { lat: number; lng: number }) => {
    setUserLocation(location);
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="home">
      <Navbar user={user} />
      
      <main className="home-content">
        <section className="hero">
          <h2>Découvrez les meilleures Yemmas près de chez vous 👩‍🍳</h2>
          <SearchComponent 
            onSearchResults={handleSearchResults}
            onLocationSearch={handleLocationSearch}
          />
        </section>

        <section className="map-section">
          <div className="map-wrapper">
            <MapComponent 
              yemmas={filteredYemmas}
              userLocation={userLocation}
            />
          </div>
        </section>

        <section className="yemmas-grid">
          <h3>Yemmas disponibles ({filteredYemmas.length})</h3>
          
          {dataLoading ? (
            <div className="loading-grid">Chargement des Yemmas...</div>
          ) : filteredYemmas.length === 0 ? (
            <div className="no-results">
              <p>Aucune Yemma trouvée 😔</p>
              <p>Essayez une autre recherche ou localisation</p>
            </div>
          ) : (
            <div className="grid">
              {filteredYemmas.map((yemma) => (
                <div key={yemma.id} className="yemma-card">
                  <img 
                    src={yemma.photoURL} 
                    alt={yemma.name}
                    className="yemma-photo"
                  />
                  <div className="yemma-info">
                    <h4>{yemma.name}</h4>
                    <p className="yemma-bio">{yemma.bio.substring(0, 80)}...</p>
                    
                    <div className="yemma-meta">
                      <span className="rating">
                        <Star size={14} fill="#ffc107" color="#ffc107" />
                        {yemma.rating.toFixed(1)} ({yemma.reviewCount})
                      </span>
                      <span className="location">
                        <MapPin size={14} />
                        {yemma.location.address.substring(0, 30)}...
                      </span>
                    </div>
                    
                    <div className="yemma-specialties">
                      {yemma.specialties.slice(0, 3).map((specialty) => (
                        <span key={specialty} className="specialty-tag">
                          {specialty}
                        </span>
                      ))}
                    </div>
                    
                    <button className="btn-order">
                      Voir le menu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
