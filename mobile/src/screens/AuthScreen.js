import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, TextInput, StyleSheet, 
  ScrollView, SafeAreaView, ActivityIndicator, Alert 
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme';

export default function AuthScreen({ onLoginSuccess }) {
  // step: 'welcome' | 'login' | 'register'
  const [step, setStep] = useState('welcome');
  const [role, setRole] = useState('student'); // 'student' | 'recruiter'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);

  const slides = [
    {
      title: "Discover 10,000+ Verified Jobs & Internships",
      desc: "Connect directly with top startups and tech leaders hiring freshers & engineers.",
      color: COLORS.primary,
      icon: "briefcase"
    },
    {
      title: "Live Application Tracking Pipeline",
      desc: "Real-time timeline tracking: Applied → Under Review → Shortlisted → Interview → Offer.",
      color: COLORS.accentEmerald,
      icon: "clock"
    },
    {
      title: "AI ATS Resume Scoring & Match",
      desc: "Get matched to roles matching your actual skills and pass automated recruiter filters.",
      color: COLORS.accentPurple,
      icon: "award"
    }
  ];

  const handleManualLogin = () => {
    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your registered email address.");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Password Required", "Please enter your password.");
      return;
    }
    if (password.length < 4) {
      Alert.alert("Invalid Password", "Password must be at least 4 characters.");
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

  const handleDemoLogin = (selectedRole) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        id: selectedRole === 'recruiter' ? 'rec-1' : 'user-1',
        name: selectedRole === 'recruiter' ? 'HR Recruiter' : 'Student Explorer',
        email: selectedRole === 'recruiter' ? 'recruiter@company.com' : 'student@university.edu',
        role: selectedRole
      });
    }, 400);
  };

  const handleRegister = () => {
    if (!name.trim()) {
      Alert.alert("Name Required", "Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your email address.");
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert("Invalid Email", "Please enter a valid email address (e.g. name@example.com).");
      return;
    }
    if (!password.trim() || password.length < 4) {
      Alert.alert("Password Required", "Please set a password with at least 4 characters.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Account Created! 🎉",
        `Welcome ${name.trim()}! Your account has been registered successfully.`,
        [
          {
            text: "Continue to App",
            onPress: () => {
              onLoginSuccess({
                id: 'user-' + Date.now(),
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim(),
                role: role
              });
            }
          }
        ]
      );
    }, 450);
  };

  // 1. WELCOME ONBOARDING
  if (step === 'welcome') {
    const currentSlide = slides[slideIdx];
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.topSkip}>
          <TouchableOpacity onPress={() => setStep('login')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.welcomeCenter}>
          <View style={[styles.welcomeIconCircle, { borderColor: currentSlide.color }]}>
            <Feather name={currentSlide.icon} size={48} color={currentSlide.color} />
          </View>

          <Text style={styles.welcomeTitle}>{currentSlide.title}</Text>
          <Text style={styles.welcomeDesc}>{currentSlide.desc}</Text>

          {/* Dots */}
          <View style={styles.dotsRow}>
            {slides.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setSlideIdx(i)}
                style={[styles.dot, slideIdx === i && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        <View style={styles.bottomActions}>
          {slideIdx < slides.length - 1 ? (
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => setSlideIdx(prev => prev + 1)}
              activeOpacity={0.8}
            >
              <Text style={styles.btnPrimaryText}>Next</Text>
              <Feather name="arrow-right" size={16} color="#000" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => setStep('login')}
              activeOpacity={0.8}
            >
              <Text style={styles.btnPrimaryText}>Get Started</Text>
              <Feather name="arrow-right" size={16} color="#000" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => setStep('login')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnSecondaryText}>Sign In with Existing Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 2. LOGIN SCREEN
  if (step === 'login') {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView contentContainerStyle={styles.scrollAuth}>
          <TouchableOpacity onPress={() => setStep('welcome')} style={styles.backRow}>
            <Ionicons name="arrow-back" size={20} color={COLORS.textSecondary} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.authHeading}>Welcome Back 👋</Text>
          <Text style={styles.authSub}>Sign in to access your jobs & application pipeline</Text>

          {/* Role selector */}
          <View style={styles.roleToggle}>
            <TouchableOpacity
              style={[styles.roleOpt, role === 'student' && styles.roleOptActive]}
              onPress={() => setRole('student')}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleOptText, role === 'student' && styles.roleOptTextActive]}>
                🎓 Student / Seeker
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleOpt, role === 'recruiter' && styles.roleOptActive]}
              onPress={() => setRole('recruiter')}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleOptText, role === 'recruiter' && styles.roleOptTextActive]}>
                🏢 Recruiter
              </Text>
            </TouchableOpacity>
          </View>

          {/* Fast 1-Click Demo Box */}
          <View style={styles.demoBox}>
            <Text style={styles.demoBoxTitle}>⚡ 1-Click Instant Demo Login:</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TouchableOpacity
                style={styles.demoBtn}
                onPress={() => handleDemoLogin('student')}
                activeOpacity={0.8}
              >
                <Text style={styles.demoBtnText}>Student Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.demoBtn, { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: '#262626' }]}
                onPress={() => handleDemoLogin('recruiter')}
                activeOpacity={0.8}
              >
                <Text style={[styles.demoBtnText, { color: '#ffffff' }]}>Recruiter Login</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Manual Form */}
          <Text style={styles.inputLabel}>Email or Phone</Text>
          <View style={styles.inputBox}>
            <Feather name="mail" size={16} color={COLORS.textMuted} />
            <TextInput
              style={styles.textInput}
              placeholder={role === 'student' ? 'your@email.com' : 'recruiter@company.com'}
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputBox}>
            <Feather name="lock" size={16} color={COLORS.textMuted} />
            <TextInput
              style={styles.textInput}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          </View>

          <TouchableOpacity
            style={[styles.btnPrimary, { marginTop: 22 }]}
            onPress={handleManualLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.btnPrimaryText}>Sign In as {role === 'student' ? 'Student' : 'Recruiter'}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.switchAuthRow}>
            <Text style={{ color: COLORS.textSecondary, fontSize: 13 }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => setStep('register')}>
              <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 13 }}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 3. REGISTER SCREEN (Direct Registration Without OTP)
  if (step === 'register') {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView contentContainerStyle={styles.scrollAuth}>
          <TouchableOpacity onPress={() => setStep('login')} style={styles.backRow}>
            <Ionicons name="arrow-back" size={20} color={COLORS.textSecondary} />
            <Text style={styles.backText}>Back to Login</Text>
          </TouchableOpacity>

          <Text style={styles.authHeading}>Create Account ✨</Text>
          <Text style={styles.authSub}>Register directly to start exploring verified jobs</Text>

          {/* Role selector */}
          <View style={styles.roleToggle}>
            <TouchableOpacity
              style={[styles.roleOpt, role === 'student' && styles.roleOptActive]}
              onPress={() => setRole('student')}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleOptText, role === 'student' && styles.roleOptTextActive]}>
                🎓 Student
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleOpt, role === 'recruiter' && styles.roleOptActive]}
              onPress={() => setRole('recruiter')}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleOptText, role === 'recruiter' && styles.roleOptTextActive]}>
                🏢 Recruiter
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Full Name *</Text>
          <View style={styles.inputBox}>
            <Feather name="user" size={16} color={COLORS.textMuted} />
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Rahul Sharma"
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

          <Text style={styles.inputLabel}>Email Address *</Text>
          <View style={styles.inputBox}>
            <Feather name="mail" size={16} color={COLORS.textMuted} />
            <TextInput
              style={styles.textInput}
              placeholder="your@email.com"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.inputBox}>
            <Feather name="phone" size={16} color={COLORS.textMuted} />
            <TextInput
              style={styles.textInput}
              placeholder="+91 98765 43210"
              placeholderTextColor={COLORS.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputBox}>
            <Feather name="lock" size={16} color={COLORS.textMuted} />
            <TextInput
              style={styles.textInput}
              placeholder="Create a password"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          </View>

          <TouchableOpacity
            style={[styles.btnPrimary, { marginTop: 24 }]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Text style={styles.btnPrimaryText}>Create Account & Sign In</Text>
                <Feather name="arrow-right" size={16} color="#000" />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.switchAuthRow}>
            <Text style={{ color: COLORS.textSecondary, fontSize: 13 }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => setStep('login')}>
              <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 13 }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  topSkip: {
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.lg,
    paddingTop: 12,
  },
  skipText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  welcomeCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg + 8,
  },
  welcomeIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  welcomeTitle: {
    color: COLORS.textMain,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 28,
  },
  welcomeDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 28,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    width: 22,
    backgroundColor: '#ffffff',
  },
  bottomActions: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 28,
    gap: 10,
  },
  btnPrimary: {
    backgroundColor: '#ffffff',
    height: 48,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnPrimaryText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
  },
  btnSecondary: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    height: 46,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  scrollAuth: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 14,
    paddingBottom: 40,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  backText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  authHeading: {
    color: COLORS.textMain,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  authSub: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 18,
  },
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: RADIUS.md,
    padding: 3,
    marginBottom: 16,
  },
  roleOpt: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: RADIUS.sm,
  },
  roleOptActive: {
    backgroundColor: '#ffffff',
  },
  roleOptText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  roleOptTextActive: {
    color: '#000000',
    fontWeight: '800',
  },
  demoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 16,
  },
  demoBoxTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  demoBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  demoBtnText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '800',
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  textInput: {
    flex: 1,
    color: COLORS.textMain,
    fontSize: 13,
  },
  switchAuthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
});
