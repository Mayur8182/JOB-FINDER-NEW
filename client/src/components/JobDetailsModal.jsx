import React, { useState } from 'react';
import { 
  X, CheckCircle2, MapPin, Briefcase, Clock, Calendar, 
  IndianRupee, Users, Bookmark, BookmarkCheck, Share2, 
  Sparkles, Check, ChevronRight, ShieldCheck, Award,
  Calculator, Target, Mic, ArrowRight
} from 'lucide-react';

export default function JobDetailsModal({
  job,
  onClose,
  onOpenApply,
  isSaved,
  onToggleSave,
  onOpenSalaryCalculator,
  onOpenMockSimulator,
  onOpenSkillGap
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, requirements, in-hand ctc, ai prep, perks

  if (!job) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="bottom-sheet" 
        style={{ height: '90%', maxHeight: '90%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-drag-handle" />

        {/* Top bar with close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Job Overview
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Job Header */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
          <img
            src={job.logo}
            alt={job.company}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              objectFit: 'cover',
              border: '1px solid var(--border-subtle)'
            }}
          />
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>
              {job.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              <span>{job.company}</span>
              {job.companyVerified && <CheckCircle2 size={14} color="#10b981" />}
              <span>•</span>
              <span style={{ color: '#38bdf8' }}>{job.location}</span>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '10px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Package / Stipend</div>
            <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#38bdf8' }}>{job.salary}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '10px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Work Mode</div>
            <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#34d399' }}>{job.workMode}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '10px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Experience</div>
            <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#c084fc' }}>{job.experience}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '10px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Application Deadline</div>
            <div style={{ fontSize: '0.84rem', fontWeight: '600', color: '#fbbf24' }}>{job.deadline}</div>
          </div>
        </div>

        {/* Content Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '14px',
          gap: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {['overview', 'requirements', 'in-hand ctc', 'ai prep', 'perks'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 6px',
                color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab ? '700' : '500',
                fontSize: '0.8rem',
                borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: '160px', paddingBottom: '70px' }}>
          {activeTab === 'overview' && (
            <div>
              <p style={{ fontSize: '0.84rem', lineHeight: '1.5', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                {job.description}
              </p>

              <div style={{ fontWeight: '700', fontSize: '0.86rem', color: '#fff', marginBottom: '8px' }}>
                Key Responsibilities:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {job.responsibilities?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', marginTop: '6px' }} />
                    <span style={{ flex: 1 }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ fontWeight: '700', fontSize: '0.86rem', color: '#fff', marginBottom: '8px' }}>
                Required Skills:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {job.skills?.map((skill, i) => (
                  <span key={i} className="pill-tag tag-blue">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.86rem', color: '#fff', marginBottom: '8px' }}>
                Minimum Qualifications:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                {job.requirements?.map((req, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <Check size={14} color="#10b981" style={{ marginTop: '3px' }} />
                    <span style={{ flex: 1 }}>{req}</span>
                  </div>
                ))}
              </div>

              {job.niceToHave && (
                <>
                  <div style={{ fontWeight: '700', fontSize: '0.86rem', color: '#fff', marginBottom: '8px' }}>
                    Nice to Have:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {job.niceToHave?.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <Sparkles size={14} color="#818cf8" style={{ marginTop: '3px' }} />
                        <span style={{ flex: 1 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {onOpenSkillGap && (
                <button
                  onClick={() => onOpenSkillGap(job)}
                  style={{
                    width: '100%',
                    marginTop: '14px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: '#fbbf24',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Target size={15} />
                  <span>Analyze My Skill Gap & View Learning Roadmap →</span>
                </button>
              )}
            </div>
          )}

          {activeTab === 'in-hand ctc' && (
            <div>
              <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase' }}>
                  Estimated Monthly Take-Home (In-Hand)
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', marginTop: '4px' }}>
                  {job.inHandMonthly || '₹85,000 – ₹1,20,000'} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '400' }}>/ month</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Calculated after standard PF (12%), Gratuity, and standard new tax regime slab deduction.
                </div>
              </div>

              <div style={{ fontWeight: '700', fontSize: '0.84rem', color: '#fff', marginBottom: '8px' }}>
                Compensation Split Breakdown:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Base Salary (Fixed)</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fff' }}>75% of Total CTC</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Performance Bonus / Variable</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#34d399' }}>15% of CTC</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Employer PF & Benefits</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#818cf8' }}>10% of CTC</span>
                </div>
              </div>

              {onOpenSalaryCalculator && (
                <button
                  onClick={() => onOpenSalaryCalculator(job)}
                  style={{
                    width: '100%',
                    marginTop: '14px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#38bdf8',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Calculator size={15} />
                  <span>Open Full Tax & In-Hand Calculator & Slabs →</span>
                </button>
              )}
            </div>
          )}

          {activeTab === 'ai prep' && (
            <div>
              <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} /> AI Interview Preparation Kit
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fff', marginTop: '4px' }}>
                  Tailored for {job.company} • {job.title}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Pro Tip: {job.interviewPrep?.proTip || "Focus on explaining trade-offs between speed and space complexity in system design."}
                </div>
              </div>

              <div style={{ fontWeight: '700', fontSize: '0.84rem', color: '#fff', marginBottom: '8px' }}>
                Top Technical Questions Asked:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                {(job.interviewPrep?.technicalQuestions || [
                  "Explain event-driven architecture and asynchronous operations.",
                  "How do you optimize bundle size and database index lookups?",
                  "Walk through a time you debugged high latency in production."
                ]).map((q, idx) => (
                  <div key={idx} style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: '700' }}>Q{idx + 1}: </span>
                    <span style={{ fontSize: '0.76rem', color: '#e2e8f0' }}>{typeof q === 'string' ? q : q.question}</span>
                  </div>
                ))}
              </div>

              {onOpenMockSimulator && (
                <button
                  onClick={() => onOpenMockSimulator(job)}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    marginTop: '6px',
                    padding: '10px 14px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Mic size={15} />
                  <span>Launch Voice/Text AI Mock Interview Practice →</span>
                </button>
              )}
            </div>
          )}

          {activeTab === 'perks' && (
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.86rem', color: '#fff', marginBottom: '10px' }}>
                Employee Benefits & Perks:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {job.benefits?.map((benefit, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.82rem',
                    color: 'var(--text-main)'
                  }}>
                    <Award size={16} color="#fbbf24" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Action Footer */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 20px 20px 20px',
          background: 'rgba(17, 24, 39, 0.95)',
          borderTop: '1px solid var(--border-subtle)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          gap: '10px'
        }}>
          <button
            onClick={() => onToggleSave(job.id)}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isSaved ? '#f43f5e' : '#fff'
            }}
          >
            {isSaved ? <BookmarkCheck size={20} fill="#f43f5e" /> : <Bookmark size={20} />}
          </button>

          <button
            onClick={() => alert(`Share link for ${job.title} copied to clipboard!`)}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            <Share2 size={18} />
          </button>

          <button
            className="btn-primary"
            style={{ flex: 1 }}
            onClick={() => {
              onClose();
              onOpenApply(job);
            }}
          >
            Apply Now <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
