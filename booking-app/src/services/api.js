// API Service for BookApp

// In production, API is on same domain (Vercel serverless)
// In development, use local backend server
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

class ApiError extends Error {
  constructor(message, status, errors = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.error || 'Ein Fehler ist aufgetreten',
      response.status,
      data.errors || []
    );
  }

  return data;
}

// Health check
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Server nicht erreichbar', 0);
  }
}

// Create a new booking
export async function createBooking(bookingData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Verbindung zum Server fehlgeschlagen', 0);
  }
}

// Get booking by reference (admin - requires auth)
export async function getBooking(reference, authToken) {
  try {
    const headers = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    const response = await fetch(`${API_BASE_URL}/api/bookings/${reference}`, { headers });
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Verbindung zum Server fehlgeschlagen', 0);
  }
}

// Get all bookings (admin - requires auth)
export async function getAllBookings(authToken) {
  try {
    const headers = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    const response = await fetch(`${API_BASE_URL}/api/bookings`, { headers });
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Verbindung zum Server fehlgeschlagen', 0);
  }
}

// Cancel booking (admin - requires auth)
export async function cancelBooking(reference, authToken) {
  try {
    const headers = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    const response = await fetch(`${API_BASE_URL}/api/bookings/${reference}`, {
      method: 'DELETE',
      headers,
    });
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Verbindung zum Server fehlgeschlagen', 0);
  }
}

// Get course availability
export async function getCourseAvailability(courseId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/availability?courseId=${courseId}`);
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Verbindung zum Server fehlgeschlagen', 0);
  }
}

export { ApiError };
