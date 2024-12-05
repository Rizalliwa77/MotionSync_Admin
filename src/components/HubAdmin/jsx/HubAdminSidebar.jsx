import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/HubAdminSidebar.css';
import logo from '../../../assets/media/logo.png';
import profileImg from '../media/green ranger.jpg';

const HubAdminSidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Add any logout logic here (e.g., clearing session, tokens, etc.)
    navigate('/login');
    setShowLogoutModal(false);
  };

  return (
    <>
      <aside 
        className={`sidebar ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="sidebar-header">
          <img src={logo} alt="MotionSync Logo" />
          <h2>MotionSync</h2>
        </div>

        <div className="menu-separator"></div>

        <ul className="sidebar-links">
          <li className="section-header">
            <h4>Main Menu</h4>
          </li>
          <li>
            <Link to="/hub-admin/dashboard" className={location.pathname === '/hub-admin/dashboard' ? 'active' : ''}>
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/hub-admin/students" className={location.pathname === '/hub-admin/students' ? 'active' : ''}>
              <span className="material-symbols-outlined">school</span>
              <span>List of Students</span>
            </Link>
          </li>
          <li>
            <Link to="/hub-admin/educators" className={location.pathname === '/hub-admin/educators' ? 'active' : ''}>
              <span className="material-symbols-outlined">groups</span>
              <span>List of Educators</span>
            </Link>
          </li>

          <div className="menu-separator"></div>

          <li className="section-header">
            <h4>Management</h4>
          </li>
          <li>
            <Link to="/hub-admin/content" className={location.pathname === '/hub-admin/content' ? 'active' : ''}>
              <span className="material-symbols-outlined">article</span>
              <span>Content Management</span>
            </Link>
          </li>
          <li>
            <Link to="/hub-admin/classroom" className={location.pathname === '/hub-admin/classroom' ? 'active' : ''}>
              <span className="material-symbols-outlined">meeting_room</span>
              <span>Classroom</span>
            </Link>
          </li>
          <li>
            <Link to="/hub-admin/messages" className={location.pathname === '/hub-admin/messages' ? 'active' : ''}>
              <span className="material-symbols-outlined">mail</span>
              <span>Messages</span>
            </Link>
          </li>

          <div className="menu-separator"></div>

          <li className="section-header">
            <h4>Account</h4>
          </li>
          <li>
            <Link to="/hub-admin/profile" className={location.pathname === '/hub-admin/profile' ? 'active' : ''}>
              <span className="material-symbols-outlined">person</span>
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/hub-admin/settings" className={location.pathname === '/hub-admin/settings' ? 'active' : ''}>
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <a href="#" onClick={handleLogout}>
              <span className="material-symbols-outlined">logout</span>
              <span>Logout</span>
            </a>
          </li>
        </ul>

        <div className="user-account">
          <div className="user-profile">
            <img src={profileImg} alt="Hub Admin Profile" />
            <div className="user-detail">
              <h3>Hub Admin</h3>
              <span>Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      {showLogoutModal && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to logout?</p>
            <div className="logout-modal-buttons">
              <button onClick={confirmLogout}>Yes, Logout</button>
              <button onClick={() => setShowLogoutModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HubAdminSidebar;