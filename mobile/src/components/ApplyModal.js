import React, { useState } from 'react';
import { 
  Modal, View, Text, TouchableOpacity, TextInput, 
  ScrollView, StyleSheet, ActivityIndicator 
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme';

export default function ApplyModal({
  visible,
  job,
  resumes,
  onClose,
  onSubmit
}) {
  const [selectedResumeId, setSelectedResumeId] = useState(resumes[0]?.id || '');
  const [immediateJoiner, setImmediateJoiner] = useState('yes');
  const [coverPitch, setCoverPitch] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!job) return null;

  const handleSubmit = async () => {
    setLoading(true);
    const chosenResume = resumes.find(r => r.id === selectedResumeId) || resumes[0] || { name: 'Profile_Resume.pdf' };

    try {
      await onSubmit({
        jobId: job.id,
        resumeName: chosenResume?.name || '',
        coverPitch,
        answers: { immediateJoiner }
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1600);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />

          {isSuccess ? (
            <View style={styles.successBox}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={54} color={COLORS.accentEmerald} />
              </View>
              <Text style={styles.successTitle}>Application Submitted! 🎉</Text>
              <Text style={styles.successSubtitle}>
                Your profile & resume were received by {job.company}.
              </Text>
              <Text style={styles.successNote}>Redirecting to your Application Tracker...</Text>
            </View>
          ) : (
            <>
              {/* Header */}
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.subTag}>One-Tap Application</Text>
                  <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
                  <Text style={styles.companyName}>{job.company}</Text>
                </View>

                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={18} color={COLORS.textMain} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Select Resume */}
                <Text style={styles.fieldLabel}>Select Resume to Attach:</Text>
                {resumes.length === 0 ? (
                  <View style={[styles.resumeCard, styles.resumeCardSelected]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                      <View>
                        <Text style={styles.resumeName}>Profile Fast-Apply</Text>
                        <Text style={styles.atsScore}>
                          ATS Score: <Text style={{ color: COLORS.textMuted, fontWeight: '600' }}>Not Analyzed (Upload PDF)</Text>
                        </Text>
                      </View>
                    </View>
                    <Feather name="file-text" size={18} color={COLORS.textSecondary} />
                  </View>
                ) : (
                  resumes.map(r => {
                    const isSelected = selectedResumeId === r.id;
                    return (
                      <TouchableOpacity
                        key={r.id}
                        style={[styles.resumeCard, isSelected && styles.resumeCardSelected]}
                        onPress={() => setSelectedResumeId(r.id)}
                        activeOpacity={0.8}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <Ionicons
                            name={isSelected ? "radio-button-on" : "radio-button-off"}
                            size={18}
                            color={isSelected ? COLORS.primary : COLORS.textMuted}
                          />
                          <View>
                            <Text style={styles.resumeName}>{r.title || r.name}</Text>
                            <Text style={styles.atsScore}>
                              ATS Score: <Text style={{ color: '#ffffff', fontWeight: '700' }}>{r.atsScore}/100</Text>
                            </Text>
                          </View>
                        </View>
                        <Feather name="file-text" size={18} color={COLORS.textMuted} />
                      </TouchableOpacity>
                    );
                  })
                )}

                {/* Screening Question */}
                <Text style={styles.fieldLabel}>Are you available for immediate start?</Text>
                <View style={styles.choiceRow}>
                  <TouchableOpacity
                    style={[styles.choiceBtn, immediateJoiner === 'yes' && styles.choiceBtnActive]}
                    onPress={() => setImmediateJoiner('yes')}
                  >
                    <Text style={[styles.choiceText, immediateJoiner === 'yes' && styles.choiceTextActive]}>
                      Yes, Immediately
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.choiceBtn, immediateJoiner === 'no' && styles.choiceBtnActive]}
                    onPress={() => setImmediateJoiner('no')}
                  >
                    <Text style={[styles.choiceText, immediateJoiner === 'no' && styles.choiceTextActive]}>
                      Notice (15-30 days)
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Quick Pitch */}
                <Text style={styles.fieldLabel}>Quick Pitch to Recruiter (Optional):</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Why are you a standout candidate? E.g. Experienced in React, Node.js..."
                  placeholderTextColor={COLORS.textMuted}
                  value={coverPitch}
                  onChangeText={setCoverPitch}
                  multiline={true}
                  numberOfLines={3}
                />
              </ScrollView>

              {/* Submit Button */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <>
                      <Feather name="send" size={16} color="#000" />
                      <Text style={styles.submitBtnText}>Confirm & Submit Application</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: COLORS.bgSecondary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    maxHeight: '85%',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  dragHandle: {
    width: 44,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingBottom: 12,
  },
  subTag: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  jobTitle: {
    color: COLORS.textMain,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  companyName: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 20,
  },
  fieldLabel: {
    color: COLORS.textMain,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 8,
  },
  resumeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 8,
  },
  resumeCardSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  resumeName: {
    color: COLORS.textMain,
    fontSize: 13,
    fontWeight: '600',
  },
  atsScore: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  choiceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  choiceBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
  },
  choiceBtnActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  choiceText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  choiceTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  textArea: {
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.md,
    padding: 10,
    color: COLORS.textMain,
    fontSize: 13,
    textAlignVertical: 'top',
    height: 70,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    height: 46,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
  },
  successBox: {
    alignItems: 'center',
    padding: 30,
  },
  successIcon: {
    marginBottom: 12,
  },
  successTitle: {
    color: COLORS.textMain,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  successSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  successNote: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 14,
  },
});
