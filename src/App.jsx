import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/MainMenu/Dashboard';
import Hubs from './components/MainMenu/Hubs';
import Profile from './components/Account/Profile';
import Settings from './components/Account/Settings';
import User from './components/MainMenu/User';
import Landing from './components/Landing'; 
import Login from './components/Login'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hubs" element={<Hubs />} /> 
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/users" element={<User />} /> 
      </Routes>
    </Router>
  );
};

export default App;
