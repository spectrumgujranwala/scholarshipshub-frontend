import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, CheckCircle, Clock, AlertCircle, ArrowRight, MessageSquare, Award, Filter, RefreshCw, Send } from 'lucide-react';
import RemarksSection from '../components/RemarksSection';
import UniversityApplicationsManager from '../components/UniversityApplicationsManager';

const isSectionComplete = (key, section) => {
  if (!section) return false;

  if (key === 'applicantInfo') {
    return !!(section.firstName && section.lastName && section.dob && section.gender && section.nationality);
  }
  if (key === 'contactDetails') {
    return !!(section.phone && section.email && section.address && section.city && section.country);
  }
  if (key === 'guardianInfo') {
    return !!(section.fatherName && section.motherName && section.guardianPhone && section.guardianEmail && section.occupation);
  }
  if (key === 'academicBackground') {
    return Array.isArray(section) && section.length > 0 && section.every(edu => edu.degree && edu.institution && edu.year && edu.cgpa);
  }
  if (key === 'programInfo') {
    return !!(section.programType && section.proposedField && section.intakeYear);
  }
  if (key === 'researchExperience') {
    const hasPublications = Array.isArray(section.publications) && section.publications.length > 0 && section.publications.every(p => p.title && p.journalType);
    return !!(section.workExperience && hasPublications);
  }
  if (key === 'englishProficiency') {
    if (section.testType === 'Not Yet Taken') return true;
    return !!(section.testType && section.score && section.dateOfTest && section.expiryDate);
  }
  if (key === 'fundingInfo') {
    return !!(section.fundingType && section.details);
  }
  if (key === 'referees') {
    return true; // Optional section
  }
  if (key === 'documents') {
    return !!(section.cv);
  }
  if (key === 'declaration') {
    return !!(section.isAgreed && section.signature);
  }

  return false;
};

const DashboardPage = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const { data } = await axios.get('/api/applications/me');
        setApplication(data);
      } catch (err) {
        console.error('Error fetching application');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, []);

  if (loading) return (
    <div className="container mt-20" style={{ textAlign: 'center', padding: '50px' }}>
      <div className="spinner">Loading...</div>
    </div>
  );

  const getStatusDisplay = (status) => {
    const statusMap = {
      'draft': { label: 'In Progress', color: '#666', icon: <Clock size={20} /> },
      'submitted': { label: 'Submitted', color: '#2563eb', icon: <CheckCircle size={20} /> },
      'under_review': { label: 'Under Review', color: '#d97706', icon: <Clock size={20} /> },
      'shortlisted': { label: 'Shortlisted', color: '#059669', icon: <CheckCircle size={20} /> },
      'accepted': { label: 'Accepted', color: '#10b981', icon: <CheckCircle size={20} /> },
      'rejected': { label: 'Rejected', color: '#dc2626', icon: <AlertCircle size={20} /> }
    };
    return statusMap[status] || { label: status, color: '#666', icon: <Clock size={20} /> };
  };

  const status = getStatusDisplay(application?.status);

  const getStrengthColor = (percent) => {
    if (percent >= 80) return '#10b981';
    if (percent >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="dashboard-page container mt-20">
      <div className="welcome-header flex justify-between items-center mb-20" style={{ padding: '0 0 20px 0', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Welcome, {application?.applicantInfo?.firstName ? `${application.applicantInfo.firstName} ${application.applicantInfo.lastName}` : user.email.split('@')[0]}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your scholarship assessment profile and track your status.</p>
        </div>
        <div className="status-badge flex items-center gap-10" style={{
          backgroundColor: '#f3f4f6', padding: '8px 16px', borderRadius: '20px',
          border: `1px solid ${status.color}`, color: status.color, fontWeight: 600
        }}>
          {status.icon} {status.label}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="main-content">
          <div className="card mb-20">
            <h3 style={{ marginBottom: '15px' }}>Profile Progress</h3>
            <div className="progress-container" style={{ position: 'relative', marginBottom: '30px' }}>
              <div style={{ backgroundColor: '#e5e7eb', height: '12px', borderRadius: '6px' }}>
                <div style={{
                  backgroundColor: 'var(--primary-red)', height: '100%', borderRadius: '6px',
                  width: `${application?.completionPercentage || 0}%`, transition: 'width 0.5s ease-in-out'
                }}></div>
              </div>
              <span style={{ position: 'absolute', right: 0, top: '-25px', fontSize: '0.9rem', fontWeight: 700 }}>
                {application?.completionPercentage || 0}% Completed
              </span>
            </div>

            <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
              Complete all mandatory sections to submit your scholarship profile.
            </p>

            <button
              onClick={() => navigate('/application/edit')}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 30px' }}
            >
              {application?.completionPercentage === 0 ? 'Start Profile' : 'View Profile'} <ArrowRight size={18} />
            </button>
          </div>

          <div className="dashboard-sections mb-30">
            <div className="card" style={{ display: 'flex', gap: '15px', borderLeft: `5px solid ${getStrengthColor(application?.profileStrength || 0)}` }}>
              <div style={{ backgroundColor: '#f0fdf4', padding: '10px', borderRadius: '8px', color: getStrengthColor(application?.profileStrength || 0) }}>
                <CheckCircle size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '5px' }}>Profile Strength</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, backgroundColor: '#e5e7eb', height: '8px', borderRadius: '4px' }}>
                    <div style={{
                      backgroundColor: getStrengthColor(application?.profileStrength || 0),
                      width: `${application?.profileStrength || 0}%`,
                      height: '100%', borderRadius: '4px'
                    }}></div>
                  </div>
                  <span style={{ fontWeight: 700, minWidth: '40px' }}>{application?.profileStrength || 0}%</span>
                </div>
                <p style={{ fontSize: '0.75rem', marginTop: '5px', color: 'var(--text-muted)' }}>Based on CGPA, Publications, Age, and English Proficiency.</p>
              </div>
            </div>
          </div>

          {/* University & Scholarship Applications Consolidated Section */}
          {user?._id && (
            <UniversityApplicationsManager
              studentId={user._id}
              currentUser={user}
              isAdmin={false}
            />
          )}

          {/* Remarks Section for Student */}
          <div className="mt-40" style={{ marginBottom: '40px' }}>
            <RemarksSection
              applicationId={application?._id}
              currentUser={user}
              title="Profile Feedback & General Remarks"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
