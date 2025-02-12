import React from 'react';
import './Home.css'; // Assurez-vous d'importer le fichier CSS

function Home() {
  return (
    <div>
      <div className="home">
        <h1>Welcome to Wordle Game</h1>
        <p>This is a prototype of wordle game.</p>
        <p>You can click Play to test the game and also create your own account to save your progress!</p>
        <br/>
        <h2>How to Play</h2>
        <p>Wordle is a simple word-guessing game. Here are the rules:</p>
        <ul className='rules'>
          <li>You have six attempts to guess a five-letter word.</li>
          <li>Each guess must be a valid five-letter word.</li>
          <li>After each guess, the color of the tiles will change to show how close your guess was to the word.</li>
          <li>A green tile means the letter is in the word and in the correct position.</li>
          <li>A yellow tile means the letter is in the word but in the wrong position.</li>
          <li>A gray tile means the letter is not in the word at all.</li>
        </ul>
      </div>
      <div className="examples">
        <div className="example">
          <h2>Example game</h2>
          <img src="/example1.jpg" alt="Example game" />
        </div>
        <div className="example">
          <h2>Example of a Win</h2>
          <img src="/example2.jpg" alt="Example win" />
        </div>
        <div className="example">
          <h2>Example of a Loss</h2>
          <img src="/example3.jpg" alt="Example loss" />
        </div>
      </div>
    </div>
  );
}

export default Home;