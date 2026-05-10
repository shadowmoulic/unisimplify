'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Sparkles, ShieldCheck, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type AuthMode = 'login' | 'signup' | 'forgot-password';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push('/dashboard');
    };
    checkSession();

    const initialMode = searchParams.get('mode') as AuthMode;
    if (initialMode && ['login', 'signup', 'forgot-password'].includes(initialMode)) {
      setMode(initialMode);
    }
  }, [searchParams, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      console.log(`Attempting ${mode} for:`, email);
      if (mode === 'login') {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        console.log('Login successful:', data.user?.id);
        router.push('/dashboard');
      } else if (mode === 'signup') {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
        console.log('Signup initiated:', data.user?.id);
        
        if (data.session) {
          // If auto-confirm is enabled in Supabase
          router.push('/dashboard');
        } else {
          setMessage('Check your email to confirm your account and start your journey!');
        }
      } else if (mode === 'forgot-password') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });
        if (error) throw error;
        setMessage('Password reset link sent to your email!');
      }
    } catch (err: any) {
      console.error(`${mode} error:`, err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -20 }
  };

  const formVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="bg-noise" aria-hidden />
      <div className="radial-glow" style={{ opacity: 0.4 }} aria-hidden />

      <Link href="/" className="nav-logo" style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
        <div className="logo-icon">
          <Sparkles size={20} fill="#fff" />
        </div>
        <span>UniSimplify</span>
      </Link>

      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="auth-card"
      >
        <AnimatePresence mode="wait">
          {mode === 'login' && (
            <motion.div 
              key="login"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="auth-header">
                <h1>Welcome Back</h1>
                <p>Login to manage your college applications</p>
              </div>

              {error && <div className="error-message">{error}</div>}
              {message && <div className="success-message">{message}</div>}

              <form className="auth-form" onSubmit={handleAuth}>
                <div className="auth-input-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="auth-input-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>Password</label>
                    <span 
                      className="auth-link" 
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setMode('forgot-password')}
                    >
                      Forgot?
                    </span>
                  </div>
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
                      Sign In
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              <div className="auth-footer-links">
                <p className="auth-link" onClick={() => setMode('signup')}>
                  Don&apos;t have an account? <span>Sign Up</span>
                </p>
              </div>
            </motion.div>
          )}

          {mode === 'signup' && (
            <motion.div 
              key="signup"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="auth-header">
                <h1>Create Account</h1>
                <p>Start your universal application journey today</p>
              </div>

              {error && <div className="error-message">{error}</div>}
              {message && <div className="success-message">{message}</div>}

              <form className="auth-form" onSubmit={handleAuth}>
                <div className="auth-input-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Sayak..." 
                    required 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="auth-input-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="auth-input-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    placeholder="Create a strong password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button className="auth-btn-primary" disabled={loading}>
                  {loading ? <RefreshCcw className="animate-spin" size={20} /> : (
                    <>
                      Create Profile
                      <Sparkles size={20} />
                    </>
                  )}
                </button>
              </form>

              <div className="auth-footer-links">
                <p className="auth-link" onClick={() => setMode('login')}>
                  Already have an account? <span>Sign In</span>
                </p>
              </div>
            </motion.div>
          )}

          {mode === 'forgot-password' && (
            <motion.div 
              key="forgot"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="auth-header">
                <h1>Reset Password</h1>
                <p>We&apos;ll send you a link to get back into your account</p>
              </div>

              {error && <div className="error-message">{error}</div>}
              {message && (
                <div className="success-message" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                  <CheckCircle2 size={24} />
                  {message}
                </div>
              )}

              <form className="auth-form" onSubmit={handleAuth}>
                <div className="auth-input-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button className="auth-btn-primary" disabled={loading}>
                  {loading ? <RefreshCcw className="animate-spin" size={20} /> : (
                    <>
                      Send Reset Link
                      <Mail size={20} />
                    </>
                  )}
                </button>
              </form>

              <div className="auth-footer-links">
                <p className="auth-link" onClick={() => setMode('login')}>
                  Remembered your password? <span>Sign In</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div style={{ position: 'absolute', bottom: '2rem', display: 'flex', gap: '2rem', opacity: 0.5, fontSize: '0.8rem', fontWeight: 700 }}>
        <span>Secure with AES-256</span>
        <span>Supabase Auth</span>
        <span>UniSimplify Cloud</span>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
