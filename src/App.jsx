import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/MainMenu/Dashboard';
import Hubs from './components/MainMenu/Hubs';
import Profile from './components/Account/Profile';
import Settings from './components/Account/Settings';
import User from './components/MainMenu/User';
import Landing from './components/Landing'; 
import Login from './components/Login'; 
import TranslationManagement from './components/General/Translation';
import UserContent from './components/General/userContent';
import HubContent from './components/General/hubContent';
import Analytics from './components/General/Analytics';
import Notifications from './components/General/Notifications';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hubs" element={<Hubs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/users" element={<User />} />
        <Route path="/translation" element={<TranslationManagement />} />
        <Route path="/user-content" element={<UserContent />} />
        <Route path="/hub-content" element={<HubContent />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
};

export default App;
