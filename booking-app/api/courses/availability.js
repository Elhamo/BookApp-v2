import { getAvailableSpots, initDatabase } from '../_lib/db.js';

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

  const { courseId } = req.query;

  if (!courseId) {
    return res.status(400).json({
      success: false,
      error: 'Course ID is required'
    });
  }

  try {
    await initDatabase();

    // Default sessions with their max capacities
    const sessions = [
      { id: 'fri-1515', maxParticipants: 15 },
      { id: 'fri-1615', maxParticipants: 15 },
      { id: 'sat-0910', maxParticipants: 20 },
      { id: 'sat-1015', maxParticipants: 15 },
      { id: 'sat-1115', maxParticipants: 15 }
    ];

    const availability = [];
    for (const session of sessions) {
      const spotsLeft = await getAvailableSpots(courseId, session.id, session.maxParticipants);
      availability.push({
        id: session.id,
        spotsLeft
      });
    }

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
}
