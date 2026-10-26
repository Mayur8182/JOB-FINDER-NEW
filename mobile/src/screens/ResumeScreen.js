import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, Modal, 
  TextInput, StyleSheet, Alert, ActivityIndicator 
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme';

export default function ResumeScreen({
  resumes,
  onUploadResume,
  onCreateResume,
  onDeleteResume
}) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBuilderModal, setShowBuilderModal] = useState(false);

  // Upload Form
  const [uploadTitle, setUploadTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  // Builder Form
  const [targetRole, setTargetRole] = useState('');
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState('');

  const handleUploadSubmit = () => {
    setUploading(true);
    setTimeout(() => {
      onUploadResume({
        title: uploadTitle,
        fileName: fileName,
        skills: ["React", "JavaScript", "Node.js", "Express", "MongoDB", "Redux", "REST APIs"]
      });
      setUploading(false);
      setShowUploadModal(false);
      Alert.alert("Resume Processed!", "AI extracted 7 technical skills with ATS score 88/100.");
    }, 1000);
  };

  const handleBuildSubmit = () => {
    const skillsArr = skills.split(',').map(s => s.trim()).filter(Boolean);
    onCreateResume({
      title: targetRole,
      summary,
      skills: skillsArr
    });
    setShowBuilderModal(false);
    Alert.alert("ATS Resume Generated", "Your resume has been built and set as primary for applications.");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Resume & ATS Analyzer 📄</Text>
        <Text style={styles.subtitle}>Manage your resumes and maximize interview shortlist rates</Text>
      </View>

      <View style={styles.content}>
        {/* Top Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => setShowUploadModal(true)}
            activeOpacity={0.8}
          >
            <Feather name="upload-cloud" size={16} color="#000" />
            <Text style={styles.uploadBtnText}>Upload PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.builderBtn}
            onPress={() => setShowBuilderModal(true)}
            activeOpacity={0.8}
          >
            <Feather name="plus-circle" size={16} color={COLORS.textMain} />
            <Text style={styles.builderBtnText}>Build with AI</Text>
          </TouchableOpacity>
        </View>

        {/* ATS Health Card — Dynamically tied to genuine resumes */}
        {resumes.length === 0 ? (
          <View style={[styles.healthCard, { borderColor: '#333333', backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', paddingVertical: 18 }]}>
            <Feather name="shield" size={24} color={COLORS.textMuted} style={{ marginBottom: 6 }} />
            <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '700', marginBottom: 4 }}>No Active Resume Uploaded</Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 11, textAlign: 'center', paddingHorizontal: 12 }}>
              Upload your PDF resume or use AI builder to calculate your verified ATS score and unlock one-click applications.
            </Text>
          </View>
        ) : (
          <View style={styles.healthCard}>
            <View style={styles.healthTop}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Feather name="shield" size={16} color={COLORS.accentEmerald} />
                <Text style={styles.healthTitle}>ATS Keyword Score</Text>
              </View>
              <View style={styles.scorePill}>
                <Text style={styles.scorePillText}>
                  {Math.max(...resumes.map(r => r.atsScore || 0))}/100 (Verified)
                </Text>
              </View>
            </View>
            <Text style={styles.healthDesc}>
              ✓ High keyword alignment with Full Stack & Frontend engineering job descriptions.
            </Text>
          </View>
        )}

        {/* Resumes List */}
        <Text style={styles.sectionHeading}>Your Uploaded Resumes ({resumes.length})</Text>

        {resumes.length === 0 ? (
          <View style={{ paddingVertical: 24, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 12, borderWidth: 1, borderColor: '#262626' }}>
            <Feather name="file-text" size={28} color={COLORS.textMuted} style={{ marginBottom: 6 }} />
            <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>No resumes uploaded yet.</Text>
          </View>
        ) : (
          resumes.map((r) => (
          <View key={r.id} style={styles.resumeCard}>
            <View style={styles.resumeTop}>
              <View style={styles.fileIcon}>
                <Feather name="file-text" size={20} color="#f472b6" />
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.resumeTitle}>{r.title}</Text>
                  {r.isPrimary && (
                    <View style={styles.primaryPill}>
                      <Text style={styles.primaryText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.resumeMeta}>{r.name} • {r.fileSize}</Text>
              </View>
            </View>

            <View style={styles.atsScoreRow}>
              <Feather name="check-circle" size={12} color={COLORS.accentEmerald} />
              <Text style={styles.atsScoreText}>
                ATS Compatibility: <Text style={{ color: COLORS.accentEmerald, fontWeight: '700' }}>{r.atsScore}%</Text>
              </Text>
            </View>

            {/* Parsed skills */}
            <View style={styles.skillsCloud}>
              {r.parsedSkills?.map((skill, idx) => (
                <View key={idx} style={styles.skillChip}>
                  <Text style={styles.skillChipText}>{skill}</Text>
                </View>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.resumeBottom}>
              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={() => Alert.alert("Download", `Simulating download of ${r.name}`)}
              >
                <Feather name="download" size={12} color={COLORS.primary} />
                <Text style={styles.downloadText}>Download</Text>
              </TouchableOpacity>

              {resumes.length > 1 && (
                <TouchableOpacity
                  onPress={() => onDeleteResume(r.id)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                >
                  <Feather name="trash-2" size={12} color={COLORS.accentRose} />
                  <Text style={{ color: COLORS.accentRose, fontSize: 11 }}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )))}
      </View>

      {/* Upload Modal */}
      <Modal visible={showUploadModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Upload Resume PDF</Text>
              <TouchableOpacity onPress={() => setShowUploadModal(false)}>
                <Ionicons name="close" size={20} color={COLORS.textMain} />
              </TouchableOpacity>
            </View>

            <View style={styles.dropZone}>
              <Feather name="file-plus" size={32} color={COLORS.primary} />
              <Text style={styles.dropTitle}>{fileName}</Text>
              <Text style={styles.dropSub}>PDF format • Max 5MB</Text>
            </View>

            <Text style={styles.inputLabel}>Resume Target Role / Title</Text>
            <TextInput
              style={styles.modalInput}
              value={uploadTitle}
              onChangeText={setUploadTitle}
            />

            <TouchableOpacity
              style={[styles.modalSubmitBtn, { marginTop: 16 }]}
              onPress={handleUploadSubmit}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalSubmitText}>Run ATS Parse & Upload</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Builder Modal */}
      <Modal visible={showBuilderModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>AI Resume Builder</Text>
              <TouchableOpacity onPress={() => setShowBuilderModal(false)}>
                <Ionicons name="close" size={20} color={COLORS.textMain} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Target Job Title</Text>
            <TextInput
              style={styles.modalInput}
              value={targetRole}
              onChangeText={setTargetRole}
            />

            <Text style={styles.inputLabel}>Professional Summary</Text>
            <TextInput
              style={[styles.modalInput, { height: 60 }]}
              value={summary}
              onChangeText={setSummary}
              multiline={true}
            />

            <Text style={styles.inputLabel}>Core Technical Skills (comma separated)</Text>
            <TextInput
              style={styles.modalInput}
              value={skills}
              onChangeText={setSkills}
            />

            <TouchableOpacity
              style={[styles.modalSubmitBtn, { marginTop: 16 }]}
              onPress={handleBuildSubmit}
            >
              <Text style={styles.modalSubmitText}>Generate ATS Optimized Resume</Text>
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
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 10,
    paddingBottom: 14,
  },
  title: {
    color: COLORS.textMain,
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: SPACING.lg,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  uploadBtn: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  uploadBtnText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '800',
  },
  builderBtn: {
    flex: 1,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  builderBtnText: {
    color: COLORS.textMain,
    fontSize: 13,
    fontWeight: '600',
  },
  healthCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.lg,
    padding: 14,
    marginBottom: 18,
  },
  healthTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  healthTitle: {
    color: COLORS.textMain,
    fontSize: 13,
    fontWeight: '700',
  },
  scorePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
  },
  scorePillText: {
    color: COLORS.accentEmerald,
    fontSize: 11,
    fontWeight: '700',
  },
  healthDesc: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  sectionHeading: {
    color: COLORS.textMain,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  resumeCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.lg,
    padding: 14,
    marginBottom: 12,
  },
  resumeTop: {
    flexDirection: 'row',
    gap: 12,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeTitle: {
    color: COLORS.textMain,
    fontSize: 14,
    fontWeight: '700',
  },
  primaryPill: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: RADIUS.full,
  },
  primaryText: {
    color: '#818cf8',
    fontSize: 10,
    fontWeight: '700',
  },
  resumeMeta: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  atsScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  atsScoreText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  skillsCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  skillChip: {
    backgroundColor: COLORS.tagBlueBg,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: RADIUS.full,
  },
  skillChipText: {
    color: COLORS.tagBlueText,
    fontSize: 10,
  },
  resumeBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    paddingTop: 10,
    marginTop: 10,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  downloadText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
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
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    color: COLORS.textMain,
    fontSize: 16,
    fontWeight: '800',
  },
  dropZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(99, 102, 241, 0.4)',
    borderRadius: RADIUS.md,
    padding: 20,
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  dropTitle: {
    color: COLORS.textMain,
    fontSize: 13,
    fontWeight: '700',
  },
  dropSub: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 8,
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
