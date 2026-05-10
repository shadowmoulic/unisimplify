'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { User, Lock, Bell, Shield, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('account');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    notifications: {
      emailAlerts: true,
      deadlineReminders: true,
      promotionalOffers: false
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
        return;
      }
      setUser(session.user);
      setFormData(prev => ({
        ...prev,
        fullName: session.user.user_metadata?.full_name || '',
        email: session.user.email || ''
      }));
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, update Supabase user metadata
    alert('Settings saved successfully!');
    setSaving(false);
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      alert('Password reset link sent to your email!');
    } catch (error: any) {
      alert('Error sending reset link: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <main className="portal-main">
      <header className="main-header-banner" style={{ padding: '2.5rem 3rem' }}>
        <div className="banner-content">
          <div className="banner-text">
            <h1>Settings</h1>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Manage your account, privacy, and preferences.</p>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#10b981', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </header>

      <div className="dashboard-content-area" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Settings Sidebar */}
        <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <button
            onClick={() => setActiveTab('account')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: activeTab === 'account' ? '#f8fafc' : 'transparent', color: activeTab === 'account' ? '#0f172a' : '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '600', width: '100%' }}
          >
            <User size={18} /> Account
          </button>
          <button
            onClick={() => setActiveTab('security')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: activeTab === 'security' ? '#f8fafc' : 'transparent', color: activeTab === 'security' ? '#0f172a' : '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '600', width: '100%' }}
          >
            <Lock size={18} /> Security
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: activeTab === 'notifications' ? '#f8fafc' : 'transparent', color: activeTab === 'notifications' ? '#0f172a' : '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '600', width: '100%' }}
          >
            <Bell size={18} /> Notifications
          </button>
        </div>

        {/* Settings Content */}
        <div style={{ flex: 1, background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          
          {activeTab === 'account' && (
            <div>
              <h2 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Account Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="form-group">
                  <label htmlFor="fullName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Full Name</label>
                  <input 
                    id="fullName"
                    name="fullName"
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    style={{ width: '100%', maxWidth: '400px', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Email Address</label>
                  <input 
                    id="email"
                    name="email"
                    type="email" 
                    value={formData.email}
                    disabled
                    style={{ width: '100%', maxWidth: '400px', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#f1f5f9', color: '#94a3b8' }}
                  />
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>Email cannot be changed directly. Contact support if needed.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Security</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <Shield size={24} color="#10b981" />
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>Password</h3>
                      <p style={{ fontSize: '0.85rem', color: '#64748b' }}>A secure password helps protect your application data.</p>
                    </div>
                  </div>
                  <button 
                    onClick={handlePasswordReset}
                    style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', color: '#0f172a' }}
                  >
                    Send Password Reset Email
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Notification Preferences</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                  <div>
                    <h4 style={{ fontWeight: '600', color: '#0f172a' }}>Application Deadlines</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Receive alerts when a saved college deadline is approaching.</p>
                  </div>
                  <label htmlFor="deadlineReminders" className="switch" style={{ position: 'relative', display: 'inline-block', width: '40px', height: '24px' }}>
                    <input 
                      id="deadlineReminders"
                      name="deadlineReminders"
                      type="checkbox" 
                      checked={formData.notifications.deadlineReminders}
                      onChange={(e) => setFormData({...formData, notifications: {...formData.notifications, deadlineReminders: e.target.checked}})}
                      style={{ opacity: 0, width: 0, height: 0 }} 
                    />
                    <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: formData.notifications.deadlineReminders ? '#10b981' : '#cbd5e1', transition: '.4s', borderRadius: '24px' }}>
                      <span style={{ position: 'absolute', height: '18px', width: '18px', left: formData.notifications.deadlineReminders ? '18px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                    </span>
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                  <div>
                    <h4 style={{ fontWeight: '600', color: '#0f172a' }}>Email Alerts</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Receive important updates regarding UniSimplify platform.</p>
                  </div>
                  <label htmlFor="emailAlerts" className="switch" style={{ position: 'relative', display: 'inline-block', width: '40px', height: '24px' }}>
                    <input 
                      id="emailAlerts"
                      name="emailAlerts"
                      type="checkbox" 
                      checked={formData.notifications.emailAlerts}
                      onChange={(e) => setFormData({...formData, notifications: {...formData.notifications, emailAlerts: e.target.checked}})}
                      style={{ opacity: 0, width: 0, height: 0 }} 
                    />
                    <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: formData.notifications.emailAlerts ? '#10b981' : '#cbd5e1', transition: '.4s', borderRadius: '24px' }}>
                      <span style={{ position: 'absolute', height: '18px', width: '18px', left: formData.notifications.emailAlerts ? '18px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                    </span>
                  </label>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
