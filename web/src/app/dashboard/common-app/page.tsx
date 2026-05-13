'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  GraduationCap, 
  FileText, 
  ShieldCheck, 
  Settings, 
  Save, 
  Plus, 
  Trash2, 
  AlertCircle,
  Stethoscope,
  MapPin,
  Users2,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import NotificationModal from '@/components/NotificationModal';

export default function CommonAppPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [modalConfig, setModalConfig] = useState({ show: false, message: '', type: 'success', title: '' });

  // Form State
  const [formData, setFormData] = useState({
    personal: { 
      firstName: '', 
      lastName: '', 
      dob: '', 
      phone: '',
      caste: 'General',
      categoryCertUrl: '',
      minorityStatus: 'No',
      isDiabetic: 'No',
      birthPlace: '',
      isTwin: 'No'
    },
    academic: { 
      schoolBoard: '', 
      percentage10: 85, 
      percentage12: 85, 
      stream: '',
      subjects12: [
        { name: 'Physics', marks: '' },
        { name: 'Chemistry', marks: '' },
        { name: 'Mathematics', marks: '' },
        { name: 'English', marks: '' },
        { name: '', marks: '' }
      ]
    },
    exams: { jeeMainScore: '', neetScore: '', cuetScore: '' },
    documents: { idProofUrl: '', photoUrl: '', idType: 'Aadhaar' },
    preferences: { preferredCourse: '', preferredState: '', budget: '' }
  });

  const indianBoards = [
    "CBSE (Central Board of Secondary Education)",
    "ICSE (Indian Certificate of Secondary Education)",
    "NIOS (National Institute of Open Schooling)",
    "Andhra Pradesh State Board",
    "Assam State Board",
    "Bihar State Board",
    "Chhattisgarh State Board",
    "Goa State Board",
    "Gujarat State Board",
    "Haryana State Board",
    "Himachal Pradesh State Board",
    "Jammu & Kashmir State Board",
    "Jharkhand State Board",
    "Karnataka State Board",
    "Kerala State Board",
    "Madhya Pradesh State Board",
    "Maharashtra State Board",
    "Manipur State Board",
    "Meghalaya State Board",
    "Mizoram State Board",
    "Nagaland State Board",
    "Odisha State Board",
    "Punjab State Board",
    "Rajasthan State Board",
    "Tamil Nadu State Board",
    "Telangana State Board",
    "Tripura State Board",
    "Uttar Pradesh State Board",
    "Uttarakhand State Board",
    "West Bengal State Board"
  ];
  
  const courseOptions = [
    "B.Tech Computer Science",
    "B.Tech Information Technology",
    "B.Tech Electronics & Comm",
    "B.Tech Mechanical Engineering",
    "B.Tech Civil Engineering",
    "B.Tech AI & Data Science",
    "BS Mathematics",
    "BS Physics",
    "BS Chemistry",
    "MBBS",
    "BDS",
    "B.Arch",
    "BBA",
    "BCA",
    "B.Com (Hons)",
    "B.Sc",
    "B.A.",
    "Law (LL.B)",
    "Other"
  ];

  const stateOptions = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Chandigarh"
  ];

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
        return;
      }
      setUser(session.user);
    };
    fetchUserAndProfile();
  }, [router]);

  const handleInputChange = (section: string, field: string, value: any) => {
    let validatedValue = value;
    
    // Robust validation for exam scores
    if (section === 'exams') {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        if (field === 'jeeMainScore') {
          if (num > 100) validatedValue = '100';
          if (num < 0) validatedValue = '0';
        } else if (field === 'neetScore') {
          if (num > 720) validatedValue = '720';
          if (num < 0) validatedValue = '0';
        } else if (field === 'cuetScore') {
          if (num > 800) validatedValue = '800';
          if (num < 0) validatedValue = '0';
        }
      }
    }

    // Robust validation for file types
    const fileFields = ['idProofUrl', 'photoUrl', 'categoryCertUrl'];
    if (fileFields.includes(field)) {
      const fileName = value.toLowerCase();
      const isPhoto = field === 'photoUrl';
      const allowedExtensions = isPhoto ? ['.jpg', '.jpeg', '.png'] : ['.pdf', '.jpg', '.jpeg', '.png'];
      
      const hasAllowedExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
      
      if (value && !hasAllowedExtension) {
        setModalConfig({
          show: true,
          title: 'Invalid File Type',
          message: isPhoto ? 'Please upload a JPG or PNG image.' : 'Please upload a PDF or image file (JPG/PNG).',
          type: 'error'
        });
        setTimeout(() => setModalConfig(prev => ({ ...prev, show: false })), 4000);
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [field]: validatedValue
      }
    }));
  };

  const handleSubjectChange = (index: number, field: string, value: string) => {
    const newSubjects = [...formData.academic.subjects12];
    (newSubjects[index] as any)[field] = value;
    setFormData(prev => ({
      ...prev,
      academic: { ...prev.academic, subjects12: newSubjects }
    }));
  };

  const addSubject = () => {
    setFormData(prev => ({
      ...prev,
      academic: { 
        ...prev.academic, 
        subjects12: [...prev.academic.subjects12, { name: '', marks: '' }] 
      }
    }));
  };

  const removeSubject = (index: number) => {
    const newSubjects = formData.academic.subjects12.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      academic: { ...prev.academic, subjects12: newSubjects }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    // In a real app, you would save to Supabase here
    setTimeout(() => {
      setLoading(false);
      setModalConfig({
        show: true,
        title: 'Progress Saved',
        message: 'Your common application progress has been saved successfully.',
        type: 'success'
      });
      setTimeout(() => setModalConfig(prev => ({ ...prev, show: false })), 4000);
    }, 800);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Details', icon: <User size={18} /> },
    { id: 'academic', label: 'Academic Details', icon: <GraduationCap size={18} /> },
    { id: 'exams', label: 'Entrance Exams', icon: <FileText size={18} /> },
    { id: 'documents', label: 'Documents', icon: <ShieldCheck size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <Settings size={18} /> }
  ];

  return (
    <main className="portal-main">
      <header className="main-header-banner">
        <div className="banner-content">
          <div className="banner-text">
            <h1>My UniSimplify Application</h1>
            <p className="banner-subtext">Fill once, apply everywhere. Your progress is auto-saved.</p>
          </div>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="btn-save-progress"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Progress'}
          </button>
        </div>
      </header>

      <div className="dashboard-content-area portal-grid">
        <div className="tabs-sidebar glass-panel">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="form-content-card glass-panel">
          
          {activeTab === 'personal' && (
            <div className="form-section">
              <div className="section-title-box">
                <User className="text-emerald" size={24} />
                <h2>Personal Information</h2>
              </div>
              
              <div className="form-grid-standard">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" value={formData.personal.firstName} onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)} placeholder="Rahul" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" value={formData.personal.lastName} onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)} placeholder="Sharma" />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" value={formData.personal.dob} onChange={(e) => handleInputChange('personal', 'dob', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" value={formData.personal.phone} onChange={(e) => handleInputChange('personal', 'phone', e.target.value)} placeholder="+91" />
                </div>
                <div className="form-group">
                  <label><MapPin size={14} /> Place of Birth</label>
                  <input type="text" value={formData.personal.birthPlace} onChange={(e) => handleInputChange('personal', 'birthPlace', e.target.value)} placeholder="e.g. Mumbai, Maharashtra" />
                </div>
                <div className="form-group">
                  <label><Users2 size={14} /> Are you a Twin?</label>
                  <select value={formData.personal.isTwin} onChange={(e) => handleInputChange('personal', 'isTwin', e.target.value)}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>

              <div className="divider-premium" />

              <div className="section-title-box-mini">
                <AlertCircle size={18} />
                <h3>Category & Diversity</h3>
              </div>

              <div className="form-grid-standard">
                <div className="form-group">
                  <label>Social Category / Caste</label>
                  <select value={formData.personal.caste} onChange={(e) => handleInputChange('personal', 'caste', e.target.value)}>
                    <option value="General">General (UR)</option>
                    <option value="OBC-NCL">OBC-NCL</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Category Certificate (Optional)</label>
                  <div className="file-input-wrapper-premium">
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png" 
                      onChange={(e) => handleInputChange('personal', 'categoryCertUrl', e.target.files?.[0]?.name || '')} 
                    />
                    {formData.personal.categoryCertUrl && (
                      <div className="file-status-badge">
                        <CheckCircle2 size={12} />
                        <span>{formData.personal.categoryCertUrl}</span>
                      </div>
                    )}
                  </div>
                  <span className="input-hint">PDF, JPG, or PNG only</span>
                </div>
                <div className="form-group">
                  <label>Minority Status</label>
                  <select value={formData.personal.minorityStatus} onChange={(e) => handleInputChange('personal', 'minorityStatus', e.target.value)}>
                    <option value="No">No</option>
                    <option value="Muslim">Religious - Muslim</option>
                    <option value="Christian">Religious - Christian</option>
                    <option value="Sikh">Religious - Sikh</option>
                    <option value="Jain">Religious - Jain</option>
                    <option value="Buddhist">Religious - Buddhist</option>
                    <option value="Linguistic">Linguistic Minority</option>
                  </select>
                </div>
                <div className="form-group">
                  <label><Stethoscope size={14} /> Are you Diabetic?</label>
                  <select value={formData.personal.isDiabetic} onChange={(e) => handleInputChange('personal', 'isDiabetic', e.target.value)}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="form-section">
              <div className="section-title-box">
                <GraduationCap className="text-emerald" size={24} />
                <h2>Academic Credentials</h2>
              </div>

              <div className="form-group full-width">
                <label>School Board (Class 12)</label>
                <select 
                  value={formData.academic.schoolBoard} 
                  onChange={(e) => handleInputChange('academic', 'schoolBoard', e.target.value)}
                  className="premium-select"
                >
                  <option value="">Select your board</option>
                  {indianBoards.map(board => <option key={board} value={board}>{board}</option>)}
                </select>
              </div>

              <div className="slider-group-container">
                <div className="slider-item">
                  <div className="slider-label">
                    <span>Class 10 Percentage</span>
                    <strong className="text-emerald">{formData.academic.percentage10}%</strong>
                  </div>
                  <input 
                    type="range" min="0" max="100" 
                    value={formData.academic.percentage10} 
                    onChange={(e) => handleInputChange('academic', 'percentage10', parseInt(e.target.value))}
                    className="premium-slider"
                  />
                </div>

                <div className="slider-item">
                  <div className="slider-label">
                    <span>Class 12 Percentage (Expected/Actual)</span>
                    <strong className="text-emerald">{formData.academic.percentage12}%</strong>
                  </div>
                  <input 
                    type="range" min="0" max="100" 
                    value={formData.academic.percentage12} 
                    onChange={(e) => handleInputChange('academic', 'percentage12', parseInt(e.target.value))}
                    className="premium-slider"
                  />
                </div>
              </div>

              <div className="divider-premium" />

              <div className="section-title-box-mini">
                <FileText size={18} />
                <h3>Class 12th Subjects & Marks</h3>
              </div>

              <div className="subjects-grid-premium">
                <div className="grid-header">
                  <span>Subject Name</span>
                  <span>Marks (out of 100)</span>
                  <span />
                </div>
                {formData.academic.subjects12.map((subject, index) => (
                  <div key={index} className="subject-row">
                    <input 
                      type="text" value={subject.name} 
                      onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                      placeholder="e.g. Physics" 
                    />
                    <input 
                      type="number" value={subject.marks} 
                      onChange={(e) => handleSubjectChange(index, 'marks', e.target.value)}
                      placeholder="95" 
                    />
                    <button onClick={() => removeSubject(index)} className="btn-remove"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button onClick={addSubject} className="btn-add-subject">
                  <Plus size={16} />
                  Add Another Subject
                </button>
              </div>
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="form-section">
              <div className="section-title-box">
                <FileText className="text-emerald" size={24} />
                <h2>Entrance Exams</h2>
              </div>
              <div className="form-grid-standard">
                <div className="form-group">
                  <label>JEE Main Percentile (0-100)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.exams.jeeMainScore} 
                    onChange={(e) => handleInputChange('exams', 'jeeMainScore', e.target.value)} 
                    placeholder="e.g. 98.5" 
                  />
                  <span className="input-hint">Must be between 0 and 100</span>
                </div>
                <div className="form-group">
                  <label>NEET Score (0-720)</label>
                  <input 
                    type="number" 
                    min="0"
                    max="720"
                    value={formData.exams.neetScore} 
                    onChange={(e) => handleInputChange('exams', 'neetScore', e.target.value)} 
                    placeholder="e.g. 650" 
                  />
                  <span className="input-hint">Maximum score is 720</span>
                </div>
                <div className="form-group">
                  <label>CUET Score (0-800)</label>
                  <input 
                    type="number" 
                    min="0"
                    max="800"
                    value={formData.exams.cuetScore} 
                    onChange={(e) => handleInputChange('exams', 'cuetScore', e.target.value)} 
                    placeholder="e.g. 780" 
                  />
                  <span className="input-hint">Commonly out of 800</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="form-section">
              <div className="section-title-box">
                <ShieldCheck className="text-emerald" size={24} />
                <h2>Verified Documents</h2>
              </div>
              <div className="upload-grid-premium">
                <div className="upload-box-premium">
                  <FileText size={32} />
                  <h3>ID Proof</h3>
                  <div className="form-group" style={{ margin: '1rem 0' }}>
                    <select 
                      value={formData.documents.idType} 
                      onChange={(e) => handleInputChange('documents', 'idType', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    >
                      <option value="Aadhaar">Aadhaar Card</option>
                      <option value="PAN">PAN Card</option>
                      <option value="Passport">Passport</option>
                      <option value="Driving License">Driving License</option>
                    </select>
                  </div>
                  <p>Upload your {formData.documents.idType}</p>
                  <div className="file-input-wrapper-premium">
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png" 
                      onChange={(e) => handleInputChange('documents', 'idProofUrl', e.target.files?.[0]?.name || '')} 
                    />
                    {formData.documents.idProofUrl && (
                      <div className="file-status-badge">
                        <CheckCircle2 size={12} />
                        <span>{formData.documents.idProofUrl}</span>
                      </div>
                    )}
                  </div>
                  <span className="input-hint" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>PDF, JPG, or PNG</span>
                </div>
                <div className="upload-box-premium">
                  <User size={32} />
                  <h3>Photograph</h3>
                  <p>Recent passport size photo</p>
                  <div className="file-input-wrapper-premium">
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png" 
                      onChange={(e) => handleInputChange('documents', 'photoUrl', e.target.files?.[0]?.name || '')} 
                    />
                    {formData.documents.photoUrl && (
                      <div className="file-status-badge">
                        <CheckCircle2 size={12} />
                        <span>{formData.documents.photoUrl}</span>
                      </div>
                    )}
                  </div>
                  <span className="input-hint" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>JPG or PNG only</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="form-section">
              <div className="section-title-box">
                <Settings className="text-emerald" size={24} />
                <h2>College Preferences</h2>
              </div>
              <div className="form-grid-standard">
                <div className="form-group">
                  <label>Preferred Course</label>
                  <select 
                    value={formData.preferences.preferredCourse} 
                    onChange={(e) => handleInputChange('preferences', 'preferredCourse', e.target.value)}
                  >
                    <option value="">Select Course</option>
                    {courseOptions.map(course => <option key={course} value={course}>{course}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Preferred State</label>
                  <select 
                    value={formData.preferences.preferredState} 
                    onChange={(e) => handleInputChange('preferences', 'preferredState', e.target.value)}
                  >
                    <option value="">Select State</option>
                    {stateOptions.map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Annual Budget</label>
                  <select value={formData.preferences.budget} onChange={(e) => handleInputChange('preferences', 'budget', e.target.value)}>
                    <option value="">Select Range</option>
                    <option value="under_5">Under ₹5 Lakhs</option>
                    <option value="5_to_10">₹5 - ₹10 Lakhs</option>
                    <option value="above_10">Above ₹10 Lakhs</option>
                  </select>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <NotificationModal 
        show={modalConfig.show}
        message={modalConfig.message}
        type={modalConfig.type as any}
        title={modalConfig.title}
        onClose={() => setModalConfig(prev => ({ ...prev, show: false }))}
      />
    </main>
  );
}
