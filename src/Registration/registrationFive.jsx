import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "./registrationFive.css";
import MotionSyncLogo from "../assets/media/motionsync.png";

const RegistrationFive = () => {
  const navigate = useNavigate();

  useEffect(() => {
    replicateHubData();
  }, []);

  const replicateHubData = async () => {
    try {
      // Get data from register collection (Form 1)
      const registerRef = doc(db, "register", "Form 1");
      const registerDoc = await getDoc(registerRef);
      
      // Get data from HubAddress Info collection
      const addressRef = doc(db, "HubAddress Info", "Form 1");
      const addressDoc = await getDoc(addressRef);

      if (registerDoc.exists() && addressDoc.exists()) {
        const registerData = registerDoc.data();
        const addressData = addressDoc.data();

        // Create the combined address
        const combinedAddress = `${addressData.street}, ${addressData.city}`;

        // Create new document in schools collection
        const schoolsRef = doc(collection(db, "schools"));
        await setDoc(schoolsRef, {
          schoolName: registerData.hubName,
          schoolId: registerData.hubToken,
          schoolAddress: combinedAddress,
          schoolImage: "" // You can add image handling logic here if needed
        });

        console.log("Data successfully replicated to schools collection");
      } else {
        console.error("Required documents not found");
      }
    } catch (error) {
      console.error("Error replicating data:", error);
    }
  };

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
