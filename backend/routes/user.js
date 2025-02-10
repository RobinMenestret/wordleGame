const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

// Middleware pour vérifier le JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Récupérer les informations utilisateur
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await db.query('SELECT email, username, two_factor_enabled, email_verified FROM users WHERE id = $1', [req.userId]);
    console.log('User data fetched:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

// Modifier le nom d'utilisateur et l'état du 2FA
router.put('/', authenticate, async (req, res) => {
  const { username, is2FAEnabled } = req.body;

  try {
    await db.query('UPDATE users SET username = $1, two_factor_enabled = $2 WHERE id = $3', [username, is2FAEnabled, req.userId]);
    console.log('Username updated to:', username, 'and 2FA status updated to:', is2FAEnabled, 'for user ID:', req.userId);
    res.json({ message: 'Username and 2FA status updated' });
  } catch (error) {
    console.error('Error updating username and 2FA status:', error);
    res.status(500).json({ error: 'Error updating username and 2FA status' });
  }
});

module.exports = router;