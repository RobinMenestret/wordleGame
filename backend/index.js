const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware

// Configuration CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/game', require('./routes/game'));
app.use('/api/word', require('./routes/word'));


// Route de test pour vérifier que le serveur répond
app.get('/test', (req, res) => {
  console.log("le test de connexion au serveur fonctionne.");
  res.status(200).json({ message: 'Le serveur répond correctement !' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
