import React, { useState } from 'react';
import '../../assets/General/Translation.css';
import Sidebar from '../Sidebar';

const TranslationManagement = () => {
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const [selectedVersion, setSelectedVersion] = useState('v1.1');
    const [adminCode, setAdminCode] = useState('');
    const [password, setPassword] = useState('');
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [activeTab, setActiveTab] = useState('signToText');

    const versions = [
        { version: 'v1.1', date: '06/07/2024', changes: 'Improved accuracy by 15%', status: 'active' },
        { version: 'v1.0.2', date: '05/23/2024', changes: 'Bug fixes and performance improvements', status: 'archived' },
        { version: 'v1.0.1', date: '05/01/2024', changes: 'Initial bug fixes', status: 'archived' },
        { version: 'v1.0.0', date: '04/20/2024', changes: 'Initial release', status: 'archived' }
    ];

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        // Handle update submission
        console.log('Update submitted:', { adminCode, password });
        setShowUpdateForm(false);
        setAdminCode('');
        setPassword('');
    };

    const handleVersionChange = (version) => {
        setSelectedVersion(version);
    };

    return (
        <div className="dashboard">
            <Sidebar onHoverChange={setIsSidebarHovered} />
            <main className={`main-content ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
                <div className="translation-container">
                    <div className="translation-header">
                        <h1>Translation Management</h1>
                        <div className="header-actions">
                            <button className="refresh-btn">
                                <span className="material-symbols-outlined">refresh</span>
                                Refresh Status
                            </button>
                        </div>
                    </div>

                    <div className="translation-tabs">
                        <button 
                            className={`tab ${activeTab === 'signToText' ? 'active' : ''}`}
                            onClick={() => setActiveTab('signToText')}
                        >
                            Sign Language to Text
                        </button>
                        <button 
                            className={`tab ${activeTab === 'textToSign' ? 'active' : ''}`}
                            onClick={() => setActiveTab('textToSign')}
                        >
                            Text to Sign Language
                        </button>
                    </div>

                    <div className="translation-content">
                        <div className="translation-status">
                            <div className="status-card">
                                <h3>Current Version</h3>
                                <p className="version">{selectedVersion}</p>
                                <span className="status-badge active">Active</span>
                            </div>
                            <div className="status-card">
                                <h3>System Status</h3>
                                <span className="status-badge success">Operational</span>
                                <p className="uptime">Uptime: 99.9%</p>
                            </div>
                            <div className="status-card">
                                <h3>Last Updated</h3>
                                <p>June 7, 2024</p>
                                <p className="time">10:30 AM UTC</p>
                            </div>
                        </div>

                        <div className="translation-grid">
                            <div className="version-control">
                                <h2>Version Control</h2>
                                <div className="version-selector">
                                    <label>Active Algorithm Version</label>
                                    <select 
                                        value={selectedVersion}
                                        onChange={(e) => handleVersionChange(e.target.value)}
                                    >
                                        {versions.map(v => (
                                            <option key={v.version} value={v.version}>
                                                {v.version}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button 
                                    className="update-btn"
                                    onClick={() => setShowUpdateForm(true)}
                                >
                                    <span className="material-symbols-outlined">system_update</span>
                                    Integrate New Update
                                </button>
                            </div>

                            {showUpdateForm && (
                                <div className="update-form">
                                    <h2>Authentication Required</h2>
                                    <form onSubmit={handleUpdateSubmit}>
                                        <div className="form-group">
                                            <label>Admin Code</label>
                                            <input
                                                type="text"
                                                value={adminCode}
                                                onChange={(e) => setAdminCode(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Password</label>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-actions">
                                            <button type="submit" className="confirm-btn">Confirm</button>
                                            <button 
                                                type="button" 
                                                className="cancel-btn"
                                                onClick={() => setShowUpdateForm(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="version-history">
                                <h2>Version History</h2>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Version</th>
                                            <th>Date Modified</th>
                                            <th>Changes</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {versions.map(version => (
                                            <tr key={version.version}>
                                                <td>{version.version}</td>
                                                <td>{version.date}</td>
                                                <td>{version.changes}</td>
                                                <td>
                                                    <span className={`status-badge ${version.status}`}>
                                                        {version.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TranslationManagement;