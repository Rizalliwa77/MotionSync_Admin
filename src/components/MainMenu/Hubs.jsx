import React, { useState, useEffect } from 'react';
import '../../assets/MainMenu/Hubs.css';
import Sidebar from '../Sidebar';

function Hubs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHub, setSelectedHub] = useState(null);
  const [hubs, setHubs] = useState([]);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  useEffect(() => {
    const initialHubs = [
      { name: "Sign Language Institute", email: "info@signlanguageinstitute.com", users: 10, tokenId: "#SLI1-" },
      { name: "Hands of Hope ASL Center", email: "contact@handsofhopeasl.org", users: 10, tokenId: "#HHC2-" },
      { name: "ASL Learning Hub", email: "support@asllearninghub.com", users: 11, tokenId: "#ALH3-" },
      { name: "Fluent Fingers ASL Academy", email: "info@fluentfingersasl.edu", users: 10, tokenId: "#FFA4-" },
      { name: "Deaf Community Learning Center", email: "outreach@dclcenter.org", users: 10, tokenId: "#DCCS-" },
      { name: "Sign and Communicate Academy", email: "info@signandcommunicate.com", users: 11, tokenId: "#SCA6-" },
      { name: "American Sign Language School", email: "admin@asi-school.org", users: 11, tokenId: "#ALS7-" },
      { name: "Expressive Hands ASL Center", email: "contact@expressivehandsasl.com", users: 10, tokenId: "#EHC8-" },
      { name: "Visual Voices Learning Institute", email: "info@visualvoicesinstitute.org", users: 11, tokenId: "#VV19-" }
    ];

    setHubs(initialHubs);
  }, []);

  const handleSidebarHover = (hovered) => {
    setIsSidebarHovered(hovered);
  };

  const handleSearch = () => {
    console.log(`Searching for: ${searchTerm}`);
    // Implement search functionality here
  };

  const handleAddHub = () => {
    console.log('Adding new hub');
    // Implement add hub functionality here
  };

  const handleEditHub = () => {
    if (selectedHub) {
      console.log(`Editing hub: ${selectedHub.name}`);
      // Implement edit hub functionality here
    } else {
      alert('Please select a hub to edit');
    }
  };

  const handleDeleteHub = () => {
    if (selectedHub) {
      console.log(`Deleting hub: ${selectedHub.name}`);
      // Implement delete hub functionality here
    } else {
      alert('Please select a hub to delete');
    }
  };

  const handleManageHubSettings = () => {
    if (selectedHub) {
      console.log(`Managing settings for: ${selectedHub.name}`);
      // Implement manage hub settings functionality here
    } else {
      alert('Please select a hub to manage settings');
    }
  };

  return (
    <div className="hubs-page">
      <Sidebar onHoverChange={handleSidebarHover} />
      <main className={`main-content ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
        <div className="overview-section">
          <h1>Learning Hubs Management</h1>
        </div>

        <div className="cards-container">
          {/* Hubs Table Card */}
          <div className="card hubs-table-card">
            <div className="card-header">
              <h2>Learning Hubs List</h2>
            </div>
            <div className="card-content table-container">
              <table className="hubs-table">
                <thead>
                  <tr>
                    <th>Learning Hub</th>
                    <th>Email Address</th>
                    <th>User #</th>
                    <th>Token ID</th>
                  </tr>
                </thead>
                <tbody>
                  {hubs.map((hub, index) => (
                    <tr 
                      key={index} 
                      onClick={() => setSelectedHub(hub)}
                      className={selectedHub && selectedHub.name === hub.name ? 'selected' : ''}
                    >
                      <td>{hub.name}</td>
                      <td>{hub.email}</td>
                      <td>{hub.users}</td>
                      <td>{hub.tokenId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hubs Management Card */}
          <div className="card hubs-management-card">
            <div className="scrollable-content">
              <div className="card-section">
                <h3>Hubs Statistics</h3>
                <div className="hubs-statistics-content">
                  <div className="stat-item">
                    <h3 className="stat-number">{hubs.length}</h3>
                    <p className="stat-description">Total Hubs</p>
                  </div>
                  <div className="stat-item">
                    <h3 className="stat-number">{hubs.reduce((total, hub) => total + hub.users, 0)}</h3>
                    <p className="stat-description">Total Users</p>
                  </div>
                </div>
              </div>

              <div className="card-section">
                <h3>Hub Search</h3>
                <input 
                  type="text" 
                  placeholder="Search hubs..." 
                  className="hub-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-btn" onClick={handleSearch}>
                  <span className="material-symbols-outlined">search</span>
                  Search
                </button>
              </div>

              <div className="card-section">
                <h3>Hub Actions</h3>
                <div className="quick-actions">
                  <button className="action-btn" onClick={handleAddHub}>
                    <span className="material-symbols-outlined">add_circle</span>
                    Add New Hub
                  </button>
                  <button className="action-btn" onClick={handleEditHub}>
                    <span className="material-symbols-outlined">edit</span>
                    Edit Hub
                  </button>
                  <button className="action-btn" onClick={handleDeleteHub}>
                    <span className="material-symbols-outlined">delete</span>
                    Delete Hub
                  </button>
                </div>
              </div>

              <div className="card-section">
                <h3>Hub Settings</h3>
                <p>Manage hub access and settings</p>
                <button className="settings-btn" onClick={handleManageHubSettings}>
                  <span className="material-symbols-outlined">settings</span>
                  Manage Settings
                </button>
              </div>

              {selectedHub && (
                <div className="card-section">
                  <h3>Selected Hub</h3>
                  <p><strong>Name:</strong> {selectedHub.name}</p>
                  <p><strong>Email:</strong> {selectedHub.email}</p>
                  <p><strong>Users:</strong> {selectedHub.users}</p>
                  <p><strong>Token ID:</strong> {selectedHub.tokenId}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Hubs;

