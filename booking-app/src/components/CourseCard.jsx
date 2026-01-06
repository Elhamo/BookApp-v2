import '../styles/CourseCard.css';

export default function CourseCard({ session, isSelected, onSelect, dates }) {
  const spotsClass = session.spotsLeft <= 3 ? 'low' : session.spotsLeft <= 7 ? 'medium' : 'high';

  return (
    <div
      className={`course-card ${isSelected ? 'selected' : ''} ${session.spotsLeft === 0 ? 'sold-out' : ''}`}
      onClick={session.spotsLeft > 0 ? onSelect : undefined}
    >
      <div className="card-header">
        <div className="time-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <span>{session.time}</span>
        </div>
        <div className={`spots-badge ${spotsClass}`}>
          {session.spotsLeft === 0 ? (
            'Ausgebucht'
          ) : (
            <>
              <span className="spots-number">{session.spotsLeft}</span>
              <span className="spots-text">Plätze frei</span>
            </>
          )}
        </div>
      </div>

      <div className="card-body">
        <h4 className="session-title">{session.title}</h4>
        <p className="session-description">{session.description}</p>

        {session.note && (
          <div className="session-note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            <span>{session.note}</span>
          </div>
        )}

        <div className="session-details">
          <div className="detail-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <span>{session.duration} Minuten</span>
          </div>
          <div className="detail-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>ab {session.minAge} Jahren</span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="dates-preview">
          <span className="dates-label">Termine:</span>
          <span className="dates-list">{dates.slice(0, 3).join(', ')}...</span>
        </div>
        {isSelected && (
          <div className="selected-indicator">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
