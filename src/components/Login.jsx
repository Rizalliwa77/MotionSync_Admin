import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig'; // Import Firestore
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const adminCollection = collection(db, 'superAdmin'); // Reference to the admin collection
    const adminDocs = await getDocs(adminCollection); // Fetch documents from the collection

    let validCredentials = false;

    adminDocs.forEach((doc) => {
      const data = doc.data();
      if (data.username === email && data.password === password) {
        validCredentials = true; // Check for valid credentials
      }
    });

    if (validCredentials) {
      navigate('/dashboard'); // Navigate to the dashboard on successful login
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
