import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ChevronLeft, ChevronRight, Save, Check,
  User, Phone, Users, GraduationCap, BookOpen,
  FlaskConical, Languages, BadgeDollarSign, Star,
  FolderOpen, ClipboardCheck
} from 'lucide-react';
import ApplicantInfo from '../components/forms/steps/ApplicantInfo';
import ContactDetails from '../components/forms/steps/ContactDetails';
import GuardianInfo from '../components/forms/steps/GuardianInfo';
import AcademicBackground from '../components/forms/steps/AcademicBackground';
import ProgramInfo from '../components/forms/steps/ProgramInfo';
import ResearchExperience from '../components/forms/steps/ResearchExperience';
import EnglishProficiency from '../components/forms/steps/EnglishProficiency';
import FundingInfo from '../components/forms/steps/FundingInfo';
import Referees from '../components/forms/steps/Referees';
import Documents from '../components/forms/steps/Documents';
import Declaration from '../components/forms/steps/Declaration';

const ApplicationForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const steps = [
    { title: 'Applicant Info', icon: <User size={18} />, key: 'applicantInfo' },
    { title: 'Contact Details', icon: <Phone size={18} />, key: 'contactDetails' },
    { title: 'Guardian Info', icon: <Users size={18} />, key: 'guardianInfo' },
    { title: 'Academic Background', icon: <GraduationCap size={18} />, key: 'academicBackground' },
    { title: 'Program Info', icon: <BookOpen size={18} />, key: 'programInfo' },
    { title: 'Research Experience', icon: <FlaskConical size={18} />, key: 'researchExperience' },
    { title: 'English Proficiency', icon: <Languages size={18} />, key: 'englishProficiency' },
    { title: 'Funding Info', icon: <BadgeDollarSign size={18} />, key: 'fundingInfo' },
    { title: 'Referees', icon: <Star size={18} />, key: 'referees' },
    { title: 'Documents', icon: <FolderOpen size={18} />, key: 'documents' },
    { title: 'Submission', icon: <ClipboardCheck size={18} />, key: 'declaration' }
  ];

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const { data } = await axios.get('/api/applications/me');
        setFormData(data);
      } catch (err) {
        console.error('Error fetching application');
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, []);

  const isSectionComplete = (key) => {
    const section = formData[key];
    if (!section) return false;

    if (key === 'applicantInfo') {
      return !!(section.firstName && section.firstName.length >= 3 &&
        section.lastName && section.lastName.length >= 3 &&
        section.dob && section.gender && section.nationality);
    }
    if (key === 'contactDetails') {
      return !!(section.phone && section.email && section.address && section.city && section.country);
    }
    if (key === 'guardianInfo') {
      return !!(section.fatherName && section.motherName && section.guardianPhone && section.guardianEmail && section.occupation);
    }
    if (key === 'academicBackground') {
      return Array.isArray(section) && section.length > 0 && section.every(edu => edu.degree && edu.institution && edu.year && edu.cgpa);
    }
    if (key === 'programInfo') {
      return !!(section.programType && section.proposedField && section.intakeYear);
    }
    if (key === 'researchExperience') {
      const hasPublications = Array.isArray(section.publications) && section.publications.length > 0 && section.publications.every(p => p.title && p.journalType);
      return !!(section.workExperience && hasPublications);
    }
    if (key === 'englishProficiency') {
      if (section.testType === 'Not Yet Taken') return true;
      return !!(section.testType && section.score && section.dateOfTest && section.expiryDate);
    }
    if (key === 'fundingInfo') {
      return !!(section.fundingType && section.details);
    }
    if (key === 'referees') {
      return true; // Optional section
    }
    if (key === 'documents') {
      return !!(section.cv);
    }
    if (key === 'declaration') {
      return !!(section.isAgreed && section.signature);
    }

    return false;
  };

  const getIncompleteSections = () => {
    return steps
      .filter(s => s.key !== 'declaration' && !isSectionComplete(s.key))
      .map(s => s.title);
  };

  const isSectionPartial = (key) => {
    const section = formData[key];
    if (!section) return false;
    if (isSectionComplete(key)) return false;

    if (Array.isArray(section)) return section.length > 0;
    const values = Object.values(section).filter(v => v !== null && v !== '' && v !== undefined && v !== false);
    return values.length > 0;
  };

  const saveCurrentSection = async () => {
    const currentSectionKey = steps[step - 1].key;
    setIsSaving(true);
    try {
      const response = await axios.put(`/api/applications/me/section/${currentSectionKey}`, formData[currentSectionKey]);
      setFormData(response.data);
    } catch (err) {
      console.error('Error saving section');
    } finally {
      setIsSaving(false);
    }
  };

  const updateFormData = (section, data) => {
    setFormData({ ...formData, [section]: data });
  };

  const submitApplication = async () => {
    try {
      await axios.post('/api/applications/me/submit');
      navigate('/dashboard');
    } catch (err) {
      alert('Submission failed: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  const nextStep = async () => {
    await saveCurrentSection();
    if (step < steps.length) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (loading) return <div className="container mt-20">Loading Application...</div>;

  return (
    <div className="application-form-container container mt-20 mb-20">
      <div className="flex items-center gap-10 mb-20" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
        <ChevronLeft size={18} /> Back to Dashboard
      </div>

      <div className="flex gap-20 flex-col-mobile">
        {/* Step Navigation Sidebar */}
        <div className="steps-nav sidebar" style={{ flex: 1 }}>
          <div className="card" style={{ padding: '0' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light)', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Application Steps</h3>
            </div>
            <ul style={{ listStyle: 'none' }}>
              {steps.map((s, index) => {
                const isActive = step === index + 1;
                const isComplete = isSectionComplete(s.key);
                const isPartial = isSectionPartial(s.key);

                let bgColor = 'transparent';
                let borderColor = 'transparent';
                let iconBg = '#e5e7eb';
                let textColor = 'var(--text-muted)';

                if (isActive) {
                  bgColor = 'rgba(237, 28, 36, 0.05)';
                  borderColor = 'var(--primary-red)';
                  iconBg = 'var(--primary-red)';
                  textColor = 'var(--primary-red)';
                } else if (isComplete) {
                  iconBg = 'var(--success)';
                  textColor = 'var(--text-main)';
                } else if (isPartial) {
                  iconBg = 'var(--warning)';
                  textColor = 'var(--text-main)';
                  bgColor = 'rgba(255, 193, 7, 0.05)';
                }

                return (
                  <li key={index} style={{
                    padding: '15px 20px',
                    borderBottom: index < steps.length - 1 ? '1px solid var(--border-color)' : 'none',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    backgroundColor: bgColor,
                    borderLeft: `4px solid ${borderColor}`,
                    color: textColor,
                    fontWeight: isActive ? 700 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }} onClick={() => setStep(index + 1)}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      backgroundColor: iconBg,
                      color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px'
                    }}>
                      {isComplete ? <Check size={16} /> : s.icon}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.9rem' }}>{s.title}</span>
                      {isComplete ? (
                        <span style={{ fontSize: '0.7rem', color: 'var(--success)' }}>Completed</span>
                      ) : isPartial ? (
                        <span style={{ fontSize: '0.7rem', color: 'var(--warning)' }}>Incomplete</span>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Form Content Area */}
        <div className="form-content" style={{ flex: 3 }}>
          <div className="card">
            <div className="section-header mb-20 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-red)' }}>{steps[step - 1].title}</h2>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Step {step} of 11</span>
            </div>

            <div style={{
              backgroundColor: '#fffbeb',
              borderLeft: '4px solid #f59e0b',
              padding: '12px 16px',
              borderRadius: '6px',
              marginBottom: '25px',
              fontSize: '0.9rem',
              color: '#78350f',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}>
              <span style={{ fontSize: '1.1rem' }}>⚠️</span>
              <span><strong>Important:</strong> Please ensure you click the <strong>Save Progress</strong> button before navigating to another section to keep your changes updated.</span>
            </div>

            <div className="step-component" style={{ minHeight: '400px' }}>
              {step === 1 && <ApplicantInfo data={formData.applicantInfo} updateData={updateFormData} />}
              {step === 2 && <ContactDetails data={formData.contactDetails} updateData={updateFormData} />}
              {step === 3 && <GuardianInfo data={formData.guardianInfo} updateData={updateFormData} />}
              {step === 4 && <AcademicBackground data={formData.academicBackground} updateData={updateFormData} />}
              {step === 5 && <ProgramInfo data={formData.programInfo} updateData={updateFormData} />}
              {step === 6 && <ResearchExperience data={formData.researchExperience} updateData={updateFormData} />}
              {step === 7 && <EnglishProficiency data={formData.englishProficiency} updateData={updateFormData} />}
              {step === 8 && <FundingInfo data={formData.fundingInfo} updateData={updateFormData} />}
              {step === 9 && <Referees data={formData.referees} updateData={updateFormData} />}
              {step === 10 && <Documents data={formData.documents} updateData={updateFormData} />}
              {step === 11 && (
                <Declaration
                  data={formData.declaration}
                  updateData={updateFormData}
                  canSubmit={formData.completionPercentage === 100}
                  incompleteSections={getIncompleteSections()}
                  onSubmit={submitApplication}
                />
              )}
            </div>

            <div className="form-actions mt-20 flex justify-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <button onClick={prevStep} disabled={step === 1} className="btn-dark" style={{
                padding: '10px 25px', borderRadius: '4px', opacity: step === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <ChevronLeft size={18} /> Previous
              </button>

              <div className="flex gap-10">
                <button onClick={saveCurrentSection} className="btn" style={{
                  backgroundColor: '#f3f4f6', color: '#666', border: '1px solid #ddd', padding: '10px 25px', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  {isSaving ? 'Saving...' : <><Save size={18} /> Save Progress</>}
                </button>

                {step < 11 ? (
                  <button onClick={nextStep} className="btn btn-primary" style={{ padding: '10px 25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Next <ChevronRight size={18} />
                  </button>
                ) : (
                  <div style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    Final Review Phase <Check size={20} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
