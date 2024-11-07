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
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import '../../assets/General/Analytics.css';
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

const Analytics = () => {
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);

    // Sample data for user growth
    const userGrowthData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'User Growth',
            data: [150, 200, 250, 300, 380, 450],
            borderColor: '#0c8e6b',
            backgroundColor: 'rgba(12, 142, 107, 0.1)',
            fill: true,
        }]
    };

    // Sample data for user activity
    const userActivityData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Active Users',
            data: [65, 59, 80, 81, 56, 40, 45],
            backgroundColor: '#0c8e6b',
        }]
    };

    // Sample data for user types
    const userTypesData = {
        labels: ['Regular Users', 'Premium Users', 'Admin Users'],
        datasets: [{
            data: [300, 150, 50],
            backgroundColor: [
                '#0c8e6b',
                '#2ec4b6',
                '#ff9f1c',
            ],
        }]
    };

    // Options for charts
    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly User Growth'
            }
        }
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Weekly User Activity'
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'User Distribution'
            }
        }
    };

    // Sample analytics data
    const analyticsData = {
        totalUsers: 500,
        activeUsers: 350,
        averageSessionTime: '25 mins',
        conversionRate: '68%',
        retentionRate: '75%',
        newUsersToday: 15
    };

    return (
        <div className="dashboard">
            <Sidebar onHoverChange={setIsSidebarHovered} />
            <main className={`main-content ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
                <div className="analytics-container">
                    <div className="overview-section">
                        <h1>Analytics Dashboard</h1>
                    </div>

                    {/* Key Metrics Cards */}
                    <div className="metrics-grid">
                        <div className="metric-card">
                            <span className="material-symbols-outlined">group</span>
                            <h3>Total Users</h3>
                            <p>{analyticsData.totalUsers}</p>
                        </div>
                        <div className="metric-card">
                            <span className="material-symbols-outlined">person</span>
                            <h3>Active Users</h3>
                            <p>{analyticsData.activeUsers}</p>
                        </div>
                        <div className="metric-card">
                            <span className="material-symbols-outlined">timer</span>
                            <h3>Avg. Session Time</h3>
                            <p>{analyticsData.averageSessionTime}</p>
                        </div>
                        <div className="metric-card">
                            <span className="material-symbols-outlined">trending_up</span>
                            <h3>Conversion Rate</h3>
                            <p>{analyticsData.conversionRate}</p>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="charts-grid">
                        <div className="chart-card">
                            <Line options={lineOptions} data={userGrowthData} />
                        </div>
                        <div className="chart-card">
                            <Bar options={barOptions} data={userActivityData} />
                        </div>
                        <div className="chart-card">
                            <Doughnut options={doughnutOptions} data={userTypesData} />
                        </div>
                    </div>

                    {/* Additional Metrics */}
                    <div className="additional-metrics">
                        <div className="metric-card">
                            <span className="material-symbols-outlined">auto_graph</span>
                            <h3>Retention Rate</h3>
                            <p>{analyticsData.retentionRate}</p>
                        </div>
                        <div className="metric-card">
                            <span className="material-symbols-outlined">person_add</span>
                            <h3>New Users Today</h3>
                            <p>{analyticsData.newUsersToday}</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
