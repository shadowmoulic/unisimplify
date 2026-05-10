'use client';

import React, { useEffect, useState } from 'react';
import { 
  Home, 
  FileText, 
  Building2, 
  Search, 
  Settings, 
  LogOut 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import './dashboard.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
      } else {
        setUser(session.user);
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

  return (
    <div className="portal-layout">
      {/* LEFT SIDEBAR */}
      <aside className="portal-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="brand-text">UniSimplify</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <Link href="/dashboard" className={`nav-item ${pathname === '/dashboard' ? 'active' : ''}`}>
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
          </div>

          <div className="nav-group">
            <span className="group-label">APPLY</span>
            <Link href="/dashboard/common-app" className={`nav-item ${pathname === '/dashboard/common-app' ? 'active' : ''}`}>
              <FileText size={20} />
              <span>My UniSimplify Application</span>
            </Link>
            <Link href="/dashboard/colleges" className={`nav-item ${pathname === '/dashboard/colleges' ? 'active' : ''}`}>
              <Building2 size={20} />
              <span>My Colleges</span>
            </Link>
          </div>

          <div className="nav-group">
            <span className="group-label">EXPLORE</span>
            <Link href="/discover" className={`nav-item ${pathname === '/discover' ? 'active' : ''}`}>
              <Search size={20} />
              <span>College Search</span>
            </Link>
          </div>
        </nav>

        <div className="sidebar-footer">
          <Link href="/dashboard/settings" className={`nav-item ${pathname === '/dashboard/settings' ? 'active' : ''}`}>
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          <button onClick={handleSignOut} className="nav-item text-red" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <LogOut size={20} />
            <span>Sign out</span>
          </button>
          
          <div className="user-card-mini">
            <div className="user-avatar">
              {userName.charAt(0)}
            </div>
            <div className="user-details">
              <span className="u-name">{userName}</span>
              <span className="u-email">{user?.email}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      {children}
    </div>
  );
}
