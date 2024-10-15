import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/MainMenu/Dashboard';
import Hubs from './components/MainMenu/Hubs';
import Profile from './components/Account/Profile'; // Import Profile
import Settings from './components/Account/Settings'; // Import Settings
import User from './components/MainMenu/User'; // Import User

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} /> {/* Route for Dashboard */}
        <Route path="/hubs" element={<Hubs />} /> {/* Route for Hubs */}
        <Route path="/profile" element={<Profile />} /> {/* Route for Profile */}
        <Route path="/settings" element={<Settings />} /> {/* Route for Settings */}
        <Route path="/users" element={<User />} /> {/* Route for User */}
      </Routes>
    </Router>
  );
};

export default App;
