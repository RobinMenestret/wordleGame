import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const Settings = () => {
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [games, setGames] = useState([]); // État pour stocker les jeux
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Charger les informations de l'utilisateur connecté depuis l'API
    const token = localStorage.getItem('token');
    if (token) {
      console.log("Someone is logged in");
      axios.get(API_URL + '/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then(response => {
          console.log(response.data);
          setUsername(response.data.username || '');
          setEmail(response.data.email || '');
          setIs2FAEnabled(response.data.two_factor_enabled || false);
          setEmailVerified(response.data.email_verified);
          setUser(response.data); // Mettre à jour le userContext

          // Requête pour récupérer les jeux de l'utilisateur
          return axios.get(API_URL + '/api/game', {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
        })
        .then(response => {
          setGames(response.data); // Mettre à jour l'état des jeux
        })
        .catch(error => {
          console.error("Error fetching user data or games", error);
        });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(API_URL + '/api/user', {
        username,
        is2FAEnabled,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings", error);
    }
  };

  const handleResetPassword = () => {
    navigate('/reset-password');
  };

  return (
    <div className="module">
      <div className="settings">
        <h1>Settings</h1>
        <div>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            value={email}
            disabled
            style={{ marginLeft: '10px' }}
          />
          {emailVerified ? (
            <span style={{ color: 'green', marginLeft: '10px' }}>Verified</span>
          ) : (
            <span style={{ color: 'red', marginLeft: '10px' }}>Not Verified</span>
          )}
        </div>
        <div>
          <label htmlFor="2fa">Enable 2FA: </label>
          <input
            type="checkbox"
            id="2fa"
            checked={is2FAEnabled}
            onChange={(e) => setIs2FAEnabled(e.target.checked)}
          />
        </div>
        <button onClick={handleSave}>Save Settings</button>
        <button onClick={handleResetPassword}>Reset Password</button>
      </div>
      <div>
        <div className="scoreboard">
          <h2>Statistics</h2>
          {games.length === 0 ? (
            <p>No games played yet.</p>
          ) : (
            <ul className="game-list">
              {games.map((game, index) => (
                <li key={index} className="game-item">
                  <span className="game-score"><b>Score</b> {game.score}</span>
                  <span className="game-date"><b>Date:</b> {new Date(game.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;