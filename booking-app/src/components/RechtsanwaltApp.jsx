import DoctorBookingForm from './DoctorBookingForm';
import rechtsanwaltConfig from '../data/rechtsanwalt-demo';
import '../index.css';

export default function RechtsanwaltApp() {
  return (
    <div className="app doctor-app rechtsanwalt-app">
      <header className="app-header">
        <div className="header-content">
          <a href="/" className="logo">
            <span className="logo-text">
              <span className="logo-name">{rechtsanwaltConfig.name}</span>
              <span className="logo-subtitle">{rechtsanwaltConfig.description}</span>
            </span>
          </a>
          <div className="header-actions">
            <a href={`tel:${rechtsanwaltConfig.phone}`} className="header-phone">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>{rechtsanwaltConfig.phone}</span>
            </a>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="page-header">
          <h1>Online Terminbuchung</h1>
          <p>Buchen Sie Ihren Beratungstermin bequem online - Wien, Linz oder per Videocall</p>
        </div>
        <DoctorBookingForm config={rechtsanwaltConfig} />
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-info">
            <p><strong>{rechtsanwaltConfig.name}</strong></p>
            <p>{rechtsanwaltConfig.description}</p>
            <p>
              <a href={`mailto:${rechtsanwaltConfig.email}`}>{rechtsanwaltConfig.email}</a>
              {' | '}
              <a href={`tel:${rechtsanwaltConfig.phone}`}>{rechtsanwaltConfig.phone}</a>
            </p>
          </div>
          <div className="footer-locations">
            {rechtsanwaltConfig.locations.map(loc => (
              <p key={loc.id}>
                <strong>{loc.name}:</strong> {loc.address}
              </p>
            ))}
          </div>
          <p className="copyright">&copy; 2025 <a href="https://zagnex.com" target="_blank" rel="noopener noreferrer">Zagnex</a>. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
