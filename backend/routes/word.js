const express = require('express');
const db = require('../db');

const router = express.Router();

// Vérifier si un mot de 5 lettres est présent dans la base
router.post('/check', async (req, res) => {
    const { word } = req.body;

    // Vérifier si le mot est bien une chaîne de 5 lettres
    if (!word || typeof word !== 'string' || word.length !== 5) {
        return res.status(400).json({ error: 'Invalid word. Must be a string of exactly 5 letters.' });
    }

    try {
        const result = await db.query('SELECT * FROM words WHERE word = $1', [word.toLowerCase()]);

        if (result.rows.length > 0) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
