import React, { useState } from 'react';
import '../../assets/Account/Settings.css';
import Sidebar from '../Sidebar';

const Settings = () => {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [activeTab, setActiveTab] = useState('mainMenu');
  const [allowRegistrations, setAllowRegistrations] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);

  const handleSave = () => {
    console.log('Saving settings...');
  };

  return (
    <div className="dashboard">
      <Sidebar onHoverChange={setIsSidebarHovered} />
      <main className={`main-content ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
        <div className="settings-page">
          <h1 className="settings-header">SETTINGS</h1>
          
          <div className="settings-layout">
            {/* Left Navigation */}
            <div className="settings-sidebar">
              <div 
                className={`sidebar-item ${activeTab === 'mainMenu' ? 'active' : ''}`}
                onClick={() => setActiveTab('mainMenu')}
              >
                Main Menu
              </div>
              <div 
                className={`sidebar-item ${activeTab === 'general' ? 'active' : ''}`}
                onClick={() => setActiveTab('general')}
              >
                General
              </div>
              <div 
                className={`sidebar-item ${activeTab === 'account' ? 'active' : ''}`}
                onClick={() => setActiveTab('account')}
              >
                Account
              </div>
            </div>

            {/* Main Content Area */}
            <div className="settings-main">
              {activeTab === 'mainMenu' && (
                <div className="settings-grid">
                  <div className="settings-card">
                    <h2>Dashboard Preferences</h2>
                    <div className="form-group">
                      <label>Default View</label>
                      <select className="form-control">
                        <option value="summary">Summary</option>
                        <option value="detailed">Detailed</option>
                      </select>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h2>User Management</h2>
                    <div className="form-group">
                      <label>Default User Role</label>
                      <select className="form-control">
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                      </select>
                    </div>
                    <div className="toggle-group">
                      <label className="toggle">
                        <input 
                          type="checkbox"
                          checked={allowRegistrations}
                          onChange={(e) => setAllowRegistrations(e.target.checked)}
                        />
                        <span className="toggle-label">Allow new user registrations</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'general' && (
                <div className="settings-grid">
                  <div className="settings-card">
                    <h2>Translation Settings</h2>
                    <div className="form-group">
                      <label>Default Source Language</label>
                      <select className="form-control">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Default Target Language</label>
                      <select className="form-control">
                        <option value="asl">American Sign Language</option>
                        <option value="bsl">British Sign Language</option>
                      </select>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h2>System Preferences</h2>
                    <div className="form-group">
                      <label>Time Zone</label>
                      <select className="form-control">
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Time</option>
                        <option value="PST">Pacific Time</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Date Format</label>
                      <select className="form-control">
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="settings-grid">
                  <div className="settings-card">
                    <h2>Profile Information</h2>
                    <div className="form-group">
                      <label>Display Name</label>
                      <input type="text" className="form-control" placeholder="Enter display name" />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" className="form-control" placeholder="Enter email address" />
                    </div>
                    <div className="form-group">
                      <label>Language</label>
                      <select className="form-control">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                      </select>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h2>Notifications</h2>
                    <div className="toggle-group">
                      <label className="toggle">
                        <input 
                          type="checkbox"
                          checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                        />
                        <span className="toggle-label">Email Notifications</span>
                      </label>
                    </div>
                    <div className="toggle-group">
                      <label className="toggle">
                        <input 
                          type="checkbox"
                          checked={pushNotifications}
                          onChange={(e) => setPushNotifications(e.target.checked)}
                        />
                        <span className="toggle-label">Push Notifications</span>
                      </label>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h2>Security</h2>
                    <div className="form-group">
                      <label>Current Password</label>
                      <input type="password" className="form-control" placeholder="Enter current password" />
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <input type="password" className="form-control" placeholder="Enter new password" />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input type="password" className="form-control" placeholder="Confirm new password" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="settings-footer">
            <button className="save-button" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
