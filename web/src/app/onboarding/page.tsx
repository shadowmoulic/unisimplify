'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, BookOpen, GraduationCap, FileText, Settings, ChevronRight, ChevronLeft, CheckCircle2, Sparkles, ShieldCheck, Plus, X } from 'lucide-react';

const steps = [
  { id: 'personal', title: 'Personal', icon: <User size={20} /> },
  { id: 'academic', title: 'Academic', icon: <BookOpen size={20} /> },
  { id: 'exams', title: 'Entrance Exams', icon: <GraduationCap size={20} /> },
  { id: 'documents', title: 'Documents', icon: <FileText size={20} /> },
  { id: 'preferences', title: 'Preferences', icon: <Settings size={20} /> },
];

const states = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", 
  "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", 
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const boards = ["CBSE", "ICSE", "ISC", "NIOS", "State Board", "IB", "IGCSE"];

const subjects = [
  "Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "English", "Economics", "Business Studies", 
  "Accountancy", "History", "Geography", "Political Science", "Sociology", "Psychology", "Physical Education"
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', mobile: '',
    school10: '', board10: '', percentage10: '85',
    school12: '', board12: '', percentage12: '85',
    subjects12: [] as string[],
    jeeScore: '', neetScore: '', cuetScore: '',
    preferredCourse: '', preferredState: '', budget: '5'
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubjectToggle = (subject: string) => {
    const updatedSubjects = formData.subjects12.includes(subject)
      ? formData.subjects12.filter(s => s !== subject)
      : [...formData.subjects12, subject];
    setFormData({ ...formData, subjects12: updatedSubjects });
  };

  return (
    <div className="onboarding-container">
      <header className="onboarding-header">
        <div className="badge">
          <ShieldCheck size={14} />
          <span>Universal Profile Setup</span>
        </div>
        <h1>Let's build your <span className="text-gradient">Identity</span></h1>
        <p>This information will be used to automatically fill your applications across 30+ universities.</p>
      </header>

      <div className="stepper-wrapper glass-panel">
        <div className="stepper">
          {steps.map((step, index: number) => (
            <div key={step.id} className={`step ${index <= currentStep ? 'active' : ''}`}>
              <div className="step-icon">
                {index < currentStep ? <CheckCircle2 size={22} strokeWidth={3} /> : step.icon}
              </div>
              <span className="step-title">{step.title}</span>
              {index < steps.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>
      </div>

      <div className="form-card glass-panel">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="step-content"
          >
            {currentStep === 0 && (
              <div className="form-section">
                <div className="section-title-group">
                  <div className="section-icon"><User size={24} /></div>
                  <div>
                    <h2>Personal Details</h2>
                    <p>Tell us about yourself. Your identity is secure with us.</p>
                  </div>
                </div>
                
                <div className="input-grid">
                  <div className="input-group">
                    <label>First Name</label>
                    <input type="text" name="firstName" placeholder="e.g. Sayak" value={formData.firstName} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Last Name</label>
                    <input type="text" name="lastName" placeholder="e.g. Das" value={formData.lastName} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Email Address</label>
                    <input type="email" name="email" placeholder="hello@example.com" value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Mobile Number</label>
                    <input type="tel" name="mobile" placeholder="+91 00000 00000" value={formData.mobile} onChange={handleChange} />
                  </div>
                  <div className="input-group full">
                    <label>Home State</label>
                    <select name="preferredState" value={formData.preferredState} onChange={handleChange}>
                      <option value="">Select State</option>
                      {states.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="form-section">
                <div className="section-title-group">
                  <div className="section-icon"><BookOpen size={24} /></div>
                  <div>
                    <h2>Academic Background</h2>
                    <p>Provide your Class 10 and 12 records for verification.</p>
                  </div>
                </div>

                <div className="input-grid">
                  <div className="input-group full">
                    <label>Class 10 School Name</label>
                    <input type="text" name="school10" placeholder="e.g. Saint Xaviers High School" value={formData.school10} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Class 10 Board</label>
                    <select name="board10" value={formData.board10} onChange={handleChange}>
                      <option value="">Select Board</option>
                      {boards.map(board => <option key={board} value={board}>{board}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Class 10 Marks: <span className="text-emerald">{formData.percentage10}%</span></label>
                    <div className="slider-wrapper">
                      <input 
                        type="range" 
                        name="percentage10" 
                        min="0" 
                        max="100" 
                        step="1" 
                        value={formData.percentage10} 
                        onChange={handleChange} 
                        className="custom-slider"
                      />
                    </div>
                  </div>

                  <div className="input-group full" style={{ marginTop: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
                    <label>Class 12 School Name</label>
                    <input type="text" name="school12" placeholder="e.g. Saint Xaviers High School" value={formData.school12} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Class 12 Board</label>
                    <select name="board12" value={formData.board12} onChange={handleChange}>
                      <option value="">Select Board</option>
                      {boards.map(board => <option key={board} value={board}>{board}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Class 12 Marks: <span className="text-emerald">{formData.percentage12}%</span></label>
                    <div className="slider-wrapper">
                      <input 
                        type="range" 
                        name="percentage12" 
                        min="0" 
                        max="100" 
                        step="1" 
                        value={formData.percentage12} 
                        onChange={handleChange} 
                        className="custom-slider"
                      />
                    </div>
                  </div>

                  <div className="input-group full">
                    <label>Class 12 Subjects</label>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <select 
                        onChange={(e) => {
                          if (e.target.value) {
                            handleSubjectToggle(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        style={{ flex: 1 }}
                      >
                        <option value="">Add a Subject</option>
                        {subjects.filter(s => !formData.subjects12.includes(s)).map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="subject-pills">
                      {formData.subjects12.map(subject => (
                        <button
                          key={subject}
                          type="button"
                          className="subject-pill active"
                          onClick={() => handleSubjectToggle(subject)}
                        >
                          <X size={14} />
                          {subject}
                        </button>
                      ))}
                      {formData.subjects12.length === 0 && (
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', padding: '0.5rem' }}>No subjects selected yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep >= 2 && (
              <div className="form-section centered">
                <div className="construction-vibe">
                  <div className="glow-icon-box">
                    <Sparkles size={48} className="sparkle-icon" />
                  </div>
                  <h2>Coming Soon: {steps[currentStep].title}</h2>
                  <p>We're fine-tuning the <strong>standardized verification</strong> for this section to ensure 100% acceptance by universities.</p>
                  <div className="status-badge">Optimization in Progress</div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="form-footer">
          <button 
            className={`btn-nav-secondary ${currentStep === 0 ? 'disabled' : ''}`}
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          
          <button className="btn-nav-primary" onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .onboarding-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 6rem 2rem;
        }

        .onboarding-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
          border-radius: 100px;
          font-weight: 800;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .onboarding-header h1 {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #0f172a;
          line-height: 1.1;
          margin-bottom: 1rem;
        }

        .onboarding-header p {
          font-size: 1.2rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        .stepper-wrapper {
          padding: 2rem;
          border-radius: 32px;
          margin-bottom: 3rem;
          background: #fff;
          overflow-x: auto;
        }

        .stepper {
          display: flex;
          justify-content: space-between;
          position: relative;
          min-width: 600px;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .step-icon {
          width: 44px;
          height: 44px;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .step.active .step-icon {
          background: #10b981;
          color: #fff;
          border-color: #10b981;
          box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
          transform: translateY(-5px);
        }

        .step-title {
          font-size: 0.8rem;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .step.active .step-title { color: #0f172a; }

        .step-connector {
          position: absolute;
          top: 22px;
          left: calc(50% + 22px);
          right: calc(-50% + 22px);
          height: 2px;
          background: #f1f5f9;
          z-index: -1;
        }

        .step.active .step-connector { background: #10b981; }

        .form-card {
          padding: 3.5rem;
          border-radius: 40px;
          background: #fff;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
        }

        .step-content { min-height: 400px; }

        .section-title-group {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 3rem;
          align-items: flex-start;
        }

        .section-icon {
          width: 54px;
          height: 54px;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .section-title-group h2 {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .section-title-group p { color: #64748b; font-size: 1.1rem; }

        .input-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .input-group { display: flex; flex-direction: column; gap: 0.75rem; }
        .input-group.full { grid-column: span 2; }

        .input-group label {
          font-size: 0.95rem;
          font-weight: 700;
          color: #334155;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .input-group input, .input-group select {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 1rem 1.25rem;
          border-radius: 14px;
          font-family: inherit;
          font-size: 1rem;
          color: #0f172a;
          transition: all 0.3s ease;
        }

        .input-group input:focus, .input-group select:focus {
          outline: none;
          background: #fff;
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }

        .slider-wrapper {
          padding: 1rem 0;
        }

        .custom-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 10px;
          outline: none;
          cursor: pointer;
        }

        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: #10b981;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
          transition: all 0.2s ease;
        }

        .custom-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .subject-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .subject-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 100px;
          font-weight: 700;
          font-size: 0.9rem;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .subject-pill:hover {
          border-color: #10b981;
          color: #10b981;
        }

        .subject-pill.active {
          background: #10b981;
          color: #fff;
          border-color: #10b981;
          box-shadow: 0 5px 15px rgba(16, 185, 129, 0.2);
        }

        .centered {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
        }

        .construction-vibe { text-align: center; }

        .glow-icon-box {
          width: 100px;
          height: 100px;
          background: rgba(16, 185, 129, 0.05);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2.5rem;
          color: #10b981;
        }

        .sparkle-icon { animation: spin 4s linear infinite; }

        @keyframes spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }

        .status-badge {
          display: inline-block;
          margin-top: 1.5rem;
          padding: 0.5rem 1rem;
          background: #0f172a;
          color: #fff;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 4rem;
          padding-top: 2.5rem;
          border-top: 1px solid #f1f5f9;
        }

        .btn-nav-primary {
          background: #10b981;
          color: #fff;
          padding: 1.25rem 2.5rem;
          border-radius: 18px;
          font-weight: 800;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.2);
        }

        .btn-nav-primary:hover {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(16, 185, 129, 0.3);
        }

        .btn-nav-secondary {
          background: #fff;
          color: #64748b;
          padding: 1.25rem 2.5rem;
          border-radius: 18px;
          font-weight: 800;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-nav-secondary:hover:not(.disabled) {
          border-color: #10b981;
          color: #10b981;
          background: #f8fafc;
        }

        .disabled { opacity: 0.4; cursor: not-allowed; }

        @media (max-width: 768px) {
          .onboarding-container { padding: 2rem 1rem; }
          .onboarding-header h1 { font-size: 2.2rem; }
          .stepper-wrapper { padding: 1rem; border-radius: 20px; }
          .stepper { min-width: 500px; }
          .input-grid { grid-template-columns: 1fr; gap: 1.25rem; }
          .form-card { padding: 1.5rem; border-radius: 24px; }
          .section-title-group { gap: 1rem; margin-bottom: 2rem; }
          .section-title-group h2 { font-size: 1.4rem; }
          .section-icon { width: 44px; height: 44px; }
          .form-footer { flex-direction: column-reverse; gap: 0.75rem; margin-top: 2rem; padding-top: 1.5rem; }
          .btn-nav-primary, .btn-nav-secondary { justify-content: center; width: 100%; padding: 1rem; font-size: 1rem; }
        }
      `}</style>
    </div>
  );
}
