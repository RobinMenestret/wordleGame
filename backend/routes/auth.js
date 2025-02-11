const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const sendEmail = require('../config/sendgrid');
const crypto = require('crypto');

// Fonction pour générer le token JWT et envoyer la réponse
const generateTokenAndRespond = (user, res) => {
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log("Token généré")
  res.json({ token, user });
};

// Inscription
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      console.log("Email déjà utilisé")
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }
    console.log("Email disponible")
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Générer un token de confirmation unique
    const emailToken = crypto.randomBytes(32).toString('hex');
    console.log("Token généré")
    // Sauvegarder l'utilisateur avec un statut "non confirmé"
    await db.query(
      'INSERT INTO users (email, username, password, email_verified, reset_token) VALUES ($1, $2, $3, $4, $5)',
      [email, username, hashedPassword, false, emailToken]
    );
    console.log("Utilisateur créé")
    // Envoyer l'email de confirmation
    const confirmationLink = `${process.env.FRONTEND_URL}/confirm/${emailToken}`;
    console.log("email envoyé !")
    await sendEmail(email, 'Confirmez votre compte', 'Cliquez sur le lien pour confirmer votre compte',
      `<p>Cliquez <a href="${confirmationLink}">ici</a> pour confirmer votre compte.</p>`);

    res.status(201).json({ message: 'Utilisateur créé. Veuillez confirmer votre email.' });

  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
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
    // Si 2FA est activé, envoyer un code par email
    if (user.two_factor_enabled) {
      const code2FA = Math.floor(100000 + Math.random() * 900000).toString();
      await db.query('UPDATE users SET two_factor_code = $1 WHERE email = $2', [code2FA, email]);

      await sendEmail(email, 'Votre code de vérification', `Votre code est : ${code2FA}`, `<p>Votre code est : <b>${code2FA}</b></p>`);

      return res.json({ message: 'Code 2FA envoyé', require2FA: true });
    }
    generateTokenAndRespond(user, res);
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

const client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

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
        'INSERT INTO users (email, username, password, two_factor_enabled, email_verified, is_google_account) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [email, username, hashedPassword, true, true, true]
      );
      user = insertResult.rows[0];
    } else {
      console.log("User already exists")
    }

    generateTokenAndRespond(user, res);

  } catch (error) {
    console.error('Error during Google authentication', error);
    res.status(500).json({ error: 'Error during Google authentication' });
  }
});

// Route de confirmation d'email
router.get('/confirm/:token', async (req, res) => {
  const { token } = req.params;
  try {
    // Vérifier si le token existe
    const result = await db.query('SELECT * FROM users WHERE reset_token = $1', [token]);
    console.log("Résultat :", result.rows);
    if (result.rows.length === 0) {
      console.log("Token invalide ou email déjà vérifié.")
      res.status(208).json({ message: 'Token invalide ou email déjà vérifié.' });
    }else{
      // Mettre à jour l'utilisateur pour confirmer l'email
      await db.query('UPDATE users SET email_verified = $1, reset_token = NULL WHERE reset_token = $2', [true, token]);
      console.log("utilisateur mis à jour")
      // res.status(200).json({ message: 'Email confirmé avec succès !' });
      let user = result.rows[0];
      user.email_verified = true;
      console.log("generateTokenAndRespond")
      //res.status(201).json({ message: 'email confirmé' });
      generateTokenAndRespond(user, res);
    }

  } catch (error) {
    console.error('Erreur lors de la confirmation de l\'email:', error);
    res.status(500).json({ error: 'Erreur lors de la confirmation de l\'email' });
  }
});

router.post('/verify-2fa', async (req, res) => {
  const { email, code } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1 AND two_factor_code = $2', [email, code]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Code invalide' });
    }

    // Générer un token et supprimer le code 2FA
    await db.query('UPDATE users SET two_factor_code = NULL WHERE email = $1', [email]);

    const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token });

  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la vérification du code 2FA' });
  }
});

// Route pour gérer la requête de mot de passe oublié
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Vérifiez si l'utilisateur existe déjà
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Générer un token de réinitialisation de mot de passe
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 heure

    // Mettre à jour l'utilisateur avec le token de réinitialisation et l'expiration
    await db.query('UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3', [resetToken, resetTokenExpiry, email]);

    // Envoyer un email avec le lien de réinitialisation de mot de passe
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendEmail(email, 'Password Reset', 'Click the link to reset your password', `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`);

    res.json({ message: 'Password reset link sent to your email (it can take 5min)' });
  } catch (error) {
    console.error('Error sending forgot password email:', error);
    res.status(500).json({ message: 'Error sending forgot password email' });
  }
});

module.exports = router;