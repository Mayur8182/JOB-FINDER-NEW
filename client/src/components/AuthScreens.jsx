import React, { useState, useEffect } from 'react';
import { Briefcase, ArrowRight, ShieldCheck, Mail, Lock, Phone, User, CheckCircle2, Sparkles, ChevronLeft } from 'lucide-react';

export default function AuthScreens({ onLoginSuccess }) {
  // authState: 'splash' | 'welcome' | 'login' | 'register' | 'forgot'
  const [currentStep, setCurrentStep] = useState('splash');
  const [role, setRole] = useState('student'); // 'student' | 'recruiter'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [welcomeSlide, setWelcomeSlide] = useState(0);

  const welcomeSlides = [
    {
      title: "Discover 10,000+ Verified Opportunities",
      desc: "Top startups and tech giants hiring freshers, interns, and experienced engineers across India.",
      tag: "Verified Jobs & Internships",
      color: "#ffffff"
    },
    {
      title: "Real-Time Application Timeline Tracker",
      desc: "Never wonder about your status again. Track Applied → Review → Shortlist → Interview → Offer.",
      tag: "Live Status Pipeline",
      color: "#ffffff"
    },
    {
      title: "Smart ATS Resume & Skill Matching",
      desc: "Build an ATS-ready resume in minutes and get matched to jobs based on your actual tech skills.",
      tag: "AI Career Match",
      color: "#ffffff"
    }
  ];

  // Auto transition from splash after 2.5s if not tapped
  useEffect(() => {
    if (currentStep === 'splash') {
      const timer = setTimeout(() => {
        setCurrentStep('welcome');
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleManualLogin = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const derivedName = name.trim() || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      onLoginSuccess({
        id: 'user-' + Date.now(),
        name: derivedName,
        email: email.trim().toLowerCase(),
        role: role
      });
    }, 400);
  };

  const handleRegister = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address (e.g. name@example.com).');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setErrorMsg('Please enter a password with at least 4 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        id: 'user-' + Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        role: role
      });
    }, 450);
  };

  const handleDemoLogin = async (selectedRole) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: selectedRole === 'recruiter' ? 'recruiter@abctech.com' : 'candidate@example.com',
          password: 'demo',
          role: selectedRole
        })
      });
      const data = await res.json();
      if (data.success) {
        onLoginSuccess(data.user);
      }
    } catch (e) {
      console.error(e);
      // Fallback
      onLoginSuccess({
        id: selectedRole === 'recruiter' ? 'rec-1' : 'user-1',
        name: selectedRole === 'recruiter' ? 'Recruiter' : 'Job Seeker',
        email: selectedRole === 'recruiter' ? 'recruiter@company.com' : 'student@university.edu',
        role: selectedRole
      });
    } finally {
      setLoading(false);
    }
  };

  // 1. SPLASH SCREEN
  if (currentStep === 'splash') {
    return (
      <div 
        onClick={() => setCurrentStep('welcome')}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '28px',
          background: 'radial-gradient(circle at 50% 40%, #2e1065 0%, #0a0d14 75%)',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '26px',
          background: 'var(--primary-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 50px rgba(139, 92, 246, 0.5)',
          marginBottom: '24px',
          animation: 'bounce 2s infinite'
        }}>
          <Briefcase size={44} color="#fff" />
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.9rem',
          fontWeight: '800',
          color: '#fff',
          letterSpacing: '-0.5px',
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          Career<span style={{ color: '#818cf8' }}>Portal</span>
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.88rem',
          textAlign: 'center',
          maxWidth: '260px',
          lineHeight: '1.4'
        }}>
          Your fast-track to tech jobs, internships & interview tracking
        </p>

        <div style={{
          position: 'absolute',
          bottom: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          <span>Tap anywhere to start</span>
          <ArrowRight size={14} />
        </div>
      </div>
    );
  }

  // 2. WELCOME ONBOARDING SLIDES
  if (currentStep === 'welcome') {
    const slide = welcomeSlides[welcomeSlide];
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 20px 32px 20px',
        background: 'linear-gradient(180deg, #111827 0%, #0a0d14 100%)'
      }}>
        {/* Top skip */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setCurrentStep('login')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Skip to Login
          </button>
        </div>

        {/* Slide Visual Content */}
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#818cf8',
            fontSize: '0.75rem',
            fontWeight: '600',
            marginBottom: '20px'
          }}>
            {slide.tag}
          </div>

          <div style={{
            width: '180px',
            height: '180px',
            margin: '0 auto 28px auto',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${slide.color}22 0%, transparent 70%)`,
            border: `1px solid ${slide.color}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={54} color={slide.color} />
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.45rem',
            fontWeight: '700',
            color: '#fff',
            lineHeight: '1.3',
            marginBottom: '12px'
          }}>
            {slide.title}
          </h2>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.86rem',
            lineHeight: '1.5',
            padding: '0 10px'
          }}>
            {slide.desc}
          </p>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
            {welcomeSlides.map((_, i) => (
              <div
                key={i}
                onClick={() => setWelcomeSlide(i)}
                style={{
                  width: welcomeSlide === i ? '22px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: welcomeSlide === i ? 'var(--primary)' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {welcomeSlide < welcomeSlides.length - 1 ? (
            <button
              className="btn-primary"
              onClick={() => setWelcomeSlide(prev => prev + 1)}
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={() => setCurrentStep('login')}
            >
              Get Started <ArrowRight size={16} />
            </button>
          )}

          <button
            className="btn-secondary"
            onClick={() => setCurrentStep('login')}
          >
            I already have an account
          </button>
        </div>
      </div>
    );
  }

  // 3. LOGIN SCREEN
  if (currentStep === 'login') {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 20px',
        overflowY: 'auto'
      }}>
        <div>
          <button
            onClick={() => setCurrentStep('welcome')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>
            Welcome Back 👋
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Sign in to continue tracking your job applications
          </p>

          {/* User Type Switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.06)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px'
          }}>
            <button
              onClick={() => setRole('student')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: role === 'student' ? 'var(--primary)' : 'transparent',
                color: '#fff',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🎓 Student / Seeker
            </button>
            <button
              onClick={() => { setRole('student'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: role === 'student' ? '#ffffff' : 'transparent',
                color: role === 'student' ? '#000000' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🎓 Student / Seeker
            </button>
            <button
              onClick={() => { setRole('recruiter'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: role === 'recruiter' ? '#ffffff' : 'transparent',
                color: role === 'recruiter' ? '#000000' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🏢 Recruiter / HR
            </button>
          </div>

          {/* Instant 1-Click Demo Login Box */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            marginBottom: '18px'
          }}>
            <div style={{ fontSize: '0.76rem', color: '#ffffff', fontWeight: '700', marginBottom: '8px' }}>
              ⚡ 1-Click Quick Demo Login (Optional):
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 1, padding: '8px', fontSize: '0.76rem' }}
                onClick={() => handleDemoLogin('student')}
                disabled={loading}
              >
                Log in as Student
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1, padding: '8px', fontSize: '0.76rem' }}
                onClick={() => handleDemoLogin('recruiter')}
                disabled={loading}
              >
                Log in as Recruiter
              </button>
            </div>
          </div>

          {/* Regular Login Form */}
          <form onSubmit={handleManualLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Email Address
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px'
              }}>
                <Mail size={16} color="var(--text-muted)" />
                <input
                  type="email"
                  placeholder={role === 'student' ? 'candidate@example.com' : 'recruiter@abctech.com'}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.86rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Password
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px'
              }}>
                <Lock size={16} color="var(--text-muted)" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.86rem'
                  }}
                />
              </div>
            </div>

            {errorMsg && (
              <div style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid #737373',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: '600'
              }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => alert("Password reset link simulated to your email. You can also use the 1-Click Demo Login above!")}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.76rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            className="btn-primary"
            onClick={handleManualLogin}
            disabled={loading}
          >
            {loading ? "Authenticating..." : `Sign In as ${role === 'student' ? 'Student' : 'Recruiter'}`}
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <button
              onClick={() => { setCurrentStep('register'); setErrorMsg(''); }}
              style={{ background: 'none', border: 'none', color: '#ffffff', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. REGISTER SCREEN
  if (currentStep === 'register') {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 20px',
        overflowY: 'auto'
      }}>
        <div>
          <button
            onClick={() => { setCurrentStep('login'); setErrorMsg(''); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              marginBottom: '14px'
            }}
          >
            <ChevronLeft size={16} /> Back to Login
          </button>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
            Create Account ✨
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '18px' }}>
            Join thousands of candidates landing dream roles
          </p>

          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.06)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px'
          }}>
            <button
              onClick={() => { setRole('student'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: role === 'student' ? '#ffffff' : 'transparent',
                color: role === 'student' ? '#000000' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🎓 Student / Seeker
            </button>
            <button
              onClick={() => { setRole('recruiter'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: role === 'recruiter' ? '#ffffff' : 'transparent',
                color: role === 'recruiter' ? '#000000' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🏢 Recruiter
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                Full Name *
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
                <User size={16} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrorMsg(''); }}
                  style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.86rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                Email Address *
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
                <Mail size={16} color="var(--text-muted)" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                  style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.86rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                Password * (min 4 chars)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
                <Lock size={16} color="var(--text-muted)" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                  style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.86rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                Mobile Number (Optional)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
                <Phone size={16} color="var(--text-muted)" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.86rem' }}
                />
              </div>
            </div>

            {errorMsg && (
              <div style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid #737373',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: '600'
              }}>
                ⚠️ {errorMsg}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className="btn-primary"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account & Get Started"} <ArrowRight size={16} />
          </button>
          <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <button
              onClick={() => { setCurrentStep('login'); setErrorMsg(''); }}
              style={{ background: 'none', border: 'none', color: '#ffffff', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
