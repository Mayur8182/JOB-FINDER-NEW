import React, { useState } from 'react';
import { 
  Search, SlidersHorizontal, Sparkles, MapPin, Building2, 
  Clock, IndianRupee, Bookmark, BookmarkCheck, ArrowRight, 
  CheckCircle2, Bell, Users, Briefcase, Calculator, Target, Mic
} from 'lucide-react';

export default function HomeFeed({
  jobs,
  profile,
  savedJobIds,
  onToggleSave,
  onSelectJob,
  onOpenApply,
  onOpenFilter,
  activeFilterCount,
  onOpenNotifications,
  unreadNotifsCount,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenSalaryCalculator,
  onOpenMockSimulator,
  onOpenSkillGap
}) {
  const categories = [
    { id: 'All', label: 'All Jobs' },
    { id: 'Internship', label: '⚡ Internships' },
    { id: 'Full Time', label: '💼 Full Time' },
    { id: 'Remote', label: '🌐 Remote' },
    { id: 'Fresher', label: '🚀 Freshers' },
    { id: 'HighPay', label: '💰 ₹10L+ LPA' }
  ];

  // Calculate skill match score for recommended jobs
  const userSkills = profile?.skills || [];
  const recommendedJobs = jobs.slice(0, 3).map(j => {
    const matchingSkills = j.skills.filter(s => userSkills.includes(s));
    const matchScore = Math.min(98, Math.max(75, Math.round(75 + (matchingSkills.length / Math.max(1, j.skills.length)) * 25)));
    return { ...j, matchScore };
  });

  return (
    <div className="app-viewport">
      {/* Top Header */}
      <div style={{
        padding: '16px 20px 12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(180deg, rgba(30, 27, 75, 0.4) 0%, transparent 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'var(--avatar-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: '800',
            fontSize: '1.15rem',
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
            border: '1.5px solid rgba(255, 255, 255, 0.25)'
          }}>
            {profile?.name ? profile.name.charAt(0).toUpperCase() : 'M'}
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hello, welcome back 👋</div>
            <div style={{ fontSize: '1.02rem', fontWeight: '800', color: '#fff' }}>
              {profile?.name || 'Candidate Profile'}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenNotifications}
          style={{
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <Bell size={18} />
          {unreadNotifsCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: 'var(--accent-rose)',
              color: '#fff',
              fontSize: '0.62rem',
              fontWeight: '700',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {unreadNotifsCount}
            </span>
          )}
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ padding: '0 20px 14px 20px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px'
          }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search title, skills (e.g. React, Node)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                outline: 'none',
                width: '100%',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <button
            onClick={onOpenFilter}
            style={{
              position: 'relative',
              background: activeFilterCount > 0 ? 'var(--primary-light)' : 'var(--bg-input)',
              border: `1px solid ${activeFilterCount > 0 ? 'var(--primary)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: activeFilterCount > 0 ? 'var(--primary)' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <SlidersHorizontal size={18} />
            {activeFilterCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--primary)',
                color: '#000',
                fontSize: '0.62rem',
                fontWeight: '800',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Pills Carousel */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '0 20px 16px 20px',
        scrollbarWidth: 'none'
      }}>
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                whiteSpace: 'nowrap',
                padding: '7px 15px',
                borderRadius: 'var(--radius-full)',
                border: isSelected ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
                background: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                color: isSelected ? '#000000' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: isSelected ? '800' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isSelected ? '0 2px 10px rgba(255, 255, 255, 0.25)' : 'none'
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Quick Career Utilities Suite Ribbon */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '0 20px 16px 20px',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        <button
          onClick={() => onOpenSalaryCalculator && onOpenSalaryCalculator()}
          style={{
            whiteSpace: 'nowrap',
            padding: '8px 12px',
            borderRadius: '12px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            fontSize: '0.74rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Calculator size={14} />
          <span>Salary & Tax Calculator</span>
        </button>

        <button
          onClick={() => onOpenMockSimulator && onOpenMockSimulator()}
          style={{
            whiteSpace: 'nowrap',
            padding: '8px 12px',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#818cf8',
            fontSize: '0.74rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Mic size={14} />
          <span>AI Mock Interview Coach</span>
        </button>

        <button
          onClick={() => onOpenSkillGap && onOpenSkillGap(jobs[0])}
          style={{
            whiteSpace: 'nowrap',
            padding: '8px 12px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#fbbf24',
            fontSize: '0.74rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Target size={14} />
          <span>Skill Gap Roadmap</span>
        </button>
      </div>

      {/* Section: Recommended For You */}
      {!searchQuery && selectedCategory === 'All' && (
        <div style={{ padding: '0 20px 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#818cf8" />
              <span style={{ fontWeight: '700', fontSize: '0.92rem', color: '#fff' }}>Recommended For You</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Swipe to see all ({recommendedJobs.length}) →</span>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollbarWidth: 'none',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }}>
            {recommendedJobs.map(job => (
              <div
                key={job.id}
                onClick={() => onSelectJob(job)}
                style={{
                  minWidth: '245px',
                  maxWidth: '245px',
                  flexShrink: 0,
                  scrollSnapAlign: 'start',
                  background: 'linear-gradient(145deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
                  border: '1px solid rgba(99, 102, 241, 0.35)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <img
                    src={job.logo}
                    alt={job.company}
                    style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#34d399',
                    fontSize: '0.7rem',
                    fontWeight: '700'
                  }}>
                    <Sparkles size={11} /> {job.matchScore}% Match
                  </div>
                </div>

                <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.88rem', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {job.title}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {job.company} • {job.location}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#38bdf8', fontWeight: '600', marginBottom: '10px' }}>
                  <IndianRupee size={12} /> {job.salary}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="pill-tag tag-blue">{job.workMode}</span>
                  <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    View <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Opportunities Feed */}
      <div style={{ padding: '0 20px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontWeight: '700', fontSize: '0.92rem', color: '#fff' }}>
            {selectedCategory === 'All' ? 'Recent Opportunities' : `${selectedCategory} Postings`} ({jobs.length})
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Verified postings</span>
        </div>

        {jobs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--text-muted)',
            fontSize: '0.85rem'
          }}>
            <Briefcase size={36} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
            No opportunities match your current search or filter criteria.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {jobs.map(job => {
              const isSaved = savedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="glass-card"
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                    padding: '14px'
                  }}
                  onClick={() => onSelectJob(job)}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <img
                      src={job.logo}
                      alt={job.company}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        objectFit: 'cover',
                        border: '1px solid var(--border-subtle)'
                      }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff', marginBottom: '2px' }}>
                              {job.title}
                            </div>
                            {(job.isNewUpload || job.postedDate === 'Just now') && (
                              <span style={{ background: '#ffffff', color: '#000000', fontSize: '0.62rem', fontWeight: '900', padding: '1px 5px', borderRadius: '4px' }}>
                                ⚡ NEW
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                            <span>{job.company}</span>
                            {job.companyVerified && <CheckCircle2 size={13} color="#ffffff" />}
                          </div>
                        </div>

                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSave(job.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: isSaved ? '#ffffff' : 'var(--text-muted)',
                            padding: '4px'
                          }}
                        >
                          {isSaved ? <BookmarkCheck size={18} fill="#ffffff" /> : <Bookmark size={18} />}
                        </button>
                      </div>

                      {/* Details row: location, experience, mode */}
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginTop: '8px',
                        marginBottom: '10px'
                      }}>
                        <span className="pill-tag tag-blue">{job.location}</span>
                        <span className="pill-tag tag-green">{job.workMode}</span>
                        <span className="pill-tag tag-purple">{job.experience}</span>
                      </div>

                      {/* Salary and Applicants */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '8px'
                      }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#38bdf8' }}>
                          {job.salary}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Users size={12} /> {job.applicantsCount} applied
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenApply(job);
                            }}
                            className="btn-primary"
                            style={{
                              padding: '6px 14px',
                              fontSize: '0.76rem',
                              borderRadius: '8px',
                              background: '#ffffff',
                              color: '#000000',
                              fontWeight: '800',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span>Apply Now</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
