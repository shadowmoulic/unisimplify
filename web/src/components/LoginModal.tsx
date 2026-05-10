'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/utils/supabase';
import { X, Sparkles } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="modal-content glass-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>

          <div className="modal-header">
            <div className="logo-icon">U</div>
            <h2>Welcome to <span className="text-gradient">UniSimplify</span></h2>
            <p>Your universal gateway to Indian Universities.</p>
          </div>

          <div className="auth-wrapper">
            <Auth
              supabaseClient={supabase}
              appearance={{ 
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#6366f1',
                      brandAccent: '#4f46e5',
                      inputBackground: 'rgba(255, 255, 255, 0.05)',
                      inputText: 'white',
                      inputPlaceholder: '#94a3b8',
                      inputBorder: 'rgba(255, 255, 255, 0.1)',
                    }
                  }
                }
              }}
              theme="dark"
              providers={['google']}
              redirectTo={`${window.location.origin}/dashboard`}
            />
          </div>

          <div className="modal-footer">
            <Sparkles size={14} className="text-primary" />
            <span>Secure, Standardized, and Free Forever</span>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .modal-content {
          width: 100%;
          max-width: 450px;
          padding: 3rem;
          border-radius: 32px;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .close-btn:hover { color: #fff; }

        .modal-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-weight: 800;
          font-size: 1.5rem;
          color: #fff;
        }

        .modal-header h2 {
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .modal-header p {
          color: #94a3b8;
          font-size: 0.95rem;
        }

        .auth-wrapper {
          margin-bottom: 2rem;
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 600;
        }
      `}</style>
    </AnimatePresence>
  );
}
