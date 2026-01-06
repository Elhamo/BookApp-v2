import { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
import PricingSelector from './PricingSelector';
import StepIndicator from './StepIndicator';
import ParticipantForm from './ParticipantForm';
import BookingSummary from './BookingSummary';
import { createBooking, getCourseAvailability, ApiError } from '../services/api';
import '../styles/BookingForm.css';

const STEPS = [
  { id: 1, label: 'Kurs wählen' },
  { id: 2, label: 'Teilnehmer' },
  { id: 3, label: 'Zahlung' },
  { id: 4, label: 'Bestätigung' }
];

export default function BookingForm({ courseData }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedPricing, setSelectedPricing] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState({});
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // Fetch course availability on mount
  useEffect(() => {
    async function fetchAvailability() {
      try {
        const data = await getCourseAvailability(courseData.id);
        const availMap = {};
        data.sessions.forEach(s => {
          availMap[s.id] = s.spotsLeft;
        });
        setAvailability(availMap);
      } catch (err) {
        console.log('Could not fetch availability, using defaults');
      }
    }
    fetchAvailability();
  }, [courseData.id]);

  // Group sessions by day
  const sessionsByDay = courseData.sessions.reduce((acc, session) => {
    if (!acc[session.day]) acc[session.day] = [];
    // Update spots from availability if available
    const updatedSession = {
      ...session,
      spotsLeft: availability[session.id] ?? session.spotsLeft
    };
    acc[session.day].push(updatedSession);
    return acc;
  }, {});

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
    setError(null);
    // Reset pricing when session changes
    if (session.type === 'regular') {
      setSelectedPricing({ type: 'regular', price: courseData.pricing.regular.price });
      setParticipants([{ name: '', age: '' }]);
    } else {
      setSelectedPricing(null);
      setParticipants([]);
    }
  };

  const handlePricingSelect = (pricing) => {
    setSelectedPricing(pricing);
    setError(null);
    // Set up participant fields based on pricing
    if (pricing.parents && pricing.children) {
      const newParticipants = [];
      for (let i = 0; i < pricing.parents; i++) {
        newParticipants.push({ name: '', age: '', type: 'parent' });
      }
      for (let i = 0; i < pricing.children; i++) {
        newParticipants.push({ name: '', age: '', type: 'child' });
      }
      setParticipants(newParticipants);
    }
  };

  const handleNextStep = () => {
    setError(null);
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Credit card validation
  const validateCard = () => {
    const errors = [];

    if (selectedPayment !== 'credit-card') return { isValid: true, errors: [] };

    const cardNumber = cardDetails.number.replace(/\s/g, '');

    // Card number validation (16 digits)
    if (!cardNumber || cardNumber.length < 15) {
      errors.push('Bitte geben Sie eine gültige Kartennummer ein (mind. 15 Ziffern)');
    }

    // Cardholder name validation
    if (!cardDetails.name || cardDetails.name.trim().length < 3) {
      errors.push('Bitte geben Sie den Namen des Karteninhabers ein');
    }

    // Expiry validation (MM/YY format)
    if (!cardDetails.expiry || cardDetails.expiry.length < 5) {
      errors.push('Bitte geben Sie ein gültiges Ablaufdatum ein (MM/YY)');
    } else {
      const [month, year] = cardDetails.expiry.split('/');
      const expMonth = parseInt(month, 10);
      const expYear = parseInt('20' + year, 10);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      if (expMonth < 1 || expMonth > 12) {
        errors.push('Ungültiger Monat im Ablaufdatum');
      } else if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        errors.push('Die Karte ist abgelaufen');
      }
    }

    // CVV validation (3-4 digits)
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      errors.push('Bitte geben Sie einen gültigen CVV ein (3-4 Ziffern)');
    }

    return { isValid: errors.length === 0, errors };
  };

  const isCardValid = () => {
    if (selectedPayment !== 'credit-card') return true;
    return validateCard().isValid;
  };

  // Demo payment processing
  const handlePayment = async () => {
    if (!selectedPayment) {
      setError('Bitte wählen Sie eine Zahlungsmethode.');
      return;
    }

    // Validate credit card if selected
    if (selectedPayment === 'credit-card') {
      const validation = validateCard();
      if (!validation.isValid) {
        setError(validation.errors.join('\n'));
        return;
      }
    }

    setIsProcessingPayment(true);
    setError(null);

    // Simulate payment processing (demo)
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessingPayment(false);
    setPaymentComplete(true);

    // Auto-proceed to confirmation after payment
    setTimeout(() => {
      handleNextStep();
    }, 500);
  };

  const handleSubmit = async () => {
    if (!termsAccepted) {
      setError('Bitte akzeptieren Sie die AGB und Datenschutzerklärung.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const bookingData = {
      course: courseData.id,
      session: selectedSession,
      pricing: selectedPricing,
      participants,
      contact: contactInfo
    };

    try {
      const result = await createBooking(bookingData);
      console.log('Booking successful:', result);
      setBookingResult(result.booking);
      setIsComplete(true);
    } catch (err) {
      console.error('Booking failed:', err);
      if (err instanceof ApiError) {
        if (err.errors && err.errors.length > 0) {
          setError(err.errors.join('\n'));
        } else {
          setError(err.message);
        }
      } else {
        setError('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToStep2 = selectedSession && selectedPricing;
  const canProceedToStep3 = participants.every(p => p.name && p.age) &&
    contactInfo.firstName && contactInfo.lastName &&
    contactInfo.email && contactInfo.phone;
  const canProceedToStep4 = paymentComplete;

  if (isComplete && bookingResult) {
    return (
      <div className="booking-complete">
        <div className="success-animation">
          <svg className="checkmark" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        <h2>Buchung erfolgreich!</h2>
        <p>Vielen Dank für Ihre Buchung. Eine Bestätigungs-E-Mail wurde an <strong>{bookingResult.contact.email}</strong> gesendet.</p>
        <div className="booking-reference">
          <span>Buchungsnummer:</span>
          <strong>{bookingResult.reference}</strong>
        </div>
        <div className="booking-details">
          <p><strong>Kurs:</strong> {bookingResult.session.title}</p>
          <p><strong>Zeit:</strong> {bookingResult.session.day}, {bookingResult.session.time}</p>
          <p><strong>Teilnehmer:</strong> {bookingResult.participantCount}</p>
          <p><strong>Gesamtpreis:</strong> €{bookingResult.totalPrice},-</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Neue Buchung
        </button>
      </div>
    );
  }

  return (
    <div className="booking-form">
      <div className="booking-header">
        <h1>{courseData.name}</h1>
        <p className="course-info">
          {courseData.totalSessions} Einheiten • {courseData.location}
        </p>
      </div>

      <StepIndicator steps={STEPS} currentStep={currentStep} />

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
          <div className="error-content">
            {error.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <button className="error-close" onClick={() => setError(null)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      )}

      <div className="booking-content">
        {/* Step 1: Course Selection */}
        {currentStep === 1 && (
          <div className="step-content step-1">
            <h2>Wählen Sie Ihren Kurs</h2>

            {Object.entries(sessionsByDay).map(([day, sessions]) => (
              <div key={day} className="day-group">
                <h3 className="day-title">{day}</h3>
                <div className="sessions-grid">
                  {sessions.map(session => (
                    <CourseCard
                      key={session.id}
                      session={session}
                      isSelected={selectedSession?.id === session.id}
                      onSelect={() => handleSessionSelect(session)}
                      dates={day === 'Freitag' ? courseData.dates.friday : courseData.dates.saturday}
                    />
                  ))}
                </div>
              </div>
            ))}

            {selectedSession && selectedSession.type === 'parent-child' && (
              <div className="pricing-section">
                <h3>Wählen Sie Ihre Teilnehmeranzahl</h3>
                <PricingSelector
                  options={courseData.pricing.parentChild}
                  selected={selectedPricing}
                  onSelect={handlePricingSelect}
                />
              </div>
            )}

            {selectedSession && (
              <div className="selected-summary">
                <div className="summary-content">
                  <span className="summary-label">Ausgewählt:</span>
                  <span className="summary-value">
                    {selectedSession.day} {selectedSession.time} - {selectedSession.title}
                  </span>
                  {selectedPricing && (
                    <span className="summary-price">€{selectedPricing.price},-</span>
                  )}
                </div>
              </div>
            )}

            <div className="step-actions">
              <button
                className="btn btn-primary btn-next"
                disabled={!canProceedToStep2}
                onClick={handleNextStep}
              >
                Weiter zu Teilnehmer
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Participant Information */}
        {currentStep === 2 && (
          <div className="step-content step-2">
            <h2>Teilnehmer & Kontaktdaten</h2>

            <ParticipantForm
              participants={participants}
              setParticipants={setParticipants}
              contactInfo={contactInfo}
              setContactInfo={setContactInfo}
              sessionType={selectedSession?.type}
            />

            <div className="step-actions">
              <button className="btn btn-secondary" onClick={handlePrevStep}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Zurück
              </button>
              <button
                className="btn btn-primary btn-next"
                disabled={!canProceedToStep3}
                onClick={handleNextStep}
              >
                Weiter zur Zahlung
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <div className="step-content step-3">
            <h2>Zahlungsmethode wählen</h2>
            <p className="payment-subtitle">Wählen Sie Ihre bevorzugte Zahlungsmethode (Demo)</p>

            <div className="payment-amount">
              <span>Gesamtbetrag:</span>
              <strong>€{selectedPricing?.price},-</strong>
            </div>

            <div className="payment-methods">
              {/* Google Pay */}
              <div
                className={`payment-option ${selectedPayment === 'google-pay' ? 'selected' : ''}`}
                onClick={() => setSelectedPayment('google-pay')}
              >
                <div className="payment-icon google-pay">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"/>
                  </svg>
                </div>
                <div className="payment-info">
                  <span className="payment-name">Google Pay</span>
                  <span className="payment-desc">Schnell & sicher bezahlen</span>
                </div>
                {selectedPayment === 'google-pay' && (
                  <div className="payment-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Apple Pay */}
              <div
                className={`payment-option ${selectedPayment === 'apple-pay' ? 'selected' : ''}`}
                onClick={() => setSelectedPayment('apple-pay')}
              >
                <div className="payment-icon apple-pay">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                </div>
                <div className="payment-info">
                  <span className="payment-name">Apple Pay</span>
                  <span className="payment-desc">Mit Touch ID bezahlen</span>
                </div>
                {selectedPayment === 'apple-pay' && (
                  <div className="payment-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* PayPal */}
              <div
                className={`payment-option ${selectedPayment === 'paypal' ? 'selected' : ''}`}
                onClick={() => setSelectedPayment('paypal')}
              >
                <div className="payment-icon paypal">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 3.72a.77.77 0 01.76-.654h6.324c2.1 0 3.688.47 4.718 1.396.98.882 1.418 2.167 1.299 3.818-.087 1.21-.378 2.267-.865 3.14a5.76 5.76 0 01-1.678 1.924c-.687.504-1.487.878-2.378 1.112-.867.228-1.845.342-2.91.342H8.301l-.762 4.884a.77.77 0 01-.76.655h-1.7z"/>
                    <path d="M19.817 7.816c-.087 1.21-.378 2.267-.865 3.14a5.76 5.76 0 01-1.678 1.924c-.687.504-1.487.878-2.378 1.112-.867.228-1.845.342-2.91.342h-1.913l-.762 4.884a.77.77 0 01-.76.655H6.57l-.062.397a.641.641 0 00.633.74h3.574a.77.77 0 00.76-.655l.626-4.027h1.59c1.065 0 2.043-.114 2.91-.342.891-.234 1.691-.608 2.378-1.112a5.76 5.76 0 001.678-1.924c.487-.873.778-1.93.865-3.14.12-1.651-.32-2.936-1.299-3.818-.051-.046-.104-.09-.158-.134.505.882.754 1.935.752 3.058z" opacity=".35"/>
                  </svg>
                </div>
                <div className="payment-info">
                  <span className="payment-name">PayPal</span>
                  <span className="payment-desc">Mit PayPal-Konto bezahlen</span>
                </div>
                {selectedPayment === 'paypal' && (
                  <div className="payment-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Credit Card */}
              <div
                className={`payment-option ${selectedPayment === 'credit-card' ? 'selected' : ''}`}
                onClick={() => setSelectedPayment('credit-card')}
              >
                <div className="payment-icon credit-card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                <div className="payment-info">
                  <span className="payment-name">Kreditkarte</span>
                  <span className="payment-desc">Visa, Mastercard, AMEX</span>
                </div>
                {selectedPayment === 'credit-card' && (
                  <div className="payment-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Credit Card Form */}
            {selectedPayment === 'credit-card' && !paymentComplete && (
              <div className="credit-card-form">
                <h4 className="card-form-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  Kartendaten eingeben
                </h4>

                <div className="card-preview">
                  <div className="card-preview-inner">
                    <div className="card-chip"></div>
                    <div className="card-number-preview">
                      {cardDetails.number || '•••• •••• •••• ••••'}
                    </div>
                    <div className="card-bottom">
                      <div className="card-holder">
                        <span className="card-label">Karteninhaber</span>
                        <span className="card-value">{cardDetails.name || 'VORNAME NACHNAME'}</span>
                      </div>
                      <div className="card-expiry">
                        <span className="card-label">Gültig bis</span>
                        <span className="card-value">{cardDetails.expiry || 'MM/YY'}</span>
                      </div>
                    </div>
                    <div className="card-type-icons">
                      <svg viewBox="0 0 50 35" className="visa-icon">
                        <rect fill="#1A1F71" width="50" height="35" rx="4"/>
                        <text x="25" y="22" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">VISA</text>
                      </svg>
                      <svg viewBox="0 0 50 35" className="mc-icon">
                        <rect fill="#000" width="50" height="35" rx="4"/>
                        <circle cx="20" cy="17.5" r="10" fill="#EB001B"/>
                        <circle cx="30" cy="17.5" r="10" fill="#F79E1B"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="card-inputs">
                  <div className={`form-group ${cardDetails.number.replace(/\s/g, '').length >= 15 ? 'valid' : cardDetails.number.length > 0 ? 'invalid' : ''}`}>
                    <label>Kartennummer <span className="required">*</span></label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        value={cardDetails.number}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          value = value.replace(/(\d{4})/g, '$1 ').trim();
                          setCardDetails({...cardDetails, number: value.slice(0, 19)});
                        }}
                      />
                      {cardDetails.number.replace(/\s/g, '').length >= 15 && (
                        <span className="input-valid-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={`form-group ${cardDetails.name.trim().length >= 3 ? 'valid' : cardDetails.name.length > 0 ? 'invalid' : ''}`}>
                    <label>Karteninhaber <span className="required">*</span></label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        placeholder="Max Mustermann"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({...cardDetails, name: e.target.value.toUpperCase()})}
                      />
                      {cardDetails.name.trim().length >= 3 && (
                        <span className="input-valid-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="card-row">
                    <div className={`form-group ${cardDetails.expiry.length >= 5 ? 'valid' : cardDetails.expiry.length > 0 ? 'invalid' : ''}`}>
                      <label>Gültig bis <span className="required">*</span></label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength="5"
                          value={cardDetails.expiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                            setCardDetails({...cardDetails, expiry: value});
                          }}
                        />
                        {cardDetails.expiry.length >= 5 && (
                          <span className="input-valid-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M20 6L9 17l-5-5"/>
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={`form-group ${cardDetails.cvv.length >= 3 ? 'valid' : cardDetails.cvv.length > 0 ? 'invalid' : ''}`}>
                      <label>CVV <span className="required">*</span></label>
                      <div className="input-wrapper">
                        <input
                          type="password"
                          placeholder="•••"
                          maxLength="4"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                        />
                        {cardDetails.cvv.length >= 3 && (
                          <span className="input-valid-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M20 6L9 17l-5-5"/>
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentComplete && (
              <div className="payment-success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>Zahlung erfolgreich! (Demo)</span>
              </div>
            )}

            <div className="payment-demo-notice">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
              <span>Dies ist eine Demo. Es wird keine echte Zahlung durchgeführt.</span>
            </div>

            <div className="step-actions">
              <button className="btn btn-secondary" onClick={handlePrevStep}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Zurück
              </button>
              {!paymentComplete ? (
                <button
                  className="btn btn-primary btn-pay"
                  disabled={!selectedPayment || isProcessingPayment || !isCardValid()}
                  onClick={handlePayment}
                >
                  {isProcessingPayment ? (
                    <>
                      <span className="spinner"></span>
                      Wird verarbeitet...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                      Jetzt bezahlen (Demo)
                    </>
                  )}
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-next"
                  onClick={handleNextStep}
                >
                  Weiter zur Bestätigung
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Summary & Confirmation */}
        {currentStep === 4 && (
          <div className="step-content step-4">
            <h2>Buchungsübersicht</h2>

            <BookingSummary
              session={selectedSession}
              pricing={selectedPricing}
              participants={participants}
              contactInfo={contactInfo}
              courseData={courseData}
              paymentMethod={selectedPayment}
              cardDetails={selectedPayment === 'credit-card' ? cardDetails : null}
            />

            <div className="terms-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span>Ich akzeptiere die <a href="#">AGB</a> und <a href="#">Datenschutzerklärung</a></span>
              </label>
            </div>

            <div className="step-actions">
              <button className="btn btn-secondary" onClick={handlePrevStep}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Zurück
              </button>
              <button
                className="btn btn-primary btn-submit"
                onClick={handleSubmit}
                disabled={isSubmitting || !termsAccepted}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Wird gebucht...
                  </>
                ) : (
                  <>
                    Jetzt buchen
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
