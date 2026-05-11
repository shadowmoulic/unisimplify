'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Globe, 
  Calendar, 
  CreditCard, 
  BookOpen, 
  Send, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Target
} from 'lucide-react';
import Link from 'next/link';

export default function RegisterCollege() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="register-success-container">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="success-card glass-panel"
        >
          <div className="success-icon">
            <CheckCircle2 size={48} />
          </div>
          <h1>Application Received!</h1>
          <p>Thank you for your interest in joining the UniSimplify network. Our institutional partnerships team will review your details and reach out within 48 hours.</p>
          <Link href="/" className="btn-primary-large" style={{ marginTop: '2rem' }}>
            Return to Homepage
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="register-college-page premium-bg">
      <div className="bg-noise" />
      <div className="radial-glow" />
      
      <div className="register-content">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="register-header"
        >
          <div className="badge-premium">
            <Building2 size={14} />
            <span>INSTITUTIONAL PARTNERSHIP</span>
          </div>
          <h1>Empower Your <span className="text-emerald">Admissions Ecosystem.</span></h1>
          <p>Join India's most advanced university discovery platform. Reach high-intent students and streamline your application pipeline with data-driven precision.</p>
          
          <div className="stats-row-mini desktop-only">
            <div className="s-mini-item">
              <Users size={18} />
              <span>50k+ Active Students</span>
            </div>
            <div className="s-mini-item">
              <Target size={18} />
              <span>98% High-Intent Leads</span>
            </div>
            <div className="s-mini-item">
              <Sparkles size={18} />
              <span>AI-Powered Matching</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="register-form-container glass-panel-dark"
        >
          <div className="form-header-box">
            <h3>Institution Registration</h3>
            <p>Please provide your university details for our verification team.</p>
          </div>

          <form onSubmit={handleSubmit} className="premium-form-v2">
            <div className="form-grid-v2">
              <div className="form-group-v2">
                <label>University Name</label>
                <div className="input-wrapper-v2">
                  <Building2 size={18} />
                  <input type="text" placeholder="e.g. Ashoka University" required />
                </div>
              </div>
              <div className="form-group-v2">
                <label>Official Website</label>
                <div className="input-wrapper-v2">
                  <Globe size={18} />
                  <input type="url" placeholder="https://university.edu.in" required />
                </div>
              </div>
              <div className="form-group-v2">
                <label>Admission Deadline</label>
                <div className="input-wrapper-v2">
                  <Calendar size={18} />
                  <input type="text" placeholder="e.g. June 15, 2026" required />
                </div>
              </div>
              <div className="form-group-v2">
                <label>Avg. Annual Fees (INR)</label>
                <div className="input-wrapper-v2">
                  <CreditCard size={18} />
                  <input type="text" placeholder="e.g. 4,50,000 - 6,00,000" required />
                </div>
              </div>
              <div className="form-group-v2">
                <label>Primary Entrance Exam</label>
                <div className="input-wrapper-v2">
                  <BookOpen size={18} />
                  <input type="text" placeholder="e.g. BITSAT, CUET, or None" required />
                </div>
              </div>
              <div className="form-group-v2">
                <label>Contact Email (Institutional)</label>
                <div className="input-wrapper-v2">
                  <Send size={18} />
                  <input type="email" placeholder="admissions@university.edu.in" required />
                </div>
              </div>
            </div>

            <div className="form-group-v2 full-width" style={{ marginTop: '1.5rem' }}>
              <label>Institutional Narrative & Rankings</label>
              <textarea placeholder="Describe your campus culture, NIRF rankings, or specific admission requirements..."></textarea>
            </div>

            <div className="privacy-consent">
              <ShieldCheck size={16} />
              <span>By submitting, you agree to our <Link href="/terms">Partnership Terms</Link> and data processing protocols.</span>
            </div>

            <button type="submit" className="btn-submit-premium">
              Initialize Partnership Request
              <ArrowRight size={20} />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
