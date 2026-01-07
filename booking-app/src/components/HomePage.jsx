import { Link } from 'react-router-dom';
import '../index.css';

export default function HomePage() {
  const businesses = [
    {
      id: 'eislaufen',
      name: 'Eislaufkurse',
      description: 'Eislaufkurse für Kinder und Erwachsene',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      ),
      color: '#f97316',
      path: '/eislaufen'
    },
    {
      id: 'arzt',
      name: 'Arztpraxis',
      description: 'Terminbuchung für Arztpraxen',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
      color: '#3b82f6',
      path: '/arzt'
    },
    {
      id: 'friseur',
      name: 'Friseursalon',
      description: 'Terminbuchung für Friseure',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="6" cy="6" r="3"/>
          <circle cx="6" cy="18" r="3"/>
          <line x1="20" y1="4" x2="8.12" y2="15.88"/>
          <line x1="14.47" y1="14.48" x2="20" y2="20"/>
          <line x1="8.12" y1="8.12" x2="12" y2="12"/>
        </svg>
      ),
      color: '#ec4899',
      path: '/friseur',
      comingSoon: true
    },
    {
      id: 'schwimmkurs',
      name: 'Schwimmkurse',
      description: 'Schwimmkurse für alle Altersgruppen',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h2"/>
          <circle cx="12" cy="7" r="3"/>
        </svg>
      ),
      color: '#06b6d4',
      path: '/schwimmkurs',
      comingSoon: true
    }
  ];

  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="homepage-header-content">
          <div className="homepage-logo">
            <span className="homepage-logo-text">Book</span>
            <span className="homepage-logo-highlight">App</span>
          </div>
          <span className="homepage-tagline">Buchungssystem für jeden Bedarf</span>
        </div>
      </header>

      <main className="homepage-main">
        <div className="homepage-hero">
          <h1>Willkommen bei BookApp</h1>
          <p>Das flexible Buchungssystem für verschiedene Branchen. Wählen Sie Ihre Branche:</p>
        </div>

        <div className="business-grid">
          {businesses.map(business => (
            business.comingSoon ? (
              <div key={business.id} className="business-card coming-soon">
                <div
                  className="business-icon"
                  style={{ background: `linear-gradient(135deg, ${business.color}, ${business.color}dd)` }}
                >
                  {business.icon}
                </div>
                <h2>{business.name}</h2>
                <p>{business.description}</p>
                <span className="coming-soon-badge">Demnächst verfügbar</span>
              </div>
            ) : (
              <Link key={business.id} to={business.path} className="business-card">
                <div
                  className="business-icon"
                  style={{ background: `linear-gradient(135deg, ${business.color}, ${business.color}dd)` }}
                >
                  {business.icon}
                </div>
                <h2>{business.name}</h2>
                <p>{business.description}</p>
                <span className="business-link" style={{ color: business.color }}>
                  Jetzt buchen →
                </span>
              </Link>
            )
          ))}
        </div>
      </main>

      <footer className="homepage-footer">
        <p>© 2025 <a href="https://zagnex.com" target="_blank" rel="noopener noreferrer">Zagnex</a>. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
}
