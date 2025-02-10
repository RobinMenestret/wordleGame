const sendEmail = require('./config/sendgrid');

sendEmail('robin.menestret@gmail.com', 'Test SendGrid', 'Ceci est un test', '<p>Ceci est un test</p>')
  .then(() => console.log('✅ Email envoyé'))
  .catch((err) => console.error('❌ Erreur envoi email:', err));
