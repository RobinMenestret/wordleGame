const express = require('express');
const db = require('../db');
const authenticate = require('../middlewares/authenticate'); // Correct import

const router = express.Router();

// Enregistrer une partie
router.post('/', authenticate, async (req, res) => {
  const { value, word } = req.body;
  console.log('Game received with score : ', value, ' and word : ', word);
  try {
    await db.query('INSERT INTO games (user_id, score, searched_word) VALUES ($1, $2, $3)', [req.userId, value, word]);
    console.log('Game saved with score : ', value, ' and word : ', word);
    res.status(201).json({ message: 'Game saved' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving game' });
  }
});

// Récupérer les statistiques
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM games WHERE user_id = $1', [req.userId]);
    console.log("results fetched : ", result.rows);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching games' });
  }
});

module.exports = router;
