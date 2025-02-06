import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalidLogin, setInvalidLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/Settings');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/Settings');
    } catch (error) {
      console.error('Login failed', error);
      setInvalidLogin(true);
      setTimeout(() => {
        setInvalidLogin(false);
      }, 3000);
    }
  };

  return (
    <div className="login">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        { invalidLogin ? <label className='invalid-login-label'>invalid email or password</label> : <p></p>}
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
        <br />
        <button type="submit" className="button">Login</button>
      </form>
    </div>
  );
}

export default Login;
