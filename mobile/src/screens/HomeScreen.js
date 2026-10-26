import React from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  FlatList, StyleSheet, Image 
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import JobCard from '../components/JobCard';
import { COLORS, RADIUS, SPACING } from '../theme';

export default function HomeScreen({
  jobs,
  profile,
  savedJobIds,
  onToggleSave,
  onSelectJob,
  onOpenApply,
  onOpenFilter,
  activeFilterCount,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory
}) {
  const categories = [
    { id: 'All', label: 'All Jobs' },
    { id: 'Internship', label: '⚡ Internships' },
    { id: 'Full Time', label: '💼 Full Time' },
    { id: 'Remote', label: '🌐 Remote' },
    { id: 'Fresher', label: '🚀 Freshers' },
    { id: 'HighPay', label: '💰 ₹10L+ LPA' },
  ];

  const userSkills = profile?.skills || [];
  const recommendedJobs = jobs.slice(0, 3).map(j => {
    const matching = j.skills.filter(s => userSkills.includes(s));
    const matchScore = Math.min(98, Math.max(78, Math.round(78 + (matching.length / Math.max(1, j.skills.length)) * 22)));
    return { ...j, matchScore };
  });

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {/* Search and Filter Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Feather name="search" size={16} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search roles, skills (React, Node)..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity
          style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
          onPress={onOpenFilter}
          activeOpacity={0.8}
        >
          <Feather
            name="sliders"
            size={18}
            color={activeFilterCount > 0 ? COLORS.primary : COLORS.textSecondary}
          />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Category Pills Horizontal Scroll */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Recommended For You Section */}
      {!searchQuery && selectedCategory === 'All' && (
        <View style={styles.recommendedSection}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Feather name="star" size={15} color="#ffffff" />
              <Text style={styles.sectionTitle}>Recommended For You</Text>
            </View>
            <Text style={styles.sectionSub}>Based on your skills</Text>
          </View>

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={246}
            contentContainerStyle={styles.recommendedScroll}
          >
            {recommendedJobs.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.recommendedCard}
                onPress={() => onSelectJob(item)}
                activeOpacity={0.85}
              >
                <View style={styles.recommendedTop}>
                  <Image source={{ uri: item.logo }} style={styles.recLogo} />
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>★ {item.matchScore}% Match</Text>
                  </View>
                </View>

                <Text style={styles.recTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.recCompany}>{item.company} • {item.location}</Text>

                <View style={styles.recBottom}>
                  <Text style={styles.recSalary}>{item.salary}</Text>
                  <View style={styles.recTag}>
                    <Text style={styles.recTagText}>{item.workMode}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Main Opportunities Feed */}
      <View style={styles.feedSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'Recent Opportunities' : `${selectedCategory} Postings`} ({jobs.length})
          </Text>
          <Text style={styles.sectionSub}>Verified employers</Text>
        </View>

        {jobs.length === 0 ? (
          <View style={styles.emptyBox}>
            <Feather name="inbox" size={36} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No opportunities found matching criteria.</Text>
          </View>
        ) : (
          jobs.map((item) => (
            <JobCard
              key={item.id}
              job={item}
              isSaved={savedJobIds.includes(item.id)}
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: SPACING.lg,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
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
  searchInput: {
    flex: 1,
    color: COLORS.textMain,
    fontSize: 13,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  categoryScroll: {
    paddingHorizontal: SPACING.lg,
    gap: 8,
    marginBottom: 16,
  },
  categoryPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#000000',
    fontWeight: '800',
  },
  recommendedSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: 10,
  },
  sectionTitle: {
    color: COLORS.textMain,
    fontSize: 15,
    fontWeight: '800',
  },
  sectionSub: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  recommendedScroll: {
    paddingHorizontal: SPACING.lg,
    gap: 12,
  },
  recommendedCard: {
    width: 230,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.lg,
    padding: 12,
  },
  recommendedTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recLogo: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.sm,
    backgroundColor: '#1e293b',
  },
  matchBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: RADIUS.full,
  },
  matchText: {
    color: COLORS.accentEmerald,
    fontSize: 10,
    fontWeight: '700',
  },
  recTitle: {
    color: COLORS.textMain,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  recCompany: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginBottom: 8,
  },
  recBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    paddingTop: 8,
  },
  recSalary: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  recTag: {
    backgroundColor: COLORS.tagBlueBg,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: RADIUS.full,
  },
  recTagText: {
    color: COLORS.tagBlueText,
    fontSize: 10,
    fontWeight: '600',
  },
  feedSection: {
    paddingHorizontal: SPACING.lg,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
});
