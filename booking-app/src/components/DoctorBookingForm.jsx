import { useState, useEffect } from 'react';
import praxisConfig from '../data/arztpraxis';
import '../styles/DoctorBookingForm.css';

export default function DoctorBookingForm() {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [consultationType, setConsultationType] = useState('vor-ort');
  const [preferredTime, setPreferredTime] = useState('egal');
  const [patientData, setPatientData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    insuranceType: 'gesetzlich',
    insuranceNumber: '',
    patientStatus: 'bestand',
    visitReason: '',
    urgency: 'normal',
    language: 'de',
    accessibility: 'keine',
    symptoms: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState(null);

  const steps = [
    { id: 1, title: 'Arzt & Terminart', icon: 'user' },
    { id: 2, title: 'Datum & Uhrzeit', icon: 'calendar' },
    { id: 3, title: 'Ihre Daten', icon: 'clipboard' },
    { id: 4, title: 'Bestätigung', icon: 'check' }
  ];

  // Generate available dates (next 4 weeks)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 28; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString('de-DE', { weekday: 'long' });
      const dayKey = dayName.charAt(0).toUpperCase() + dayName.slice(1);

      // Check if practice is open and doctor is available
      if (praxisConfig.openingHours[dayKey] &&
          (!selectedDoctor || selectedDoctor.availableDays.includes(dayKey))) {
        dates.push({
          date: date,
          dayName: dayKey,
          formatted: date.toLocaleDateString('de-DE', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          })
        });
      }
    }
    return dates;
  };

  // Get available time slots for selected date
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];

    const dayName = selectedDate.dayName;
    const hours = praxisConfig.openingHours[dayName];
    if (!hours) return [];

    const allSlots = [...praxisConfig.timeSlots.morning, ...praxisConfig.timeSlots.afternoon];

    // Filter by preferred time
    let filteredSlots = allSlots;
    if (preferredTime === 'morgens') {
      filteredSlots = praxisConfig.timeSlots.morning;
    } else if (preferredTime === 'nachmittags') {
      filteredSlots = praxisConfig.timeSlots.afternoon;
    }

    // Filter out lunch break times
    if (hours.lunch) {
      filteredSlots = filteredSlots.filter(slot => {
        const slotTime = slot.replace(':', '');
        const lunchStart = hours.lunch[0].replace(':', '');
        const lunchEnd = hours.lunch[1].replace(':', '');
        return slotTime < lunchStart || slotTime >= lunchEnd;
      });
    }

    return filteredSlots;
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate reference
    const ref = `APT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setBookingReference(ref);
    setBookingComplete(true);
    setIsSubmitting(false);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedDoctor && selectedAppointmentType;
      case 2:
        return selectedDate && selectedTime;
      case 3:
        return patientData.firstName && patientData.lastName &&
               patientData.email && patientData.phone &&
               patientData.birthDate && patientData.insuranceType;
      default:
        return true;
    }
  };

  // Booking complete view
  if (bookingComplete) {
    return (
      <div className="doctor-booking-form">
        <div className="booking-success">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2>Termin erfolgreich gebucht!</h2>
          <p className="reference">Buchungsnummer: <strong>{bookingReference}</strong></p>

          <div className="success-details">
            <div className="detail-row">
              <span className="label">Arzt/Ärztin:</span>
              <span className="value">{selectedDoctor.name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Terminart:</span>
              <span className="value">{selectedAppointmentType.name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Datum:</span>
              <span className="value">{selectedDate.date.toLocaleDateString('de-DE', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })}</span>
            </div>
            <div className="detail-row">
              <span className="label">Uhrzeit:</span>
              <span className="value">{selectedTime} Uhr</span>
            </div>
            <div className="detail-row">
              <span className="label">Art:</span>
              <span className="value">
                {praxisConfig.consultationType.find(c => c.id === consultationType)?.name}
              </span>
            </div>
          </div>

          <div className="success-notice">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <p>{praxisConfig.notices.general}</p>
          </div>

          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Neuen Termin buchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-booking-form">
      {/* Progress Steps */}
      <div className="booking-steps">
        {steps.map((s, index) => (
          <div
            key={s.id}
            className={`step ${step >= s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}
          >
            <div className="step-number">
              {step > s.id ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : s.id}
            </div>
            <span className="step-title">{s.title}</span>
            {index < steps.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="step-content">
        {/* Step 1: Doctor & Appointment Type */}
        {step === 1 && (
          <div className="step-1">
            {/* Consultation Type */}
            <div className="form-section">
              <h3 className="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 10l5 5-5 5"/>
                  <path d="M4 4v7a4 4 0 0 0 4 4h12"/>
                </svg>
                Wie möchten Sie den Termin wahrnehmen?
              </h3>
              <div className="consultation-types">
                {praxisConfig.consultationType.map(type => (
                  <div
                    key={type.id}
                    className={`consultation-card ${consultationType === type.id ? 'selected' : ''}`}
                    onClick={() => setConsultationType(type.id)}
                  >
                    <div className="consultation-icon">
                      {type.id === 'vor-ort' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                      )}
                      {type.id === 'video' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="23 7 16 12 23 17 23 7"/>
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                        </svg>
                      )}
                      {type.id === 'telefon' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      )}
                    </div>
                    <div className="consultation-info">
                      <span className="consultation-name">{type.name}</span>
                      <span className="consultation-desc">{type.description}</span>
                    </div>
                    {type.note && <span className="consultation-note">{type.note}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor Selection */}
            <div className="form-section">
              <h3 className="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Wählen Sie Ihren Arzt / Ihre Ärztin
              </h3>
              <div className="doctors-grid">
                {praxisConfig.doctors.map(doctor => (
                  <div
                    key={doctor.id}
                    className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                    onClick={() => setSelectedDoctor(doctor)}
                    style={{ '--doctor-color': doctor.color }}
                  >
                    <div className="doctor-avatar">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="doctor-info">
                      <h4>{doctor.name}</h4>
                      <p className="doctor-title">{doctor.title}</p>
                      <div className="doctor-languages">
                        {praxisConfig.languages
                          .filter(l => l.doctors.includes(doctor.id))
                          .map(l => (
                            <span key={l.id} className="language-flag" title={l.name}>{l.flag}</span>
                          ))
                        }
                      </div>
                    </div>
                    <div className="doctor-days">
                      {['Mo', 'Di', 'Mi', 'Do', 'Fr'].map((day, i) => {
                        const fullDay = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'][i];
                        return (
                          <span
                            key={day}
                            className={`day ${doctor.availableDays.includes(fullDay) ? 'available' : ''}`}
                          >
                            {day}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Appointment Type */}
            <div className="form-section">
              <h3 className="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Welche Art von Termin benötigen Sie?
              </h3>
              <div className="appointment-types-grid">
                {praxisConfig.appointmentTypes.map(type => (
                  <div
                    key={type.id}
                    className={`appointment-type-card ${selectedAppointmentType?.id === type.id ? 'selected' : ''}`}
                    onClick={() => setSelectedAppointmentType(type)}
                    style={{ '--type-color': type.color }}
                  >
                    <div className="type-icon">
                      {type.id === 'ersttermin' && '👤'}
                      {type.id === 'folgetermin' && '🔄'}
                      {type.id === 'akuttermin' && '🚨'}
                      {type.id === 'vorsorge' && '❤️'}
                      {type.id === 'impfung' && '💉'}
                      {type.id === 'rezept' && '📋'}
                      {type.id === 'beratung' && '💬'}
                    </div>
                    <div className="type-info">
                      <span className="type-name">{type.name}</span>
                      <span className="type-duration">ca. {type.duration} Min.</span>
                    </div>
                    <p className="type-desc">{type.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div className="step-2">
            {/* Preferred Time */}
            <div className="form-section">
              <h3 className="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                Bevorzugte Tageszeit
              </h3>
              <div className="preferred-time-options">
                {praxisConfig.preferredTime.map(time => (
                  <button
                    key={time.id}
                    className={`time-option ${preferredTime === time.id ? 'selected' : ''}`}
                    onClick={() => setPreferredTime(time.id)}
                  >
                    <span className="time-name">{time.name}</span>
                    <span className="time-desc">{time.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="form-section">
              <h3 className="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Wählen Sie ein Datum
              </h3>
              <div className="dates-scroll">
                {generateAvailableDates().map((dateObj, index) => (
                  <button
                    key={index}
                    className={`date-card ${selectedDate?.formatted === dateObj.formatted ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedDate(dateObj);
                      setSelectedTime(null);
                    }}
                  >
                    <span className="date-day">{dateObj.dayName.substring(0, 2)}</span>
                    <span className="date-number">{dateObj.date.getDate()}</span>
                    <span className="date-month">{dateObj.date.toLocaleDateString('de-DE', { month: 'short' })}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="form-section">
                <h3 className="section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Verfügbare Uhrzeiten am {selectedDate.formatted}
                </h3>
                <div className="time-slots-grid">
                  {getAvailableTimeSlots().map(time => (
                    <button
                      key={time}
                      className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Patient Data */}
        {step === 3 && (
          <div className="step-3">
            <div className="patient-form-grid">
              {/* Personal Data */}
              <div className="form-section">
                <h3 className="section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Persönliche Daten
                </h3>

                <div className="form-row">
                  <div className="form-group">
                    <label>Vorname *</label>
                    <input
                      type="text"
                      value={patientData.firstName}
                      onChange={(e) => setPatientData({...patientData, firstName: e.target.value})}
                      placeholder="Max"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nachname *</label>
                    <input
                      type="text"
                      value={patientData.lastName}
                      onChange={(e) => setPatientData({...patientData, lastName: e.target.value})}
                      placeholder="Mustermann"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Geburtsdatum *</label>
                    <input
                      type="date"
                      value={patientData.birthDate}
                      onChange={(e) => setPatientData({...patientData, birthDate: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Geschlecht</label>
                    <select
                      value={patientData.gender}
                      onChange={(e) => setPatientData({...patientData, gender: e.target.value})}
                    >
                      <option value="">Bitte wählen</option>
                      <option value="m">Männlich</option>
                      <option value="w">Weiblich</option>
                      <option value="d">Divers</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>E-Mail *</label>
                    <input
                      type="email"
                      value={patientData.email}
                      onChange={(e) => setPatientData({...patientData, email: e.target.value})}
                      placeholder="max@beispiel.at"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefon *</label>
                    <input
                      type="tel"
                      value={patientData.phone}
                      onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
                      placeholder="+43 123 456789"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Insurance & Status */}
              <div className="form-section">
                <h3 className="section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Versicherung & Status
                </h3>

                <div className="form-group">
                  <label>Versicherungsart *</label>
                  <div className="insurance-options">
                    {praxisConfig.insuranceTypes.map(ins => (
                      <button
                        key={ins.id}
                        type="button"
                        className={`insurance-btn ${patientData.insuranceType === ins.id ? 'selected' : ''}`}
                        onClick={() => setPatientData({...patientData, insuranceType: ins.id})}
                      >
                        <span className="ins-name">{ins.name}</span>
                        <span className="ins-desc">{ins.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {patientData.insuranceType === 'gesetzlich' && (
                  <div className="form-group">
                    <label>Versicherungsnummer (SVNR)</label>
                    <input
                      type="text"
                      value={patientData.insuranceNumber}
                      onChange={(e) => setPatientData({...patientData, insuranceNumber: e.target.value})}
                      placeholder="1234 010190"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Patientenstatus</label>
                  <div className="status-options">
                    {praxisConfig.patientStatus.map(status => (
                      <button
                        key={status.id}
                        type="button"
                        className={`status-btn ${patientData.patientStatus === status.id ? 'selected' : ''}`}
                        onClick={() => setPatientData({...patientData, patientStatus: status.id})}
                      >
                        {status.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Bevorzugte Sprache</label>
                  <select
                    value={patientData.language}
                    onChange={(e) => setPatientData({...patientData, language: e.target.value})}
                  >
                    {praxisConfig.languages
                      .filter(l => l.doctors.includes(selectedDoctor?.id))
                      .map(lang => (
                        <option key={lang.id} value={lang.id}>
                          {lang.flag} {lang.name}
                        </option>
                      ))
                    }
                  </select>
                </div>

                <div className="form-group">
                  <label>Barrierefreiheit</label>
                  <select
                    value={patientData.accessibility}
                    onChange={(e) => setPatientData({...patientData, accessibility: e.target.value})}
                  >
                    {praxisConfig.accessibility.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Visit Reason & Notes */}
            <div className="form-section full-width">
              <h3 className="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                Anliegen & Anmerkungen
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Besuchsgrund</label>
                  <select
                    value={patientData.visitReason}
                    onChange={(e) => setPatientData({...patientData, visitReason: e.target.value})}
                  >
                    <option value="">Bitte wählen</option>
                    {praxisConfig.visitReasons.map(reason => (
                      <option key={reason.id} value={reason.id}>{reason.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Dringlichkeit</label>
                  <div className="urgency-options">
                    {praxisConfig.urgencyLevels.map(level => (
                      <button
                        key={level.id}
                        type="button"
                        className={`urgency-btn ${patientData.urgency === level.id ? 'selected' : ''}`}
                        style={{ '--urgency-color': level.color }}
                        onClick={() => setPatientData({...patientData, urgency: level.id})}
                      >
                        {level.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Symptome / Beschwerden</label>
                <textarea
                  value={patientData.symptoms}
                  onChange={(e) => setPatientData({...patientData, symptoms: e.target.value})}
                  placeholder="Beschreiben Sie kurz Ihre Symptome oder Beschwerden..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Weitere Anmerkungen</label>
                <textarea
                  value={patientData.notes}
                  onChange={(e) => setPatientData({...patientData, notes: e.target.value})}
                  placeholder="Sonstige Hinweise für die Praxis..."
                  rows={2}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="step-4">
            <div className="confirmation-grid">
              {/* Appointment Summary */}
              <div className="summary-section">
                <h3 className="section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Terminübersicht
                </h3>
                <div className="summary-card">
                  <div className="summary-row">
                    <span className="label">Arzt/Ärztin</span>
                    <span className="value">{selectedDoctor?.name}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Terminart</span>
                    <span className="value">{selectedAppointmentType?.name}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Datum</span>
                    <span className="value">{selectedDate?.date.toLocaleDateString('de-DE', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                    })}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Uhrzeit</span>
                    <span className="value">{selectedTime} Uhr</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Dauer</span>
                    <span className="value">ca. {selectedAppointmentType?.duration} Minuten</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Art</span>
                    <span className="value">
                      {praxisConfig.consultationType.find(c => c.id === consultationType)?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient Summary */}
              <div className="summary-section">
                <h3 className="section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Ihre Daten
                </h3>
                <div className="summary-card">
                  <div className="summary-row">
                    <span className="label">Name</span>
                    <span className="value">{patientData.firstName} {patientData.lastName}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Geburtsdatum</span>
                    <span className="value">{new Date(patientData.birthDate).toLocaleDateString('de-DE')}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">E-Mail</span>
                    <span className="value">{patientData.email}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Telefon</span>
                    <span className="value">{patientData.phone}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Versicherung</span>
                    <span className="value">
                      {praxisConfig.insuranceTypes.find(i => i.id === patientData.insuranceType)?.name}
                    </span>
                  </div>
                  {patientData.visitReason && (
                    <div className="summary-row">
                      <span className="label">Anliegen</span>
                      <span className="value">
                        {praxisConfig.visitReasons.find(r => r.id === patientData.visitReason)?.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notices */}
            <div className="notices-section">
              <div className="notice info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>{praxisConfig.notices.general}</span>
              </div>
              {patientData.patientStatus === 'neu' && (
                <div className="notice warning">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <span>{praxisConfig.notices.firstVisit}</span>
                </div>
              )}
              <div className="notice">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>{praxisConfig.notices.cancellation}</span>
              </div>
            </div>

            {/* Terms */}
            <div className="terms-section">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>Ich habe die Datenschutzerklärung gelesen und stimme der Verarbeitung meiner Daten zu.</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="form-navigation">
        {step > 1 && (
          <button className="btn btn-secondary" onClick={handleBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Zurück
          </button>
        )}

        {step < 4 ? (
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            Weiter
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        ) : (
          <button
            className="btn btn-primary btn-submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Termin wird gebucht...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Termin verbindlich buchen
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
