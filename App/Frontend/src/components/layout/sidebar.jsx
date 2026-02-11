import { NavLink } from 'react-router-dom';
import { 
  FaChartLine, 
  FaCalendar, 
  FaGraduationCap, 
  FaUserGraduate, 
  FaChalkboardTeacher,
  FaDoorOpen,
  FaBuilding 
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', icon: <FaChartLine />, label: 'Dashboard' },
    { path: '/calendario', icon: <FaCalendar />, label: 'Calendario' },
    { path: '/progetti', icon: <FaGraduationCap />, label: 'Progetti' },
    { path: '/studenti', icon: <FaUserGraduate />, label: 'Studenti' },
    { path: '/docenti', icon: <FaChalkboardTeacher />, label: 'Docenti' },
    { path: '/aule', icon: <FaDoorOpen />, label: 'Aule' },
    { path: '/sedi', icon: <FaBuilding />, label: 'Sedi' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-box">LOGO</div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;