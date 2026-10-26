import React from 'react';
import { Smartphone, Monitor, Moon, Sun, RefreshCw, Briefcase, UserCheck } from 'lucide-react';

export default function PhoneSimulator({
  deviceType,
  setDeviceType,
  userRole,
  setUserRole,
  onResetDemo,
  children
}) {
  const currentTime = "9:41";

  return (
    <div className="simulator-workspace">
      {/* Top Controller Bar */}
      <div className="simulator-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: '#ffffff',
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000',
            fontWeight: '900',
            fontSize: '13px'
          }}>
            JF
          </div>
          <div>
            <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.92rem' }}>Job & Internship Portal</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>V1 MVP Mobile App Preview</div>
          </div>
        </div>

        <div className="simulator-controls">
          {/* Device Type Toggle */}
          <button
            className={`control-pill ${deviceType === 'iphone' ? 'active' : ''}`}
            onClick={() => setDeviceType('iphone')}
            title="iPhone 16 Pro Frame"
          >
            <Smartphone size={14} /> iPhone
          </button>
          <button
            className={`control-pill ${deviceType === 'android' ? 'active' : ''}`}
            onClick={() => setDeviceType('android')}
            title="Android Pixel Frame"
          >
            <Smartphone size={14} /> Android
          </button>
          <button
            className={`control-pill ${deviceType === 'fullscreen' ? 'active' : ''}`}
            onClick={() => setDeviceType('fullscreen')}
            title="Responsive Fullscreen View"
          >
            <Monitor size={14} /> Responsive
          </button>

          {/* User Role Switcher */}
          <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)', margin: '0 4px' }} />

          <button
            className={`control-pill ${userRole === 'student' ? 'active' : ''}`}
            onClick={() => setUserRole('student')}
            title="Switch to Student / Job Seeker View"
          >
            <UserCheck size={14} /> Student View
          </button>

          <button
            className={`control-pill ${userRole === 'recruiter' ? 'active' : ''}`}
            onClick={() => setUserRole('recruiter')}
            title="Switch to Recruiter Portal"
          >
            <Briefcase size={14} /> Recruiter View
          </button>

          {/* Reset Demo State */}
          <button
            className="control-pill"
            onClick={onResetDemo}
            title="Reset data to fresh seed state"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Device Frame */}
      <div className={`device-wrapper device-${deviceType}`}>
        {/* Dynamic Island for iPhone */}
        {deviceType === 'iphone' && (
          <div className="dynamic-island">
            <div className="sensor-dot" />
            <div className="camera-lens" />
          </div>
        )}

        <div className="mobile-screen">
          {/* Native Mobile Status Bar */}
          <div className="status-bar">
            <span>{currentTime}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem' }}>
              <span>5G</span>
              <span>●●●</span>
              <div style={{
                width: '20px',
                height: '10px',
                border: '1px solid rgba(255,255,255,0.7)',
                borderRadius: '3px',
                padding: '1px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{ width: '80%', height: '100%', background: '#10b981', borderRadius: '1px' }} />
              </div>
            </div>
          </div>

          {/* Main App Container */}
          {children}

          {/* Bottom Native Home Indicator */}
          <div className="home-indicator" />
        </div>
      </div>
    </div>
  );
}
