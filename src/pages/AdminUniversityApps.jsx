import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import {
  Search, Globe, Plus,
  ChevronDown, ChevronUp, Edit2,
  Trash2, MessageCircle, User, Eye,
  Award, Calendar, Check, ArrowRight
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import RemarksSection from '../components/RemarksSection';
import { useAuth } from '../contexts/AuthContext';

const AdminUniversityApps = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [universityApps, setUniversityApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // Tab state for the selected student
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' or 'scholarships'

  // Scholarship and filtering states
  const [scholarships, setScholarships] = useState([]);
  const [scholarshipsLoading, setScholarshipsLoading] = useState(true);
  const [appliedScholarships, setAppliedScholarships] = useState(new Set());
  const [filters, setFilters] = useState({
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
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get('/api/applications');
      // Filter students who have submitted their profile
      const submittedStudents = data.filter(app => app.user != null);
      setStudents(submittedStudents);
    } catch (err) {
      console.error('Error fetching students');
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversityApps = async (studentId) => {
    try {
      const { data } = await axios.get(`/api/university-applications/student/${studentId}`);
      setUniversityApps(data);

      // Build applied set for duplicate checks
      const appliedSet = new Set(data.map(app => `${app.universityName.trim()}||${app.programName.trim()}`));
      setAppliedScholarships(appliedSet);
    } catch (err) {
      console.error('Error fetching university apps');
    }
  };

  const fetchScholarships = async (currentFilters = filters) => {
    try {
      setScholarshipsLoading(true);
      const params = new URLSearchParams();
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

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    fetchUniversityApps(student.user._id);
    fetchScholarships(); // Prefetch scholarships for Potential application
    setActiveTab('applications'); // Always default back to active apps on student switch
    setIsAdding(false);
    setExpandedId(null);
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
      country: '',
      degreeLevels: 'all',
      studyArea: ''
    };
    setFilters(defaultFilters);
    fetchScholarships(defaultFilters);
  };

  const handleApplyToScholarship = async (scholarship) => {
    if (!selectedStudent) return;
    const studentName = `${selectedStudent.applicantInfo?.firstName || ''} ${selectedStudent.applicantInfo?.lastName || ''}`.trim() || selectedStudent.user.email;

    if (!window.confirm(`Are you sure you want to apply to: ${scholarship.title} on behalf of student: ${studentName}?`)) {
      return;
    }

    try {
      const payload = {
        student: selectedStudent.user._id,
        universityName: scholarship.university,
        programName: scholarship.title,
        status: 'Pending',
        appliedDate: new Date(),
        notes: `Applied on behalf of student by Administrator (${currentUser.email}). Study Area: ${scholarship.studyArea}.`
      };

      await axios.post('/api/university-applications', payload);
      alert(`Application submitted successfully on behalf of ${studentName}!`);

      // Refresh applications and reload applied states
      await fetchUniversityApps(selectedStudent.user._id);

      // Auto switch back to student applications tab to track/manage it
      setActiveTab('applications');
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
      setFormData({ universityName: '', programName: '', status: 'Pending', appliedDate: '', notes: '' });
      fetchUniversityApps(selectedStudent.user._id);
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
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await axios.delete(`/api/university-applications/${id}`);
        fetchUniversityApps(selectedStudent.user._id);
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const filteredStudents = students.filter(s =>
    s.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.applicantInfo?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.applicantInfo?.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="admin-university-apps flex gap-20">
        {/* Left Panel: Students List */}
        <div className="students-sidebar card" style={{ width: '300px', padding: '0', height: 'fit-content' }}>
          <div className="p-15 border-bottom">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Select Student</h3>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '35px', fontSize: '0.85rem' }}
              />
            </div>
          </div>
          <div className="students-list" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {filteredStudents.map(student => (
              <div
                key={student._id}
                onClick={() => handleStudentSelect(student)}
                style={{
                  padding: '12px 20px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f3f4f6',
                  backgroundColor: selectedStudent?._id === student._id ? '#eff6ff' : 'transparent',
                  borderLeft: selectedStudent?._id === student._id ? '4px solid var(--primary-red)' : '4px solid transparent'
                }}
                className="hover-bg-light"
              >
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{student.applicantInfo?.firstName} {student.applicantInfo?.lastName}</div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>{student.user?.email}</div>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', marginTop: '4px', color: '#4b5563' }}>
                  <span>Progress: <strong style={{ color: 'var(--primary-red)' }}>{student.completionPercentage}%</strong></span>
                  <span>•</span>
                  <span>Strength: <strong style={{ color: '#10b981' }}>{student.profileStrength}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Applications Workspace */}
        <div className="main-management flex-1">
          {selectedStudent ? (
            <div className="student-apps-content">
              {/* Header Info */}
              <div className="flex justify-between items-center mb-15 bg-white p-15 rounded-8 shadow-sm">
                <div>
                  <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Applications for {selectedStudent.applicantInfo?.firstName} {selectedStudent.applicantInfo?.lastName}</h2>
                  <p style={{ margin: '2px 0 8px 0', color: '#666', fontSize: '0.85rem' }}>{selectedStudent.user?.email}</p>
                  <button
                    onClick={() => navigate(`/admin/applications/${selectedStudent._id}`)}
                    className="btn btn-light flex items-center gap-5"
                    style={{ fontSize: '0.8rem', padding: '6px 12px', border: '1px solid #ddd', backgroundColor: '#f9fafb', color: '#374151' }}
                  >
                    <Eye size={14} color="var(--primary-red)" /> View Profile Completion Detail ({selectedStudent.completionPercentage}% Done)
                  </button>
                </div>
              </div>

              {/* Tabs Menu */}
              <div className="tabs-container flex gap-15 mb-20" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '1px' }}>
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
                  style={{
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === 'applications' ? '3px solid var(--primary-red)' : '3px solid transparent',
                    color: activeTab === 'applications' ? 'var(--primary-red)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    outline: 'none'
                  }}
                >
                  Student's Applications ({universityApps.length})
                </button>
                <button
                  onClick={() => setActiveTab('scholarships')}
                  className={`tab-btn ${activeTab === 'scholarships' ? 'active' : ''}`}
                  style={{
                    padding: '10px 20px',
                    fontSize: '0.9rem',
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
                  Apply for Scholarship
                </button>
              </div>

              {/* Conditionally Render Active Tab Contents */}
              {activeTab === 'applications' ? (
                <div className="applications-tab-content">
                  {/* Edit Form Card */}
                  {isAdding && (
                    <div className="card mb-30 shadow-md" style={{ borderLeft: '4px solid var(--primary-red)' }}>
                      <h3 className="mb-20">Edit Application</h3>
                      <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-20">
                          <div className="form-group">
                            <label>University/Scholarship Name *</label>
                            <input name="universityName" value={formData.universityName} onChange={handleInputChange} required />
                          </div>
                          <div className="form-group">
                            <label>Program Name</label>
                            <input name="programName" value={formData.programName} onChange={handleInputChange} />
                          </div>
                          <div className="form-group">
                            <label>Status</label>
                            <select name="status" value={formData.status} onChange={handleInputChange}>
                              <option value="Pending">Pending</option>
                              <option value="Applied">Applied</option>
                              <option value="Interview">Interview</option>
                              <option value="Accepted">Accepted</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Applied Date</label>
                            <input type="date" name="appliedDate" value={formData.appliedDate} onChange={handleInputChange} />
                          </div>
                        </div>
                        <div className="form-group mt-15">
                          <label>Internal Admin Notes</label>
                          <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="3"></textarea>
                        </div>
                        <div className="flex gap-10 mt-20">
                          <button type="submit" className="btn btn-primary">Update Application</button>
                          <button type="button" onClick={() => setIsAdding(false)} className="btn-light">Cancel</button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Applications List */}
                  <div className="apps-list flex flex-col gap-15">
                    {universityApps.length === 0 ? (
                      <div className="card text-center p-40" style={{ color: '#999', borderStyle: 'dashed' }}>
                        No applications created yet for this student. Go to "Apply for Scholarship" tab to submit one.
                      </div>
                    ) : (
                      universityApps.map(app => (
                        <div key={app._id} className="overflow-hidden bg-white rounded-8 mb-10 transition-all" style={{ border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                          <div
                            className="p-15 flex justify-between items-center cursor-pointer hover-bg-light"
                            onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                          >
                            <div className="flex items-center gap-12">
                              <Globe size={18} style={{ marginRight: '10px' }} color="var(--primary-red)" />
                              <div>
                                <h4 style={{ margin: 0, fontSize: '1rem' }}>{app.universityName}</h4>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>{app.programName}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-12">
                              <span style={{
                                padding: '3px 10px', borderRadius: '15px', fontSize: '0.7rem', fontWeight: 700,
                                backgroundColor: app.status === 'Accepted' ? '#dcfce7' : app.status === 'Rejected' ? '#fee2e2' : '#eff6ff',
                                color: app.status === 'Accepted' ? '#166534' : app.status === 'Rejected' ? '#991b1b' : '#1e40af'
                              }}>{app.status}</span>
                              <button onClick={(e) => { e.stopPropagation(); handleEdit(app); }} className="btn-light p-5 rounded hover-text-blue"><Edit2 size={14} /></button>
                              <button onClick={(e) => { e.stopPropagation(); handleDelete(app._id); }} className="btn-light p-5 rounded hover-text-red"><Trash2 size={14} /></button>
                              {expandedId === app._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                          </div>

                          {expandedId === app._id && (
                            <div className="p-20 pt-0 border-top">
                              <div className="mt-15 p-15 bg-light rounded-8 mb-20">
                                <div className="text-sm"><strong>Date:</strong> {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'N/A'}</div>
                                <div className="text-sm mt-5"><strong>Notes:</strong> {app.notes || 'None'}</div>
                              </div>
                              <RemarksSection
                                universityApplicationId={app._id}
                                currentUser={currentUser}
                                title={`Chat about ${app.universityName}`}
                              />
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="scholarships-tab-content">
                  {/* Interactive Filters Panel */}
                  <form onSubmit={applyFilters} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <input
                      name="country"
                      value={filters.country}
                      onChange={handleFilterChange}
                      placeholder="Country (e.g. USA)"
                      style={{ flex: 1, minWidth: '100px', height: '36px', fontSize: '0.85rem' }}
                    />
                    <select
                      name="degreeLevels"
                      value={filters.degreeLevels}
                      onChange={handleFilterChange}
                      style={{ flex: 1, minWidth: '100px', height: '36px', fontSize: '0.85rem', padding: '0 8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'white' }}
                    >
                      <option value="all">Degree Level (All)</option>
                      <option value="PhD">PhD</option>
                      <option value="Postdoctoral">Postdoctoral</option>
                      <option value="Masters">Masters</option>
                    </select>
                    <input
                      name="studyArea"
                      value={filters.studyArea}
                      onChange={handleFilterChange}
                      placeholder="Study Area"
                      style={{ flex: 1, minWidth: '100px', height: '36px', fontSize: '0.85rem' }}
                    />
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0 15px', height: '36px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Search size={14} /> Search
                      </button>
                      <button type="button" onClick={resetFilters} className="btn-light" style={{ padding: '0 15px', height: '36px', fontSize: '0.85rem', border: '1px solid #ddd' }}>
                        Reset
                      </button>
                    </div>
                  </form>

                  {/* Scholarships List Grid */}
                  {scholarshipsLoading ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Fetching active scholarships...</div>
                  ) : scholarships.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#999', border: '1px dashed #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
                      No active scholarships matched the search criteria.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                      {scholarships.map(scholarship => {
                        const alreadyApplied = appliedScholarships.has(`${scholarship.university.trim()}||${scholarship.title.trim()}`);
                        return (
                          <div
                            key={scholarship._id}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              border: '1px solid #e5e7eb',
                              padding: '15px',
                              borderRadius: '8px',
                              backgroundColor: 'white',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                            }}
                          >
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                              {scholarship.thumbnail ? (
                                <img src={scholarship.thumbnail} alt={scholarship.title} style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: '50px', height: '50px', borderRadius: '6px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-red)' }}>
                                  <Award size={22} />
                                </div>
                              )}
                              <div style={{ flex: 1 }}>
                                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#111827', lineHeight: '1.2' }}>{scholarship.title}</h4>
                                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#4b5563' }}>{scholarship.university} ({scholarship.country})</p>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '12px' }}>
                              <span style={{ fontSize: '0.7rem', padding: '2px 6px', backgroundColor: '#eff6ff', color: '#1e40af', borderRadius: '3px', fontWeight: 600 }}>{scholarship.studyArea}</span>
                              <span style={{ fontSize: '0.7rem', padding: '2px 6px', backgroundColor: '#ecfdf5', color: '#065f46', borderRadius: '3px', fontWeight: 600 }}>{scholarship.fundedBy} Funded</span>
                            </div>

                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '10px' }}>
                              <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                              <button
                                onClick={() => handleApplyToScholarship(scholarship)}
                                disabled={alreadyApplied}
                                style={{
                                  padding: '5px 12px',
                                  fontSize: '0.75rem',
                                  height: '28px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  backgroundColor: alreadyApplied ? '#f3f4f6' : 'var(--primary-red)',
                                  color: alreadyApplied ? '#9ca3af' : 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontWeight: 700,
                                  cursor: alreadyApplied ? 'not-allowed' : 'pointer'
                                }}
                              >
                                {alreadyApplied ? (
                                  <>Applied <Check size={12} /></>
                                ) : (
                                  <>Apply <ArrowRight size={12} /></>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-100 card" style={{ height: '400px', color: '#999' }}>
              <User size={48} className="mb-20" opacity={0.2} />
              <h3>Select a student from the left to manage their applications</h3>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUniversityApps;
