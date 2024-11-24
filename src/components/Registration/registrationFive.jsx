import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../assets/Registration/RegistrationFive.css";

const RegistrationFive = () => {
  const navigate = useNavigate();

  return (
    <div className="completion-container">
      <div className="completion-card">
        <div className="completion-content">
          <div className="header-section">
            <div className="title-container">
              <h1>THANK YOU FOR REGISTERING WITH</h1>
              <h1 className="motionsync-text">MOTIONSYNC!</h1>
            </div>
            <p className="submission-status">
              Your registration has been successfully submitted.
            </p>
          </div>

          <div className="steps-section">
            <div className="step">
              <div className="step-header">
                <span className="step-number">1</span>
                <h2>Payment Confirmation</h2>
              </div>
              <p>If you have completed your payment, please ensure that your payment receipt has been uploaded using the provided form.</p>
            </div>

            <div className="step">
              <div className="step-header">
                <span className="step-number">2</span>
                <h2>Processing Time</h2>
              </div>
              <ul>
                <li>Our team will review your submission and payment receipt within 7-14 days.</li>
                <li>You will be notified via email once your partnership has been approved.</li>
              </ul>
            </div>

            <div className="step">
              <div className="step-header">
                <span className="step-number">3</span>
                <h2>Next Steps</h2>
              </div>
              <p>Once approved, you will receive full access to our platform, including the EduMode feature, to start utilizing MotionSync.</p>
            </div>
          </div>

          <div className="support-info">
            <p>
              If you have any questions or need assistance, feel free to contact our support team at{' '}
              <a href="mailto:support@motionsync.com">support@motionsync.com</a>
            </p>
            <p className="thank-you">
              Thank you once again for joining us in making sign language education more accessible!
            </p>
          </div>

          <button onClick={() => navigate('/')} className="exit-button">
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFive;
