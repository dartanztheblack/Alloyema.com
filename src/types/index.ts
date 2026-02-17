export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isYemma: boolean;
  createdAt: Date;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface Yemma {
  id: string;
  userId: string;
  name: string;
  photoURL: string;
  bio: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  isAvailable: boolean;
  deliveryRadius: number;
  minOrder: number;
  createdAt: Date;
}

export interface Dish {
  id: string;
  yemmaId: string;
  name: string;
  description: string;
  price: number;
  imageURL: string;
  category: string;
  ingredients: string[];
  allergens: string[];
  prepTime: number;
  isAvailable: boolean;
  createdAt: Date;
}

export interface Order {
  id: string;
  customerId: string;
  yemmaId: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  total: number;
  deliveryAddress: {
    lat: number;
    lng: number;
    address: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  dishId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export interface Review {
  id: string;
  orderId: string;
  customerId: string;
  yemmaId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
