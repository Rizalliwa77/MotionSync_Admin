import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import '../../assets/MainMenu/User.css';
import Sidebar from '../Sidebar';

function User() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      try {
        const querySnapshot = await getDocs(usersCollection);
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Firestore document ID
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSidebarHover = (hovered) => {
    setIsSidebarHovered(hovered);
  };

  const handleSearch = () => {
    console.log(`Searching for: ${searchTerm}`);
    const filteredUsers = users.filter((user) =>
      user.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setUsers(filteredUsers);
  };

  const handleAddUser = () => {
    console.log('Adding new user');
    // Implement add user functionality here
  };

  const handleEditUser = () => {
    if (selectedUser) {
      console.log(`Editing user: ${selectedUser.fname} ${selectedUser.lname}`);
      // Implement edit user functionality here
    } else {
      alert('Please select a user to edit');
    }
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      console.log(`Deleting user: ${selectedUser.fname} ${selectedUser.lname}`);
      // Implement delete user functionality here
    } else {
      alert('Please select a user to delete');
    }
  };

  const handleManagePermissions = () => {
    if (selectedUser) {
      console.log(`Managing permissions for: ${selectedUser.fname} ${selectedUser.lname}`);
      // Implement manage permissions functionality here
    } else {
      alert('Please select a user to manage permissions');
    }
  };

  return (
    <div className="user-page">
      <Sidebar onHoverChange={handleSidebarHover} />
      <main className={`main-content ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
        <div className="overview-section">
          <h1>User Management</h1>
        </div>

        <div className="cards-container">
          {/* User Table Card */}
          <div className="card user-table-card">
            <div className="card-header">
              <h2>User List</h2>
            </div>
            <div className="card-content table-container">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email Address</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.uid}
                      onClick={() => setSelectedUser(user)}
                      className={selectedUser && selectedUser.uid === user.uid ? 'selected' : ''}
                    >
                      <td>{user.uid}</td>
                      <td>{user.fname}</td>
                      <td>{user.lname}</td>
                      <td>{user.email}</td>
                      <td>{user.userType}</td>
                      <td>{user.accountStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Management Card */}
          <div className="card user-management-card">
            <div className="scrollable-content">
              <div className="card-section">
                <h3>User Statistics</h3>
                <div className="user-statistics-content">
                  <div className="stat-item">
                    <h3 className="stat-number">{users.length}</h3>
                    <p className="stat-description">Total Users</p>
                  </div>
                  <div className="stat-item">
                    <h3 className="stat-number">{users.filter((user) => user.accountStatus === 'Active').length}</h3>
                    <p className="stat-description">Active Users</p>
                  </div>
                </div>
              </div>

              <div className="card-section">
                <h3>User Search</h3>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="user-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-btn" onClick={handleSearch}>
                  <span className="material-symbols-outlined">search</span>
                  Search
                </button>
              </div>

              <div className="card-section">
                <h3>User Actions</h3>
                <div className="quick-actions">
                  <button className="action-btn" onClick={handleAddUser}>
                    <span className="material-symbols-outlined">person_add</span>
                    Add New User
                  </button>
                  <button className="action-btn" onClick={handleEditUser}>
                    <span className="material-symbols-outlined">edit</span>
                    Edit User
                  </button>
                  <button className="action-btn" onClick={handleDeleteUser}>
                    <span className="material-symbols-outlined">delete</span>
                    Delete User
                  </button>
                </div>
              </div>

              <div className="card-section">
                <h3>User Permissions</h3>
                <button className="permission-btn" onClick={handleManagePermissions}>
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                  Manage Permissions
                </button>
              </div>

              {selectedUser && (
                <div className="card-section">
                  <h3>Selected User</h3>
                  <p><strong>Name:</strong> {selectedUser.fname} {selectedUser.lname}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Type:</strong> {selectedUser.userType}</p>
                  <p><strong>Status:</strong> {selectedUser.accountStatus}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default User;
