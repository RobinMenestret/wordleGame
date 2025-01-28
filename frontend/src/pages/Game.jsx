import React, { useState, useEffect } from 'react';

function Game() {
  const [guesses, setGuesses] = useState([]);
  const [word, setWord] = useState('');

  useEffect(() => {
    // Définir un mot aléatoire pour ce jeu
    setWord('react');  // Exemple statique, à remplacer par une logique de mot aléatoire ou une API
  }, []);

  const handleGuess = (guess) => {
    setGuesses([...guesses, guess]);
  };

  return (
    <div className="game">
      <h2>Play Game</h2>
      <div>
        <input type="text" maxLength="5" className="input" />
        <button onClick={() => handleGuess('guess')}>Guess</button>
      </div>
      <div>
        {guesses.map((guess, index) => (
          <div key={index} className="guess">
            <p>{guess}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Game;
