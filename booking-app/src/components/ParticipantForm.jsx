import '../styles/ParticipantForm.css';

export default function ParticipantForm({
  participants,
  setParticipants,
  contactInfo,
  setContactInfo,
  sessionType
}) {
  const updateParticipant = (index, field, value) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    setParticipants(updated);
  };

  const addParticipant = () => {
    setParticipants([...participants, { name: '', age: '' }]);
  };

  const removeParticipant = (index) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="participant-form">
      {/* Participants Section */}
      <div className="form-section">
        <h3 className="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Teilnehmer
        </h3>

        <div className="participants-list">
          {participants.map((participant, index) => (
            <div key={index} className="participant-card">
              <div className="participant-header">
                <span className="participant-number">
                  {sessionType === 'parent-child'
                    ? participant.type === 'parent'
                      ? `Elternteil ${participants.filter((p, i) => i <= index && p.type === 'parent').length}`
                      : `Kind ${participants.filter((p, i) => i <= index && p.type === 'child').length}`
                    : `Teilnehmer ${index + 1}`}
                </span>
                {sessionType === 'regular' && participants.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeParticipant(index)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                )}
              </div>

              <div className="participant-fields">
                <div className="form-group">
                  <label>Vollständiger Name *</label>
                  <input
                    type="text"
                    value={participant.name}
                    onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                    placeholder="Max Mustermann"
                    required
                  />
                </div>
                <div className="form-group form-group-small">
                  <label>Alter *</label>
                  <input
                    type="number"
                    value={participant.age}
                    onChange={(e) => updateParticipant(index, 'age', e.target.value)}
                    placeholder="25"
                    min={participant.type === 'child' ? 3 : 18}
                    max={participant.type === 'child' ? 10 : 99}
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {sessionType === 'regular' && (
          <button type="button" className="add-participant-btn" onClick={addParticipant}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v8M8 12h8"/>
            </svg>
            Weiteren Teilnehmer hinzufügen
          </button>
        )}
      </div>

      {/* Contact Information Section */}
      <div className="form-section">
        <h3 className="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <path d="M22 6l-10 7L2 6"/>
          </svg>
          Kontaktdaten
        </h3>

        <div className="contact-fields">
          <div className="form-row">
            <div className="form-group">
              <label>Vorname *</label>
              <input
                type="text"
                value={contactInfo.firstName}
                onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })}
                placeholder="Max"
                required
              />
            </div>
            <div className="form-group">
              <label>Nachname *</label>
              <input
                type="text"
                value={contactInfo.lastName}
                onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })}
                placeholder="Mustermann"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>E-Mail *</label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                placeholder="max@beispiel.at"
                required
              />
            </div>
            <div className="form-group">
              <label>Telefon *</label>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                placeholder="+43 123 456789"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Anmerkungen (optional)</label>
            <textarea
              value={contactInfo.notes}
              onChange={(e) => setContactInfo({ ...contactInfo, notes: e.target.value })}
              placeholder="Besondere Wünsche oder Anmerkungen..."
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
