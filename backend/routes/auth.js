const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

// Fonction pour générer le token JWT et envoyer la réponse
const generateTokenAndRespond = (user, res) => {
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user });
};

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
    const user = result.rows[0];
    generateTokenAndRespond(user, res);
  } catch (error) {
    console.error("PostgreSQL Error : ", error)
    res.status(500).json({ error: 'Error registering user', details: error.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log("Invalid credentials")
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    generateTokenAndRespond(user, res);
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

router.post("/callback", async (req, res) => {
  try {
    const code = req.body.code;
    console.log("Code :", code);

    const { tokens } = await client.getToken(code);
    const idToken = tokens.id_token;
    console.log("Tokens:", tokens);

    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const sub = payload.sub; // Identifiant unique stable
    console.log("Utilisateur :", payload);

    // Vérifiez si l'utilisateur existe déjà
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = result.rows[0];

    if (!user) {
      // Créez un nouveau compte utilisateur
      const username = payload.given_name + " " + payload.family_name;
      const hashedPassword = await bcrypt.hash(sub, 10); // Utilisez l'identifiant unique stable comme mot de passe par défaut
      const insertResult = await db.query(
        'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id',
        [email, username, hashedPassword]
      );
      user = insertResult.rows[0];
    }else{
      console.log("User already exists")
    }

    generateTokenAndRespond(user, res);

  } catch (error) {
    console.error('Error during Google authentication', error);
    res.status(500).json({ error: 'Error during Google authentication' });
  }
});

module.exports = router;