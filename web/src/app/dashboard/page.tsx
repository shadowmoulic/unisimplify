'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Building2, 
  Search, 
  ShieldCheck, 
  BadgeIndianRupee, 
  Settings, 
  LogOut, 
  User,
  Users,
  GraduationCap,
  Sparkles,
  ChevronRight,
  HelpCircle,
  Search as SearchIcon,
  CheckCircle2,
  CircleDashed
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState({
    completedSections: 0,
    totalSections: 5,
    collegesCount: 0,
    completionPercentage: 0
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
      } else {
        setUser(session.user);
        
        let savedCount = 0;
        const savedNames = localStorage.getItem(`saved_colleges_${session.user.id}`);
        if (savedNames) {
          const namesArray = JSON.parse(savedNames);
          savedCount = namesArray.length;
        }

        setProfileData(prev => ({
          ...prev,
          collegesCount: savedCount
        }));

        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

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

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>

      {/* MAIN CONTENT */}
      <main className="portal-main">
        <header className="main-header-banner">
          <div className="banner-content">
            <div className="banner-text">
              <h1>{getGreeting()}, {userName}!</h1>
            </div>
            <div className="banner-illustration">
              <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="160" cy="40" r="20" fill="#dcfce7" />
                <path d="M40 100C40 100 60 60 100 60C140 60 160 100 160 100" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 90C20 90 40 70 60 75" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </header>

        <div className="dashboard-content-area">
          <h2 className="page-title">Dashboard</h2>

          <section className="dashboard-section glass-panel">
            <div className="section-header-collapsible">
              <div className="s-title">
                <ChevronRight size={20} className="rotate-90" />
                <h3>My UniSimplify Application</h3>
              </div>
            </div>
            
            <div className="section-body">
              <div className="progress-container">
                <div className="progress-label">
                  <span className="text-red">{profileData.completedSections}/{profileData.totalSections} sections complete</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill red" style={{ width: `${(profileData.completedSections/profileData.totalSections)*100}%` }}></div>
                </div>
              </div>

              <div className="icons-row">
                {[
                  { id: 'personal', label: 'Personal Details', icon: <User size={24} /> },
                  { id: 'academic', label: 'Academic Details', icon: <GraduationCap size={24} /> },
                  { id: 'exams', label: 'Entrance Exams', icon: <FileText size={24} /> },
                  { id: 'documents', label: 'Documents', icon: <ShieldCheck size={24} /> },
                  { id: 'preferences', label: 'Preferences', icon: <Settings size={24} /> }
                ].map(item => (
                  <div key={item.id} className="icon-item incomplete">
                    <div className="i-circle">
                      <CircleDashed size={20} />
                    </div>
                    <span className="i-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="dashboard-section glass-panel">
            <div className="section-header-collapsible">
              <div className="s-title">
                <ChevronRight size={20} className="rotate-90" />
                <h3>My Colleges</h3>
              </div>
            </div>
            <div className="section-body">
               <div className="progress-container">
                <div className="progress-label">
                  <span className="text-red">{profileData.collegesCount} colleges on my list</span>
                </div>
                <div className="progress-track empty">
                </div>
                <p className="empty-text">0 in progress</p>
              </div>
              <Link href="/dashboard/colleges" className="show-colleges-btn" style={{ textDecoration: 'none' }}>
                <ChevronRight size={16} />
                Show colleges
              </Link>
            </div>
          </section>

          <section className="dashboard-section no-border">
            <h3>Deadlines</h3>
            <p className="subtext">To set deadlines, go to the application questions for each college on your list and select a term and admission plan.</p>
          </section>
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="portal-support">
        <div className="support-header">
          <HelpCircle size={20} />
          <h3>Help & support</h3>
        </div>

        <div className="support-search">
          <label>Search FAQs</label>
          <div className="search-box">
            <input type="text" placeholder="" />
            <button className="search-btn"><SearchIcon size={18} /></button>
          </div>
          <p className="search-hint">Search takes you to the student solution center</p>
        </div>

        <div className="faq-list">
          <div className="faq-item">
            <div className="faq-q">
              <span>How can I add a college to My colleges?</span>
            </div>
            <div className="faq-a">
              <p>To add a college to your account: Select <strong>College search</strong> from...</p>
              <button className="read-more">
                <ChevronRight size={14} />
                Read full answer
              </button>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-q">
              <span>I already submitted, can I change some of my answers?</span>
            </div>
            <div className="faq-a">
              <button className="read-more">
                <ChevronRight size={14} />
                Read full answer
              </button>
            </div>
          </div>
        </div>
      </aside>

    </>
  );
}
