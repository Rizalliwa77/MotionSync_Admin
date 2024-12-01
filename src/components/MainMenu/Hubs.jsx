import React, { useState, useEffect } from 'react';
import '../../assets/MainMenu/Hubs.css';
import Sidebar from '../Sidebar';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

function Hubs() {
  const [pendingHubs, setPendingHubs] = useState([]);
  const [approvedHubs, setApprovedHubs] = useState([]);
  const [selectedHub, setSelectedHub] = useState(null);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [showDeniedHubs, setShowDeniedHubs] = useState(false);

  // Fetch data from Firebase
  useEffect(() => {
    const fetchHubs = async () => {
      try {
        const registerRef = collection(db, "register");
        const querySnapshot = await getDocs(registerRef);
        const pending = [];
        const approved = [];
        
        querySnapshot.forEach((doc) => {
          const data = { ...doc.data(), id: doc.id };
          if (!data.status) {
            pending.push(data);
          } else if (data.status === 'approved') {
            approved.push(data);
          }
        });

        setPendingHubs(pending);
        setApprovedHubs(approved);
      } catch (error) {
        console.error("Error fetching hubs:", error);
      }
    };

    fetchHubs();
  }, []);

  const handleApprove = async (hubId) => {
    try {
      const hubRef = doc(db, "register", hubId);
      await updateDoc(hubRef, {
        status: 'approved'
      });
      // Refresh the lists
      window.location.reload();
    } catch (error) {
      console.error("Error approving hub:", error);
    }
  };

  const handleDeny = async (hubId) => {
    try {
      const hubRef = doc(db, "register", hubId);
      await updateDoc(hubRef, {
        status: 'denied'
      });
      // Refresh the lists
      window.location.reload();
    } catch (error) {
      console.error("Error denying hub:", error);
    }
  };

  const handleDisableHub = async (hubId) => {
    try {
      const hubRef = doc(db, "register", hubId);
      await updateDoc(hubRef, {
        status: 'disabled'
      });
      // Refresh the lists
      window.location.reload();
    } catch (error) {
      console.error("Error disabling hub:", error);
    }
  };

  return (
    <div className="hubs-page">
      <Sidebar onHoverChange={(hovered) => setIsSidebarHovered(hovered)} />
      <main className={`main-content ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
        <div className="overview-section">
          <h1>Hub Registration Management</h1>
        </div>

        {/* Pending Registrations Table */}
        <div className="card">
          <div className="card-header">
            <h2>Pending Hub Registrations</h2>
          </div>
          <div className="table-container">
            <table className="hubs-table">
              <thead>
                <tr>
                  <th>Hub Name</th>
                  <th>Email Address</th>
                  <th>Token ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingHubs.map((hub) => (
                  <tr key={hub.id}>
                    <td>{hub.hubName}</td>
                    <td>{hub.hubEmail}</td>
                    <td>{hub.hubToken}</td>
                    <td className="action-buttons">
                      <button 
                        className="approve-btn"
                        onClick={() => handleApprove(hub.id)}
                      >
                        <span className="material-symbols-outlined">check</span>
                      </button>
                      <button 
                        className="deny-btn"
                        onClick={() => handleDeny(hub.id)}
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approved Hubs Table */}
        <div className="card mt-4">
          <div className="card-header">
            <h2>Approved Hubs</h2>
          </div>
          <div className="table-container">
            <table className="hubs-table">
              <thead>
                <tr>
                  <th>Hub Name</th>
                  <th>Email Address</th>
                  <th>Token ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvedHubs.map((hub) => (
                  <tr key={hub.id}>
                    <td>{hub.hubName}</td>
                    <td>{hub.hubEmail}</td>
                    <td>{hub.hubToken}</td>
                    <td className="action-buttons">
                      <button className="edit-btn">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button 
                        className="disable-btn"
                        onClick={() => handleDisableHub(hub.id)}
                      >
                        <span className="material-symbols-outlined">block</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Denied Hubs Button - Now in fixed position */}
        <button 
          className="denied-hubs-btn fixed-bottom-right"
          onClick={() => setShowDeniedHubs(!showDeniedHubs)}
        >
          <span className="material-symbols-outlined">
            block
          </span>
          View Denied Hubs
        </button>

        {/* Denied Hubs Modal */}
        {showDeniedHubs && (
          <div className="modal">
            <div className="modal-content">
              <h2>Denied Hubs</h2>
              <table className="hubs-table">
                <thead>
                  <tr>
                    <th>Hub Name</th>
                    <th>Email Address</th>
                    <th>Token ID</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Add denied hubs data here */}
                </tbody>
              </table>
              <button onClick={() => setShowDeniedHubs(false)}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Hubs;


