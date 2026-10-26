import React from 'react';
import { 
  Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme';

export default function FilterModal({
  visible,
  filters,
  setFilters,
  onClose,
  onApply,
  onReset
}) {
  const jobTypes = ['All', 'Full Time', 'Internship', 'Part Time'];
  const experiences = ['All', 'Fresher', '0–1 years', '1–3 years', '3+ years'];
  const locations = ['All', 'Ahmedabad', 'Vadodara', 'Bangalore', 'Mumbai', 'Remote'];
  const workModes = ['All', 'Remote', 'Hybrid', 'On-site'];
  const salaries = [
    { label: 'All', val: '' },
    { label: '₹3L+ LPA', val: '3' },
    { label: '₹6L+ LPA', val: '6' },
    { label: '₹10L+ LPA', val: '10' }
  ];

  const renderChips = (title, items, currentVal, onSelect) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.chipsRow}>
        {items.map((item) => {
          const val = typeof item === 'object' ? item.val : item;
          const label = typeof item === 'object' ? item.label : item;
          const isSelected = currentVal === val;

          return (
            <TouchableOpacity
              key={label}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelect(val)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

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

          <View style={styles.header}>
            <Text style={styles.title}>Filter Jobs & Internships</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color={COLORS.textMain} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {renderChips('Job Type', jobTypes, filters.type, (v) => setFilters({ ...filters, type: v }))}
            {renderChips('Experience Level', experiences, filters.experience, (v) => setFilters({ ...filters, experience: v }))}
            {renderChips('Location', locations, filters.location, (v) => setFilters({ ...filters, location: v }))}
            {renderChips('Work Mode', workModes, filters.workMode, (v) => setFilters({ ...filters, workMode: v }))}
            {renderChips('Minimum Package', salaries, filters.salaryMin, (v) => setFilters({ ...filters, salaryMin: v }))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyBtn} onPress={onApply}>
              <Text style={styles.applyBtnText}>Apply Filters</Text>
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
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: 10,
  },
  title: {
    color: COLORS.textMain,
    fontSize: 16,
    fontWeight: '800',
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
  section: {
    marginTop: 14,
  },
  sectionTitle: {
    color: COLORS.textMain,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  chipSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  resetBtn: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  applyBtn: {
    flex: 2,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
  },
});
