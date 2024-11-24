import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // ... existing login logic ...
  };

  return (
    <div className="page-wrapper">
      <div className="login-container" id="container">
        <div className="form-container log-in-container">
          <form onSubmit={handleLogin}>
            <h1>LOG IN</h1>
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
            <a href="#" className="forgot-password">Forgot your password?</a>
            <button type="submit">LOG IN</button>
            
            <div className="divider">
              <span>or</span>
            </div>
            
            <p className="register-text">
              Registering for a hub? <Link to="/page-one" className="register-link">Click here</Link>
            </p>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-right">
              <h1>WHERE SIGNS<br />SPEAK LOUDER</h1>
              <p>Welcome to MotionSync</p>
              <img src="/media/peopletalking.png" alt="People talking" className="overlay-image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;