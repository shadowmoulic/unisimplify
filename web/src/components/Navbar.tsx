'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutDashboard, LogIn, LogOut, User, Menu, X, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import LoginModal from './LoginModal';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }


  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className={`navbar-premium ${scrolled ? 'scrolled' : ''}`}>
      
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <div className="logo-icon">
            <Sparkles size={20} fill="#fff" />
          </div>
          <span>UniSimplify</span>
        </Link>

        <div className="nav-links desktop-only">
          <Link href="/discover" className="nav-link">
            <Search size={18} />
            Discover
          </Link>
          {user && (
            <Link href="/dashboard" className="nav-link">
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          )}
        </div>

        <div className="nav-actions desktop-only">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link href="/dashboard" className="btn-nav-login" style={{ background: '#10b981', color: '#fff', border: 'none' }}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <button onClick={handleSignOut} className="btn-icon" title="Sign Out" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer' }}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/auth" className="btn-nav-login">
              <LogIn size={18} />
              Login
            </Link>
          )}
        </div>

        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu glass-panel"
          >
            <Link href="/discover" onClick={() => setMobileMenuOpen(false)}>Discover</Link>
            {user && <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>}
            {!user && <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>Login</Link>}
            {user && <button onClick={handleSignOut}>Sign Out</button>}
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
}
