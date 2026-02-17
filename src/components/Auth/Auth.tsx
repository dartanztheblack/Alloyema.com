import { useState } from 'react';
import { auth, db, googleProvider } from '../../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isYemma, setIsYemma] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
      } else {
        // Register
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile with name
        await updateProfile(user, { displayName: name });

        // Send email verification
        await sendEmailVerification(user);
        setVerificationSent(true);

        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: name,
          photoURL: user.photoURL,
          emailVerified: false,
          isYemma: isYemma,
          createdAt: new Date()
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user document exists
      const userDoc = await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        isYemma: isYemma,
        createdAt: new Date()
      }, { merge: true });

      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h2>✉️ Vérifiez votre email</h2>
          <p>
            Un email de vérification a été envoyé à <strong>{email}</strong>.
          </p>
          <p>
            Cliquez sur le lien dans l'email pour activer votre compte.
          </p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">
          <h1>🍲 Yemma</h1>
          <p>La cuisine authentique à domicile</p>
        </div>

        <h2>{isLogin ? 'Connexion' : 'Inscription'}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleEmailAuth}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!isLogin && (
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isYemma}
                onChange={(e) => setIsYemma(e.target.checked)}
              />
              Je suis une Yemma (cuisinière)
            </label>
          )}
          
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'S\'inscrire')}
          </button>
        </form>

        <div className="divider"><span>ou</span></div>

        <button 
          className="btn-google"
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" />
          Continuer avec Google
        </button>

        <p className="auth-switch">
          {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <button 
            className="link-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'S\'inscrire' : 'Se connecter'}
          </button>
        </p>
      </div>
    </div>
  );
}
