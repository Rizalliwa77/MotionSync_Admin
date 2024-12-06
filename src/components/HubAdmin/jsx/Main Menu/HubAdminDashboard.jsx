import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { db } from '../../../../firebase/firebaseConfig';
import HubAdminSidebar from '../HubAdminSidebar';
import '../../styles/Main Menu/HubAdminDashboard.css';

const HubAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    userCount: 0,
    pendingModules: 0,
    messages: [],
    schoolName: 'ASL Learning Hub'
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch first registered school
        const schoolsQuery = query(
          collection(db, 'schools'),
          orderBy('registrationDate', 'asc'),
          limit(1)
        );
        const schoolSnapshot = await getDocs(schoolsQuery);
        const schoolName = schoolSnapshot.empty 
          ? 'ASL Learning Hub' 
          : schoolSnapshot.docs[0].data().name;

        // Fetch user count
        const usersQuery = query(collection(db, 'users'), where('role', '==', 'student'));
        const usersSnapshot = await getDocs(usersQuery);
        const userCount = usersSnapshot.size;

        // Fetch pending modules
        const modulesQuery = query(collection(db, 'modules'), where('status', '==', 'pending'));
        const modulesSnapshot = await getDocs(modulesQuery);
        const pendingCount = modulesSnapshot.size;

        // Fetch recent messages (last 3)
        const messagesQuery = query(collection(db, 'messages'));
        const messagesSnapshot = await getDocs(messagesQuery);
        const recentMessages = messagesSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 3);

        setDashboardData(prevData => ({
          ...prevData,
          schoolName,
          userCount,
          pendingModules: pendingCount,
          messages: recentMessages
        }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="hub-admin-layout">
      <HubAdminSidebar />
      <main className="hub-admin-main">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <h2>{dashboardData.schoolName}</h2>
          </div>
          
          <div className="dashboard-grid">
            <div className="dashboard-card user-management">
              <h3>User Management</h3>
              <div className="card-content">
                <div className="stat-number">{dashboardData.userCount}</div>
                <p>Current EduMode Users</p>
              </div>
            </div>

            <div className="dashboard-card content-management">
              <h3>Content Management</h3>
              <div className="card-content">
                <div className="stat-number">{dashboardData.pendingModules}</div>
                <p>Pending Approval for: New Module</p>
              </div>
            </div>

            <div className="dashboard-card inbox">
              <h3>Inbox</h3>
              <div className="card-content">
                <div className="message-list">
                  {dashboardData.messages.map((message) => (
                    <div key={message.id} className="message-item">
                      <span className="material-symbols-outlined">mail</span>
                      <p>User #{message.userId} | Subject: {message.subject}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="dashboard-card classroom">
              <div className="card-content centered">
                <span className="material-symbols-outlined classroom-icon">groups</span>
                <h3>enter</h3>
                <div className="classroom-text">CLASSROOM</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HubAdminDashboard;