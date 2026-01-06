import '../styles/BookingModal.css';

export default function BookingModal({ booking, onClose, onCancel }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-AT', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className="modal-header">
          <div className="booking-ref">
            <span className="ref-label">Buchungsnummer</span>
            <code className="ref-value">{booking.reference}</code>
          </div>
          <span className={`status-badge large ${booking.status}`}>
            {booking.status === 'confirmed' ? 'Bestätigt' : 'Storniert'}
          </span>
        </div>

        <div className="modal-body">
          {/* Course Details */}
          <section className="detail-section">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              Kursdetails
            </h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Kurs</span>
                <span className="value">{booking.session.title}</span>
              </div>
              <div className="detail-item">
                <span className="label">Tag & Zeit</span>
                <span className="value">{booking.session.day}, {booking.session.time}</span>
              </div>
              <div className="detail-item">
                <span className="label">Typ</span>
                <span className="value">{booking.session.type === 'regular' ? 'Regulärer Kurs' : 'Eltern-Kind'}</span>
              </div>
            </div>
          </section>

          {/* Participants */}
          <section className="detail-section">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
              </svg>
              Teilnehmer ({booking.participants?.length || booking.participantCount})
            </h3>
            {booking.participants ? (
              <div className="participants-list">
                {booking.participants.map((p, i) => (
                  <div key={i} className="participant-item">
                    <div className="participant-avatar">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="participant-details">
                      <span className="participant-name">{p.name}</span>
                      <span className="participant-meta">
                        {p.age} Jahre
                        {p.type && p.type !== 'participant' && (
                          <span className={`type-badge ${p.type}`}>
                            {p.type === 'parent' ? 'Elternteil' : 'Kind'}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">{booking.participantCount} Teilnehmer</p>
            )}
          </section>

          {/* Contact */}
          <section className="detail-section">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <path d="M22 6l-10 7L2 6"/>
              </svg>
              Kontaktdaten
            </h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Name</span>
                <span className="value">{booking.contact.name}</span>
              </div>
              <div className="detail-item">
                <span className="label">E-Mail</span>
                <span className="value">{booking.contact.email}</span>
              </div>
              {booking.contact.phone && (
                <div className="detail-item">
                  <span className="label">Telefon</span>
                  <span className="value">{booking.contact.phone}</span>
                </div>
              )}
              {booking.contact.notes && (
                <div className="detail-item full-width">
                  <span className="label">Anmerkungen</span>
                  <span className="value">{booking.contact.notes}</span>
                </div>
              )}
            </div>
          </section>

          {/* Pricing */}
          <section className="detail-section pricing">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Preis
            </h3>
            <div className="price-display">
              <span className="price-label">Gesamtbetrag</span>
              <span className="price-amount">€{booking.totalPrice || booking.pricing?.totalPrice},-</span>
            </div>
          </section>

          {/* Meta */}
          <section className="detail-section meta">
            <div className="meta-item">
              <span className="label">Gebucht am</span>
              <span className="value">{formatDate(booking.createdAt)}</span>
            </div>
          </section>
        </div>

        <div className="modal-footer">
          {booking.status === 'confirmed' && (
            <button
              className="btn btn-danger"
              onClick={() => onCancel(booking.reference)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M15 9l-6 6M9 9l6 6"/>
              </svg>
              Buchung stornieren
            </button>
          )}
          <button className="btn btn-secondary" onClick={onClose}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
