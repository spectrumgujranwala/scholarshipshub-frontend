import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import {
  Search, Award, Plus,
  ChevronDown, ChevronUp, Edit2,
  Trash2, Filter
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';

const AdminScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    title: '',
    country: '',
    university: '',
    fundedBy: '',
    degreeLevels: '',
    studyArea: ''
  });

  const [formData, setFormData] = useState({
    title: '',
    deadline: '',
    country: '',
    university: '',
    fundedBy: '',
    degreeLevels: '',
    benefits: '',
    eligibilityCriteria: '',
    description: '',
    studyArea: '',
    thumbnail: ''
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async (currentFilters = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.keys(currentFilters).forEach(key => {
        if (currentFilters[key]) {
          params.append(key, currentFilters[key]);
        }
      });

      const { data } = await axios.get(`/api/scholarships?${params.toString()}`);
      setScholarships(data);
    } catch (err) {
      console.error('Error fetching scholarships');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchScholarships(filters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      title: '',
      country: '',
      university: '',
      fundedBy: '',
      degreeLevels: '',
      studyArea: ''
    };
    setFilters(defaultFilters);
    fetchScholarships(defaultFilters);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size too large. Max 5MB allowed.');
      return;
    }

    setUploading(true);

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('folder', 'scholarships');

    try {
      const { data: uploadRes } = await axios.post('/api/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, thumbnail: uploadRes.url }));
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || 'Server error'));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const processedData = {
        ...formData,
        degreeLevels: formData.degreeLevels.split(',').map(item => item.trim()).filter(item => item !== '')
      };

      if (formData._id) {
        await axios.put(`/api/scholarships/${formData._id}`, processedData);
      } else {
        await axios.post('/api/scholarships', processedData);
      }
      setIsAdding(false);
      setFormData({
        title: '',
        deadline: '',
        country: '',
        university: '',
        fundedBy: '',
        degreeLevels: '',
        benefits: '',
        eligibilityCriteria: '',
        description: '',
        studyArea: '',
        thumbnail: ''
      });
      fetchScholarships();
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleEdit = (scholarship) => {
    setFormData({
      ...scholarship,
      deadline: scholarship.deadline ? scholarship.deadline.split('T')[0] : '',
      degreeLevels: scholarship.degreeLevels ? scholarship.degreeLevels.join(', ') : ''
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this scholarship?')) {
      try {
        await axios.delete(`/api/scholarships/${id}`);
        fetchScholarships();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="admin-scholarships">
        <div className="flex justify-between items-center mb-20 bg-white p-15 rounded-8 shadow-sm">
          <div>
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Scholarships Management</h2>
            <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Add and manage scholarships</p>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="btn btn-primary flex items-center gap-5"
            >
              <Plus size={18} /> Add Scholarship
            </button>
          )}
        </div>

        {isAdding && (
          <div className="card mb-30 shadow-md" style={{ borderLeft: '4px solid var(--primary-red)' }}>
            <h3 className="mb-20">{formData._id ? 'Edit Scholarship' : 'Add New Scholarship'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-20">
                <div className="form-group">
                  <label>Scholarship Title *</label>
                  <input name="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Application Deadline *</label>
                  <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Country *</label>
                  <input name="country" value={formData.country} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>University *</label>
                  <input name="university" value={formData.university} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Funded By *</label>
                  <input name="fundedBy" value={formData.fundedBy} onChange={handleInputChange} placeholder="e.g., Full, Partial" required />
                </div>
                <div className="form-group">
                  <label>Degree Levels *</label>
                  <input name="degreeLevels" value={formData.degreeLevels} onChange={handleInputChange} placeholder="e.g., PhD, Masters (comma separated)" required />
                </div>
                <div className="form-group">
                  <label>Study Area *</label>
                  <input name="studyArea" value={formData.studyArea} onChange={handleInputChange} placeholder="e.g., Computer Science, Engineering, Medical Sciences" required />
                </div>
                <div className="form-group">
                  <label>Scholarship Thumbnail / Image</label>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '5px' }}>
                    {formData.thumbnail ? (
                      <img src={formData.thumbnail} alt="Thumbnail Preview" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #ddd' }} />
                    ) : (
                      <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#888', border: '1px dashed #ccc' }}>No Image</div>
                    )}
                    <label className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', cursor: 'pointer', margin: 0 }}>
                      {uploading ? 'Uploading...' : 'Upload Image'}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group mt-15">
                <label>Scholarship Benefits *</label>
                <textarea name="benefits" value={formData.benefits} onChange={handleInputChange} rows="3" required></textarea>
              </div>

              <div className="form-group mt-15">
                <label>Eligibility Criteria *</label>
                <textarea name="eligibilityCriteria" value={formData.eligibilityCriteria} onChange={handleInputChange} rows="3" required></textarea>
              </div>

              <div className="form-group mt-15">
                <label>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" required></textarea>
              </div>

              <div className="flex gap-10 mt-20">
                <button type="submit" className="btn btn-primary">Save Scholarship</button>
                <button type="button" onClick={() => {
                  setIsAdding(false);
                  setFormData({
                    title: '',
                    deadline: '',
                    country: '',
                    university: '',
                    fundedBy: '',
                    degreeLevels: '',
                    benefits: '',
                    eligibilityCriteria: '',
                    description: '',
                    studyArea: '',
                    thumbnail: ''
                  });
                }} className="btn-light">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="card mb-20 bg-white p-10 rounded-8 shadow-sm flex items-center gap-10 flex-wrap">
          <div className="flex items-center gap-5">
            <Filter size={16} color="var(--primary-red)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Filters:</span>
          </div>
          <input name="title" value={filters.title} onChange={handleFilterChange} placeholder="Title" style={{ flex: 1, minWidth: '120px', fontSize: '0.8rem', padding: '6px 10px', height: '32px' }} />
          <input name="country" value={filters.country} onChange={handleFilterChange} placeholder="Country" style={{ flex: 1, minWidth: '100px', fontSize: '0.8rem', padding: '6px 10px', height: '32px' }} />
          <input name="university" value={filters.university} onChange={handleFilterChange} placeholder="University" style={{ flex: 1, minWidth: '120px', fontSize: '0.8rem', padding: '6px 10px', height: '32px' }} />
          <input name="fundedBy" value={filters.fundedBy} onChange={handleFilterChange} placeholder="Funded By" style={{ flex: 1, minWidth: '100px', fontSize: '0.8rem', padding: '6px 10px', height: '32px' }} />
          <input name="degreeLevels" value={filters.degreeLevels} onChange={handleFilterChange} placeholder="Degree Level" style={{ flex: 1, minWidth: '100px', fontSize: '0.8rem', padding: '6px 10px', height: '32px' }} />
          <input name="studyArea" value={filters.studyArea} onChange={handleFilterChange} placeholder="Study Area" style={{ flex: 1, minWidth: '100px', fontSize: '0.8rem', padding: '6px 10px', height: '32px' }} />
          <div className="flex gap-5">
            <button onClick={applyFilters} className="btn btn-primary btn-sm" style={{ padding: '0 12px', height: '32px', fontSize: '0.8rem' }}>Apply</button>
            <button onClick={resetFilters} className="btn-light btn-sm" style={{ padding: '0 12px', height: '32px', fontSize: '0.8rem' }}>Reset</button>
          </div>
        </div>

        <div className="apps-list flex flex-col gap-10">
          {loading ? (
            <div className="card text-center p-40">Loading scholarships...</div>
          ) : scholarships.length === 0 ? (
            <div className="card text-center p-40" style={{ color: '#999', borderStyle: 'dashed' }}>
              No scholarships found matching the criteria.
            </div>
          ) : (
            scholarships.map(scholarship => (
              <div key={scholarship._id} className="overflow-hidden bg-white rounded-8 mb-15 transition-all" style={{ border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div
                  className="p-15 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #e5e7eb'
                  }}
                  onClick={() => setExpandedId(expandedId === scholarship._id ? null : scholarship._id)}
                >
                  <div className="flex items-center gap-24">
                    {scholarship.thumbnail ? (
                      <img src={scholarship.thumbnail} alt="Scholarship Thumbnail" style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover', marginRight: '10px' }} />
                    ) : (
                      <Award size={24} style={{ marginRight: '10px' }} color="var(--primary-red)" />
                    )}
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>{scholarship.title}</h4>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', color: '#4b5563', marginTop: '4px' }}>
                        <span style={{ fontWeight: 600 }}>{scholarship.university}</span>
                        <span>•</span>
                        <span>{scholarship.country}</span>
                        <span>•</span>
                        <span style={{ color: 'var(--primary-red)', fontWeight: 600 }}>{scholarship.studyArea}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-15">
                    <span style={{
                      padding: '5px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700,
                      backgroundColor: '#eff6ff', color: '#1e40af'
                    }}>
                      {scholarship.fundedBy}
                    </span>
                    <span style={{
                      padding: '5px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700,
                      backgroundColor: '#fff7ed', color: '#c2410c'
                    }}>
                      Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                    </span>
                    <div className="flex gap-8">
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(scholarship); }} className="btn-light p-6 rounded hover:bg-gray-100" style={{ padding: '6px', backgroundColor: '#f3f4f6', color: '#4b5563', border: 'none' }}><Edit2 size={16} /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(scholarship._id); }} className="btn-light p-6 rounded hover:bg-gray-100" style={{ padding: '6px', backgroundColor: '#f3f4f6', color: '#ef4444', border: 'none' }}><Trash2 size={16} /></button>
                    </div>
                    {expandedId === scholarship._id ? <ChevronUp size={20} color="#4b5563" /> : <ChevronDown size={20} color="#4b5563" />}
                  </div>
                </div>

                {expandedId === scholarship._id && (
                  <div className="p-20 border-top bg-white">
                    <div className="grid grid-cols-3 gap-20">
                      <div className="p-15 bg-gray-50 rounded-8" style={{ border: '1px solid #e5e7eb', borderLeft: '5px solid var(--primary-red)', paddingLeft: '20px' }}>
                        <h5 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-red)', marginBottom: '8px' }}>Degree Levels</h5>
                        <div className="flex gap-5 flex-wrap">
                          {scholarship.degreeLevels.map(level => (
                            <span key={level} style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', backgroundColor: '#fff', color: '#1f2937', fontWeight: 600, border: '1px solid #e5e7eb' }}>{level}</span>
                          ))}
                        </div>
                      </div>
                      <div className="p-15 bg-gray-50 rounded-8" style={{ border: '1px solid #e5e7eb', borderLeft: '5px solid #1e40af', paddingLeft: '20px' }}>
                        <h5 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e40af', marginBottom: '8px' }}>Funding Status</h5>
                        <p style={{ fontSize: '1.05rem', margin: 0, color: '#111827', fontWeight: 600 }}>{scholarship.fundedBy}</p>
                      </div>
                      <div className="p-15 bg-gray-50 rounded-8" style={{ border: '1px solid #e5e7eb', borderLeft: '5px solid #10b981', paddingLeft: '20px' }}>
                        <h5 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981', marginBottom: '8px' }}>Study Area</h5>
                        <p style={{ fontSize: '1.05rem', margin: 0, color: '#111827', fontWeight: 600 }}>{scholarship.studyArea}</p>
                      </div>
                    </div>

                    <div className="mt-20 p-15 bg-gray-50 rounded-8" style={{ border: '1px solid #e5e7eb', borderLeft: '5px solid var(--primary-red)', paddingLeft: '20px' }}>
                      <h5 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-red)', marginBottom: '8px' }}>Scholarship Benefits</h5>
                      <p style={{ fontSize: '1.05rem', margin: 0, color: '#374151', lineHeight: '1.6' }}>{scholarship.benefits}</p>
                    </div>

                    <div className="mt-20 p-15 bg-gray-50 rounded-8" style={{ border: '1px solid #e5e7eb', borderLeft: '5px solid #1e40af', paddingLeft: '20px' }}>
                      <h5 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e40af', marginBottom: '8px' }}>Eligibility Criteria</h5>
                      <p style={{ fontSize: '1.05rem', margin: 0, color: '#374151', lineHeight: '1.6' }}>{scholarship.eligibilityCriteria}</p>
                    </div>

                    <div className="mt-20 p-15 bg-gray-50 rounded-8" style={{ border: '1px solid #e5e7eb', borderLeft: '5px solid #4b5563', paddingLeft: '20px' }}>
                      <h5 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4b5563', marginBottom: '8px' }}>Description</h5>
                      <p style={{ fontSize: '1.05rem', margin: 0, color: '#374151', lineHeight: '1.6' }}>{scholarship.description}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminScholarships;
