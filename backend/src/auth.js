const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'bookapp-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

// Default admin user (in production, store in database)
const ADMIN_USERS = [
  {
    id: 1,
    username: 'admin',
    // Password: 'admin123' (hashed)
    passwordHash: '$2a$10$rQnM1jO0xL7X5r0VYz7ZOeY9KVQs3JK.NWQZ5DQXK5L5nX5nX5nX5',
    role: 'admin',
    name: 'Administrator'
  }
];

// Initialize password hash on first run
let initialized = false;
async function initializePasswords() {
  if (initialized) return;

  // Hash the default password if not already hashed properly
  const defaultPassword = 'admin123';
  ADMIN_USERS[0].passwordHash = await bcrypt.hash(defaultPassword, 10);
  initialized = true;

  console.log('Auth initialized. Default admin credentials:');
  console.log('  Username: admin');
  console.log('  Password: admin123');
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
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Find user by username
function findUserByUsername(username) {
  return ADMIN_USERS.find(u => u.username.toLowerCase() === username.toLowerCase());
}

// Login function
async function login(username, password) {
  await initializePasswords();

  const user = findUserByUsername(username);

  if (!user) {
    return { success: false, error: 'Ungültiger Benutzername oder Passwort' };
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    return { success: false, error: 'Ungültiger Benutzername oder Passwort' };
  }

  const token = generateToken(user);

  return {
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name
    }
  };
}

// Middleware to protect routes
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentifizierung erforderlich'
    });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'Ungültiges oder abgelaufenes Token'
    });
  }

  req.user = decoded;
  next();
}

// Admin-only middleware
function adminMiddleware(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin-Berechtigung erforderlich'
    });
  }
  next();
}

module.exports = {
  login,
  verifyToken,
  authMiddleware,
  adminMiddleware,
  initializePasswords
};
