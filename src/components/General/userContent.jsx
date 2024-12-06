import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig'; 
import '../../assets/General/userContent.css';
import Sidebar from '../Sidebar';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const UserContent = () => {
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserFiles, setSelectedUserFiles] = useState([]);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);

    // Updated to fetch and format user data from Firebase
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, 'users');
                const querySnapshot = await getDocs(usersCollection);
                const usersData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: `${data.fname || ''} ${data.lname || ''}`.trim(),
                        email: data.email || '',
                        role: data.userType || 'User',
                        status: data.accountStatus || 'Active',
                        // Store other fields but don't display them
                        fcmToken: data.fcmToken,
                        gender: data.gender,
                        mname: data.mname,
                        uid: data.uid,
                        userAge: data.userAge
                    };
                });
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleUserClick = (userId) => {
        setSelectedUser(userId);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Update filtered users to match new data structure
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sample files data (remove or replace when real data is available)
    const sampleFiles = [
        { id: 1, name: 'Profile Picture', type: 'image/jpeg', size: '2.5 MB', uploadDate: '2024-03-15' },
        { id: 2, name: 'ID Document', type: 'application/pdf', size: '1.2 MB', uploadDate: '2024-03-14' },
        { id: 3, name: 'Medical Record', type: 'application/pdf', size: '3.7 MB', uploadDate: '2024-03-13' }
    ];

    const handleViewClick = (e, user) => {
        e.stopPropagation(); // Prevent row click event
        setSelectedUserDetails(user);
        setSelectedUserFiles(sampleFiles); // Replace with real file fetching logic
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUserDetails(null);
        setSelectedUserFiles([]);
    };

    const handleDownload = async (file) => {
        try {
            // Get storage reference
            const storage = getStorage();
            const fileRef = ref(storage, `users/${selectedUserDetails.id}/${file.name}`);

            // Get download URL
            const url = await getDownloadURL(fileRef);

            // Create temporary anchor element
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file. Please try again.');
        }
    };

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
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <span className="material-symbols-outlined">search</span>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="users-table-section">
                        {loading ? (
                            <div className="loading-spinner">Loading...</div>
                        ) : (
                            <div className="users-table-wrapper">
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
                                            <tr key={user.id} 
                                                onClick={() => handleUserClick(user.id)}
                                                className={selectedUser === user.id ? 'selected' : ''}
                                            >
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td>{user.status}</td>
                                                <td>
                                                    <button 
                                                        className="action-button"
                                                        onClick={(e) => handleViewClick(e, user)}
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* User Files Section */}
                    {selectedUser && (
                        <div className="user-files-section">
                            <h2>User Files</h2>
                            <div className="folders-grid">
                                <p>No files available</p>
                            </div>
                        </div>
                    )}

                    {/* Add Modal */}
                    {isModalOpen && (
                        <div className="modal-overlay" onClick={closeModal}>
                            <div className="modal-content" onClick={e => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>Files for {selectedUserDetails?.name}</h2>
                                    <button className="close-button" onClick={closeModal}>×</button>
                                </div>
                                <div className="modal-body">
                                    {selectedUserFiles.length > 0 ? (
                                        <table className="files-table">
                                            <thead>
                                                <tr>
                                                    <th>File Name</th>
                                                    <th>Type</th>
                                                    <th>Size</th>
                                                    <th>Upload Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedUserFiles.map(file => (
                                                    <tr key={file.id}>
                                                        <td>{file.name}</td>
                                                        <td>{file.type}</td>
                                                        <td>{file.size}</td>
                                                        <td>{file.uploadDate}</td>
                                                        <td>
                                                            <button 
                                                                className="download-button"
                                                                onClick={() => handleDownload(file)}
                                                            >
                                                                Download
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="no-files">No files available for this user.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserContent;
