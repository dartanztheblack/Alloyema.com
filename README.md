# Yemma - Plateforme de Cuisine Authentique

Application React + TypeScript + Firebase pour connecter les clients avec des cuisinières (Yemmas) locales.

## 🚀 Stack Technique

- **Frontend**: React 19 + TypeScript + Vite
- **Authentification**: Firebase Auth (Email + Google)
- **Base de données**: Firebase Firestore
- **Cartes**: Mapbox GL JS
- **Paiement**: Stripe
- **Hébergement**: Vercel

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration

Crée un fichier `.env` à la racine:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456
VITE_FIREBASE_APP_ID=1:123:web:abc
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key
```

## 🏃 Développement

```bash
npm run dev
```

## 📦 Build

```bash
npm run build
```

## 🚀 Déploiement Vercel

```bash
npm i -g vercel
vercel --prod
```

## ✨ Fonctionnalités

- ✅ Authentification Email/Google
- ✅ Vérification d'email
- ✅ Carte interactive Mapbox
- ✅ Recherche géolocalisée
- ✅ Messagerie temps réel
- ✅ Paiement Stripe
- ✅ SEO optimisé

## 📝 License

MIT
