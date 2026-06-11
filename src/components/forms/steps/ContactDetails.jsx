import React from 'react';
import { countries } from '../../../utils/countries';

const ContactDetails = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Numeric/Special only for phone
    if (name === 'phone' || name === 'alternatePhone') {
      const formattedValue = value.replace(/[^\d+]/g, '');
      updateData('contactDetails', { ...data, [name]: formattedValue });
      return;
    }

    updateData('contactDetails', { ...data, [name]: value });
  };

  const isInvalid = (val) => !val || val.trim() === '';
  const isEmailInvalid = (val) => !val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isPhoneInvalid = (val) => !val || !/^\+?\d{10,14}$/.test(val.replace(/[^\d]/g, ''));

  return (
    <div className="section-form">
      <div className="grid gap-20" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="form-group">
          <label className="block mb-10 font-600">Phone <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            name="phone"
            value={data?.phone || ''}
            onChange={handleChange}
            placeholder="+92 300 1234567"
            style={{ borderColor: isPhoneInvalid(data?.phone) ? 'var(--primary-red)' : '' }}
          />
          {isPhoneInvalid(data?.phone) && data?.phone && <span style={{ color: 'red', fontSize: '0.75rem' }}>Invalid phone format</span>}
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Alternate Phone</label>
          <input
            type="text"
            name="alternatePhone"
            value={data?.alternatePhone || ''}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Primary Email <span style={{ color: 'red' }}>*</span></label>
          <input
            type="email"
            name="email"
            value={data?.email || ''}
            onChange={handleChange}
            placeholder="name@example.com"
            style={{ borderColor: isEmailInvalid(data?.email) ? 'var(--primary-red)' : '' }}
          />
          {isEmailInvalid(data?.email) && data?.email && <span style={{ color: 'red', fontSize: '0.75rem' }}>Invalid email format</span>}
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Current Address <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            name="address"
            value={data?.address || ''}
            onChange={handleChange}
            placeholder="House #, Street, Area"
            style={{ borderColor: isInvalid(data?.address) ? 'var(--primary-red)' : '' }}
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">City <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            name="city"
            value={data?.city || ''}
            onChange={handleChange}
            placeholder="Enter city"
            style={{ borderColor: isInvalid(data?.city) ? 'var(--primary-red)' : '' }}
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Country <span style={{ color: 'red' }}>*</span></label>
          <select
            name="country"
            value={data?.country || ''}
            onChange={handleChange}
            style={{ borderColor: !data?.country ? 'var(--primary-red)' : '' }}
          >
            <option value="">Select Country</option>
            {countries.map(country => <option key={country} value={country}>{country}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
