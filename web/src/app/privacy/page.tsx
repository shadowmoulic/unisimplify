'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
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
            <ShieldCheck size={14} />
            <span>Privacy First</span>
          </div>
          <h1>Privacy Policy</h1>
          <p>Last updated: May 10, 2026</p>
        </motion.div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="policy-content"
      >
        <h2>1. Information We Collect</h2>
        <p>
          To provide the UniSimplify experience, we collect information you provide directly to us:
        </p>
        <ul>
          <li>Personal details (Name, Date of Birth, Gender)</li>
          <li>Academic records (Marksheets, Entrance Exam Scores)</li>
          <li>Contact information (Email, Phone Number)</li>
          <li>Identity documents required for college applications</li>
        </ul>

        <h2>2. How We Use Your Data</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Build your Universal Profile for college applications</li>
          <li>Facilitate the submission of applications to universities</li>
          <li>Provide personalized college recommendations</li>
          <li>Communicate admission updates and deadlines</li>
        </ul>

        <h2>3. Data Sharing and Security</h2>
        <p>
          Your data is **only** shared with universities that you explicitly choose to apply to. We use bank-grade encryption (AES-256) to protect your sensitive documents. We never sell your data to third-party advertisers.
        </p>

        <h2>4. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your information at any time through your UniSimplify Dashboard. For permanent account deletion, please contact our support team.
        </p>
      </motion.div>
    </div>
  );
}
