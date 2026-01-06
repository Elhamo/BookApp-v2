const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

// Import database operations
const db = require('./database');
const { login, authMiddleware, adminMiddleware, initializePasswords } = require('./auth');

// Initialize auth on startup
initializePasswords();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Generate booking reference
function generateBookingRef() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `EIS-${timestamp}-${random}`;
}

// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone
function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\+\-\(\)]{8,20}$/;
  return phoneRegex.test(phone);
}

// Format booking for API response
function formatBookingResponse(booking, includeFullDetails = false) {
  const base = {
    reference: booking.reference,
    status: booking.status,
    totalPrice: booking.total_price,
    session: {
      id: booking.session_id,
      day: booking.session_day,
      time: booking.session_time,
      title: booking.session_title,
      type: booking.session_type
    },
    participantCount: booking.participants?.length || 0,
    createdAt: booking.created_at
  };

  if (includeFullDetails) {
    return {
      ...base,
      course: booking.course_id,
      pricing: {
        type: booking.pricing_type,
        label: booking.pricing_label,
        pricePerUnit: booking.price_per_unit,
        totalPrice: booking.total_price
      },
      participants: booking.participants,
      contact: {
        firstName: booking.contact_first_name,
        lastName: booking.contact_last_name,
        name: `${booking.contact_first_name} ${booking.contact_last_name}`,
        email: booking.contact_email,
        phone: booking.contact_phone,
        notes: booking.contact_notes
      }
    };
  }

  return {
    ...base,
    contact: {
      name: `${booking.contact_first_name} ${booking.contact_last_name}`,
      email: booking.contact_email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mask email
    }
  };
}

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'BookApp API is running',
    version: '1.0.0',
    database: 'SQLite',
    timestamp: new Date().toISOString()
  });
});

// ============ AUTH ROUTES ============

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Benutzername und Passwort erforderlich'
      });
    }

    const result = await login(username, password);

    if (!result.success) {
      return res.status(401).json(result);
    }

    console.log(`User logged in: ${username}`);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Anmeldefehler'
    });
  }
});

// Verify token / Get current user
app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// ============ PROTECTED ADMIN ROUTES ============

// Get statistics (protected)
app.get('/api/stats', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const stats = db.getStatistics();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden der Statistiken'
    });
  }
});

// Get all bookings (admin - protected)
app.get('/api/bookings', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { status, email } = req.query;

    let bookings;
    if (status) {
      bookings = db.getBookingsByStatus(status);
    } else if (email) {
      bookings = db.getBookingsByEmail(email);
    } else {
      bookings = db.getAllBookings();
    }

    res.json({
      success: true,
      count: bookings.length,
      bookings: bookings.map(b => formatBookingResponse(b))
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden der Buchungen'
    });
  }
});

// Get single booking by reference (admin - protected)
app.get('/api/bookings/:reference', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const booking = db.getBookingByReference(req.params.reference);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Buchung nicht gefunden'
      });
    }

    res.json({
      success: true,
      booking: formatBookingResponse(booking, true)
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden der Buchung'
    });
  }
});

