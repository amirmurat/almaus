import { NavLink } from 'react-router-dom';
import { AiOutlineCalendar, AiOutlineBell, AiOutlineUser } from 'react-icons/ai';
import { MdOutlineAssignment } from 'react-icons/md';
import './BottomNav.css';

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/schedule">     <AiOutlineCalendar /> <span>Расписание</span></NavLink>
      <NavLink to="/assignments">  <MdOutlineAssignment />      <span>Задания</span></NavLink>
      <NavLink to="/announcements"><AiOutlineBell />     <span>Анонсы</span></NavLink>
      <NavLink to="/profile">      <AiOutlineUser />     <span>Профиль</span></NavLink>
    </nav>
  );
}
