import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/Landing.css';

const Landing = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = () => {
    // Navigate to login page
    navigate('/login'); // Use navigate instead of window.location.href
  };

  return (
    <div className="landing-page">
      <img src="/media/logo.png" alt="Logo" className="logo" />
      <main className="landing-content">
        <h1>Welcome to Our Application</h1>
        <p>Your journey starts here.</p>
      </main>
      <button className="login-button" onClick={handleLogin}>Log in as Super Admin</button>
    </div>
  );
};

export default Landing;
