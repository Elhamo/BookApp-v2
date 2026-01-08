import { useState, useEffect } from 'react';
import defaultConfig from '../data/arztpraxis';
import '../styles/DoctorBookingForm.css';

export default function DoctorBookingForm({ config }) {
  const praxisConfig = config || defaultConfig;
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
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // Auto-select doctor if only one exists
  useEffect(() => {
    if (praxisConfig.doctors.length === 1 && !selectedDoctor) {
      setSelectedDoctor(praxisConfig.doctors[0]);
    }
  }, [praxisConfig]);

  const singleDoctorMode = praxisConfig.doctors.length === 1;

  const steps = [
    { id: 1, title: 'Terminart', icon: 'user' },
    { id: 2, title: 'Datum & Zeit', icon: 'calendar' },
    { id: 3, title: 'Ihre Daten', icon: 'clipboard' },
    { id: 4, title: 'Zahlung', icon: 'credit-card' },
    { id: 5, title: 'Bestätigung', icon: 'check' }
  ];

  // Calculate total price
  const calculateTotal = () => {
    if (!selectedAppointmentType) return 0;
    let total = selectedAppointmentType.price;
    // Add extra fee for first-time patients
    if (patientData.patientStatus === 'neu') {
      total += 15; // Anamnese-Gebühr
    }
    return total;
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // Convert Sunday (0) to 7 for European calendar (Monday first)
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const isDateAvailable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Can't book today or past dates
    if (date <= today) return false;

    // Can't book more than 8 weeks ahead
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 56);
    if (date > maxDate) return false;

    const dayName = date.toLocaleDateString('de-DE', { weekday: 'long' });
    const dayKey = dayName.charAt(0).toUpperCase() + dayName.slice(1);

    // Check if practice is open and doctor is available
    return praxisConfig.openingHours[dayKey] &&
           (!selectedDoctor || selectedDoctor.availableDays.includes(dayKey));
  };

  const generateCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(calendarMonth);
    const firstDay = getFirstDayOfMonth(calendarMonth);

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ empty: true, key: `empty-${i}` });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
      const dayName = date.toLocaleDateString('de-DE', { weekday: 'long' });
      const dayKey = dayName.charAt(0).toUpperCase() + dayName.slice(1);

      days.push({
        date: date,
        day: day,
        dayName: dayKey,
        available: isDateAvailable(date),
        formatted: date.toLocaleDateString('de-DE', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        }),
        key: `day-${day}`
      });
    }

    return days;
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(calendarMonth);
    newMonth.setMonth(calendarMonth.getMonth() + direction);

    // Don't allow navigating to past months
    const today = new Date();
    if (newMonth.getFullYear() < today.getFullYear() ||
        (newMonth.getFullYear() === today.getFullYear() && newMonth.getMonth() < today.getMonth())) {
      return;
    }

    // Don't allow navigating more than 2 months ahead
    const maxMonth = new Date(today);
    maxMonth.setMonth(today.getMonth() + 2);
    if (newMonth > maxMonth) return;

    setCalendarMonth(newMonth);
  };

  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

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
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  // Format expiry date
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
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
      case 4:
        if (!paymentMethod) return false;
        if (paymentMethod === 'card') {
          return cardData.number.replace(/\s/g, '').length >= 16 &&
                 cardData.name.length >= 2 &&
                 cardData.expiry.length >= 5 &&
                 cardData.cvv.length >= 3;
        }
        return true; // Other payment methods just need to be selected
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
              <span className="label">{praxisConfig.professionalTitle || 'Arzt/Ärztin'}:</span>
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
            {/* Consultation Type - only show if multiple options */}
            {praxisConfig.consultationType.length > 1 && (
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
                      <div className="consultation-info">
                        <span className="consultation-name">{type.name}</span>
                        <span className="consultation-desc">{type.description}</span>
                      </div>
                      {type.note && <span className="consultation-note">{type.note}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Doctor Selection - only show if multiple doctors */}
            {!singleDoctorMode ? (
              <div className="form-section">
                <h3 className="section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  {praxisConfig.professionalTitleLong ? `Wählen Sie ${praxisConfig.professionalTitleLong}` : 'Wählen Sie Ihren Arzt / Ihre Ärztin'}
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
            ) : (
              /* Single Doctor Info Card */
              <div className="form-section single-doctor-info">
                <h3 className="section-title no-icon">
                  {praxisConfig.professionalTitleLong || 'Ihr Arzt / Ihre Ärztin'}
                </h3>
                <div className="doctor-info-card" style={{ '--doctor-color': selectedDoctor?.color }}>
                  <div className="doctor-avatar large">
                    {selectedDoctor?.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="doctor-details">
                    <h4>{selectedDoctor?.name}</h4>
                    <p className="doctor-title">{selectedDoctor?.title}</p>
                    <p className="doctor-specialization">{selectedDoctor?.specialization}</p>
                    <div className="doctor-availability">
                      <span className="availability-label">Verfügbar:</span>
                      <div className="doctor-days">
                        {['Mo', 'Di', 'Mi', 'Do', 'Fr'].map((day, i) => {
                          const fullDay = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'][i];
                          return (
                            <span
                              key={day}
                              className={`day ${selectedDoctor?.availableDays.includes(fullDay) ? 'available' : ''}`}
                            >
                              {day}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                    <span className="type-name">{type.name}</span>
                    <span className="type-duration">ca. {type.duration} Min.</span>
                    <span className="type-price">€ {type.price},-</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div className="step-2">
            {/* Calendar and Time in Two Columns */}
            <div className="date-time-grid">
              {/* Left: Calendar */}
              <div className="form-section calendar-section">
                <h3 className="section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Datum wählen
                </h3>

                <div className="calendar-container compact">
                  {/* Calendar Header */}
                  <div className="calendar-header">
                    <button
                      className="calendar-nav-btn"
                      onClick={() => navigateMonth(-1)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6"/>
                      </svg>
                    </button>
                    <span className="calendar-month-title">
                      {calendarMonth.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
                    </span>
                    <button
                      className="calendar-nav-btn"
                      onClick={() => navigateMonth(1)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </button>
                  </div>

                  {/* Weekday Headers */}
                  <div className="calendar-weekdays">
                    {weekDays.map(day => (
                      <span key={day} className="weekday">{day}</span>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="calendar-grid">
                    {generateCalendarDays().map((dayObj) => (
                      dayObj.empty ? (
                        <div key={dayObj.key} className="calendar-day empty"></div>
                      ) : (
                        <button
                          key={dayObj.key}
                          className={`calendar-day ${dayObj.available ? 'available' : 'unavailable'} ${
                            selectedDate?.date?.getTime() === dayObj.date.getTime() ? 'selected' : ''
                          }`}
                          disabled={!dayObj.available}
                          onClick={() => {
                            if (dayObj.available) {
                              setSelectedDate(dayObj);
                              setSelectedTime(null);
                            }
                          }}
                        >
                          {dayObj.day}
                        </button>
                      )
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Time Selection */}
              <div className="form-section time-section">
                <h3 className="section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {selectedDate ? `Uhrzeit am ${selectedDate.formatted}` : 'Uhrzeit wählen'}
                </h3>
                {selectedDate ? (
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
                ) : (
                  <div className="time-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <p>Bitte wählen Sie zuerst ein Datum</p>
                  </div>
                )}
              </div>
            </div>
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

              {/* Insurance & Status - nur für Arzt, nicht für Rechtsanwalt */}
              {!praxisConfig.hideInsuranceSection && (
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
              )}
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

        {/* Step 4: Payment */}
        {step === 4 && (
          <div className="step-4">
            <div className="payment-grid">
              {/* Payment Summary */}
              <div className="form-section">
                <h3 className="section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  Zahlungsübersicht
                </h3>
                <div className="payment-summary">
                  <div className="summary-row">
                    <span className="label">{selectedAppointmentType?.name}</span>
                    <span className="value">€ {selectedAppointmentType?.price},-</span>
                  </div>
                  {patientData.patientStatus === 'neu' && (
                    <div className="summary-row">
                      <span className="label">Erstbesuch-Gebühr (Anamnese)</span>
                      <span className="value">€ 15,-</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span className="label">Gesamtbetrag</span>
                    <span className="value">€ {calculateTotal()},-</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="form-section">
                <h3 className="section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  Zahlungsmethode wählen
                </h3>
                <div className="payment-methods">
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'google' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('google')}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Google Pay</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'apple' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('apple')}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <span>Apple Pay</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.016-2.47 4.857-6.145 4.857h-2.19a1.58 1.58 0 0 0-1.557 1.333l-1.12 7.106a.641.641 0 0 0 .633.74h3.248c.525 0 .973-.382 1.055-.9l.796-5.047c.082-.519.53-.9 1.055-.9h.657c4.332 0 7.703-1.756 8.693-6.834.326-1.669.182-3.065-.778-4.068z"/>
                    </svg>
                    <span>PayPal</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'card' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    <span>Kreditkarte</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'klarna' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('klarna')}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4.592 2v20H2V2h2.592zm10.664 0a8.684 8.684 0 0 1-3.426 6.909L18 22h-3.293l-5.874-12.005A8.632 8.632 0 0 0 12.592 2h2.664zM21 17.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/>
                    </svg>
                    <span>Klarna</span>
                  </button>
                </div>

                {/* Credit Card Form */}
                {paymentMethod === 'card' && (
                  <div className="card-form">
                    <div className="form-group">
                      <label>Kartennummer</label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({...cardData, number: formatCardNumber(e.target.value)})}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                    </div>
                    <div className="form-group">
                      <label>Karteninhaber</label>
                      <input
                        type="text"
                        value={cardData.name}
                        onChange={(e) => setCardData({...cardData, name: e.target.value.toUpperCase()})}
                        placeholder="MAX MUSTERMANN"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Gültig bis</label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({...cardData, expiry: formatExpiry(e.target.value)})}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '').substring(0, 4)})}
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Method Info */}
                {paymentMethod && paymentMethod !== 'card' && (
                  <div className="payment-info">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    <p>Sie werden nach der Bestätigung zu {paymentMethod === 'google' ? 'Google Pay' : paymentMethod === 'apple' ? 'Apple Pay' : paymentMethod === 'paypal' ? 'PayPal' : 'Klarna'} weitergeleitet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="step-5">
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
                    <span className="label">{praxisConfig.professionalTitle || 'Arzt/Ärztin'}</span>
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

        {step < 5 ? (
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
                Zahlung wird verarbeitet...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Jetzt € {calculateTotal()},- bezahlen
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
