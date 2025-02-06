import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Game from './pages/Game';
import Navbar from './components/Navbar';
import { UserProvider } from './UserContext';

function App() {
  const [username, setUsername] = React.useState('');
  return (
    <UserProvider>
      <Router>
        <Navbar username={username} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
