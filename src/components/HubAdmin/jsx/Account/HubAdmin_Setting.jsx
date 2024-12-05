import React, { useState } from 'react';
import HubAdminSidebar from '../HubAdminSidebar';
import '../../styles/Account/HubAdmin_Setting.css';

const Modal = ({ message, onClose }) => (
    <div className="modal">
        <div className="modal-content">
            <span className="close" onClick={onClose}>&times;</span>
            <p>{message}</p>
        </div>
    </div>
);

const SettingsSection = ({ title, options, onOptionChange, selectedOptions }) => (
    <div className="settings-option-container">
        <h3>{title}</h3>
        {options.map((option) => (
            <div key={option.id} className="settings-option">
                <label className="settings-label">
                    {option.type === 'checkbox' ? (
                        <input
                            type="checkbox"
                            checked={selectedOptions[option.id] || false}
                            onChange={(e) => onOptionChange(option.id, e.target.checked)}
                        />
                    ) : option.type === 'select' ? (
                        <select
                            value={selectedOptions[option.id] || ''}
                            onChange={(e) => onOptionChange(option.id, e.target.value)}
                        >
                            {option.choices.map((choice) => (
                                <option key={choice} value={choice}>{choice}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={option.type}
                            value={selectedOptions[option.id] || ''}
                            onChange={(e) => onOptionChange(option.id, e.target.value)}
                        />
                    )}
                    {option.label}
                </label>
            </div>
        ))}
    </div>
);

const HubAdmin_Setting = () => {
    const [selectedOptions, setSelectedOptions] = useState({});
    const [initialOptions, setInitialOptions] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // Settings configuration for each section
    const settingsConfig = {
        mainMenu: {
            dashboard: [
                { id: 'dashboardLayout', label: 'Dashboard Layout', type: 'select', choices: ['Grid', 'List', 'Compact'] },
                { id: 'showStatistics', label: 'Show Statistics', type: 'checkbox' },
                { id: 'refreshRate', label: 'Auto-refresh Rate (minutes)', type: 'number' }
            ],
            users: [
                { id: 'userDisplayFormat', label: 'Display Format', type: 'select', choices: ['Detailed', 'Compact', 'List'] },
                { id: 'showUserStatus', label: 'Show Online Status', type: 'checkbox' }
            ],
            educators: [
                { id: 'educatorSorting', label: 'Default Sorting', type: 'select', choices: ['Name', 'Experience', 'Rating'] },
                { id: 'showCredentials', label: 'Show Credentials', type: 'checkbox' }
            ]
        },
        general: {
            content: [
                { id: 'contentLayout', label: 'Content Layout', type: 'select', choices: ['Grid', 'List'] },
                { id: 'autoSave', label: 'Enable Auto-save', type: 'checkbox' }
            ],
            classrooms: [
                { id: 'classSize', label: 'Default Class Size', type: 'number' },
                { id: 'allowWaitlist', label: 'Enable Waitlist', type: 'checkbox' }
            ]
        },
        account: {
            profile: [
                { id: 'profileVisibility', label: 'Profile Visibility', type: 'select', choices: ['Public', 'Private', 'Friends Only'] },
                { id: 'showEmail', label: 'Show Email', type: 'checkbox' }
            ],
            notifications: [
                { id: 'emailNotifications', label: 'Email Notifications', type: 'checkbox' },
                { id: 'pushNotifications', label: 'Push Notifications', type: 'checkbox' },
                { id: 'notificationSound', label: 'Notification Sound', type: 'select', choices: ['Default', 'Silent', 'Chime'] }
            ]
        }
    };

    const handleOptionChange = (id, value) => {
        setSelectedOptions(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const hasChanges = () => {
        return JSON.stringify(selectedOptions) !== JSON.stringify(initialOptions);
    };

    const handleSaveChanges = () => {
        setInitialOptions(selectedOptions);
        setModalMessage('Settings saved successfully!');
        setShowModal(true);
    };

    const handleBackToRecent = () => {
        setSelectedOptions(initialOptions);
        setModalMessage('Reverted to recent settings');
        setShowModal(true);
    };

    const handleBackToDefault = () => {
        setSelectedOptions({});
        setInitialOptions({});
        setModalMessage('Reverted to default settings');
        setShowModal(true);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <HubAdminSidebar />
            <div className="settings-main-container">
                <h1>Settings</h1>
                
                <div className="settings-content">
                    {/* Main Menu Section */}
                    <div className="settings-card">
                        <h2>Main Menu</h2>
                        <div className="settings-links">
                            <SettingsSection 
                                title="Dashboard"
                                options={settingsConfig.mainMenu.dashboard}
                                onOptionChange={handleOptionChange}
                                selectedOptions={selectedOptions}
                            />
                            <SettingsSection 
                                title="Users"
                                options={settingsConfig.mainMenu.users}
                                onOptionChange={handleOptionChange}
                                selectedOptions={selectedOptions}
                            />
                            <SettingsSection 
                                title="Educators"
                                options={settingsConfig.mainMenu.educators}
                                onOptionChange={handleOptionChange}
                                selectedOptions={selectedOptions}
                            />
                        </div>
                    </div>

                    {/* General Section */}
                    <div className="settings-card">
                        <h2>General</h2>
                        <div className="settings-links">
                            <SettingsSection 
                                title="Content"
                                options={settingsConfig.general.content}
                                onOptionChange={handleOptionChange}
                                selectedOptions={selectedOptions}
                            />
                            <SettingsSection 
                                title="Classrooms"
                                options={settingsConfig.general.classrooms}
                                onOptionChange={handleOptionChange}
                                selectedOptions={selectedOptions}
                            />
                        </div>
                    </div>

                    {/* Account Section */}
                    <div className="settings-card">
                        <h2>Account</h2>
                        <div className="settings-links">
                            <SettingsSection 
                                title="Profile"
                                options={settingsConfig.account.profile}
                                onOptionChange={handleOptionChange}
                                selectedOptions={selectedOptions}
                            />
                            <SettingsSection 
                                title="Notifications"
                                options={settingsConfig.account.notifications}
                                onOptionChange={handleOptionChange}
                                selectedOptions={selectedOptions}
                            />
                        </div>
                    </div>
                </div>

                <div className="settings-buttons">
                    <button 
                        className="settings-btn save" 
                        onClick={handleSaveChanges} 
                        disabled={!hasChanges()}
                    >
                        SAVE CHANGES
                    </button>
                    <button 
                        className="settings-btn recent" 
                        onClick={handleBackToRecent}
                    >
                        BACK TO RECENT UPDATE
                    </button>
                    <button 
                        className="settings-btn default" 
                        onClick={handleBackToDefault}
                    >
                        BACK TO DEFAULT
                    </button>
                </div>
            </div>
            {showModal && <Modal message={modalMessage} onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default HubAdmin_Setting;
