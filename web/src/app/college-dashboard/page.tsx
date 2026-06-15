'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  Lock, 
  Mail, 
  Globe, 
  Sliders, 
  LogOut, 
  Home, 
  Trash2, 
  UserPlus, 
  Activity, 
  Award,
  Sparkles,
  ExternalLink,
  Edit2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { 
  getSimulatedUsers, 
  getLoginLogs, 
  updateUserRole, 
  logLogin, 
  UserProfile, 
  LoginLog 
} from '@/utils/activity';
import collegesDataRaw from '@/data/colleges.json';
import Link from 'next/link';
import '../dashboard/dashboard.css';

export default function CollegeDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [role, setRole] = useState<'student' | 'college' | 'admin'>('student');
  const [collegeName, setCollegeName] = useState<string>('');
  const [collegeUrl, setCollegeUrl] = useState<string>('');
  
  // Data State
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Admin Operations
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editRole, setEditRole] = useState<'student' | 'college' | 'admin'>('student');
  const [editCollegeName, setEditCollegeName] = useState('');

  // UI tabs for admin
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs'>('overview');

  const fetchLiveUsers = async (userRole: string, uCollege: string) => {
    try {
      const [adminsRes, profilesRes] = await Promise.all([
        supabase.from('unisimplify-college-admin').select('*'),
        supabase.from('unisimplify-profiles').select('*')
      ]);

      const admins = adminsRes.data || [];
      const profiles = profilesRes.data || [];

      const allUsers: UserProfile[] = [];

      // Add admins/reps
      admins.forEach(a => {
        allUsers.push({
          id: a.id,
          email: a.email,
          fullName: a.email.split('@')[0],
          role: a.role,
          collegeName: a.college_name || undefined,
          collegeUrl: a.college_url || undefined,
          lastLogin: a.created_at
        });
      });

      // Add student profiles
      profiles.forEach(p => {
        if (!allUsers.some(u => u.email.toLowerCase() === p.email.toLowerCase())) {
          allUsers.push({
            id: p.user_id,
            email: p.email,
            fullName: `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.email.split('@')[0],
            role: 'student',
            state: p.preferred_state || undefined,
            board12: p.school_board || undefined,
            percentage12: p.percentage_12 ? `${p.percentage_12}%` : undefined,
            preferredCourse: p.preferred_course || undefined,
            appStatus: 'Applied',
            lastLogin: p.updated_at
          });
        }
      });

      setUsers(allUsers);

      // Create logs from live student profiles
      const liveLogs: LoginLog[] = [];
      profiles.forEach(p => {
        liveLogs.push({
          id: `log-${p.user_id}-${p.updated_at}`,
          email: p.email,
          fullName: `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.email.split('@')[0],
          role: 'student',
          timestamp: p.updated_at,
          collegeName: uCollege || 'Sai University'
        });
      });

      liveLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLogs(liveLogs);

    } catch (e) {
      console.error("Error fetching live users/profiles:", e);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
        return;
      }
      
      const user = session.user;
      setCurrentUser(user);
      
      let userRole: 'student' | 'college' | 'admin' = 'student';
      let uCollege = '';
      let uCollegeUrl = '';

      try {
        const { data: adminRecord, error: dbError } = await supabase
          .from('unisimplify-college-admin')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();

        if (adminRecord) {
          userRole = adminRecord.role as any;
          uCollege = adminRecord.college_name || '';
          uCollegeUrl = adminRecord.college_url || '';
        } else {
          userRole = user.user_metadata?.role || 'student';
          if (user.email?.toLowerCase() === 'sayak@kgphustlehouse.com') {
            userRole = 'admin';
          }
          uCollege = user.user_metadata?.college_name || '';
          uCollegeUrl = user.user_metadata?.college_url || '';
        }
      } catch (err) {
        console.error('Error fetching role from Supabase unisimplify-college-admin:', err);
        userRole = user.user_metadata?.role || 'student';
        if (user.email?.toLowerCase() === 'sayak@kgphustlehouse.com') {
          userRole = 'admin';
        }
        uCollege = user.user_metadata?.college_name || '';
        uCollegeUrl = user.user_metadata?.college_url || '';
      }
      
      setRole(userRole);
      setCollegeName(uCollege);
      setCollegeUrl(uCollegeUrl);

      // Load live data
      await fetchLiveUsers(userRole, uCollege);
      setLoading(false);
      
      // Track session login
      logLogin(user.email || '', user.user_metadata?.full_name || user.email?.split('@')[0] || 'User', userRole, uCollege);
    };
    
    checkAuth();
  }, [router]);

  const refreshData = async () => {
    await fetchLiveUsers(role, collegeName);
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    let targetCollegeUrl = '';
    if (editRole === 'college') {
      const matched = collegesDataRaw.find(c => c["University Name"] === editCollegeName);
      targetCollegeUrl = matched ? (matched.URL || 'https://saiuniversity.edu.in') : 'https://saiuniversity.edu.in';
    }

    // Update in Supabase unisimplify-college-admin table
    try {
      if (editRole === 'student') {
        await supabase
          .from('unisimplify-college-admin')
          .delete()
          .eq('email', editingUser.email);
      } else {
        await supabase
          .from('unisimplify-college-admin')
          .upsert({
            email: editingUser.email,
            role: editRole,
            college_name: editRole === 'college' ? editCollegeName : null,
            college_url: editRole === 'college' ? targetCollegeUrl : null
          }, { onConflict: 'email' });
      }
    } catch (err) {
      console.error('Failed to sync role update to Supabase:', err);
    }

    // Update in local DB
    updateUserRole(editingUser.email, editRole, editRole === 'college' ? editCollegeName : undefined, editRole === 'college' ? targetCollegeUrl : undefined);
    
    // If admin updates themselves, sync with Supabase User Metadata as fallback
    if (currentUser && currentUser.email === editingUser.email) {
      await supabase.auth.updateUser({
        data: {
          role: editRole,
          college_name: editRole === 'college' ? editCollegeName : undefined,
          college_url: editRole === 'college' ? targetCollegeUrl : undefined
        }
      });
      setRole(editRole);
      setCollegeName(editCollegeName);
      setCollegeUrl(targetCollegeUrl);
    }

    setEditingUser(null);
    refreshData();
  };

  const handleRemoveUserSimulated = (email: string) => {
    const currentUsers = getSimulatedUsers();
    const filtered = currentUsers.filter(u => u.email !== email);
    localStorage.setItem('unisimplify_users', JSON.stringify(filtered));
    refreshData();
  };

  if (loading) {
    return (
      <div className="loading-screen" style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#0f172a' }}>
        <div className="loader" style={{ borderColor: '#e2e8f0', borderTopColor: '#10b981' }}></div>
      </div>
    );
  }

  // CASE 1: Student (Normal User) Access Denied
  if (role === 'student') {
    return (
      <div className="denied-container" style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        color: '#0f172a',
        fontFamily: 'Inter, sans-serif',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="bg-noise" style={{ opacity: 0.05, position: 'absolute', inset: 0, backgroundImage: 'url("/images/noise.png")' }} />
        <div className="radial-glow" style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)', top: '20%', left: '30%', zIndex: 0 }} />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="denied-card glass-panel"
          style={{
            maxWidth: '550px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '24px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
            zIndex: 1
          }}
        >
          <div className="lock-icon-wrapper" style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: 'rgba(239, 68, 68, 0.08)',
            color: '#ef4444',
            marginBottom: '2rem'
          }}>
            <Lock size={36} />
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem', color: '#0f172a' }}>
            College Privileges Required
          </h1>
          
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Your account is currently registered as a standard student profile. Standard profiles are restricted from accessing university portals.
          </p>

          <div style={{
            background: 'rgba(16, 185, 129, 0.04)',
            border: '1px solid rgba(16, 185, 129, 0.12)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <h3 style={{ color: '#10b981', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Mail size={16} /> Are you a college official?
            </h3>
            <p style={{ color: '#334155', fontSize: '0.88rem', margin: 0, lineHeight: '1.5' }}>
              Please send us a DM with official proof of association at <strong style={{ color: '#0f172a' }}>sayak@kgphustlehouse.com</strong>, and our admins will instantly upgrade your account.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/dashboard" className="btn-primary" style={{
              background: '#10b981',
              color: '#fff',
              padding: '0.8rem 1.5rem',
              borderRadius: '12px',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'transform 0.2s'
            }}>
              <Home size={18} /> Student Portal
            </Link>
            <a href="mailto:sayak@kgphustlehouse.com" className="btn-secondary" style={{
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #e2e8f0',
              padding: '0.8rem 1.5rem',
              borderRadius: '12px',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              Contact Admin
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // Filter lists based on search
  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.collegeName && u.collegeName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // College-specific student logs and list
  const targetedCollege = role === 'college' ? collegeName : 'Sai University';
  const collegeLogs = logs.filter(log => log.collegeName === targetedCollege);
  const collegeStudents = users.filter(u => u.role === 'student');

  return (
    <div className="portal-layout" style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#f8fafc',
      color: '#0f172a',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Sidebar Navigation */}
      <aside className="portal-sidebar">
        <div>
          <div className="sidebar-brand">
            <div className="brand-icon">
              <Sparkles size={20} fill="#fff" />
            </div>
            <span className="brand-text" style={{ color: '#0f172a' }}>UniSimplify</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 0.75rem' }}>
            {role === 'college' ? (
              <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16,185,129,0.15)', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Partner Portal</span>
                <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>{collegeName}</strong>
                {collegeUrl && (
                  <a href={collegeUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                    Visit Website <ExternalLink size={10} />
                  </a>
                )}
              </div>
            ) : (
              <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.15)', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', display: 'block' }}>System Admin</span>
                <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>Superuser Privileges</strong>
              </div>
            )}

            <button 
              onClick={() => setActiveTab('overview')}
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              style={{
                width: '100%',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Activity size={18} />
              <span>{role === 'admin' ? 'University View' : 'Overview'}</span>
            </button>

            {role === 'admin' && (
              <>
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                  style={{
                    width: '100%',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Users size={18} />
                  <span>User Manager</span>
                </button>

                <button 
                  onClick={() => setActiveTab('logs')}
                  className={`nav-item ${activeTab === 'logs' ? 'active' : ''}`}
                  style={{
                    width: '100%',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Sliders size={18} />
                  <span>System Audit Logs</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <Link href="/" className="nav-item">
            <Home size={18} />
            <span>Go to Home</span>
          </Link>
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/');
            }}
            className="nav-item text-red"
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="portal-main">
        {/* TOP HEADER */}
        <header className="main-header-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>
              {activeTab === 'overview' && `${targetedCollege} Dashboard`}
              {activeTab === 'users' && 'System User Management'}
              {activeTab === 'logs' && 'Global Activity Logs'}
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.25rem', margin: 0, lineHeight: '1.5' }}>
              {activeTab === 'overview' && `Real-time analytics and student interest for ${targetedCollege}`}
              {activeTab === 'users' && 'Promote users, assign university representatives, and manage permissions.'}
              {activeTab === 'logs' && 'Security log history of student logins and administration modifications.'}
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '0.5rem 1rem'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>System Status: Active</span>
            </div>
          </div>
        </header>

        <div className="dashboard-content-area">
          {/* TAB 1: OVERVIEW / COLLEGE REPRESENTATIVE DASHBOARD */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* METRIC CARD GRID */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem'
              }}>
                <div className="dashboard-section" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Student Logins</span>
                    <Activity size={20} className="text-emerald" style={{ color: '#10b981' }} />
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>{collegeLogs.length}</h2>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, display: 'block', marginTop: '0.5rem' }}>+12% vs last week</span>
                </div>

                <div className="dashboard-section" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Active Applications</span>
                    <Users size={20} style={{ color: '#3b82f6' }} />
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>{collegeStudents.length}</h2>
                  <span style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600, display: 'block', marginTop: '0.5rem' }}>Universal Profile sync ok</span>
                </div>

                <div className="dashboard-section" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Admission Status</span>
                    <CheckCircle2 size={20} style={{ color: '#10b981' }} />
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Active</h2>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block', marginTop: '0.5rem' }}>Admissions open for 2026</span>
                </div>
              </div>

              {/* LOGGED IN STUDENTS TABLE */}
              <div className="dashboard-section" style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0f172a' }}>Recent Logged-In Students</h3>
                
                {collegeLogs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
                    <Users size={36} style={{ marginBottom: '1rem' }} />
                    <p>No recent student login logs recorded for this university yet.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
                          <th style={{ padding: '1rem 0.5rem' }}>STUDENT NAME</th>
                          <th style={{ padding: '1rem 0.5rem' }}>EMAIL ADDRESS</th>
                          <th style={{ padding: '1rem 0.5rem' }}>LAST LOGIN</th>
                          <th style={{ padding: '1rem 0.5rem' }}>PREFERENCE</th>
                          <th style={{ padding: '1rem 0.5rem' }}>PORTAL STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {collegeLogs.map((log) => {
                          const sProfile = users.find(u => u.email === log.email);
                          return (
                            <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                              <td style={{ padding: '1rem 0.5rem', fontWeight: 700, color: '#0f172a' }}>{log.fullName}</td>
                              <td style={{ padding: '1rem 0.5rem', color: '#334155' }}>{log.email}</td>
                              <td style={{ padding: '1rem 0.5rem', color: '#64748b' }}>
                                {new Date(log.timestamp).toLocaleString()}
                              </td>
                              <td style={{ padding: '1rem 0.5rem', color: '#334155' }}>
                                {sProfile?.preferredCourse || 'Computer Science / Engineering'}
                              </td>
                              <td style={{ padding: '1rem 0.5rem' }}>
                                <span style={{
                                  padding: '0.25rem 0.6rem',
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  background: sProfile?.appStatus === 'Accepted' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                                  color: sProfile?.appStatus === 'Accepted' ? '#10b981' : '#f59e0b'
                                }}>
                                  {sProfile?.appStatus || 'Under Review'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* ADMISSION PROMOTION CARD (SAI UNIVERSITY SPOTLIGHT) */}
              <div className="dashboard-section" style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                borderRadius: '20px',
                padding: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2rem',
                flexWrap: 'wrap',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
              }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, color: '#10b981', marginBottom: '1rem' }}>
                    <Award size={12} />
                    <span>Featured Partner: Sai University</span>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, marginBottom: '0.5rem', color: '#0f172a' }}>A New Paradigm in Liberal Arts & Technology</h3>
                  <p style={{ color: '#334155', fontSize: '0.92rem', maxWidth: '650px', lineHeight: '1.5', margin: 0 }}>
                    Sai University (SaiU) in Chennai integrates law, computing, and liberal arts with guidance from global founders like N.R. Narayana Murthy. Now accepting applications for 2026.
                  </p>
                </div>
                <a href="https://saiuniversity.edu.in/" target="_blank" rel="noreferrer" className="btn-primary" style={{
                  background: '#10b981',
                  color: '#fff',
                  padding: '0.9rem 1.8rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 10px 20px rgba(16,185,129,0.15)'
                }}>
                  Explore University Profile
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: USER MANAGER (ADMIN ONLY) */}
          {activeTab === 'users' && role === 'admin' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{
                display: 'flex',
                gap: '1rem',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                padding: '0.75rem 1.25rem',
                borderRadius: '14px',
                maxWidth: '500px',
                alignItems: 'center'
              }}>
                <Search size={20} style={{ color: '#64748b' }} />
                <input 
                  type="text" 
                  placeholder="Search user email, name, or college..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#0f172a',
                    width: '100%',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div className="dashboard-section" style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Registered Users ({filteredUsers.length})</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Showing simulated and registered users</span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
                        <th style={{ padding: '1rem 0.5rem' }}>USER</th>
                        <th style={{ padding: '1rem 0.5rem' }}>ROLE</th>
                        <th style={{ padding: '1rem 0.5rem' }}>LINKED UNIVERSITY</th>
                        <th style={{ padding: '1rem 0.5rem' }}>LAST SESSION</th>
                        <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.fullName || 'Anonymous User'}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.email}</div>
                          </td>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            <span style={{
                              padding: '0.25rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              background: u.role === 'admin' ? 'rgba(239,68,68,0.1)' : u.role === 'college' ? 'rgba(16,185,129,0.1)' : '#f1f5f9',
                              color: u.role === 'admin' ? '#ef4444' : u.role === 'college' ? '#10b981' : '#334155'
                            }}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            {u.role === 'college' ? (
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>{u.collegeName}</span>
                                {u.collegeUrl && (
                                  <a href={u.collegeUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
                                    Link <ExternalLink size={10} />
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span style={{ color: '#64748b' }}>None</span>
                            )}
                          </td>
                          <td style={{ padding: '1rem 0.5rem', color: '#64748b' }}>
                            {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never logged in'}
                          </td>
                          <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                              <button 
                                onClick={() => {
                                  setEditingUser(u);
                                  setEditRole(u.role);
                                  setEditCollegeName(u.collegeName || '');
                                }}
                                style={{
                                  background: '#ffffff',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '8px',
                                  color: '#334155',
                                  padding: '0.4rem 0.8rem',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <Edit2 size={12} /> Edit Role
                              </button>
                              <button 
                                onClick={() => handleRemoveUserSimulated(u.email)}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.05)',
                                  border: '1px solid rgba(239, 68, 68, 0.15)',
                                  borderRadius: '8px',
                                  color: '#ef4444',
                                  padding: '0.4rem',
                                  cursor: 'pointer'
                                }}
                                title="Delete Simulated User"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* EDITING USER MODAL */}
              {editingUser && (
                <div style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(9, 13, 22, 0.4)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 100,
                  padding: '2rem'
                }}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '20px',
                      padding: '2.5rem',
                      width: '100%',
                      maxWidth: '450px',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>Update User Privileges</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                      Changing privileges for <strong style={{ color: '#0f172a' }}>{editingUser.fullName}</strong> ({editingUser.email})
                    </p>

                    <form onSubmit={handleUpdateRole} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>User Role</label>
                        <select 
                          value={editRole} 
                          onChange={(e) => setEditRole(e.target.value as any)}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            color: '#0f172a',
                            padding: '0.75rem',
                            borderRadius: '10px',
                            outline: 'none',
                            fontWeight: 600
                          }}
                        >
                          <option value="student">Student (Standard User)</option>
                          <option value="college">College Representative</option>
                          <option value="admin">System Admin</option>
                        </select>
                      </div>

                      {editRole === 'college' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Linked University</label>
                          <select 
                            value={editCollegeName} 
                            onChange={(e) => setEditCollegeName(e.target.value)}
                            required
                            style={{
                              background: '#ffffff',
                              border: '1px solid #e2e8f0',
                              color: '#0f172a',
                              padding: '0.75rem',
                              borderRadius: '10px',
                              outline: 'none',
                              fontWeight: 600
                            }}
                          >
                            <option value="">-- Choose University --</option>
                            {collegesDataRaw.map(c => (
                              <option key={c["University Name"]} value={c["University Name"]}>
                                {c["University Name"]}
                              </option>
                            ))}
                          </select>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Selecting this will automatically link the user to the official website URL.
                          </span>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button 
                          type="submit" 
                          style={{
                            flex: 1,
                            background: '#10b981',
                            color: '#fff',
                            border: 'none',
                            padding: '0.75rem',
                            borderRadius: '10px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Save Changes
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setEditingUser(null)}
                          style={{
                            flex: 1,
                            background: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            color: '#334155',
                            padding: '0.75rem',
                            borderRadius: '10px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SYSTEM AUDIT LOGS (ADMIN ONLY) */}
          {activeTab === 'logs' && role === 'admin' && (
            <div className="dashboard-section" style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0f172a' }}>Global Security Activity History</h3>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
                      <th style={{ padding: '1rem 0.5rem' }}>USER EMAIL</th>
                      <th style={{ padding: '1rem 0.5rem' }}>USER NAME</th>
                      <th style={{ padding: '1rem 0.5rem' }}>ROLE AT LOGIN</th>
                      <th style={{ padding: '1rem 0.5rem' }}>LINKED COLLEGE</th>
                      <th style={{ padding: '1rem 0.5rem' }}>EVENT TIMESTAMP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                        <td style={{ padding: '1rem 0.5rem', fontWeight: 700, color: '#0f172a' }}>{log.email}</td>
                        <td style={{ padding: '1rem 0.5rem', color: '#334155' }}>{log.fullName}</td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <span style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            background: log.role === 'admin' ? 'rgba(239,68,68,0.1)' : log.role === 'college' ? 'rgba(16,185,129,0.1)' : '#f1f5f9',
                            color: log.role === 'admin' ? '#ef4444' : log.role === 'college' ? '#10b981' : '#334155'
                          }}>
                            {log.role.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.5rem', color: '#334155' }}>{log.collegeName || <span style={{ color: '#64748b' }}>None</span>}</td>
                        <td style={{ padding: '1rem 0.5rem', color: '#64748b' }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
