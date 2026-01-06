import { useState, useEffect } from 'react';
import BookingForm from './components/BookingForm';
import AdminDashboard from './components/AdminDashboard';
import LoginForm from './components/LoginForm';
import courseData from './data/eislaufkurse';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('booking'); // 'booking', 'login', or 'admin'
  const [authUser, setAuthUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('authUser');
    if (token && user) {
      setAuthToken(token);
      setAuthUser(JSON.parse(user));
    }
  }, []);

  // Handle login
  const handleLogin = (user, token) => {
    setAuthUser(user);
    setAuthToken(token);
    setCurrentView('admin');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setAuthUser(null);
    setAuthToken(null);
    setCurrentView('booking');
  };

  // Handle admin button click
  const handleAdminClick = () => {
    if (authToken && authUser) {
      setCurrentView('admin');
    } else {
      setCurrentView('login');
    }
  };

  // Show login form
  if (currentView === 'login') {
    return <LoginForm onLogin={handleLogin} onBack={() => setCurrentView('booking')} />;
  }

  // Show admin dashboard
  if (currentView === 'admin') {
    if (!authToken) {
      setCurrentView('login');
      return null;
    }
    return (
      <AdminDashboard
        onBack={() => setCurrentView('booking')}
        onLogout={handleLogout}
        authToken={authToken}
        authUser={authUser}
      />
    );
  }

  // Show booking form (default)
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <a href="/" className="logo" onClick={(e) => { e.preventDefault(); setCurrentView('booking'); }}>
            <div className="logo-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Squirrel Logo */}
                <defs>
                  <linearGradient id="furMain" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316"/>
                    <stop offset="100%" stopColor="#ea580c"/>
                  </linearGradient>
                  <linearGradient id="furLight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fdba74"/>
                    <stop offset="100%" stopColor="#fb923c"/>
                  </linearGradient>
                  <linearGradient id="furDark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c2410c"/>
                    <stop offset="100%" stopColor="#9a3412"/>
                  </linearGradient>
                  <linearGradient id="tailGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ea580c"/>
                    <stop offset="50%" stopColor="#f97316"/>
                    <stop offset="100%" stopColor="#fdba74"/>
                  </linearGradient>
                </defs>
                {/* Fluffy Tail */}
                <path d="M38 8C44 4 48 8 46 14C48 20 46 28 40 32C36 34 32 32 30 28C28 24 30 16 34 12C36 10 38 8 38 8Z" fill="url(#tailGrad)"/>
                <path d="M40 12C42 10 44 12 43 15C44 18 42 22 39 24C37 25 35 24 34 22C33 20 34 16 36 14C37 13 40 12 40 12Z" fill="url(#furLight)" opacity="0.6"/>
                {/* Body */}
                <ellipse cx="22" cy="34" rx="12" ry="10" fill="url(#furMain)"/>
                {/* Head */}
                <circle cx="18" cy="20" r="12" fill="url(#furMain)"/>
                {/* Belly/Chest */}
                <ellipse cx="22" cy="36" rx="7" ry="6" fill="url(#furLight)"/>
                {/* Face patch */}
                <ellipse cx="18" cy="22" rx="7" ry="6" fill="url(#furLight)"/>
                {/* Ears */}
                <ellipse cx="10" cy="10" rx="3" ry="4" fill="url(#furMain)" transform="rotate(-20 10 10)"/>
                <ellipse cx="24" cy="9" rx="3" ry="4" fill="url(#furMain)" transform="rotate(20 24 9)"/>
                {/* Inner ears */}
                <ellipse cx="10" cy="11" rx="1.5" ry="2" fill="#fcd9bd" transform="rotate(-20 10 11)"/>
                <ellipse cx="24" cy="10" rx="1.5" ry="2" fill="#fcd9bd" transform="rotate(20 24 10)"/>
                {/* Eyes */}
                <ellipse cx="14" cy="18" rx="3" ry="3.5" fill="#1e1e1e"/>
                <ellipse cx="22" cy="18" rx="3" ry="3.5" fill="#1e1e1e"/>
                {/* Eye shine */}
                <circle cx="15" cy="17" r="1.2" fill="#ffffff"/>
                <circle cx="23" cy="17" r="1.2" fill="#ffffff"/>
                {/* Nose */}
                <ellipse cx="18" cy="24" rx="2" ry="1.5" fill="url(#furDark)"/>
                {/* Cheeks */}
                <circle cx="10" cy="22" r="2" fill="#fdba74" opacity="0.5"/>
                <circle cx="26" cy="22" r="2" fill="#fdba74" opacity="0.5"/>
              </svg>
            </div>
            <span className="logo-text">Book<span>App</span></span>
          </a>
          <div className="header-actions">
            <span className="header-badge">Demo</span>
            <button className="admin-btn" onClick={handleAdminClick}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 4.354a4 4 0 1 1 0 7.292"/>
                <path d="M15 21H3v-1a6 6 0 0 1 12 0v1z"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                <path d="M21 21v-1a4 4 0 0 0-3-3.85"/>
              </svg>
              Admin
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <BookingForm courseData={courseData} />
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>© 2025 <a href="https://zagnex.com" target="_blank" rel="noopener noreferrer">Zagnex</a>. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
