import React, { useState } from 'react';
import axios from 'axios';

const RandomWordButton = () => {
  const [word, setWord] = useState('');

  const fetchRandomWord = async () => {
    console.log('📡 Envoi de la requête pour récupérer un mot aléatoire...');
    
    try {
      const response = await axios.get('http://localhost:4000/api/word/random');
      
      console.log('✅ Mot reçu:', response.data.word);
      setWord(response.data.word);
    } catch (error) {
      console.error('⚠️ Erreur lors de la récupération du mot:', error);
    }
  };

  return (
    <div>
      <button align="center" onClick={fetchRandomWord}>Play</button>
    </div>
  );
};

export default RandomWordButton;
