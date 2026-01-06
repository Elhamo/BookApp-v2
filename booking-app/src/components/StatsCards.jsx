import '../styles/StatsCards.css';

export default function StatsCards({ stats }) {
  const cards = [
    {
      id: 'total',
      label: 'Gesamt Buchungen',
      value: stats.totalBookings,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
      ),
      color: 'blue'
    },
    {
      id: 'confirmed',
      label: 'Bestätigt',
      value: stats.confirmedBookings,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <path d="M22 4L12 14.01l-3-3"/>
        </svg>
      ),
      color: 'green'
    },
    {
      id: 'cancelled',
      label: 'Storniert',
      value: stats.cancelledBookings,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M15 9l-6 6M9 9l6 6"/>
        </svg>
      ),
      color: 'red'
    },
    {
      id: 'revenue',
      label: 'Umsatz',
      value: `€${stats.totalRevenue.toLocaleString('de-AT')}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      color: 'purple'
    },
    {
      id: 'participants',
      label: 'Teilnehmer',
      value: stats.totalParticipants,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      color: 'orange'
    }
  ];

  return (
    <div className="stats-cards">
      {cards.map(card => (
        <div key={card.id} className={`stat-card ${card.color}`}>
          <div className="stat-icon">{card.icon}</div>
          <div className="stat-content">
            <span className="stat-value">{card.value}</span>
            <span className="stat-label">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
