const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');

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
    const result = await db.query('SELECT email, username, two_factor_enabled, email_verified, is_google_account FROM users WHERE id = $1', [req.userId]);
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

// Route pour réinitialiser le mot de passe
router.post('/reset-password', authenticate, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // Récupérer l'utilisateur à partir de l'ID utilisateur dans le token
    const result = await db.query('SELECT * FROM users WHERE id = $1', [req.userId]);
    const user = result.rows[0];

    // Vérifier si l'ancien mot de passe est correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.userId]);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

// Route pour réinitialiser le mot de passe avec un token
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Récupérer l'utilisateur à partir du token de réinitialisation
    const result = await db.query('SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > $2', [token, Date.now()]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe de l'utilisateur et supprimer le token de réinitialisation
    await db.query('UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2', [hashedPassword, user.id]);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password with token:', error);
    res.status(500).json({ message: 'Error resetting password with token' });
  }
});

// Route pour supprimer le compte utilisateur
router.delete('/', authenticate, async (req, res) => {
  try {
    // Supprimer l'utilisateur de la base de données
    await db.query('DELETE FROM users WHERE id = $1', [req.userId]);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Error deleting account' });
  }
});

module.exports = router;