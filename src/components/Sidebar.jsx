import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/Sidebar.css';
import logo from '../assets/media/logo.png';
import profile from '../assets/media/profilepic.jpg';

const Sidebar = ({ onHoverChange }) => {
  const navigate = useNavigate();
  const [contentDropdownOpen, setContentDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirm = () => {
    // Implement logout logic here (e.g., clear session, tokens, etc.)
    setShowLogoutConfirmation(false);
    navigate('/');
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false);
  };

  useEffect(() => {
    if (typeof onHoverChange === 'function') {
      onHoverChange(isHovered);
    }
  }, [isHovered, onHoverChange]);

  return (
    <>
      <aside 
        className={`sidebar ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="sidebar-header">
          <img src={logo} alt="Eye logo" />
          <h2>MotionSync</h2>
        </div>
        <ul className="sidebar-links">
          <li className={`sidebar-section ${isHovered ? '' : 'divider'}`}>
            <h4>{isHovered ? <><span>Main Menu</span><div className="menu-separator"></div></> : null}</h4>
          </li>
          <li>
            <Link to="/dashboard"><span className="material-symbols-outlined">dashboard</span>Dashboard</Link>
          </li>
          <li>
            <Link to="/users"><span className="material-symbols-outlined">person</span>Users</Link>
          </li>
          <li>
            <Link to="/hubs"><span className="material-symbols-outlined">school</span>Hubs</Link>
          </li>
          <li className={`sidebar-section ${isHovered ? '' : 'divider'}`}>
            <h4>{isHovered ? <><span>General</span><div className="menu-separator"></div></> : null}</h4>
          </li>
          <li>
            <Link to="/translation"><span className="material-symbols-outlined">sign_language</span>Translation</Link>
          </li>
          <li>
            <a href="#" onClick={() => setContentDropdownOpen(!contentDropdownOpen)}>
              <span className="material-symbols-outlined">article</span>
              Contents
              {isHovered && (
                <span className="material-symbols-outlined dropdown-arrow">
                  {contentDropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
              )}
            </a>
            {contentDropdownOpen && isHovered && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/user-content">
                    <span className="material-symbols-outlined">person_pin</span>
                    Users Content
                  </Link>
                </li>
                <li>
                  <Link to="/hub-content">
                    <span className="material-symbols-outlined">school</span>
                    Hubs Content
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link to="/analytics"><span className="material-symbols-outlined">analytics</span>Analytics</Link>
          </li>
          <li>
            <Link to="/notifications"><span className="material-symbols-outlined">notifications</span>Notifications</Link>
          </li>
          <li className={`sidebar-section ${isHovered ? '' : 'divider'}`}>
            <h4>{isHovered ? <><span>Account</span><div className="menu-separator"></div></> : null}</h4>
          </li>
          <li>
            <Link to="/profile"><span className="material-symbols-outlined">account_circle</span>Profile</Link>
          </li>
          <li>
            <Link to="/settings"><span className="material-symbols-outlined">settings</span>Settings</Link>
          </li>
          <li>
            <a href="#" onClick={handleLogoutClick}><span className="material-symbols-outlined">logout</span>Logout</a>
          </li>
        </ul>
        <div className="user-account">
          <div className="user-profile">
            <img src={profile} alt="Profile Image" />
            <div className="user-detail">
              <h3>Joven my love</h3>
              <span>Super Admin</span>
            </div>
          </div>
        </div>
      </aside>
      {showLogoutConfirmation && (
        <div className="logout-confirmation-modal">
          <div className="logout-confirmation-content">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="logout-confirmation-buttons">
              <button onClick={handleLogoutConfirm} className="confirm-btn">Confirm</button>
              <button onClick={handleLogoutCancel} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
