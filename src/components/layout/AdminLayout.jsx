import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout flex">
      <AdminSidebar />
      <main style={{
        marginLeft: '280px',
        padding: '25px',
        width: 'calc(100% - 280px)',
        minHeight: 'calc(100vh - 70px)',
        backgroundColor: '#f9fafb'
      }}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
