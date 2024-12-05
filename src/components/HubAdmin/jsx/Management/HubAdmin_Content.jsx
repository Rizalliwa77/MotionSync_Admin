import React, { useState } from 'react';
import '../../styles/Management/HubAdmin_Content.css';
import HubAdminSidebar from '../HubAdminSidebar';

const HubAdmin_Content = () => {
  const [selectedContent, setSelectedContent] = useState(null);

  const handleAddContent = () => {
    // Add content logic
    console.log("Adding new content");
  };

  const handleEditContent = () => {
    if (!selectedContent) {
      alert("Please select a content to edit");
      return;
    }
    console.log("Editing content:", selectedContent);
  };

  const handleDeleteContent = () => {
    if (!selectedContent) {
      alert("Please select a content to delete");
      return;
    }
    if (window.confirm("Are you sure you want to delete this content?")) {
      console.log("Deleting content:", selectedContent);
    }
  };

  const handleManagePermissions = () => {
    if (!selectedContent) {
      alert("Please select a content to manage permissions");
      return;
    }
    console.log("Managing permissions for:", selectedContent);
  };

  const handleContentSelect = (content) => {
    setSelectedContent(content === selectedContent ? null : content);
  };

  return (
    <div className="hub-admin-container">
      <HubAdminSidebar />
      <div className="main-content">
        <div className="content-scroll">
          <h1>Content Management</h1>
          <div className="content-info">
            <table className="content-table">
              <thead>
                <tr>
                  <th>HUB</th>
                  <th>EMAIL ADDRESS</th>
                  <th>USERS #</th>
                  <th>TOKEN ID</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ASL Learning Hub</td>
                  <td>support@asllearninghub.com</td>
                  <td>11</td>
                  <td>#ALH3-</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="content-section">
            <div className="content-list">
              {['Teacher Rubilyn', 'Teacher Rubilyn', 'Teacher Ken James', 'Teacher Shannon'].map((teacher, index) => (
                <div 
                  key={index}
                  className={`content-item ${selectedContent === teacher ? 'selected' : ''}`}
                  onClick={() => handleContentSelect(teacher)}
                >
                  <div className="content-item-left">
                    <span className="material-symbols-outlined">folder</span>
                    <p>{teacher}</p>
                  </div>
                  <span className="date-modified">
                    {['03/19/2024', '03/27/2024', '01/22/2024', '04/01/2024'][index]}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="content-actions">
              <button className="add-content-btn" onClick={handleAddContent}>
                ADD CONTENT
              </button>
              <button 
                className={`edit-content-btn ${!selectedContent ? 'disabled' : ''}`}
                onClick={handleEditContent}
              >
                EDIT CONTENT
              </button>
              <button 
                className={`delete-content-btn ${!selectedContent ? 'disabled' : ''}`}
                onClick={handleDeleteContent}
              >
                DELETE CONTENT
              </button>
              <div className="content-permissions">
                <h4>Content Permissions</h4>
                <p>Manage content access and permissions</p>
                <button 
                  className={`manage-permissions-btn ${!selectedContent ? 'disabled' : ''}`}
                  onClick={handleManagePermissions}
                >
                  MANAGE PERMISSIONS
                </button>
              </div>
            </div>
          </div>

          <div className="action-log">
            <table className="action-table">
              <thead>
                <tr>
                  <th>ACTION</th>
                  <th>EDUCATOR</th>
                  <th>DATE</th>
                  <th>REMARKS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>RE: MODULE #13</td>
                  <td>TEACHER RUBILYN</td>
                  <td>03/18/2024</td>
                  <td className="to-be-approved">TO BE APPROVED</td>
                </tr>
                <tr>
                  <td>RE: MODULE #12</td>
                  <td>TEACHER MIKE</td>
                  <td>03/17/2024</td>
                  <td className="approved">APPROVED</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HubAdmin_Content;
