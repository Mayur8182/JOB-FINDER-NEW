import React from 'react';
import { X, Bell, CheckCheck, Sparkles, Calendar, Award, AlertTriangle, ChevronRight } from 'lucide-react';

export default function NotificationsModal({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onNotificationClick
}) {
  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'shortlist': return <Award size={18} color="#34d399" />;
      case 'interview': return <Calendar size={18} color="#60a5fa" />;
      case 'match': return <Sparkles size={18} color="#ec4899" />;
      case 'deadline': return <AlertTriangle size={18} color="#fbbf24" />;
      default: return <Bell size={18} color="#818cf8" />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="bottom-sheet" 
        style={{ maxHeight: '80%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-drag-handle" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>Notifications 🔔</h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Status updates & recruitment alerts</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onMarkAllRead}
              style={{
                background: 'none',
                border: 'none',
                color: '#818cf8',
                fontSize: '0.72rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <CheckCheck size={14} /> Mark all read
            </button>

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
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '20px' }}>
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => {
                onNotificationClick(n);
                onClose();
              }}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: n.read ? 'rgba(255, 255, 255, 0.02)' : 'rgba(99, 102, 241, 0.12)',
                border: `1px solid ${n.read ? 'var(--border-subtle)' : 'rgba(99, 102, 241, 0.35)'}`,
                display: 'flex',
                gap: '12px',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {getIcon(n.type)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: n.read ? '600' : '700', color: '#fff' }}>
                    {n.title}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{n.time}</span>
                </div>

                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {n.message}
                </p>
              </div>

              {!n.read && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--primary)'
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
