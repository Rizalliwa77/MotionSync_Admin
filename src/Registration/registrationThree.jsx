import React, { useState } from 'react';
import { doc, setDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase/firebaseConfig";
import "../../components/HubAdmin/styles/Registration/registrationThree.css";
import MotionSyncLogo from "../../assets/media/motionsync.png";
import { useNavigate } from 'react-router-dom';

const RegistrationThree = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState([{ number: '', issuedBy: '' }]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [fileErrors, setFileErrors] = useState({});
  const [compliance, setCompliance] = useState({
    educationRegulations: false,
    specialEducationLaws: false,
    childProtectionPolicies: false
  });
  
  // Add error state
  const [errors, setErrors] = useState({
    credentials: [],
    compliance: {},
    files: {}
  });

  // Add new state for privacy and technology
  const [privacy, setPrivacy] = useState({
    dataProtection: false,
    dataHandling: false,
    incidentResponse: false
  });

  const [technology, setTechnology] = useState({
    platforms: {
      zoom: false,
      microsoftTeams: false,
      googleMeet: false,
      customLMS: false
    },
    other: '',
    signTools: {
      videoLibrary: false,
      interactiveGames: false,
      virtualClassroom: false
    },
    accessibility: {
      captions: false,
      transcripts: false
    }
  });

  // Add these state variables at the top with other useState declarations
  const [partners, setPartners] = useState([{ company: '', details: '' }]);
  const [contactInfo, setContactInfo] = useState([]);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [activeInputIndex, setActiveInputIndex] = useState(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([{ files: [] }]);

  // Validation function for credentials
  const validateCredentials = () => {
    const credentialErrors = credentials.map(cred => {
      const errors = {};
      if (!cred.number.trim()) {
        errors.number = 'Registration number is required';
      }
      if (!cred.issuedBy.trim()) {
        errors.issuedBy = 'Issuing body is required';
      }
      return errors;
    });

    return credentialErrors;
  };

  // Validation function for compliance
  const validateCompliance = () => {
    const complianceErrors = {};
    if (!compliance.educationRegulations) {
      complianceErrors.educationRegulations = 'You must comply with education regulations';
    }
    if (!compliance.specialEducationLaws) {
      complianceErrors.specialEducationLaws = 'You must comply with special education laws';
    }
    if (!compliance.childProtectionPolicies) {
      complianceErrors.childProtectionPolicies = 'You must have child protection policies in place';
    }
    return complianceErrors;
  };

  // Validation function for files
  const validateFiles = () => {
    const fileErrors = {};
    credentials.forEach((_, index) => {
      if (!selectedFiles[index]) {
        fileErrors[index] = 'Supporting document is required';
      }
    });
    return fileErrors;
  };

  // Update validation to include new fields
  const validatePrivacyAndTech = () => {
    const privacyErrors = {};
    const techErrors = {};

    if (!privacy.dataProtection) privacyErrors.dataProtection = 'Required';
    if (!privacy.dataHandling) privacyErrors.dataHandling = 'Required';
    if (!privacy.incidentResponse) privacyErrors.incidentResponse = 'Required';
    
    if (technology.hasTeachingTools === null) {
      techErrors.hasTeachingTools = 'Please select Yes or No';
    }
    
    return { privacyErrors, techErrors };
  };

  // Add this validation function near your other validation functions
  const validateAgreement = () => {
    const agreementErrors = {};
    
    if (!agreementAccepted) {
      agreementErrors.agreement = 'You must accept the agreement to continue';
    }
    
    return agreementErrors;
  };

  // Combined validation function
  const validateForm = () => {
    const errors = {
      credentials: validateCredentials(),
      compliance: validateCompliance(),
      files: validateFiles(),
      privacy: validatePrivacyAndTech().privacyErrors,
      technology: validatePrivacyAndTech().techErrors,
      agreement: validateAgreement()
    };

    setErrors(errors);

    return Object.values(errors).every(error => 
      Array.isArray(error) 
        ? error.every(e => Object.keys(e).length === 0)
        : Object.keys(error).length === 0
    );
  };

  // Add these handler functions
  const handleCredentialChange = (index, field, value) => {
    const newCredentials = [...credentials];
    newCredentials[index][field] = value;
    setCredentials(newCredentials);
    
    // Clear errors for this field when user starts typing
    if (errors.credentials[index]?.[field]) {
      const newErrors = { ...errors };
      delete newErrors.credentials[index][field];
      setErrors(newErrors);
    }
  };

  const handleFileSelect = (index) => (event) => {
    const file = event.target.files[0];
    if (file) {
      // Store the file with additional metadata
      setSelectedFiles(prev => ({
        ...prev,
        [index]: file
      }));
      
      // Clear any previous errors
      const newFileErrors = { ...fileErrors };
      delete newFileErrors[index];
      setFileErrors(newFileErrors);
    }
  };

  const removeFile = (index) => {
    const newFiles = { ...selectedFiles };
    delete newFiles[index];
    setSelectedFiles(newFiles);

    // Clear any errors
    const newFileErrors = { ...fileErrors };
    delete newFileErrors[index];
    setFileErrors(newFileErrors);
  };

  const addCredential = () => {
    setCredentials([...credentials, { number: '', issuedBy: '' }]);
    // Clear any errors for the new credential
    setErrors(prev => ({
      ...prev,
      credentials: [...prev.credentials, {}]
    }));
  };

  // Add these handler functions with other handlers
  const handlePartnerChange = (e, index, field) => {
    const newPartners = [...partners];
    newPartners[index] = {
      ...newPartners[index],
      [field]: e.target.value
    };
    setPartners(newPartners);
  };

  const handleAddPartner = () => {
    setPartners([...partners, { company: '', details: '' }]);
  };

  const handleContactChange = (e, index, field) => {
    const newContactInfo = [...contactInfo];
    newContactInfo[index] = {
      ...newContactInfo[index],
      [field]: e.target.value
    };
    setContactInfo(newContactInfo);
  };

  const handleAddContact = () => {
    setContactInfo([...contactInfo, {
      '#': contactInfo.length + 1,
      'Contact Person\'s Full Name': '',
      'Organization': '',
      'Contact Information': '',
    }]);
  };

  // Modified partner input section
  const handlePartnerInputFocus = () => {
    if (!hasConsent) {
      setShowConsentModal(true);
    }
  };

  // Modified consent handler
  const handleReferenceConsent = (agreed) => {
    if (agreed) {
      setHasConsent(true);
      setShowConsentModal(false);
    } else {
      // Clear all reference data and disable inputs
      setPartners([{ company: '', details: '' }]);
      setContactInfo([]);
      setShowConsentModal(false);
      setHasConsent(false);
    }
  };

  // Modified input focus handler
  const handleInputFocus = (index) => {
    if (!showConsentModal) {
      setActiveInputIndex(index);
      setShowConsentModal(true);
    }
  };

  // Update handleSubmit to include proper collection structure
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      const storage = getStorage();
      const uploadUrls = {};

      // Upload files to "Accreditation and Legal Credentials" folder
      for (const [index, file] of Object.entries(selectedFiles)) {
        // Create a clean filename
        const timestamp = Date.now();
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const filePath = `Accreditation and Legal Credentials/${timestamp}_${cleanFileName}`;
        
        // Create storage reference
        const fileRef = ref(storage, filePath);
        
        // Upload file
        await uploadBytes(fileRef, file);
        
        // Get download URL
        const downloadURL = await getDownloadURL(fileRef);
        uploadUrls[index] = downloadURL;
      }

      // Get reference to the Form 3 document
      const form3Ref = doc(db, "register", "Form 3");

      // Add to Accreditation collection with file URL
      const accreditationCollectionRef = collection(form3Ref, "Accreditation");
      await setDoc(doc(accreditationCollectionRef, "Files"), {
        accreditingBody: credentials[0].issuedBy,
        number: credentials[0].number,
        documentUrl: uploadUrls[0] || null,
        fileName: selectedFiles[0]?.name || null,
        uploadDate: new Date().toISOString()
      });

      // Add to References collection
      const referencesCollectionRef = collection(form3Ref, "References");
      await setDoc(doc(referencesCollectionRef, "collabs"), {
        details: partners.map(partner => partner.details).join(', '),
        name: partners.map(partner => partner.company).join(', ')
      });

      console.log("Form 3 data saved successfully");
      navigate('/registration-four');
    } catch (error) {
      console.error("Error saving data:", error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save data. Please try again.'
      }));
    }
  };

  // Add these handler functions with your other handlers
  const handleAddDocument = () => {
    setUploadedDocuments([...uploadedDocuments, { files: [] }]);
  };

  const handleRemoveDocument = (index) => {
    const newDocuments = uploadedDocuments.filter((_, i) => i !== index);
    setUploadedDocuments(newDocuments);
  };

  const handleResourceUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newDocuments = [...uploadedDocuments];
      newDocuments[index] = file;
      setUploadedDocuments(newDocuments);
    }
  };

  // Add these handler functions
  const handleRemoveCredential = (index) => {
    if (credentials.length > 1) {
      const newCredentials = credentials.filter((_, i) => i !== index);
      setCredentials(newCredentials);
      
      // Update errors state
      const newErrors = { ...errors };
      newErrors.credentials = newErrors.credentials.filter((_, i) => i !== index);
      setErrors(newErrors);
    }
  };

  const handleRemovePartner = (index) => {
    if (partners.length > 1) {
      const newPartners = partners.filter((_, i) => i !== index);
      setPartners(newPartners);
    }
  };

  const handleRemoveContact = (index) => {
    if (contactInfo.length > 1) {
      const newContactInfo = contactInfo.filter((_, i) => i !== index);
      setContactInfo(newContactInfo);
    }
  };

  // JSX with error messages
  return (
    <>
      <div className="white-background"></div>
      <div className="registration-container">
        <div className="header-container">
          <img src={MotionSyncLogo} alt="MotionSync Logo" className="motionsync-logo" />
          <h1>LEGAL, COMPLIANCE, AND RESOURCES</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <section>
            <h2>Accreditation and Legal Credentials</h2>
            <div className="credentials-container">
              {credentials.map((credential, index) => (
                <div key={index} className="credential-entry">
                  {credentials.length > 1 && (
                    <button 
                      type="button" 
                      className="remove-button"
                      onClick={() => handleRemoveCredential(index)}
                      aria-label="Remove credential"
                    >
                      ×
                    </button>
                  )}
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Accreditation or Registration Number"
                      value={credential.number}
                      onChange={(e) => handleCredentialChange(index, 'number', e.target.value)}
                      className={errors.credentials[index]?.number ? 'error' : ''}
                    />
                    {errors.credentials[index]?.number && (
                      <div className="error-message">{errors.credentials[index].number}</div>
                    )}
                  </div>

                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Issued By (Accrediting Body or Government Agency)"
                      value={credential.issuedBy}
                      onChange={(e) => handleCredentialChange(index, 'issuedBy', e.target.value)}
                      className={errors.credentials[index]?.issuedBy ? 'error' : ''}
                    />
                    {errors.credentials[index]?.issuedBy && (
                      <div className="error-message">{errors.credentials[index].issuedBy}</div>
                    )}
                  </div>

                  <div className="file-upload">
                    <label 
                      htmlFor={`document-${index}`}
                      className={fileErrors[index] ? 'error' : ''}
                    >
                      <div className="file-label-content">
                        <span className="file-name">
                          {selectedFiles[index] 
                            ? selectedFiles[index].name 
                            : "Upload Supporting Document"}
                        </span>
                        {selectedFiles[index] && (
                          <button 
                            type="button" 
                            className="remove-file-button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeFile(index);
                            }}
                            aria-label="Remove file"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </label>
                    <input
                      type="file"
                      id={`document-${index}`}
                      onChange={handleFileSelect(index)}
                      style={{ display: 'none' }}
                    />
                    {fileErrors[index] && (
                      <div className="error-message">{fileErrors[index]}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={addCredential} className="add-button">
              Add more
            </button>
          </section>

          <section>
            <h2>Legal Compliance</h2>
            <div className="compliance-section">
              <h3>Compliance with Local and National Regulations:</h3>
              
              <div className="compliance-item">
                <h4>Education Regulations:</h4>
                <label className={errors.compliance.educationRegulations ? 'error' : ''}>
                  <input
                    type="checkbox"
                    checked={compliance.educationRegulations}
                    onChange={(e) => {
                      setCompliance(prev => ({
                        ...prev,
                        educationRegulations: e.target.checked
                      }));
                      // Clear error when checked
                      if (e.target.checked && errors.compliance.educationRegulations) {
                        const newErrors = { ...errors };
                        delete newErrors.compliance.educationRegulations;
                        setErrors(newErrors);
                      }
                    }}
                  />
                  Our hub complies with all applicable local and national education regulations.
                </label>
                {errors.compliance.educationRegulations && (
                  <div className="error-message">{errors.compliance.educationRegulations}</div>
                )}
              </div>

              <div className="compliance-item">
                <h4>Special Education Laws:</h4>
                <label className={errors.compliance.specialEducationLaws ? 'error' : ''}>
                  <input
                    type="checkbox"
                    checked={compliance.specialEducationLaws}
                    onChange={(e) => {
                      setCompliance(prev => ({
                        ...prev,
                        specialEducationLaws: e.target.checked
                      }));
                      if (e.target.checked && errors.compliance.specialEducationLaws) {
                        const newErrors = { ...errors };
                        delete newErrors.compliance.specialEducationLaws;
                        setErrors(newErrors);
                      }
                    }}
                  />
                  Our hub adheres to laws regarding special education and accommodations for individuals with disabilities.
                </label>
                {errors.compliance.specialEducationLaws && (
                  <div className="error-message">{errors.compliance.specialEducationLaws}</div>
                )}
              </div>

              <div className="compliance-item">
                <h4>Child Protection Policies:</h4>
                <label className={errors.compliance.childProtectionPolicies ? 'error' : ''}>
                  <input
                    type="checkbox"
                    checked={compliance.childProtectionPolicies}
                    onChange={(e) => {
                      setCompliance(prev => ({
                        ...prev,
                        childProtectionPolicies: e.target.checked
                      }));
                      if (e.target.checked && errors.compliance.childProtectionPolicies) {
                        const newErrors = { ...errors };
                        delete newErrors.compliance.childProtectionPolicies;
                        setErrors(newErrors);
                      }
                    }}
                  />
                  We have established policies to protect children and vulnerable individuals.
                </label>
                {errors.compliance.childProtectionPolicies && (
                  <div className="error-message">{errors.compliance.childProtectionPolicies}</div>
                )}
              </div>
            </div>
          </section>

          <section>
            <h2>Privacy and Data Protection</h2>
            <div className="privacy-section">
              <div className="privacy-item">
                <h4>Data Protection Policy:</h4>
                <label>
                  <input
                    type="checkbox"
                    checked={privacy.dataProtection}
                    onChange={(e) => setPrivacy(prev => ({...prev, dataProtection: e.target.checked}))}
                  />
                  We comply with data protection regulations (e.g., GDPR, CCPA) to ensure the privacy and security of personal information of students and educators.
                </label>
              </div>

              <div className="privacy-item">
                <h4>Data Handling Procedures:</h4>
                <label>
                  <input
                    type="checkbox"
                    checked={privacy.dataHandling}
                    onChange={(e) => setPrivacy(prev => ({...prev, dataHandling: e.target.checked}))}
                  />
                  We have procedures in place for the collection, storage, and processing of personal data, including consent mechanisms for students and parents/guardians.
                </label>
              </div>

              <div className="privacy-item">
                <h4>Incident Response Plan:</h4>
                <label>
                  <input
                    type="checkbox"
                    checked={privacy.incidentResponse}
                    onChange={(e) => setPrivacy(prev => ({...prev, incidentResponse: e.target.checked}))}
                  />
                  We maintain an incident response plan to address any data breaches or security incidents promptly.
                </label>
              </div>
            </div>
          </section>

          <section className="platforms-section">
            <h2>Platforms Used:</h2>
            <div className="platforms-container">
              <div className="platforms-grid">
                <label className="platform-item">
                  <input
                    type="checkbox"
                    checked={technology.platforms.zoom}
                    onChange={(e) => setTechnology(prev => ({
                      ...prev,
                      platforms: {...prev.platforms, zoom: e.target.checked}
                    }))}
                  />
                  <div className="platform-content">
                    <span className="platform-name">Zoom</span>
                    <span className="platform-description">Video conferencing platform with sign language-friendly features</span>
                  </div>
                </label>

                <label className="platform-item">
                  <input
                    type="checkbox"
                    checked={technology.platforms.microsoftTeams}
                    onChange={(e) => setTechnology(prev => ({
                      ...prev,
                      platforms: {...prev.platforms, microsoftTeams: e.target.checked}
                    }))}
                  />
                  <div className="platform-content">
                    <span className="platform-name">Microsoft Teams</span>
                    <span className="platform-description">Collaborative platform with accessibility features</span>
                  </div>
                </label>

                <label className="platform-item">
                  <input
                    type="checkbox"
                    checked={technology.platforms.googleMeet}
                    onChange={(e) => setTechnology(prev => ({
                      ...prev,
                      platforms: {...prev.platforms, googleMeet: e.target.checked}
                    }))}
                  />
                  <div className="platform-content">
                    <span className="platform-name">Google Meet</span>
                    <span className="platform-description">Web-based video platform with real-time captions</span>
                  </div>
                </label>

                <label className="platform-item">
                  <input
                    type="checkbox"
                    checked={technology.platforms.customLMS}
                    onChange={(e) => setTechnology(prev => ({
                      ...prev,
                      platforms: {...prev.platforms, customLMS: e.target.checked}
                    }))}
                  />
                  <div className="platform-content">
                    <span className="platform-name">Custom LMS</span>
                    <span className="platform-description">Learning Management System (specify below)</span>
                  </div>
                </label>
              </div>

              <div className="other-platform">
                <label>Other (please specify):</label>
                <input
                  type="text"
                  value={technology.other}
                  onChange={(e) => setTechnology(prev => ({...prev, other: e.target.value}))}
                  placeholder="Enter other platforms or tools you use"
                />
              </div>
            </div>
          </section>

          <div className="additional-tools-section">
            <h3>Additional Teaching Tools & Resources</h3>
            
            {/* Sign Language Specific Tools */}
            <div className="tools-category">
              <h4>Sign Language Teaching Tools</h4>
              <div className="tools-grid">
                <label className="tool-item">
                  <input
                    type="checkbox"
                    checked={technology.signTools?.videoLibrary}
                    onChange={(e) => setTechnology(prev => ({
                      ...prev,
                      signTools: {...prev.signTools, videoLibrary: e.target.checked}
                    }))}
                  />
                  <div className="tool-content">
                    <span className="tool-name">Sign Language Video Library</span>
                    <span className="tool-description">Pre-recorded lesson materials and resources</span>
                  </div>
                </label>

                <label className="tool-item">
                  <input
                    type="checkbox"
                    checked={technology.signTools?.interactiveGames}
                    onChange={(e) => setTechnology(prev => ({
                      ...prev,
                      signTools: {...prev.signTools, interactiveGames: e.target.checked}
                    }))}
                  />
                  <div className="tool-content">
                    <span className="tool-name">Interactive Learning Games</span>
                    <span className="tool-description">Gamified sign language learning tools</span>
                  </div>
                </label>

                <label className="tool-item">
                  <input
                    type="checkbox"
                    checked={technology.signTools?.virtualClassroom}
                    onChange={(e) => setTechnology(prev => ({
                      ...prev,
                      signTools: {...prev.signTools, virtualClassroom: e.target.checked}
                    }))}
                  />
                  <div className="tool-content">
                    <span className="tool-name">Virtual Classroom Tools</span>
                    <span className="tool-description">Specialized online teaching environment</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Resource Upload Section */}
            <div className="tools-category">
              <h4>Additional Resources</h4>
              <div className="resource-upload-section">
                {uploadedDocuments.map((doc, index) => (
                  <div key={index} className="resource-type">
                    <div className="document-controls">
                      <label>Teaching Materials {index + 1}</label>
                      <button 
                        type="button" 
                        className="remove-document"
                        onClick={() => handleRemoveDocument(index)}
                        aria-label="Remove document"
                      >
                        ×
                      </button>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={(e) => handleResourceUpload(e, index)}
                    />
                  </div>
                ))}
                <button 
                  type="button" 
                  className="add-button"
                  onClick={handleAddDocument}
                >
                  Add Document
                </button>
              </div>
            </div>
          </div>

          <section className="references-section">
            <h2>References/Previous Collaborations</h2>
            <div className="references-container">
              {partners.map((partner, index) => (
                <div key={index} className="partner-row">
                  <div className="partner-input-group" style={{ display: hasConsent ? 'grid' : 'none' }}>
                    {partners.length > 1 && (
                      <button 
                        type="button" 
                        className="remove-button"
                        onClick={() => handleRemovePartner(index)}
                        aria-label="Remove partner"
                        disabled={!hasConsent}
                      >
                        ×
                      </button>
                    )}
                    <input 
                      type="text" 
                      placeholder="Company/Organization Name"
                      value={partner.company}
                      onChange={(e) => handlePartnerChange(e, index, 'company')}
                      disabled={!hasConsent}
                    />
                    <input 
                      type="text" 
                      placeholder="Collaboration Details"
                      value={partner.details}
                      onChange={(e) => handlePartnerChange(e, index, 'details')}
                      disabled={!hasConsent}
                    />
                  </div>
                </div>
              ))}
              <button 
                type="button" 
                onClick={handleAddPartner} 
                className="add-button"
                disabled={!hasConsent}
              >
                Add More
              </button>
            </div>

            <div className="reference-info">
              <h3>Why Share References?</h3>
              <p className="reference-description">
                Your references are vital in building a stronger sign language education community. 
                By sharing your references, you enable quality verification of educational services 
                and help connect students with experienced educators. This facilitates collaboration 
                between educational hubs, strengthens the credibility of our platform, and improves 
                the matching process between students and teachers.
              </p>
              <p className="data-protection-note">
                Your data will be handled securely and only used for verification purposes.
              </p>
              {!hasConsent && (
                <button 
                  onClick={() => handleReferenceConsent(true)} 
                  className="consent-button-inline"
                >
                  I Agree to Share References
                </button>
              )}
            </div>

            {showConsentModal && (
              <div className="modal-overlay">
                <div className="consent-modal">
                  <h3>Reference Data Consent</h3>
                  <p>Would you allow MotionSync to collect and store your reference information?</p>
                  <div className="consent-details">
                    <p>This information will be used to:</p>
                    <ul>
                      <li>Verify teaching experience and qualifications</li>
                      <li>Build a trusted network of educators</li>
                      <li>Improve student-teacher matching</li>
                      <li>Enhance platform credibility</li>
                    </ul>
                    <p>Your data will be protected according to our privacy policy.</p>
                  </div>
                  <div className="modal-buttons">
                    <button onClick={() => handleReferenceConsent(true)} className="consent-button accept">
                      Yes, I Agree
                    </button>
                    <button onClick={() => handleReferenceConsent(false)} className="consent-button decline">
                      No, Remove References
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          <div className="agreement-notice-wrapper">
            <div className="agreement-notice">
              <h3>Agreement Notice</h3>
              <div className="agreement-content">
                <p>
                  By registering, the Hub agrees to comply with all relevant local and national regulations regarding education, including special education laws and child protection policies. The Hub will ensure the security and privacy of all personal data in accordance with applicable data protection laws (e.g., GDPR, CCPA).
                </p>
                <p>
                  All educational tools, resources, and teaching materials used will be properly licensed and comply with copyright laws.
                </p>
                <p>
                  The Hub also confirms it holds necessary liability insurance and agrees to indemnify MotionSync against any claims arising from its operations.
                </p>
                <div className="agreement-checkbox">
                  <label className={errors.agreement?.agreement ? 'error' : ''}>
                    <input
                      type="checkbox"
                      checked={agreementAccepted}
                      onChange={(e) => setAgreementAccepted(e.target.checked)}
                    />
                    <span>By proceeding, the Hub acknowledges and accepts these terms.</span>
                  </label>
                  {errors.agreement?.agreement && (
                    <div className="error-message">{errors.agreement.agreement}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="footer-navigation">
            <button type="submit">3/4 | Continue register ➔</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegistrationThree;
