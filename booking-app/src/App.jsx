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
            <img src="/logo.png" alt="BookApp Logo" className="logo-img" />
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
