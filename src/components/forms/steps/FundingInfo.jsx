import React from 'react';

const FundingInfo = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData('fundingInfo', { ...data, [name]: value });
  };

  return (
    <div className="section-form">
      <div className="form-group mb-20">
        <label className="block mb-10 font-600">Proposed Funding Source <span style={{ color: 'red' }}>*</span></label>
        <select name="fundingType" value={data?.fundingType || ''} onChange={handleChange} style={{ borderColor: !data?.fundingType ? 'var(--primary-red)' : '' }}>
          <option value="">Select Funding Source</option>
          <option value="Self-funded">Self-funded</option>
          <option value="Scholarship">Scholarship</option>
          <option value="Employer-funded">Employer-funded</option>
          <option value="Institutional Fellowship">Institutional Fellowship</option>
          <option value="Grant">Research Grant</option>
        </select>
      </div>
      <div className="form-group">
        <label className="block mb-10 font-600">Funding Details / Scholarship Name (if any) <span style={{ color: 'red' }}>*</span></label>
        <textarea
          name="details"
          value={data?.details || ''}
          onChange={handleChange}
          placeholder="Enter additional details about your funding arrangement"
          rows="4"
          style={{ borderColor: !data?.details ? 'var(--primary-red)' : '' }}
        />
      </div>
    </div>
  );
};

export default FundingInfo;
