import React from 'react'; // Importer React
import ReactDOM from 'react-dom/client'; // Importer la méthode pour rendre l'application
import App from './App'; // Importer le composant principal de l'application
import './index.css'; // Importer le fichier CSS global

// Sélectionner l'élément DOM où l'application sera rendue
const rootElement = document.getElementById('root');

// Créer un "root" React et rendre l'application dedans
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App /> {/* Rendre l'application */}
  </React.StrictMode>
);
