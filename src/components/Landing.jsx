import React from 'react';
import { useNavigate } from 'react-router-dom';
import MotionSyncLogo from '../assets/media/motionsync.png';
import '../styles/Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="logo-container">
        <img src={MotionSyncLogo} alt="MotionSync Logo" className="logo" />
      </div>
      
      <h1 className="main-title">
        Where Signs<br />
        Speak Louder
      </h1>
      
      <button 
        className="login-button"
        onClick={() => navigate('/login')}
      >
        Log in as Admin
      </button>
      
      <div className="background-image">
        <img src="/media/peopletalking.png" alt="People talking" />
      </div>
    </div>
  );
};

export default Landing;