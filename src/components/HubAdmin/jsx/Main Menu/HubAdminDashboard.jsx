import React from 'react';
import HubAdminSidebar from '../HubAdminSidebar';
import '../../styles/Main Menu/HubAdminDashboard.css';

const HubAdminDashboard = () => {
  return (
    <div className="hub-admin-layout">
      <HubAdminSidebar />
      <main className="hub-admin-main">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <h2>ASL Learning Hub</h2>
          </div>
          
          <div className="dashboard-grid">
            <div className="dashboard-card user-management">
              <h3>User Management</h3>
              <div className="card-content">
                <div className="stat-number">11</div>
                <p>Current EduMode Users</p>
              </div>
            </div>

            <div className="dashboard-card content-management">
              <h3>Content Management</h3>
              <div className="card-content">
                <div className="stat-number">5</div>
                <p>Pending Approval for: New Module</p>
              </div>
            </div>

            <div className="dashboard-card inbox">
              <h3>Inbox</h3>
              <div className="card-content">
                <div className="message-list">
                  <div className="message-item">
                    <span className="material-symbols-outlined">mail</span>
                    <p>User #2320i | Subject: Password</p>
                  </div>
                  <div className="message-item">
                    <span className="material-symbols-outlined">mail</span>
                    <p>User #7830e | Subject: Schedule</p>
                  </div>
                  <div className="message-item">
                    <span className="material-symbols-outlined">mail</span>
                    <p>User #9742q | Subject: Books</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-card classroom">
              <div className="card-content centered">
                <span className="material-symbols-outlined classroom-icon">groups</span>
                <h3>enter</h3>
                <div className="classroom-text">CLASSROOM</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HubAdminDashboard;