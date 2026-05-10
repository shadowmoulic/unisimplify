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
  ShieldCheck
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
            <ShieldCheck size={48} />
          </div>
          <h1>Application Received!</h1>
          <p>Thank you for reaching out. Our partnerships team will review your university's details and get back to you within 48 hours to finalize the integration.</p>
          <Link href="/" className="btn-primary-large" style={{ marginTop: '2rem' }}>
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="register-college-page">
      <div className="bg-noise" />
      <div className="radial-glow" style={{ opacity: 0.3 }} />
      
      <div className="register-content">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="register-header"
        >
          <div className="tag-line">
            <Building2 size={14} />
            <span>UNIVERSITY PARTNERSHIP</span>
          </div>
          <h1>List Your Institution on <span className="text-emerald">UniSimplify</span></h1>
          <p>Join India's fastest growing university discovery platform and connect with a growing network of active applicants.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="register-form-container glass-panel"
        >
          <form onSubmit={handleSubmit} className="premium-form">
            <div className="form-grid">
              <div className="form-group">
                <label><Building2 size={16} /> University Name</label>
                <input type="text" placeholder="e.g. Ashoka University" required />
              </div>
              <div className="form-group">
                <label><Globe size={16} /> Official Website URL</label>
                <input type="url" placeholder="https://university.edu.in" required />
              </div>
              <div className="form-group">
                <label><Calendar size={16} /> Next Application Deadline</label>
                <input type="text" placeholder="e.g. June 15, 2026" required />
              </div>
              <div className="form-group">
                <label><CreditCard size={16} /> Average Annual Fees (INR)</label>
                <input type="text" placeholder="e.g. 4,50,000 - 6,00,000" required />
              </div>
              <div className="form-group">
                <label><BookOpen size={16} /> Entrance Exam (if any)</label>
                <input type="text" placeholder="e.g. BITSAT, MET, or None" required />
              </div>
              <div className="form-group">
                <label><Sparkles size={16} /> Major Program Types</label>
                <input type="text" placeholder="e.g. Engineering, Liberal Arts, Medical" required />
              </div>
            </div>

            <div className="form-group full-width" style={{ marginTop: '1.5rem' }}>
              <label>Additional Partnership Notes</label>
              <textarea placeholder="Tell us about your campus, rankings, or specific admission requirements..."></textarea>
            </div>

            <button type="submit" className="btn-primary-large full-width">
              Submit Registration Application
              <Send size={20} />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
