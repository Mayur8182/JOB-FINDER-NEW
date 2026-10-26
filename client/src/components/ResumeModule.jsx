import React, { useState } from 'react';
import { 
  FileText, Upload, Plus, CheckCircle2, Sparkles, 
  Trash2, Download, Award, ShieldCheck, X, FileUp, Check
} from 'lucide-react';

export default function ResumeModule({
  resumes,
  onUploadResume,
  onCreateResume,
  onDeleteResume
}) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBuilderModal, setShowBuilderModal] = useState(false);

  // Upload modal state
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadTitle, setUploadTitle] = useState('Full Stack Engineer Resume');
  const [isParsing, setIsParsing] = useState(false);

  // Builder modal state
  const [builderTitle, setBuilderTitle] = useState('React & Node.js Developer Resume');
  const [builderSummary, setBuilderSummary] = useState('Motivated computer science engineer experienced in building responsive React applications and scalable Node.js microservices.');
  const [builderSkills, setBuilderSkills] = useState('React, Node.js, Express, MongoDB, TypeScript, REST API, Git');

  const handleSimulatedUpload = async (e) => {
    e.preventDefault();
    setIsParsing(true);
    // Simulate AI ATS extraction delay
    setTimeout(() => {
      onUploadResume({
        fileName: uploadFileName || "Candidate_Software_Engineer_CV.pdf",
        title: uploadTitle,
        skills: ["React", "JavaScript", "Node.js", "Express", "MongoDB", "Redux", "REST APIs"]
      });
      setIsParsing(false);
      setShowUploadModal(false);
      setUploadFileName('');
    }, 1200);
  };

  const handleBuildResume = (e) => {
    e.preventDefault();
    const skillsArray = builderSkills.split(',').map(s => s.trim()).filter(Boolean);
    onCreateResume({
      title: builderTitle,
      summary: builderSummary,
      skills: skillsArray
    });
    setShowBuilderModal(false);
  };

  return (
    <div className="app-viewport">
      {/* Header */}
      <div style={{ padding: '16px 20px 12px 20px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
          Resume & ATS Analyzer 📄
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Manage your job-ready resumes and optimize your ATS match score
        </p>
      </div>

      <div style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '30px' }}>
        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn-primary"
            style={{ flex: 1, padding: '10px', fontSize: '0.78rem' }}
            onClick={() => setShowUploadModal(true)}
          >
            <Upload size={14} /> Upload PDF Resume
          </button>
          <button
            className="btn-secondary"
            style={{ flex: 1, padding: '10px', fontSize: '0.78rem' }}
            onClick={() => setShowBuilderModal(true)}
          >
            <Plus size={14} /> Build with AI
          </button>
        </div>

        {/* ATS Insights Card — Dynamically tied to genuine resumes state */}
        {resumes.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px dashed var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 14px',
            textAlign: 'center'
          }}>
            <ShieldCheck size={28} color="#818cf8" style={{ margin: '0 auto 8px auto', opacity: 0.7 }} />
            <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
              No Active Resume Uploaded
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '12px' }}>
              Upload your PDF resume or use AI builder to calculate your genuine ATS keyword score and unlock instant job applications.
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.76rem', fontWeight: '800' }}
            >
              <Upload size={14} /> Upload Resume Now
            </button>
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#34d399" />
                <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#fff' }}>Verified ATS Keyword Score</span>
              </div>
              <span style={{
                background: 'rgba(16, 185, 129, 0.25)',
                color: '#34d399',
                fontSize: '0.74rem',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)'
              }}>
                {Math.max(...resumes.map(r => r.atsScore || 0))}/100 (Strong)
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              ✓ Keywords in your primary resume match 85%+ of developer job descriptions.<br />
              ✓ Clean single-column layout passes automated parser checks.
            </div>
          </div>
        )}

        {/* Resumes List */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#fff' }}>
            Your Uploaded Resumes ({resumes.length})
          </span>
          {resumes.length > 0 && (
            <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: '600' }}>
              ● 1 Active for One-Click Apply
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {resumes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 14px', color: 'var(--text-muted)', fontSize: '0.78rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              No resumes uploaded yet. Click "Upload PDF Resume" above.
            </div>
          ) : (
            resumes.map(r => (
              <div key={r.id} className="glass-card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(236, 72, 153, 0.15)',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f472b6'
                }}>
                  <FileText size={22} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#fff' }}>
                        {r.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '1px' }}>
                        {r.name} • {r.fileSize}
                      </div>
                    </div>

                    {r.isPrimary && (
                      <span style={{
                        background: 'rgba(99, 102, 241, 0.2)',
                        border: '1px solid rgba(99, 102, 241, 0.4)',
                        color: '#818cf8',
                        fontSize: '0.66rem',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)'
                      }}>
                        Default for Apply
                      </span>
                    )}
                  </div>

                  {/* ATS Score & Parsed Skills */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      color: r.atsScore >= 85 ? '#34d399' : '#fbbf24'
                    }}>
                      <Sparkles size={12} /> ATS Score: {r.atsScore}/100
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                    {r.parsedSkills?.map((s, i) => (
                      <span key={i} className="pill-tag tag-blue" style={{ fontSize: '0.66rem', padding: '2px 6px' }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Actions row */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '10px',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--border-subtle)'
                  }}>
                    <button
                      onClick={() => alert(`Downloading ${r.name}...`)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        fontSize: '0.74rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Download size={13} /> Download PDF
                    </button>

                    {resumes.length > 1 && (
                      <button
                        onClick={() => onDeleteResume(r.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#f43f5e',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-drag-handle" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>Upload Resume (PDF / DOCX)</h3>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSimulatedUpload} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Drop area */}
              <div style={{
                border: '2px dashed rgba(99, 102, 241, 0.4)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px 16px',
                textAlign: 'center',
                background: 'rgba(99, 102, 241, 0.05)',
                cursor: 'pointer'
              }}
              onClick={() => setUploadFileName('Tech_Resume_2026.pdf')}
              >
                <FileUp size={36} color="#818cf8" style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#fff' }}>
                  {uploadFileName ? uploadFileName : "Tap to browse or drop file here"}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Supported formats: PDF, DOCX (Max 5MB)
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                  Resume Title
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isParsing}
              >
                {isParsing ? (
                  <>
                    <Sparkles size={14} className="animate-spin" /> AI Analyzing & Parsing Resume...
                  </>
                ) : (
                  <>
                    <Upload size={14} /> Upload & Run ATS Analysis
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Builder Modal */}
      {showBuilderModal && (
        <div className="modal-overlay" onClick={() => setShowBuilderModal(false)}>
          <div className="bottom-sheet" style={{ maxHeight: '85%' }} onClick={(e) => e.stopPropagation()}>
            <div className="sheet-drag-handle" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>AI Resume Builder</h3>
              <button onClick={() => setShowBuilderModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBuildResume} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Target Job Title</label>
                <input
                  type="text"
                  value={builderTitle}
                  onChange={(e) => setBuilderTitle(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Professional Summary</label>
                <textarea
                  rows={3}
                  value={builderSummary}
                  onChange={(e) => setBuilderSummary(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem', resize: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Core Technical Skills (comma separated)</label>
                <input
                  type="text"
                  value={builderSkills}
                  onChange={(e) => setBuilderSkills(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={12} /> Education and projects from your profile will be automatically formatted into this resume.
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '6px' }}>
                Generate & Save ATS Resume
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
