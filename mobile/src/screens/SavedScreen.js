import React from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert 
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import JobCard from '../components/JobCard';
import { COLORS, SPACING } from '../theme';

export default function SavedScreen({
  savedJobs,
  onToggleSave,
  onSelectJob,
  onOpenApply
}) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Opportunities ❤️</Text>
        <Text style={styles.subtitle}>Review your bookmarked jobs before application deadlines</Text>
      </View>

      <View style={styles.listSection}>
        {savedJobs.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="bookmark-outline" size={42} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No saved jobs yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the bookmark icon on any job card to save it here for fast access.
            </Text>
          </View>
        ) : (
          savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={true}
              onPress={onSelectJob}
              onToggleSave={onToggleSave}
              onApply={onOpenApply}
            />
          ))
        )}
      </View>
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
  listSection: {
    paddingHorizontal: SPACING.lg,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    gap: 8,
  },
  emptyTitle: {
    color: COLORS.textMain,
    fontSize: 15,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
