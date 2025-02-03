const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
  console.log("registering user", req.body);
  const { email, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("data encoded")
  try {
    const result = await db.query(
      'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id',
      [email, username, hashedPassword]
    );
    res.status(201).json({ message: 'User registered', userId: result.rows[0].id });
  } catch (error) {
    console.error("PostgreSQL Error : ", error)
    res.status(500).json({ error: 'Error registering user', details: error.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Get the user by the email (it's an id)
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    // Check if the password is invalid
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log("Invalid credentials")
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // In case password is valid, it create a jwt token and send it to client
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

module.exports = router;
