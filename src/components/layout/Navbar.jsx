import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Bell, User as UserIcon, Mail, MapPin } from 'lucide-react';
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
    <>
      <div className="top-bar" style={{
        backgroundColor: 'var(--secondary-dark)',
        color: '#ccc',
        padding: '14px 0',
        fontSize: '0.85rem',
        borderBottom: '1px solid #2a2a2a'
      }}>
        <div className="container flex justify-between items-center flex-col-mobile gap-10">
          <div className="flex gap-30 items-center flex-col-mobile gap-5 top-bar-links-left">
            <a href="mailto:info@spectrumconsultants.pk" className="top-bar-link">
              <Mail size={14} color="var(--primary-red)" />
              <span>info@spectrumconsultants.pk</span>
            </a>
            <a href="https://maps.google.com/?q=Gulberg+Islamabad" target="_blank" rel="noopener noreferrer" className="top-bar-link">
              <MapPin size={14} color="var(--primary-red)" />
              <span>Gulberg, Islamabad</span>
            </a>
          </div>
          <div className="flex items-center">
            <a href="https://wa.me/923004493831" target="_blank" rel="noopener noreferrer" className="top-bar-link" style={{ fontWeight: 600 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#25D366" viewBox="0 0 24 24" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.167 1.448 4.787 1.449 5.423 0 9.832-4.388 9.835-9.78.001-2.614-1.011-5.071-2.853-6.915C16.57 2.064 14.116.822 11.5.822c-5.429 0-9.843 4.39-9.846 9.784-.001 2.03.533 4.02 1.545 5.76L2.17 20.89l4.477-1.173zM18.067 14.9c-.33-.164-1.953-.964-2.253-1.074-.3-.109-.519-.164-.738.164-.22.329-.849 1.074-1.04 1.293-.192.219-.384.246-.714.082-2.189-1.096-3.824-2.825-4.993-4.846-.33-.568.33-.527.944-1.748.102-.204.051-.383-.027-.547-.079-.164-.738-1.78-.997-2.427-.267-.643-.54-.555-.738-.565-.19-.009-.411-.011-.63-.011-.22 0-.577.082-.88.411-.303.329-1.157 1.129-1.157 2.753 0 1.624 1.182 3.193 1.346 3.413.165.219 2.328 3.555 5.639 4.985.787.34 1.402.543 1.882.697.79.251 1.512.215 2.08.131.633-.093 1.953-.799 2.228-1.571.275-.773.275-1.436.192-1.571-.082-.136-.3-.219-.63-.383z" />
              </svg>
              <span>03004493831</span>
            </a>
          </div>
        </div>
      </div>
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
    </>
  );
};

export default Navbar;
