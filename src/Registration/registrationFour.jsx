import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebase/firebaseConfig";
import "./registrationFour.css";
import MotionSyncLogo from "../assets/media/motionsync.png";
import { FaCreditCard, FaMobile, FaUniversity } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePayment from '../components/Payment/StripePayment';

// Make sure this is outside the component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Add file validation constants at the top
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

const RegistrationFour = () => {
  const navigate = useNavigate();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signature, setSignature] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFile = (file, type) => {
    if (!file) return 'Please select a file';
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'File must be an image (JPEG, PNG) or PDF';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [type]: error
      }));
      return;
    }

    if (type === 'signature') {
      setSignature(file);
    } else if (type === 'paymentReceipt') {
      setPaymentReceipt(file);
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[type];
      return newErrors;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!termsAccepted) {
      newErrors.terms = 'Please accept the terms and conditions to proceed';
    }
    
    if (!signature) {
      newErrors.signature = 'Please upload your signature';
    }
    
    if (!paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }
    
    if (paymentMethod && paymentMethod !== 'debit_credit' && !paymentReceipt) {
      newErrors.paymentReceipt = 'Please upload your payment receipt';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const storage = getStorage();
      let signatureUrl = null;
      let receiptUrl = null;

      // Upload files to payment_files folder
      if (signature) {
        const signatureRef = ref(storage, `payment_files/signatures/${Date.now()}_${signature.name}`);
        await uploadBytes(signatureRef, signature);
        signatureUrl = await getDownloadURL(signatureRef);
      }

      if (paymentReceipt) {
        const receiptRef = ref(storage, `payment_files/receipts/${Date.now()}_${paymentReceipt.name}`);
        await uploadBytes(receiptRef, paymentReceipt);
        receiptUrl = await getDownloadURL(receiptRef);
      }

      // Save to Firestore with additional validation info
      const form4Ref = doc(db, "register", "Form 4");
      await setDoc(form4Ref, {
        termsAccepted,
        signatureUrl,
        paymentMethod,
        receiptUrl,
        submissionDate: new Date().toISOString(),
        status: 'pending',
        fileValidations: {
          signature: signature ? {
            name: signature.name,
            type: signature.type,
            size: signature.size,
          } : null,
          receipt: paymentReceipt ? {
            name: paymentReceipt.name,
            type: paymentReceipt.type,
            size: paymentReceipt.size,
          } : null,
        }
      });

      navigate('/registration-complete');
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to submit form. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="header">
        <img src={MotionSyncLogo} alt="MotionSync Logo" className="logo" />
        <h1>ACKNOWLEDGMENT, AGREEMENT AND PAYMENT</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <section>
          <h2>Acknowledgment and Agreement</h2>
          
          <div className="terms-container">
            <div className="input-group">
              <h3>Terms and Conditions:</h3>
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span>I confirm that all information provided is accurate and acknowledge that our hub is responsible for ensuring the quality of the sign language education provided.</span>
              </label>
              {errors.terms && <div className="error-message">{errors.terms}</div>}
            </div>

            <div className="signature-section">
              <div className="signature-upload">
                <h3>Signature of Hub Director/Authorized Representative:</h3>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e, 'signature')}
                  id="signature-upload"
                  hidden
                />
                <label htmlFor="signature-upload" className="upload-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Upload Signature
                </label>
                {errors.signature && <div className="error-message">{errors.signature}</div>}
              </div>

              <div className="date-section">
                <h3>Date of Submission:</h3>
                <div className="date-display">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2>Payment Terms</h2>
          
          <div className="subscription-details">
            <h3>Subscription Fee:</h3>
            <p>
              Upon registration, the hub is entitled to a <strong>1-month free trial</strong> of the MotionSync application. 
              During this trial period, you'll have full access to all features and functionalities of the platform, allowing 
              you to explore and integrate our services into your operations. After the trial period, a fee of  
              <strong> Ten Thousand pesos (₱10,000)</strong> will be charged annually. This subscription fee covers comprehensive 
              platform access, regular updates, technical support, and quality assurance monitoring. The renewal notice will be 
              sent 30 days before the expiration of your current subscription period. Early renewal discounts may apply for 
              partners who maintain excellent service quality ratings.
            </p>
          </div>

          <div className="payment-methods">
            <h3>Payment Methods:</h3>
            <div className="payment-options">
              <div 
                className={`payment-option ${paymentMethod === 'debit_credit' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('debit_credit')}
              >
                <div className="payment-option-icon">
                  <FaCreditCard size={24} color={paymentMethod === 'debit_credit' ? '#00A67E' : '#666'} />
                </div>
                <span className="payment-option-label">Debit/Credit Card</span>
              </div>
              
              <div 
                className={`payment-option ${paymentMethod === 'gcash' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('gcash')}
              >
                <div className="payment-option-icon">
                  <FaMobile size={24} color={paymentMethod === 'gcash' ? '#00A67E' : '#666'} />
                </div>
                <span className="payment-option-label">GCash</span>
              </div>
              
              <div 
                className={`payment-option ${paymentMethod === 'bank_transfer' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('bank_transfer')}
              >
                <div className="payment-option-icon">
                  <FaUniversity size={24} color={paymentMethod === 'bank_transfer' ? '#00A67E' : '#666'} />
                </div>
                <span className="payment-option-label">Bank-to Bank Transfer</span>
              </div>
            </div>
            {errors.paymentMethod && <div className="error-message">{errors.paymentMethod}</div>}
            
            {paymentMethod && (
              <div className="payment-instructions">
                {paymentMethod === 'debit_credit' && (
                  <div className="payment-method-details">
                    <h4>Credit/Debit Card Payment</h4>
                    <p>You will be redirected to our secure payment gateway to complete your transaction.</p>
                    <Elements stripe={stripePromise}>
                      <StripePayment 
                        amount={10000}
                        buttonText="TRANSFER TO EXTERNAL PAYMENT METHOD"
                        onError={(error) => {
                          setErrors(prev => ({
                            ...prev,
                            payment: error
                          }));
                        }}
                      />
                    </Elements>
                  </div>
                )}
                
                {paymentMethod === 'gcash' && (
                  <div className="payment-method-details">
                    <h4>GCash Payment Details</h4>
                    <div className="payment-info">
                      <p><strong>Account Name:</strong> MotionSync</p>
                      <p><strong>GCash Number:</strong> 09XX-XXX-XXXX</p>
                      <p><strong>Amount:</strong> ₱10,000</p>
                      <p className="payment-note">Please include your Hub Name as reference when sending payment.</p>
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'bank_transfer' && (
                  <div className="payment-method-details">
                    <h4>Bank Transfer Details</h4>
                    <div className="payment-info">
                      <p><strong>Bank Name:</strong> Sample Bank</p>
                      <p><strong>Account Name:</strong> MotionSync Corporation</p>
                      <p><strong>Account Number:</strong> XXXX-XXXX-XXXX</p>
                      <p><strong>Amount:</strong> ₱10,000</p>
                      <p className="payment-note">Please include your Hub Name as reference when making the transfer.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Only show proceed button for non-Stripe payment methods */}
          {paymentMethod && paymentMethod !== 'debit_credit' && (
            <button type="button" className="proceed-payment-btn" disabled={!paymentMethod}>
              TRANSFER TO EXTERNAL PAYMENT METHOD
            </button>
          )}

          <div className="payment-confirmation">
            <h3>Payment Confirmation Slip:</h3>
            <p>Please upload the payment receipt below after the fee has been processed.</p>
            <div className="upload-container">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload(e, 'paymentReceipt')}
                id="receipt-upload"
                hidden
              />
              <label htmlFor="receipt-upload" className="upload-label">
                Upload Payment Receipt
              </label>
            </div>
            {errors.paymentReceipt && <div className="error-message">{errors.paymentReceipt}</div>}
          </div>

          <div className="processing-time">
            <p><strong>Note:</strong> Please allow 7-14 days for the admin team to review your payment documents and approve the partnership.</p>
          </div>
        </section>

        <div className="footer-navigation">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : '4/4 | Complete Registration ➔'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationFour;
