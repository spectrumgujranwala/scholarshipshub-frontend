import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, CheckCircle, Clock, AlertCircle, BarChart3, TrendingUp, ShieldAlert, ShieldCheck } from 'lucide-react';

import AdminLayout from '../components/layout/AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    recent: []
  });
  const [loading, setLoading] = useState(true);
  const [adminForm, setAdminForm] = useState({ email: '', password: '', designation: '' });
  const [adminStatus, setAdminStatus] = useState({ loading: false, error: null, success: false });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: apps } = await axios.get('/api/applications');
        const statsObj = {
          total: apps.length,
          pending: apps.filter(a => a.status === 'submitted' || a.status === 'under_review').length,
          accepted: apps.filter(a => a.status === 'accepted').length,
          rejected: apps.filter(a => a.status === 'rejected').length,
          recent: apps.slice(0, 5).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        };
        setStats(statsObj);
      } catch (err) {
        console.error('Error fetching admin stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="container mt-20">Loading Admin Dashboard...</div>;

  const statCards = [
    { label: 'Total Applicants', count: stats.total, icon: <FileText size={24} />, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Pending Review', count: stats.pending, icon: <Clock size={24} />, color: '#d97706', bg: '#fffbeb' },
    { label: 'Accepted', count: stats.accepted, icon: <CheckCircle size={24} />, color: '#10b981', bg: '#ecfdf5' },
    { label: 'Rejected', count: stats.rejected, icon: <AlertCircle size={24} />, color: '#ef4444', bg: '#fef2f2' },
  ];

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAdminStatus({ loading: true, error: null, success: false });
    try {
      await axios.post('/api/auth/admin', adminForm);
      setAdminStatus({ loading: false, error: null, success: true });
      setAdminForm({ email: '', password: '', designation: '' });
      setTimeout(() => setAdminStatus(prev => ({ ...prev, success: false })), 3000);
    } catch (err) {
      setAdminStatus({
        loading: false,
        error: err.response?.data?.message || 'Error creating admin',
        success: false
      });
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="flex justify-between items-center mb-20">
          <h1 style={{ fontSize: '1.8rem' }}>Admin Dashboard</h1>
          <button className="btn btn-primary" onClick={() => navigate('/admin/applications')}>View All Applicants</button>
        </div>

        <div className="grid gap-20" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '30px' }}>
          {statCards.map((stat, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ backgroundColor: stat.bg, color: stat.color, padding: '15px', borderRadius: '12px' }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{stat.label}</p>
                <h2 style={{ fontSize: '1.5rem', marginTop: '5px' }}>{stat.count}</h2>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-20 flex-col-mobile">
          <div style={{ flex: 2 }}>
            <div className="card">
              <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Recent Applications</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid #f3f4f6' }}>
                    <th style={{ padding: '12px 10px' }}>Applicant</th>
                    <th style={{ padding: '12px 10px' }}>Program</th>
                    <th style={{ padding: '12px 10px' }}>Status</th>
                    <th style={{ padding: '12px 10px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent.map((app, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 600 }}>
                        {app.applicantInfo?.firstName ? `${app.applicantInfo.firstName} ${app.applicantInfo.lastName}` : app.user?.email || 'N/A'}
                      </td>
                      <td style={{ padding: '12px 10px' }}>{app.programInfo?.programType || 'N/A'}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem',
                          backgroundColor: app.status === 'accepted' ? '#ecfdf5' : '#f3f4f6',
                          color: app.status === 'accepted' ? '#10b981' : '#666'
                        }}>{app.status}</span>
                      </td>
                      <td style={{ padding: '12px 10px', fontSize: '0.85rem' }}>{new Date(app.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div className="card shadow-sm" style={{ borderTop: '4px solid var(--primary-red)' }}>
              <h3 style={{ marginBottom: '15px' }}>Quick Insights</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-10" style={{ fontSize: '0.9rem' }}><TrendingUp size={16} color="#10b981" /> Approval Rate</span>
                  <span style={{ fontWeight: 700 }}>{stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-10" style={{ fontSize: '0.9rem' }}><BarChart3 size={16} color="#3b82f6" /> Monthly Growth</span>
                  <span style={{ fontWeight: 700 }}>+12%</span>
                </div>
              </div>
            </div>

            <div className="card shadow-sm mt-20" style={{ borderTop: '4px solid #10b981' }}>
              <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#10b981" />
                Create Admin User
              </h3>
              <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <input
                    type="email"
                    placeholder="Admin Email"
                    required
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 15px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <select
                    required
                    value={adminForm.designation}
                    onChange={(e) => setAdminForm({ ...adminForm, designation: e.target.value })}
                    style={{ width: '100%', padding: '10px 15px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  >
                    <option value="" disabled>Select Designation</option>
                    <option value="Counsellor">Counsellor</option>
                    <option value="Professor">Professor</option>
                    <option value="Admissions Officer">Admissions Officer</option>
                    <option value="Senior Admin">Senior Admin</option>
                  </select>
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password (min 6 chars)"
                    required
                    minLength="6"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    style={{ width: '100%', padding: '10px 15px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                </div>
                {adminStatus.error && <div style={{ color: '#ef4444', fontSize: '0.85rem' }}>{adminStatus.error}</div>}
                {adminStatus.success && <div style={{ color: '#10b981', fontSize: '0.85rem' }}>Admin created successfully!</div>}
                <button
                  type="submit"
                  disabled={adminStatus.loading}
                  style={{
                    backgroundColor: '#10b981', color: 'white', padding: '10px', borderRadius: '8px',
                    border: 'none', cursor: adminStatus.loading ? 'not-allowed' : 'pointer', fontWeight: '600'
                  }}>
                  {adminStatus.loading ? 'Creating...' : 'Create Admin'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
