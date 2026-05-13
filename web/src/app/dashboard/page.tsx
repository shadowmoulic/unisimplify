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
  const [searchQuery, setSearchQuery] = useState('');

  const allFaqs = [
    { q: "Is UniSimplify really free?", a: "Yes! It's 100% free for students. We don't charge any platform fees for your Universal Profile or discovery." },
    { q: "How can I add a college to My colleges?", a: "To add a college, go to the Discover page, search for your university, and click 'Add to List'." },
    { q: "Can I change my answers after submitting?", a: "Most universities allow minor corrections before the deadline. Contact our support for specific cases." },
    { q: "Is my data secure?", a: "We use bank-grade AES-256 encryption to protect your documents and personal information." },
    { q: "What is a Universal Profile?", a: "A single profile that contains all your academic and personal details, used to apply to multiple colleges instantly." },
    { q: "How do I track my applications?", a: "Your Dashboard shows a live status of all your applications and upcoming deadlines." },
    { q: "Do I need to upload documents every time?", a: "No! Upload them once to your Universal Profile, and they will be reused for all your applications." },
    { q: "Are the college deadlines accurate?", a: "Yes, we sync directly with university admission portals to provide real-time deadline updates." },
    { q: "What if my college isn't listed?", a: "We're constantly adding new institutions. You can suggest a college through our contact form." },
    { q: "Can I apply to international universities?", a: "Currently, we focus on top Indian universities, but international expansion is in our roadmap!" },
    { q: "Is there a limit to how many colleges I can add?", a: "There's no limit! Add as many as you're interested in to your 'My Colleges' list." },
    { q: "What is the CUET Acceptance Policy?", a: "It varies by university. Check the 'Discovery' page for specific CUET policies for each college." },
    { q: "How do I reset my password?", a: "Go to Settings > Security to send a password reset link to your registered email." },
    { q: "Can I use UniSimplify on mobile?", a: "Yes, our platform is fully responsive and optimized for mobile devices." },
    { q: "How do I contact support?", a: "You can reach out via the 'Contact' page or email us at support@unisimplify.in." }
  ];

  const filteredFaqs = allFaqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <p className="support-intro-text" style={{ fontSize: '0.85rem', color: '#64748b', padding: '0 1.5rem', marginBottom: '1.5rem', fontWeight: 600, lineHeight: '1.4' }}>
          We are your dedicated admission partners. If you're stuck or have questions, we're the types to stay with you until it's solved—all for free.
        </p>

        <div className="support-search">
          <label>Search FAQs</label>
          <div className="search-box">
            <input 
              type="text" 
              placeholder="How do I..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn"><SearchIcon size={18} /></button>
          </div>
          <p className="search-hint">Search {allFaqs.length} curated questions</p>
        </div>

        <div className="faq-list">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div className="faq-q">
                  <span>{faq.q}</span>
                </div>
                <div className="faq-a">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', marginTop: '2rem' }}>
              No matching questions found.
            </p>
          )}
        </div>
      </aside>

    </>
  );
}
