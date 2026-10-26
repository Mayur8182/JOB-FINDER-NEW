import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Plus, Users, UserCheck, Calendar, CheckCircle2, 
  X, MapPin, IndianRupee, ArrowRight, Video, FileText, Send,
  Search, Sparkles, Award, Mail, GraduationCap
} from 'lucide-react';

export default function RecruiterDashboard({
  jobs,
  applications,
  onPostJob,
  onUpdateCandidateStatus
}) {
  const [activeView, setActiveView] = useState('overview'); // 'overview' | 'talent'
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // Talent Pool & Direct Sourcing State
  const [candidates, setCandidates] = useState([]);
  const [talentSearchQuery, setTalentSearchQuery] = useState('');
  const [candidateForInvite, setCandidateForInvite] = useState(null);
  const [inviteJobId, setInviteJobId] = useState(jobs[0]?.id || '');
  const [inviteNote, setInviteNote] = useState('Your verified skills are an exceptional fit for our engineering team. We would love to fast-track your technical review.');
  const [invitedCandidateIds, setInvitedCandidateIds] = useState([]);

  useEffect(() => {
    fetch('/api/v1/candidates')
      .then(r => r.json())
      .then(d => {
        if (d.success) setCandidates(d.candidates);
      })
      .catch(() => {});
  }, []);

  // Technical Interview Modal State
  const [candidateForInterview, setCandidateForInterview] = useState(null);
  const [interviewDate, setInterviewDate] = useState('Tomorrow');
  const [interviewTime, setInterviewTime] = useState('4:00 PM IST');
  const [interviewer, setInterviewer] = useState('Vikram Sharma (Staff Engineer)');
  const [meetLink, setMeetLink] = useState('https://meet.google.com/abc-tech-interview');
  const [interviewTopics, setInterviewTopics] = useState('DSA, React Live Coding & REST Architecture');

  // Candidate Rejection Modal State
  const [candidateForReject, setCandidateForReject] = useState(null);
  const [rejectReason, setRejectReason] = useState('Skills gap in required technology stack');
  const [rejectFeedback, setRejectFeedback] = useState('We encourage you to practice core data structures and React state management, then reapply in 60 days!');

  // Form state
  const [jobForm, setJobForm] = useState({
    title: 'Full Stack Node.js Engineer',
    company: 'ABC Technologies',
    logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80',
    location: 'Bangalore',
    workMode: 'Hybrid',
    jobType: 'Full Time',
    experience: 'Fresher',
    salary: '₹7–11 LPA',
    salaryMin: 7,
    salaryMax: 11,
    skills: 'Node.js, Express, React, MongoDB, AWS',
    description: 'We are expanding our core product engineering team with talented developers passionate about modern web scale architectures.',
    deadline: '2026-11-20'
  });

  const handleCreateJob = (e) => {
    e.preventDefault();
    const skillsArray = jobForm.skills.split(',').map(s => s.trim()).filter(Boolean);
    onPostJob({
      ...jobForm,
      skills: skillsArray,
      responsibilities: [
        "Design scalable backend APIs and responsive web pages.",
        "Ensure high test coverage and production observability.",
        "Collaborate in daily agile standups."
      ],
      requirements: [
        "Strong fundamentals in JavaScript/TypeScript and databases.",
        "Knowledge of RESTful architecture.",
        "Eagerness to learn and take ownership."
      ]
    });
    setShowPostJobModal(false);
  };

  const handleSendInvite = async () => {
    if (!candidateForInvite) return;
    const selectedJob = jobs.find(j => j.id === inviteJobId) || jobs[0];

    try {
      await fetch(`/api/v1/candidates/${candidateForInvite.id}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: selectedJob?.id || 'job-1',
          jobTitle: selectedJob?.title || 'Software Engineer',
          company: selectedJob?.company || 'ABC Technologies',
          note: inviteNote
        })
      });
      setInvitedCandidateIds(prev => [...prev, candidateForInvite.id]);
      setCandidateForInvite(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCandidates = candidates.filter(c => {
    if (!talentSearchQuery) return true;
    const q = talentSearchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.skills.some(s => s.toLowerCase().includes(q)) ||
      c.college.toLowerCase().includes(q);
  });

  return (
    <div className="app-viewport">
      {/* Header */}
      <div style={{
        padding: '16px 20px 14px 20px',
        background: 'linear-gradient(180deg, rgba(30, 27, 75, 0.4) 0%, transparent 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '700', textTransform: 'uppercase' }}>
              ● Recruiter Workspace
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
              ABC Technologies HR Portal
            </h2>
          </div>

          <button
            className="btn-primary"
            style={{ padding: '8px 14px', fontSize: '0.76rem', borderRadius: '10px' }}
            onClick={() => setShowPostJobModal(true)}
          >
            <Plus size={14} /> Post Job
          </button>
        </div>
      </div>

      <div style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '30px' }}>
        {/* Recruiter Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px'
        }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <Briefcase size={14} color="#818cf8" /> Active Jobs
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
              {jobs.length}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <Users size={14} color="#38bdf8" /> Applications
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
              {applications.length}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <UserCheck size={14} color="#34d399" /> Shortlisted
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#34d399', marginTop: '4px' }}>
              {applications.filter(a => a.status === 'Shortlisted').length}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <Calendar size={14} color="#fbbf24" /> Interviews
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fbbf24', marginTop: '4px' }}>
              {applications.filter(a => a.status === 'Interview').length}
            </div>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '10px',
          padding: '3px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveView('overview')}
            style={{
              flex: 1,
              padding: '7px 10px',
              borderRadius: '8px',
              border: 'none',
              background: activeView === 'overview' ? 'var(--primary-gradient)' : 'transparent',
              color: '#fff',
              fontSize: '0.76rem',
              fontWeight: activeView === 'overview' ? '700' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Briefcase size={13} />
            <span>Jobs & Pipeline ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveView('talent')}
            style={{
              flex: 1,
              padding: '7px 10px',
              borderRadius: '8px',
              border: 'none',
              background: activeView === 'talent' ? 'var(--primary-gradient)' : 'transparent',
              color: '#fff',
              fontSize: '0.76rem',
              fontWeight: activeView === 'talent' ? '700' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={13} />
            <span>Source Talent ({candidates.length})</span>
          </button>
        </div>

        {activeView === 'overview' ? (
          <>
        {/* Section: Recruiter's Posted Jobs */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#fff' }}>
              Your Active Postings ({jobs.length})
            </span>
            <button
              onClick={() => setShowPostJobModal(true)}
              style={{
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.72rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Plus size={12} /> Post New Job
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                No active job posts yet. Click "Post Job" above to create your first listing.
              </div>
            ) : (
              jobs.map(job => (
                <div key={job.id} className="glass-card" style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.88rem', color: '#fff' }}>{job.title}</span>
                        {(job.isNewUpload || job.postedDate === 'Just now') && (
                          <span style={{ background: '#ffffff', color: '#000000', fontSize: '0.62rem', fontWeight: '900', padding: '1px 5px', borderRadius: '4px' }}>
                            ● LIVE NOW
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {job.company} • {job.location}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#ffffff' }}>
                      {job.salary}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '2px 6px', fontSize: '0.68rem', color: '#d4d4d4' }}>
                      {job.jobType}
                    </span>
                    <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '2px 6px', fontSize: '0.68rem', color: '#d4d4d4' }}>
                      {job.workMode}
                    </span>
                    <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '2px 6px', fontSize: '0.68rem', color: '#d4d4d4' }}>
                      {job.experience}
                    </span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      <Users size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />
                      {applications.filter(a => a.jobId === job.id).length} in review ({job.applicantsCount || 0} platform applied)
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section: Candidate Pipeline & Actions */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#fff' }}>
              Candidate Applications Pipeline ({applications.length})
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Real-time review</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border-subtle)' }}>
                <Users size={28} style={{ margin: '0 auto 8px auto', opacity: 0.4, color: '#818cf8' }} />
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>No Applications Received Yet</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>When students apply to your active postings, their profiles and pipeline stages will appear here.</div>
              </div>
            ) : (
              applications.map(app => (
                <div key={app.id} className="glass-card" style={{ padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#fff' }}>
                      {app.applicantName || 'Candidate Applicant'}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#38bdf8' }}>
                      Applied for: {app.jobTitle}
                    </div>
                  </div>

                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.68rem',
                    fontWeight: '700',
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: '#818cf8',
                    border: '1px solid rgba(99, 102, 241, 0.4)'
                  }}>
                    Current: {app.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={12} /> Resume: {app.resumeUsed}
                </div>

                {/* Recruiter Action Buttons to Advance Pipeline */}
                <div style={{
                  display: 'flex',
                  gap: '6px',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '10px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => onUpdateCandidateStatus(app.id, 'Shortlisted', 'Profile verified and shortlisted for technical assessment.')}
                    disabled={app.status === 'Shortlisted'}
                    style={{
                      flex: 1,
                      padding: '5px 8px',
                      borderRadius: '6px',
                      background: app.status === 'Shortlisted' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(52, 211, 153, 0.4)',
                      color: '#34d399',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Shortlist ✓
                  </button>

                  <button
                    onClick={() => setCandidateForInterview(app)}
                    style={{
                      flex: 1,
                      padding: '5px 8px',
                      borderRadius: '6px',
                      background: app.status === 'Interview' ? 'rgba(96, 165, 250, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(96, 165, 250, 0.4)',
                      color: '#60a5fa',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Interview 📅
                  </button>

                  <button
                    onClick={() => onUpdateCandidateStatus(app.id, 'Offer', 'Offer Letter drafted with full compensation details.')}
                    disabled={app.status === 'Offer'}
                    style={{
                      flex: 1,
                      padding: '5px 8px',
                      borderRadius: '6px',
                      background: app.status === 'Offer' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(251, 191, 36, 0.4)',
                      color: '#fbbf24',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Offer 📄
                  </button>

                  <button
                    onClick={() => setCandidateForReject(app)}
                    style={{
                      flex: 1,
                      padding: '5px 8px',
                      borderRadius: '6px',
                      background: app.status === 'Rejected' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(244, 63, 94, 0.4)',
                      color: '#f43f5e',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Reject ✕
                  </button>
                </div>
              </div>
            )))}
          </div>
        </div>
        </>
      ) : (
        /* Talent Discovery & Sourcing View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '8px 12px',
            gap: '8px'
          }}>
            <Search size={15} color="var(--text-muted)" />
            <input
              type="text"
              value={talentSearchQuery}
              onChange={(e) => setTalentSearchQuery(e.target.value)}
              placeholder="Search talent by skill (e.g. React, Node, Python), college, role..."
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '0.78rem',
                width: '100%',
                outline: 'none'
              }}
            />
            {talentSearchQuery && (
              <button onClick={() => setTalentSearchQuery('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              Showing <strong>{filteredCandidates.length}</strong> active student candidates:
            </span>
            <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: '700' }}>
              ● 100% Verified Profiles
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredCandidates.map(cand => {
              const isInvited = invitedCandidateIds.includes(cand.id);

              return (
                <div key={cand.id} className="glass-card" style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#fff' }}>
                        {cand.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#818cf8', fontWeight: '600' }}>
                        {cand.role}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <GraduationCap size={12} /> {cand.college} • Batch {cand.graduationYear} (CGPA: {cand.cgpa})
                      </div>
                    </div>

                    <span style={{
                      background: 'rgba(52, 211, 153, 0.15)',
                      border: '1px solid rgba(52, 211, 153, 0.4)',
                      color: '#34d399',
                      fontSize: '0.68rem',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {cand.atsScore}% ATS
                    </span>
                  </div>

                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '8px 0', lineHeight: '1.4' }}>
                    {cand.bio}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                    {cand.skills.map(s => (
                      <span key={s} className="pill-tag tag-blue" style={{ fontSize: '0.64rem', padding: '2px 6px' }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '8px'
                  }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      Available: <strong style={{ color: '#fff' }}>{cand.availability}</strong> • {cand.location}
                    </span>

                    <button
                      onClick={() => {
                        setCandidateForInvite(cand);
                        setInviteJobId(jobs[0]?.id || 'job-1');
                      }}
                      disabled={isInvited}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '8px',
                        border: isInvited ? '1px solid #10b981' : '1px solid rgba(99, 102, 241, 0.5)',
                        background: isInvited ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                        color: isInvited ? '#10b981' : '#818cf8',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        cursor: isInvited ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isInvited ? (
                        <>
                          <CheckCircle2 size={12} /> Fast-Track Invited
                        </>
                      ) : (
                        <>
                          <Send size={12} /> Fast-Track Invite
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      </div>

      {/* Direct Candidate Fast-Track Invite Modal */}
      {candidateForInvite && (
        <div className="modal-overlay" onClick={() => setCandidateForInvite(null)}>
          <div className="bottom-sheet" style={{ maxHeight: '85%' }} onClick={(e) => e.stopPropagation()}>
            <div className="sheet-drag-handle" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
                  Send Fast-Track Invitation ⚡
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#818cf8' }}>
                  Candidate: {candidateForInvite.name} ({candidateForInvite.role})
                </p>
              </div>
              <button onClick={() => setCandidateForInvite(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                  Select Opening to Invite Candidate:
                </label>
                <select
                  value={inviteJobId}
                  onChange={(e) => setInviteJobId(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#fff',
                    fontSize: '0.8rem'
                  }}
                >
                  {jobs.map(j => (
                    <option key={j.id} value={j.id} style={{ background: '#171717' }}>
                      {j.title} ({j.salary} • {j.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                  Personalized Recruiter Note:
                </label>
                <textarea
                  rows={3}
                  value={inviteNote}
                  onChange={(e) => setInviteNote(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{
                padding: '8px 10px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)'
              }}>
                ℹ️ This will immediately dispatch a priority push notification directly to {candidateForInvite.name}'s Notification Center.
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={handleSendInvite}
                style={{ padding: '10px', fontSize: '0.82rem', marginTop: '6px' }}
              >
                <Send size={14} /> Dispatch Direct Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {showPostJobModal && (
        <div className="modal-overlay" onClick={() => setShowPostJobModal(false)}>
          <div className="bottom-sheet" style={{ maxHeight: '88%' }} onClick={(e) => e.stopPropagation()}>
            <div className="sheet-drag-handle" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>Post New Job / Internship</h3>
              <button onClick={() => setShowPostJobModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Job Title</label>
                <input
                  type="text"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Job Type</label>
                  <select
                    value={jobForm.jobType}
                    onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Part Time">Part Time</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Work Mode</label>
                  <select
                    value={jobForm.workMode}
                    onChange={(e) => setJobForm({ ...jobForm, workMode: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Location</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Salary / Stipend</label>
                  <input
                    type="text"
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Required Skills (comma separated)</label>
                <input
                  type="text"
                  value={jobForm.skills}
                  onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Role Description</label>
                <textarea
                  rows={2}
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem', resize: 'none' }}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                <Send size={15} /> Publish Live Posting
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Technical Interview Modal */}
      {candidateForInterview && (
        <div className="modal-overlay" onClick={() => setCandidateForInterview(null)}>
          <div className="bottom-sheet" style={{ maxHeight: '90%' }} onClick={(e) => e.stopPropagation()}>
            <div className="sheet-drag-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>Schedule Technical Interview 📅</h3>
                <p style={{ fontSize: '0.74rem', color: '#60a5fa' }}>Candidate: {candidateForInterview.applicantName} ({candidateForInterview.jobTitle})</p>
              </div>
              <button onClick={() => setCandidateForInterview(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Date</label>
                  <input
                    type="text"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    placeholder="e.g. Tomorrow or Nov 2"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Time Slot</label>
                  <input
                    type="text"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    placeholder="e.g. 4:00 PM IST"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Interviewer / Tech Lead</label>
                <input
                  type="text"
                  value={interviewer}
                  onChange={(e) => setInterviewer(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Google Meet / Video Room URL</label>
                <input
                  type="text"
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Evaluation Focus / Topics</label>
                <input
                  type="text"
                  value={interviewTopics}
                  onChange={(e) => setInterviewTopics(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <button
                type="button"
                className="btn-primary"
                style={{ marginTop: '8px', background: '#2563eb' }}
                onClick={() => {
                  onUpdateCandidateStatus(
                    candidateForInterview.id,
                    'Interview',
                    `Technical interview scheduled with ${interviewer} on ${interviewDate} at ${interviewTime}.`,
                    {
                      interviewDetails: {
                        date: interviewDate,
                        time: interviewTime,
                        interviewer: interviewer,
                        meetUrl: meetLink,
                        round: 'Technical Round 1',
                        topics: interviewTopics
                      }
                    }
                  );
                  setCandidateForInterview(null);
                }}
              >
                <Calendar size={15} /> Confirm & Send Interview Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline / Reject Candidate Modal */}
      {candidateForReject && (
        <div className="modal-overlay" onClick={() => setCandidateForReject(null)}>
          <div className="bottom-sheet" style={{ maxHeight: '90%' }} onClick={(e) => e.stopPropagation()}>
            <div className="sheet-drag-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>Decline Candidate ✕</h3>
                <p style={{ fontSize: '0.74rem', color: '#f43f5e' }}>Candidate: {candidateForReject.applicantName} ({candidateForReject.jobTitle})</p>
              </div>
              <button onClick={() => setCandidateForReject(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Select Reason</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    'Skills gap in required technology stack',
                    'Experience level does not match current vacancy',
                    'Position already filled by earlier candidate',
                    'Assessment threshold not met'
                  ].map(reason => (
                    <div
                      key={reason}
                      onClick={() => setRejectReason(reason)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: rejectReason === reason ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${rejectReason === reason ? '#f43f5e' : 'var(--border-subtle)'}`,
                        color: rejectReason === reason ? '#fff' : 'var(--text-secondary)',
                        fontSize: '0.76rem',
                        cursor: 'pointer'
                      }}
                    >
                      {reason}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Constructive Upskilling Feedback</label>
                <textarea
                  rows={3}
                  value={rejectFeedback}
                  onChange={(e) => setRejectFeedback(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem', resize: 'none' }}
                />
              </div>

              <button
                type="button"
                className="btn-primary"
                style={{ marginTop: '8px', background: '#dc2626' }}
                onClick={() => {
                  onUpdateCandidateStatus(
                    candidateForReject.id,
                    'Rejected',
                    `Application reviewed. Not moving forward at this time: ${rejectReason}. Feedback: ${rejectFeedback}`,
                    {
                      rejectionReason: `${rejectReason}. ${rejectFeedback}`
                    }
                  );
                  setCandidateForReject(null);
                }}
              >
                Confirm Decline & Send Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
