'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import collegesDataRaw from '@/data/colleges.json';
import { Building2, ExternalLink, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface College {
  "University Name": string;
  "Application Fee (INR)": string;
  State: string;
  "Application Deadline": string;
}

export default function MyCollegesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [savedColleges, setSavedColleges] = useState<College[]>([]);

  useEffect(() => {
    let active = true;
    
    const fetchCollegesForUser = (userObj: any) => {
      try {
        let savedNames = localStorage.getItem(`saved_colleges_${userObj.id}`);
        
        // Fallback to email key if ID key is empty
        if (!savedNames && userObj.email) {
          savedNames = localStorage.getItem(`saved_colleges_${userObj.email}`);
        }

        if (savedNames) {
          const namesArray = JSON.parse(savedNames);
          if (Array.isArray(namesArray)) {
            const matchedColleges = (collegesDataRaw as College[]).filter(c => 
              namesArray.includes(c["University Name"])
            );
            setSavedColleges(matchedColleges);
            console.log("Successfully loaded matched colleges:", matchedColleges.length);
          } else {
            setSavedColleges([]);
          }
        } else {
          setSavedColleges([]);
        }
      } catch (err) {
        console.error("Error reading saved colleges:", err);
        setSavedColleges([]);
      }
      setLoading(false);
    };

    const fetchUserAndColleges = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (active) {
        if (!session) {
          router.push('/auth');
        } else {
          setUser(session.user);
          fetchCollegesForUser(session.user);
        }
      }
    };
    fetchUserAndColleges();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchCollegesForUser(session.user);
      } else {
        router.push('/auth');
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const handleRemove = (nameToRemove: string) => {
    const newSaved = savedColleges.filter(c => c["University Name"] !== nameToRemove);
    setSavedColleges(newSaved);
    localStorage.setItem(`saved_colleges_${user.id}`, JSON.stringify(newSaved.map(c => c["University Name"])));
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <main className="portal-main">
      <header className="main-header-banner">
        <div className="banner-content">
          <div className="banner-text">
            <h1>My Colleges</h1>
            <p className="banner-subtext">Track your saved colleges and their application fees.</p>
          </div>
        </div>
      </header>

      <div className="dashboard-content-area">
        {savedColleges.length === 0 ? (
          <div className="empty-state-premium glass-panel">
            <div className="empty-icon-box">
              <Building2 size={48} />
            </div>
            <h3>No colleges added yet</h3>
            <p>Go to College Search to find and save institutions you want to apply to.</p>
            <Link href="/discover" className="btn-explore-premium">
              Explore Colleges
            </Link>
          </div>
        ) : (
          <div className="college-list-container glass-panel">
            <div className="college-table-wrapper">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>College Name</th>
                    <th>Location</th>
                    <th>Deadline</th>
                    <th>Fee (INR)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {savedColleges.map((college, idx) => (
                    <tr key={idx}>
                      <td className="col-name">
                        <div className="col-brand-mini">
                          <Building2 size={16} />
                          {college["University Name"]}
                        </div>
                      </td>
                      <td>{college.State}</td>
                      <td>
                        <span className="deadline-badge">
                          {college["Application Deadline"]}
                        </span>
                      </td>
                      <td className="font-bold">{college["Application Fee (INR)"]}</td>
                      <td>
                        <div className="action-row">
                          <a 
                            href={`https://www.google.com/search?q=${encodeURIComponent(college["University Name"] + ' admission portal')}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn-url-small"
                          >
                            <ExternalLink size={14} /> Portal
                          </a>
                          <button 
                            onClick={() => handleRemove(college["University Name"])} 
                            className="btn-remove-small"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View (Card Grid) */}
            <div className="college-cards-mobile">
              {savedColleges.map((college, idx) => (
                <div key={idx} className="college-card-mobile glass-panel">
                  <div className="card-header">
                    <h3>{college["University Name"]}</h3>
                    <button onClick={() => handleRemove(college["University Name"])} className="btn-remove-mini">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="card-info-item">
                      <span className="label">Location</span>
                      <span className="value">{college.State}</span>
                    </div>
                    <div className="card-info-item">
                      <span className="label">Deadline</span>
                      <span className="value text-red">{college["Application Deadline"]}</span>
                    </div>
                    <div className="card-info-item">
                      <span className="label">Fee</span>
                      <span className="value font-bold">{college["Application Fee (INR)"]}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <a 
                      href={`https://www.google.com/search?q=${encodeURIComponent(college["University Name"] + ' admission portal')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-portal-mobile"
                    >
                      <ExternalLink size={16} />
                      Visit Admission Portal
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
