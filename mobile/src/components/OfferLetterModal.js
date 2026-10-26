import React, { useState } from 'react';
import { 
  Modal, View, Text, TouchableOpacity, ScrollView, 
  StyleSheet, Image, Alert, Share, Platform 
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme';

export default function OfferLetterModal({
  visible,
  application,
  candidateName = 'Candidate',
  onClose,
  onAcceptOffer,
  onDeclineOffer
}) {
  const [offerStatus, setOfferStatus] = useState(application?.offerStatus || 'pending'); // 'pending' | 'accepted' | 'declined'

  if (!application) return null;

  const company = application.company || 'Tech Innovations Ltd.';
  const jobTitle = application.jobTitle || 'Software Engineer';
  const location = application.location || 'Bangalore (Hybrid)';
  const salary = application.salary || '₹10,00,000 LPA';
  const companyLogo = application.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80';
  
  const today = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const refNumber = `${company.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase()}/HR/OFFER-2026/${application.id?.replace(/[^0-9]/g, '').slice(-4) || '7842'}`;

  const handleDownload = () => {
    Alert.alert(
      "Offer Letter Downloaded",
      `Official Offer Letter for ${jobTitle} from ${company} has been saved as PDF to your downloads.\nRef: ${refNumber}`,
      [{ text: "OK" }]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Official Offer Letter received from ${company} for the role of ${jobTitle}! Compensation: ${salary}. Ref: ${refNumber}`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleAccept = () => {
    setOfferStatus('accepted');
    if (onAcceptOffer) onAcceptOffer(application.id);
    Alert.alert(
      "Offer Accepted! 🎉",
      `Congratulations on accepting the offer from ${company}! The HR team will contact you regarding onboarding formalities.`,
      [{ text: "Great!" }]
    );
  };

  const handleDecline = () => {
    Alert.alert(
      "Decline Offer",
      `Are you sure you want to decline the offer from ${company}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Decline", 
          style: "destructive", 
          onPress: () => {
            setOfferStatus('declined');
            if (onDeclineOffer) onDeclineOffer(application.id);
          }
        }
      ]
    );
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
          {/* Header Action Bar */}
          <View style={styles.topBar}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Feather name="file-text" size={18} color="#fff" />
              <Text style={styles.topBarTitle}>Company Offer Letter</Text>
            </View>
            <View style={styles.topBarActions}>
              <TouchableOpacity onPress={handleDownload} style={styles.topIconBtn} activeOpacity={0.7}>
                <Feather name="download" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} style={styles.topIconBtn} activeOpacity={0.7}>
                <Feather name="share-2" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Offer Letter Document Scroll */}
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.documentScroll}
          >
            {/* The Physical Paper Look Document */}
            <View style={styles.letterPaper}>
              {/* Company Letterhead */}
              <View style={styles.companyHeader}>
                <View style={styles.companyInfoLeft}>
                  {companyLogo ? (
                    <Image source={{ uri: companyLogo }} style={styles.companyLogo} />
                  ) : (
                    <View style={styles.logoPlaceholder}>
                      <Text style={styles.logoPlaceholderText}>{company.charAt(0)}</Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.companyNameText}>{company}</Text>
                    <Text style={styles.companyTagline}>Official Corporate Employment Letter</Text>
                    <Text style={styles.companyAddressText}>
                      Corporate Tower, Tech Hub, {location} • hr@{company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
                    </Text>
                  </View>
                </View>

                <View style={styles.verifiedStamp}>
                  <Feather name="check-circle" size={12} color="#15803d" />
                  <Text style={styles.verifiedStampText}>VERIFIED</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Document Reference & Date */}
              <View style={styles.metaRow}>
                <View>
                  <Text style={styles.metaLabel}>DOCUMENT REF</Text>
                  <Text style={styles.metaValue}>{refNumber}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.metaLabel}>DATE OF ISSUANCE</Text>
                  <Text style={styles.metaValue}>{today}</Text>
                </View>
              </View>

              {/* Recipient */}
              <View style={styles.recipientBox}>
                <Text style={styles.recipientLabel}>CANDIDATE / APPLICANT:</Text>
                <Text style={styles.recipientName}>{candidateName}</Text>
                <Text style={styles.recipientPosition}>Prospective Role: {jobTitle}</Text>
              </View>

              {/* Title */}
              <View style={styles.titleBox}>
                <Text style={styles.letterTitle}>FORMAL OFFER OF EMPLOYMENT</Text>
              </View>

              {/* Formal Letter Body */}
              <Text style={styles.letterParagraph}>
                Dear <Text style={{ fontWeight: '700' }}>{candidateName}</Text>,
              </Text>
              <Text style={styles.letterParagraph}>
                On behalf of <Text style={{ fontWeight: '700' }}>{company}</Text>, we are thrilled to extend this formal offer of employment for the position of <Text style={{ fontWeight: '700' }}>{jobTitle}</Text>.
              </Text>
              <Text style={styles.letterParagraph}>
                Following your interview process and evaluation of your qualifications, our leadership and technical teams were thoroughly impressed by your expertise, technical enthusiasm, and alignment with our corporate mission. We are confident you will make a significant impact on our engineering initiatives.
              </Text>

              {/* Offer Terms Breakdown Table */}
              <View style={styles.breakdownCard}>
                <Text style={styles.breakdownTitle}>KEY OFFER TERMS & DETAILS</Text>

                <View style={styles.tableRow}>
                  <Text style={styles.tableKey}>Position / Designation:</Text>
                  <Text style={styles.tableVal}>{jobTitle}</Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.tableKey}>Employing Company:</Text>
                  <Text style={styles.tableVal}>{company}</Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.tableKey}>Annual CTC / Package:</Text>
                  <Text style={[styles.tableVal, { color: '#047857', fontWeight: '800' }]}>{salary}</Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.tableKey}>Location & Mode:</Text>
                  <Text style={styles.tableVal}>{location}</Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.tableKey}>Employment Type:</Text>
                  <Text style={styles.tableVal}>Full-Time (Permanent)</Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.tableKey}>Probation Period:</Text>
                  <Text style={styles.tableVal}>3 Months</Text>
                </View>

                <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.tableKey}>Earliest Joining Date:</Text>
                  <Text style={styles.tableVal}>Within 15 Days of Acceptance</Text>
                </View>
              </View>

              {/* Benefits & Inclusions */}
              <View style={styles.benefitsBox}>
                <Text style={styles.benefitsTitle}>Standard Benefits & Perks:</Text>
                <Text style={styles.bulletItem}>• Comprehensive Health & Medical Insurance coverage.</Text>
                <Text style={styles.bulletItem}>• Performance-based annual bonuses & appraisal cycles.</Text>
                <Text style={styles.bulletItem}>• Professional workstation setup & learning stipend.</Text>
                <Text style={styles.bulletItem}>• 24 days paid annual leave + public company holidays.</Text>
              </View>

              {/* Formal Closing */}
              <Text style={styles.letterParagraph}>
                Please review this offer and signify your acceptance by clicking the button below or returning a signed copy within 7 business days. We look forward to welcoming you into the {company} family!
              </Text>

              {/* Signatures & Seal */}
              <View style={styles.signatureSection}>
                <View style={styles.signBox}>
                  <Text style={styles.scriptSignature}>{company.slice(0, 8)} HR</Text>
                  <View style={styles.signLine} />
                  <Text style={styles.signName}>Authorized Signatory</Text>
                  <Text style={styles.signRole}>Talent Acquisition & HR Lead</Text>
                  <Text style={styles.signCompany}>{company}</Text>
                </View>

                <View style={styles.sealBox}>
                  <View style={styles.sealCircle}>
                    <Feather name="shield" size={18} color="#047857" />
                    <Text style={styles.sealText}>OFFICIAL</Text>
                    <Text style={styles.sealSub}>SEAL</Text>
                  </View>
                </View>
              </View>

              {/* Live Status Badge */}
              {offerStatus === 'accepted' && (
                <View style={styles.acceptedBanner}>
                  <Feather name="check-circle" size={18} color="#15803d" />
                  <View>
                    <Text style={styles.acceptedBannerTitle}>Offer Accepted by Candidate ✓</Text>
                    <Text style={styles.acceptedBannerSub}>Your acceptance was recorded and sent to {company} HR.</Text>
                  </View>
                </View>
              )}

              {offerStatus === 'declined' && (
                <View style={styles.declinedBanner}>
                  <Feather name="x-circle" size={18} color="#b91c1c" />
                  <Text style={styles.declinedBannerText}>Offer Declined by Candidate</Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Bottom Action Buttons */}
          <View style={styles.footerBar}>
            {offerStatus === 'pending' ? (
              <>
                <TouchableOpacity
                  style={styles.declineBtn}
                  onPress={handleDecline}
                  activeOpacity={0.8}
                >
                  <Text style={styles.declineBtnText}>Decline</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={handleAccept}
                  activeOpacity={0.8}
                >
                  <Feather name="check" size={16} color="#000" />
                  <Text style={styles.acceptBtnText}>Accept Job Offer</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.downloadFullBtn}
                onPress={handleDownload}
                activeOpacity={0.8}
              >
                <Feather name="download" size={16} color="#000" />
                <Text style={styles.downloadFullBtnText}>Download Official PDF Letter</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#0d0d0d',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '92%',
    borderWidth: 1,
    borderColor: '#262626',
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
    backgroundColor: '#141414',
  },
  topBarTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentScroll: {
    padding: SPACING.md,
    paddingBottom: 24,
  },
  letterPaper: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholderText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  companyNameText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
  },
  companyTagline: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  companyAddressText: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 3,
  },
  verifiedStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedStampText: {
    color: '#15803d',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1.5,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metaLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  metaValue: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  recipientBox: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#0f172a',
  },
  recipientLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  recipientName: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  recipientPosition: {
    color: '#475569',
    fontSize: 11,
    marginTop: 2,
  },
  titleBox: {
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  letterTitle: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  letterParagraph: {
    color: '#334155',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  breakdownCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginVertical: 10,
  },
  breakdownTitle: {
    color: '#0f172a',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
  },
  tableKey: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
  },
  tableVal: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '700',
  },
  benefitsBox: {
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  benefitsTitle: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  bulletItem: {
    color: '#475569',
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 2,
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  signBox: {
    flex: 1,
  },
  scriptSignature: {
    fontStyle: 'italic',
    fontSize: 18,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  signLine: {
    height: 1,
    backgroundColor: '#94a3b8',
    width: 140,
    marginBottom: 4,
  },
  signName: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '700',
  },
  signRole: {
    color: '#64748b',
    fontSize: 10,
  },
  signCompany: {
    color: '#94a3b8',
    fontSize: 9,
  },
  sealBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#047857',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
  },
  sealText: {
    color: '#047857',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  sealSub: {
    color: '#047857',
    fontSize: 7,
    fontWeight: '700',
  },
  acceptedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    padding: 12,
    borderRadius: 8,
    marginTop: 14,
  },
  acceptedBannerTitle: {
    color: '#15803d',
    fontSize: 12,
    fontWeight: '800',
  },
  acceptedBannerSub: {
    color: '#166534',
    fontSize: 10,
    marginTop: 1,
  },
  declinedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    padding: 12,
    borderRadius: 8,
    marginTop: 14,
  },
  declinedBannerText: {
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: '800',
  },
  footerBar: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    backgroundColor: '#141414',
    borderTopWidth: 1,
    borderTopColor: '#262626',
    gap: 10,
  },
  declineBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3f3f46',
    backgroundColor: '#18181b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtnText: {
    color: '#a1a1aa',
    fontSize: 13,
    fontWeight: '700',
  },
  acceptBtn: {
    flex: 2,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  acceptBtnText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '800',
  },
  downloadFullBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  downloadFullBtnText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '800',
  },
});
