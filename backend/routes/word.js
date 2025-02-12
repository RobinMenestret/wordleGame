const express = require('express');
const db = require('../db');

const router = express.Router();

// Vérifier si un mot est dans la base (POST)
router.post('/check', async (req, res) => {
    const { word } = req.body;

    if (!word || typeof word !== 'string' || word.length !== 5) {
        return res.status(400).json({ error: 'Invalid word. Must be a string of exactly 5 letters.' });
    }

    try {
        const result = await db.query('SELECT * FROM words WHERE word = $1', [word.toLowerCase()]);

        res.json({ exists: result.rows.length > 0 });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Récupérer un mot aléatoire (GET)
router.get('/random', async (req, res) => {
    const difficulty = req.query.difficulty;
    let result;
    try {
        if (difficulty == 'easy') {
            result = await db.query('SELECT word FROM easy_words ORDER BY RANDOM() LIMIT 1');
        }else{
            result = await db.query('SELECT word FROM words ORDER BY RANDOM() LIMIT 1');
        }

        if (result.rows.length > 0) {
            res.json({ word: result.rows[0].word });
        } else {
            res.status(404).json({ error: 'No words found in database' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
