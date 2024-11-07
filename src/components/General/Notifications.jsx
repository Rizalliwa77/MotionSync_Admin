import React, { useState } from 'react';
import '../../assets/General/Notifications.css';
import Sidebar from '../Sidebar';

const Notifications = () => {
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);

    // Sample static notifications data
    const userNotifications = [
        { message: "User John Doe has signed up.", isNew: true },
        { message: "User Jane Smith has updated their profile.", isNew: false },
        { message: "User Mike Johnson has requested a password reset.", isNew: true }
    ];

    const hubNotifications = [
        { message: "New course added to the Sign Language Hub.", isNew: false },
        { message: "Hub 'Hands of Hope' has a new announcement.", isNew: true },
        { message: "User feedback received for the ASL Learning Hub.", isNew: false }
    ];

    const systemNotifications = [
        { message: "System maintenance scheduled for 12 AM - 2 AM.", isNew: true },
        { message: "New features have been deployed.", isNew: false },
        { message: "Security updates applied successfully.", isNew: false }
    ];

    return (
        <div className="dashboard">
            <Sidebar onHoverChange={setIsSidebarHovered} />
            <main className={`main-content ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
                <div className="notifications-container">
                    <h1>Notifications</h1>

                    <div className="notifications-grid">
                        <div className="notification-card">
                            <h2>User Notifications</h2>
                            <ul>
                                {userNotifications.map((notification, index) => (
                                    <li key={index} className={notification.isNew ? 'new-notification' : ''}>
                                        <span className="material-symbols-outlined">person</span>
                                        {notification.message}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="notification-card">
                            <h2>Hub Notifications</h2>
                            <ul>
                                {hubNotifications.map((notification, index) => (
                                    <li key={index} className={notification.isNew ? 'new-notification' : ''}>
                                        <span className="material-symbols-outlined">school</span>
                                        {notification.message}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="notification-card system-notification">
                        <h2>System Notifications</h2>
                        <ul>
                            {systemNotifications.map((notification, index) => (
                                <li key={index} className={notification.isNew ? 'new-notification' : ''}>
                                    <span className="material-symbols-outlined">settings</span>
                                    {notification.message}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Notifications;
