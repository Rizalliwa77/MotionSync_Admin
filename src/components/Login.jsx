import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'Admin' && password === 'Admin123') {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container" id="container">
      <div className="form-container log-in-container">
        <form onSubmit={handleLogin}>
          <h1>Log In</h1>
          {error && <p className="error-message">{error}</p>}
          <input
            type="text"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <a href="#">Forgot your password?</a>
          <button type="submit">Log In</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-right">
            <h1>Where Signs Speak Louder</h1>
            <p>Welcome to MotionSync</p>
            <img src="/media/peopletalking.png" alt="People talking" className="overlay-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
