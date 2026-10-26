import React, { useState } from 'react';
import { 
  X, Target, CheckCircle2, AlertTriangle, ArrowRight, 
  Sparkles, BookOpen, ExternalLink, Award, Plus, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SkillGapModal({ isOpen, onClose, job, profile, onSkillAdded }) {
  const [learningSkill, setLearningSkill] = useState(null);
  const [addingSkill, setAddingSkill] = useState(false);

  if (!isOpen || !job) return null;

  const candidateSkills = profile?.skills || [];
  const requiredSkills = job.skills || [];

  const matchedSkills = requiredSkills.filter(s => 
    candidateSkills.some(cs => cs.toLowerCase() === s.toLowerCase())
  );
  const missingSkills = requiredSkills.filter(s => 
    !candidateSkills.some(cs => cs.toLowerCase() === s.toLowerCase())
  );

  const matchPercent = Math.round((matchedSkills.length / Math.max(1, requiredSkills.length)) * 100);

  // Skill roadmaps
  const skillRoadmaps = {
    'Docker': {
      hours: '6–8 hrs',
      level: 'Intermediate',
      concepts: ['Dockerfiles & Layers', 'Multi-stage builds', 'Docker Compose', 'Container networking'],
      miniProject: 'Dockerize a React + Node.js multi-tier app with hot reloading and volume persistence.',
      docsUrl: 'https://docs.docker.com/get-started/'
    },
    'Kubernetes': {
      hours: '12–14 hrs',
      level: 'Advanced',
      concepts: ['Pods & Deployments', 'Services & Ingress', 'ConfigMaps & Secrets', 'Horizontal Pod Autoscalers'],
      miniProject: 'Deploy a zero-downtime rolling update application on local Minikube cluster.',
      docsUrl: 'https://kubernetes.io/docs/tutorials/'
    },
    'Redis': {
      hours: '4–6 hrs',
      level: 'Beginner to Intermediate',
      concepts: ['In-memory key-value data structures', 'TTL & Eviction policies', 'Pub/Sub channels', 'Rate limiting middleware'],
      miniProject: 'Implement an Express.js API rate limiter and session store using Redis.',
      docsUrl: 'https://redis.io/docs/latest/develop/'
    },
    'TypeScript': {
      hours: '8–10 hrs',
      level: 'Intermediate',
      concepts: ['Generics & Utility types', 'Interfaces vs Type aliases', 'Type narrowing & discrimination', 'Strict mode configurations'],
      miniProject: 'Refactor an untyped JavaScript utility library to strictly-typed TypeScript.',
      docsUrl: 'https://www.typescriptlang.org/docs/'
    },
    'AWS': {
      hours: '10–12 hrs',
      level: 'Intermediate',
      concepts: ['EC2 & Security Groups', 'S3 Bucket policies & CORS', 'RDS PostgreSQL database setup', 'CloudFront CDN distribution'],
      miniProject: 'Host a production frontend on S3 + CloudFront with an automated GitHub Actions pipeline.',
      docsUrl: 'https://aws.amazon.com/getting-started/'
    },
    'MongoDB': {
      hours: '5–6 hrs',
      level: 'Beginner',
      concepts: ['Document modeling', 'Aggregation pipelines', 'Indexing strategies', 'Mongoose schema validation'],
      miniProject: 'Build an e-commerce order management aggregator with multi-stage $group pipelines.',
      docsUrl: 'https://www.mongodb.com/docs/manual/tutorial/'
    },
    'Python': {
      hours: '8–10 hrs',
      level: 'Beginner to Intermediate',
      concepts: ['List comprehensions & generators', 'Asyncio & coroutines', 'FastAPI REST framework', 'Type hints with Pydantic'],
      miniProject: 'Build an asynchronous web scraping and data processing REST service with FastAPI.',
      docsUrl: 'https://docs.python.org/3/tutorial/'
    }
  };

  const handleAddSkillToProfile = async (skillName) => {
    setAddingSkill(true);
    try {
      const res = await fetch('/api/v1/profile/skills/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill: skillName })
      });
      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
        if (onSkillAdded) onSkillAdded(data.profile, skillName);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingSkill(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="bottom-sheet" 
        style={{ maxHeight: '92%', height: 'auto', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-drag-handle" />

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b'
            }}>
              <Target size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.08rem', fontWeight: '800', color: '#fff' }}>
                Skill Gap & Upskilling Roadmap
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Targeting: {job.title} at {job.company}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Match Percentage Hero Gauge */}
        <div style={{
          background: matchPercent >= 75 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.25) 100%)'
            : 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(120, 53, 15, 0.25) 100%)',
          border: `1.5px solid ${matchPercent >= 75 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: matchPercent >= 75 ? '#6ee7b7' : '#fde68a', fontWeight: '700' }}>
              Your Skill Alignment
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-display)' }}>
              {matchPercent}% Match
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {matchedSkills.length} of {requiredSkills.length} required skills verified in your profile
            </div>
          </div>

          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.3)',
            border: `3px solid ${matchPercent >= 75 ? '#10b981' : '#f59e0b'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: '800',
            color: '#fff'
          }}>
            {matchedSkills.length}/{requiredSkills.length}
          </div>
        </div>

        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Matched Skills */}
          <div className="glass-card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#34d399', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} /> Skills You Already Have ({matchedSkills.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {matchedSkills.map(s => (
                <span key={s} style={{
                  background: 'rgba(52, 211, 153, 0.15)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  color: '#34d399',
                  borderRadius: 'var(--radius-full)',
                  padding: '3px 10px',
                  fontSize: '0.72rem',
                  fontWeight: '600'
                }}>
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills to Bridge */}
          <div className="glass-card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fbbf24', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={14} /> Skills to Bridge for 100% Match ({missingSkills.length})
            </div>

            {missingSkills.length === 0 ? (
              <div style={{ fontSize: '0.74rem', color: '#34d399', padding: '6px 0' }}>
                🎉 You meet 100% of all required skill criteria for this opening! Apply now with high confidence.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {missingSkills.map(skill => {
                  const roadmap = skillRoadmaps[skill] || {
                    hours: '6–8 hrs',
                    level: 'Intermediate',
                    concepts: ['Fundamentals & Setup', 'Best practices', 'API integration', 'Production workflows'],
                    miniProject: `Build a small portfolio demonstration utilizing ${skill}.`,
                    docsUrl: 'https://devdocs.io/'
                  };

                  const isExpanded = learningSkill === skill;

                  return (
                    <div 
                      key={skill}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)',
                        padding: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.86rem', color: '#fff' }}>
                            {skill}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            Estimated time: {roadmap.hours} • Level: {roadmap.level}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => setLearningSkill(isExpanded ? null : skill)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-subtle)',
                              background: isExpanded ? 'rgba(255,255,255,0.1)' : 'transparent',
                              color: 'var(--text-secondary)',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            {isExpanded ? 'Hide Guide' : 'View Roadmap'}
                          </button>

                          <button
                            onClick={() => handleAddSkillToProfile(skill)}
                            disabled={addingSkill}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid rgba(52, 211, 153, 0.5)',
                              background: 'rgba(52, 211, 153, 0.15)',
                              color: '#34d399',
                              fontSize: '0.7rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="I know this skill! Add it to my profile"
                          >
                            <Plus size={11} /> Add to Profile
                          </button>
                        </div>
                      </div>

                      {/* Expanded Roadmap Guide */}
                      {isExpanded && (
                        <div style={{
                          marginTop: '10px',
                          paddingTop: '10px',
                          borderTop: '1px solid var(--border-subtle)',
                          fontSize: '0.74rem',
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          <div style={{ fontWeight: '600', color: '#fff' }}>Key Topics to Master:</div>
                          <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            {roadmap.concepts.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>

                          <div style={{
                            background: 'rgba(245, 158, 11, 0.08)',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            borderRadius: '6px',
                            padding: '8px',
                            marginTop: '4px'
                          }}>
                            <strong style={{ color: '#fbbf24' }}>Suggested Proof-of-Work Project:</strong>
                            <div style={{ marginTop: '2px' }}>{roadmap.miniProject}</div>
                          </div>

                          <a
                            href={roadmap.docsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#38bdf8',
                              textDecoration: 'none',
                              fontWeight: '600',
                              marginTop: '2px'
                            }}
                          >
                            <ExternalLink size={12} /> Official Documentation & Quickstart
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
