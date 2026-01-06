import { sql } from '@vercel/postgres';

// Initialize database tables
export async function initDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      reference TEXT UNIQUE NOT NULL,
      course_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      session_day TEXT NOT NULL,
      session_time TEXT NOT NULL,
      session_title TEXT NOT NULL,
      session_type TEXT NOT NULL,
      pricing_type TEXT,
      pricing_label TEXT,
      price_per_unit REAL NOT NULL,
      total_price REAL NOT NULL,
      contact_first_name TEXT NOT NULL,
      contact_last_name TEXT NOT NULL,
      contact_email TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      contact_notes TEXT,
      status TEXT DEFAULT 'confirmed',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS participants (
      id SERIAL PRIMARY KEY,
      booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      type TEXT DEFAULT 'participant'
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS course_sessions (
      id SERIAL PRIMARY KEY,
      course_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      max_participants INTEGER DEFAULT 15,
      UNIQUE(course_id, session_id)
    )
  `;
}

// Create a new booking
export async function createBooking(bookingData, participants) {
  const { rows: [booking] } = await sql`
    INSERT INTO bookings (
      reference, course_id, session_id, session_day, session_time,
      session_title, session_type, pricing_type, pricing_label,
      price_per_unit, total_price, contact_first_name, contact_last_name,
      contact_email, contact_phone, contact_notes, status
    ) VALUES (
      ${bookingData.reference}, ${bookingData.courseId}, ${bookingData.sessionId},
      ${bookingData.sessionDay}, ${bookingData.sessionTime}, ${bookingData.sessionTitle},
      ${bookingData.sessionType}, ${bookingData.pricingType}, ${bookingData.pricingLabel},
      ${bookingData.pricePerUnit}, ${bookingData.totalPrice}, ${bookingData.contactFirstName},
      ${bookingData.contactLastName}, ${bookingData.contactEmail}, ${bookingData.contactPhone},
      ${bookingData.contactNotes}, ${bookingData.status}
    ) RETURNING id
  `;

  for (const participant of participants) {
    await sql`
      INSERT INTO participants (booking_id, name, age, type)
      VALUES (${booking.id}, ${participant.name}, ${participant.age}, ${participant.type})
    `;
  }

  return booking.id;
}

// Get booking by reference
export async function getBookingByReference(reference) {
  const { rows: [booking] } = await sql`
    SELECT * FROM bookings WHERE reference = ${reference}
  `;
  if (!booking) return null;

  const { rows: participants } = await sql`
    SELECT * FROM participants WHERE booking_id = ${booking.id}
  `;

  return { ...booking, participants };
}

// Get all bookings
export async function getAllBookings() {
  const { rows: bookings } = await sql`
    SELECT * FROM bookings ORDER BY created_at DESC
  `;

  for (const booking of bookings) {
    const { rows: participants } = await sql`
      SELECT * FROM participants WHERE booking_id = ${booking.id}
    `;
    booking.participants = participants;
  }

  return bookings;
}

// Get bookings by status
export async function getBookingsByStatus(status) {
  const { rows: bookings } = await sql`
    SELECT * FROM bookings WHERE status = ${status} ORDER BY created_at DESC
  `;

  for (const booking of bookings) {
    const { rows: participants } = await sql`
      SELECT * FROM participants WHERE booking_id = ${booking.id}
    `;
    booking.participants = participants;
  }

  return bookings;
}

// Get bookings by email
export async function getBookingsByEmail(email) {
  const { rows: bookings } = await sql`
    SELECT * FROM bookings WHERE contact_email = ${email.toLowerCase()} ORDER BY created_at DESC
  `;

  for (const booking of bookings) {
    const { rows: participants } = await sql`
      SELECT * FROM participants WHERE booking_id = ${booking.id}
    `;
    booking.participants = participants;
  }

  return bookings;
}

// Update booking status
export async function updateBookingStatus(reference, status) {
  const { rowCount } = await sql`
    UPDATE bookings SET status = ${status}, updated_at = CURRENT_TIMESTAMP
    WHERE reference = ${reference}
  `;
  return rowCount > 0;
}

// Get available spots
export async function getAvailableSpots(courseId, sessionId, maxParticipants = 15) {
  const { rows: [session] } = await sql`
    SELECT max_participants FROM course_sessions
    WHERE course_id = ${courseId} AND session_id = ${sessionId}
  `;
  const max = session?.max_participants || maxParticipants;

  const { rows: [{ count }] } = await sql`
    SELECT COUNT(*) as count FROM bookings
    WHERE course_id = ${courseId} AND session_id = ${sessionId} AND status = 'confirmed'
  `;

  return Math.max(0, max - parseInt(count));
}

// Get statistics
export async function getStatistics() {
  const { rows: [{ total_bookings }] } = await sql`SELECT COUNT(*) as total_bookings FROM bookings`;
  const { rows: [{ confirmed_bookings }] } = await sql`SELECT COUNT(*) as confirmed_bookings FROM bookings WHERE status = 'confirmed'`;
  const { rows: [{ cancelled_bookings }] } = await sql`SELECT COUNT(*) as cancelled_bookings FROM bookings WHERE status = 'cancelled'`;
  const { rows: [{ total_revenue }] } = await sql`SELECT COALESCE(SUM(total_price), 0) as total_revenue FROM bookings WHERE status = 'confirmed'`;
  const { rows: [{ total_participants }] } = await sql`
    SELECT COUNT(*) as total_participants FROM participants p
    JOIN bookings b ON p.booking_id = b.id
    WHERE b.status = 'confirmed'
  `;

  return {
    totalBookings: parseInt(total_bookings),
    confirmedBookings: parseInt(confirmed_bookings),
    cancelledBookings: parseInt(cancelled_bookings),
    totalRevenue: parseFloat(total_revenue),
    totalParticipants: parseInt(total_participants)
  };
}
