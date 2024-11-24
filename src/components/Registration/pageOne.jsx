import React from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/Registration/pageOne.css";
import phoneImage from "../../assets/media/phone.png";
import motionSyncLogo from "../../assets/media/motionsync.png";

const PageOne = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/registration-one');
  };

  return (
    <div className="page-container">
      <div className="left-section">
        <div className="alpha-badge">We launched our Alpha Test App</div>
        <h1>Where Signs<br />Speak Louder</h1>
        <p className="description">
          <strong>MotionSync</strong> is a mobile app that offers real-time sign language
          translation and learning tools, promoting inclusivity for
          speech-impaired individuals and supporting educators.
        </p>
        <p className="sub-description">
          The app fosters inclusivity in education, offering personalized
          support and community engagement for learning experiences.
        </p>
        <button className="register-button" onClick={handleRegisterClick}>Register now as Hub</button>
      </div>
      <div className="right-section">
        <button className="download-button">Download the app</button>
        <div className="phone-mockup">
          <img src={phoneImage} alt="Phone Displaying App" />
        </div>
      </div>
    </div>
  );
};

export default PageOne;