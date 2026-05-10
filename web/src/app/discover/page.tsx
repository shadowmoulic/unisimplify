'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Calendar, CreditCard, Award, ChevronRight, GraduationCap, Sparkles, BookmarkPlus, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import collegesDataRaw from '../../data/colleges.json';

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

export default function Discover() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredColleges, setFilteredColleges] = useState<College[]>(collegesData);
  const [selectedTier, setSelectedTier] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [user, setUser] = useState<any>(null);
  const [savedColleges, setSavedColleges] = useState<string[]>([]);

  const states = ['All', ...new Set(collegesData.map((c: College) => c.State))];
  const tiers = ['All', '1', '2', '3'];

  useEffect(() => {
    let active = true;
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (active && session?.user) {
        setUser(session.user);
        const saved = localStorage.getItem(`saved_colleges_${session.user.id}`);
        if (saved) {
          setSavedColleges(JSON.parse(saved));
        }
      }
    };
    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        const saved = localStorage.getItem(`saved_colleges_${session.user.id}`);
        if (saved) {
          setSavedColleges(JSON.parse(saved));
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleAddToList = (collegeName: string) => {
    if (!user) {
      alert("Please sign in to save colleges to your list.");
      return;
    }
    try {
      const storageKey = `saved_colleges_${user.id}`;
      const currentSavedStr = localStorage.getItem(storageKey);
      const currentSaved = currentSavedStr ? JSON.parse(currentSavedStr) : [];
      
      if (!currentSaved.includes(collegeName)) {
        const newSaved = [...currentSaved, collegeName];
        setSavedColleges(newSaved);
        localStorage.setItem(storageKey, JSON.stringify(newSaved));
        
        // Also save a backup using email just in case the ID changes or fails
        if (user.email) {
          localStorage.setItem(`saved_colleges_${user.email}`, JSON.stringify(newSaved));
        }
        
        alert(`${collegeName} has been saved to your colleges list!`);
      }
    } catch (err) {
      console.error("Failed to save college:", err);
      alert("There was an error saving your college. Please try again.");
    }
  };

  useEffect(() => {
    let results = collegesData.filter((college: College) => 
      college["University Name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.State.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedTier !== 'All') {
      results = results.filter((c: College) => c.Tier === selectedTier);
    }

    if (selectedState !== 'All') {
      results = results.filter((c: College) => c.State === selectedState);
    }

    setFilteredColleges(results);
  }, [searchTerm, selectedTier, selectedState]);

  return (
    <div className="discover-page-wrapper">
      {/* Premium Hero Section */}
      <section className="discover-hero-compact">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="tag-line" style={{ margin: '3rem auto 1.5rem' }}>
            <Sparkles size={14} className="text-emerald" />
            <span>EXCLUSIVELY FOR GEN Z STUDENTS</span>
          </div>
          <h1>Find Your Dream College</h1>
          <p>
            Explore India&apos;s most elite universities through a modern, 
            intelligent discovery interface.
          </p>
        </motion.div>
      </section>

      {/* Advanced Search & Filter Container */}
      <section className="search-container-premium">
        <div className="premium-search-input-wrapper">
          <Search className="premium-search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search by university name, state, or course..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="premium-filter-row">
          <select 
            className="premium-filter-select"
            value={selectedTier} 
            onChange={(e) => setSelectedTier(e.target.value)}
          >
            <option value="All">All University Tiers</option>
            {tiers.filter(t => t !== 'All').map(t => (
              <option key={t} value={t}>Tier {t} Institutions</option>
            ))}
          </select>

          <select 
            className="premium-filter-select"
            value={selectedState} 
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="All">All States in India</option>
            {states.filter(s => s !== 'All').map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Results Meta Info */}
      <div className="discover-meta-info">
        <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#64748b', letterSpacing: '0.05em' }}>
          SHOWING <span className="text-emerald">{filteredColleges.length}</span> CURATED INSTITUTIONS
        </div>
        <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#94a3b8', letterSpacing: '0.05em' }}>
          UPDATED FOR 2025 ADMISSIONS
        </div>
      </div>

      {/* Modern University Grid */}
      <div className="discover-grid-premium">
        <AnimatePresence mode="popLayout">
          {filteredColleges.map((college: College, index: number) => (
            <motion.div 
              key={college["University Name"]}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, delay: index * 0.02 }}
              className="university-card-premium"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="premium-tier-tag">Tier {college.Tier} Institution</div>
                <div className="premium-location">
                  <MapPin size={14} />
                  {college.State}
                </div>
              </div>

              <h3 className="premium-uni-name">{college["University Name"]}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>
                <Award size={16} />
                {college["Accreditation / Ranking"]}
              </div>

              <div className="premium-stats-grid">
                <div className="p-stat">
                  <label>Application Deadline</label>
                  <span>{college["Application Deadline"]}</span>
                </div>
                <div className="p-stat">
                  <label>Annual Tuition Fees</label>
                  <span>{college["Average Annual Fees (INR)"]}</span>
                </div>
              </div>

              <div className="premium-card-footer">
                <div className="app-fee-info">
                  <label>Application Fee</label>
                  <strong>{college["Application Fee (INR)"]}</strong>
                </div>
                {savedColleges.includes(college["University Name"]) ? (
                  <button className="premium-apply-btn" style={{ background: '#ecfdf5', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }} disabled>
                    <CheckCircle2 size={18} />
                    Saved
                  </button>
                ) : (
                  <button className="premium-apply-btn" onClick={() => handleAddToList(college["University Name"])}>
                    <BookmarkPlus size={18} />
                    Add to List
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
