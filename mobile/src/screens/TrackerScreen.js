import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, Image, 
  StyleSheet, Alert, Modal, Linking 
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme';
import OfferLetterModal from '../components/OfferLetterModal';

export default function TrackerScreen({
  applications = [],
  profile,
  onWithdrawApplication,
  onSelectJobForDetails,
  onAcceptOffer,
  onDeclineOffer,
  onViewFeed
}) {
  const [filterTab, setFilterTab] = useState('All');
  const [expandedId, setExpandedId] = useState(applications[0]?.id || null);
  const [selectedAppForOffer, setSelectedAppForOffer] = useState(null);
  const [activeInterviewApp, setActiveInterviewApp] = useState(null);
  const [activePrepApp, setActivePrepApp] = useState(null);

  // Video Room Simulator State
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const tabs = ['All', 'Active', 'Shortlisted', 'Interview', 'Offer', 'Rejected'];

  const filteredApps = applications.filter((app) => {
    if (filterTab === 'All') return true;
    if (filterTab === 'Active') return !['Offer', 'Rejected'].includes(app.status);
    return app.status.toLowerCase() === filterTab.toLowerCase();
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shortlisted': return '#34d399';
      case 'Interview': return '#38bdf8';
      case 'Offer': return '#ffffff';
      case 'Rejected': return '#f43f5e';
      case 'Under Review': return COLORS.textSecondary;
      case 'Applied': return COLORS.textSecondary;
      default: return COLORS.accentRose;
    }
  };

  const handleJoinMeeting = () => {
    Alert.alert(
      "Interview Meeting Room",
      "Connecting to Google Meet video room: https://meet.google.com/abc-xyz-pqr",
      [{ text: "OK" }]
    );
  };

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={styles.container}
    >
      {/* Title */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Applications 📋</Text>
          <Text style={styles.subtitle}>Track your live interview pipeline & company offer letters</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{applications.length} Total</Text>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsScroll}
      >
        {tabs.map((tab) => {
          const isSelected = filterTab === tab;
          const count = applications.filter(a => {
            if (tab === 'All') return true;
            if (tab === 'Active') return !['Offer', 'Rejected'].includes(a.status);
            return a.status.toLowerCase() === tab.toLowerCase();
          }).length;

          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabPill, isSelected && styles.tabPillActive]}
              onPress={() => setFilterTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                {tab}
              </Text>
              <View style={[styles.badgeCount, isSelected && styles.badgeCountActive]}>
                <Text style={[styles.badgeText, isSelected && styles.badgeTextActive]}>{count}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Application Cards */}
      <View style={styles.listSection}>
        {filteredApps.length === 0 ? (
          <View style={styles.emptyBox}>
            <Feather name="file-text" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No applications in "{filterTab}" category</Text>
            <Text style={styles.emptyText}>Apply to opportunities to track progress and receive offer letters here.</Text>
          </View>
        ) : (
          filteredApps.map((app) => {
            const isExpanded = expandedId === app.id;
            const statusColor = getStatusColor(app.status);
            const isOffered = app.status === 'Offer' || app.offerStatus === 'accepted';

            return (
              <View
                key={app.id}
                style={[
                  styles.appCard, 
                  isExpanded && styles.appCardExpanded,
                  isOffered && styles.appCardOffered
                ]}
              >
                {/* Header Row */}
                <TouchableOpacity
                  style={styles.cardHeader}
                  onPress={() => setExpandedId(isExpanded ? null : app.id)}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: app.companyLogo }} style={styles.companyLogo} />

                  <View style={{ flex: 1 }}>
                    <View style={styles.roleRow}>
                      <Text style={styles.jobTitle} numberOfLines={1}>{app.jobTitle}</Text>
                      <View style={[styles.statusBadge, isOffered ? styles.offerStatusBadge : { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
                        <Text style={[styles.statusText, isOffered ? { color: '#000000', fontWeight: '800' } : { color: statusColor }]}>
                          {app.status}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.companySub} numberOfLines={1}>
                      {app.company} • {app.location}
                    </Text>

                    <View style={styles.dateRow}>
                      <Text style={styles.appliedDate}>
                        Applied: {new Date(app.appliedDate).toLocaleDateString()}
                      </Text>
                      <Feather
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={16}
                        color={COLORS.textSecondary}
                      />
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Offer Letter Callout Banner for Offered applications */}
                {isOffered && (
                  <View style={styles.offerHighlightBox}>
                    <View style={styles.offerHighlightLeft}>
                      <View style={styles.trophyIcon}>
                        <Feather name="award" size={16} color="#000" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.offerHighlightTitle}>Official Offer Received! 🎉</Text>
                        <Text style={styles.offerHighlightSub}>
                          {app.company} has issued your official employment letter.
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.viewOfferLetterBtn}
                      onPress={() => setSelectedAppForOffer(app)}
                      activeOpacity={0.8}
                    >
                      <Feather name="file-text" size={13} color="#000" />
                      <Text style={styles.viewOfferLetterBtnText}>View Company Offer Letter</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Technical Interview Callout Banner */}
                {app.status === 'Interview' && (
                  <View style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.08)',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(56, 189, 248, 0.3)',
                    padding: 12,
                    marginHorizontal: 14,
                    marginBottom: 10,
                    gap: 8
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: '#38bdf8',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Feather name="video" size={16} color="#000" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800' }}>
                          Technical Interview Scheduled! 📅
                        </Text>
                        <Text style={{ color: '#94a3b8', fontSize: 11 }}>
                          {app.interviewDetails?.interviewTime || "Tomorrow at 4:00 PM IST"} with {app.interviewDetails?.interviewer || "Senior Staff Engineer"}
                        </Text>
                      </View>
                    </View>

                    {app.interviewDetails?.topics && (
                      <Text style={{ color: '#bae6fd', fontSize: 11, backgroundColor: 'rgba(56, 189, 248, 0.12)', padding: 6, borderRadius: 6 }}>
                        💡 Focus Topics: {app.interviewDetails.topics}
                      </Text>
                    )}

                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          backgroundColor: '#38bdf8',
                          paddingVertical: 8,
                          borderRadius: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6
                        }}
                        onPress={() => setActiveInterviewApp(app)}
                        activeOpacity={0.8}
                      >
                        <Feather name="video" size={13} color="#000" />
                        <Text style={{ color: '#000', fontSize: 12, fontWeight: '800' }}>Join Video Room</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.08)',
                          borderWidth: 1,
                          borderColor: 'rgba(255,255,255,0.2)',
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          borderRadius: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 4
                        }}
                        onPress={() => setActivePrepApp(app)}
                        activeOpacity={0.8}
                      >
                        <Feather name="zap" size={12} color="#fbbf24" />
                        <Text style={{ color: '#fbbf24', fontSize: 11, fontWeight: '700' }}>AI Prep</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Rejection & Constructive Feedback Box */}
                {app.status === 'Rejected' && (
                  <View style={{
                    backgroundColor: 'rgba(244, 63, 94, 0.06)',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(244, 63, 94, 0.25)',
                    padding: 12,
                    marginHorizontal: 14,
                    marginBottom: 10,
                    gap: 6
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Feather name="alert-circle" size={15} color="#f43f5e" />
                      <Text style={{ color: '#fca5a5', fontSize: 12, fontWeight: '800' }}>
                        Application Not Moving Forward
                      </Text>
                    </View>
                    <Text style={{ color: '#d4d4d4', fontSize: 11, lineHeight: 16 }}>
                      Feedback: {app.rejectionReason || "Thank you for your application. After evaluation, other candidates more closely matched the specific criteria for this opening."}
                    </Text>
                    <View style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      padding: 8,
                      borderRadius: 6,
                      marginTop: 4
                    }}>
                      <Text style={{ color: '#a3a3a3', fontSize: 10 }}>
                        💡 <Text style={{ color: '#ffffff', fontWeight: '700' }}>Upskilling Tip:</Text> Keep learning! Practice core Data Structures, system design principles, and build real-world portfolio projects to strengthen your next application.
                      </Text>
                    </View>
                  </View>
                )}

                {/* Expanded Timeline */}
                {isExpanded && (
                  <View style={styles.timelineSection}>
                    <View style={styles.timelineHeaderRow}>
                      <Text style={styles.timelineHeading}>Application Progress Pipeline</Text>
                      {isOffered && (
                        <TouchableOpacity 
                          style={styles.generatePreviewBtn}
                          onPress={() => setSelectedAppForOffer(app)}
                          activeOpacity={0.8}
                        >
                          <Feather name="file-text" size={12} color="#fff" />
                          <Text style={styles.generatePreviewBtnText}>
                            View Offer Letter
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <View style={styles.pipeline}>
                      <View style={styles.verticalLine} />

                      {app.timeline.map((step, idx) => {
                        const isDone = step.completed;
                        const isCurrent = step.step === app.status;

                        return (
                          <View key={idx} style={styles.timelineStep}>
                            {/* Dot / Check */}
                            <View style={[
                              styles.stepDot,
                              isDone && styles.stepDotDone,
                              isCurrent && styles.stepDotCurrent
                            ]}>
                              {isDone && <Ionicons name="checkmark" size={10} color="#000" />}
                            </View>

                            <View style={styles.stepContent}>
                              <View style={styles.stepTop}>
                                <Text style={[styles.stepTitle, isDone && { color: '#ffffff', fontWeight: '700' }]}>
                                  {step.title}
                                </Text>
                                <Text style={styles.stepDate}>{step.date}</Text>
                              </View>

                              {step.note ? (
                                <Text style={styles.stepNote}>{step.note}</Text>
                              ) : null}

                              {/* Google Meet link for interview */}
                              {step.step === 'Interview' && isDone && (
                                <View style={styles.interviewBox}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <Feather name="video" size={15} color="#e2e8f0" />
                                    <Text style={styles.interviewText}>Google Meet Video Interview</Text>
                                  </View>
                                  <TouchableOpacity
                                    style={styles.joinBtn}
                                    onPress={handleJoinMeeting}
                                  >
                                    <Text style={styles.joinBtnText}>Join Room</Text>
                                    <Feather name="external-link" size={11} color="#000" />
                                  </TouchableOpacity>
                                </View>
                              )}

                              {/* Company Offer Letter Action Box — Only visible when offer is issued */}
                              {step.step === 'Offer' && isOffered && (
                                <View style={styles.offerStepBox}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <Feather name="award" size={15} color="#ffffff" />
                                    <Text style={styles.offerStepText}>
                                      Official Offer Letter ({app.company})
                                    </Text>
                                  </View>
                                  <TouchableOpacity
                                    style={styles.openOfferBtn}
                                    onPress={() => setSelectedAppForOffer(app)}
                                    activeOpacity={0.8}
                                  >
                                    <Text style={styles.openOfferBtnText}>
                                      View Official Letter 📄
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              )}
                            </View>
                          </View>
                        );
                      })}
                    </View>

                    {/* Bottom Info & Withdraw */}
                    <View style={styles.timelineFooter}>
                      <Text style={styles.resumeInfo}>
                        <Feather name="file" size={11} color={COLORS.textMuted} /> {app.resumeUsed || 'Primary Resume'}
                      </Text>

                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            "Withdraw Application",
                            `Are you sure you want to withdraw application for ${app.jobTitle}?`,
                            [
                              { text: "Cancel", style: "cancel" },
                              { text: "Withdraw", style: "destructive", onPress: () => onWithdrawApplication(app.id) }
                            ]
                          );
                        }}
                      >
                        <Text style={styles.withdrawText}>Withdraw Application</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>

      {/* Dedicated Company Offer Letter Modal */}
      {selectedAppForOffer && (
        <OfferLetterModal
          visible={!!selectedAppForOffer}
          application={selectedAppForOffer}
          candidateName={profile?.name || 'Applicant'}
          onClose={() => setSelectedAppForOffer(null)}
          onAcceptOffer={(appId) => {
            if (onAcceptOffer) onAcceptOffer(appId);
          }}
          onDeclineOffer={(appId) => {
            if (onDeclineOffer) onDeclineOffer(appId);
          }}
        />
      )}

      {/* Interactive Video Interview Room Modal */}
      {activeInterviewApp && (
        <Modal visible={!!activeInterviewApp} animationType="slide" transparent={false}>
          <View style={{ flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 30 }}>
            {/* Top Bar */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' }} />
                  <Text style={{ color: '#ef4444', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' }}>● LIVE INTERVIEW</Text>
                </View>
                <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '800' }}>
                  {activeInterviewApp.company} Technical Round
                </Text>
                <Text style={{ color: '#94a3b8', fontSize: 11 }}>
                  Interviewer: {activeInterviewApp.interviewDetails?.interviewer || "Senior Staff Engineer"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Leave Interview Room?",
                    "Are you sure you want to end this interview session?",
                    [
                      { text: "Stay", style: "cancel" },
                      { 
                        text: "End Interview", 
                        style: "destructive", 
                        onPress: () => {
                          setActiveInterviewApp(null);
                          Alert.alert("Interview Complete! 🎉", "Your interview session was recorded. Recruiter feedback will be published to your Tracker.");
                        } 
                      }
                    ]
                  );
                }}
                style={{
                  backgroundColor: '#ef4444',
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Feather name="phone-off" size={13} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>End Call</Text>
              </TouchableOpacity>
            </View>

            {/* Simulated Video Screens */}
            <View style={{ flex: 1, gap: 12 }}>
              {/* Interviewer Screen */}
              <View style={{
                flex: 1.3,
                backgroundColor: '#171717',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#262626',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <View style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#1e293b',
                  borderWidth: 2,
                  borderColor: '#38bdf8',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12
                }}>
                  <Feather name="user" size={40} color="#38bdf8" />
                </View>
                <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>
                  {activeInterviewApp.interviewDetails?.interviewer || "Senior Staff Engineer"}
                </Text>
                <Text style={{ color: '#10b981', fontSize: 11, marginTop: 4 }}>
                  ● Speaking • Audio Active
                </Text>

                {/* Question Prompt Overlay */}
                <View style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  right: 12,
                  backgroundColor: 'rgba(0,0,0,0.85)',
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.1)'
                }}>
                  <Text style={{ color: '#38bdf8', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' }}>
                    Current Technical Prompt:
                  </Text>
                  <Text style={{ color: '#ffffff', fontSize: 12, marginTop: 2 }}>
                    "Can you walk us through how you handle asynchronous state and cache management in React?"
                  </Text>
                </View>
              </View>

              {/* Candidate Self View Screen */}
              <View style={{
                flex: 0.9,
                backgroundColor: isVideoOff ? '#121212' : '#1c1917',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#262626',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                {isVideoOff ? (
                  <View style={{ alignItems: 'center' }}>
                    <Feather name="video-off" size={32} color="#78716c" />
                    <Text style={{ color: '#78716c', fontSize: 11, marginTop: 6 }}>Camera is Off</Text>
                  </View>
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    <View style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      backgroundColor: '#292524',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: '800' }}>
                        {profile?.name ? profile.name.charAt(0).toUpperCase() : 'Y'}
                      </Text>
                    </View>
                    <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '600', marginTop: 6 }}>
                      You ({profile?.name || 'Applicant'})
                    </Text>
                  </View>
                )}

                <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: isMuted ? '#ef4444' : 'rgba(0,0,0,0.6)', padding: 6, borderRadius: 6 }}>
                  <Feather name={isMuted ? "mic-off" : "mic"} size={13} color="#fff" />
                </View>
              </View>
            </View>

            {/* Bottom Controls Bar */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 16,
              marginTop: 18,
              paddingVertical: 12,
              backgroundColor: '#171717',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#262626'
            }}>
              <TouchableOpacity
                onPress={() => setIsMuted(!isMuted)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: isMuted ? '#ef4444' : 'rgba(255,255,255,0.1)',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Feather name={isMuted ? "mic-off" : "mic"} size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsVideoOff(!isVideoOff)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: isVideoOff ? '#ef4444' : 'rgba(255,255,255,0.1)',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Feather name={isVideoOff ? "video-off" : "video"} size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Google Meet Link",
                    `Opening live meeting link: ${activeInterviewApp.interviewDetails?.meetUrl || "https://meet.google.com/abc-tech-interview"}`
                  );
                }}
                style={{
                  paddingHorizontal: 16,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#38bdf8',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Feather name="external-link" size={16} color="#000" />
                <Text style={{ color: '#000', fontSize: 12, fontWeight: '800' }}>Open in Browser</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* AI Interview Prep & Questions Modal */}
      {activePrepApp && (
        <Modal visible={!!activePrepApp} animationType="slide" transparent={true}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' }}>
            <View style={{
              backgroundColor: '#121212',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
              maxHeight: '85%',
              borderWidth: 1,
              borderColor: '#262626'
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Feather name="zap" size={15} color="#fbbf24" />
                    <Text style={{ color: '#fbbf24', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' }}>
                      AI Interview Prep Guide
                    </Text>
                  </View>
                  <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '800' }}>
                    {activePrepApp.company} • {activePrepApp.jobTitle}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setActivePrepApp(null)}>
                  <Ionicons name="close" size={22} color="#fff" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                <Text style={{ color: '#a3a3a3', fontSize: 12, marginBottom: 14 }}>
                  Curated technical questions, system design concepts, and model answers based on real interview rounds at {activePrepApp.company}.
                </Text>

                <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '800', marginBottom: 8 }}>
                  Top 3 Technical Interview Questions:
                </Text>

                {[
                  {
                    q: "1. How do you design an idempotent API in high-scale payment/order workflows?",
                    a: "Generate a unique Idempotency-Key on client request and persist in Redis with TTL. Reject or return cached response if key already exists, preventing duplicate debits."
                  },
                  {
                    q: "2. How does the Virtual DOM reconciliation algorithm work in React?",
                    a: "React uses heuristics (O(n) diffing): elements with different types produce different trees, and keys are used to match child nodes efficiently during re-renders."
                  },
                  {
                    q: "3. What is the difference between horizontal and vertical database scaling?",
                    a: "Vertical scaling increases CPU/RAM of a single instance (hardware bounds). Horizontal scaling uses sharding and read-replicas across multiple server nodes for fault tolerance."
                  }
                ].map((item, i) => (
                  <View key={i} style={{
                    backgroundColor: '#1a1a1a',
                    padding: 12,
                    borderRadius: 10,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: '#2e2e2e'
                  }}>
                    <Text style={{ color: '#38bdf8', fontSize: 12, fontWeight: '700', marginBottom: 4 }}>
                      {item.q}
                    </Text>
                    <Text style={{ color: '#d4d4d4', fontSize: 11, lineHeight: 16 }}>
                      💡 <Text style={{ color: '#fff', fontWeight: '600' }}>Model Answer:</Text> {item.a}
                    </Text>
                  </View>
                ))}

                <View style={{
                  backgroundColor: 'rgba(52, 211, 153, 0.08)',
                  padding: 12,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: 'rgba(52, 211, 153, 0.25)',
                  marginTop: 6
                }}>
                  <Text style={{ color: '#34d399', fontSize: 12, fontWeight: '700', marginBottom: 2 }}>
                    ✓ Behavioral Tip (STAR Technique):
                  </Text>
                  <Text style={{ color: '#a7f3d0', fontSize: 11, lineHeight: 15 }}>
                    Structure your answers with Situation, Task, Action, and Result. Quantify your achievements (e.g. "optimized API response time by 40%").
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 12,
    paddingBottom: 12,
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
  countBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  countBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  tabsScroll: {
    paddingHorizontal: SPACING.lg,
    gap: 8,
    marginBottom: 16,
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  tabPillActive: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#000000',
    fontWeight: '800',
  },
  badgeCount: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  badgeCountActive: {
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  badgeText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  listSection: {
    paddingHorizontal: SPACING.lg,
    gap: 12,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
    gap: 10,
  },
  emptyTitle: {
    color: COLORS.textMain,
    fontSize: 15,
    fontWeight: '700',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
  appCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  appCardExpanded: {
    borderColor: 'rgba(255,255,255,0.3)',
  },
  appCardOffered: {
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: '#161616',
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  companyLogo: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: '#1a1a1a',
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobTitle: {
    color: COLORS.textMain,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    marginRight: 6,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  offerStatusBadge: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  companySub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  appliedDate: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  offerHighlightBox: {
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.md,
    padding: 12,
    marginTop: 12,
    gap: 10,
  },
  offerHighlightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trophyIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerHighlightTitle: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '800',
  },
  offerHighlightSub: {
    color: '#475569',
    fontSize: 11,
    marginTop: 1,
  },
  viewOfferLetterBtn: {
    backgroundColor: '#000000',
    borderRadius: RADIUS.sm,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  viewOfferLetterBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  timelineSection: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timelineHeading: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  generatePreviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
  },
  generatePreviewBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  pipeline: {
    position: 'relative',
    paddingLeft: 20,
  },
  verticalLine: {
    position: 'absolute',
    left: 6,
    top: 6,
    bottom: 12,
    width: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  timelineStep: {
    position: 'relative',
    marginBottom: 14,
  },
  stepDot: {
    position: 'absolute',
    left: -20,
    top: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#1f1f1f',
    borderWidth: 2,
    borderColor: '#525252',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  stepDotCurrent: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  stepContent: {
    marginLeft: 6,
  },
  stepTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  stepTitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  stepDate: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  stepNote: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  interviewBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.md,
    padding: 8,
    marginTop: 6,
  },
  interviewText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  joinBtn: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
  },
  joinBtnText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '700',
  },
  offerStepBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: RADIUS.md,
    padding: 10,
    marginTop: 6,
  },
  offerStepText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  openOfferBtn: {
    backgroundColor: '#ffffff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
  },
  openOfferBtnText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '800',
  },
  timelineFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    paddingTop: 10,
    marginTop: 6,
  },
  resumeInfo: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  withdrawText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '700',
  },
});

