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

      // Load data
      setUsers(getSimulatedUsers());
      setLogs(getLoginLogs());
      setLoading(false);
      
      // Track session login
      logLogin(user.email || '', user.user_metadata?.full_name || user.email?.split('@')[0] || 'User', userRole, uCollege);
    };
    
    checkAuth();
  }, [router]);

  const refreshData = () => {
    setUsers(getSimulatedUsers());
    setLogs(getLoginLogs());
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
      <div className="loading-screen" style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', background: '#090d16', color: '#fff' }}>
        <div className="loader"></div>
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
        background: '#090d16',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="bg-noise" style={{ opacity: 0.1, position: 'absolute', inset: 0, backgroundImage: 'url("/images/noise.png")' }} />
        <div className="radial-glow" style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', top: '20%', left: '30%', zIndex: 0 }} />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="denied-card glass-panel"
          style={{
            maxWidth: '550px',
            background: 'rgba(17, 24, 39, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
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
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            marginBottom: '2rem'
          }}>
            <Lock size={36} />
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            College Privileges Required
          </h1>
          
          <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Your account is currently registered as a standard student profile. Standard profiles are restricted from accessing university portals.
          </p>

          <div style={{
            background: 'rgba(16, 185, 129, 0.06)',
            border: '1px solid rgba(16, 185, 129, 0.15)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <h3 style={{ color: '#10b981', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Mail size={16} /> Are you a college official?
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: 0, lineHeight: '1.5' }}>
              Please send us a DM with official proof of association at <strong style={{ color: '#fff' }}>sayak@kgphustlehouse.com</strong>, and our admins will instantly upgrade your account.
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
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
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
    <div className="dashboard-root" style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#090d16',
      color: '#f8fafc',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Sidebar Navigation */}
      <aside style={{
        width: '260px',
        background: '#0d1321',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Sparkles size={20} fill="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>UniSimplify</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {role === 'college' ? (
              <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16,185,129,0.15)', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Partner Portal</span>
                <strong style={{ fontSize: '0.88rem', color: '#fff', display: 'block' }}>{collegeName}</strong>
                {collegeUrl && (
                  <a href={collegeUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                    Visit Website <ExternalLink size={10} />
                  </a>
                )}
              </div>
            ) : (
              <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.15)', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', display: 'block' }}>System Admin</span>
                <strong style={{ fontSize: '0.88rem', color: '#fff' }}>Superuser Privileges</strong>
              </div>
            )}

            <button 
              onClick={() => setActiveTab('overview')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'overview' ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                color: activeTab === 'overview' ? '#fff' : '#94a3b8',
                fontWeight: 600,
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
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.8rem 1rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: activeTab === 'users' ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                    color: activeTab === 'users' ? '#fff' : '#94a3b8',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Users size={18} />
                  <span>User Manager</span>
                </button>

                <button 
                  onClick={() => setActiveTab('logs')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.8rem 1rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: activeTab === 'logs' ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                    color: activeTab === 'logs' ? '#fff' : '#94a3b8',
                    fontWeight: 600,
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

        <div style={{ marginTop: 'auto' }}>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.8rem 1rem',
            borderRadius: '10px',
            color: '#94a3b8',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            <Home size={18} />
            <span>Go to Home</span>
          </Link>
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/');
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.8rem 1rem',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              color: '#ef4444',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '0.9rem'
            }}
          >
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        padding: '2.5rem',
        overflowY: 'auto',
        background: '#090d16'
      }}>
        {/* TOP HEADER */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          paddingBottom: '1.5rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
              {activeTab === 'overview' && `${targetedCollege} Dashboard`}
              {activeTab === 'users' && 'System User Management'}
              {activeTab === 'logs' && 'Global Activity Logs'}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '0.25rem', margin: 0 }}>
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
              background: '#0d1321',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '0.5rem 1rem'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1' }}>System Status: Active</span>
            </div>
          </div>
        </header>

        {/* TAB 1: OVERVIEW / COLLEGE REPRESENTATIVE DASHBOARD */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* METRIC CARD GRID */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem'
            }}>
              <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Total Student Logins</span>
                  <Activity size={20} className="text-emerald" style={{ color: '#10b981' }} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{collegeLogs.length}</h2>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, display: 'block', marginTop: '0.5rem' }}>+12% vs last week</span>
              </div>

              <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Active Applications</span>
                  <Users size={20} style={{ color: '#3b82f6' }} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{collegeStudents.length}</h2>
                <span style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600, display: 'block', marginTop: '0.5rem' }}>Universal Profile sync ok</span>
              </div>

              <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Admission Status</span>
                  <CheckCircle2 size={20} style={{ color: '#10b981' }} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Active</h2>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginTop: '0.5rem' }}>Admissions open for 2026</span>
              </div>
            </div>

            {/* LOGGED IN STUDENTS TABLE */}
            <div className="glass-panel" style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '20px',
              padding: '2rem'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Recent Logged-In Students</h3>
              
              {collegeLogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
                  <Users size={36} style={{ marginBottom: '1rem' }} />
                  <p>No recent student login logs recorded for this university yet.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700 }}>
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
                          <tr key={log.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', fontSize: '0.9rem' }}>
                            <td style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>{log.fullName}</td>
                            <td style={{ padding: '1rem 0.5rem', color: '#cbd5e1' }}>{log.email}</td>
                            <td style={{ padding: '1rem 0.5rem', color: '#94a3b8' }}>
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td style={{ padding: '1rem 0.5rem', color: '#cbd5e1' }}>
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
            <div className="glass-panel" style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              borderRadius: '20px',
              padding: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              flexWrap: 'wrap'
            }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, color: '#10b981', marginBottom: '1rem' }}>
                  <Award size={12} />
                  <span>Featured Partner: Sai University</span>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, marginBottom: '0.5rem' }}>A New Paradigm in Liberal Arts & Technology</h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.92rem', maxWidth: '650px', lineHeight: '1.5', margin: 0 }}>
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
              background: '#0d1321',
              border: '1px solid rgba(255,255,255,0.06)',
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
                  color: '#fff',
                  width: '100%',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            <div className="glass-panel" style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '20px',
              padding: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Registered Users ({filteredUsers.length})</h3>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Showing simulated and registered users</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700 }}>
                      <th style={{ padding: '1rem 0.5rem' }}>USER</th>
                      <th style={{ padding: '1rem 0.5rem' }}>ROLE</th>
                      <th style={{ padding: '1rem 0.5rem' }}>LINKED UNIVERSITY</th>
                      <th style={{ padding: '1rem 0.5rem' }}>LAST SESSION</th>
                      <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', fontSize: '0.9rem' }}>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <div style={{ fontWeight: 700 }}>{u.fullName || 'Anonymous User'}</div>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{u.email}</div>
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <span style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            background: u.role === 'admin' ? 'rgba(239,68,68,0.1)' : u.role === 'college' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.06)',
                            color: u.role === 'admin' ? '#ef4444' : u.role === 'college' ? '#10b981' : '#cbd5e1'
                          }}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          {u.role === 'college' ? (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 600, color: '#fff' }}>{u.collegeName}</span>
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
                        <td style={{ padding: '1rem 0.5rem', color: '#94a3b8' }}>
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
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '8px',
                                color: '#fff',
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
                background: 'rgba(9, 13, 22, 0.85)',
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
                  className="glass-panel"
                  style={{
                    background: '#0d1321',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    padding: '2.5rem',
                    width: '100%',
                    maxWidth: '450px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Update User Privileges</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Changing privileges for <strong style={{ color: '#fff' }}>{editingUser.fullName}</strong> ({editingUser.email})
                  </p>

                  <form onSubmit={handleUpdateRole} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1' }}>User Role</label>
                      <select 
                        value={editRole} 
                        onChange={(e) => setEditRole(e.target.value as any)}
                        style={{
                          background: '#090d16',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#fff',
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
                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1' }}>Linked University</label>
                        <select 
                          value={editCollegeName} 
                          onChange={(e) => setEditCollegeName(e.target.value)}
                          required
                          style={{
                            background: '#090d16',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: '#fff',
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
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
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
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
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
          <div className="glass-panel" style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '20px',
            padding: '2rem'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Global Security Activity History</h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700 }}>
                    <th style={{ padding: '1rem 0.5rem' }}>USER EMAIL</th>
                    <th style={{ padding: '1rem 0.5rem' }}>USER NAME</th>
                    <th style={{ padding: '1rem 0.5rem' }}>ROLE AT LOGIN</th>
                    <th style={{ padding: '1rem 0.5rem' }}>LINKED COLLEGE</th>
                    <th style={{ padding: '1rem 0.5rem' }}>EVENT TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', fontSize: '0.9rem' }}>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>{log.email}</td>
                      <td style={{ padding: '1rem 0.5rem', color: '#cbd5e1' }}>{log.fullName}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          background: log.role === 'admin' ? 'rgba(239,68,68,0.1)' : log.role === 'college' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.06)',
                          color: log.role === 'admin' ? '#ef4444' : log.role === 'college' ? '#10b981' : '#cbd5e1'
                        }}>
                          {log.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem', color: '#cbd5e1' }}>{log.collegeName || <span style={{ color: '#64748b' }}>None</span>}</td>
                      <td style={{ padding: '1rem 0.5rem', color: '#94a3b8' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
