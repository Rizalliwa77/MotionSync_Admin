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
import PageOne from './Registration/pageOne';
import RegistrationOne from './Registration/registrationOne';
import RegistrationTwo from './Registration/registrationTwo';
import RegistrationThree from './Registration/registrationThree';
import RegistrationFour from './Registration/registrationFour';
import RegistrationFive from './Registration/registrationFive';
// Updated imports for Hub Admin components
import HubAdminDashboard from './components/HubAdmin/jsx/Main Menu/HubAdminDashboard';
import HubAdmin_StudentList from './components/HubAdmin/jsx/Main Menu/HubAdmin_StudentList';
import HubAdmin_EducatorList from './components/HubAdmin/jsx/Main Menu/HubAdmin_EducatorList';
import HubAdmin_Content from './components/HubAdmin/jsx/Management/HubAdmin_Content';
import HubAdmin_Setting from './components/HubAdmin/jsx/Account/HubAdmin_Setting';
import HubAdmin_Profile from './components/HubAdmin/jsx/Account/HubAdmin_Profile';
import HubAdmin_Messages from './components/HubAdmin/jsx/Management/HubAdmin_Messages';
import HubAdmin_Classroom from './components/HubAdmin/jsx/Management/HubAdmin_Classroom';

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
        {/* Hub Admin routes with updated component paths */}
        <Route path="/hub-admin/dashboard" element={<HubAdminDashboard />} />
        <Route path="/hub-admin/students" element={<HubAdmin_StudentList />} />
        <Route path="/hub-admin/educators" element={<HubAdmin_EducatorList />} />
        <Route path="/hub-admin/content" element={<HubAdmin_Content />} />
        <Route path="/hub-admin/settings" element={<HubAdmin_Setting />} />
        <Route path="/hub-admin/profile" element={<HubAdmin_Profile />} />
        <Route path="/hub-admin/messages" element={<HubAdmin_Messages />} />
        <Route path="/hub-admin/classroom" element={<HubAdmin_Classroom />} />
        <Route path="/hub-admin/registration" element={<PageOne />} />
        <Route path="/hub-admin/registration/step-1" element={<RegistrationOne />} />
        <Route path="/hub-admin/registration/step-2" element={<RegistrationTwo />} />
        <Route path="/hub-admin/registration/step-3" element={<RegistrationThree />} />
        <Route path="/hub-admin/registration/step-4" element={<RegistrationFour />} />
        <Route path="/hub-admin/registration/complete" element={<RegistrationFive />} />
      </Routes>
    </Router>
  );
};

export default App;
