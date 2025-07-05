import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PinLock from './pages/PinLock';
import Schedule from './pages/Schedule';
import Assignments from './pages/Assignments';
import Announcements from './pages/Announcements';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';
import AssignmentDetails from './pages/AssignmentDetails';
import AssignmentRecord from './pages/AssignmentRecord';
import AnnouncementDetails from './pages/AnnouncementDetails';
import Services from './pages/Services';
import SubjectsPage from './pages/Subjects';
import SubjectDetails from './pages/SubjectDetails';
import Docs from './pages/Docs';
import ProfilePage from './pages/ProfilePage';
import Filter from './pages/Filter';

export default function App() {
  const loggedIn = localStorage.getItem('token');
  const pin      = localStorage.getItem('pin');

  if (!loggedIn)                         return <Login />;
  if (!pin)                              return <PinLock firstSetup={true} />;
  if (!sessionStorage.getItem('pinOk'))  return <PinLock />;

  return (
    <>
      <Routes>
        <Route path="/"              element={<Navigate to="/schedule" />} />
        <Route path="/schedule"      element={<Schedule />} />
        <Route path="/assignments"   element={<Assignments />} />
        <Route path="/assignments/:id"    element={<AssignmentDetails />} />
        <Route path="/assignments/:id/record" element={<AssignmentRecord />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/announcements/:id" element={<AnnouncementDetails />} />
        <Route path="/profile"       element={<Profile />} />
        <Route path="/services"      element={<Services />} />
        <Route path="/subjects"    element={<SubjectsPage />} />
        <Route path="/subject/:subjectName" element={<SubjectDetails />} />
        <Route path="/filter"        element={<Filter />} />
        <Route path="/docs"          element={<Docs />} />
        <Route path="/profile-page"  element={<ProfilePage />} />
      </Routes>
      <BottomNav />
    </>
  );
}
