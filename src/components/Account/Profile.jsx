import React, { useState } from 'react';
import '../../assets/Account/Profile.css';
import Sidebar from '../Sidebar';
import profile from '../../assets/media/profilepic.jpg';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(profile);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Joven',
    lastName: 'De los Santos',
    role: 'Super Admin',
    dateOfBirth: '1990-01-01',
    nationality: 'Filipino',
    gender: 'Male',
    civilStatus: 'Single',
    email: 'joven.mylove@example.com',
    alternativeEmail: 'joven.business@example.com',
    phone: '+1 (555) 123-4567',
    mobilePhone: '+1 (555) 987-6543',
    address: '123 Main St, Anytown, USA 12345',
    permanentAddress: '456 Second St, Hometown, USA 12345',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+1 (555) 987-6543',
    emergencyRelation: 'Sister',
    department: 'Administration',
    position: 'Senior Administrator',
    employeeId: 'EMP001',
    joinDate: '2023-01-01',
    workLocation: 'Head Office',
    reportingTo: 'John Smith',
    workSchedule: '9:00 AM - 6:00 PM',
    employmentType: 'Full-time',
    contractEnd: '2024-12-31',
    skills: 'Project Management, Data Analysis, Team Leadership',
    languages: 'English (Native), Spanish (Fluent), French (Basic)',
    education: 'MBA in Business Administration - XYZ University (2015)',
    certifications: 'PMP Certified (2020), Agile Scrum Master (2021)',
    theme: 'Light',
    notifications: true,
    language: 'English',
    timeZone: 'UTC-5'
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Saving profile data:', profileData);
  };

  const renderEditableField = (label, field, value, type = 'text') => {
    return (
      <div className="profile-field">
        <label>{label}:</label>
        {isEditing ? (
          <input
            type={type}
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="editable-input"
          />
        ) : (
          <span className="field-value">{value}</span>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard">
      <Sidebar onHoverChange={setIsSidebarHovered} />
      <main className={`main-content ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
        <div className="profile-container">
          <div className="profile-header">
            <h1 className="page-title">Profile</h1>
            <div className="profile-actions-top">
              {isEditing ? (
                <>
                  <button className="profile-btn save" onClick={handleSave}>
                    <span className="material-symbols-outlined">save</span>
                    Save Changes
                  </button>
                  <button className="profile-btn cancel" onClick={() => setIsEditing(false)}>
                    <span className="material-symbols-outlined">close</span>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="profile-btn edit" onClick={() => setIsEditing(true)}>
                  <span className="material-symbols-outlined">edit</span>
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-section personal-info">
              <div className="profile-pic-container">
                <img src={profilePic} alt="Profile" className="profile-avatar" />
                {isEditing && (
                  <div className="profile-pic-overlay">
                    <label htmlFor="profile-pic-upload" className="profile-pic-edit-btn">
                      <span className="material-symbols-outlined">edit</span>
                      Change Photo
                    </label>
                    <input 
                      type="file" 
                      id="profile-pic-upload" 
                      accept="image/*" 
                      onChange={handleProfilePicChange} 
                      style={{ display: 'none' }}
                    />
                  </div>
                )}
              </div>
              
              <div className="info-container">
                {renderEditableField('First Name', 'firstName', profileData.firstName)}
                {renderEditableField('Last Name', 'lastName', profileData.lastName)}
                {renderEditableField('Role', 'role', profileData.role)}
              </div>
            </div>

            <div className="profile-section">
              <h2>Personal Information</h2>
              {renderEditableField('Date of Birth', 'dateOfBirth', profileData.dateOfBirth, 'date')}
              {renderEditableField('Nationality', 'nationality', profileData.nationality)}
              {renderEditableField('Gender', 'gender', profileData.gender)}
              {renderEditableField('Civil Status', 'civilStatus', profileData.civilStatus)}
            </div>

            <div className="profile-section">
              <h2>Contact Information</h2>
              {renderEditableField('Email', 'email', profileData.email, 'email')}
              {renderEditableField('Alternative Email', 'alternativeEmail', profileData.alternativeEmail, 'email')}
              {renderEditableField('Phone', 'phone', profileData.phone, 'tel')}
              {renderEditableField('Mobile Phone', 'mobilePhone', profileData.mobilePhone, 'tel')}
              {renderEditableField('Address', 'address', profileData.address)}
              {renderEditableField('Permanent Address', 'permanentAddress', profileData.permanentAddress)}
            </div>

            <div className="profile-section">
              <h2>Emergency Contact</h2>
              {renderEditableField('Contact Person', 'emergencyContact', profileData.emergencyContact)}
              {renderEditableField('Contact Number', 'emergencyPhone', profileData.emergencyPhone, 'tel')}
              {renderEditableField('Relationship', 'emergencyRelation', profileData.emergencyRelation)}
            </div>

            <div className="profile-section">
              <h2>Work Information</h2>
              {renderEditableField('Department', 'department', profileData.department)}
              {renderEditableField('Position', 'position', profileData.position)}
              {renderEditableField('Employee ID', 'employeeId', profileData.employeeId)}
              {renderEditableField('Join Date', 'joinDate', profileData.joinDate, 'date')}
              {renderEditableField('Work Location', 'workLocation', profileData.workLocation)}
              {renderEditableField('Reporting To', 'reportingTo', profileData.reportingTo)}
              {renderEditableField('Work Schedule', 'workSchedule', profileData.workSchedule)}
              {renderEditableField('Employment Type', 'employmentType', profileData.employmentType)}
              {renderEditableField('Contract End Date', 'contractEnd', profileData.contractEnd, 'date')}
            </div>

            <div className="profile-section">
              <h2>Skills & Languages</h2>
              {renderEditableField('Skills', 'skills', profileData.skills)}
              {renderEditableField('Languages', 'languages', profileData.languages)}
            </div>

            <div className="profile-section">
              <h2>Education & Certifications</h2>
              {renderEditableField('Education', 'education', profileData.education)}
              {renderEditableField('Certifications', 'certifications', profileData.certifications)}
            </div>

            <div className="profile-section">
              <h2>System Preferences</h2>
              {renderEditableField('Theme', 'theme', profileData.theme)}
              {renderEditableField('Language', 'language', profileData.language)}
              {renderEditableField('Time Zone', 'timeZone', profileData.timeZone)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
