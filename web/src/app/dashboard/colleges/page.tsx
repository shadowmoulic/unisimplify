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
      <div className="loading-screen" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <main className="portal-main">
      <header className="main-header-banner" style={{ padding: '2.5rem 3rem' }}>
        <div className="banner-content">
          <div className="banner-text">
            <h1>My Colleges</h1>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Track your saved colleges and their application fees.</p>
          </div>
        </div>
      </header>

      <div className="dashboard-content-area">
        {savedColleges.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '4rem 2rem', textAlign: 'center' }}>
            <Building2 size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem' }}>No colleges added yet</h3>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Go to College Search to find and save institutions you want to apply to.</p>
            <Link href="/discover" style={{ display: 'inline-block', background: '#10b981', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', textDecoration: 'none' }}>
              Explore Colleges
            </Link>
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>College Name</th>
                  <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Location</th>
                  <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Deadline</th>
                  <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Application Fee</th>
                  <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {savedColleges.map((college, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem 1.5rem', color: '#0f172a', fontWeight: '600' }}>
                      {college["University Name"]}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.95rem' }}>
                      {college.State}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#e11d48', fontWeight: '700', fontSize: '0.9rem' }}>
                      {college["Application Deadline"]}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#0f172a', fontWeight: '600' }}>
                      {college["Application Fee (INR)"]}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <a href={`https://www.google.com/search?q=${encodeURIComponent(college["University Name"] + ' admission portal')}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>
                          <ExternalLink size={16} /> URL
                        </a>
                        <button onClick={() => handleRemove(college["University Name"])} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                          <Trash2 size={16} /> Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
