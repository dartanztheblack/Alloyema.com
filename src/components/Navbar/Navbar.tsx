import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { User, LogOut, MapPin, MessageSquare } from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
  user: any;
}

export function Navbar({ user }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <h1>🍲 Yemma</h1>
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/" className="nav-link">
          <MapPin size={20} />
          <span>Explorer</span>
        </Link>

        {user ? (
          <>
            <Link to="/messages" className="nav-link">
              <MessageSquare size={20} />
              <span>Messages</span>
            </Link>

            <div className="user-menu">
              <img 
                src={user.photoURL || 'https://via.placeholder.com/40'} 
                alt={user.displayName || 'User'} 
                className="user-avatar"
              />
              <div className="dropdown">
                <Link to="/profile" className="dropdown-item">
                  <User size={16} />
                  Mon profil
                </Link>
                <button onClick={handleLogout} className="dropdown-item">
                  <LogOut size={16} />
                  Déconnexion
                </button>
              </div>
            </div>
          </>
        ) : (
          <Link to="/auth" className="btn-login">
            Connexion
          </Link>
        )}
      </div>
    </nav>
  );
}
