import React from 'react';
import './assets/Landing.css';

const Landing = () => {
  const handleLogin = () => {
    // Add login logic here or navigation to login page
    console.log('Login button clicked');
  };

  return (
    <div className="landing-page">
      <img src="/media/logo.png" alt="Logo" className="logo" />
      <main className="landing-content">
      </main>
      <button className="login-button" onClick={handleLogin}>Log in as Super Admin</button>
    </div>
  );
};

export default Landing;
