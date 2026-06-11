import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { Bell, CheckCircle, Info, Calendar, MailOpen, ChevronLeft } from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/mark-all-read');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('/api/notifications');
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sortedData);
    } catch (err) {
      console.error('Error fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Error marking as read');
    }
  };

  if (loading) return <div className="container mt-20">Loading Notifications...</div>;

  return (
    <div className="notifications-page container mt-20 mb-40">
      <div className="flex items-center gap-5 mb-20" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <ChevronLeft size={16} /> Back to Dashboard
      </div>

      <div className="flex justify-between items-center mb-20">
        <h1 style={{ fontSize: '1.8rem' }}>Notifications</h1>
        <div className="flex items-center gap-15">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {notifications.filter(n => !n.isRead).length} Unread
          </span>
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={markAllAsRead}
              className="btn-light"
              style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', borderRadius: '4px' }}
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="notifications-list flex flex-col gap-10 mb-40">
        {notifications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
            <Bell size={48} color="#ccc" style={{ marginBottom: '15px' }} />
            <p>No notifications yet.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className="card"
              style={{
                padding: '20px', display: 'flex', gap: '20px',
                borderLeft: !notif.isRead ? '4px solid var(--primary-red)' : '4px solid #eee',
                backgroundColor: !notif.isRead ? '#fffdfd' : '#fff'
              }}
            >
              <div style={{
                backgroundColor: notif.type === 'status_update' ? '#ecfdf5' : '#eff6ff',
                color: notif.type === 'status_update' ? '#10b981' : '#3b82f6',
                padding: '12px', borderRadius: '50%', height: '48px', width: '48px',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}>
                {notif.type === 'status_update' ? <CheckCircle size={24} /> : <Info size={24} />}
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex justify-between items-start">
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>{notif.title}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#999', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={14} /> {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '10px' }}>{notif.message}</p>
                {!notif.isRead && (
                  <button
                    onClick={() => markAsRead(notif._id)}
                    style={{ background: 'none', color: 'var(--primary-red)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <MailOpen size={16} /> Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
