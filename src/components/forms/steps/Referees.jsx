import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const Referees = ({ data = [], updateData }) => {
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedList = [...data];
    updatedList[index] = { ...updatedList[index], [name]: value };
    updateData('referees', updatedList);
  };

  const addReferee = () => {
    if (data.length >= 3) return; // Limit to 3 referees
    updateData('referees', [...data, { name: '', designation: '', institution: '', email: '', phone: '', relation: '' }]);
  };

  const removeReferee = (index) => {
    const updatedList = data.filter((_, i) => i !== index);
    updateData('referees', updatedList);
  };

  const isInvalid = (val) => !val || val.trim() === '';
  const isEmailInvalid = (val) => !val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  return (
    <div className="section-form">
      <p className="mb-20" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Please provide details for at least <strong>two (2)</strong> academic or professional referees. (Max 3)
      </p>
      {data.map((item, index) => (
        <div key={index} className="card mb-20" style={{ backgroundColor: '#f9fafb', border: '1px solid #eee' }}>
          <div className="flex justify-between items-center mb-15">
            <h4 style={{ fontSize: '1rem', color: 'var(--primary-red)' }}>Referee #{index + 1}</h4>
            <button onClick={() => removeReferee(index)} style={{ color: 'var(--danger)', background: 'none', border: 'none' }}>
              < Trash2 size={18} />
            </button>
          </div>
          <div className="grid gap-20" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="block mb-10 font-600">Full Name <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                name="name"
                value={item.name}
                onChange={(e) => handleChange(index, e)}
                placeholder="Enter referee name"
                style={{ borderColor: isInvalid(item.name) ? 'var(--primary-red)' : '' }}
              />
            </div>
            <div className="form-group">
              <label className="block mb-10 font-600">Designation <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                name="designation"
                value={item.designation}
                onChange={(e) => handleChange(index, e)}
                placeholder="e.g. Professor, Manager"
                style={{ borderColor: isInvalid(item.designation) ? 'var(--primary-red)' : '' }}
              />
            </div>
            <div className="form-group">
              <label className="block mb-10 font-600">Institution / Organization <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                name="institution"
                value={item.institution}
                onChange={(e) => handleChange(index, e)}
                placeholder="University or company"
                style={{ borderColor: isInvalid(item.institution) ? 'var(--primary-red)' : '' }}
              />
            </div>
            <div className="form-group">
              <label className="block mb-10 font-600">Relationship <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                name="relation"
                value={item.relation}
                onChange={(e) => handleChange(index, e)}
                placeholder="e.g. Supervisor, HoD"
                style={{ borderColor: isInvalid(item.relation) ? 'var(--primary-red)' : '' }}
              />
            </div>
            <div className="form-group">
              <label className="block mb-10 font-600">Email Address <span style={{ color: 'red' }}>*</span></label>
              <input
                type="email"
                name="email"
                value={item.email}
                onChange={(e) => handleChange(index, e)}
                placeholder="Official email address"
                style={{ borderColor: isEmailInvalid(item.email) ? 'var(--primary-red)' : '' }}
              />
            </div>
            <div className="form-group">
              <label className="block mb-10 font-600">Phone Number <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                name="phone"
                value={item.phone}
                onChange={(e) => handleChange(index, e)}
                placeholder="Contact number"
                style={{ borderColor: isInvalid(item.phone) ? 'var(--primary-red)' : '' }}
              />
            </div>
          </div>
        </div>
      ))}

      {data.length < 3 && (
        <button
          onClick={addReferee}
          className="btn flex items-center gap-10"
          style={{ border: '1px dashed var(--primary-red)', color: 'var(--primary-red)', padding: '12px 25px', backgroundColor: 'transparent', margin: '0 auto', display: 'flex' }}
        >
          <Plus size={18} /> Add Referee
        </button>
      )}
    </div>
  );
};

export default Referees;
