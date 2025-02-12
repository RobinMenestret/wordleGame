import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GameBoard.css';

const GameBoard = ({ setScore }) => {
    const [grid, setGrid] = useState(Array(6).fill(Array(5).fill('')));
    const [error, setError] = useState('');
    const [count, setCount] = useState(0);
    const [wordCompare, setWordCompare] = useState(Array(6).fill(Array(5).fill(3)));
    const [targetWord, setTargetWord] = useState('');
    const [lose, setlose] = useState(false);
    const [win, setWin] = useState(false);
    const [invalidWord, setInvalidWord] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL
    console.log('api url', API_URL)

    const fetchRandomWord = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/word/random`, { withCredentials: true });

            console.log("The target word is : ", response.data.word)

            setTargetWord(response.data.word);
        } catch (error) {
            console.error('⚠️ Erreur lors de la récupération du mot:', error);
        }
    }
    const newGame = () => {
        fetchRandomWord();
        setGrid(Array(6).fill(Array(5).fill('')));
        setWordCompare(Array(6).fill(Array(5).fill(3)));
        setCount(0);
        setlose(false);
        setWin(false);
        setInvalidWord(false);
    }
    useEffect(() => {
        if (count === 0) {
            fetchRandomWord();
        }
        if (count <= 5 && !win) {
            document.getElementById(`cell-${count}-${0}`).focus();
        } else if (!win) {
            setlose(true);
            setScore({ 'value': 0, 'word': targetWord })
        }
    }, [count]);

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
            const row = grid[count];
            if (row.every(cell => cell !== '')) {
                const word = row.join('');
                handleCheckWord(word);
                setError('');
            } else {
                setError('All cells in the first row must be filled.');
            }
        }
        if (e.key === 'Backspace' && document.activeElement.tagName === 'INPUT' && document.activeElement.value === '') {
            const focusedCell = document.activeElement;
            const [rowIndex, colIndex] = focusedCell.id.split('-').slice(1).map(Number);
            if (colIndex > 0) {
                document.getElementById(`cell-${rowIndex}-${colIndex - 1}`).focus();
            }
        }
    };

    const handleCheckWord = async (word) => {
        console.log(`Vérification du mot : "${word}"`);

        try {
            console.log('Envoi de la requête à l\'API...');
            const response = await axios.post(`${API_URL}/api/word/check`, { word }, { withCredentials: true });

            console.log('Réponse reçue de l\'API :', response.data);

            if (response.data.exists) {
                console.log('✔️ Le mot est valide !');
                const wordCompareResult = compareWords(word);
                const newWordCompare = [...wordCompare];
                newWordCompare[count] = wordCompareResult;
                if (wordCompareResult.every(cell => cell === 2)) {
                    setWin(true);
                    setScore({ 'value': 6 - count, 'word': targetWord })
                }
                setWordCompare(newWordCompare);
                setCount(count + 1)
            } else {
                console.log('❌ Le mot n\'est pas dans la liste.');
                setInvalidWord(true);
                setTimeout(() => setInvalidWord(false), 1000);
            }
        } catch (error) {
            console.error('⚠️ Erreur lors de la requête:', error);
        }
    };
    const compareWords = (word) => {
        const wordCompare = [3, 3, 3, 3, 3]; // 0 = incorrect, 1 = not in place, 2 = correct
        const targetWordArray = targetWord.split('');
        const wordArray = word.split('');
        for (let i = 0; i < 5; i++) {
            //console.log(targetWordArray[i], wordArray[i])
            if (targetWordArray[i] === wordArray[i].toLowerCase()) {
                wordCompare[i] = 2;
            }
        }
        let targetTemp = targetWordArray;
        for (let i = 0; i < 5; i++) {
            if (wordCompare[i] !== 2) {
                wordCompare[i] = 0;
                for (let j = 0; j < 5; j++) {
                    if (wordCompare[j] !== 2) {
                        if (targetTemp[j] === wordArray[i].toLowerCase()) {
                            wordCompare[i] = 1;
                            targetTemp[j] = '';
                            break;
                        }
                    }
                }
            }
        }
        return wordCompare;
    };

        return (
            <div>
                <center>
                    <button align="center" onClick={newGame}>New Game</button>
                </center>
                <div className="game" onKeyDown={handleKeyDown} tabIndex="0">
                    {error && <p className="error">{error}</p>}
                    <table width="300px">
                        <tbody>
                            {grid.map((row, rowIndex) => (
                                <tr key={rowIndex} className={invalidWord && rowIndex === count ? 'invalid-row' : ''}>
                                    {row.map((cell, colIndex) => (
                                        <td key={colIndex}>
                                            <input
                                                id={`cell-${rowIndex}-${colIndex}`}
                                                type="text"
                                                maxLength="1"
                                                value={cell}
                                                onChange={(e) => handleChange(e, rowIndex, colIndex)}
                                                disabled={rowIndex !== count || lose || win}
                                                className={`game-input ${wordCompare[rowIndex][colIndex] === 2 ? 'correct' : wordCompare[rowIndex][colIndex] === 1 ? 'misplaced' : wordCompare[rowIndex][colIndex] === 0 ? 'incorrect' : 'unknown'}`}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {win ? <div><p className="win-label">🎉🎉 Win! 🎉🎉</p><p className="win-label">Your score is {7 - count}/6</p></div> : <p></p>}
                    {lose ? <p className="lose-label">😈😈 Game Over! 😈😈 <br /> The target word word was {targetWord.toUpperCase()} </p> : <p></p>}
                </div>
            </div>
        );
    };

    export default GameBoard;