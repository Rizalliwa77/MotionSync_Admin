import React, { useState, useEffect } from 'react';
import '../../assets/MainMenu/User.css';
import Sidebar from '../Sidebar';

function User() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  useEffect(() => {
    const initialUsers = [
      { firstName: "John", lastName: "Doe", email: "john.doe@example.com", type: "FREE", status: "Active" },
      { firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", type: "EDU", status: "Active" },
      { firstName: "Bob", lastName: "Johnson", email: "bob.johnson@example.com", type: "FREE", status: "Inactive" },
      { firstName: "Alice", lastName: "Williams", email: "alice.williams@example.com", type: "EDU", status: "Active" },
      { firstName: "Michael", lastName: "Brown", email: "michael.brown@example.com", type: "FREE", status: "Active" },
      { firstName: "Emily", lastName: "Davis", email: "emily.davis@example.com", type: "EDU", status: "Inactive" },
      { firstName: "James", lastName: "Wilson", email: "james.wilson@example.com", type: "FREE", status: "Active" },
      { firstName: "Olivia", lastName: "Miller", email: "olivia.miller@example.com", type: "EDU", status: "Active" },
      { firstName: "William", lastName: "Taylor", email: "william.taylor@example.com", type: "FREE", status: "Inactive" },
      { firstName: "Sophia", lastName: "Anderson", email: "sophia.anderson@example.com", type: "EDU", status: "Active" },
      { firstName: "Juan", lastName: "dela Cruz", email: "juan.delacruz@gmail.com", type: "EDU", status: "Active" },
      { firstName: "Maria", lastName: "Santos", email: "maria.santos84@gmail.com", type: "EDU", status: "Inactive" },
      { firstName: "Jose", lastName: "Reyes", email: "j.reyes123@gmail.com", type: "EDU", status: "Inactive" },
      { firstName: "Anna", lastName: "Garcia", email: "anna.garcia.ph@gmail.com", type: "FREE", status: "Active" },
      { firstName: "Mark", lastName: "Bautista", email: "mark.bautista77@gmail.com", type: "EDU", status: "Active" },
      { firstName: "Luz", lastName: "Hernandez", email: "luz.hernandez.ph@gmail.com", type: "FREE", status: "Inactive" },
      { firstName: "Carlos", lastName: "Aquino", email: "carlos.aquino@gmail.com", type: "FREE", status: "Inactive" },
      { firstName: "Isabel", lastName: "Ramos", email: "isabel.ramos98@gmail.com", type: "EDU", status: "Active" },
      { firstName: "Antonio", lastName: "Castillo", email: "antonio.castillo@gmail.com", type: "FREE", status: "Active" }
    ];

    const usedIds = new Set();
    const usersWithRandomIds = initialUsers.map(user => {
      let id;
      do {
        id = Math.floor(Math.random() * 900) + 100; // Generate a random 3-digit number
      } while (usedIds.has(id));
      usedIds.add(id);
      return { ...user, id };
    });

    setUsers(usersWithRandomIds);
  }, []);

  const handleSidebarHover = (hovered) => {
    setIsSidebarHovered(hovered);
  };

  const handleSearch = () => {
    console.log(`Searching for: ${searchTerm}`);
    // Implement search functionality here
  };

  const handleAddUser = () => {
    console.log('Adding new user');
    // Implement add user functionality here
  };

  const handleEditUser = () => {
    if (selectedUser) {
      console.log(`Editing user: ${selectedUser.firstName} ${selectedUser.lastName}`);
      // Implement edit user functionality here
    } else {
      alert('Please select a user to edit');
    }
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      console.log(`Deleting user: ${selectedUser.firstName} ${selectedUser.lastName}`);
      // Implement delete user functionality here
    } else {
      alert('Please select a user to delete');
    }
  };

  const handleManagePermissions = () => {
    if (selectedUser) {
      console.log(`Managing permissions for: ${selectedUser.firstName} ${selectedUser.lastName}`);
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
                      key={user.id} 
                      onClick={() => setSelectedUser(user)}
                      className={selectedUser && selectedUser.id === user.id ? 'selected' : ''}
                    >
                      <td>{user.id}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.type}</td>
                      <td>{user.status}</td>
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
                    <h3 className="stat-number">{users.filter(user => user.status === 'Active').length}</h3>
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
                <p>Manage user access and permissions</p>
                <button className="permission-btn" onClick={handleManagePermissions}>
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                  Manage Permissions
                </button>
              </div>

              {selectedUser && (
                <div className="card-section">
                  <h3>Selected User</h3>
                  <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Type:</strong> {selectedUser.type}</p>
                  <p><strong>Status:</strong> {selectedUser.status}</p>
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
