import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Bell, User as UserIcon } from 'lucide-react';
import logo from '../../assets/spectrum_logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      // Polling for new notifications every 5 seconds for a near real-time experience
      const interval = setInterval(fetchUnreadCount, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await axios.get('/api/notifications');
      const unread = data.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Error fetching unread count');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar" style={{
      backgroundColor: 'var(--white)',
      boxShadow: 'var(--shadow-md)',
      padding: '10px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container flex justify-between items-center">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'default' }}>
            <img src={logo} alt="Spectrum Consultants" style={{ height: '50px' }} />
            <div>
              <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--secondary-dark)' }}>SCHOLARSHIPS</span>
              <span style={{ fontWeight: 400, fontSize: '1.2rem', color: 'var(--text-muted)' }}>HUB</span>
            </div>
          </div>
        ) : (
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={logo} alt="Spectrum Consultants" style={{ height: '50px' }} />
            <div>
              <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--secondary-dark)' }}>SCHOLARSHIPS</span>
              <span style={{ fontWeight: 400, fontSize: '1.2rem', color: 'var(--text-muted)' }}>HUB</span>
            </div>
          </Link>
        )}

        <div className="flex items-center gap-20">
          {user ? (
            <>

              <Link to="/notifications" style={{ position: 'relative' }}>
                <Bell size={20} color="var(--secondary-dark)" />
                {unreadCount > 0 && (
                  <span className="badge" style={{
                    position: 'absolute', top: '-5px', right: '-5px',
                    backgroundColor: 'var(--primary-red)', color: 'white',
                    borderRadius: '50%', padding: '2px 6px', fontSize: '10px',
                    fontWeight: 'bold', minWidth: '18px', textAlign: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </Link>

              <div className="user-profile flex items-center gap-10">
                <UserIcon size={20} color="var(--secondary-dark)" />
                <span className="email-text" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {user.email.split('@')[0]}
                </span>
              </div>

              <button onClick={handleLogout} className="btn-logout" style={{
                background: 'none', display: 'flex', alignItems: 'center', gap: '5px',
                color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem'
              }}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <div className="flex gap-10">
              <Link to="/login" className="btn btn-dark" style={{ padding: '8px 20px' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 20px' }}>Apply Now</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
