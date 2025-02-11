import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalidLogin, setInvalidLogin] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/settings');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL + '/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/settings');
    } catch (error) {
      console.error('Login failed', error);
      setInvalidLogin(true);
      setTimeout(() => {
        setInvalidLogin(false);
      }, 3000);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {      
      setMessage('Please enter your email address');
      setTimeout(() => {
      setMessage('');
    }, 3000);
      return;
    }

    try {
      const response = await axios.post(API_URL + '/api/auth/forgot-password', { email });
      setMessage(response.data.message);
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error sending forgot password email', error);
      setMessage('Error sending forgot password email');
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  return (
    <div className="login module">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        {invalidLogin ? <label className='invalid-login-label'>Invalid email or password</label> : <p></p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        <label className="forgot-password" onClick={handleForgotPassword} >Forgot Password ?</label>
        <br />
        <button type="submit" className="button">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
