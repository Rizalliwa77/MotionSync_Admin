import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import '../../assets/MainMenu/User.css';
import Sidebar from '../Sidebar';

function User() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    email: '',
    fname: '',
    lname: '',
    mname: '',
    gender: 'Not set',
    userAge: 0,
    userType: 'Free User',
    accountStatus: 'Active',
    fcmToken: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    const db = getFirestore();
    const usersCollection = collection(db, 'users');
    try {
      const querySnapshot = await getDocs(usersCollection);
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user => 
      user.fname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleAddUser = async () => {
    try {
      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        'defaultPassword123' // You might want to generate a random password
      );

      // Add user to Firestore
      const db = getFirestore();
      await addDoc(collection(db, 'users'), {
        ...newUser,
        uid: userCredential.user.uid,
        fcmToken: '',
        createdAt: new Date()
      });

      // Refresh users list and close modal
      fetchUsers();
      setIsAddModalOpen(false);
      // Reset form
      setNewUser({
        email: '',
        fname: '',
        lname: '',
        mname: '',
        gender: 'Not set',
        userAge: 0,
        userType: 'Free User',
        accountStatus: 'Active',
        fcmToken: ''
      });
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Error adding user: ' + error.message);
    }
  };

  return (
    <div className="user-page">
      <Sidebar onHoverChange={setIsSidebarHovered} />
      <main className={`main-content ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
        <div className="overview-section">
          <h1>User Management</h1>
        </div>

        <div className="cards-container">
          {/* User Management Actions */}
          <div className="card user-management-card">
            <div className="card-content">
              <div className="action-section">
                <h3>Add New User</h3>
                <button className="add-user-btn" onClick={() => setIsAddModalOpen(true)}>
                  <span className="material-symbols-outlined">person_add</span>
                  Add User
                </button>
              </div>

              {selectedUser && (
                <div className="action-section">
                  <h3>Selected User: {selectedUser.fname} {selectedUser.lname}</h3>
                  <div className="action-buttons">
                    <button className="edit-user-btn" onClick={() => setIsEditModalOpen(true)}>
                      <span className="material-symbols-outlined">edit</span>
                      Edit User
                    </button>
                    <button className="delete-user-btn" onClick={() => setIsDeleteModalOpen(true)}>
                      <span className="material-symbols-outlined">delete</span>
                      Delete User
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Table */}
          <div className="card user-table-card">
            <div className="card-header">
              <h2>Users List</h2>
              <div className="search-section">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="user-search-input"
                />
              </div>
            </div>
            <div className="table-container">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr 
                      key={user.id}
                      className={selectedUser?.id === user.id ? 'selected' : ''}
                    >
                      <td>
                        <input
                          type="radio"
                          name="selectedUser"
                          checked={selectedUser?.id === user.id}
                          onChange={() => setSelectedUser(user)}
                        />
                      </td>
                      <td>{`${user.fname} ${user.lname}`}</td>
                      <td>{user.email}</td>
                      <td>{user.userType}</td>
                      <td>{user.accountStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add User Modal */}
        {isAddModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add New User</h2>
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="First Name"
                value={newUser.fname}
                onChange={(e) => setNewUser({ ...newUser, fname: e.target.value })}
              />
              <input
                type="text"
                placeholder="Middle Name"
                value={newUser.mname}
                onChange={(e) => setNewUser({ ...newUser, mname: e.target.value })}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newUser.lname}
                onChange={(e) => setNewUser({ ...newUser, lname: e.target.value })}
              />
              <select
                value={newUser.gender}
                onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
              >
                <option value="Not set">Not set</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="number"
                placeholder="Age"
                value={newUser.userAge}
                onChange={(e) => setNewUser({ ...newUser, userAge: parseInt(e.target.value) })}
              />
              <select
                value={newUser.userType}
                onChange={(e) => setNewUser({ ...newUser, userType: e.target.value })}
              >
                <option value="Free User">Free User</option>
                <option value="Premium User">Premium User</option>
                <option value="Admin">Admin</option>
              </select>
              <select
                value={newUser.accountStatus}
                onChange={(e) => setNewUser({ ...newUser, accountStatus: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
              <div className="modal-buttons">
                <button onClick={handleAddUser}>Add User</button>
                <button onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedUser && (
          <div className="modal">
            <div className="modal-content">
              <h2>Confirm Delete</h2>
              <p>Are you sure you want to delete {selectedUser.fname} {selectedUser.lname}?</p>
              <div className="modal-buttons">
                <button className="cancel-btn" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                <button className="delete-confirm-btn" onClick={handleDeleteUser}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default User;