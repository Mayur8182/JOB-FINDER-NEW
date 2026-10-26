import React from 'react';
import { 
  Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet 
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme';

export default function NotificationsModal({
  visible,
  notifications,
  onClose,
  onMarkAllRead,
  onNotificationPress
}) {
  const getIcon = (type) => {
    switch (type) {
      case 'shortlist':
        return <Ionicons name="ribbon-outline" size={20} color={COLORS.accentEmerald} />;
      case 'interview':
        return <Feather name="calendar" size={18} color="#60a5fa" />;
      case 'match':
        return <Feather name="zap" size={18} color="#ec4899" />;
      case 'deadline':
        return <Ionicons name="alert-circle-outline" size={20} color={COLORS.accentAmber} />;
      default:
        return <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />;
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

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Notifications</Text>
              <Text style={styles.subtitle}>Recent career & application updates</Text>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity onPress={onMarkAllRead} style={styles.markReadBtn}>
                <Ionicons name="checkmark-done" size={16} color={COLORS.primary} />
                <Text style={styles.markReadText}>Mark read</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={18} color={COLORS.textMain} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {notifications.map((n) => (
              <TouchableOpacity
                key={n.id}
                style={[styles.notifCard, !n.read && styles.notifCardUnread]}
                onPress={() => {
                  onNotificationPress(n);
                  onClose();
                }}
                activeOpacity={0.8}
              >
                <View style={styles.iconCircle}>
                  {getIcon(n.type)}
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.notifTop}>
                    <Text style={[styles.notifTitle, !n.read && { fontWeight: '800' }]} numberOfLines={1}>
                      {n.title}
                    </Text>
                    <Text style={styles.notifTime}>{n.time}</Text>
                  </View>
                  <Text style={styles.notifMsg}>{n.message}</Text>
                </View>

                {!n.read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    maxHeight: '80%',
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
    paddingBottom: 12,
  },
  title: {
    color: COLORS.textMain,
    fontSize: 17,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  markReadText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
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
    paddingBottom: 24,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 10,
    position: 'relative',
  },
  notifCardUnread: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: 'rgba(99, 102, 241, 0.35)',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  notifTitle: {
    color: COLORS.textMain,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    marginRight: 6,
  },
  notifTime: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  notifMsg: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
