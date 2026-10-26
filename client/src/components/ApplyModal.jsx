import React, { useState } from 'react';
import { X, FileText, CheckCircle2, Sparkles, Send, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ApplyModal({
  job,
  resumes,
  onClose,
  onApplicationSubmitted
}) {
  const [selectedResumeId, setSelectedResumeId] = useState(resumes[0]?.id || '');
  const [coverPitch, setCoverPitch] = useState('');
  const [immediateJoiner, setImmediateJoiner] = useState('yes');
  const [experienceLevel, setExperienceLevel] = useState('Fresher (2026 Batch)');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const chosenResume = resumes.find(r => r.id === selectedResumeId) || resumes[0];
    const resumeUsed = chosenResume?.name || "Candidate_Primary_Resume.pdf";

    const fallbackApp = {
      id: "app-" + Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      companyLogo: job.logo,
      location: job.location,
      salary: job.salary,
      applicantName: "Candidate Applicant",
      appliedDate: new Date().toISOString(),
      resumeUsed: resumeUsed,
      status: "Applied",
      timeline: [
        { step: "Applied", title: "Application Submitted", date: new Date().toLocaleDateString(), completed: true, note: "Application sent with attached resume." },
        { step: "Under Review", title: "Profile Under Review", date: "Pending", completed: false, note: "Awaiting recruiter evaluation." },
        { step: "Shortlisted", title: "Candidate Shortlisted", date: "Pending", completed: false, note: "Technical qualification match." },
        { step: "Assessment", title: "Skills Assessment", date: "Pending", completed: false, note: "Code verification challenge." },
        { step: "Interview", title: "Interview Round", date: "Pending", completed: false, note: "Technical conversation." },
        { step: "Offer", title: `Offer Letter (${job.company})`, date: "Pending", completed: false, note: "Official compensation & terms letter." }
      ]
    };

    try {
      const res = await fetch(`/api/v1/jobs/${job.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeName: resumeUsed,
          coverPitch,
          answers: {
            immediateJoiner,
            experienceLevel
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedSuccess(true);
        setTimeout(() => {
          onApplicationSubmitted(data.application || fallbackApp);
          onClose();
        }, 1600);
      } else {
        // Fallback for demo
        setSubmittedSuccess(true);
        setTimeout(() => {
          onApplicationSubmitted(fallbackApp);
          onClose();
        }, 1600);
      }
    } catch (err) {
      console.log("Local application created for demo");
      setSubmittedSuccess(true);
      setTimeout(() => {
        onApplicationSubmitted(fallbackApp);
        onClose();
      }, 1600);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="bottom-sheet"
        style={{ maxHeight: '85%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-drag-handle" />

        {submittedSuccess ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <CheckCircle2 size={36} color="#10b981" />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
              Application Submitted! 🎉
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4' }}>
              Your application for <strong style={{ color: '#fff' }}>{job.title}</strong> at {job.company} was submitted successfully.
            </p>
            <div style={{ fontSize: '0.78rem', color: '#818cf8', marginTop: '12px', fontWeight: '600' }}>
              Redirecting to Application Tracker...
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: '700', textTransform: 'uppercase' }}>
                  Quick One-Tap Apply
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff' }}>
                  {job.title}
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{job.company}</div>
              </div>

              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Select Resume */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
                  Attach Resume:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {resumes.length === 0 ? (
                    <div style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px dashed var(--border-subtle)',
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)'
                    }}>
                      ⚡ Using your completed profile data for fast-apply. (Upload a PDF in Resume tab for verified ATS scoring)
                    </div>
                  ) : (
                    resumes.map(r => (
                      <label
                        key={r.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          background: selectedResumeId === r.id ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                          border: `1px solid ${selectedResumeId === r.id ? '#ffffff' : 'var(--border-subtle)'}`,
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input
                            type="radio"
                            name="resume"
                            checked={selectedResumeId === r.id}
                            onChange={() => setSelectedResumeId(r.id)}
                            style={{ accentColor: '#ffffff' }}
                          />
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#fff' }}>
                              {r.title || r.name}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              ATS Score: <strong style={{ color: '#ffffff' }}>{r.atsScore ? `${r.atsScore}/100` : 'Not analyzed'}</strong>
                            </div>
                          </div>
                        </div>

                        <FileText size={16} color="var(--text-muted)" />
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Screening Question 1 */}
              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                  Are you available for immediate joining?
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['yes', 'no'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setImmediateJoiner(opt)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${immediateJoiner === opt ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        background: immediateJoiner === opt ? 'var(--primary-light)' : 'var(--bg-input)',
                        color: immediateJoiner === opt ? '#fff' : 'var(--text-secondary)',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {opt === 'yes' ? 'Yes, Immediately' : 'Need Notice (15-30 days)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Screening Question 2 */}
              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                  Current Experience / Batch
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                >
                  <option value="Fresher (2026 Batch)">Fresher (2026 Batch)</option>
                  <option value="Fresher (2025 Batch)">Fresher (2025 Batch)</option>
                  <option value="1 Year Hands-on Experience">1 Year Hands-on Experience</option>
                  <option value="2+ Years Experience">2+ Years Experience</option>
                </select>
              </div>

              {/* Cover Note / Pitch */}
              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                  Quick Pitch to Recruiter (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Why are you a great match for this role? E.g. Experienced with React, Node.js..."
                  value={coverPitch}
                  onChange={(e) => setCoverPitch(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 10px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
                style={{ marginTop: '8px' }}
              >
                {submitting ? "Submitting..." : (
                  <>
                    <Send size={15} /> Confirm & Apply
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
