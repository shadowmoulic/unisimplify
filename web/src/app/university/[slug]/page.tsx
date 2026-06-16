'use client';

import React, { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Calendar, CreditCard, Award, GraduationCap, ArrowLeft, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';
import collegesDataRaw from '@/data/colleges.json';
import { slugify } from '@/utils/slugify';

interface College {
  "University Name": string;
  Tier: string;
  State: string;
  "Application Deadline": string;
  "Application Fee (INR)": string;
  "Proprietary Test": string;
  "CUET Acceptance Policy": string;
  "Accreditation / Ranking": string;
  "Average Annual Fees (INR)": string;
  URL?: string;
  AdmissionPortalURL?: string;
  Source: string;
}

const collegesData = collegesDataRaw as College[];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function UniversityProfilePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const college = collegesData.find((c) => slugify(c["University Name"]) === slug);

  if (!college) {
    notFound();
  }

  return (
    <div className="profile-page-wrapper">
      <div className="radial-glow" style={{ opacity: 0.3 }} aria-hidden />

      <div className="profile-container">
        {/* Back navigation */}
        <Link href="/universities" className="back-link">
          <ArrowLeft size={16} />
          Back to Directory
        </Link>

        {/* Hero Section Card */}
        <div className="profile-hero-card glass-panel">
          <div className="profile-header-info">
            <div className="state-badge">
              <MapPin size={14} />
              {college.State}
            </div>
            
            <h1>{college["University Name"]}</h1>
            
            <div className="accreditation-badge">
              <Award size={18} />
              <span>{college["Accreditation / Ranking"]}</span>
            </div>
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="profile-details-grid">
          {/* Key Info */}
          <div className="detail-card glass-panel main-details">
            <h2>Admissions Information</h2>
            <div className="info-list">
              <div className="info-item">
                <Calendar className="icon text-emerald" size={24} />
                <div>
                  <label>Application Deadline</label>
                  <p>{college["Application Deadline"]}</p>
                </div>
              </div>

              <div className="info-item">
                <CreditCard className="icon text-emerald" size={24} />
                <div>
                  <label>Application Fee</label>
                  <p>{college["Application Fee (INR)"]}</p>
                </div>
              </div>

              <div className="info-item">
                <GraduationCap className="icon text-emerald" size={24} />
                <div>
                  <label>Average Annual Tuition Fees</label>
                  <p>{college["Average Annual Fees (INR)"]}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Test & CUET Acceptance */}
          <div className="detail-card glass-panel tests-details">
            <h2>Entrance Requirements</h2>
            <div className="info-list">
              <div className="info-item">
                <div className="icon-wrapper">
                  <Sparkles className="icon text-emerald" size={24} />
                </div>
                <div>
                  <label>Proprietary Test</label>
                  <p>{college["Proprietary Test"]}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icon-wrapper">
                  <AlertCircle className="icon text-emerald" size={24} />
                </div>
                <div>
                  <label>CUET Acceptance Policy</label>
                  <p>{college["CUET Acceptance Policy"]}</p>
                </div>
              </div>
            </div>

            <div className="cta-box-profile">
              <Link 
                href={`/auth?mode=signup&university=${encodeURIComponent(college["University Name"])}`}
                className="btn-apply-primary"
              >
                Apply via UniSimplify
              </Link>
              
              {college.URL && (
                <a 
                  href={college.URL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-website-secondary"
                >
                  Visit Website
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-page-wrapper {
          min-height: 80vh;
          padding: 2rem 1.5rem 6rem;
          position: relative;
        }

        .profile-container {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-weight: 700;
          font-size: 0.9rem;
          transition: color 0.2s ease;
          width: fit-content;
        }

        .back-link:hover {
          color: #10b981;
        }

        .profile-hero-card {
          padding: 3rem 2.5rem;
          background: #fff;
          border-radius: 32px;
          border: 1px solid rgba(0, 0, 0, 0.03);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.01);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .profile-header-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }

        .state-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-weight: 800;
          color: #94a3b8;
          font-size: 0.9rem;
          background: #f8fafc;
          padding: 0.5rem 1.25rem;
          border-radius: 100px;
        }

        .profile-hero-card h1 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #0f172a;
          margin: 0;
          line-height: 1.15;
        }

        .accreditation-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #10b981;
          font-weight: 800;
          font-size: 0.95rem;
          background: rgba(16, 185, 129, 0.06);
          padding: 0.6rem 1.25rem;
          border-radius: 100px;
        }

        .profile-details-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 2rem;
        }

        .detail-card {
          background: #fff;
          border-radius: 28px;
          padding: 2.5rem;
          border: 1px solid rgba(0, 0, 0, 0.03);
        }

        .detail-card h2 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 2rem;
          letter-spacing: -0.02em;
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
        }

        .info-item :global(.icon) {
          margin-top: 0.25rem;
        }

        .info-item label {
          display: block;
          font-size: 0.75rem;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .info-item p {
          font-size: 1.05rem;
          font-weight: 700;
          color: #334155;
          margin: 0;
          line-height: 1.4;
        }

        .cta-box-profile {
          margin-top: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .btn-apply-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #10b981;
          color: #fff;
          font-weight: 800;
          padding: 1rem;
          border-radius: 16px;
          text-align: center;
          transition: all 0.2s ease;
          box-shadow: 0 10px 20px rgba(16, 185, 129, 0.15);
        }

        .btn-apply-primary:hover {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 12px 22px rgba(16, 185, 129, 0.25);
        }

        .btn-website-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #f8fafc;
          border: 1px solid rgba(0, 0, 0, 0.05);
          color: #64748b;
          font-weight: 800;
          padding: 1rem;
          border-radius: 16px;
          transition: all 0.2s ease;
        }

        .btn-website-secondary:hover {
          background: #f1f5f9;
          color: #334155;
        }

        @media (max-width: 768px) {
          .profile-details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
