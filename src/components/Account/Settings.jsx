import React, { useState } from 'react';
import '../../assets/Account/Settings.css';
import Sidebar from '../Sidebar';
import { Link } from 'react-router-dom';
const Settings = () => {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [currentAction, setCurrentAction] = useState('');

  const handleAction = (action) => {
    setCurrentAction(action);
    setShowAdminPassword(true);
  };

  const handleAdminPasswordSubmit = (e) => {
    e.preventDefault();
    // Here you would typically validate the admin password
    console.log(`Action ${currentAction} confirmed with admin password:`, adminPassword);
    
    // Perform the action based on currentAction
    switch (currentAction) {
      case 'save':
        console.log('Saving changes');
        // Implement save changes logic
        break;
      case 'recentUpdate':
        console.log('Reverting to recent update');
        // Implement revert to recent update logic
        break;
      case 'default':
        console.log('Reverting to default settings');
        // Implement revert to default settings logic
        break;
      default:
        console.log('Unknown action');
    }

    setShowAdminPassword(false);
    setAdminPassword('');
    setCurrentAction('');
  };

  const handleAdminPasswordCancel = () => {
    setShowAdminPassword(false);
    setAdminPassword('');
    setCurrentAction('');
  };

  return (
    <div className="dashboard">
      <Sidebar onHoverChange={setIsSidebarHovered} />
      <main className={`main-content ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
        <div className={`settings-container ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
          <h1 className="page-title">Settings</h1>
          <div className="navigation-links">
          </div>
          <div className="settings-content">
            <div className="settings-group">
              <h2>Main Menu</h2>
              <div className="settings-card">
                <h3>Dashboard</h3>
                <div className="setting-item">
                  <label>Default View:</label>
                  <select>
                    <option value="summary">Summary</option>
                    <option value="detailed">Detailed</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
              <div className="settings-card">
                <h3>Users</h3>
                <div className="setting-item">
                  <label>Default User Role:</label>
                  <select>
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>User Registration:</label>
                  <input type="checkbox" /> Allow new user registrations
                </div>
              </div>
              <div className="settings-card">
                <h3>Hubs</h3>
                <div className="setting-item">
                  <label>Default Hub Visibility:</label>
                  <select>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Hub Creation:</label>
                  <input type="checkbox" /> Allow users to create hubs
                </div>
              </div>
            </div>
            <div className="settings-group">
              <h2>General</h2>
              <div className="settings-card">
                <h3>Translation</h3>
                <div className="setting-item">
                  <label>Default Source Language:</label>
                  <select>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Default Target Language:</label>
                  <select>
                    <option value="asl">American Sign Language</option>
                    <option value="bsl">British Sign Language</option>
                  </select>
                </div>
              </div>
              <div className="settings-card">
                <h3>Content</h3>
                <div className="setting-item">
                  <label>Content Approval:</label>
                  <input type="checkbox" /> Require approval for user-generated content
                </div>
                <div className="setting-item">
                  <label>File Upload Limit:</label>
                  <input type="number" /> MB
                </div>
              </div>
              <div className="settings-card">
                <h3>Analytics</h3>
                <div className="setting-item">
                  <label>Data Collection:</label>
                  <input type="checkbox" /> Enable user activity tracking
                </div>
                <div className="setting-item">
                  <label>Report Generation:</label>
                  <select>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="settings-group">
              <h2>Account</h2>
              <div className="settings-card">
                <h3>Profile</h3>
                <div className="setting-item">
                  <label>Language:</label>
                  <select>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Time Zone:</label>
                  <select>
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Standard Time</option>
                    <option value="PST">Pacific Standard Time</option>
                  </select>
                </div>
              </div>
              <div className="settings-card">
                <h3>Notifications</h3>
                <div className="setting-item">
                  <label>Email Notifications:</label>
                  <input type="checkbox" /> Enable email notifications
                </div>
                <div className="setting-item">
                  <label>Push Notifications:</label>
                  <input type="checkbox" /> Enable push notifications
                </div>
              </div>
            </div>
          </div>
          <div className="settings-actions">
            <button className="settings-btn" onClick={() => handleAction('save')}>Save Changes</button>
            <button className="settings-btn" onClick={() => handleAction('recentUpdate')}>Back to Recent Update</button>
            <button className="settings-btn" onClick={() => handleAction('default')}>Back to Default</button>
          </div>
        </div>
      </main>
      {showAdminPassword && (
        <div className="admin-password-modal">
          <div className="admin-password-content">
            <h2>Enter Admin Password</h2>
            <p>{getActionMessage(currentAction)}</p>
            <form onSubmit={handleAdminPasswordSubmit}>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Admin Password"
                required
              />
              <div className="admin-password-buttons">
                <button type="submit" className="confirm-btn">Confirm</button>
                <button type="button" className="cancel-btn" onClick={handleAdminPasswordCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function getActionMessage(action) {
  switch (action) {
    case 'save':
      return 'Please confirm to save changes.';
    case 'recentUpdate':
      return 'Please confirm to revert to the most recent update.';
    case 'default':
      return 'Please confirm to revert to default settings.';
    default:
      return 'Please confirm your action.';
  }
}

export default Settings;
