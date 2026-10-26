import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme';

export default function JobCard({
  job,
  isSaved,
  onPress,
  onToggleSave,
  onApply
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() => onPress(job)}
    >
      <View style={styles.topRow}>
        <Image
          source={{ uri: job.logo }}
          style={styles.logo}
          resizeMode="cover"
        />

        <View style={styles.headerInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {job.title}
            </Text>

            <TouchableOpacity
              onPress={() => onToggleSave(job.id)}
              style={styles.bookmarkBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={20}
                color={isSaved ? "#ffffff" : COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.companyRow}>
            <Text style={styles.companyName}>{job.company}</Text>
            {job.companyVerified && (
              <Ionicons name="checkmark-circle" size={14} color="#ffffff" style={{ marginLeft: 4 }} />
            )}
            <Text style={styles.dot}>•</Text>
            <Text style={styles.location}>{job.location}</Text>
            {(job.isNewUpload || job.postedDate === 'Just now') && (
              <View style={{ backgroundColor: '#ffffff', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4, marginLeft: 6 }}>
                <Text style={{ color: '#000000', fontSize: 9, fontWeight: '900' }}>⚡ NEW</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Tags row */}
      <View style={styles.tagsRow}>
        <View style={[styles.pill, { backgroundColor: '#1a1a1a', borderColor: '#333', borderWidth: 1 }]}>
          <Text style={[styles.pillText, { color: '#ffffff' }]}>{job.workMode}</Text>
        </View>
        <View style={[styles.pill, { backgroundColor: '#1a1a1a', borderColor: '#333', borderWidth: 1 }]}>
          <Text style={[styles.pillText, { color: '#d4d4d4' }]}>{job.experience}</Text>
        </View>
        <View style={[styles.pill, { backgroundColor: '#141414', borderColor: '#262626', borderWidth: 1 }]}>
          <Text style={[styles.pillText, { color: COLORS.textSecondary }]}>{job.jobType}</Text>
        </View>
      </View>

      {/* Bottom Footer */}
      <View style={styles.footerRow}>
        <View>
          <Text style={styles.salaryLabel}>Package / Stipend</Text>
          <Text style={styles.salaryValue}>{job.salary}</Text>
        </View>

        <View style={styles.actionsRight}>
          <Text style={styles.applicantsCount}>
            <Feather name="users" size={11} color={COLORS.textMuted} /> {job.applicantsCount} applied
          </Text>

          <TouchableOpacity
            style={styles.applyBtn}
            activeOpacity={0.8}
            onPress={(e) => {
              e.stopPropagation();
              onApply(job);
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.applyBtnText}>Apply Now</Text>
              <Feather name="arrow-up-right" size={13} color="#000000" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: SPACING.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.md,
    marginRight: SPACING.sm + 4,
    backgroundColor: '#1e293b',
  },
  headerInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: COLORS.textMain,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 6,
  },
  bookmarkBtn: {
    padding: 2,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  companyName: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  dot: {
    color: COLORS.textMuted,
    marginHorizontal: 5,
    fontSize: 12,
  },
  location: {
    color: COLORS.tagBlueText,
    fontSize: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
    marginBottom: 12,
  },
  pill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    paddingTop: 10,
  },
  salaryLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  salaryValue: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  applicantsCount: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  applyBtn: {
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
  },
  applyBtnText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
  },
});
