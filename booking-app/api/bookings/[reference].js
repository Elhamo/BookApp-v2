import { getAuthUser, isAdmin } from '../_lib/auth.js';
import { getBookingByReference, updateBookingStatus, initDatabase } from '../_lib/db.js';

// Format booking for API response (full details)
function formatBookingResponse(booking) {
  return {
    reference: booking.reference,
    status: booking.status,
    totalPrice: booking.total_price,
    course: booking.course_id,
    session: {
      id: booking.session_id,
      day: booking.session_day,
      time: booking.session_time,
      title: booking.session_title,
      type: booking.session_type
    },
    pricing: {
      type: booking.pricing_type,
      label: booking.pricing_label,
      pricePerUnit: booking.price_per_unit,
      totalPrice: booking.total_price
    },
    participants: booking.participants,
    participantCount: booking.participants?.length || 0,
    contact: {
      firstName: booking.contact_first_name,
      lastName: booking.contact_last_name,
      name: `${booking.contact_first_name} ${booking.contact_last_name}`,
      email: booking.contact_email,
      phone: booking.contact_phone,
      notes: booking.contact_notes
    },
    createdAt: booking.created_at
  };
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const user = getAuthUser(req);
  if (!user || !isAdmin(user)) {
    return res.status(401).json({
      success: false,
      error: 'Authentifizierung erforderlich'
    });
  }

  const { reference } = req.query;

  try {
    // Initialize database tables
    await initDatabase();

    // GET - Get single booking
    if (req.method === 'GET') {
      const booking = await getBookingByReference(reference);

      if (!booking) {
        return res.status(404).json({
          success: false,
          error: 'Buchung nicht gefunden'
        });
      }

      return res.json({
        success: true,
        booking: formatBookingResponse(booking)
      });
    }

    // DELETE - Cancel booking
    if (req.method === 'DELETE') {
      const booking = await getBookingByReference(reference);

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

      const success = await updateBookingStatus(reference, 'cancelled');

      if (success) {
        return res.json({
          success: true,
          message: 'Buchung wurde storniert'
        });
      } else {
        return res.status(500).json({
          success: false,
          error: 'Fehler beim Stornieren der Buchung'
        });
      }
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Booking API error:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden der Buchung'
    });
  }
}
