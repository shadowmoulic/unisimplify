'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, GraduationCap, ArrowRight, Building2, Globe, Users } from 'lucide-react';
import collegesDataRaw from '../../data/colleges.json';
import Link from 'next/link';

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
  Source: string;
}

const collegesData = collegesDataRaw as College[];

export default function UniversitiesDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredColleges, setFilteredColleges] = useState<College[]>(collegesData);

  useEffect(() => {
    const results = collegesData.filter((college: College) => 
      college["University Name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.State.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredColleges(results);
  }, [searchTerm]);

  return (
    <div className="discover-page-wrapper">
      <section className="discover-hero-compact">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="badge" style={{ margin: '0 auto 1.5rem' }}>DIRECTORY</div>
          <h1>University Directory</h1>
          <p>
            Browse and research India&apos;s leading educational institutions. 
            Detailed profiles and admission requirements for 2025.
          </p>
        </motion.div>
      </section>

      <section className="search-container-premium" style={{ maxWidth: '800px', marginBottom: '4rem' }}>
        <div className="premium-search-input-wrapper">
          <Search className="premium-search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search universities by name or state..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <div className="discover-meta-info">
        <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#64748b' }}>
          TOTAL INSTITUTIONS: <span className="text-emerald">{filteredColleges.length}</span>
        </div>
        <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#94a3b8' }}>
          VERIFIED DATA 2025
        </div>
      </div>

      <div className="directory-grid">
        <AnimatePresence mode="popLayout">
          {filteredColleges.map((college, index) => (
            <motion.div
              key={college["University Name"]}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.01 }}
              className="directory-item glass-panel"
            >
              <div className="dir-icon">
                <Building2 size={24} />
              </div>
              <div className="dir-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="tier-pill">Tier {college.Tier}</span>
                  <span className="state-label">
                    <MapPin size={12} />
                    {college.State}
                  </span>
                </div>
                <h3>{college["University Name"]}</h3>
                <p className="ranking-text">{college["Accreditation / Ranking"]}</p>
              </div>
              <Link href={`/auth?mode=signup&university=${encodeURIComponent(college["University Name"])}`} className="dir-link">
                View Details
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .directory-grid {
          max-width: 1200px;
          margin: 0 auto 6rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          padding: 0 1.5rem;
        }

        .directory-item {
          display: flex;
          align-items: center;
          padding: 1.5rem 2rem;
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(0, 0, 0, 0.03);
          transition: all 0.3s ease;
        }

        .directory-item:hover {
          border-color: #10b981;
          background: #fcfdfd;
          transform: translateX(5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.02);
        }

        .dir-icon {
          width: 50px;
          height: 50px;
          background: rgba(16, 185, 129, 0.05);
          color: #10b981;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1.5rem;
        }

        .dir-content {
          flex: 1;
        }

        .dir-content h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .tier-pill {
          font-size: 0.65rem;
          font-weight: 900;
          padding: 0.2rem 0.6rem;
          background: #0f172a;
          color: #fff;
          border-radius: 100px;
          text-transform: uppercase;
        }

        .state-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .ranking-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: #94a3b8;
        }

        .dir-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 800;
          color: #10b981;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          background: rgba(16, 185, 129, 0.05);
          transition: all 0.2s ease;
        }

        .dir-link:hover {
          background: #10b981;
          color: #fff;
        }

        @media (max-width: 768px) {
          .directory-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .dir-link {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
