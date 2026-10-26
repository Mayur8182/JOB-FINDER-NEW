import React from 'react';
import { Bookmark, BookmarkCheck, MapPin, IndianRupee, Clock, ArrowRight, Trash2, BellRing } from 'lucide-react';

export default function SavedJobs({
  savedJobs,
  onToggleSave,
  onSelectJob,
  onOpenApply
}) {
  return (
    <div className="app-viewport">
      <div style={{ padding: '16px 20px 12px 20px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
          Saved Opportunities ❤️
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Review your bookmarked jobs and apply before application deadlines
        </p>
      </div>

      <div style={{ padding: '0 20px', flex: 1 }}>
        {savedJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Bookmark size={40} style={{ margin: '0 auto 12px auto', opacity: 0.3 }} />
            No saved jobs yet. Tap the bookmark icon on any job card to save it here for quick access!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {savedJobs.map(job => (
              <div
                key={job.id}
                className="glass-card"
                style={{ padding: '14px', cursor: 'pointer' }}
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
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff' }}>
                          {job.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {job.company} • {job.location}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(job.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#f43f5e',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <BookmarkCheck size={18} fill="#f43f5e" />
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', margin: '8px 0' }}>
                      <span className="pill-tag tag-blue">{job.workMode}</span>
                      <span className="pill-tag tag-purple">{job.experience}</span>
                      <span className="pill-tag tag-green">{job.salary}</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '8px',
                      marginTop: '6px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#fbbf24' }}>
                        <Clock size={12} /> Deadline: {job.deadline}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Reminder set! You will receive an alert 24h before ${job.company}'s deadline.`);
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            padding: '4px 8px',
                            color: 'var(--text-secondary)',
                            fontSize: '0.72rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <BellRing size={12} /> Remind
                        </button>

                        <button
                          className="btn-primary"
                          style={{ padding: '5px 12px', fontSize: '0.74rem', borderRadius: '8px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenApply(job);
                          }}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
