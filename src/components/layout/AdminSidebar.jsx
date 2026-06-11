import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users, Globe, LayoutDashboard,
  ChevronRight, LogOut, Award
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminSidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={22} /> },
    { name: 'Applicants', path: '/admin/applications', icon: <Users size={22} /> },
    { name: 'Applications', path: '/admin/university-apps', icon: <Globe size={22} /> },
    { name: 'Scholarships', path: '/admin/scholarships', icon: <Award size={22} /> },
  ];

  return (
    <div className="admin-sidebar" style={{
      width: '280px',
      height: 'calc(100vh - 70px)',
      backgroundColor: '#fff',
      borderRight: '1px solid #e5e7eb',
      padding: '30px 20px',
      position: 'fixed',
      top: '70px',
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      zIndex: 90
    }}>
      <div className="sidebar-menu">
        <p style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#9ca3af',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '25px',
          paddingLeft: '10px'
        }}>
          Management
        </p>
        <div className="flex flex-col gap-10">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => `
                flex items-center justify-between p-15 rounded-12 transition-all
                ${isActive ? 'bg-primary-red text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}
              `}
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'var(--primary-red)' : 'transparent',
                color: isActive ? '#fff' : '#374151',
                textDecoration: 'none'
              })}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-15">
                    {item.icon}
                    <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>{item.name}</span>
                  </div>
                  <ChevronRight size={18} opacity={isActive ? 1 : 0.3} />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="sidebar-footer pt-20" style={{ borderTop: '1px solid #f3f4f6' }}>
        <button
          onClick={logout}
          className="flex items-center gap-10 p-12 w-100 rounded-8 text-red hover-bg-light transition-all"
          style={{ width: '100%', textAlign: 'left', background: 'none' }}
        >
          <LogOut size={20} />
          <span style={{ fontWeight: 600 }}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
