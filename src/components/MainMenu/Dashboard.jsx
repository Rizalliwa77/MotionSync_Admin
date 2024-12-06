import React, { useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2'; // Import Line chart
import '../../assets/MainMenu/Dashboard.css'; 
import Sidebar from '../Sidebar';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);

    // Sample data for the chart
    const chartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'User Growth',
                data: [50, 100, 150, 200, 300, 400],
                borderColor: '#0c8e6b',
                backgroundColor: 'rgba(12, 142, 107, 0.1)',
                fill: true,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'User Growth Over Time'
            }
        }
    };

    return (
        <div className="dashboard">
            <Sidebar onHoverChange={setIsSidebarHovered} />
            <main className={`main-content ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
                <div className="overview-section">
                    <h1>Dashboard</h1>
                </div>

                <div className="cards-grid">
                    {/* User Management Card */}
                    <div className="card">
                        <div className="card-header">
                            <h2>User Management</h2>
                            <span className="arrow">→</span>
                        </div>
                        <div className="card-content user-management-content">
                            <div className="stat-item">
                                <h3 className="stat-number">94</h3>
                                <p className="stat-description">Current Users</p>
                            </div>
                            <div className="stat-item">
                                <h3 className="stat-number">45</h3>
                                <p className="stat-description">Registered Hubs</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Management Card */}
                    <div className="card">
                        <div className="card-header">
                            <h2>Content Management</h2>
                            <span className="arrow">→</span>
                        </div>
                        <div className="card-content centered-card-content">
                            <div className="stat-item">
                                <h1 className="stat-number">30</h1>
                                <p className="stat-description">Pending Approval for: New Content</p>
                            </div>
                        </div>
                    </div>

                    {/* Analytical Report Card */}
                    <div className="card">
                        <div className="card-header">
                            <h2>Analytical Report</h2>
                            <span className="arrow">→</span>
                        </div>
                        <div className="card-content">
                            <Line data={chartData} options={chartOptions} />
                            <p>Text to Sign Language Usage</p>
                        </div>
                    </div>

                    {/* Translation Services Card */}
                    <div className="translation-card">
                        <div className="card-header">
                            <h2>Translation Services</h2>
                            <span className="arrow">→</span>
                        </div>
                        <div className="card-content">
                            <h3>15</h3>
                            <p>Active Translation Projects</p>
                            <h3>5</h3>
                            <p>Languages Supported</p>
                            <div className="translation-buttons">
                                <button className="translation-btn">
                                    <span className="material-symbols-outlined">translate</span>
                                    Text to Sign
                                </button>
                                <button className="translation-btn">
                                    <span className="material-symbols-outlined">sign_language</span>
                                    Sign to Text
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notifications Card */}
                    <div className="card">
                        <div className="card-header">
                            <h2>Notifications</h2>
                            <span className="arrow">→</span>
                        </div>
                        <div className="card-content notifications-content">
                            <ul>
                                <li>User #2320 | Password reset request</li>
                                <li>User #7830 | New schedule update</li>
                                <li>User #9742 | New content submission</li>
                            </ul>
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="card">
                        <div className="card-header">
                            <h2>Quick Actions</h2>
                            <span className="arrow">→</span>
                        </div>
                        <div className="card-content centered-quick-actions">
                            <div className="quick-actions">
                                <button className="action-btn">
                                    <span className="material-symbols-outlined">person_add</span>
                                    Add New User
                                </button>
                                <button className="action-btn">
                                    <span className="material-symbols-outlined">edit_document</span>
                                    Create Content
                                </button>
                                <button className="action-btn">
                                    <span className="material-symbols-outlined">bar_chart</span>
                                    Generate Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;