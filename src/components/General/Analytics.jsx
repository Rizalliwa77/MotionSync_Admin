import React, { useState, useEffect } from 'react';
import '../../assets/General/Analytics.css';
import Sidebar from '../Sidebar';
import { getFirestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { analytics, logAnalyticsEvent } from '../../firebase/firebaseConfig';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Analytics = () => {
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const [timeRange, setTimeRange] = useState('week');
    const [analyticsData, setAnalyticsData] = useState({
        totalUsers: 0,
        activeUsers: 0,
        registeredHubs: 0,
        conversionRate: '0%'
    });

    const [analyticsMetrics, setAnalyticsMetrics] = useState({
        pageViews: 0,
        userEngagement: 0,
        activeUsers: {
            daily: 0,
            weekly: 0,
            monthly: 0
        }
    });

    const [userGrowthData, setUserGrowthData] = useState({
        labels: [],
        datasets: []
    });
    const [hubDistributionData, setHubDistributionData] = useState({
        labels: [],
        datasets: []
    });

    // Add chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                // Get users collection reference
                const usersRef = collection(db, 'users');
                const hubsRef = collection(db, 'hubs');

                // Get total users count
                const usersSnapshot = await getDocs(usersRef);
                const totalUsers = usersSnapshot.size;

                // Get total hubs count
                const hubsSnapshot = await getDocs(hubsRef);
                const totalHubs = hubsSnapshot.size;

                // Get user creation dates for growth chart
                const userDates = usersSnapshot.docs.map(doc => {
                    return doc.data().createdAt?.toDate() || new Date();
                });

                // Get hub types for distribution chart
                const hubTypes = hubsSnapshot.docs.map(doc => doc.data().type);

                // Process user growth data
                const userGrowthByDate = processUserGrowthData(userDates);
                
                // Process hub distribution data
                const hubDistribution = processHubDistributionData(hubTypes);

                // Update analytics data
                setAnalyticsData({
                    totalUsers,
                    activeUsers: totalUsers, // You might want to refine this based on your active user criteria
                    registeredHubs: totalHubs,
                    conversionRate: `${((totalHubs / totalUsers) * 100).toFixed(1)}%`
                });

                // Update chart data
                setUserGrowthData({
                    labels: userGrowthByDate.labels,
                    datasets: [{
                        label: 'User Growth',
                        data: userGrowthByDate.data,
                        borderColor: '#00A67E',
                        backgroundColor: 'rgba(0, 166, 126, 0.1)',
                        fill: true,
                    }]
                });

                setHubDistributionData({
                    labels: hubDistribution.labels,
                    datasets: [{
                        label: 'Hub Distribution',
                        data: hubDistribution.data,
                        backgroundColor: [
                            'rgba(0, 166, 126, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                        ],
                    }]
                });

            } catch (error) {
                console.error('Error fetching analytics data:', error);
            }
        };

        fetchAnalyticsData();
    }, [timeRange]);

    // Helper function to process user growth data
    const processUserGrowthData = (dates) => {
        const sortedDates = dates.sort((a, b) => a - b);
        const dateLabels = [];
        const userCounts = [];
        let userCount = 0;

        sortedDates.forEach(date => {
            const dateStr = date.toLocaleDateString();
            if (!dateLabels.includes(dateStr)) {
                dateLabels.push(dateStr);
                userCount++;
                userCounts.push(userCount);
            }
        });

        return {
            labels: dateLabels,
            data: userCounts
        };
    };

    // Helper function to process hub distribution data
    const processHubDistributionData = (hubTypes) => {
        const distribution = hubTypes.reduce((acc, type) => {
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(distribution),
            data: Object.values(distribution)
        };
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

                    <div className="metrics-grid">
                        <div className="metric-card">
                            <span className="material-symbols-outlined">group</span>
                            <h3>Total Users</h3>
                            <p>{analyticsData?.totalUsers || 'N/A'}</p>
                        </div>
                        <div className="metric-card">
                            <span className="material-symbols-outlined">person</span>
                            <h3>Active Users</h3>
                            <p>{analyticsData?.activeUsers || 'N/A'}</p>
                        </div>
                        <div className="metric-card">
                            <span className="material-symbols-outlined">domain</span>
                            <h3>Registered Hubs</h3>
                            <p>{analyticsData?.registeredHubs || 'N/A'}</p>
                        </div>
                        <div className="metric-card">
                            <span className="material-symbols-outlined">trending_up</span>
                            <h3>Conversion Rate</h3>
                            <p>{analyticsData?.conversionRate || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="performance-metrics">
                        <div className="metric-card">
                            <span className="material-symbols-outlined">visibility</span>
                            <h3>Page Views</h3>
                            <p>{analyticsMetrics.pageViews || 'N/A'}</p>
                            <small>Last {timeRange}</small>
                        </div>
                        <div className="metric-card">
                            <span className="material-symbols-outlined">group</span>
                            <h3>Active Users</h3>
                            <p>{analyticsMetrics.activeUsers[timeRange] || 'N/A'}</p>
                            <small>Last {timeRange}</small>
                        </div>
                    </div>

                    {/* Add charts section */}
                    <div className="charts-grid">
                        <div className="chart-card">
                            <h3>User Growth Over Time</h3>
                            <div className="chart-container">
                                <Line data={userGrowthData} options={chartOptions} />
                            </div>
                        </div>
                        <div className="chart-card">
                            <h3>Hub Distribution</h3>
                            <div className="chart-container">
                                <Bar data={hubDistributionData} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
