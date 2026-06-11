import React from 'react';

const ResearchExperience = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData('researchExperience', { ...data, [name]: value });
  };

  const handleAddPublication = () => {
    const newPubs = [...(data?.publications || []), { title: '', journalType: 'International' }];
    updateData('researchExperience', { ...data, publications: newPubs });
  };

  const handlePubChange = (index, field, value) => {
    const newPubs = [...(data?.publications || [])];
    newPubs[index][field] = value;
    updateData('researchExperience', { ...data, publications: newPubs });
  };

  const handleRemovePublication = (index) => {
    const newPubs = data.publications.filter((_, i) => i !== index);
    updateData('researchExperience', { ...data, publications: newPubs });
  };

  return (
    <div className="section-form">
      <div className="form-group mb-20">
        <label className="block mb-10 font-600">Relevant Work Experience <span style={{ color: 'red' }}>*</span></label>
        <textarea
          name="workExperience"
          value={data?.workExperience || ''}
          onChange={handleChange}
          placeholder="List any professional roles relevant to your program (max 500 words)"
          rows="4"
          style={{ borderColor: !data?.workExperience ? 'var(--primary-red)' : '' }}
        />
      </div>

      <div className="form-group mb-20">
        <label className="block mb-10 font-600">Research Statement / Interest Summary (Optional)</label>
        <textarea
          name="researchStatement"
          value={data?.researchStatement || ''}
          onChange={handleChange}
          placeholder="Briefly describe your research goals (max 500 words)"
          rows="4"
        />
      </div>

      <div className="form-group">
        <div className="flex justify-between items-center mb-10">
          <label className="font-600">Previous Publications <span style={{ color: 'red' }}>*</span></label>
          <button
            type="button"
            onClick={handleAddPublication}
            className="btn"
            style={{ padding: '4px 12px', fontSize: '0.8rem', backgroundColor: '#e5e7eb' }}
          >
            + Add Publication
          </button>
        </div>

        {(!data?.publications || data.publications.length === 0) && (
          <p style={{ color: 'var(--primary-red)', fontSize: '0.85rem', marginBottom: '10px' }}>At least one publication is required.</p>
        )}

        {(data?.publications || []).map((pub, idx) => (
          <div key={idx} className="flex gap-10 mb-10 items-start">
            <input
              type="text"
              placeholder="Publication Title"
              value={pub.title || ''}
              onChange={(e) => handlePubChange(idx, 'title', e.target.value)}
              style={{ flex: 3, borderColor: !pub.title ? 'var(--primary-red)' : '' }}
            />
            <select
              value={pub.journalType || 'International'}
              onChange={(e) => handlePubChange(idx, 'journalType', e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="International">International</option>
              <option value="Local">Local</option>
            </select>
            <button
              type="button"
              onClick={() => handleRemovePublication(idx)}
              className="btn btn-danger"
              style={{ padding: '8px 12px', color: 'red' }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchExperience;
