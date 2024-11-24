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
import PageOne from './components/Registration/pageOne';
import RegistrationOne from './components/Registration/registrationOne';
import RegistrationTwo from './components/Registration/registrationTwo';
import RegistrationThree from './components/Registration/registrationThree';
import RegistrationFour from './components/Registration/registrationFour';
import RegistrationFive from './components/Registration/registrationFive';

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
        <Route path="/page-one" element={<PageOne />} />
        <Route path="/registration-one" element={<RegistrationOne />} />
        <Route path="/registration-two" element={<RegistrationTwo />} />
        <Route path="/registration-three" element={<RegistrationThree />} />
        <Route path="/registration-four" element={<RegistrationFour />} />
        <Route path="/registration-complete" element={<RegistrationFive />} />
      </Routes>
    </Router>
  );
};

export default App;
