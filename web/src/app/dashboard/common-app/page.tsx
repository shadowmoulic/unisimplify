'use client';

import React, { useState, useEffect } from 'react';
import { User, GraduationCap, FileText, ShieldCheck, Settings, Save } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function CommonAppPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    personal: { firstName: '', lastName: '', dob: '', phone: '' },
    academic: { schoolBoard: '', percentage10: '', percentage12: '', stream: '' },
    exams: { jeeMainScore: '', neetScore: '', cuetScore: '' },
    documents: { idProofUrl: '', photoUrl: '' },
    preferences: { preferredCourse: '', preferredState: '', budget: '' }
  });

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
        return;
      }
      setUser(session.user);
      
      // Try to load existing profile data here (placeholder for now)
      // const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      // if (data) setFormData(data.content);
    };
    fetchUserAndProfile();
  }, [router]);

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Placeholder for actual save logic
    // await supabase.from('profiles').upsert({ id: user?.id, content: formData });
    
    setTimeout(() => {
      setLoading(false);
      alert('Application progress saved successfully!');
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
      <header className="main-header-banner" style={{ padding: '2rem 3rem' }}>
        <div className="banner-content">
          <div className="banner-text">
            <h1>My UniSimplify Application</h1>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Fill once, apply everywhere. Your progress is auto-saved.</p>
          </div>
          <button 
            onClick={handleSave} 
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#10b981', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Progress'}
          </button>
        </div>
      </header>

      <div className="dashboard-content-area" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Tab Navigation */}
        <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                background: activeTab === tab.id ? '#ecfdf5' : 'transparent',
                color: activeTab === tab.id ? '#10b981' : '#64748b',
                border: activeTab === tab.id ? '1px solid rgba(16,185,129,0.2)' : '1px solid transparent',
                borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '600', width: '100%'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content Area */}
        <div style={{ flex: 1, background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          
          {activeTab === 'personal' && (
            <div className="form-section">
              <h2 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Personal Details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label htmlFor="firstName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>First Name</label>
                  <input 
                    id="firstName"
                    name="firstName"
                    type="text" 
                    value={formData.personal.firstName}
                    onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    placeholder="e.g. Rahul"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Last Name</label>
                  <input 
                    id="lastName"
                    name="lastName"
                    type="text" 
                    value={formData.personal.lastName}
                    onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    placeholder="e.g. Sharma"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dob" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Date of Birth</label>
                  <input 
                    id="dob"
                    name="dob"
                    type="date" 
                    value={formData.personal.dob}
                    onChange={(e) => handleInputChange('personal', 'dob', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Phone Number</label>
                  <input 
                    id="phone"
                    name="phone"
                    type="tel" 
                    value={formData.personal.phone}
                    onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    placeholder="+91"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="form-section">
              <h2 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Academic Details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="schoolBoard" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>School Board (Class 12)</label>
                  <select 
                    id="schoolBoard"
                    name="schoolBoard"
                    value={formData.academic.schoolBoard}
                    onChange={(e) => handleInputChange('academic', 'schoolBoard', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  >
                    <option value="">Select Board</option>
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Board</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="percentage10" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Class 10 Percentage</label>
                  <input 
                    id="percentage10"
                    name="percentage10"
                    type="number" 
                    value={formData.academic.percentage10}
                    onChange={(e) => handleInputChange('academic', 'percentage10', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    placeholder="%"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="percentage12" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Class 12 Percentage (Expected/Actual)</label>
                  <input 
                    id="percentage12"
                    name="percentage12"
                    type="number" 
                    value={formData.academic.percentage12}
                    onChange={(e) => handleInputChange('academic', 'percentage12', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    placeholder="%"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="form-section">
              <h2 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Entrance Exams</h2>
              <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>Enter your scores or expected scores for the relevant exams.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label htmlFor="jeeMainScore" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>JEE Main Score / Percentile</label>
                  <input 
                    id="jeeMainScore"
                    name="jeeMainScore"
                    type="text" 
                    value={formData.exams.jeeMainScore}
                    onChange={(e) => handleInputChange('exams', 'jeeMainScore', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    placeholder="e.g. 98.5"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="neetScore" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>NEET Score</label>
                  <input 
                    id="neetScore"
                    name="neetScore"
                    type="text" 
                    value={formData.exams.neetScore}
                    onChange={(e) => handleInputChange('exams', 'neetScore', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    placeholder="e.g. 650"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cuetScore" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>CUET Score</label>
                  <input 
                    id="cuetScore"
                    name="cuetScore"
                    type="text" 
                    value={formData.exams.cuetScore}
                    onChange={(e) => handleInputChange('exams', 'cuetScore', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    placeholder="e.g. 780"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="form-section">
              <h2 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Documents</h2>
              <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>Upload your supporting documents. These will be sent securely to your selected colleges.</p>
              
              <div style={{ border: '2px dashed #cbd5e1', padding: '2rem', textAlign: 'center', borderRadius: '8px', marginBottom: '1rem' }}>
                <ShieldCheck size={32} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Upload ID Proof (Aadhaar/Passport)</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>PDF or JPEG up to 5MB</p>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleInputChange('documents', 'idProofUrl', e.target.files[0].name);
                    }
                  }}
                  style={{ display: 'block', margin: '0 auto' }} 
                />
                {formData.documents.idProofUrl && <p style={{ fontSize: '0.85rem', color: '#10b981', marginTop: '0.5rem' }}>Selected: {formData.documents.idProofUrl}</p>}
              </div>
              
              <div style={{ border: '2px dashed #cbd5e1', padding: '2rem', textAlign: 'center', borderRadius: '8px' }}>
                <User size={32} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Upload Passport Photograph</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>JPEG up to 2MB</p>
                <input 
                  type="file" 
                  accept=".jpg,.jpeg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleInputChange('documents', 'photoUrl', e.target.files[0].name);
                    }
                  }}
                  style={{ display: 'block', margin: '0 auto' }} 
                />
                {formData.documents.photoUrl && <p style={{ fontSize: '0.85rem', color: '#10b981', marginTop: '0.5rem' }}>Selected: {formData.documents.photoUrl}</p>}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="form-section">
              <h2 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>College Preferences</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label htmlFor="preferredCourse" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Preferred Course/Major</label>
                  <input 
                    id="preferredCourse"
                    name="preferredCourse"
                    type="text" 
                    value={formData.preferences.preferredCourse}
                    onChange={(e) => handleInputChange('preferences', 'preferredCourse', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    placeholder="e.g. B.Tech Computer Science"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="preferredState" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Preferred State/Location</label>
                  <input 
                    id="preferredState"
                    name="preferredState"
                    type="text" 
                    value={formData.preferences.preferredState}
                    onChange={(e) => handleInputChange('preferences', 'preferredState', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    placeholder="e.g. Maharashtra, Karnataka"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="budget" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Annual Budget (Optional)</label>
                  <select 
                    id="budget"
                    name="budget"
                    value={formData.preferences.budget}
                    onChange={(e) => handleInputChange('preferences', 'budget', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  >
                    <option value="">Select Range</option>
                    <option value="under_5">Under ₹5 Lakhs</option>
                    <option value="5_to_10">₹5 - ₹10 Lakhs</option>
                    <option value="10_to_20">₹10 - ₹20 Lakhs</option>
                    <option value="above_20">Above ₹20 Lakhs</option>
                  </select>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
