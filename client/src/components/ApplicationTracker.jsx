import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, Calendar, Video, FileText, 
  ChevronDown, ChevronUp, AlertCircle, Trash2, ExternalLink,
  Sparkles, Award, Mic, MicOff, VideoOff, PhoneOff, X, BookOpen, AlertTriangle, Download
} from 'lucide-react';
import OfferLetterModal from './OfferLetterModal';
import MockInterviewSimulatorModal from './MockInterviewSimulatorModal';

export default function ApplicationTracker({
  applications,
  onWithdrawApplication,
  onSelectJobForDetails,
  allJobs
}) {
  const [filterTab, setFilterTab] = useState('All'); // All, Active, Shortlisted, Interview, Offer, Rejected
  const [expandedAppId, setExpandedAppId] = useState(applications[0]?.id || null);
  const [selectedOfferApp, setSelectedOfferApp] = useState(null);
  const [videoInterviewApp, setVideoInterviewApp] = useState(null);
  const [aiPrepApp, setAiPrepApp] = useState(null);
  const [mockSimulatorJob, setMockSimulatorJob] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  const downloadIcsCalendar = (app) => {
    const summary = `Technical Interview: ${app.jobTitle} with ${app.company}`;
    const description = `Technical discussion with ${app.interviewDetails?.interviewer || 'Tech Lead'}. Google Meet Room: ${app.interviewDetails?.link || 'https://meet.google.com/abc-tech-interview'}`;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//JobFinder Pro//Calendar Engine//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:Google Meet`,
      'DTSTART:20261028T103000Z',
      'DTEND:20261028T113000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Interview_${app.company.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openGoogleCalendar = (app) => {
    const title = encodeURIComponent(`Interview: ${app.jobTitle} at ${app.company}`);
    const details = encodeURIComponent(`Interviewer: ${app.interviewDetails?.interviewer || 'Engineering Lead'}\nTopics: ${app.interviewDetails?.topics || 'System Architecture'}`);
    const location = encodeURIComponent(app.interviewDetails?.link || 'https://meet.google.com/abc-tech-interview');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  const tabs = ['All', 'Active', 'Shortlisted', 'Interview', 'Offer', 'Rejected'];

  const filteredApps = applications.filter(app => {
    if (filterTab === 'All') return true;
    if (filterTab === 'Active') return !['Offer', 'Rejected'].includes(app.status);
    return app.status.toLowerCase() === filterTab.toLowerCase();
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shortlisted': return '#34d399';
      case 'Interview': return '#60a5fa';
      case 'Offer': return '#fbbf24';
      case 'Under Review': return '#c084fc';
      case 'Applied': return '#94a3b8';
      default: return '#f43f5e';
    }
  };

  return (
    <div className="app-viewport">
      {/* Header */}
      <div style={{ padding: '16px 20px 12px 20px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
          My Applications 📋
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Track your real-time recruitment pipeline & interview schedules
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        padding: '0 20px 14px 20px',
        scrollbarWidth: 'none'
      }}>
        {tabs.map(tab => {
          const isSelected = filterTab === tab;
          const count = applications.filter(a => {
            if (tab === 'All') return true;
            if (tab === 'Active') return !['Offer', 'Rejected'].includes(a.status);
            return a.status.toLowerCase() === tab.toLowerCase();
          }).length;

          return (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              style={{
                whiteSpace: 'nowrap',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                background: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                color: isSelected ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.76rem',
                fontWeight: isSelected ? '600' : '400',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{tab}</span>
              <span style={{
                background: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                padding: '1px 6px',
                borderRadius: '10px',
                fontSize: '0.68rem',
                fontWeight: '700'
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      <div style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredApps.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 16px',
            color: 'var(--text-muted)',
            fontSize: '0.85rem'
          }}>
            <FileText size={36} style={{ margin: '0 auto 12px auto', opacity: 0.3 }} />
            No applications in the "{filterTab}" category yet.
          </div>
        ) : (
          filteredApps.map(app => {
            const isExpanded = expandedAppId === app.id;
            const statusColor = getStatusColor(app.status);

            return (
              <div
                key={app.id}
                className="glass-card"
                style={{
                  padding: '16px',
                  border: isExpanded ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid var(--border-subtle)'
                }}
              >
                {/* Header Row */}
                <div 
                  style={{ display: 'flex', gap: '12px', cursor: 'pointer' }}
                  onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                >
                  <img
                    src={app.companyLogo}
                    alt={app.company}
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
                      <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#fff' }}>
                        {app.jobTitle}
                      </div>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.68rem',
                        fontWeight: '700',
                        background: `${statusColor}22`,
                        border: `1px solid ${statusColor}55`,
                        color: statusColor
                      }}>
                        {app.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {app.company} • {app.location}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Applied on {new Date(app.appliedDate).toLocaleDateString()}
                      </span>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                          fontSize: '0.74rem',
                          cursor: 'pointer'
                        }}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Timeline View */}
                {isExpanded && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#818cf8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} /> Application Progress Timeline
                    </div>

                    {/* Timeline Tracker Pipeline */}
                    <div style={{ position: 'relative', paddingLeft: '22px' }}>
                      {/* Vertical line */}
                      <div style={{
                        position: 'absolute',
                        left: '7px',
                        top: '8px',
                        bottom: '12px',
                        width: '2px',
                        background: 'rgba(255, 255, 255, 0.1)'
                      }} />

                      {app.timeline.map((step, idx) => {
                        const isDone = step.completed;
                        const isCurrent = step.step === app.status;

                        return (
                          <div key={idx} style={{ position: 'relative', marginBottom: '16px' }}>
                            {/* Dot / Check Icon */}
                            <div style={{
                              position: 'absolute',
                              left: '-22px',
                              top: '2px',
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              background: isDone ? '#10b981' : (isCurrent ? 'var(--primary)' : '#1e293b'),
                              border: `2px solid ${isDone ? '#10b981' : (isCurrent ? 'var(--primary)' : '#475569')}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: isCurrent ? '0 0 10px var(--primary)' : 'none'
                            }}>
                              {isDone && <CheckCircle2 size={10} color="#fff" />}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <span style={{
                                fontSize: '0.82rem',
                                fontWeight: isDone ? '700' : '500',
                                color: isDone ? '#fff' : 'var(--text-muted)'
                              }}>
                                {step.title}
                              </span>
                              <span style={{ fontSize: '0.68rem', color: isDone ? '#38bdf8' : 'var(--text-muted)' }}>
                                {step.date}
                              </span>
                            </div>

                            {step.note && (
                              <p style={{
                                fontSize: '0.74rem',
                                color: isDone ? 'var(--text-secondary)' : 'var(--text-muted)',
                                marginTop: '2px',
                                lineHeight: '1.4'
                              }}>
                                {step.note}
                              </p>
                            )}

                            {/* If Interview Round is scheduled, show Google Meet join card! */}
                            {(step.step === 'Interview' && isDone) || (app.status === 'Interview' && step.step === 'Interview') ? (
                              <div style={{
                                marginTop: '10px',
                                padding: '12px',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(59, 130, 246, 0.12)',
                                border: '1px solid rgba(59, 130, 246, 0.35)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Video size={16} color="#60a5fa" />
                                    <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: '700' }}>
                                      Technical Video Interview Scheduled 🎯
                                    </span>
                                  </div>
                                  <span style={{ fontSize: '0.68rem', color: '#93c5fd', background: 'rgba(59, 130, 246, 0.2)', padding: '2px 8px', borderRadius: '10px' }}>
                                    {app.interviewDetails?.time || '4:00 PM IST'}
                                  </span>
                                </div>

                                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                                  Interviewer: <span style={{ color: '#fff', fontWeight: '600' }}>{app.interviewDetails?.interviewer || 'Senior Staff Engineer'}</span>
                                  {app.interviewDetails?.topics && (
                                    <div style={{ marginTop: '2px', color: '#cbd5e1' }}>
                                      Topics: {app.interviewDetails.topics}
                                    </div>
                                  )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                                  <div style={{ display: 'flex', gap: '6px' }}>
                                    <button
                                      onClick={() => setVideoInterviewApp(app)}
                                      className="btn-primary"
                                      style={{ flex: 1, padding: '7px 10px', fontSize: '0.72rem', background: '#2563eb' }}
                                    >
                                      <Video size={13} /> Join Virtual Room
                                    </button>

                                    <button
                                      onClick={() => {
                                        const linkedJob = allJobs?.find(j => j.id === app.jobId) || {
                                          title: app.jobTitle,
                                          company: app.company,
                                          interviewPrep: {
                                            technicalQuestions: [
                                              "Explain your core architectural choices in previous production applications.",
                                              "How do you troubleshoot high latency or memory leaks?",
                                              "Describe a high-stakes technical disagreement and how you resolved it."
                                            ],
                                            proTip: "Use clear metrics and the STAR framework."
                                          }
                                        };
                                        setMockSimulatorJob(linkedJob);
                                      }}
                                      style={{
                                        flex: 1,
                                        padding: '7px 10px',
                                        fontSize: '0.72rem',
                                        borderRadius: '8px',
                                        background: 'rgba(99, 102, 241, 0.2)',
                                        border: '1px solid rgba(99, 102, 241, 0.4)',
                                        color: '#818cf8',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px'
                                      }}
                                    >
                                      <Sparkles size={13} color="#818cf8" /> Practice AI Simulator
                                    </button>
                                  </div>

                                  <div style={{ display: 'flex', gap: '6px' }}>
                                    <button
                                      onClick={() => downloadIcsCalendar(app)}
                                      style={{
                                        flex: 1,
                                        padding: '5px 8px',
                                        fontSize: '0.68rem',
                                        borderRadius: '6px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px'
                                      }}
                                      title="Download .ics Calendar Invite"
                                    >
                                      <Calendar size={11} color="#38bdf8" /> Add to Apple/Outlook (.ics)
                                    </button>

                                    <button
                                      onClick={() => openGoogleCalendar(app)}
                                      style={{
                                        flex: 1,
                                        padding: '5px 8px',
                                        fontSize: '0.68rem',
                                        borderRadius: '6px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px'
                                      }}
                                    >
                                      <ExternalLink size={11} color="#10b981" /> Google Calendar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : null}

                            {/* If Rejected, show constructive feedback card */}
                            {app.status === 'Rejected' && step.step === 'Rejected' && (
                              <div style={{
                                marginTop: '10px',
                                padding: '12px',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(244, 63, 94, 0.1)',
                                border: '1px solid rgba(244, 63, 94, 0.35)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f43f5e', fontWeight: '700', fontSize: '0.8rem' }}>
                                  <AlertCircle size={16} /> Constructive Recruiter Feedback
                                </div>
                                <div style={{ fontSize: '0.74rem', color: '#e2e8f0', lineHeight: '1.4' }}>
                                  {app.rejectionReason || "Thank you for your time. Currently our requirements focus on candidates with more hands-on production system design."}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#fbbf24', marginTop: '4px', background: 'rgba(251, 191, 36, 0.1)', padding: '6px 8px', borderRadius: '6px' }}>
                                  💡 <b>Next Steps:</b> Strengthen data structures & system APIs, and feel welcome to reapply after 60 days!
                                </div>
                              </div>
                            )}

                            {/* If Offer Letter step, show official offer letter button ONLY when offer is genuinely issued! */}
                            {step.step === 'Offer' && (app.status === 'Offer' || isDone || app.offerStatus === 'accepted') && (
                              <div style={{
                                marginTop: '10px',
                                padding: '10px 12px',
                                borderRadius: 'var(--radius-md)',
                                background: '#171717',
                                border: '1px solid #ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}>
                                <div>
                                  <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#fff' }}>
                                    Official Employment Offer 📄
                                  </div>
                                  <div style={{ fontSize: '0.68rem', color: '#a3a3a3' }}>
                                    From {app.company}
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOfferApp(app);
                                  }}
                                  className="btn-primary"
                                  style={{ padding: '5px 12px', fontSize: '0.72rem' }}
                                >
                                  View Offer Letter
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Resume Used Info & Actions */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-subtle)',
                      fontSize: '0.74rem'
                    }}>
                      <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FileText size={13} /> Attached: {app.resumeUsed}
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Withdraw application for ${app.jobTitle}?`)) {
                            onWithdrawApplication(app.id);
                          }
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#f43f5e',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.72rem',
                          fontWeight: '600'
                        }}
                      >
                        <Trash2 size={12} /> Withdraw
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Official Offer Letter Modal */}
      {selectedOfferApp && (
        <OfferLetterModal
          application={selectedOfferApp}
          onClose={() => setSelectedOfferApp(null)}
          onAccept={(appId) => {
            alert(`Congratulations! You have accepted the employment offer from ${selectedOfferApp.company}! 🎉`);
            setSelectedOfferApp(null);
          }}
          onDecline={(appId) => {
            alert(`You declined the offer from ${selectedOfferApp.company}.`);
            setSelectedOfferApp(null);
          }}
        />
      )}

      {/* Interactive Video Interview Simulator Modal */}
      {videoInterviewApp && (
        <div className="modal-overlay" onClick={() => setVideoInterviewApp(null)}>
          <div className="bottom-sheet" style={{ maxHeight: '92%', background: '#09090b' }} onClick={(e) => e.stopPropagation()}>
            <div className="sheet-drag-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: '800' }}>● LIVE INTERVIEW IN PROGRESS</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>{videoInterviewApp.company} Technical Round</h3>
              </div>
              <button onClick={() => setVideoInterviewApp(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Video Streams */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              {/* Interviewer stream */}
              <div style={{
                background: '#18181b',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '140px',
                border: '1px solid rgba(255,255,255,0.08)',
                position: 'relative'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '800',
                  fontSize: '1.1rem',
                  marginBottom: '6px'
                }}>
                  {videoInterviewApp.company?.[0] || 'T'}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fff' }}>
                  {videoInterviewApp.interviewDetails?.interviewer || 'Vikram Sharma'}
                </div>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Tech Lead (Speaking...)</div>
              </div>

              {/* Student stream */}
              <div style={{
                background: isVideoMuted ? '#000' : '#18181b',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '140px',
                border: '1px solid rgba(255,255,255,0.08)',
                position: 'relative'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '800',
                  fontSize: '1.1rem',
                  marginBottom: '6px'
                }}>
                  You
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fff' }}>You (Candidate)</div>
                <div style={{ fontSize: '0.66rem', color: isMicMuted ? '#f43f5e' : '#34d399' }}>
                  {isMicMuted ? 'Muted' : 'Audio Connected'}
                </div>
              </div>
            </div>

            {/* Current Question prompt */}
            <div style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '10px', padding: '12px', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>
                Active Question
              </div>
              <div style={{ fontSize: '0.8rem', color: '#fff', lineHeight: '1.4' }}>
                "Could you walk me through how you optimize React component re-renders when dealing with large lists?"
              </div>
            </div>

            {/* Control bar */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setIsMicMuted(!isMicMuted)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-full)',
                  background: isMicMuted ? '#dc2626' : 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.76rem'
                }}
              >
                {isMicMuted ? <MicOff size={15} /> : <Mic size={15} />}
                {isMicMuted ? 'Unmute' : 'Mute'}
              </button>

              <button
                onClick={() => setIsVideoMuted(!isVideoMuted)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-full)',
                  background: isVideoMuted ? '#dc2626' : 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.76rem'
                }}
              >
                {isVideoMuted ? <VideoOff size={15} /> : <Video size={15} />}
                {isVideoMuted ? 'Start Video' : 'Stop Video'}
              </button>

              <button
                onClick={() => {
                  alert("Interview session ended. The recruiter will review your score and share next steps!");
                  setVideoInterviewApp(null);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-full)',
                  background: '#dc2626',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.76rem',
                  fontWeight: '700'
                }}
              >
                <PhoneOff size={15} /> End Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Interview Prep Modal */}
      {aiPrepApp && (
        <div className="modal-overlay" onClick={() => setAiPrepApp(null)}>
          <div className="bottom-sheet" style={{ maxHeight: '90%' }} onClick={(e) => e.stopPropagation()}>
            <div className="sheet-drag-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>AI Interview Prep ⚡</h3>
                <p style={{ fontSize: '0.74rem', color: '#f59e0b' }}>Target: {aiPrepApp.company} • {aiPrepApp.jobTitle}</p>
              </div>
              <button onClick={() => setAiPrepApp(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#38bdf8', marginBottom: '4px' }}>
                  Q1: How do you handle distributed caching and rate-limiting?
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  <b>Model Answer:</b> Explain Redis cache-aside pattern with TTL expiration, combined with Token Bucket algorithm for fair rate-limiting across concurrent requests.
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#38bdf8', marginBottom: '4px' }}>
                  Q2: How do you structure React state for optimal re-renders?
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  <b>Model Answer:</b> Keep state localized, use `useMemo` & `useCallback` for expensive derivations, and adopt normalized state stores like Zustand or Redux Toolkit.
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#38bdf8', marginBottom: '4px' }}>
                  Q3: Behavioral: Tell me about a time a production bug occurred.
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  <b>STAR Technique:</b> Situation (high latency), Task (isolate bottleneck), Action (added indexing & circuit breaker), Result (latency dropped by 75%).
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ marginTop: '6px' }}
                onClick={() => setAiPrepApp(null)}
              >
                Got It! Ready to Ace the Round 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Mock Practice Simulator Modal */}
      {mockSimulatorJob && (
        <MockInterviewSimulatorModal
          isOpen={!!mockSimulatorJob}
          onClose={() => setMockSimulatorJob(null)}
          job={mockSimulatorJob}
        />
      )}
    </div>
  );
}