// Create new booking
app.post('/api/bookings', (req, res) => {
  try {
    const { course, session, pricing, participants, contact } = req.body;

    // Validation
    const errors = [];

    if (!course) errors.push('Kurs ist erforderlich');
    if (!session || !session.id) errors.push('Kurszeit ist erforderlich');
    if (!pricing || !pricing.price) errors.push('Preisauswahl ist erforderlich');

    if (!participants || participants.length === 0) {
      errors.push('Mindestens ein Teilnehmer ist erforderlich');
    } else {
      participants.forEach((p, i) => {
        if (!p.name || p.name.trim().length < 2) {
          errors.push(`Teilnehmer ${i + 1}: Name ist erforderlich`);
        }
        if (!p.age || p.age < 3 || p.age > 99) {
          errors.push(`Teilnehmer ${i + 1}: Gültiges Alter ist erforderlich`);
        }
      });
    }

    if (!contact) {
      errors.push('Kontaktdaten sind erforderlich');
    } else {
      if (!contact.firstName || contact.firstName.trim().length < 2) {
        errors.push('Vorname ist erforderlich');
      }
      if (!contact.lastName || contact.lastName.trim().length < 2) {
        errors.push('Nachname ist erforderlich');
      }
      if (!contact.email || !isValidEmail(contact.email)) {
        errors.push('Gültige E-Mail-Adresse ist erforderlich');
      }
      if (!contact.phone || !isValidPhone(contact.phone)) {
        errors.push('Gültige Telefonnummer ist erforderlich');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    // Check availability
    const availableSpots = db.getAvailableSpots(course, session.id);
    const requiredSpots = session.type === 'regular' ? participants.length : 1;

    if (availableSpots < requiredSpots) {
      return res.status(400).json({
        success: false,
        errors: [`Nicht genügend Plätze verfügbar. Nur noch ${availableSpots} Plätze frei.`]
      });
    }

    // Calculate total price
    let totalPrice = pricing.price;
    if (session.type === 'regular') {
      totalPrice = pricing.price * participants.length;
    }

    // Create booking data
    const bookingData = {
      reference: generateBookingRef(),
      courseId: course,
      sessionId: session.id,
      sessionDay: session.day,
      sessionTime: session.time,
      sessionTitle: session.title,
      sessionType: session.type,
      pricingType: pricing.type || null,
      pricingLabel: pricing.label || null,
      pricePerUnit: pricing.price,
      totalPrice: totalPrice,
      contactFirstName: contact.firstName.trim(),
      contactLastName: contact.lastName.trim(),
      contactEmail: contact.email.toLowerCase().trim(),
      contactPhone: contact.phone.trim(),
      contactNotes: contact.notes?.trim() || null,
      status: 'confirmed'
    };

    // Prepare participants data
    const participantsData = participants.map(p => ({
      name: p.name.trim(),
      age: parseInt(p.age),
      type: p.type || 'participant'
    }));

    // Save to database
    const bookingId = db.createBooking(bookingData, participantsData);

    console.log(`New booking created: ${bookingData.reference} (ID: ${bookingId})`);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Buchung erfolgreich erstellt',
      booking: {
        reference: bookingData.reference,
        status: bookingData.status,
        totalPrice: bookingData.totalPrice,
        session: {
          id: session.id,
          day: session.day,
          time: session.time,
          title: session.title,
          type: session.type
        },
        participantCount: participantsData.length,
        contact: {
          name: `${bookingData.contactFirstName} ${bookingData.contactLastName}`,
          email: bookingData.contactEmail
        },
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
    });
  }
});

// Cancel booking (admin - protected)
app.delete('/api/bookings/:reference', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const booking = db.getBookingByReference(req.params.reference);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Buchung nicht gefunden'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: 'Buchung wurde bereits storniert'
      });
    }

    const success = db.updateBookingStatus(req.params.reference, 'cancelled');

    if (success) {
      console.log(`Booking cancelled: ${req.params.reference}`);
      res.json({
        success: true,
        message: 'Buchung wurde storniert'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Fehler beim Stornieren der Buchung'
      });
    }
  } catch (error) {
    console.error('Cancel error:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Stornieren der Buchung'
    });
  }
});

// Get course availability
app.get('/api/courses/:courseId/availability', (req, res) => {
  try {
    const { courseId } = req.params;

    // Default sessions with their max capacities
    const sessions = [
      { id: 'fri-1515', maxParticipants: 15 },
      { id: 'fri-1615', maxParticipants: 15 },
      { id: 'sat-0910', maxParticipants: 20 },
      { id: 'sat-1015', maxParticipants: 15 },
      { id: 'sat-1115', maxParticipants: 15 }
    ];

    const availability = sessions.map(session => ({
      id: session.id,
      spotsLeft: db.getAvailableSpots(courseId, session.id, session.maxParticipants)
    }));

    res.json({
      success: true,
      courseId,
      sessions: availability
    });
  } catch (error) {
    console.error('Availability error:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden der Verfügbarkeit'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Interner Serverfehler'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint nicht gefunden'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\nBookApp API running on http://localhost:${PORT}`);
  console.log('Database: SQLite (data/bookings.db)');
  console.log('\nAvailable endpoints:');
  console.log('  GET  /                              - Health check');
  console.log('  GET  /api/stats                     - Booking statistics');
  console.log('  GET  /api/bookings                  - List all bookings');
  console.log('  GET  /api/bookings?status=confirmed - Filter by status');
  console.log('  GET  /api/bookings?email=...        - Filter by email');
  console.log('  GET  /api/bookings/:reference       - Get booking details');
  console.log('  POST /api/bookings                  - Create new booking');
  console.log('  DELETE /api/bookings/:reference     - Cancel booking');
  console.log('  GET  /api/courses/:id/availability  - Check course availability');
});
