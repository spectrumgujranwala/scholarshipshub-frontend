import React from 'react';

const Declaration = ({ data = {}, updateData, canSubmit, incompleteSections = [], onSubmit }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateData('declaration', { ...data, [name]: type === 'checkbox' ? checked : value });
  };

  const isInvalid = (val) => !val || val.trim() === '';

  return (
    <div className="section-form">
      <div className="card mb-20" style={{ padding: '30px', backgroundColor: '#f9fafb', border: `1px solid ${(!data?.isAgreed || isInvalid(data?.signature)) ? 'var(--primary-red)' : '#eee'}` }}>
        <h3 style={{ marginBottom: '15px' }}>Declaration</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.8' }}>
          I hereby declare that the information provided in this application is true and correct to the best of my knowledge and belief.
          In case any information is found to be false or untrue or misleading or misrepresenting, I am aware that I may be held
          liable for it and my application/admission may be cancelled. I also understand that the decision of the admissions
          committee at Spectrum Consultants and its partner universities is final.
        </p>

        <div className="form-group flex items-center gap-10 mb-20">
          <input
            type="checkbox"
            name="isAgreed"
            id="isAgreed"
            checked={data?.isAgreed || false}
            onChange={handleChange}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <label htmlFor="isAgreed" style={{ fontWeight: 600, cursor: 'pointer', color: !data?.isAgreed ? 'var(--primary-red)' : 'inherit' }}>
            I agree to the terms and declaration above. <span style={{ color: 'red' }}>*</span>
          </label>
        </div>

        <div className="form-group">
          <label className="block mb-10 font-600">Full Signature (Type your name) <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            name="signature"
            value={data?.signature || ''}
            onChange={handleChange}
            placeholder="Type your full name as signature"
            style={{
              borderColor: isInvalid(data?.signature) ? 'var(--primary-red)' : '',
              fontFamily: data?.signature ? 'cursive' : 'inherit',
              fontSize: data?.signature ? '1.2rem' : '1rem'
            }}
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        {(!data?.isAgreed || isInvalid(data?.signature) || !canSubmit) && (
          <div className="alert alert-danger mb-20" style={{
            backgroundColor: '#fef2f2', border: '1px solid #fee2e2',
            padding: '20px', borderRadius: '8px', textAlign: 'left'
          }}>
            <h4 style={{ color: '#dc2626', marginBottom: '10px', fontSize: '1rem' }}>⚠️ Application Incomplete</h4>
            <ul style={{ color: '#991b1b', fontSize: '0.85rem', paddingLeft: '20px' }}>
              {!canSubmit && incompleteSections.length > 0 && (
                <li>The following sections are missing mandatory information:
                  <ul style={{ fontWeight: 600, marginTop: '5px' }}>
                    {incompleteSections.map(s => <li key={s}>{s}</li>)}
                  </ul>
                </li>
              )}
              {(!data?.isAgreed || isInvalid(data?.signature)) && (
                <li style={{ marginTop: '5px' }}>Please check the declaration box and provide your full signature.</li>
              )}
            </ul>
          </div>
        )}

        <button
          onClick={onSubmit}
          disabled={!data?.isAgreed || isInvalid(data?.signature) || !canSubmit}
          className="btn btn-primary"
          style={{
            padding: '15px 60px', fontSize: '1.1rem',
            opacity: (!data?.isAgreed || isInvalid(data?.signature) || !canSubmit) ? 0.5 : 1,
            cursor: (!data?.isAgreed || isInvalid(data?.signature) || !canSubmit) ? 'not-allowed' : 'pointer'
          }}
        >
          Submit Final Application
        </button>
      </div>
    </div>
  );
};

export default Declaration;
