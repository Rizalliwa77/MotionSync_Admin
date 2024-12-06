import React, { useState, useEffect } from 'react';
import '../../assets/MainMenu/Hubs.css';
import Sidebar from '../Sidebar';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';

function Hubs() {
  const [pendingHubs, setPendingHubs] = useState([]);
  const [approvedHubs, setApprovedHubs] = useState([]);
  const [selectedHub, setSelectedHub] = useState(null);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [showDeniedHubs, setShowDeniedHubs] = useState(false);
  const [hubDetails, setHubDetails] = useState(null);

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
      window.location.reload();
    } catch (error) {
      console.error("Error disabling hub:", error);
    }
  };

  const handleHubClick = async (hub) => {
    try {
      // Fetch data from all forms
      const form1Ref = doc(db, "register", "Form 1");
      const form2Ref = doc(db, "Educational Programs", "Form 1");
      const form3Ref = doc(db, "Compliance Documents", "Form 1");
      const form4Ref = doc(db, "Payment Details", "Form 1");
      const addressRef = doc(db, "HubAddress Info", "Form 1");

      const [
        form1Doc,
        form2Doc,
        form3Doc,
        form4Doc,
        addressDoc
      ] = await Promise.all([
        getDoc(form1Ref),
        getDoc(form2Ref),
        getDoc(form3Doc),
        getDoc(form4Doc),
        getDoc(addressRef)
      ]);

      const hubData = {
        basicInfo: form1Doc.exists() ? form1Doc.data() : null,
        educationalPrograms: form2Doc.exists() ? form2Doc.data() : null,
        complianceInfo: form3Doc.exists() ? form3Doc.data() : null,
        paymentInfo: form4Doc.exists() ? form4Doc.data() : null,
        addressInfo: addressDoc.exists() ? addressDoc.data() : null
      };

      setHubDetails(hubData);
      setSelectedHub(hub);
    } catch (error) {
      console.error("Error fetching hub details:", error);
    }
  };

  const closeModal = () => {
    setSelectedHub(null);
  };

  return (
    <div className="hubs-page">
      <Sidebar onHoverChange={(hovered) => setIsSidebarHovered(hovered)} />
      <main className={`main-content ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
        <div className="overview-section">
          <h1>Hub Registration Management</h1>
        </div>

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
                  <tr key={hub.id} onClick={() => handleHubClick(hub)}>
                    <td>{hub.hubName}</td>
                    <td>{hub.hubEmail}</td>
                    <td>{hub.hubToken}</td>
                    <td className="action-buttons">
                      <button 
                        className="approve-btn"
                        onClick={(e) => { e.stopPropagation(); handleApprove(hub.id); }}
                      >
                        <span className="material-symbols-outlined">check</span>
                      </button>
                      <button 
                        className="deny-btn"
                        onClick={(e) => { e.stopPropagation(); handleDeny(hub.id); }}
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

        {selectedHub && hubDetails && (
          <div className="modal">
            <div className="modal-content">
              <h2>Hub Registration Details</h2>
              
              {/* Basic Information */}
              <section className="details-section">
                <h3>Basic Information</h3>
                {hubDetails.basicInfo && (
                  <>
                    <p><strong>Hub Name:</strong> {hubDetails.basicInfo.hubName}</p>
                    <p><strong>Email:</strong> {hubDetails.basicInfo.hubEmail}</p>
                    <p><strong>Token ID:</strong> {hubDetails.basicInfo.hubToken}</p>
                    <p><strong>Contact Person:</strong> {hubDetails.basicInfo.contactPerson}</p>
                    <p><strong>Contact Number:</strong> {hubDetails.basicInfo.contactNumber}</p>
                  </>
                )}
              </section>

              {/* Address Information */}
              <section className="details-section">
                <h3>Address Information</h3>
                {hubDetails.addressInfo && (
                  <>
                    <p><strong>Street:</strong> {hubDetails.addressInfo.street}</p>
                    <p><strong>City:</strong> {hubDetails.addressInfo.city}</p>
                    <p><strong>State/Province:</strong> {hubDetails.addressInfo.state}</p>
                    <p><strong>Postal Code:</strong> {hubDetails.addressInfo.postalCode}</p>
                    <p><strong>Country:</strong> {hubDetails.addressInfo.country}</p>
                  </>
                )}
              </section>

              {/* Educational Programs */}
              <section className="details-section">
                <h3>Educational Programs</h3>
                {hubDetails.educationalPrograms && (
                  <div>
                    <h4>Programs Offered:</h4>
                    {hubDetails.educationalPrograms.programs?.map((program, index) => (
                      <div key={index} className="program-details">
                        <p><strong>Program Name:</strong> {program.name}</p>
                        <p><strong>Mode of Delivery:</strong> {program.modeOfDelivery}</p>
                        <p><strong>Overview:</strong> {program.overview}</p>
                      </div>
                    ))}

                    <h4>Educators:</h4>
                    {hubDetails.educationalPrograms.educators?.map((educator, index) => (
                      <div key={index} className="educator-details">
                        <p><strong>Name:</strong> {educator.name}</p>
                        <p><strong>Position:</strong> {educator.position}</p>
                        <p><strong>Qualifications:</strong> {educator.qualifications}</p>
                        <p><strong>Experience:</strong> {educator.yearsOfExperience} years</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Compliance Information */}
              <section className="details-section">
                <h3>Compliance Information</h3>
                {hubDetails.complianceInfo && (
                  <>
                    <h4>Credentials:</h4>
                    {hubDetails.complianceInfo.credentials?.map((credential, index) => (
                      <div key={index} className="credential-details">
                        <p><strong>Number:</strong> {credential.number}</p>
                        <p><strong>Issued By:</strong> {credential.issuedBy}</p>
                      </div>
                    ))}

                    <h4>Compliance Status:</h4>
                    <p><strong>Education Regulations:</strong> {hubDetails.complianceInfo.educationRegulations ? 'Yes' : 'No'}</p>
                    <p><strong>Special Education Laws:</strong> {hubDetails.complianceInfo.specialEducationLaws ? 'Yes' : 'No'}</p>
                    <p><strong>Child Protection Policies:</strong> {hubDetails.complianceInfo.childProtectionPolicies ? 'Yes' : 'No'}</p>
                  </>
                )}
              </section>

              {/* Payment Information */}
              <section className="details-section">
                <h3>Payment Information</h3>
                {hubDetails.paymentInfo && (
                  <>
                    <p><strong>Payment Method:</strong> {hubDetails.paymentInfo.paymentMethod}</p>
                    <p><strong>Payment Status:</strong> {hubDetails.paymentInfo.paymentStatus}</p>
                    {hubDetails.paymentInfo.receiptUrl && (
                      <p><strong>Receipt:</strong> <a href={hubDetails.paymentInfo.receiptUrl} target="_blank" rel="noopener noreferrer">View Receipt</a></p>
                    )}
                  </>
                )}
              </section>

              <div className="modal-actions">
                <button onClick={() => setHubDetails(null)} className="close-btn">Close</button>
                <button 
                  onClick={(e) => handleApprove(selectedHub.id)}
                  className="approve-btn"
                >
                  Approve Hub
                </button>
                <button 
                  onClick={(e) => handleDeny(selectedHub.id)}
                  className="deny-btn"
                >
                  Deny Hub
                </button>
              </div>
            </div>
          </div>
        )}

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

        <button 
          className="denied-hubs-btn fixed-bottom-right"
          onClick={() => setShowDeniedHubs(!showDeniedHubs)}
        >
          <span className="material-symbols-outlined">
            block
          </span>
          View Denied Hubs
        </button>

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


