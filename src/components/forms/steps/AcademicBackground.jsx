import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const AcademicBackground = ({ data = [], updateData }) => {
  const handleChange = (index, e) => {
    const { name, value } = e.target;

    // Numeric only for year
    if (name === 'year') {
      const numericValue = value.replace(/[^\d]/g, '').slice(0, 4);
      const updatedList = [...data];
      updatedList[index] = { ...updatedList[index], [name]: numericValue };
      updateData('academicBackground', updatedList);
      return;
    }

    // Numeric and dot only for CGPA
    if (name === 'cgpa') {
      const formattedValue = value.replace(/[^\d./]/g, ''); // Allow /, dot, and digits
      const updatedList = [...data];
      updatedList[index] = { ...updatedList[index], [name]: formattedValue };
      updateData('academicBackground', updatedList);
      return;
    }

    const updatedList = [...data];
    updatedList[index] = { ...updatedList[index], [name]: value };
    updateData('academicBackground', updatedList);
  };

  const addDegree = () => {
    updateData('academicBackground', [...data, { degree: '', institution: '', field: '', year: '', cgpa: '' }]);
  };

  const removeDegree = (index) => {
    const updatedList = data.filter((_, i) => i !== index);
    updateData('academicBackground', updatedList);
  };

  const isInvalid = (val) => !val || val.trim() === '';
  const isGPAInvalid = (val) => !val || isNaN(val.split('/')[0]) || parseFloat(val.split('/')[0]) < 0;

  return (
    <div className="section-form">
      {data.length === 0 && (
        <div className="card mb-20" style={{ textAlign: 'center', padding: '40px', color: '#666', border: '1px dashed #ccc' }}>
          No academic records added yet. Please add at least one degree.
        </div>
      )}

      {data.map((item, index) => (
        <div key={index} className="card mb-20" style={{ backgroundColor: '#f9fafb', border: '1px solid #eee' }}>
          <div className="flex justify-between items-center mb-15">
            <h4 style={{ fontSize: '1rem', color: 'var(--primary-red)' }}>Degree #{index + 1}</h4>
            <button onClick={() => removeDegree(index)} style={{ color: 'var(--danger)', background: 'none', border: 'none', padding: '5px' }}>
              <Trash2 size={18} />
            </button>
          </div>
          <div className="grid gap-20" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="block mb-10 font-600">Degree Title <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                name="degree"
                value={item.degree}
                onChange={(e) => handleChange(index, e)}
                placeholder="e.g. BS Computer Science"
                style={{ borderColor: isInvalid(item.degree) ? 'var(--primary-red)' : '' }}
              />
            </div>
            <div className="form-group">
              <label className="block mb-10 font-600">Institution <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                name="institution"
                value={item.institution}
                onChange={(e) => handleChange(index, e)}
                placeholder="University name"
                style={{ borderColor: isInvalid(item.institution) ? 'var(--primary-red)' : '' }}
              />
            </div>
            <div className="form-group">
              <label className="block mb-10 font-600">Field of Study <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                name="field"
                value={item.field}
                onChange={(e) => handleChange(index, e)}
                placeholder="e.g. AI, Software Engineering"
                style={{ borderColor: isInvalid(item.field) ? 'var(--primary-red)' : '' }}
              />
            </div>
            <div className="form-group">
              <label className="block mb-10 font-600">Year of Completion <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                name="year"
                value={item.year}
                onChange={(e) => handleChange(index, e)}
                placeholder="YYYY"
                style={{ borderColor: isInvalid(item.year) ? 'var(--primary-red)' : '' }}
              />
            </div>
            <div className="form-group">
              <label className="block mb-10 font-600">CGPA / Percentage <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                name="cgpa"
                value={item.cgpa}
                onChange={(e) => handleChange(index, e)}
                placeholder="e.g. 3.8/4.0"
                style={{ borderColor: isGPAInvalid(item.cgpa) ? 'var(--primary-red)' : '' }}
              />
              <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '5px' }}>
                * Above 3.0 is acceptable; 3.5+ is recommended for scholarship.
              </p>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addDegree}
        className="btn flex items-center gap-10"
        style={{ border: '1px dashed var(--primary-red)', color: 'var(--primary-red)', padding: '12px 25px', backgroundColor: 'transparent', margin: '0 auto', display: 'flex' }}
      >
        <Plus size={18} /> Add Degree / Education Record
      </button>
    </div>
  );
};

export default AcademicBackground;
