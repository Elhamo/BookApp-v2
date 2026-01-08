import DoctorBookingForm from './DoctorBookingForm';
import demoConfig from '../data/zahnarzt-demo';
import '../index.css';

export default function ZahnarztDemoApp() {
  return (
    <div className="app doctor-app">
      <header className="app-header">
        <div className="header-content">
          <a href="/" className="logo">
            <span className="logo-text">
              <span className="logo-name">{demoConfig.name}</span>
              <span className="logo-subtitle">{demoConfig.description}</span>
            </span>
          </a>
          <div className="header-actions">
            <a href={`tel:${demoConfig.phone}`} className="header-phone">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>{demoConfig.phone}</span>
            </a>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="page-header">
          <h1>Online Terminbuchung</h1>
          <p>Buchen Sie Ihren Termin bequem online - rund um die Uhr verfügbar</p>
        </div>
        <DoctorBookingForm config={demoConfig} />
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-info">
            <p><strong>{demoConfig.name}</strong></p>
            <p>{demoConfig.location}</p>
            <p>
              <a href={`mailto:${demoConfig.email}`}>{demoConfig.email}</a>
              {' | '}
              <a href={`tel:${demoConfig.phone}`}>{demoConfig.phone}</a>
            </p>
          </div>
          <div className="footer-notice">
            <p className="emergency-notice">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>{demoConfig.notices.emergency}</span>
            </p>
          </div>
          <p className="copyright">© 2025 <a href="https://zagnex.com" target="_blank" rel="noopener noreferrer">Zagnex</a>. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
