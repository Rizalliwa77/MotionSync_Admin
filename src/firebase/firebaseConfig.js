import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBxsxQQxz160SY60DQnFs9GOPL7941zStY",
  authDomain: "motionsync-551e0.firebaseapp.com",
  projectId: "motionsync-551e0",
  storageBucket: "motionsync-551e0.appspot.com",
  messagingSenderId: "399969005893",
  appId: "1:399969005893:web:1240febf596953745c0e2c",
  measurementId: "G-6GK37BG27V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Helper function to log analytics events
export const logAnalyticsEvent = (eventName, eventParams = {}) => {
  logEvent(analytics, eventName, eventParams);
};

// Helper function to get analytics data
// Note: Firebase Analytics doesn't provide direct access to analytics data through the client SDK
// You'll need to use Firebase Analytics dashboard or export data to BigQuery for detailed analytics
export const getAnalyticsData = async () => {
  try {
    // For now, return mock data
    // In production, you should implement a backend service to fetch this data
    return {
      totalUsers: 0,
      monthlyData: Array(6).fill(0)
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
};

export { db, analytics, auth, storage };
