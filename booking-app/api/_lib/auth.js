import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'bookapp-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

// Admin user (in production, store in database)
const ADMIN_USER = {
  id: 1,
  username: 'admin',
  password: 'admin123',
  role: 'admin',
  name: 'Administrator'
};

// Hash password
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// Verify password
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Generate JWT token
function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Login function
export async function login(username, password) {
  if (username.toLowerCase() !== ADMIN_USER.username.toLowerCase()) {
    return { success: false, error: 'Ungültiger Benutzername oder Passwort' };
  }

  // For demo, compare plain password
  if (password !== ADMIN_USER.password) {
    return { success: false, error: 'Ungültiger Benutzername oder Passwort' };
  }

  const token = generateToken(ADMIN_USER);

  return {
    success: true,
    token,
    user: {
      id: ADMIN_USER.id,
      username: ADMIN_USER.username,
      role: ADMIN_USER.role,
      name: ADMIN_USER.name
    }
  };
}

// Auth middleware helper
export function getAuthUser(req) {
  const authHeader = req.headers.authorization || req.headers['Authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyToken(token);
}

// Check if user is admin
export function isAdmin(user) {
  return user?.role === 'admin';
}
