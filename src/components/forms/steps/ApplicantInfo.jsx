import React from 'react';
import { countries } from '../../../utils/countries';

const ApplicantInfo = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Numeric only for CNIC
    if (name === 'cnic') {
      const numericValue = value.replace(/[^\d]/g, '');
      updateData('applicantInfo', { ...data, [name]: numericValue });
      return;
    }

    updateData('applicantInfo', { ...data, [name]: value });
  };

  const isInvalid = (val) => !val || val.trim() === '';
  const isNameInvalid = (val) => !val || val.trim().length < 3;

  return (
    <div className="section-form">
      <div className="grid gap-20" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="form-group">
          <label className="block mb-10 font-600">First Name <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            name="firstName"
            className={isNameInvalid(data?.firstName) ? 'input-error' : ''}
            value={data?.firstName || ''}
            onChange={handleChange}
            placeholder="Enter first name"
            style={{ borderColor: isNameInvalid(data?.firstName) ? 'var(--primary-red)' : '' }}
          />
          {isNameInvalid(data?.firstName) && data?.firstName && (
            <span style={{ color: 'var(--primary-red)', fontSize: '0.75rem' }}>Minimum 3 characters required</span>
          )}
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Last Name <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            name="lastName"
            className={isNameInvalid(data?.lastName) ? 'input-error' : ''}
            value={data?.lastName || ''}
            onChange={handleChange}
            placeholder="Enter last name"
            style={{ borderColor: isNameInvalid(data?.lastName) ? 'var(--primary-red)' : '' }}
          />
          {isNameInvalid(data?.lastName) && data?.lastName && (
            <span style={{ color: 'var(--primary-red)', fontSize: '0.75rem' }}>Minimum 3 characters required</span>
          )}
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Date of Birth <span style={{ color: 'red' }}>*</span></label>
          <input
            type="date"
            name="dob"
            value={data?.dob ? new Date(data.dob).toISOString().split('T')[0] : ''}
            onChange={handleChange}
            style={{ borderColor: !data?.dob ? 'var(--primary-red)' : '' }}
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Gender <span style={{ color: 'red' }}>*</span></label>
          <select name="gender" value={data?.gender || ''} onChange={handleChange} style={{ borderColor: !data?.gender ? 'var(--primary-red)' : '' }}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Nationality <span style={{ color: 'red' }}>*</span></label>
          <select
            name="nationality"
            value={data?.nationality || ''}
            onChange={handleChange}
            style={{ borderColor: !data?.nationality ? 'var(--primary-red)' : '' }}
          >
            <option value="">Select Nationality</option>
            {countries.map(country => <option key={country} value={country}>{country}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">CNIC / Passport Number</label>
          <input
            type="text"
            name="cnic"
            value={data?.cnic || ''}
            onChange={handleChange}
            placeholder="Enter digits only (Optional)"
          />
        </div>
      </div>
      {data?.dob && (new Date().getFullYear() - new Date(data.dob).getFullYear() > 45) && (
        <div className="alert alert-warning mt-20" style={{ backgroundColor: '#fff7ed', padding: '15px', borderRadius: '8px', border: '1px solid #fb923c', color: '#9a3412', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: 700 }}>⚠️ Note:</span> Age limit for PhD students is 45. Your profile strength will be impacted.
        </div>
      )}
    </div>
  );
};

export default ApplicantInfo;
