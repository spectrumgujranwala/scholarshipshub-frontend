import React from 'react';

const EnglishProficiency = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Numeric and dot only for score
    if (name === 'score') {
      const formattedValue = value.replace(/[^\d.]/g, '');
      updateData('englishProficiency', { ...data, [name]: formattedValue });
      return;
    }

    updateData('englishProficiency', { ...data, [name]: value });
  };

  const isInvalid = (val) => !val || val.trim() === '';

  return (
    <div className="section-form">
      <div className="grid gap-20" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="form-group">
          <label className="block mb-10 font-600">English Test Type <span style={{ color: 'red' }}>*</span></label>
          <select name="testType" value={data?.testType || ''} onChange={handleChange} style={{ borderColor: !data?.testType ? 'var(--primary-red)' : '' }}>
            <option value="">Select Test Type</option>
            <option value="IELTS">IELTS</option>
            <option value="TOEFL">TOEFL</option>
            <option value="PTE">PTE</option>
            <option value="Not Yet Taken">Not Yet Taken</option>
          </select>
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Overall Score / Band <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            name="score"
            value={data?.score || ''}
            onChange={handleChange}
            placeholder="e.g. 7.5"
            style={{ borderColor: isInvalid(data?.score) ? 'var(--primary-red)' : '' }}
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Date of Test <span style={{ color: 'red' }}>*</span></label>
          <input
            type="date"
            name="dateOfTest"
            value={data?.dateOfTest ? new Date(data.dateOfTest).toISOString().split('T')[0] : ''}
            onChange={handleChange}
            style={{ borderColor: !data?.dateOfTest ? 'var(--primary-red)' : '' }}
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Date of Expiry <span style={{ color: 'red' }}>*</span></label>
          <input
            type="date"
            name="expiryDate"
            value={data?.expiryDate ? new Date(data.expiryDate).toISOString().split('T')[0] : ''}
            onChange={handleChange}
            style={{ borderColor: !data?.expiryDate ? 'var(--primary-red)' : '' }}
          />
        </div>
      </div>
    </div>
  );
};

export default EnglishProficiency;
