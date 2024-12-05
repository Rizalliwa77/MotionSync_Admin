import React, { useState } from 'react';
import HubAdminSidebar from '../HubAdminSidebar';
import '../../styles/Account/HubAdmin_Profile.css';
import greenRanger from '../../media/green ranger.jpg';

const ProfileSection = ({ title, children }) => (
    <div className="profile-card">
        <h3>{title}</h3>
        <div className="profile-card-content">
            {children}
        </div>
    </div>
);

const HubAdmin_Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        contact: {
            email: 'juan.delacruz@example.com',
            phone: '+63 912 345 6789',
            address: 'Manila, Philippines'
        },
        work: {
            department: 'Administration',
            position: 'Hub Administrator',
            startDate: '2023-01-01'
        },
        skills: ['Project Management', 'Leadership', 'Communication', 'Problem Solving'],
        languages: ['English', 'Filipino'],
        education: [
            {
                degree: 'Bachelor of Science in Information Technology',
                school: 'University of Manila',
                year: '2022'
            }
        ],
        certifications: [
            {
                name: 'Project Management Professional (PMP)',
                issuer: 'PMI',
                year: '2023'
            }
        ],
        currentProjects: [
            'System Enhancement Project',
            'User Training Program',
            'Documentation Update'
        ],
        performance: {
            rating: '4.8/5.0',
            completedTasks: '156',
            ongoingTasks: '8'
        },
        training: [
            {
                name: 'Advanced Leadership Workshop',
                date: '2024-02',
                status: 'Completed'
            }
        ],
        socialMedia: {
            linkedin: 'linkedin.com/in/juandelacruz',
            twitter: '@juandelacruz'
        }
    });

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        setIsEditing(false);
        // Add save logic here
    };

    const handleChange = (section, field, value) => {
        setProfileData((prevData) => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [field]: value
            }
        }));
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <HubAdminSidebar />
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-info">
                        <div className="profile-avatar-container">
                            <div className="profile-avatar">
                                <img src={greenRanger} alt="Profile" />
                                <div className="avatar-overlay">
                                    <span>Change Photo</span>
                                </div>
                            </div>
                        </div>
                        <div className="profile-title">
                            <h2>Juan Dela Cruz</h2>
                            <p className="role">Hub Admin</p>
                            <div className="profile-status">
                                <span className="status-indicator active"></span>
                                Active
                            </div>
                        </div>
                    </div>
                    <div className="profile-actions">
                        {isEditing ? (
                            <button className="save-btn" onClick={handleSave}>Save Changes</button>
                        ) : (
                            <button className="edit-btn" onClick={handleEdit}>Edit Profile</button>
                        )}
                    </div>
                </div>

                <div className="profile-content">
                    <ProfileSection title="Contact Information">
                        <div className="info-grid">
                            <div className="info-item">
                                <i className="fas fa-envelope"></i>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={profileData.contact.email}
                                        onChange={(e) => handleChange('contact', 'email', e.target.value)}
                                    />
                                ) : (
                                    <span>{profileData.contact.email}</span>
                                )}
                            </div>
                            <div className="info-item">
                                <i className="fas fa-phone"></i>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.contact.phone}
                                        onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                                    />
                                ) : (
                                    <span>{profileData.contact.phone}</span>
                                )}
                            </div>
                            <div className="info-item">
                                <i className="fas fa-map-marker-alt"></i>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.contact.address}
                                        onChange={(e) => handleChange('contact', 'address', e.target.value)}
                                    />
                                ) : (
                                    <span>{profileData.contact.address}</span>
                                )}
                            </div>
                        </div>
                    </ProfileSection>

                    <ProfileSection title="Work Information">
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Department</label>
                                <span>{profileData.work.department}</span>
                            </div>
                            <div className="info-item">
                                <label>Position</label>
                                <span>{profileData.work.position}</span>
                            </div>
                            <div className="info-item">
                                <label>Start Date</label>
                                <span>{new Date(profileData.work.startDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </ProfileSection>

                    <ProfileSection title="Skills & Languages">
                        <div className="skills-container">
                            {profileData.skills.map((skill, index) => (
                                <span key={index} className="skill-tag">{skill}</span>
                            ))}
                        </div>
                        <div className="languages-container">
                            {profileData.languages.map((language, index) => (
                                <span key={index} className="language-tag">{language}</span>
                            ))}
                        </div>
                    </ProfileSection>

                    <ProfileSection title="Education & Certifications">
                        {profileData.education.map((edu, index) => (
                            <div key={index} className="education-item">
                                <h4>{edu.degree}</h4>
                                <p>{edu.school} - {edu.year}</p>
                            </div>
                        ))}
                        <div className="certifications">
                            {profileData.certifications.map((cert, index) => (
                                <div key={index} className="cert-item">
                                    <h4>{cert.name}</h4>
                                    <p>{cert.issuer} - {cert.year}</p>
                                </div>
                            ))}
                        </div>
                    </ProfileSection>

                    <ProfileSection title="Current Projects">
                        <div className="projects-list">
                            {profileData.currentProjects.map((project, index) => (
                                <div key={index} className="project-item">
                                    <span className="project-name">{project}</span>
                                </div>
                            ))}
                        </div>
                    </ProfileSection>

                    <ProfileSection title="Performance">
                        <div className="performance-stats">
                            <div className="stat-item">
                                <label>Rating</label>
                                <span className="rating">{profileData.performance.rating}</span>
                            </div>
                            <div className="stat-item">
                                <label>Completed Tasks</label>
                                <span>{profileData.performance.completedTasks}</span>
                            </div>
                            <div className="stat-item">
                                <label>Ongoing Tasks</label>
                                <span>{profileData.performance.ongoingTasks}</span>
                            </div>
                        </div>
                    </ProfileSection>

                    <ProfileSection title="Training & Development">
                        <div className="training-list">
                            {profileData.training.map((item, index) => (
                                <div key={index} className="training-item">
                                    <span className="training-name">{item.name}</span>
                                    <span className="training-date">{item.date}</span>
                                    <span className={`training-status ${item.status.toLowerCase()}`}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </ProfileSection>

                    <ProfileSection title="Social Media">
                        <div className="social-links">
                            <a href={profileData.socialMedia.linkedin} className="social-link linkedin">
                                <i className="fab fa-linkedin"></i>
                                LinkedIn Profile
                            </a>
                            <a href={profileData.socialMedia.twitter} className="social-link twitter">
                                <i className="fab fa-twitter"></i>
                                Twitter Profile
                            </a>
                        </div>
                    </ProfileSection>

                    <ProfileSection title="Actions">
                        <div className="action-buttons">
                            <button className="action-btn">Generate Report</button>
                            <button className="action-btn">Export Data</button>
                            <button className="action-btn danger">Reset Password</button>
                        </div>
                    </ProfileSection>
                </div>
            </div>
        </div>
    );
};

export default HubAdmin_Profile;