import { getAuthUser, isAdmin } from './_lib/auth.js';
import { getStatistics, initDatabase } from './_lib/db.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const user = getAuthUser(req);
  if (!user || !isAdmin(user)) {
    return res.status(401).json({
      success: false,
      error: 'Authentifizierung erforderlich'
    });
  }

  try {
    await initDatabase();
    const stats = await getStatistics();

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
}
