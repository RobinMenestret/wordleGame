const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text, html) => {
  const msg = {
    to,
    from: process.env.EMAIL_FROM,
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`📧 Email envoyé à ${to}`);
  } catch (error) {
    console.error('⚠️ Erreur lors de l\'envoi de l\'email:', error.response ? error.response.body : error);
  }
};

module.exports = sendEmail;
