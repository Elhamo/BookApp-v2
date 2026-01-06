import '../styles/BookingSummary.css';

const PAYMENT_METHODS = {
  'google-pay': { name: 'Google Pay', icon: 'google' },
  'apple-pay': { name: 'Apple Pay', icon: 'apple' },
  'paypal': { name: 'PayPal', icon: 'paypal' },
  'credit-card': { name: 'Kreditkarte', icon: 'card' }
};

export default function BookingSummary({
  session,
  pricing,
  participants,
  contactInfo,
  courseData,
  paymentMethod,
  cardDetails
}) {
  // Mask card number to show only last 4 digits
  const getMaskedCardNumber = () => {
    if (!cardDetails?.number) return null;
    const digits = cardDetails.number.replace(/\s/g, '');
    if (digits.length < 4) return '•••• •••• •••• ••••';
    const lastFour = digits.slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };
  const dates = session.day === 'Freitag' ? courseData.dates.friday : courseData.dates.saturday;
  const totalPrice = session.type === 'regular'
    ? pricing.price * participants.length
    : pricing.price;

  return (
    <div className="booking-summary">
      {/* Course Details */}
      <div className="summary-section">
        <h4 className="summary-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          Kursdetails
        </h4>
        <div className="summary-card">
          <div className="summary-row">
            <span className="label">Kurs</span>
            <span className="value">{session.title}</span>
          </div>
          <div className="summary-row">
            <span className="label">Tag & Zeit</span>
            <span className="value">{session.day}, {session.time}</span>
          </div>
          <div className="summary-row">
            <span className="label">Dauer</span>
            <span className="value">{session.duration} Minuten pro Einheit</span>
          </div>
          <div className="summary-row">
            <span className="label">Einheiten</span>
            <span className="value">{courseData.totalSessions} Termine</span>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="summary-section">
        <h4 className="summary-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          Termine
        </h4>
        <div className="dates-grid">
          {dates.map((date, index) => (
            <div key={index} className="date-chip">
              <span className="date-number">{index + 1}</span>
              <span className="date-value">{date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Participants */}
      <div className="summary-section">
        <h4 className="summary-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
          </svg>
          Teilnehmer ({participants.length})
        </h4>
        <div className="participants-summary">
          {participants.map((participant, index) => (
            <div key={index} className="participant-row">
              <div className="participant-avatar">
                {participant.name.charAt(0).toUpperCase()}
              </div>
              <div className="participant-info">
                <span className="participant-name">{participant.name}</span>
                <span className="participant-age">{participant.age} Jahre</span>
              </div>
              {participant.type && (
                <span className={`participant-type ${participant.type}`}>
                  {participant.type === 'parent' ? 'Elternteil' : 'Kind'}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="summary-section">
        <h4 className="summary-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <path d="M22 6l-10 7L2 6"/>
          </svg>
          Kontakt
        </h4>
        <div className="summary-card">
          <div className="summary-row">
            <span className="label">Name</span>
            <span className="value">{contactInfo.firstName} {contactInfo.lastName}</span>
          </div>
          <div className="summary-row">
            <span className="label">E-Mail</span>
            <span className="value">{contactInfo.email}</span>
          </div>
          <div className="summary-row">
            <span className="label">Telefon</span>
            <span className="value">{contactInfo.phone}</span>
          </div>
          {contactInfo.notes && (
            <div className="summary-row">
              <span className="label">Anmerkungen</span>
              <span className="value">{contactInfo.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Method */}
      {paymentMethod && (
        <div className="summary-section">
          <h4 className="summary-section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            Zahlungsmethode
          </h4>
          <div className="payment-method-display">
            <div className={`payment-method-icon ${paymentMethod}`}>
              {paymentMethod === 'google-pay' && (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"/>
                </svg>
              )}
              {paymentMethod === 'apple-pay' && (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              )}
              {paymentMethod === 'paypal' && (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 3.72a.77.77 0 01.76-.654h6.324c2.1 0 3.688.47 4.718 1.396.98.882 1.418 2.167 1.299 3.818-.087 1.21-.378 2.267-.865 3.14a5.76 5.76 0 01-1.678 1.924c-.687.504-1.487.878-2.378 1.112-.867.228-1.845.342-2.91.342H8.301l-.762 4.884a.77.77 0 01-.76.655h-1.7z"/>
                </svg>
              )}
              {paymentMethod === 'credit-card' && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              )}
            </div>
            <div className="payment-method-info">
              <span className="payment-method-name">{PAYMENT_METHODS[paymentMethod]?.name}</span>
              {cardDetails && getMaskedCardNumber() && (
                <span className="payment-card-number">{getMaskedCardNumber()}</span>
              )}
              <span className="payment-method-status">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Zahlung erfolgreich
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Price */}
      <div className="summary-section price-section">
        <div className="price-breakdown">
          {session.type === 'regular' ? (
            <>
              <div className="price-row">
                <span>Eislaufkurs × {participants.length} Teilnehmer</span>
                <span>€{pricing.price},- × {participants.length}</span>
              </div>
              {courseData.pricing.regular.includes && (
                <div className="price-includes">
                  {courseData.pricing.regular.includes.map((item, i) => (
                    <span key={i}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="price-row">
              <span>{pricing.label}</span>
              <span>€{pricing.price},-</span>
            </div>
          )}
        </div>
        <div className="price-total">
          <span className="total-label">Gesamtbetrag</span>
          <span className="total-amount">€{totalPrice},-</span>
        </div>
      </div>
    </div>
  );
}
