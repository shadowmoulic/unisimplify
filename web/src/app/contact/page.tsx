'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ContactUs() {
  return (
    <div className="policy-container">
      <Link href="/" className="btn-icon" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontWeight: 700 }}>
        <ArrowLeft size={18} />
        Back to Home
      </Link>
      
      <header className="policy-header">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="badge" style={{ margin: '0 auto 1.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <MessageSquare size={14} />
            <span>Support Center</span>
          </div>
          <h1>Get in Touch</h1>
          <p>We&apos;re here to help you simplify your admission journey.</p>
        </motion.div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="policy-content"
          style={{ padding: '2rem' }}
        >
          <h2 style={{ marginTop: 0 }}>Contact Info</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.75rem', borderRadius: '12px' }}>
                <Mail size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>Email</div>
                <div style={{ color: '#64748b' }}>support@unisimplify.in</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.75rem', borderRadius: '12px' }}>
                <MapPin size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>Office</div>
                <div style={{ color: '#64748b' }}>Gurugram, Haryana, India</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="policy-content"
          style={{ padding: '2rem' }}
        >
          <h2 style={{ marginTop: 0 }}>Send a Message</h2>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your name" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea rows={4} placeholder="How can we help?" />
            </div>
            <button className="btn-primary-large" style={{ width: '100%', justifyContent: 'center' }}>
              Send Message
              <Send size={18} />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
