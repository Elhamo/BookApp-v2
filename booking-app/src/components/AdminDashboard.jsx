import { useState, useEffect } from 'react';
import { getAllBookings, getBooking, cancelBooking } from '../services/api';
import StatsCards from './StatsCards';
import BookingsTable from './BookingsTable';
import BookingModal from './BookingModal';
import '../styles/AdminDashboard.css';

export default function AdminDashboard({ onBack, onLogout, authToken, authUser }) {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllBookings(authToken);
      setBookings(response.bookings || []);

      // Calculate stats from bookings
      const confirmed = response.bookings.filter(b => b.status === 'confirmed');
      const cancelled = response.bookings.filter(b => b.status === 'cancelled');
      const totalRevenue = confirmed.reduce((sum, b) => sum + b.totalPrice, 0);
      const totalParticipants = confirmed.reduce((sum, b) => sum + b.participantCount, 0);

      setStats({
        totalBookings: response.bookings.length,
        confirmedBookings: confirmed.length,
        cancelledBookings: cancelled.length,
        totalRevenue,
        totalParticipants
      });

      setError(null);
    } catch (err) {
      setError('Fehler beim Laden der Buchungen');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchBookings();
    }
  }, [authToken]);

  // View booking details
  const handleViewBooking = async (reference) => {
    try {
      const response = await getBooking(reference, authToken);
      setSelectedBooking(response.booking);
    } catch (err) {
      setError('Fehler beim Laden der Buchungsdetails');
    }
  };

  // Cancel booking
  const handleCancelBooking = async (reference) => {
    if (!confirm('Möchten Sie diese Buchung wirklich stornieren?')) return;

    try {
      await cancelBooking(reference, authToken);
      await fetchBookings();
      setSelectedBooking(null);
    } catch (err) {
      setError('Fehler beim Stornieren der Buchung');
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = searchTerm === '' ||
      booking.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Zurück
          </button>
          <h1>Admin Dashboard</h1>
        </div>
        <div className="header-right">
          {authUser && (
            <span className="user-info">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {authUser.name}
            </span>
          )}
          <button className="refresh-btn" onClick={fetchBookings} disabled={loading}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={loading ? 'spinning' : ''}>
              <path d="M23 4v6h-6M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Aktualisieren
          </button>
          <button className="logout-btn" onClick={onLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Abmelden
          </button>
        </div>
      </header>

      {error && (
        <div className="error-message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {stats && <StatsCards stats={stats} />}

      <div className="bookings-section">
        <div className="section-header">
          <h2>Buchungen</h2>
          <div className="filters">
            <div className="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-tabs">
              <button
                className={filter === 'all' ? 'active' : ''}
                onClick={() => setFilter('all')}
              >
                Alle ({bookings.length})
              </button>
              <button
                className={filter === 'confirmed' ? 'active' : ''}
                onClick={() => setFilter('confirmed')}
              >
                Bestätigt ({bookings.filter(b => b.status === 'confirmed').length})
              </button>
              <button
                className={filter === 'cancelled' ? 'active' : ''}
                onClick={() => setFilter('cancelled')}
              >
                Storniert ({bookings.filter(b => b.status === 'cancelled').length})
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Buchungen werden geladen...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            <p>Keine Buchungen gefunden</p>
          </div>
        ) : (
          <BookingsTable
            bookings={filteredBookings}
            onView={handleViewBooking}
            onCancel={handleCancelBooking}
          />
        )}
      </div>

      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onCancel={handleCancelBooking}
        />
      )}
    </div>
  );
}
