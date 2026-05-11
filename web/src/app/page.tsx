'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  GraduationCap,
  Zap,
  Globe,
  CheckCircle2,
  Star,
  Mail,
  Sparkles,
  Award,
  Users,
  ShieldCheck,
  Clock,
  ChevronDown,
  LayoutDashboard,
  Search,
  User,
  MousePointer2
} from 'lucide-react';
import LoginModal from '@/components/LoginModal';

const HERO_IMAGE = '/images/hero-v2.png';
const PROFILE_MOCKUP = '/images/mockup-profile.png';
const DASHBOARD_MOCKUP = '/images/mockup-dashboard.png';
const DEADLINE_MOCKUP = '/images/mockup-deadline.png';

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const y2 = useTransform(scrollY, [0, 500], [0, 100]);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Is UniSimplify free?",
      a: "Yes, creating your Universal Profile and discovering colleges is completely free. We only charge a small convenience fee if you choose to use our premium application tracking features."
    },
    {
      q: "Do colleges accept applications from UniSimplify?",
      a: "Absolutely. We partner directly with top universities to ensure your Universal Profile data is accepted as an official application submission."
    },
    {
      q: "Is my data secure?",
      a: "Your trust is our priority. We use bank-grade AES-256 encryption. Your documents and personal data are only shared with colleges you explicitly choose to apply to."
    },
    {
      q: "Do I still pay college application fees?",
      a: "Yes, you still pay the standard application fee required by the university. UniSimplify simplifies the process of filling and submitting, but university fees remain the same."
    },
    {
      q: "Can I edit my profile later?",
      a: "Of course. You can update your scores, documents, and preferences anytime. Your updated profile will be used for all future applications."
    }
  ];

  return (
    <div className="home-container">
      
      <div className="bg-noise" aria-hidden />
      
      {/* Hero Section */}
      <section className="hero-vibe">
        <div className="hero-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="hero-text"
          >
            <div className="tag-line">
              <ShieldCheck size={14} className="text-emerald" />
              <span>JOIN OUR GROWING COMMUNITY</span>
            </div>
            <h1 className="main-title">
              Apply to Multiple Colleges with <span className="text-emerald">One Profile.</span>
            </h1>
            <p className="sub-title">
              Stop filling the same details again and again. Create your Universal Profile once and apply to top Indian universities faster.
            </p>

            <div className="cta-group-new">
              <Link href="/auth?mode=signup" className="btn-primary-large">
                Create Free Profile
                <ArrowRight size={20} />
              </Link>
              <Link href="/discover" className="btn-secondary-large">
                Explore Colleges
              </Link>
            </div>
            
            <div className="trust-badges">
              <div className="badge-item">
                <CheckCircle2 size={16} />
                <span>Secure Document Storage</span>
              </div>
              <div className="badge-item">
                <ShieldCheck size={16} />
                <span>Data Privacy Guaranteed</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-visual"
          >
            <div className="mockup-stack">
              <div className="mockup-main glass-panel">
                <Image src={PROFILE_MOCKUP} alt="Universal Profile Mockup" fill sizes="(max-width: 768px) 100vw, 50vw" priority className="img-contain" />
              </div>
              <div className="mockup-float glass-panel animate-float">
                <Image src={DASHBOARD_MOCKUP} alt="Dashboard Mockup" fill sizes="(max-width: 768px) 100vw, 25vw" priority className="img-contain" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header-premium" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="badge" style={{ margin: '0 auto 1rem' }}>PROCESS</div>
          <h2 className="section-title-premium">
            Admission in 3 Simple Steps
          </h2>
          <p className="section-subtitle-premium">
            We&apos;ve removed the paperwork and the stress. Focus on your future, not the forms.
          </p>
        </div>

        <div className="steps-grid">
          <motion.div 
            whileHover={{ y: -10 }}
            className="step-card"
          >
            <span className="step-number">Step 01</span>
            <div className="step-icon-wrapper">
              <User size={32} />
            </div>
            <h3>Create Profile</h3>
            <p>Build your Universal Profile once. We securely store your documents and data for all future applications.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="step-card"
          >
            <span className="step-number">Step 02</span>
            <div className="step-icon-wrapper">
              <Search size={32} />
            </div>
            <h3>Explore Colleges</h3>
            <p>Browse India&apos;s elite universities with high-fidelity filters and real-time admission insights.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="step-card"
          >
            <span className="step-number">Step 03</span>
            <div className="step-icon-wrapper">
              <Sparkles size={32} />
            </div>
            <h3>Apply in One Tap</h3>
            <p>Apply to multiple universities instantly. No more repetitive forms, no more manual paperwork.</p>
          </motion.div>
        </div>
      </section>

      {/* Deadline Section */}
      <section className="deadline-tracker-promo">
        <div className="deadline-content">
          <div className="deadline-text">
            <div className="tag-urgent">
              <Clock size={16} />
              <span>NEVER MISS A DATE</span>
            </div>
            <h2>Never miss another application deadline.</h2>
            <p>Track all your applications in one dashboard. Get real-time alerts when deadlines approach for your saved universities.</p>
            <ul className="feature-list">
              <li><CheckCircle2 size={18} /> Centralized Calendar View</li>
              <li><CheckCircle2 size={18} /> Priority Deadline Alerts</li>
              <li><CheckCircle2 size={18} /> Direct Status Tracking</li>
            </ul>
          </div>
          <div className="deadline-image glass-panel">
            <Image src={DEADLINE_MOCKUP} alt="Deadline Tracker Mockup" fill sizes="(max-width: 768px) 100vw, 50vw" className="img-cover" />
          </div>
        </div>
      </section>

      {/* Why Students Use Section */}
      <section className="bento-section-new">
        <h2 className="section-title">Why Students Use UniSimplify</h2>
        <div className="bento-grid-new">
          <div className="bento-card-new glass-panel">
            <h3>One Dashboard</h3>
            <p>Track your entire admission journey from a single, clean interface. No more bookmarking 50 different URLs.</p>
          </div>
          <div className="bento-card-new glass-panel highlight-card">
            <h3>Fast Applications</h3>
            <p>Our users apply to colleges 5x faster than traditional portals. More time for prep, less time for paperwork.</p>
          </div>
          <div className="bento-card-new glass-panel">
            <h3>Verified Legitimacy</h3>
            <p>Your documents are verified once and stored securely. Universities trust UniSimplify data.</p>
          </div>
          <div className="bento-card-new glass-panel">
            <h3>Apply in Minutes</h3>
            <p>Select your college, verify your details, and submit. It's actually that simple.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item glass-panel ${openFaq === index ? 'active' : ''}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}>
              <div className="faq-question">
                <span>{faq.q}</span>
                <ChevronDown size={20} className="icon" />
              </div>
              {openFaq === index && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="faq-answer">
                  <p>{faq.a}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="cta-box glass-panel">
          <h2>Ready to simplify your college search?</h2>
          <p>Join the growing community of students using UniSimplify to build their future.</p>
          <Link href="/auth?mode=signup" className="btn-primary-large">
            Create Your Universal Profile
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

    </div>
  );
}
