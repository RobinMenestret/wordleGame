import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const Settings = () => {
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL

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
        setUsername(response.data.username || '');
        setEmail(response.data.email || '');
        setIs2FAEnabled(response.data.is2FAEnabled || false);
        setUser(response.data); // Mettre à jour le contexte utilisateur
      })
      .catch(error => {
        console.error("Error fetching user data", error);
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

  const handleResetPassword = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(API_URL + '/api/user/reset-password', {
        email,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      alert("Password reset email sent!");
    } catch (error) {
      console.error("Error sending password reset email", error);
    }
  };

  return (
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
      <div>
        <label htmlFor="email">Email: </label>
        <input
          type="email"
          id="email"
          value={email}
          disabled
        />
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
  );
}

export default Settings;
