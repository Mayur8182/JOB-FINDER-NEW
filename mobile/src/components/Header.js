import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme';

export default function Header({
  profile,
  unreadCount,
  savedCount = 0,
  onOpenNotifications,
  onOpenSaved,
  onRoleToggle,
  currentRole
}) {
  const initial = profile?.name ? profile.name.charAt(0).toUpperCase() : '?';

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View>
          <Text style={styles.greeting}>Hello, welcome back 👋</Text>
          <Text style={styles.userName}>{profile?.name || 'My Profile'}</Text>
        </View>
      </View>

      <View style={styles.rightRow}>
        {/* Role Mode Indicator & Switcher */}
        <TouchableOpacity
          style={[styles.roleBtn, currentRole === 'recruiter' ? styles.roleBtnRecruiter : styles.roleBtnStudent]}
          onPress={onRoleToggle}
          activeOpacity={0.8}
        >
          <Feather
            name={currentRole === 'recruiter' ? "briefcase" : "user"}
            size={12}
            color={currentRole === 'recruiter' ? '#ffffff' : '#d4d4d4'}
          />
          <Text style={[styles.roleText, currentRole === 'recruiter' ? { color: '#ffffff', fontWeight: '800' } : { color: '#d4d4d4', fontWeight: '700' }]}>
            {currentRole === 'recruiter' ? '🏢 Recruiter' : '🎓 Student'}
          </Text>
          <Feather name="refresh-cw" size={10} color="#737373" style={{ marginLeft: 2 }} />
        </TouchableOpacity>

        {/* Saved Jobs Quick Action Button */}
        {onOpenSaved && (
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={onOpenSaved}
            activeOpacity={0.8}
          >
            <Feather name="bookmark" size={18} color={COLORS.textMain} />
            {savedCount > 0 && (
              <View style={[styles.badge, { backgroundColor: '#737373' }]}>
                <Text style={styles.badgeText}>{savedCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {/* Notification Bell */}
        <TouchableOpacity
          style={styles.bellBtn}
          onPress={onOpenNotifications}
          activeOpacity={0.8}
        >
          <Ionicons name="notifications-outline" size={20} color={COLORS.textMain} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: '#383838',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  greeting: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  userName: {
    color: COLORS.textMain,
    fontSize: 15,
    fontWeight: '700',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  roleBtnStudent: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: '#383838',
  },
  roleBtnRecruiter: {
    backgroundColor: '#1f1f1f',
    borderColor: '#555555',
  },
  roleText: {
    fontSize: 11,
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.accentRose,
    borderRadius: 9,
    width: 17,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
});
