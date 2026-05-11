'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { User, Lock, Bell, Shield, Save, LogOut } from 'lucide-react';
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <main className="portal-main">
      <header className="main-header-banner">
        <div className="banner-content">
          <div className="banner-text">
            <h1>Settings</h1>
            <p className="banner-subtext">Manage your account, privacy, and preferences.</p>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="btn-save-progress"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </header>

      <div className="dashboard-content-area portal-grid">
        {/* Settings Sidebar */}
        <div className="tabs-sidebar glass-panel">
          <button
            onClick={() => setActiveTab('account')}
            className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
          >
            <User size={18} /> Account
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          >
            <Lock size={18} /> Security
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          >
            <Bell size={18} /> Notifications
          </button>
        </div>

        {/* Settings Content */}
        <div className="form-content-card glass-panel">
          
          {activeTab === 'account' && (
            <div className="form-section">
              <div className="section-title-box">
                <User size={24} className="text-emerald" />
                <h2>Account Settings</h2>
              </div>
              
              <div className="form-grid-standard">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    disabled
                    className="disabled-input"
                  />
                  <span className="input-hint">Email cannot be changed directly. Contact support if needed.</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="form-section">
              <div className="section-title-box">
                <Lock size={24} className="text-emerald" />
                <h2>Security</h2>
              </div>
              
              <div className="security-card-premium">
                <div className="security-info">
                  <Shield size={32} className="text-emerald" />
                  <div>
                    <h3>Password</h3>
                    <p>A secure password helps protect your application data.</p>
                  </div>
                </div>
                <button 
                  onClick={handlePasswordReset}
                  className="btn-outline-premium"
                >
                  Send Password Reset Email
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="form-section">
              <div className="section-title-box">
                <Bell size={24} className="text-emerald" />
                <h2>Notification Preferences</h2>
              </div>
              
              <div className="notification-list-premium">
                <div className="notif-item">
                  <div className="notif-text">
                    <h4>Application Deadlines</h4>
                    <p>Receive alerts when a saved college deadline is approaching.</p>
                  </div>
                  <label className="premium-toggle">
                    <input 
                      type="checkbox" 
                      checked={formData.notifications.deadlineReminders}
                      onChange={(e) => setFormData({...formData, notifications: {...formData.notifications, deadlineReminders: e.target.checked}})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notif-item">
                  <div className="notif-text">
                    <h4>Email Alerts</h4>
                    <p>Receive important updates regarding UniSimplify platform.</p>
                  </div>
                  <label className="premium-toggle">
                    <input 
                      type="checkbox" 
                      checked={formData.notifications.emailAlerts}
                      onChange={(e) => setFormData({...formData, notifications: {...formData.notifications, emailAlerts: e.target.checked}})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="divider-premium" />
          
          <div className="form-section danger-zone">
            <h3>Danger Zone</h3>
            <p>Actions that are permanent or sign you out of the platform.</p>
            <button onClick={handleSignOut} className="btn-logout-mobile">
              <LogOut size={20} />
              Sign Out from All Devices
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
