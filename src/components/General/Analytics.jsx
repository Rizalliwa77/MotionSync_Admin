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
    const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month', 'year'

    // Enhanced chart options
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            }
        }
    };

    const lineOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: true,
                text: 'Monthly User Growth',
                padding: 20,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    const barOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: true,
                text: 'Weekly User Activity',
                padding: 20,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    const doughnutOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: true,
                text: 'User Distribution',
                padding: 10,
                font: {
                    size: 14,
                    weight: 'bold'
                }
            }
        },
        cutout: '70%',
        maintainAspectRatio: true,
        aspectRatio: 2
    };

    // Enhanced data with gradients
    const userGrowthData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'User Growth',
            data: [150, 200, 250, 300, 380, 450],
            borderColor: '#00A67E',
            backgroundColor: 'rgba(0, 166, 126, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#00A67E',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
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

    // Enhanced analytics data
    const analyticsData = {
        totalUsers: 500,
        activeUsers: 350,
        averageSessionTime: '25 mins',
        conversionRate: '68%',
        retentionRate: '75%',
        newUsersToday: 15,
        bounceRate: '32%',
        pageViews: 12500,
        avgLoadTime: '1.2s',
        errorRate: '0.5%',
        activeSubscriptions: 280,
        revenueGrowth: '+15%'
    };

    return (
        <div className="dashboard">
            <Sidebar onHoverChange={setIsSidebarHovered} />
            <main className={`main-content ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
                <div className="analytics-container">
                    <div className="overview-section">
                        <div className="overview-header">
                            <h1>Analytics Dashboard</h1>
                            <div className="time-range-selector">
                                <select 
                                    value={timeRange} 
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className="time-select"
                                >
                                    <option value="day">Today</option>
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                    <option value="year">This Year</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics Grid */}
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

                    {/* Performance Metrics */}
                    <div className="performance-metrics">
                        <div className="metric-card">
                            <span className="material-symbols-outlined">speed</span>
                            <h3>Avg Load Time</h3>
                            <p>{analyticsData.avgLoadTime}</p>
                        </div>
                        <div className="metric-card">
                            <span className="material-symbols-outlined">error</span>
                            <h3>Error Rate</h3>
                            <p>{analyticsData.errorRate}</p>
                        </div>
                        <div className="metric-card">
                            <span className="material-symbols-outlined">visibility</span>
                            <h3>Page Views</h3>
                            <p>{analyticsData.pageViews}</p>
                        </div>
                        <div className="metric-card">
                            <span className="material-symbols-outlined">call_missed_outgoing</span>
                            <h3>Bounce Rate</h3>
                            <p>{analyticsData.bounceRate}</p>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="charts-grid">
                        <div className="chart-card growth-chart">
                            <Line options={lineOptions} data={userGrowthData} />
                        </div>
                        <div className="chart-card activity-chart">
                            <Bar options={barOptions} data={userActivityData} />
                        </div>
                        <div className="chart-card distribution-chart">
                            <Doughnut options={doughnutOptions} data={userTypesData} />
                        </div>
                    </div>

                    {/* Business Metrics */}
                    <div className="business-metrics">
                        <div className="metric-card">
                            <span className="material-symbols-outlined">subscriptions</span>
                            <h3>Active Subscriptions</h3>
                            <p>{analyticsData.activeSubscriptions}</p>
                        </div>
                        <div className="metric-card">
                            <span className="material-symbols-outlined">monitoring</span>
                            <h3>Revenue Growth</h3>
                            <p>{analyticsData.revenueGrowth}</p>
                        </div>
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
