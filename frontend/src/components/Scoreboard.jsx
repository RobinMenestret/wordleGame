import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Scoreboard() {
  const [userStats, setUserStats] = useState({
    gamesPlayed: 0,
    wins: 0,
    winRate: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:4000/api/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then(response => {
        setUserStats(response.data);
      })
      .catch(error => {
        console.error("Error fetching user stats", error);
      });
    }
  }, []);

  return (
    <div className="scoreboard">
      <h2>Your Stats</h2>
      <p><strong>Games Played:</strong> {userStats.gamesPlayed}</p>
      <p><strong>Wins:</strong> {userStats.wins}</p>
      <p><strong>Win Rate:</strong> {userStats.winRate}%</p>
    </div>
  );
}

export default Scoreboard;
