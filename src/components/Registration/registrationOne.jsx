import React, { useState } from "react";
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig.js";
import "../../assets/Registration/registrationOne.css";
import MotionSyncLogo from "../../assets/media/motionsync.png";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';

const RegistrationOne = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [otherSpecification, setOtherSpecification] = useState("");
  const [isOtherChecked, setIsOtherChecked] = useState(false);
  const [agreement, setAgreement] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    hubName: "",
    organizationType: "",
    focus: [],
    address: {
      street: "",
      city: "",
      stateProvince: "",
      country: "",
      zipCode: "",
    },
    contactPerson: {
      fullName: "",
      position: "",
      emailAddress: "",
      phoneNumber: "",
      socialMedia: "",
    },
    objectives: {
      missionStatement: "",
      visionStatement: "",
      history: "", // Note: This field isn't in your Firestore schema
    }
  });
  const [errors, setErrors] = useState({});

  const handleOtherCheckbox = (e) => {
    setIsOtherChecked(e.target.checked);
    if (e.target.checked) {
      setShowModal(true);
    } else {
      setOtherSpecification("");
    }
  };

  const handleSaveSpecification = () => {
    setShowModal(false);
    // If user didn't type anything, uncheck the box
    if (!otherSpecification.trim()) {
      setIsOtherChecked(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or image file');
        return;
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('File size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleInputChange = (e, section = null) => {
    const { name, value } = e.target;
    
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFocusChange = (value, checked) => {
    setFormData(prev => ({
      ...prev,
      focus: checked 
        ? [...prev.focus, value]
        : prev.focus.filter(item => item !== value)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Hub Name validation
    if (!formData.hubName.trim()) {
      newErrors.hubName = 'Hub name is required';
    } else if (formData.hubName.length < 2) {
      newErrors.hubName = 'Hub name must be at least 2 characters';
    }

    // Organization Type validation
    if (!formData.organizationType) {
      newErrors.organizationType = 'Organization type is required';
    }

    // Focus Areas validation
    if (formData.focus.length === 0 && !isOtherChecked) {
      newErrors.focus = 'Please select at least one focus area';
    }

    // Address validations
    if (!formData.address.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!formData.address.city.trim()) {
      newErrors.city = 'City is required';
    } else if (!/^[a-zA-Z\s-]+$/.test(formData.address.city)) {
      newErrors.city = 'City should only contain letters, spaces, and hyphens';
    }
    if (!formData.address.stateProvince.trim()) {
      newErrors.stateProvince = 'State/Province is required';
    }
    if (!formData.address.country.trim()) {
      newErrors.country = 'Country is required';
    } else if (!/^[a-zA-Z\s-]+$/.test(formData.address.country)) {
      newErrors.country = 'Country should only contain letters, spaces, and hyphens';
    }
    if (!formData.address.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.address.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
    }

    // Contact Person validations
    if (!formData.contactPerson.fullName.trim()) {
      newErrors.fullName = 'Contact person name is required';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(formData.contactPerson.fullName)) {
      newErrors.fullName = 'Name should only contain letters, spaces, and basic punctuation';
    }

    if (!formData.contactPerson.position.trim()) {
      newErrors.position = 'Position is required';
    }

    if (!formData.contactPerson.emailAddress.trim()) {
      newErrors.emailAddress = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactPerson.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }

    if (!formData.contactPerson.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.contactPerson.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (formData.contactPerson.socialMedia) {
      if (!/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(formData.contactPerson.socialMedia)) {
        newErrors.socialMedia = 'Please enter a valid social media URL';
      }
    }

    // Objectives validations
    if (!formData.objectives.missionStatement.trim()) {
      newErrors.missionStatement = 'Mission statement is required';
    } else if (formData.objectives.missionStatement.length < 50) {
      newErrors.missionStatement = 'Mission statement should be at least 50 characters';
    }

    if (!formData.objectives.visionStatement.trim()) {
      newErrors.visionStatement = 'Vision statement is required';
    } else if (formData.objectives.visionStatement.length < 50) {
      newErrors.visionStatement = 'Vision statement should be at least 50 characters';
    }

    // Agreement validation
    if (!agreement) {
      newErrors.agreement = 'Please indicate your agreement';
    } else if (agreement === 'no') {
      newErrors.agreement = 'You must agree to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstError = document.querySelector('.error-message');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      let organizationStructureUrl = null;
      if (selectedFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `organization_structure/${formData.hubName}_${selectedFile.name}`);
        
        await uploadBytes(storageRef, selectedFile);
        
        organizationStructureUrl = await getDownloadURL(storageRef);
      }

      const form1Ref = doc(db, "register", "Form 1");
      await setDoc(form1Ref, {
        hubName: formData.hubName,
        organizationType: formData.organizationType,
        Focus: [...formData.focus, isOtherChecked ? otherSpecification : null].filter(Boolean),
        organizationStructureUrl: organizationStructureUrl
      });

      const addressRef = doc(collection(form1Ref, "Hub Address Info"), "Address");
      await setDoc(addressRef, formData.address);

      const contactRef = doc(collection(form1Ref, "Hub Contact Person"), "Contact Person");
      await setDoc(contactRef, formData.contactPerson);

      const objectivesRef = doc(collection(form1Ref, "Hub Objectives"), "Objectives");
      await setDoc(objectivesRef, {
        missionStatement: formData.objectives.missionStatement,
        visionStatement: formData.objectives.visionStatement
      });

      console.log("Data and file successfully saved");
      navigate('/registration-two');
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const renderError = (fieldName) => {
    return errors[fieldName] && (
      <span className="error-message">{errors[fieldName]}</span>
    );
  };

  return (
    <>
      <div className="white-background"></div>
      <div className="registration-container">
        <div className="header-container">
          <img src={MotionSyncLogo} alt="MotionSync Logo" className="motionsync-logo" />
          <h1>HUB/ORGANIZATION INFORMATION</h1>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Hub/Organization Name */}
          <div className="form-row">
            <div className="form-group">
              <input 
                type="text" 
                name="hubName"
                value={formData.hubName}
                onChange={handleInputChange}
                placeholder="Hub/Organization Name"
                className={errors.hubName ? 'error' : ''}
              />
              {renderError('hubName')}
            </div>
            <div className="form-group">
              <select 
                name="organizationType"
                value={formData.organizationType}
                onChange={handleInputChange}
              >
                <option value="" disabled>Organization Type</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="nonprofit">Non-Profit</option>
                <option value="government">Government</option>
                <option value="other">Other</option>
              </select>
              {renderError('organizationType')}
            </div>
          </div>

          {/* Organization Address */}
          <div className="form-row">
            <div className="form-group">
              <input 
                type="text"
                name="street"
                value={formData.address.street}
                onChange={(e) => handleInputChange(e, 'address')}
                placeholder="Street Address"
                className={errors.street ? 'error' : ''}
              />
              {renderError('street')}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input 
                type="text"
                name="city"
                value={formData.address.city}
                onChange={(e) => handleInputChange(e, 'address')}
                placeholder="City"
                className={errors.city ? 'error' : ''}
              />
              {renderError('city')}
            </div>
            <div className="form-group">
              <input 
                type="text"
                name="stateProvince"
                value={formData.address.stateProvince}
                onChange={(e) => handleInputChange(e, 'address')}
                placeholder="State/Province"
                className={errors.stateProvince ? 'error' : ''}
              />
              {renderError('stateProvince')}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input 
                type="text"
                name="country"
                value={formData.address.country}
                onChange={(e) => handleInputChange(e, 'address')}
                placeholder="Country"
                className={errors.country ? 'error' : ''}
              />
              {renderError('country')}
            </div>
            <div className="form-group">
              <input 
                type="text"
                name="zipCode"
                value={formData.address.zipCode}
                onChange={(e) => handleInputChange(e, 'address')}
                placeholder="ZIP Code"
                className={errors.zipCode ? 'error' : ''}
              />
              {renderError('zipCode')}
            </div>
          </div>

          {/* Contact Person Information */}
          <div className="form-row">
            <div className="form-group">
              <input 
                type="text"
                name="fullName"
                value={formData.contactPerson.fullName}
                onChange={(e) => handleInputChange(e, 'contactPerson')}
                placeholder="Contact Person Full Name"
                className={errors.fullName ? 'error' : ''}
              />
              {renderError('fullName')}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input 
                type="text"
                name="position"
                value={formData.contactPerson.position}
                onChange={(e) => handleInputChange(e, 'contactPerson')}
                placeholder="Organization Position"
                className={errors.position ? 'error' : ''}
              />
              {renderError('position')}
            </div>
            <div className="form-group">
              <input 
                type="email"
                name="emailAddress"
                value={formData.contactPerson.emailAddress}
                onChange={(e) => handleInputChange(e, 'contactPerson')}
                placeholder="Contact Email"
                className={errors.emailAddress ? 'error' : ''}
              />
              {renderError('emailAddress')}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input 
                type="tel"
                name="phoneNumber"
                value={formData.contactPerson.phoneNumber}
                onChange={(e) => handleInputChange(e, 'contactPerson')}
                placeholder="Contact Phone Number"
                className={errors.phoneNumber ? 'error' : ''}
              />
              {renderError('phoneNumber')}
            </div>
            <div className="form-group">
              <input 
                type="text"
                name="socialMedia"
                value={formData.contactPerson.socialMedia}
                onChange={(e) => handleInputChange(e, 'contactPerson')}
                placeholder="Social Media"
              />
            </div>
          </div>

          {/* Hub Profile and Background */}
          <div className="form-row">
            <div className="form-group">
              <textarea 
                name="missionStatement"
                value={formData.objectives.missionStatement}
                onChange={(e) => handleInputChange(e, 'objectives')}
                placeholder="Mission Statement (Brief overview of your hub's mission)"
              ></textarea>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <textarea 
                name="visionStatement"
                value={formData.objectives.visionStatement}
                onChange={(e) => handleInputChange(e, 'objectives')}
                placeholder="Vision Statement (Brief overview of your hub's vision)"
              ></textarea>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <textarea 
                name="history"
                value={formData.objectives.history}
                onChange={(e) => handleInputChange(e, 'objectives')}
                placeholder="History of the Organization (Years of Operation)"
              ></textarea>
            </div>
          </div>

          <div className="form-row file-upload-row">
            <div className="form-group file-display">
              <div className="file-placeholder">
                {selectedFile 
                  ? selectedFile.name 
                  : "Organizational Structure (Attach an organizational chart)"
                }
              </div>
              <input 
                type="file"
                id="org-structure"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
            <label htmlFor="org-structure" className="upload-button">
              <span>Upload</span>
            </label>
          </div>

          <div className="checkbox-group">
            <label>
              <input type="checkbox" />
              Education
            </label>
            <label>
              <input type="checkbox" />
              Deaf Advocacy
            </label>
            <label>
              <input type="checkbox" />
              Community Engagement
            </label>
            <label>
              <input type="checkbox" />
              Training and Skills Development
            </label>
            <label>
              <input 
                type="checkbox"
                checked={isOtherChecked}
                onChange={handleOtherCheckbox}
              />
              {isOtherChecked && otherSpecification ? otherSpecification : "Other"}
            </label>
          </div>

          <div>
            <p className="agreement-title">Agreement Notice</p>
            <p className="agreement-notice">
              I understand that the data I input into the MotionSync app is essential for the admin to effectively manage and enhance the app's functionality. By providing accurate and comprehensive information, I contribute to creating a more personalized and efficient experience for all users. This data will help the admin identify areas for improvement, tailor educational resources, and ensure that communication needs are met effectively. I recognize that my participation is vital in fostering a supportive community that empowers speech-impaired individuals and promotes inclusivity in education. Therefore, I acknowledge the significance of my input in achieving these goals.
            </p>
            
            <div className="radio-group-horizontal">
              <label>
                <input 
                  type="radio" 
                  name="agreement"
                  value="yes" 
                  checked={agreement === "yes"} 
                  onChange={() => setAgreement("yes")} 
                />
                Yes, I understand
              </label>
              <label>
                <input 
                  type="radio" 
                  name="agreement"
                  value="no" 
                  checked={agreement === "no"} 
                  onChange={() => setAgreement("no")} 
                />
                No, I'd like to keep our privacy
              </label>
            </div>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Specify Other Type</h3>
                <input
                  type="text"
                  value={otherSpecification}
                  onChange={(e) => setOtherSpecification(e.target.value)}
                  placeholder="Please specify..."
                />
                <div className="modal-buttons">
                  <button 
                    onClick={handleSaveSpecification}
                    className="modal-button"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="section-divider"></div>
          <div className="footer-navigation">
            <button type="submit">1/4 | Continue register ➔</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegistrationOne;
