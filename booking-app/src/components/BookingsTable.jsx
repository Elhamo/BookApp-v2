import '../styles/BookingsTable.css';

export default function BookingsTable({ bookings, onView, onCancel }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-AT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bookings-table-container">
      <table className="bookings-table">
        <thead>
          <tr>
            <th>Referenz</th>
            <th>Kurs</th>
            <th>Kontakt</th>
            <th>Teilnehmer</th>
            <th>Preis</th>
            <th>Status</th>
            <th>Datum</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking.reference} className={booking.status}>
              <td className="reference">
                <code>{booking.reference}</code>
              </td>
              <td className="course">
                <div className="course-info">
                  <span className="course-title">{booking.session.title}</span>
                  <span className="course-time">{booking.session.day}, {booking.session.time}</span>
                </div>
              </td>
              <td className="contact">
                <div className="contact-info">
                  <span className="contact-name">{booking.contact.name}</span>
                  <span className="contact-email">{booking.contact.email}</span>
                </div>
              </td>
              <td className="participants">
                <span className="participant-count">{booking.participantCount}</span>
              </td>
              <td className="price">
                <span className="price-amount">€{booking.totalPrice},-</span>
              </td>
              <td className="status">
                <span className={`status-badge ${booking.status}`}>
                  {booking.status === 'confirmed' ? 'Bestätigt' : 'Storniert'}
                </span>
              </td>
              <td className="date">
                {formatDate(booking.createdAt)}
              </td>
              <td className="actions">
                <button
                  className="action-btn view"
                  onClick={() => onView(booking.reference)}
                  title="Details anzeigen"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
                {booking.status === 'confirmed' && (
                  <button
                    className="action-btn cancel"
                    onClick={() => onCancel(booking.reference)}
                    title="Stornieren"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M15 9l-6 6M9 9l6 6"/>
                    </svg>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
