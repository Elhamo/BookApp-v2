import { getAuthUser, isAdmin } from '../_lib/auth.js';
import {
  createBooking,
  getAllBookings,
  getBookingsByStatus,
  getBookingsByEmail,
  getAvailableSpots,
  initDatabase
} from '../_lib/db.js';
import crypto from 'crypto';

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
function formatBookingResponse(booking) {
  return {
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
    createdAt: booking.created_at,
    contact: {
      name: `${booking.contact_first_name} ${booking.contact_last_name}`,
      email: booking.contact_email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    }
  };
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Initialize database tables
    await initDatabase();

    // GET - List bookings (admin only)
    if (req.method === 'GET') {
      const user = getAuthUser(req);
      if (!user || !isAdmin(user)) {
        return res.status(401).json({
          success: false,
          error: 'Authentifizierung erforderlich'
        });
      }

      const { status, email } = req.query;

      let bookings;
      if (status) {
        bookings = await getBookingsByStatus(status);
      } else if (email) {
        bookings = await getBookingsByEmail(email);
      } else {
        bookings = await getAllBookings();
      }

      return res.json({
        success: true,
        count: bookings.length,
        bookings: bookings.map(b => formatBookingResponse(b))
      });
    }

    // POST - Create new booking
    if (req.method === 'POST') {
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
        return res.status(400).json({ success: false, errors });
      }

      // Check availability
      const availableSpots = await getAvailableSpots(course, session.id);
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
      await createBooking(bookingData, participantsData);

      // Return success response
      return res.status(201).json({
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
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Bookings API error:', error);
    res.status(500).json({
      success: false,
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
    });
  }
}
