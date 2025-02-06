import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; 
import { UserContext } from '../UserContext';

function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item"><Link to="/">Home</Link></li>
        <li className="navbar-item"><Link to="/game">Play</Link></li>
        {user && <li className="navbar-item"><Link to="/settings">Settings</Link></li>}
        <li className="navbar-item"><Link to="/login">Sign In</Link></li>
        <li className="navbar-item"><Link to="/register">Sign Up</Link></li>
        {user && (
          <li className="navbar-item">
            <div className="navbar-name" onClick={toggleDropdown}>
              <p>{user.username.toUpperCase()}</p>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;