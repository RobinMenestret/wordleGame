import React, { useState } from 'react';
import './Game.css';
import axios from 'axios';
import Gameboard from '../components/GameBoard';

const Game = () => {
  const API_URL = process.env.REACT_APP_API_URL

  const saveGame = async (score) => {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le local storage
    const value = score['value'];
    const word = score['word'];
    if (token != null) {
      try {
        const response = await axios.post(API_URL + '/api/game', 
          { value, word }, // Envoyer le score et le mot trouvé
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Remplacez par votre token d'authentification
            }
          }
        );
    
        console.log('Game saved:', response.data);
      } catch (error) {
        console.error('Error saving game:', error.response ? error.response.data : error.message);
      }
    }
  };
  return (
    <div className = "module">
      <Gameboard setScore = {saveGame}/>
    </div>
  );
};

export default Game;