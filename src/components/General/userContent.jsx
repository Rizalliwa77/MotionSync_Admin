import React, { useState } from 'react';
import '../../assets/General/userContent.css';
import Sidebar from '../Sidebar';

const UserContent = () => {
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Dummy data for users (replace with your actual data)
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'Active' },
        // Add more users as needed
    ];

    // Dummy data for user files (replace with your actual data)
    const userFiles = {
        1: [
            { id: 1, name: 'Project A', type: 'folder', items: ['file1.txt', 'file2.pdf'] },
            { id: 2, name: 'Documents', type: 'folder', items: ['doc1.docx', 'doc2.xlsx'] },
        ],
        2: [
            { id: 3, name: 'Personal', type: 'folder', items: ['notes.txt', 'schedule.pdf'] },
            { id: 4, name: 'Work', type: 'folder', items: ['report.docx', 'presentation.pptx'] },
        ],
    };

    const handleUserClick = (userId) => {
        setSelectedUser(userId);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="dashboard">
            <Sidebar onHoverChange={setIsSidebarHovered} />
            <main className={`main-content ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
                <div className="user-content">
                    <div className="overview-section">
                        <h1>User Content Management</h1>
                    </div>

                    {/* Search Bar */}
                    <div className="search-section">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <span className="material-symbols-outlined">search</span>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="users-table-section">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr 
                                        key={user.id} 
                                        onClick={() => handleUserClick(user.id)}
                                        className={selectedUser === user.id ? 'selected' : ''}
                                    >
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{user.status}</td>
                                        <td>
                                            <button className="action-button">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* User Files Section */}
                    {selectedUser && (
                        <div className="user-files-section">
                            <h2>User Files</h2>
                            <div className="folders-grid">
                                {userFiles[selectedUser]?.map(folder => (
                                    <div key={folder.id} className="folder-card">
                                        <span className="material-symbols-outlined">folder</span>
                                        <h3>{folder.name}</h3>
                                        <p>{folder.items.length} items</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserContent;
