'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, 
  Globe, 
  Mail, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  CheckCircle2,
  Users,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function GlobalFooter() {
  const pathname = usePathname();
  
  // Do not show footer on dashboard pages
  if (pathname?.startsWith('/dashboard')) return null;

  return (
    <footer className="premium-global-footer">
      {/* College Registration CTA Section */}
      <div className="footer-cta-section">
        <div className="cta-content glass-panel">
          <div className="cta-text">
            <div className="tag-line">
              <Building2 size={14} />
              <span>FOR INSTITUTIONS</span>
            </div>
            <h2>Are you a <span className="text-emerald">University Partner?</span></h2>
            <p>Join the UniSimplify ecosystem to streamline your admissions, reach high-intent applicants, and manage your university presence with data-driven insights.</p>
          </div>
          <div className="cta-action">
            <Link href="/register-college" className="btn-primary-large">
              Register Your College
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-main-content">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="nav-logo">
              <div className="logo-icon">
                <Sparkles size={20} fill="#fff" />
              </div>
              <span>UniSimplify</span>
            </Link>
            <p className="brand-description">
              The universal admission layer for Indian higher education. Build your profile once, apply to India's top universities in seconds.
            </p>
            <div className="social-links">
              <Link href="#"><Globe size={20} /></Link>
              <Link href="#"><Mail size={20} /></Link>
              <Link href="#"><Users size={20} /></Link>
            </div>
          </div>

          <div className="footer-links-group">
            <h3>Platform</h3>
            <Link href="/discover">Find Colleges</Link>
            <Link href="/universities">University Rankings</Link>
            <Link href="/auth?mode=signup">Create Profile</Link>
            <Link href="/dashboard">Student Dashboard</Link>
          </div>

          <div className="footer-links-group">
            <h3>Support</h3>
            <Link href="/contact">Contact Us</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/onboarding">How it Works</Link>
          </div>

          <div className="footer-newsletter">
            <h3>Stay Updated</h3>
            <p>Get the latest admission alerts and deadline reminders.</p>
            <div className="newsletter-input">
              <input type="email" placeholder="Your email address" />
              <button><ArrowRight size={18} /></button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-badges">
            <div className="badge-item">
              <ShieldCheck size={14} />
              <span>AES-256 Encrypted</span>
            </div>
            <div className="badge-item">
              <CheckCircle2 size={14} />
              <span>Official University Partner</span>
            </div>
          </div>
          <p className="copyright">
            &copy; {new Date().getFullYear()} UniSimplify. Built with ❤️ for Indian Students.
          </p>
        </div>
      </div>
    </footer>
  );
}
