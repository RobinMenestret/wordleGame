import React, { useState } from 'react';
import './Game.css';

const Game = () => {
  const [grid, setGrid] = useState(Array(6).fill(Array(5).fill('')));
  const [error, setError] = useState('');

  const handleChange = (e, rowIndex, colIndex) => {
    const value = e.target.value.toUpperCase();
    const newGrid = grid.map((row, rIdx) => 
      row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === colIndex ? value : cell))
    );
    setGrid(newGrid);

    if (value && colIndex < 4) {
      document.getElementById(`cell-${rowIndex}-${colIndex + 1}`).focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const firstRow = grid[0];
      if (firstRow.every(cell => cell !== '')) {
        const word = firstRow.join('');
        sendWord(word);
        setError('');
      } else {
        setError('All cells in the first row must be filled.');
      }
    }
  };

  const sendWord = async (word) => {
    try {
      const response = await fetch('/api/submit-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word }),
      });
      const data = await response.json();
      console.log('Word submitted:', data);
    } catch (error) {
      console.error('Error submitting word:', error);
    }
  };

  return (
    <div className="game" onKeyDown={handleKeyDown} tabIndex="0">
      <h2>Play Game</h2>
      {error && <p className="error">{error}</p>}
      <table>
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <input
                    id={`cell-${rowIndex}-${colIndex}`}
                    type="text"
                    maxLength="1"
                    value={cell}
                    onChange={(e) => handleChange(e, rowIndex, colIndex)}
                    className="input"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Game;