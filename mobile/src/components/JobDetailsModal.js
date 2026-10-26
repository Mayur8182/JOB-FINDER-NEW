import React, { useState } from 'react';
import { 
  Modal, View, Text, TouchableOpacity, Image, 
  ScrollView, StyleSheet, Alert, Share 
} from 'react-native';

import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme';

export default function JobDetailsModal({
  visible,
  job,
  isSaved,
  onClose,
  onToggleSave,
  onOpenApply
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, requirements, perks

  if (!job) return null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${job.title} at ${job.company} on Job & Internship Portal! Package: ${job.salary}`,
      });
    } catch (e) {
      console.log(e);
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

          {/* Close & Header Bar */}
          <View style={styles.topBar}>
            <Text style={styles.sectionTitle}>Job Overview</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={COLORS.textMain} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Header info */}
            <View style={styles.headerRow}>
              <Image source={{ uri: job.logo }} style={styles.logo} />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{job.title}</Text>
                <View style={styles.companyRow}>
                  <Text style={styles.company}>{job.company}</Text>
                  {job.companyVerified && (
                    <Ionicons name="checkmark-circle" size={14} color={COLORS.accentEmerald} style={{ marginLeft: 4 }} />
                  )}
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.location}>{job.location}</Text>
                </View>

                {/* Verified Trust Badge */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginTop: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 6,
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderWidth: 1,
                  borderColor: 'rgba(16, 185, 129, 0.25)',
                  alignSelf: 'flex-start'
                }}>
                  <Feather name="shield" size={11} color="#10b981" />
                  <Text style={{ color: '#10b981', fontSize: 10, fontWeight: '700' }}>
                    {job.trustBadge || "100% Verified Employer • Direct HR Listing"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Metrics Grid */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Package / Stipend</Text>
                <Text style={[styles.metricVal, { color: '#38bdf8' }]}>{job.salary}</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Work Mode</Text>
                <Text style={[styles.metricVal, { color: COLORS.accentEmerald }]}>{job.workMode}</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Experience</Text>
                <Text style={[styles.metricVal, { color: COLORS.accentPurple }]}>{job.experience}</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Deadline</Text>
                <Text style={[styles.metricVal, { color: COLORS.accentAmber }]}>{job.deadline}</Text>
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsRow}>
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'requirements', label: 'Requirements' },
                { id: 'salary', label: '💰 In-Hand CTC' },
                { id: 'prep', label: '⚡ AI Prep' },
                { id: 'perks', label: 'Perks' }
              ].map(t => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setActiveTab(t.id)}
                  style={[styles.tabBtn, activeTab === t.id && styles.tabBtnActive]}
                >
                  <Text style={[styles.tabText, activeTab === t.id && styles.tabTextActive]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tab Contents */}
            {activeTab === 'overview' && (
              <View>
                <Text style={styles.descText}>{job.description}</Text>

                <Text style={styles.subHeading}>Key Responsibilities:</Text>
                {job.responsibilities?.map((item, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <View style={styles.bulletDot} />
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}

                <Text style={styles.subHeading}>Required Technical Skills:</Text>
                <View style={styles.skillsRow}>
                  {job.skills?.map((skill, i) => (
                    <View key={i} style={styles.skillPill}>
                      <Text style={styles.skillPillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {activeTab === 'requirements' && (
              <View>
                <Text style={styles.subHeading}>Qualifications & Eligibility:</Text>
                {job.requirements?.map((req, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Ionicons name="checkmark-sharp" size={14} color={COLORS.accentEmerald} style={{ marginTop: 2 }} />
                    <Text style={styles.bulletText}>{req}</Text>
                  </View>
                ))}

                {job.niceToHave && (
                  <>
                    <Text style={styles.subHeading}>Nice to Have:</Text>
                    {job.niceToHave.map((item, i) => (
                      <View key={i} style={styles.bulletRow}>
                        <Feather name="star" size={14} color={COLORS.primary} style={{ marginTop: 2 }} />
                        <Text style={styles.bulletText}>{item}</Text>
                      </View>
                    ))}
                  </>
                )}
              </View>
            )}

            {activeTab === 'salary' && (
              <View style={{ gap: 12 }}>
                <View style={{
                  backgroundColor: '#1a1a1a',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#2e2e2e',
                  padding: 14,
                  gap: 10
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: '#a3a3a3', fontSize: 12 }}>Annual Package (CTC)</Text>
                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '800' }}>{job.salary}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#2e2e2e', paddingTop: 8 }}>
                    <View>
                      <Text style={{ color: '#10b981', fontSize: 12, fontWeight: '700' }}>Estimated Take-Home</Text>
                      <Text style={{ color: '#6ee7b7', fontSize: 10 }}>After standard tax & PF deduction</Text>
                    </View>
                    <Text style={{ color: '#10b981', fontSize: 14, fontWeight: '800' }}>
                      {job.inHandEstimate || "₹65,000 – ₹90,000 / mo"}
                    </Text>
                  </View>
                </View>

                <View style={{
                  backgroundColor: 'rgba(56, 189, 248, 0.08)',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(56, 189, 248, 0.25)',
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10
                }}>
                  <Feather name="trending-up" size={18} color="#38bdf8" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#38bdf8', fontSize: 12, fontWeight: '700' }}>Market Benchmark Comparison</Text>
                    <Text style={{ color: '#bae6fd', fontSize: 11, marginTop: 2 }}>
                      This compensation ranks in the Top 15% tier for {job.experience} engineers in {job.location}.
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'prep' && (
              <View style={{ gap: 12 }}>
                <Text style={{ color: '#a3a3a3', fontSize: 12 }}>
                  Frequently asked interview questions and system concepts at <Text style={{ color: '#fff', fontWeight: '700' }}>{job.company}</Text>:
                </Text>

                {(job.interviewPrep?.technicalQuestions || [
                  { q: "How do you optimize render performance in large component trees?", a: "Use React.memo, useCallback, useMemo, and virtualized lists (FlatList/react-window) to prevent excessive DOM recalculations." },
                  { q: "Explain database indexing and its trade-offs.", a: "Indexes use B-Trees to turn O(n) table scans into O(log n) lookups, but increase storage footprint and slightly slow down write/insert operations." }
                ]).map((qItem, i) => (
                  <View key={i} style={{
                    backgroundColor: '#1a1a1a',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#2e2e2e',
                    padding: 12,
                    gap: 6
                  }}>
                    <Text style={{ color: '#38bdf8', fontSize: 12, fontWeight: '700' }}>
                      Q{i + 1}: {qItem.q}
                    </Text>
                    <Text style={{ color: '#d4d4d4', fontSize: 11, lineHeight: 16 }}>
                      💡 <Text style={{ color: '#fff', fontWeight: '600' }}>Model Answer:</Text> {qItem.a}
                    </Text>
                  </View>
                ))}

                {job.interviewPrep?.topics && (
                  <View style={{
                    backgroundColor: '#171717',
                    padding: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#262626'
                  }}>
                    <Text style={{ color: '#fbbf24', fontSize: 11, fontWeight: '700', marginBottom: 4 }}>
                      🎯 High-Priority Focus Topics:
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      {job.interviewPrep.topics.map((t, idx) => (
                        <View key={idx} style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                          <Text style={{ color: '#fbbf24', fontSize: 10, fontWeight: '600' }}>{t}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}

            {activeTab === 'perks' && (
              <View>
                <Text style={styles.subHeading}>Benefits & Offerings:</Text>
                {job.benefits?.map((benefit, i) => (
                  <View key={i} style={styles.benefitCard}>
                    <MaterialIcons name="card-giftcard" size={18} color={COLORS.accentAmber} />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Sticky Bottom Bar */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              onPress={() => onToggleSave(job.id)}
              style={styles.iconBtn}
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={22}
                color={isSaved ? COLORS.accentRose : COLORS.textMain}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
              <Feather name="share-2" size={18} color={COLORS.textMain} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => {
                onClose();
                onOpenApply(job);
              }}
            >
              <Text style={styles.applyBtnText}>Apply Now</Text>
              <Feather name="arrow-right" size={16} color="#000000" />
            </TouchableOpacity>
          </View>
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
    maxHeight: '90%',
    minHeight: '80%',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  dragHandle: {
    width: 44,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 8,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: 8,
  },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    marginRight: 14,
    backgroundColor: '#1e293b',
  },
  title: {
    color: COLORS.textMain,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  company: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  dot: {
    color: COLORS.textMuted,
    marginHorizontal: 5,
  },
  location: {
    color: COLORS.tagBlueText,
    fontSize: 13,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  metricBox: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.md,
    padding: 10,
  },
  metricLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginBottom: 2,
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    marginBottom: 14,
    gap: 16,
  },
  tabBtn: {
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  descText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  subHeading: {
    color: COLORS.textMain,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 6,
  },
  bulletText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  skillPill: {
    backgroundColor: COLORS.tagBlueBg,
    borderRadius: RADIUS.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  skillPillText: {
    color: COLORS.tagBlueText,
    fontSize: 11,
    fontWeight: '600',
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 8,
  },
  benefitText: {
    color: COLORS.textMain,
    fontSize: 13,
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#141414',
    borderTopWidth: 1,
    borderTopColor: '#262626',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    height: 46,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  applyBtnText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '800',
  },
});
