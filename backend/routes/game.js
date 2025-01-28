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
    const result = await db.query('SELECT email, username FROM users WHERE id = $1', [req.userId]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

// Modifier le nom d'utilisateur
router.put('/', authenticate, async (req, res) => {
  const { username } = req.body;

  try {
    await db.query('UPDATE users SET username = $1 WHERE id = $2', [username, req.userId]);
    res.json({ message: 'Username updated' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating username' });
  }
});

module.exports = router;
