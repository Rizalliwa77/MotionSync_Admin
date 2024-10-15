import React from 'react';
import '../styles/Landing.css';

const Landing = () => {
  const handleLogin = () => {
    // Navigate to login page
    window.location.href = '/login'; // Redirect to login page
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
