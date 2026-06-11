import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Download, User, Mail, Phone, MapPin,
  GraduationCap, BookOpen, FlaskConical, Languages,
  BadgeDollarSign, Star, FileText, CheckCircle, Clock, XCircle, Users, MessageSquare
} from 'lucide-react';
import RemarksSection from '../components/RemarksSection';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/layout/AdminLayout';

const AdminApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const { data } = await axios.get(`/api/applications/${id}`);
      setApplication(data);
    } catch (err) {
      setError('Failed to fetch application details');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await axios.put(`/api/applications/${id}/status`, { status: newStatus });
      // Create notification for student
      await axios.post('/api/notifications', {
        userId: application.user._id,
        title: 'Application Status Updated',
        message: `Your scholarship application status has been updated to: ${newStatus.replace('_', ' ')}`,
        type: 'status_update'
      });
      fetchApplication();
    } catch (err) {
      alert('Update failed');
    }
  };

  if (loading) return <div className="container mt-20">Loading Applicant Details...</div>;
  if (error) return <div className="container mt-20 text-danger">{error}</div>;
  if (!application) return <div className="container mt-20">Applicant not found.</div>;

  const renderSection = (title, icon, content) => (
    <div className="card mb-20">
      <div className="flex items-center gap-10 mb-20" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <div style={{ color: 'var(--primary-red)' }}>{icon}</div>
        <h3 style={{ margin: 0 }}>{title}</h3>
      </div>
      <div className="section-content">
        {content}
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="admin-detail">
        <div className="flex justify-between items-center mb-20">
          <button onClick={() => navigate('/admin/applications')} className="flex items-center gap-5 btn-dark" style={{ padding: '8px 15px', borderRadius: '4px' }}>
            <ChevronLeft size={18} /> Back to Applicants
          </button>
          <div className="flex gap-10">
            <button onClick={() => updateStatus('under_review')} className="btn" style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '8px 15px', fontSize: '0.9rem' }}>Mark Under Review</button>
            <button onClick={() => updateStatus('accepted')} className="btn" style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '8px 15px', fontSize: '0.9rem' }}>Accept Applicant</button>
            <button onClick={() => updateStatus('rejected')} className="btn" style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '8px 15px', fontSize: '0.9rem' }}>Reject Applicant</button>
          </div>
        </div>

        <div className="flex gap-20 flex-col-mobile">
          <div style={{ flex: 2 }}>
            {/* 1. Applicant Info */}
            {renderSection('Applicant Information', <User size={20} />, (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div><strong>First Name:</strong> {application.applicantInfo?.firstName || 'N/A'}</div>
                <div><strong>Last Name:</strong> {application.applicantInfo?.lastName || 'N/A'}</div>
                <div><strong>DOB:</strong> {application.applicantInfo?.dob ? new Date(application.applicantInfo.dob).toLocaleDateString() : 'N/A'}</div>
                <div><strong>Gender:</strong> {application.applicantInfo?.gender || 'N/A'}</div>
                <div><strong>Nationality:</strong> {application.applicantInfo?.nationality || 'N/A'}</div>
                <div><strong>CNIC/Passport:</strong> {application.applicantInfo?.cnic || 'N/A'}</div>
              </div>
            ))}

            {/* 2. Contact & Guardian */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {renderSection('Contact Details', <Phone size={20} />, (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="flex items-center gap-5"><Mail size={14} /> {application.contactDetails?.email || 'N/A'}</div>
                  <div className="flex items-center gap-5"><Phone size={14} /> {application.contactDetails?.phone || 'N/A'}</div>
                  <div className="flex items-center gap-5"><MapPin size={14} /> {application.contactDetails?.address || 'N/A'}, {application.contactDetails?.city || ''}, {application.contactDetails?.country || ''}</div>
                </div>
              ))}
              {renderSection('Guardian Information', <Users size={20} />, (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div><strong>Father:</strong> {application.guardianInfo?.fatherName || 'N/A'}</div>
                  <div><strong>Mother:</strong> {application.guardianInfo?.motherName || 'N/A'}</div>
                  <div><strong>Guardian Email:</strong> {application.guardianInfo?.guardianEmail || 'N/A'}</div>
                  <div><strong>Guardian Phone:</strong> {application.guardianInfo?.guardianPhone || 'N/A'}</div>
                  <div><strong>Occupation:</strong> {application.guardianInfo?.occupation || 'N/A'}</div>
                </div>
              ))}
            </div>

            {/* 3. Academic Background */}
            {renderSection('Academic Background', <GraduationCap size={20} />, (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                      <th style={{ padding: '10px' }}>Degree</th>
                      <th style={{ padding: '10px' }}>Institution</th>
                      <th style={{ padding: '10px' }}>Year</th>
                      <th style={{ padding: '10px' }}>CGPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {application.academicBackground?.length > 0 ? application.academicBackground.map((edu, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '10px' }}>{edu.degree}</td>
                        <td style={{ padding: '10px' }}>{edu.institution}</td>
                        <td style={{ padding: '10px' }}>{edu.year}</td>
                        <td style={{ padding: '10px' }}>{edu.cgpa}</td>
                      </tr>
                    )) : <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No academic history provided.</td></tr>}
                  </tbody>
                </table>
              </div>
            ))}

            {/* 4. Program & Research */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {renderSection('Program Preference', <BookOpen size={20} />, (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div><strong>Program:</strong> {application.programInfo?.programType || 'N/A'}</div>
                  <div><strong>Proposed Field:</strong> {application.programInfo?.proposedField || 'N/A'}</div>
                  <div><strong>Supervisor:</strong> {application.programInfo?.supervisorName || 'N/A'}</div>
                  <div><strong>Intake Year:</strong> {application.programInfo?.intakeYear || 'N/A'}</div>
                </div>
              ))}
              {renderSection('Research & Work', <FlaskConical size={20} />, (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div><strong>Work Exp:</strong> {application.researchExperience?.workExperience || 'N/A'}</div>
                  <div><strong>Research Statement:</strong> {application.researchExperience?.researchStatement || 'N/A'}</div>
                  <div><strong>Publications:</strong> {application.researchExperience?.publications?.length > 0 ? application.researchExperience.publications.join(', ') : 'None'}</div>
                </div>
              ))}
            </div>

            {/* 5. Referees */}
            {renderSection('Referees', <Star size={20} />, (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                {application.referees?.length > 0 ? application.referees.map((ref, i) => (
                  <div key={i} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                    <div style={{ fontWeight: 700, marginBottom: '5px' }}>{ref.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#444' }}>{ref.designation} at {ref.institution}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>{ref.email} | {ref.phone}</div>
                    <div style={{ fontSize: '0.8rem', fontStyle: 'italic', marginTop: '5px' }}>Relation: {ref.relation}</div>
                  </div>
                )) : <div style={{ color: '#999' }}>No referees listed.</div>}
              </div>
            ))}

            {/* Profile Feedback Section */}
            <RemarksSection
              applicationId={id}
              currentUser={currentUser}
              title="Profile Feedback & General Remarks"
            />
          </div>

          <div style={{ flex: 1 }}>
            {/* Status Sidebar */}
            <div className="card mb-20" style={{ textAlign: 'center', position: 'sticky', top: '20px' }}>
              <h3 style={{ marginBottom: '15px' }}>Applicant Status</h3>
              <div style={{
                padding: '12px', borderRadius: '20px', fontWeight: 700, marginBottom: '20px',
                backgroundColor: application.status === 'accepted' ? '#ecfdf5' :
                  application.status === 'rejected' ? '#fef2f2' : '#eff6ff',
                color: application.status === 'accepted' ? '#10b981' :
                  application.status === 'rejected' ? '#ef4444' : '#2563eb',
                border: `1px solid ${application.status === 'accepted' ? '#10b981' : application.status === 'rejected' ? '#ef4444' : '#2563eb'}`
              }}>
                {application.status.toUpperCase().replace('_', ' ')}
              </div>
              <div className="progress-bar mb-20" style={{ height: '12px', backgroundColor: '#e5e7eb', borderRadius: '6px' }}>
                <div style={{ width: `${application.completionPercentage}%`, height: '100%', backgroundColor: 'var(--primary-red)', borderRadius: '6px', transition: 'width 0.5s ease' }}></div>
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Completion: {application.completionPercentage}%</p>
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>Submitted on: {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'Pending'}</p>
            </div>

            {/* Document Downloads */}
            {renderSection('Documents', <FileText size={20} />, (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {application.documents && Object.entries(application.documents).map(([key, url]) => {
                  if (!url || key === 'others' || (Array.isArray(url) && url.length === 0)) return null;
                  return (
                    <div key={key} className="flex justify-between items-center" style={{ padding: '12px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fff' }}>
                      <span style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.85rem' }}>{key}</span>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 btn" style={{ padding: '5px 12px', backgroundColor: 'var(--bg-light)', borderRadius: '4px' }}>
                        <Download size={16} />
                      </a>
                    </div>
                  );
                })}
                {application.documents?.others?.map((url, i) => (
                  <div key={i} className="flex justify-between items-center" style={{ padding: '12px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fff' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Other Doc {i + 1}</span>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 btn" style={{ padding: '5px 12px', backgroundColor: 'var(--bg-light)', borderRadius: '4px' }}>
                      <Download size={16} /> Open
                    </a>
                  </div>
                ))}
              </div>
            ))}

            {/* Declaration */}
            {renderSection('Final Review', <CheckCircle size={20} />, (
              <div style={{ fontSize: '0.9rem', color: '#333' }}>
                <p style={{ marginBottom: '8px' }}>Agreed to Terms: <strong>{application.declaration?.isAgreed ? 'Yes' : 'No'}</strong></p>
                <p style={{ marginBottom: '8px' }}>Signed by: <strong style={{ fontFamily: 'cursive', fontSize: '1.1rem' }}>{application.declaration?.signature || 'Pending'}</strong></p>
                <p>Declaration Date: {application.declaration?.date ? new Date(application.declaration.date).toLocaleDateString() : 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminApplicationDetail;
