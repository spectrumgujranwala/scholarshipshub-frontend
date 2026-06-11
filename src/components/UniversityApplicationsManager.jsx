import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import {
  Plus, Trash2, Edit2, Check, X,
  ChevronDown, ChevronUp, Globe,
  Calendar, MessageCircle, Award, Search, Filter, Clock, AlertCircle, ArrowRight
} from 'lucide-react';
import RemarksSection from './RemarksSection';

const UniversityApplicationsManager = ({ studentId, currentUser, isAdmin }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  
  // Tab control state for students
  const [activeTab, setActiveTab] = useState('my-applications'); // 'scholarships' or 'my-applications'

  // Scholarships list and filters states
  const [scholarships, setScholarships] = useState([]);
  const [scholarshipsLoading, setScholarshipsLoading] = useState(true);
  const [appliedScholarships, setAppliedScholarships] = useState(new Set());
  const [selectedDetailScholarship, setSelectedDetailScholarship] = useState(null);
  const [filters, setFilters] = useState({
    title: '',
    country: '',
    degreeLevels: 'all',
    studyArea: ''
  });

  const [formData, setFormData] = useState({
    universityName: '',
    programName: '',
    status: 'Pending',
    appliedDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchApplications();
  }, [studentId]);

  useEffect(() => {
    if (!isAdmin && studentId) {
      fetchScholarships();
    }
  }, [isAdmin, studentId, applications]); // Re-sync applied set when applications list changes

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/university-applications/student/${studentId}`);
      setApplications(data);
      
      // Update the applied set
      const appliedSet = new Set(data.map(app => `${app.universityName.trim()}||${app.programName.trim()}`));
      setAppliedScholarships(appliedSet);
    } catch (err) {
      console.error('Failed to fetch university applications');
    } finally {
      setLoading(false);
    }
  };

  const fetchScholarships = async (currentFilters = filters) => {
    try {
      setScholarshipsLoading(true);
      
      const params = new URLSearchParams();
      if (currentFilters.title) params.append('title', currentFilters.title);
      if (currentFilters.country) params.append('country', currentFilters.country);
      if (currentFilters.studyArea) params.append('studyArea', currentFilters.studyArea);
      if (currentFilters.degreeLevels && currentFilters.degreeLevels !== 'all') {
        params.append('degreeLevels', currentFilters.degreeLevels);
      }

      const { data } = await axios.get(`/api/scholarships?${params.toString()}`);
      setScholarships(data);
    } catch (err) {
      console.error('Error fetching scholarships:', err);
    } finally {
      setScholarshipsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchScholarships(filters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      title: '',
      country: '',
      degreeLevels: 'all',
      studyArea: ''
    };
    setFilters(defaultFilters);
    fetchScholarships(defaultFilters);
  };

  const handleApplyToScholarship = async (scholarship) => {
    if (!window.confirm(`Are you sure you want to apply to: ${scholarship.title}?`)) {
      return;
    }

    try {
      const payload = {
        student: studentId,
        universityName: scholarship.university,
        programName: scholarship.title,
        status: 'Pending',
        appliedDate: new Date(),
        notes: `Applied online through Browse Scholarships panel. Study Area: ${scholarship.studyArea}.`
      };

      await axios.post('/api/university-applications', payload);
      alert('Application submitted successfully! It is now listed under "My Applications" tab for review.');
      
      // Refresh the applications list (this also recalculates appliedScholarships locally)
      await fetchApplications();
      
      // Automatically switch to the applications tab to show the status
      setActiveTab('my-applications');
    } catch (err) {
      alert('Failed to submit application. Try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await axios.put(`/api/university-applications/${formData._id}`, formData);
      }
      setIsAdding(false);
      setFormData({
        universityName: '',
        programName: '',
        status: 'Pending',
        appliedDate: '',
        notes: ''
      });
      fetchApplications();
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleEdit = (app) => {
    setFormData({
      ...app,
      appliedDate: app.appliedDate ? app.appliedDate.split('T')[0] : ''
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await axios.delete(`/api/university-applications/${id}`);
        fetchApplications();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading && applications.length === 0) return <div>Loading applications...</div>;

  return (
    <div className="university-applications-manager mt-30">
      <div className="flex justify-between items-center mb-20">
        <h2 className="flex items-center gap-10" style={{ margin: 0 }}>
          <Globe size={24} color="var(--primary-red)" />
          University & Scholarship Portal
        </h2>
      </div>

      {/* Tabs Layout for Students */}
      {!isAdmin && (
        <div className="tabs-container flex gap-15 mb-25" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '1px' }}>
          <button
            onClick={() => setActiveTab('my-applications')}
            className={`tab-btn ${activeTab === 'my-applications' ? 'active' : ''}`}
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 700,
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'my-applications' ? '3px solid var(--primary-red)' : '3px solid transparent',
              color: activeTab === 'my-applications' ? 'var(--primary-red)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              outline: 'none'
            }}
          >
            My Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('scholarships')}
            className={`tab-btn ${activeTab === 'scholarships' ? 'active' : ''}`}
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 700,
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'scholarships' ? '3px solid var(--primary-red)' : '3px solid transparent',
              color: activeTab === 'scholarships' ? 'var(--primary-red)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              outline: 'none'
            }}
          >
            Browse Scholarships
          </button>
        </div>
      )}

      {/* Edit Mode Card (Admin Only) */}
      {isAdding && isAdmin && (
        <div className="card mb-30 shadow-md" style={{ borderLeft: '4px solid var(--primary-red)' }}>
          <div className="flex justify-between items-center mb-20">
            <h3>Edit Application</h3>
            <button onClick={() => setIsAdding(false)} className="btn-light p-5 rounded-full"><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label>University/Scholarship Name *</label>
                <input
                  type="text"
                  name="universityName"
                  value={formData.universityName}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Program Name</label>
                <input
                  type="text"
                  name="programName"
                  value={formData.programName}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="form-control">
                  <option value="Pending">Pending</option>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
              </div>
              <div className="form-group">
                <label>Applied Date</label>
                <input
                  type="date"
                  name="appliedDate"
                  value={formData.appliedDate}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="form-group mt-15">
              <label>Internal Notes (Admin Only)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="form-control"
                rows="3"
              ></textarea>
            </div>
            <div className="flex gap-10 mt-20">
              <button type="submit" className="btn btn-primary">Update Application</button>
              <button type="button" onClick={() => setIsAdding(false)} className="btn-light">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Contents */}
      {(isAdmin || activeTab === 'my-applications') ? (
        // APPLICATIONS TAB or ADMIN VIEW
        <div className="applications-list flex flex-col gap-15">
          {applications.length === 0 ? (
            <div className="card text-center p-40" style={{ color: '#999', borderStyle: 'dashed' }}>
              No applications submitted yet. Click "Browse Scholarships" tab to find one and apply!
            </div>
          ) : (
            applications.map((app) => (
              <div key={app._id} className={`card shadow-sm transition-all ${expandedId === app._id ? 'border-primary' : ''}`} style={{ padding: '0', overflow: 'hidden', marginBottom: '15px' }}>
                <div
                  className="flex justify-between items-center p-20 cursor-pointer hover-bg-light"
                  onClick={() => toggleExpand(app._id)}
                >
                  <div className="flex gap-15 items-center">
                    <div style={{
                      width: '45px', height: '45px', borderRadius: '10px',
                      backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--primary-red)'
                    }}>
                      <Globe size={22} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{app.universityName}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{app.programName || 'Program not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-20">
                    <span style={{
                      padding: '5px 12px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 600,
                      backgroundColor: app.status === 'Accepted' ? '#dcfce7' : app.status === 'Rejected' ? '#fee2e2' : '#eff6ff',
                      color: app.status === 'Accepted' ? '#166534' : app.status === 'Rejected' ? '#991b1b' : '#1e40af'
                    }}>
                      {app.status}
                    </span>
                    <div className="flex gap-10" onClick={(e) => e.stopPropagation()}>
                      {isAdmin && (
                        <>
                          <button onClick={() => handleEdit(app)} className="btn-light p-5 rounded hover-text-blue"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(app._id)} className="btn-light p-5 rounded hover-text-red"><Trash2 size={16} /></button>
                        </>
                      )}
                      {expandedId === app._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                {expandedId === app._id && (
                  <div className="p-20 pt-0" style={{ borderTop: '1px solid #f3f4f6' }}>
                    <div className="mt-20 p-15 bg-light rounded-8">
                      <h5 className="mb-10 flex items-center gap-5"><Calendar size={14} /> Application Details</h5>
                      <div className="flex flex-col gap-8 text-sm">
                        <div><strong>Applied Date:</strong> {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'N/A'}</div>
                        <div><strong>Status:</strong> {app.status}</div>
                        {app.notes && (
                          <div className="mt-10 pt-10" style={{ borderTop: '1px solid #ddd' }}>
                            <strong>Notes:</strong>
                            <p style={{ margin: '5px 0 0 0', fontStyle: 'italic' }}>{app.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-20">
                      <h5 className="mb-10 flex items-center gap-5"><MessageCircle size={14} /> Chat & Specific Remarks</h5>
                      <RemarksSection
                        universityApplicationId={app._id}
                        currentUser={currentUser}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        // SCHOLARSHIPS EXPLORER TAB (Student only)
        <div className="scholarships-tab-panel">
          {/* Interactive Filters Panel */}
          <form onSubmit={applyFilters} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '25px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <input
                name="title"
                value={filters.title}
                onChange={handleFilterChange}
                placeholder="Scholarship Title (e.g. Gates)"
                style={{ width: '100%', height: '38px', fontSize: '0.85rem' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <input
                name="country"
                value={filters.country}
                onChange={handleFilterChange}
                placeholder="Country (e.g. USA, UK)"
                style={{ width: '100%', height: '38px', fontSize: '0.85rem' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <select
                name="degreeLevels"
                value={filters.degreeLevels}
                onChange={handleFilterChange}
                style={{ width: '100%', height: '38px', fontSize: '0.85rem', padding: '0 8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'white' }}
              >
                <option value="all">Degree Level (All)</option>
                <option value="PhD">PhD</option>
                <option value="Postdoctoral">Postdoctoral</option>
                <option value="Masters">Masters</option>
              </select>
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <input
                name="studyArea"
                value={filters.studyArea}
                onChange={handleFilterChange}
                placeholder="Study Area (e.g. Physics)"
                style={{ width: '100%', height: '38px', fontSize: '0.85rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '0 20px', height: '38px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Search size={14} /> Search
              </button>
              <button type="button" onClick={resetFilters} className="btn-light" style={{ padding: '0 15px', height: '38px', fontSize: '0.85rem', border: '1px solid #ddd' }}>
                Reset
              </button>
            </div>
          </form>

          {/* Scholarship List Grid */}
          {scholarshipsLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Fetching matched scholarships...</div>
          ) : scholarships.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#999', border: '1px dashed #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
              No active scholarships matched your search criteria.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {scholarships.map(scholarship => {
                const alreadyApplied = appliedScholarships.has(`${scholarship.university.trim()}||${scholarship.title.trim()}`);
                return (
                  <div
                    key={scholarship._id}
                    className="scholarship-card-premium"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid #e5e7eb',
                      padding: '20px',
                      borderRadius: '12px',
                      backgroundColor: 'white',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      cursor: 'default'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                      {scholarship.thumbnail ? (
                        <img src={scholarship.thumbnail} alt={scholarship.title} style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '64px', height: '64px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-red)' }}>
                          <Award size={28} />
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#111827', lineHeight: '1.3' }}>{scholarship.title}</h4>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#4b5563', fontWeight: 500 }}>{scholarship.university} ({scholarship.country})</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '15px' }}>
                      <span style={{ fontSize: '0.75rem', padding: '4px 8px', backgroundColor: '#eff6ff', color: '#1e40af', borderRadius: '4px', fontWeight: 600 }}>{scholarship.studyArea}</span>
                      <span style={{ fontSize: '0.75rem', padding: '4px 8px', backgroundColor: '#ecfdf5', color: '#065f46', borderRadius: '4px', fontWeight: 600 }}>{scholarship.fundedBy} Funded</span>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #f3f4f6', paddingTop: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 500 }}>Deadline</span>
                          <span style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: 600 }}>{new Date(scholarship.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setSelectedDetailScholarship(scholarship)}
                          className="btn-light"
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            fontSize: '0.8rem',
                            height: '34px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            backgroundColor: '#fff',
                            color: '#374151',
                            textAlign: 'center'
                          }}
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleApplyToScholarship(scholarship)}
                          disabled={alreadyApplied}
                          className={alreadyApplied ? 'btn-light' : 'btn btn-primary'}
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            fontSize: '0.8rem',
                            height: '34px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            backgroundColor: alreadyApplied ? '#f3f4f6' : 'var(--primary-red)',
                            color: alreadyApplied ? '#9ca3af' : 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 700,
                            cursor: alreadyApplied ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {alreadyApplied ? (
                            <>Applied <Check size={14} /></>
                          ) : (
                            <>Apply Now <ArrowRight size={14} /></>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectedDetailScholarship && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          padding: '20px'
        }} onClick={() => setSelectedDetailScholarship(null)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            position: 'relative',
          }} onClick={(e) => e.stopPropagation()}>
            
            <div style={{
              padding: '20px 25px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              zIndex: 10
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--secondary-dark)' }}>
                  {selectedDetailScholarship.title}
                </h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {selectedDetailScholarship.university} • <strong>{selectedDetailScholarship.country}</strong>
                </p>
              </div>
              <button 
                onClick={() => setSelectedDetailScholarship(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  padding: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '25px' }}>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '15px',
                marginBottom: '25px',
                padding: '15px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #f3f4f6'
              }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Funding</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e40af' }}>{selectedDetailScholarship.fundedBy} Funded</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Study Area</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#065f46' }}>{selectedDetailScholarship.studyArea}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Levels</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
                    {Array.isArray(selectedDetailScholarship.degreeLevels) ? selectedDetailScholarship.degreeLevels.join(', ') : selectedDetailScholarship.degreeLevels}
                  </span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Deadline</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#dc2626' }}>
                    {new Date(selectedDetailScholarship.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary-dark)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} color="var(--primary-red)" /> Description
                </h4>
                <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: '1.6', whiteSpace: 'pre-line', margin: 0 }}>
                  {selectedDetailScholarship.description}
                </p>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary-dark)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} color="var(--primary-red)" /> Eligibility Criteria
                </h4>
                <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: '1.6', whiteSpace: 'pre-line', margin: 0 }}>
                  {selectedDetailScholarship.eligibilityCriteria}
                </p>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary-dark)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} color="var(--primary-red)" /> Benefits
                </h4>
                <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: '1.6', whiteSpace: 'pre-line', margin: 0 }}>
                  {selectedDetailScholarship.benefits}
                </p>
              </div>

            </div>

            <div style={{
              padding: '15px 25px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              position: 'sticky',
              bottom: 0,
              backgroundColor: 'white',
              zIndex: 10
            }}>
              <button 
                onClick={() => setSelectedDetailScholarship(null)}
                className="btn-light"
                style={{ padding: '8px 20px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}
              >
                Close
              </button>
              <button 
                onClick={() => {
                  handleApplyToScholarship(selectedDetailScholarship);
                  setSelectedDetailScholarship(null);
                }}
                disabled={appliedScholarships.has(`${selectedDetailScholarship.university.trim()}||${selectedDetailScholarship.title.trim()}`)}
                className={appliedScholarships.has(`${selectedDetailScholarship.university.trim()}||${selectedDetailScholarship.title.trim()}`) ? 'btn-light' : 'btn btn-primary'}
                style={{
                  padding: '8px 25px',
                  borderRadius: '6px',
                  cursor: appliedScholarships.has(`${selectedDetailScholarship.university.trim()}||${selectedDetailScholarship.title.trim()}`) ? 'not-allowed' : 'pointer'
                }}
              >
                {appliedScholarships.has(`${selectedDetailScholarship.university.trim()}||${selectedDetailScholarship.title.trim()}`) ? 'Applied' : 'Apply Now'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityApplicationsManager;
