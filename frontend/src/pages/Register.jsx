import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alreadyUsed, setAlreadyUsed] = useState(false);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL + '/api/auth/register', { email, username, password });
      navigate('/confirm/sending-email');
    } catch (error) {
      console.error('Registration failed', error);
      setAlreadyUsed(true);
      setTimeout(() => setAlreadyUsed(false), 3000);
    }
  };

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.REACT_APP_CLIENT_GOOGLE}&redirect_uri=${process.env.REACT_APP_REDIRECT_GOOGLE}&response_type=code&scope=openid%20email%20profile`;

  return (
    <div className="register">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        { alreadyUsed ? <div><label className='invalid-login-label'>Email already used, please Sign In.</label></div> : <p></p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
        />
        <br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        <br/>
        <button type="submit" className="button">Sign Up</button>
      </form>
      <a href={googleAuthUrl} className="button">Connect with Google</a>
    </div>
  );
}

export default Register;