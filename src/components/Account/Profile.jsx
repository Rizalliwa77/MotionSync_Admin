import React, { useState } from 'react';
import '../../assets/Account/Profile.css';
import Sidebar from '../Sidebar';
import profileImage from '/media/profile.jpg'; // Update this path if necessary

const Profile = () => {
    const [profilePic, setProfilePic] = useState(profileImage);
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  
    const profileData = {
      firstName: 'Joven',
      lastName: 'MyLove',
      role: 'Super Admin',
      email: 'joven.mylove@example.com',
      phone: '+1 (555) 123-4567',
      department: 'Administration',
      joinDate: 'January 1, 2023',
      lastLogin: 'May 15, 2023, 10:30 AM',
      address: '123 Main St, Anytown, USA 12345',
      emergencyContact: 'Jane Doe: +1 (555) 987-6543',
      skills: ['Project Management', 'Data Analysis', 'Team Leadership', 'Strategic Planning', 'Agile Methodologies'],
      languages: ['English (Native)', 'Spanish (Fluent)', 'French (Basic)', 'Mandarin (Beginner)'],
      education: 'MBA in Business Administration, XYZ University',
      certifications: ['PMP Certified', 'Agile Scrum Master', 'Six Sigma Green Belt'],
      recentActivity: [
        { action: 'Updated user permissions', date: 'May 14, 2023' },
        { action: 'Approved new content', date: 'May 13, 2023' },
        { action: 'Generated monthly report', date: 'May 1, 2023' },
      ],
      projects: [
        { name: 'Project Alpha', role: 'Project Manager', status: 'In Progress' },
        { name: 'Beta Initiative', role: 'Team Lead', status: 'Completed' },
        { name: 'Gamma Launch', role: 'Consultant', status: 'Planning' },
      ],
      performance: {
        rating: 4.8,
        lastReview: 'December 15, 2022',
        nextReview: 'June 15, 2023',
      },
      trainingCourses: [
        { name: 'Advanced Leadership Skills', completionDate: 'March 10, 2023' },
        { name: 'Data Analytics for Managers', completionDate: 'November 5, 2022' },
        { name: 'Effective Communication in the Workplace', completionDate: 'August 20, 2022' },
      ],
      socialMedia: {
        linkedin: 'linkedin.com/in/jovenmylove',
        twitter: '@jovenmylove',
        github: 'github.com/jovenmylove',
      },
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
  
    return (
      <div className="dashboard">
        <Sidebar onHoverChange={setIsSidebarHovered} />
        <main className={`main-content ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
          <div className="profile-container">
            <h1 className="page-title">Profile</h1>
            <div className="profile-content">
              <div className="profile-card profile-header-card">
                <div className="profile-header">
                  <div className="profile-pic-container">
                    <img src={profilePic} alt="Profile" className="profile-avatar" />
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
                  </div>
                  <div className="profile-info">
                    <h2 className="profile-name">{`${profileData.firstName} ${profileData.lastName}`}</h2>
                    <p className="profile-role">{profileData.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="profile-card">
                <h3>Contact Information</h3>
                <p><strong>Email:</strong> {profileData.email}</p>
                <p><strong>Phone:</strong> {profileData.phone}</p>
                <p><strong>Address:</strong> {profileData.address}</p>
                <p><strong>Emergency Contact:</strong> {profileData.emergencyContact}</p>
              </div>
              
              <div className="profile-card">
                <h3>Work Information</h3>
                <p><strong>Department:</strong> {profileData.department}</p>
                <p><strong>Join Date:</strong> {profileData.joinDate}</p>
                <p><strong>Last Login:</strong> {profileData.lastLogin}</p>
              </div>
              
              <div className="profile-card">
                <h3>Skills & Languages</h3>
                <p><strong>Skills:</strong> {profileData.skills.join(', ')}</p>
                <p><strong>Languages:</strong> {profileData.languages.join(', ')}</p>
              </div>
              
              <div className="profile-card">
                <h3>Education & Certifications</h3>
                <p><strong>Education:</strong> {profileData.education}</p>
                <p><strong>Certifications:</strong> {profileData.certifications.join(', ')}</p>
              </div>
              
              <div className="profile-card">
                <h3>Recent Activity</h3>
                <ul className="activity-list">
                  {profileData.recentActivity.map((activity, index) => (
                    <li key={index}>
                      <span>{activity.action}</span>
                      <span className="activity-date">{activity.date}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="profile-card">
                <h3>Current Projects</h3>
                <ul className="project-list">
                  {profileData.projects.map((project, index) => (
                    <li key={index}>
                      <strong>{project.name}</strong>
                      <p>Role: {project.role}</p>
                      <p>Status: {project.status}</p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="profile-card">
                <h3>Performance</h3>
                <p><strong>Current Rating:</strong> {profileData.performance.rating}/5</p>
                <p><strong>Last Review:</strong> {profileData.performance.lastReview}</p>
                <p><strong>Next Review:</strong> {profileData.performance.nextReview}</p>
              </div>
              
              <div className="profile-card">
                <h3>Training & Development</h3>
                <ul className="training-list">
                  {profileData.trainingCourses.map((course, index) => (
                    <li key={index}>
                      <strong>{course.name}</strong>
                      <p>Completed: {course.completionDate}</p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="profile-card">
                <h3>Social Media</h3>
                <p><strong>LinkedIn:</strong> <a href={`https://${profileData.socialMedia.linkedin}`} target="_blank" rel="noopener noreferrer">{profileData.socialMedia.linkedin}</a></p>
                <p><strong>Twitter:</strong> <a href={`https://twitter.com/${profileData.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer">{profileData.socialMedia.twitter}</a></p>
                <p><strong>GitHub:</strong> <a href={`https://${profileData.socialMedia.github}`} target="_blank" rel="noopener noreferrer">{profileData.socialMedia.github}</a></p>
              </div>
              
              <div className="profile-card">
                <h3>Actions</h3>
                <div className="profile-actions">
                  <button className="profile-btn">
                    <span className="material-symbols-outlined">edit</span>
                    Edit Profile
                  </button>
                  <button className="profile-btn">
                    <span className="material-symbols-outlined">lock</span>
                    Change Password
                  </button>
                  <button className="profile-btn">
                    <span className="material-symbols-outlined">logout</span>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };
  
  export default Profile;
