const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Database file path
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'bookings.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Create tables FIRST
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    type TEXT DEFAULT 'participant',
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS course_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    max_participants INTEGER DEFAULT 15,
    UNIQUE(course_id, session_id)
  )
`);

// Create indexes
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(reference);
  CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(contact_email);
  CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
  CREATE INDEX IF NOT EXISTS idx_bookings_course ON bookings(course_id, session_id);
  CREATE INDEX IF NOT EXISTS idx_participants_booking ON participants(booking_id);
`);

console.log('Database initialized successfully at:', DB_PATH);

// NOW prepare statements (after tables exist)
const statements = {
  // Bookings
  insertBooking: db.prepare(`
    INSERT INTO bookings (
      reference, course_id, session_id, session_day, session_time,
      session_title, session_type, pricing_type, pricing_label,
      price_per_unit, total_price, contact_first_name, contact_last_name,
      contact_email, contact_phone, contact_notes, status
    ) VALUES (
      @reference, @courseId, @sessionId, @sessionDay, @sessionTime,
      @sessionTitle, @sessionType, @pricingType, @pricingLabel,
      @pricePerUnit, @totalPrice, @contactFirstName, @contactLastName,
      @contactEmail, @contactPhone, @contactNotes, @status
    )
  `),

  getBookingByReference: db.prepare(`
    SELECT * FROM bookings WHERE reference = ?
  `),

  getBookingById: db.prepare(`
    SELECT * FROM bookings WHERE id = ?
  `),

  getAllBookings: db.prepare(`
    SELECT * FROM bookings ORDER BY created_at DESC
  `),

  getBookingsByStatus: db.prepare(`
    SELECT * FROM bookings WHERE status = ? ORDER BY created_at DESC
  `),

  getBookingsByEmail: db.prepare(`
    SELECT * FROM bookings WHERE contact_email = ? ORDER BY created_at DESC
  `),

  updateBookingStatus: db.prepare(`
    UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE reference = ?
  `),

  // Participants
  insertParticipant: db.prepare(`
    INSERT INTO participants (booking_id, name, age, type)
    VALUES (@bookingId, @name, @age, @type)
  `),

  getParticipantsByBookingId: db.prepare(`
    SELECT * FROM participants WHERE booking_id = ?
  `),

  // Course sessions
  upsertCourseSession: db.prepare(`
    INSERT INTO course_sessions (course_id, session_id, max_participants)
    VALUES (@courseId, @sessionId, @maxParticipants)
    ON CONFLICT(course_id, session_id) DO UPDATE SET max_participants = @maxParticipants
  `),

  getSessionBookingCount: db.prepare(`
    SELECT COUNT(*) as count FROM bookings
    WHERE course_id = ? AND session_id = ? AND status = 'confirmed'
  `),

  getCourseSession: db.prepare(`
    SELECT * FROM course_sessions WHERE course_id = ? AND session_id = ?
  `)
};

// Database operations
const dbOperations = {
  // Create a new booking with participants (transaction)
  createBooking: (bookingData, participants) => {
    const insertBookingAndParticipants = db.transaction((booking, parts) => {
      // Insert booking
      const result = statements.insertBooking.run({
        reference: booking.reference,
        courseId: booking.courseId,
        sessionId: booking.sessionId,
        sessionDay: booking.sessionDay,
        sessionTime: booking.sessionTime,
        sessionTitle: booking.sessionTitle,
        sessionType: booking.sessionType,
        pricingType: booking.pricingType || null,
        pricingLabel: booking.pricingLabel || null,
        pricePerUnit: booking.pricePerUnit,
        totalPrice: booking.totalPrice,
        contactFirstName: booking.contactFirstName,
        contactLastName: booking.contactLastName,
        contactEmail: booking.contactEmail,
        contactPhone: booking.contactPhone,
        contactNotes: booking.contactNotes || null,
        status: booking.status || 'confirmed'
      });

      const bookingId = result.lastInsertRowid;

      // Insert participants
      for (const participant of parts) {
        statements.insertParticipant.run({
          bookingId: bookingId,
          name: participant.name,
          age: participant.age,
          type: participant.type || 'participant'
        });
      }

      return bookingId;
    });

    return insertBookingAndParticipants(bookingData, participants);
  },

  // Get booking by reference with participants
  getBookingByReference: (reference) => {
    const booking = statements.getBookingByReference.get(reference);
    if (!booking) return null;

    const participants = statements.getParticipantsByBookingId.all(booking.id);
    return { ...booking, participants };
  },

  // Get all bookings with participants
  getAllBookings: () => {
    const bookings = statements.getAllBookings.all();
    return bookings.map(booking => {
      const participants = statements.getParticipantsByBookingId.all(booking.id);
      return { ...booking, participants };
    });
  },

  // Get bookings by status
  getBookingsByStatus: (status) => {
    const bookings = statements.getBookingsByStatus.all(status);
    return bookings.map(booking => {
      const participants = statements.getParticipantsByBookingId.all(booking.id);
      return { ...booking, participants };
    });
  },

  // Get bookings by email
  getBookingsByEmail: (email) => {
    const bookings = statements.getBookingsByEmail.all(email.toLowerCase());
    return bookings.map(booking => {
      const participants = statements.getParticipantsByBookingId.all(booking.id);
      return { ...booking, participants };
    });
  },

  // Update booking status
  updateBookingStatus: (reference, status) => {
    const result = statements.updateBookingStatus.run(status, reference);
    return result.changes > 0;
  },

  // Get available spots for a session
  getAvailableSpots: (courseId, sessionId, maxParticipants = 15) => {
    const session = statements.getCourseSession.get(courseId, sessionId);
    const max = session?.max_participants || maxParticipants;
    const { count } = statements.getSessionBookingCount.get(courseId, sessionId);
    return Math.max(0, max - count);
  },

  // Set max participants for a session
  setSessionCapacity: (courseId, sessionId, maxParticipants) => {
    statements.upsertCourseSession.run({
      courseId,
      sessionId,
      maxParticipants
    });
  },

  // Get booking statistics
  getStatistics: () => {
    const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
    const confirmedBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed'").get().count;
    const cancelledBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'cancelled'").get().count;
    const totalRevenue = db.prepare("SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE status = 'confirmed'").get().total;
    const totalParticipants = db.prepare(`
      SELECT COUNT(*) as count FROM participants p
      JOIN bookings b ON p.booking_id = b.id
      WHERE b.status = 'confirmed'
    `).get().count;

    return {
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      totalRevenue,
      totalParticipants
    };
  }
};

module.exports = {
  db,
  ...dbOperations
};
