'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, RefreshCcw, CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage('Password updated successfully!');
      setTimeout(() => router.push('/auth'), 2000);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="bg-noise" aria-hidden />
      <div className="radial-glow" style={{ opacity: 0.4 }} aria-hidden />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="auth-card"
      >
        <div className="auth-header">
          <h1>New Password</h1>
          <p>Create a strong password for your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && (
          <div className="success-message" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
            <CheckCircle2 size={24} />
            {message}
          </div>
        )}

        {!message && (
          <form className="auth-form" onSubmit={handleReset}>
            <div className="auth-input-group">
              <label>New Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="auth-btn-primary" disabled={loading}>
              {loading ? <RefreshCcw className="animate-spin" size={20} /> : (
                <>
                  Update Password
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
