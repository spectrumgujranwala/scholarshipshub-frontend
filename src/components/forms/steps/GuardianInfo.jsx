import React from 'react';

const GuardianInfo = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData('guardianInfo', { ...data, [name]: value });
  };

  const isInvalid = (val) => !val || val.trim() === '';
  const isEmailInvalid = (val) => !val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isPhoneInvalid = (val) => !val || !/^\+?\d{10,15}$/.test(val.replace(/\s/g, ''));

  return (
    <div className="section-form">
      <div className="grid gap-20" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="form-group">
          <label className="block mb-10 font-600">Father's Full Name <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            name="fatherName"
            value={data?.fatherName || ''}
            onChange={handleChange}
            placeholder="Enter father's name"
            style={{ borderColor: isInvalid(data?.fatherName) ? 'var(--primary-red)' : '' }}
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Mother's Full Name <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            name="motherName"
            value={data?.motherName || ''}
            onChange={handleChange}
            placeholder="Enter mother's name"
            style={{ borderColor: isInvalid(data?.motherName) ? 'var(--primary-red)' : '' }}
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Guardian Contact Number <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            name="guardianPhone"
            value={data?.guardianPhone || ''}
            onChange={handleChange}
            placeholder="+92 300 1234567"
            style={{ borderColor: isPhoneInvalid(data?.guardianPhone) ? 'var(--primary-red)' : '' }}
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Guardian Email Address <span style={{ color: 'red' }}>*</span></label>
          <input
            type="email"
            name="guardianEmail"
            value={data?.guardianEmail || ''}
            onChange={handleChange}
            placeholder="guardian@example.com"
            style={{ borderColor: isEmailInvalid(data?.guardianEmail) ? 'var(--primary-red)' : '' }}
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Occupation <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            name="occupation"
            value={data?.occupation || ''}
            onChange={handleChange}
            placeholder="Enter guardian occupation"
            style={{ borderColor: isInvalid(data?.occupation) ? 'var(--primary-red)' : '' }}
          />
        </div>
      </div>
    </div>
  );
};

export default GuardianInfo;
