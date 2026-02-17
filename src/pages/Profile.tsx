import { useState } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { useAuth } from '../hooks/useAuth';
import { Auth } from '../components/Auth/Auth';
import { auth } from '../config/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { Mail, Check, AlertCircle, User, MapPin, Phone } from 'lucide-react';
import './Profile.css';

export function Profile() {
  const { user, loading } = useAuth();
  const [verificationSent, setVerificationSent] = useState(false);
  const [sending, setSending] = useState(false);

  const resendVerification = async () => {
    if (!auth.currentUser) return;
    
    setSending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      setVerificationSent(true);
    } catch (error) {
      console.error('Error sending verification:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="profile-page">
      <Navbar user={user} />
      
      <main className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar-section">
            <img 
              src={user.photoURL || 'https://via.placeholder.com/150'} 
              alt={user.displayName || 'User'}
              className="profile-avatar"
            />
            <h2>{user.displayName || 'Utilisateur'}</h2>
            <p className="profile-email">{user.email}</p>
            
            {user.isYemma && (
              <span className="yemma-badge">👩‍🍳 Yemma</span>
            )}
          </div>
        </div>

        <div className="profile-sections">
          {/* Email Verification */}
          <section className="profile-section">
            <div className="section-header">
              <Mail size={24} />
              <h3>Vérification email</h3>
            </div>
            
            {user.emailVerified ? (
              <div className="verification-status verified">
                <Check size={20} />
                <span>Email vérifié ✓</span>
              </div>
            ) : (
              <div className="verification-status unverified">
                <AlertCircle size={20} />
                <div className="unverified-content">
                  <span>Email non vérifié</span>
                  <p>Vérifiez votre email pour débloquer toutes les fonctionnalités.</p>
                  
                  {verificationSent ? (
                    <p className="success-text">✉️ Email de vérification envoyé !</p>
                  ) : (
                    <button 
                      onClick={resendVerification}
                      disabled={sending}
                      className="btn-verify"
                    >
                      {sending ? 'Envoi...' : 'Renvoyer l\'email de vérification'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Profile Info */}
          <section className="profile-section">
            <div className="section-header">
              <User size={24} />
              <h3>Informations personnelles</h3>
            </div>
            
            <div className="profile-form">
              <div className="form-group">
                <label>Nom complet</label>
                <input 
                  type="text" 
                  value={user.displayName || ''} 
                  readOnly 
                  className="readonly"
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={user.email || ''} 
                  readOnly 
                  className="readonly"
                />
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="profile-section">
            <div className="section-header">
              <MapPin size={24} />
              <h3>Adresse de livraison</h3>
            </div>
            
            <div className="profile-form">
              <div className="form-group">
                <label>Adresse</label>
                <input type="text" placeholder="Votre adresse" />
              </div>
              
              <button className="btn-save">
                Enregistrer l'adresse
              </button>
            </div>
          </section>

          {/* Contact */}
          <section className="profile-section">
            <div className="section-header">
              <Phone size={24} />
              <h3>Contact</h3>
            </div>
            
            <div className="profile-form">
              <div className="form-group">
                <label>Téléphone</label>
                <input type="tel" placeholder="Votre numéro de téléphone" />
              </div>
              
              <button className="btn-save">
                Enregistrer
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
