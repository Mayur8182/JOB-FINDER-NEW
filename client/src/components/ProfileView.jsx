import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, GraduationCap, Briefcase, 
  Code2, Sparkles, Plus, X, Edit3, Award, ExternalLink, 
  Settings, LogOut, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function ProfileView({
  profile,
  onUpdateProfile,
  onLogout,
  onOpenResumeTab,
  resumes = []
}) {
  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [formData, setFormData] = useState({ ...profile });
  const [showAddEdu, setShowAddEdu] = useState(false);
  const [showAddExp, setShowAddExp] = useState(false);

  // Quick Add forms
  const [eduInst, setEduInst] = useState('');
  const [eduDeg, setEduDeg] = useState('');
  const [eduYear, setEduYear] = useState('2022 – 2026');
  const [eduScore, setEduScore] = useState('');

  const [expRole, setExpRole] = useState('');
  const [expComp, setExpComp] = useState('');
  const [expLoc, setExpLoc] = useState('Bangalore (Hybrid)');
  const [expDuration, setExpDuration] = useState('');
  const [expDesc, setExpDesc] = useState('');

  const popularSkills = ["Docker", "Kubernetes", "Next.js", "GraphQL", "Python", "AWS", "FastAPI"];

  // Genuine completion calculation based on actual saved data
  const calculateGenuineScore = (p) => {
    if (!p) return 0;
    let s = 0;
    if (p.name?.trim()) s += 15;
    if (p.headline?.trim()) s += 10;
    if (p.email?.trim() && p.phone?.trim()) s += 15;
    if (p.college?.trim() && p.degree?.trim()) s += 15;
    if (p.skills && p.skills.length >= 3) s += 15;
    else if (p.skills && p.skills.length > 0) s += 5;
    if (p.education && p.education.length > 0) s += 10;
    if (p.experience && p.experience.length > 0) s += 10;
    if (p.preferredLocation?.trim() || p.expectedSalary?.trim()) s += 10;
    return Math.min(100, s);
  };

  const completion = typeof profile?.completionPercent === 'number' && profile.completionPercent > 0
    ? profile.completionPercent
    : calculateGenuineScore(profile);

  const isProfileVerified = completion >= 80;

  const resumeCount = resumes?.length || 0;
  const topAtsScore = resumeCount > 0 
    ? Math.max(...resumes.map(r => r.atsScore || 0)) 
    : null;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        onUpdateProfile(data.profile);
        setEditing(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    }
  };

  const handleAddEducation = async () => {
    if (!eduInst.trim() || !eduDeg.trim()) {
      alert("Please provide institution and degree");
      return;
    }
    const newEdu = {
      id: "edu-" + Date.now(),
      institution: eduInst.trim(),
      degree: eduDeg.trim(),
      year: eduYear.trim() || "2022 – 2026",
      score: eduScore.trim() || "CGPA: 8.5 / 10"
    };
    const updatedEdu = [...(profile?.education || []), newEdu];
    const updated = { ...profile, education: updatedEdu };
    try {
      const res = await fetch('/api/v1/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.success) onUpdateProfile(data.profile);
      setShowAddEdu(false);
      setEduInst('');
      setEduDeg('');
      setEduScore('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExperience = async () => {
    if (!expRole.trim() || !expComp.trim()) {
      alert("Please provide role and company");
      return;
    }
    const newExp = {
      id: "exp-" + Date.now(),
      role: expRole.trim(),
      company: expComp.trim(),
      location: expLoc.trim() || "Remote",
      duration: expDuration.trim() || "3 months",
      description: expDesc.trim() || "Built production features and collaborated with engineering team."
    };
    const updatedExp = [...(profile?.experience || []), newExp];
    const updated = { ...profile, experience: updatedExp };
    try {
      const res = await fetch('/api/v1/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.success) onUpdateProfile(data.profile);
      setShowAddExp(false);
      setExpRole('');
      setExpComp('');
      setExpDesc('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSkill = async (skillToAdd) => {
    const s = skillToAdd || newSkill.trim();
    if (!s) return;
    if (profile?.skills?.includes(s)) return;

    const updatedSkills = [...(profile?.skills || []), s];
    try {
      const res = await fetch('/api/v1/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, skills: updatedSkills })
      });
      const data = await res.json();
      if (data.success) {
        onUpdateProfile(data.profile);
        setNewSkill('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    const updatedSkills = (profile?.skills || []).filter(s => s !== skillToRemove);
    try {
      const res = await fetch('/api/v1/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, skills: updatedSkills })
      });
      const data = await res.json();
      if (data.success) {
        onUpdateProfile(data.profile);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-viewport">
      {/* Profile Header */}
      <div style={{
        padding: '20px 20px 16px 20px',
        background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.25) 0%, transparent 100%)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '22px',
            background: 'var(--avatar-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: '800',
            fontSize: '1.6rem',
            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)',
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }}>
            {profile?.name ? profile.name.charAt(0).toUpperCase() : 'M'}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                setFormData({ ...profile });
                setEditing(true);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '6px 12px',
                color: '#fff',
                fontSize: '0.74rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <Edit3 size={13} /> Edit Profile
            </button>

            <button
              onClick={onLogout}
              style={{
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: '10px',
                padding: '6px 10px',
                color: '#f43f5e',
                fontSize: '0.74rem',
                cursor: 'pointer'
              }}
              title="Logout"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
            {profile?.name || 'Complete Your Profile'}
          </h2>
          {isProfileVerified ? (
            <span style={{
              background: 'rgba(16, 185, 129, 0.18)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              fontSize: '0.66rem',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}>
              <CheckCircle2 size={11} /> Verified
            </span>
          ) : (
            <span style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              color: '#fbbf24',
              fontSize: '0.66rem',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}>
              Needs Info
            </span>
          )}
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: '1.4' }}>
          {profile?.headline}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} color="#38bdf8" /> {profile?.location}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Mail size={12} color="#818cf8" /> {profile?.email}
          </span>
        </div>
      </div>

      <div style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '30px' }}>
        {/* Profile Completion Gauge Box */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#818cf8" />
              <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#fff' }}>Profile Strength</span>
            </div>
            <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#10b981' }}>{completion}%</span>
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', height: '7px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{
              width: `${completion}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366f1, #10b981)',
              borderRadius: '4px',
              transition: 'width 0.4s ease'
            }} />
          </div>

          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            Complete your resume & verified projects to achieve <strong>3x more recruiter interview invites</strong>.
          </div>
        </div>

        {/* Quick jump to Resumes */}
        <div
          onClick={onOpenResumeTab}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={18} color="#ec4899" />
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fff' }}>Resume & ATS Analyzer</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {resumeCount === 0 
                  ? "0 Resumes uploaded • Tap to upload & compute ATS" 
                  : `${resumeCount} Resume${resumeCount > 1 ? 's' : ''} uploaded • Top ATS: ${topAtsScore}/100`}
              </div>
            </div>
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </div>

        {/* Skills Section */}
        <div className="glass-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Code2 size={16} color="#38bdf8" /> Technical Skills ({profile?.skills?.length || 0})
            </span>
          </div>

          {/* Current Skills Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
            {(!profile?.skills || profile.skills.length === 0) ? (
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No skills added yet. Type below or pick from recommended chips.
              </span>
            ) : (
              profile.skills.map(skill => (
                <span
                  key={skill}
                  className="pill-tag tag-blue"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '6px' }}
                >
                  <span>{skill}</span>
                  <X
                    size={12}
                    style={{ cursor: 'pointer', opacity: 0.7 }}
                    onClick={() => handleRemoveSkill(skill)}
                  />
                </span>
              ))
            )}
          </div>

          {/* Add Skill Input */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Add skill (e.g. Next.js, Docker)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '6px 10px',
                color: '#fff',
                fontSize: '0.78rem',
                outline: 'none'
              }}
            />
            <button
              onClick={() => handleAddSkill()}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.76rem', borderRadius: '8px', fontWeight: '800' }}
            >
              <Plus size={14} /> Add
            </button>
          </div>

          {/* Quick-add recommendations */}
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Recommended to add:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {popularSkills.filter(s => !profile?.skills?.includes(s)).slice(0, 4).map(s => (
              <button
                key={s}
                onClick={() => handleAddSkill(s)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '3px 8px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.68rem',
                  cursor: 'pointer'
                }}
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="glass-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GraduationCap size={16} color="#34d399" /> Education Details
            </span>
            <button
              onClick={() => setShowAddEdu(true)}
              style={{
                background: 'rgba(52, 211, 153, 0.12)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                borderRadius: '6px',
                padding: '3px 8px',
                color: '#34d399',
                fontSize: '0.7rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                cursor: 'pointer'
              }}
            >
              <Plus size={12} /> Add
            </button>
          </div>

          {(!profile?.education || profile.education.length === 0) ? (
            <div style={{
              textAlign: 'center',
              padding: '16px 10px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '8px',
              border: '1px dashed var(--border-subtle)'
            }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                No education history added yet.
              </div>
              <button
                onClick={() => setShowAddEdu(true)}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.72rem' }}
              >
                <Plus size={12} /> Add Degree / School
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {profile.education.map((edu) => (
                <div key={edu.id} style={{ borderLeft: '2px solid #3b82f6', paddingLeft: '10px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#fff' }}>{edu.institution}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{edu.degree}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', gap: '10px', marginTop: '2px' }}>
                    <span>{edu.year}</span>
                    <span style={{ color: '#38bdf8', fontWeight: '600' }}>{edu.score}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Experience */}
        <div className="glass-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase size={16} color="#fbbf24" /> Work & Internships
            </span>
            <button
              onClick={() => setShowAddExp(true)}
              style={{
                background: 'rgba(251, 191, 36, 0.12)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '6px',
                padding: '3px 8px',
                color: '#fbbf24',
                fontSize: '0.7rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                cursor: 'pointer'
              }}
            >
              <Plus size={12} /> Add
            </button>
          </div>

          {(!profile?.experience || profile.experience.length === 0) ? (
            <div style={{
              textAlign: 'center',
              padding: '16px 10px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '8px',
              border: '1px dashed var(--border-subtle)'
            }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                No experience or internship records added yet.
              </div>
              <button
                onClick={() => setShowAddExp(true)}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.72rem' }}
              >
                <Plus size={12} /> Add Experience
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {profile.experience.map((exp) => (
                <div key={exp.id} style={{ borderLeft: '2px solid #fbbf24', paddingLeft: '10px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#fff' }}>{exp.role}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{exp.company} • {exp.location}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{exp.duration}</div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Career Preferences */}
        <div className="glass-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#fff' }}>
              🎯 Career Preferences
            </span>
            <button
              onClick={() => { setFormData({ ...profile }); setEditing(true); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                fontSize: '0.7rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Edit
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.74rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontSize: '0.68rem' }}>Preferred Location:</span>
              <strong style={{ color: '#fff' }}>{profile?.preferredLocation || "Bangalore / Remote"}</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontSize: '0.68rem' }}>Expected CTC / Stipend:</span>
              <strong style={{ color: '#38bdf8' }}>{profile?.expectedSalary || "₹8–12 LPA"}</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontSize: '0.68rem' }}>Preferred Work Mode:</span>
              <strong style={{ color: '#34d399' }}>{profile?.preferredWorkMode || "Hybrid"}</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontSize: '0.68rem' }}>Graduation Batch:</span>
              <strong style={{ color: '#c084fc' }}>
                {profile?.graduationYear ? `${profile.graduationYear} Batch` : "2026 Batch"}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(false)}>
          <div className="bottom-sheet" style={{ maxHeight: '85%' }} onClick={(e) => e.stopPropagation()}>
            <div className="sheet-drag-handle" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>Edit Profile Information</h3>
              <button onClick={() => setEditing(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Professional Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>College / University</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>CGPA / Score</label>
                  <input
                    type="text"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Target Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore / Remote"
                    value={formData.preferredLocation || ''}
                    onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Work Mode</label>
                  <select
                    value={formData.preferredWorkMode || 'Hybrid'}
                    onChange={(e) => setFormData({ ...formData, preferredWorkMode: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Expected CTC</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹8–12 LPA"
                    value={formData.expectedSalary || ''}
                    onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Graduation Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2026"
                    value={formData.graduationYear || ''}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>About / Bio</label>
                <textarea
                  rows={2}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem', resize: 'none' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Education Modal */}
      {showAddEdu && (
        <div className="modal-overlay" onClick={() => setShowAddEdu(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-drag-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff' }}>Add Education</h3>
              <button onClick={() => setShowAddEdu(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Institution / University</label>
                <input
                  type="text"
                  placeholder="e.g. National Institute of Technology"
                  value={eduInst}
                  onChange={(e) => setEduInst(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Degree & Branch</label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech Computer Science & Engineering"
                  value={eduDeg}
                  onChange={(e) => setEduDeg(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Years</label>
                  <input
                    type="text"
                    placeholder="e.g. 2022 – 2026"
                    value={eduYear}
                    onChange={(e) => setEduYear(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>CGPA / Score</label>
                  <input
                    type="text"
                    placeholder="e.g. CGPA: 8.6 / 10"
                    value={eduScore}
                    onChange={(e) => setEduScore(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>
              <button onClick={handleAddEducation} className="btn-primary" style={{ marginTop: '8px' }}>
                Save Education
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Experience Modal */}
      {showAddExp && (
        <div className="modal-overlay" onClick={() => setShowAddExp(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-drag-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff' }}>Add Work Experience / Internship</h3>
              <button onClick={() => setShowAddExp(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Job / Role Title</label>
                <input
                  type="text"
                  placeholder="e.g. Full Stack Developer Intern"
                  value={expRole}
                  onChange={(e) => setExpRole(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. ABC Technologies"
                  value={expComp}
                  onChange={(e) => setExpComp(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore (Hybrid)"
                    value={expLoc}
                    onChange={(e) => setExpLoc(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. May 2025 – Aug 2025 (4 mos)"
                    value={expDuration}
                    onChange={(e) => setExpDuration(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Key Contributions</label>
                <textarea
                  rows={2}
                  placeholder="Built responsive React components and improved API performance..."
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem', resize: 'none' }}
                />
              </div>
              <button onClick={handleAddExperience} className="btn-primary" style={{ marginTop: '8px' }}>
                Save Experience
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
