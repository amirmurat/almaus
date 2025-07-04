import { NavLink } from 'react-router-dom';
import { AiOutlineCalendar, AiFillCalendar, AiOutlineBell, AiFillBell } from 'react-icons/ai';
import { MdOutlineAssignment, MdAssignment } from 'react-icons/md';
import { RiAppsLine, RiAppsFill } from 'react-icons/ri';
import { useUnreadUrgentAnnouncements } from '../utils/useUnreadUrgentAnnouncements';
import './BottomNav.css';

export default function BottomNav() {
  const hasUnreadUrgent = useUnreadUrgentAnnouncements();

  return (
    <nav className="bottom-nav">
      <NavLink to="/schedule" className={({ isActive }) => isActive ? 'active' : ''}>
        {({ isActive }) => (
          <>
            <div style={{ position: 'relative', display: 'block', width: 24, height: 24, margin: '0 auto 2px' }}>
              {isActive ? <AiFillCalendar style={{ width: 24, height: 24 }} /> : <AiOutlineCalendar style={{ width: 24, height: 24 }} />}
            </div>
            <span>Расписание</span>
          </>
        )}
      </NavLink>
      <NavLink to="/assignments" className={({ isActive }) => isActive ? 'active' : ''}>
        {({ isActive }) => (
          <>
            <div style={{ position: 'relative', display: 'block', width: 24, height: 24, margin: '0 auto 2px' }}>
              {isActive ? <MdAssignment style={{ width: 24, height: 24 }} /> : <MdOutlineAssignment style={{ width: 24, height: 24 }} />}
            </div>
            <span>Задания</span>
          </>
        )}
      </NavLink>
      <NavLink to="/announcements" className={({ isActive }) => isActive ? 'active announcements-link' : 'announcements-link'}>
        {({ isActive }) => (
          <>
            <div style={{ position: 'relative', display: 'block', width: 24, height: 24, margin: '0 auto 2px' }}>
              {isActive ? <AiFillBell style={{ width: 24, height: 24 }} /> : <AiOutlineBell style={{ width: 24, height: 24 }} />}
              {hasUnreadUrgent && (
                <div style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 10,
                  height: 10,
                  backgroundColor: '#ff4444',
                  borderRadius: '50%',
                  border: '1.5px solid white',
                  zIndex: 1,
                  boxShadow: '0 0 0 1px #fff',
                  pointerEvents: 'none',
                }} />
              )}
            </div>
            <span>Анонсы</span>
          </>
        )}
      </NavLink>
      <NavLink to="/services" className={({ isActive }) => isActive ? 'active' : ''}>
        {({ isActive }) => (
          <>
            <div style={{ position: 'relative', display: 'block', width: 24, height: 24, margin: '0 auto 2px' }}>
              {isActive ? (
                <RiAppsFill style={{ width: 24, height: 24, color: '#1976d2' }} />
              ) : (
                <RiAppsLine style={{ width: 24, height: 24 }} />
              )}
            </div>
            <span>Услуги</span>
          </>
        )}
      </NavLink>
    </nav>
  );
}
