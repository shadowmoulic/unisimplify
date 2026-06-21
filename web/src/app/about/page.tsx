'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, ShieldCheck, Cpu, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  bio: string;
  accent: string;
  accentGlow: string;
  icon: React.ReactNode;
}

const team: TeamMember[] = [
  {
    name: "Shivam Agrawal",
    role: "Co-Founder & CEO",
    image: "https://liquivest.in/team/shivam.png",
    linkedin: "https://www.linkedin.com/in/shivamagrawal5/",
    bio: "I think in clarity where most people see complexity.",
    accent: "rgb(16, 185, 129)", // Emerald
    accentGlow: "rgba(16, 185, 129, 0.15)",
    icon: <ShieldCheck size={18} className="text-emerald" />
  },
  {
    name: "Rajveer Ranjan",
    role: "Co-Founder & CMO",
    image: "https://liquivest.in/team/rajveer.jpeg",
    linkedin: "https://in.linkedin.com/in/rajveer-ranjan-97034b396",
    bio: "Driving the vision to digitize MSME financial intelligence across India. Building the future of manufacturing finance.",
    accent: "rgb(139, 92, 246)", // Purple
    accentGlow: "rgba(139, 92, 246, 0.15)",
    icon: <Zap size={18} style={{ color: "rgb(139, 92, 246)" }} />
  },
  {
    name: "Sayak Moulic",
    role: "Co-Founder & CTO",
    image: "https://liquivest.in/team/sayak.jpeg",
    linkedin: "https://www.linkedin.com/in/sayak-moulic-ai-voice-agents-seo/",
    bio: "Architecting the predictive engines that safeguard industrial cashflow.",
    accent: "rgb(245, 158, 11)", // Amber
    accentGlow: "rgba(245, 158, 11, 0.15)",
    icon: <Cpu size={18} style={{ color: "rgb(245, 158, 11)" }} />
  }
];

export default function AboutPage() {
  return (
    <div className="policy-container" style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 2rem' }}>
      
      {/* Back Button */}
      <Link href="/" className="btn-icon" style={{ marginBottom: '2.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontWeight: 700, transition: 'color 0.2s' }}>
        <ArrowLeft size={18} />
        Back to Home
      </Link>

      {/* Hero Section */}
      <header className="policy-header" style={{ marginBottom: '5rem', textAlign: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="badge" style={{ margin: '0 auto 1.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <Sparkles size={14} style={{ marginRight: '4px' }} />
            <span>THE STRATEGIC COMMAND</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Meet the <span style={{ background: 'linear-gradient(135deg, #0f172a 0%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Leadership.</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.2rem', fontWeight: 500, maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            The visionary founders directing the future of college admissions and academic transparency in India.
          </p>
        </motion.div>
      </header>

      {/* Team Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '6rem' }}>
        {team.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.01 }}
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '32px',
              padding: '2.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02), inset 0 0 20px rgba(255, 255, 255, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s ease, border-color 0.3s ease'
            }}
            className="team-card-hover"
          >
            {/* Top Border Glow Effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, transparent, ${member.accent}, transparent)`
            }} />

            {/* Background Glow */}
            <div style={{
              position: 'absolute',
              width: '150px',
              height: '150px',
              background: member.accentGlow,
              filter: 'blur(60px)',
              borderRadius: '50%',
              zIndex: -1,
              top: '20px'
            }} />

            {/* Profile Image Wrapper */}
            <div style={{
              width: '140px',
              height: '168px',
              borderRadius: '24px',
              overflow: 'hidden',
              border: `2px solid ${member.accentGlow}`,
              boxShadow: `0 8px 24px -6px ${member.accentGlow}`,
              marginBottom: '2rem',
              position: 'relative',
              background: '#f1f5f9'
            }}>
              <Image 
                alt={member.name} 
                src={member.image} 
                fill 
                sizes="140px"
                style={{ objectFit: 'cover' }}
                priority={index === 0}
              />
            </div>

            {/* Role Badge */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              padding: '0.4rem 1rem', 
              background: member.accentGlow, 
              color: member.accent, 
              borderRadius: '100px', 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              letterSpacing: '1px',
              textTransform: 'uppercase', 
              marginBottom: '1rem' 
            }}>
              {member.icon}
              <span>{member.role}</span>
            </div>

            {/* Name */}
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              {member.name}
            </h3>

            {/* Bio */}
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', flexGrow: 1, padding: '0 0.5rem' }}>
              {member.bio}
            </p>

            {/* Social Link */}
            <a 
              href={member.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#64748b',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = '#0a66c2';
                e.currentTarget.style.borderColor = '#0a66c2';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(10, 102, 194, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#64748b';
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <LinkedinIcon size={20} />
            </a>


          </motion.div>
        ))}
      </div>
    </div>
  );
}
