'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
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
            <FileText size={14} />
            <span>Legal Agreement</span>
          </div>
          <h1>Terms of Service</h1>
          <p>Last updated: May 10, 2026</p>
        </motion.div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="policy-content"
      >
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using UniSimplify, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use the service.
        </p>

        <h2>2. Use of the Platform</h2>
        <p>
          UniSimplify provides a utility for students to simplify the college application process. You agree to:
        </p>
        <ul>
          <li>Provide accurate and truthful information in your profile</li>
          <li>Use the platform only for legitimate admission purposes</li>
          <li>Not share your account credentials with others</li>
        </ul>

        <h2>3. University Applications</h2>
        <p>
          UniSimplify acts as a facilitator. Submission of an application through UniSimplify does not guarantee admission. Final admission decisions are made solely by the respective universities. You are responsible for paying any required university application fees.
        </p>

        <h2>4. Limitation of Liability</h2>
        <p>
          UniSimplify is not responsible for errors in university admission portals, deadline changes by universities, or any decisions made by the institutions. We provide the tool to simplify your process "as is."
        </p>

        <h2>5. Changes to Terms</h2>
        <p>
          We may update these terms from time to time. Your continued use of the platform after changes are posted constitutes your acceptance of the new terms.
        </p>
      </motion.div>
    </div>
  );
}
