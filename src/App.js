import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PinLock from './pages/PinLock';
import Schedule from './pages/Schedule';
import Assignments from './pages/Assignments';
import Announcements from './pages/Announcements';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';
import AssignmentDetails from './pages/AssignmentDetails';

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
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/profile"       element={<Profile />} />
      </Routes>
      <BottomNav />
    </>
  );
}
