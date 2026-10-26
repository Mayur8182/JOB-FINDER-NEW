import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, Modal, 
  TextInput, StyleSheet, Alert 
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme';

export default function ProfileScreen({
  profile,
  onUpdateProfile,
  onLogout,
  onOpenResumes,
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

  const popularSkills = ["Docker", "Kubernetes", "Next.js", "GraphQL", "Python", "AWS"];

  const handleSave = () => {
    onUpdateProfile(formData);
    setEditing(false);
    Alert.alert("Profile Updated", "Your changes have been saved successfully.");
  };

  const handleAddEducation = () => {
    if (!eduInst.trim() || !eduDeg.trim()) {
      Alert.alert("Required Fields", "Please enter institution and degree name.");
      return;
    }
    const newEdu = {
      id: "edu-" + Date.now(),
      institution: eduInst.trim(),
      degree: eduDeg.trim(),
      year: eduYear.trim() || "2022 – 2026",
      score: eduScore.trim() || "CGPA: 8.5 / 10"
    };
    const updated = { ...profile, education: [...(profile?.education || []), newEdu] };
    onUpdateProfile(updated);
    setShowAddEdu(false);
    setEduInst('');
    setEduDeg('');
    setEduScore('');
    Alert.alert("Education Added", "Education details updated.");
  };

  const handleAddExperience = () => {
    if (!expRole.trim() || !expComp.trim()) {
      Alert.alert("Required Fields", "Please enter role and company name.");
      return;
    }
    const newExp = {
      id: "exp-" + Date.now(),
      role: expRole.trim(),
      company: expComp.trim(),
      location: expLoc.trim() || "Bangalore (Hybrid)",
      duration: expDuration.trim() || "3 months",
      description: expDesc.trim() || "Built production features and collaborated with product engineers."
    };
    const updated = { ...profile, experience: [...(profile?.experience || []), newExp] };
    onUpdateProfile(updated);
    setShowAddExp(false);
    setExpRole('');
    setExpComp('');
    setExpDesc('');
    Alert.alert("Experience Added", "Experience details updated.");
  };

  const handleAddSkill = (skill) => {
    const s = skill || newSkill.trim();
    if (!s || profile?.skills?.includes(s)) return;
    const updated = [...(profile?.skills || []), s];
    onUpdateProfile({ ...profile, skills: updated });
    setNewSkill('');
  };

  const handleRemoveSkill = (skill) => {
    const updated = (profile?.skills || []).filter(s => s !== skill);
    onUpdateProfile({ ...profile, skills: updated });
  };

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

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {/* Profile Header */}
      <View style={styles.headerBox}>
        <View style={styles.topRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile?.name ? profile.name.charAt(0).toUpperCase() : 'M'}</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => {
                setFormData({ ...profile });
                setEditing(true);
              }}
            >
              <Feather name="edit-2" size={13} color="#fff" />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
              <Feather name="log-out" size={14} color={COLORS.accentRose} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
          <Text style={styles.name}>{profile?.name || 'Candidate Profile'}</Text>
          {isProfileVerified ? (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#34d399" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          ) : (
            <View style={[styles.verifiedBadge, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.35)' }]}>
              <Text style={[styles.verifiedText, { color: '#fbbf24' }]}>Needs Info</Text>
            </View>
          )}
        </View>

        <Text style={styles.headline}>{profile?.headline || 'Add your professional headline'}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            <Feather name="map-pin" size={12} color="#a3a3a3" /> {profile?.location || 'Bangalore, India'}
          </Text>
          <Text style={styles.metaText}>
            <Feather name="mail" size={12} color="#a3a3a3" /> {profile?.email || 'email@example.com'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Profile Strength Meter */}
        <View style={styles.meterCard}>
          <View style={styles.meterTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Feather name="award" size={14} color="#3b82f6" />
              <Text style={styles.meterTitle}>Profile Strength</Text>
            </View>
            <Text style={styles.meterVal}>{completion}%</Text>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${completion}%`, backgroundColor: '#3b82f6' }]} />
          </View>

          <Text style={styles.meterSub}>
            Complete your verified projects and education to achieve 3x higher recruiter responses.
          </Text>
        </View>

        {/* Quick jump to Resumes */}
        <TouchableOpacity style={styles.resumeJump} onPress={onOpenResumes} activeOpacity={0.8}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Feather name="award" size={18} color="#ec4899" />
            <View>
              <Text style={styles.jumpTitle}>Resumes & ATS Score</Text>
              <Text style={styles.jumpSub}>
                {resumeCount === 0 
                  ? "0 Resumes Uploaded • Tap to upload & compute ATS" 
                  : `${resumeCount} Resume${resumeCount > 1 ? 's' : ''} Uploaded • Top ATS: ${topAtsScore}/100`}
              </Text>
            </View>
          </View>
          <Feather name="chevron-right" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Skills Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>
              <Feather name="code" size={14} color="#38bdf8" /> Technical Skills ({profile?.skills?.length || 0})
            </Text>
          </View>

          <View style={styles.skillsCloud}>
            {profile?.skills?.map((s) => (
              <View key={s} style={styles.skillPill}>
                <Text style={styles.skillText}>{s}</Text>
                <TouchableOpacity onPress={() => handleRemoveSkill(s)} hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                  <Ionicons name="close" size={12} color={COLORS.tagBlueText} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Add skill input */}
          <View style={styles.addSkillRow}>
            <TextInput
              style={styles.skillInput}
              placeholder="Add skill (e.g. Next.js, Docker)..."
              placeholderTextColor={COLORS.textMuted}
              value={newSkill}
              onChangeText={setNewSkill}
            />
            <TouchableOpacity style={styles.addSkillBtn} onPress={() => handleAddSkill()}>
              <Text style={styles.addSkillBtnText}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Recommended chips */}
          <View style={styles.recSkillsRow}>
            <Text style={styles.recSkillsLabel}>Popular:</Text>
            {popularSkills.filter(s => !profile?.skills?.includes(s)).slice(0, 3).map((s) => (
              <TouchableOpacity key={s} style={styles.recChip} onPress={() => handleAddSkill(s)}>
                <Text style={styles.recChipText}>+ {s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Education Section */}
        <View style={styles.sectionCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={styles.sectionTitle}>
              <Feather name="book-open" size={14} color="#ffffff" /> Education
            </Text>
            <TouchableOpacity
              onPress={() => setShowAddEdu(true)}
              style={{ backgroundColor: 'rgba(52, 211, 153, 0.15)', borderWidth: 1, borderColor: 'rgba(52, 211, 153, 0.3)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}
            >
              <Text style={{ color: '#34d399', fontSize: 11, fontWeight: '700' }}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {(!profile?.education || profile.education.length === 0) ? (
            <View style={{ alignItems: 'center', paddingVertical: 18, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 10, borderWidth: 1, borderColor: '#262626' }}>
              <Text style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 8 }}>No education records added yet.</Text>
              <TouchableOpacity onPress={() => setShowAddEdu(true)} style={{ backgroundColor: '#ffffff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 }}>
                <Text style={{ color: '#000000', fontSize: 11, fontWeight: '800' }}>+ Add Degree</Text>
              </TouchableOpacity>
            </View>
          ) : (
            profile.education.map((edu) => (
              <View key={edu.id} style={styles.eduItem}>
                <Text style={styles.eduInst}>{edu.institution}</Text>
                <Text style={styles.eduDeg}>{edu.degree}</Text>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 2 }}>
                  <Text style={styles.eduYear}>{edu.year}</Text>
                  <Text style={styles.eduScore}>{edu.score}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Experience Section */}
        <View style={styles.sectionCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={styles.sectionTitle}>
              <Feather name="briefcase" size={14} color="#ffffff" /> Experience
            </Text>
            <TouchableOpacity
              onPress={() => setShowAddExp(true)}
              style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}
            >
              <Text style={{ color: '#fbbf24', fontSize: 11, fontWeight: '700' }}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {(!profile?.experience || profile.experience.length === 0) ? (
            <View style={{ alignItems: 'center', paddingVertical: 18, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 10, borderWidth: 1, borderColor: '#262626' }}>
              <Text style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 8 }}>No experience or internships added yet.</Text>
              <TouchableOpacity onPress={() => setShowAddExp(true)} style={{ backgroundColor: '#ffffff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 }}>
                <Text style={{ color: '#000000', fontSize: 11, fontWeight: '800' }}>+ Add Experience</Text>
              </TouchableOpacity>
            </View>
          ) : (
            profile.experience.map((exp) => (
              <View key={exp.id} style={styles.expItem}>
                <Text style={styles.expRole}>{exp.role}</Text>
                <Text style={styles.expComp}>{exp.company} • {exp.location}</Text>
                <Text style={styles.expDuration}>{exp.duration}</Text>
                <Text style={styles.expDesc}>{exp.description}</Text>
              </View>
            ))
          )}
        </View>

        {/* Career Preferences */}
        <View style={styles.sectionCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={styles.sectionTitle}>🎯 Career Preferences</Text>
            <TouchableOpacity onPress={() => { setFormData({ ...profile }); setEditing(true); }}>
              <Text style={{ color: '#38bdf8', fontSize: 11, fontWeight: '700' }}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.prefGrid}>
            <View style={styles.prefBox}>
              <Text style={styles.prefLabel}>Target Location:</Text>
              <Text style={styles.prefVal}>{profile?.preferredLocation || "Bangalore / Remote"}</Text>
            </View>
            <View style={styles.prefBox}>
              <Text style={styles.prefLabel}>Expected CTC:</Text>
              <Text style={[styles.prefVal, { color: '#ffffff' }]}>{profile?.expectedSalary || "₹8–12 LPA"}</Text>
            </View>
            <View style={styles.prefBox}>
              <Text style={styles.prefLabel}>Work Mode:</Text>
              <Text style={[styles.prefVal, { color: '#d4d4d4' }]}>{profile?.preferredWorkMode || "Hybrid"}</Text>
            </View>
            <View style={styles.prefBox}>
              <Text style={styles.prefLabel}>Graduation:</Text>
              <Text style={[styles.prefVal, { color: '#ffffff' }]}>{profile?.graduationYear ? `${profile.graduationYear} Batch` : "2026 Batch"}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={editing} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Edit Profile Information</Text>
              <TouchableOpacity onPress={() => setEditing(false)}>
                <Ionicons name="close" size={20} color={COLORS.textMain} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.modalInput}
                value={formData.name || ''}
                onChangeText={(v) => setFormData({ ...formData, name: v })}
              />

              <Text style={styles.inputLabel}>Professional Headline</Text>
              <TextInput
                style={styles.modalInput}
                value={formData.headline || ''}
                onChangeText={(v) => setFormData({ ...formData, headline: v })}
              />

              <Text style={styles.inputLabel}>College / University</Text>
              <TextInput
                style={styles.modalInput}
                value={formData.college || ''}
                onChangeText={(v) => setFormData({ ...formData, college: v })}
              />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Target Location</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Bangalore / Remote"
                    placeholderTextColor={COLORS.textMuted}
                    value={formData.preferredLocation || ''}
                    onChangeText={(v) => setFormData({ ...formData, preferredLocation: v })}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Work Mode</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Hybrid / Remote"
                    placeholderTextColor={COLORS.textMuted}
                    value={formData.preferredWorkMode || ''}
                    onChangeText={(v) => setFormData({ ...formData, preferredWorkMode: v })}
                  />
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Expected CTC</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="₹8–12 LPA"
                    placeholderTextColor={COLORS.textMuted}
                    value={formData.expectedSalary || ''}
                    onChangeText={(v) => setFormData({ ...formData, expectedSalary: v })}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Graduation Year</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="2026"
                    placeholderTextColor={COLORS.textMuted}
                    value={formData.graduationYear || ''}
                    onChangeText={(v) => setFormData({ ...formData, graduationYear: v })}
                  />
                </View>
              </View>

              <TouchableOpacity style={[styles.modalSubmitBtn, { marginTop: 16 }]} onPress={handleSave}>
                <Text style={styles.modalSubmitText}>Save Profile</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Education Modal */}
      <Modal visible={showAddEdu} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Add Education</Text>
              <TouchableOpacity onPress={() => setShowAddEdu(false)}>
                <Ionicons name="close" size={20} color={COLORS.textMain} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>College / Institution</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. National Institute of Technology"
              placeholderTextColor={COLORS.textMuted}
              value={eduInst}
              onChangeText={setEduInst}
            />

            <Text style={styles.inputLabel}>Degree & Branch</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. B.Tech Computer Science"
              placeholderTextColor={COLORS.textMuted}
              value={eduDeg}
              onChangeText={setEduDeg}
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Year</Text>
                <TextInput
                  style={styles.modalInput}
                  value={eduYear}
                  onChangeText={setEduYear}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>CGPA / Score</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="8.6 / 10"
                  placeholderTextColor={COLORS.textMuted}
                  value={eduScore}
                  onChangeText={setEduScore}
                />
              </View>
            </View>

            <TouchableOpacity style={[styles.modalSubmitBtn, { marginTop: 16 }]} onPress={handleAddEducation}>
              <Text style={styles.modalSubmitText}>Save Education</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Experience Modal */}
      <Modal visible={showAddExp} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Add Experience / Internship</Text>
              <TouchableOpacity onPress={() => setShowAddExp(false)}>
                <Ionicons name="close" size={20} color={COLORS.textMain} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Job / Role Title</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Frontend Developer Intern"
              placeholderTextColor={COLORS.textMuted}
              value={expRole}
              onChangeText={setExpRole}
            />

            <Text style={styles.inputLabel}>Company Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. ABC Technologies"
              placeholderTextColor={COLORS.textMuted}
              value={expComp}
              onChangeText={setExpComp}
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.modalInput}
                  value={expLoc}
                  onChangeText={setExpLoc}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Duration</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. 3 months"
                  placeholderTextColor={COLORS.textMuted}
                  value={expDuration}
                  onChangeText={setExpDuration}
                />
              </View>
            </View>

            <TouchableOpacity style={[styles.modalSubmitBtn, { marginTop: 16 }]} onPress={handleAddExperience}>
              <Text style={styles.modalSubmitText}>Save Experience</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 110,
  },
  headerBox: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.lg,
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: '#383838',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.md,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  editBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
    borderRadius: RADIUS.md,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: COLORS.textMain,
    fontSize: 18,
    fontWeight: '800',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: RADIUS.full,
  },
  verifiedText: {
    color: COLORS.accentEmerald,
    fontSize: 10,
    fontWeight: '700',
  },
  headline: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 16,
    gap: 14,
  },
  meterCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.lg,
    padding: 14,
  },
  meterTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  meterTitle: {
    color: COLORS.textMain,
    fontSize: 13,
    fontWeight: '700',
  },
  meterVal: {
    color: COLORS.accentEmerald,
    fontSize: 13,
    fontWeight: '800',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accentEmerald,
    borderRadius: 3,
  },
  meterSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
  resumeJump: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.md,
    padding: 12,
  },
  jumpTitle: {
    color: COLORS.textMain,
    fontSize: 13,
    fontWeight: '700',
  },
  jumpSub: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  sectionCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.lg,
    padding: 14,
  },
  sectionHead: {
    marginBottom: 10,
  },
  sectionTitle: {
    color: COLORS.textMain,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  skillsCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  skillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.tagBlueBg,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
  },
  skillText: {
    color: COLORS.tagBlueText,
    fontSize: 11,
    fontWeight: '600',
  },
  addSkillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  skillInput: {
    flex: 1,
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.md,
    paddingHorizontal: 10,
    height: 38,
    color: COLORS.textMain,
    fontSize: 12,
  },
  addSkillBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSkillBtnText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
  },
  recSkillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  recSkillsLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  recChip: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.full,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  recChipText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  eduItem: {
    borderLeftWidth: 2,
    borderLeftColor: COLORS.primary,
    paddingLeft: 10,
    marginBottom: 10,
  },
  eduInst: {
    color: COLORS.textMain,
    fontSize: 13,
    fontWeight: '700',
  },
  eduDeg: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  eduYear: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  eduScore: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  expItem: {
    borderLeftWidth: 2,
    borderLeftColor: COLORS.accentAmber,
    paddingLeft: 10,
    marginBottom: 10,
  },
  expRole: {
    color: COLORS.textMain,
    fontSize: 13,
    fontWeight: '700',
  },
  expComp: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  expDuration: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  expDesc: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  prefGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  prefBox: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: RADIUS.md,
    padding: 8,
  },
  prefLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  prefVal: {
    color: COLORS.textMain,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: COLORS.bgSecondary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: SPACING.lg,
    maxHeight: '85%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    color: COLORS.textMain,
    fontSize: 16,
    fontWeight: '800',
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.md,
    padding: 10,
    color: COLORS.textMain,
    fontSize: 13,
  },
  modalSubmitBtn: {
    backgroundColor: '#ffffff',
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubmitText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '800',
  },
});
