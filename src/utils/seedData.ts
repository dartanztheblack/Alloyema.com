import { db } from '../config/firebase';
import { collection, doc, setDoc, getDocs, query, limit } from 'firebase/firestore';

const sampleYemmas = [
  {
    id: 'yemma-1',
    userId: 'user-1',
    name: 'Samira Kadri',
    photoURL: 'https://images.unsplash.com/photo-1583394293214-28ez917e3e96?w=400',
    bio: 'Passionnée par la cuisine marocaine traditionnelle. Je prépare des tajines, couscous et pâtisseries avec les recettes de ma grand-mère.',
    specialties: ['Tajine', 'Couscous', 'Pâtisseries'],
    rating: 4.8,
    reviewCount: 24,
    location: {
      lat: 48.8566,
      lng: 2.3522,
      address: 'Paris, France'
    },
    isAvailable: true,
    deliveryRadius: 5,
    minOrder: 15,
    createdAt: new Date()
  },
  {
    id: 'yemma-2',
    userId: 'user-2',
    name: 'Fatima Zahra',
    photoURL: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400',
    bio: 'Spécialiste des plats méditerranéens et orientaux. Mes briouats et pastillas sont les meilleurs du quartier !',
    specialties: ['Briouats', 'Pastilla', 'Chorba'],
    rating: 4.9,
    reviewCount: 18,
    location: {
      lat: 48.8600,
      lng: 2.3600,
      address: 'Paris 3ème, France'
    },
    isAvailable: true,
    deliveryRadius: 3,
    minOrder: 12,
    createdAt: new Date()
  },
  {
    id: 'yemma-3',
    userId: 'user-3',
    name: 'Amina Belhaj',
    photoURL: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
    bio: 'Cuisinière passionnée avec 15 ans d\'expérience. Je propose une cuisine familiale authentique et généreuse.',
    specialties: ['Rfissa', 'Msemmen', 'Harira'],
    rating: 4.7,
    reviewCount: 31,
    location: {
      lat: 48.8500,
      lng: 2.3400,
      address: 'Paris 15ème, France'
    },
    isAvailable: true,
    deliveryRadius: 4,
    minOrder: 20,
    createdAt: new Date()
  }
];

export async function seedYemmas() {
  // Check if yemmas already exist
  const q = query(collection(db, 'yemmas'), limit(1));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    console.log('Yemmas already exist, skipping seed');
    return;
  }

  console.log('Creating sample yemmas...');
  
  for (const yemma of sampleYemmas) {
    await setDoc(doc(db, 'yemmas', yemma.id), yemma);
  }
  
  console.log('Sample yemmas created successfully!');
}
