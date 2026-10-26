import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, Modal, 
  TextInput, StyleSheet, Alert 
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../theme';
import OfferLetterModal from '../components/OfferLetterModal';

export default function RecruiterScreen({
  jobs = [],
  applications = [],
  onPostJob,
  onUpdateCandidateStatus,
  onViewFeed
}) {
  const [showPostModal, setShowPostModal] = useState(false);
  const [candidateForOffer, setCandidateForOffer] = useState(null);
  const [previewOfferApp, setPreviewOfferApp] = useState(null);

  // Job Form
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [workMode, setWorkMode] = useState('Hybrid'); // 'Hybrid' | 'Remote' | 'On-site'
  const [jobType, setJobType] = useState('Full Time'); // 'Full Time' | 'Internship' | 'Contract'
  const [experience, setExperience] = useState('0–1 years'); // 'Fresher' | '0–1 years' | '1–3 years' | '3+ years'
  const [skills, setSkills] = useState('React, Node.js, Express, MongoDB');
  const [description, setDescription] = useState('Build scalable backend APIs and responsive modern mobile/web user interfaces.');

  // Interview Scheduler State
  const [candidateForInterview, setCandidateForInterview] = useState(null);
  const [interviewDate, setInterviewDate] = useState('Tomorrow');
  const [interviewTime, setInterviewTime] = useState('4:00 PM IST');
  const [interviewer, setInterviewer] = useState('Vikram Sharma (Staff Engineer)');
  const [meetLink, setMeetLink] = useState('https://meet.google.com/abc-tech-interview');
  const [interviewTopics, setInterviewTopics] = useState('DSA, React Live Coding & REST Architecture');

  // Candidate Rejection State
  const [candidateForReject, setCandidateForReject] = useState(null);
  const [rejectReason, setRejectReason] = useState('Skills gap in required technology stack');

  // Offer Letter Form
  const [offerCompany, setOfferCompany] = useState('');
  const [offerSalary, setOfferSalary] = useState('');
  const [offerJoining, setOfferJoining] = useState('Within 15 Days');

  const handleCreate = () => {
    if (!title.trim() || !company.trim()) {
      Alert.alert("Missing Fields", "Please enter both Job Title and Company Name.");
      return;
    }
    const skillsArr = skills.split(',').map(s => s.trim()).filter(Boolean);

    // Parse salary values
    const numMatches = (salary || '').match(/\d+(\.\d+)?/g);
    let sMin = 6;
    let sMax = 12;
    if (numMatches && numMatches.length > 0) {
      sMin = parseFloat(numMatches[0]);
      sMax = numMatches.length > 1 ? parseFloat(numMatches[1]) : sMin + 2;
    }
    if (jobType === 'Internship') {
      sMin = sMin || 2;
      sMax = sMax || 4;
    }

    onPostJob({
      title: title.trim(),
      company: company.trim(),
      location: location.trim() || (workMode === 'Remote' ? 'Remote' : 'Bangalore (Hybrid)'),
      salary: salary.trim() || (jobType === 'Internship' ? '₹30,000 / month' : '₹8–12 LPA'),
      salaryMin: sMin,
      salaryMax: sMax,
      workMode,
      jobType,
      experience,
      skills: skillsArr.length > 0 ? skillsArr : ['JavaScript', 'React', 'Problem Solving'],
      description: description.trim() || 'Exciting opportunity to build cutting-edge systems and deliver high-impact digital experiences.',
      logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80",
      companyVerified: true,
      deadline: '2026-11-20',
      responsibilities: ["Develop responsive features and reusable UI components", "Collaborate with cross-functional product teams"],
      requirements: ["Strong programming fundamentals", "Good communication skills and proactive attitude"]
    });

    setShowPostModal(false);
    setTitle('');
    setCompany('');
    setLocation('');
    setSalary('');

    Alert.alert(
      "Job Published Live! 🚀", 
      `"${title}" at "${company}" is now live at the very top of the student feed!`,
      [
        { text: "Stay on Recruiter", style: "cancel" },
        { text: "View Student Feed", onPress: () => onViewFeed && onViewFeed() }
      ]
    );
  };

  const handleOpenOfferModal = (app) => {
    setCandidateForOffer(app);
    setOfferCompany(app.company || 'Tech Innovations Ltd.');
    setOfferSalary(app.salary || '₹10,00,000 LPA');
  };

  const handleIssueOfferSubmit = () => {
    if (!candidateForOffer) return;
    const finalComp = offerCompany.trim() || candidateForOffer.company;
    const finalSal = offerSalary.trim() || candidateForOffer.salary || '₹10,00,000 LPA';

    onUpdateCandidateStatus(
      candidateForOffer.id, 
      'Offer', 
      `Congratulations! Official employment offer letter issued by ${finalComp}.`
    );
    setCandidateForOffer(null);
    Alert.alert(
      "Offer Letter Generated & Sent! 🎉",
      `Official employment offer letter from ${finalComp} has been issued to ${candidateForOffer.applicantName || 'Candidate'}.`
    );
  };

  const handleScheduleInterviewSubmit = () => {
    if (!candidateForInterview) return;
    onUpdateCandidateStatus(
      candidateForInterview.id,
      'Interview',
      `Technical Interview scheduled for ${interviewDate} at ${interviewTime} with ${interviewer}.`,
      {
        interviewDate,
        interviewTime,
        interviewer,
        meetUrl: meetLink,
        topics: interviewTopics
      }
    );
    const cName = candidateForInterview.applicantName || 'Candidate';
    setCandidateForInterview(null);
    Alert.alert(
      "Technical Interview Scheduled! 📅",
      `Interview scheduled with ${cName} for ${interviewDate} at ${interviewTime}. Meeting room link and topics have been sent to their tracker.`
    );
  };

  const handleRejectSubmit = () => {
    if (!candidateForReject) return;
    const reason = rejectReason.trim() || 'Skills do not align with current requirements.';
    onUpdateCandidateStatus(
      candidateForReject.id,
      'Rejected',
      reason
    );
    const cName = candidateForReject.applicantName || 'Candidate';
    setCandidateForReject(null);
    Alert.alert(
      "Application Declined ✕",
      `${cName}'s application has been moved to Rejected with constructive upskilling feedback.`
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.subTag}>Recruiter Dashboard</Text>
          <Text style={styles.title}>Employer Portal 🏢</Text>
        </View>

        <TouchableOpacity
          style={styles.postJobBtn}
          onPress={() => setShowPostModal(true)}
          activeOpacity={0.8}
        >
          <Feather name="plus" size={16} color="#000" />
          <Text style={styles.postJobText}>Post Job</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Metric Cards */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Active Jobs</Text>
            <Text style={styles.metricVal}>{jobs.length}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Applications</Text>
            <Text style={styles.metricVal}>{applications.length}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Shortlisted</Text>
            <Text style={styles.metricVal}>
              {applications.filter(a => a.status === 'Shortlisted').length}
            </Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Offers Issued</Text>
            <Text style={[styles.metricVal, { color: '#ffffff' }]}>
              {applications.filter(a => a.status === 'Offer' || a.offerStatus === 'accepted').length}
            </Text>
          </View>
        </View>

        {/* Recruiter's Posted Jobs Section */}
        <View style={styles.sectionHeaderRow}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={styles.sectionHeading}>Your Posted Opportunities ({jobs.length})</Text>
              <Text style={styles.sectionSub}>Live openings visible to all candidates in feed</Text>
            </View>
            <TouchableOpacity
              style={styles.smallPostBtn}
              onPress={() => setShowPostModal(true)}
              activeOpacity={0.8}
            >
              <Feather name="plus" size={13} color="#000" />
              <Text style={styles.smallPostBtnText}>Post New</Text>
            </TouchableOpacity>
          </View>
        </View>

        {jobs.length === 0 ? (
          <View style={styles.emptyBox}>
            <Feather name="briefcase" size={36} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Jobs Posted Yet</Text>
            <Text style={styles.emptyText}>Tap "Post Job" above to publish your first hiring requirement.</Text>
          </View>
        ) : (
          jobs.map(job => (
            <View key={job.id} style={styles.postedJobCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <Text style={styles.postedJobTitle}>{job.title}</Text>
                    {(job.isNewUpload || job.postedDate === 'Just now') && (
                      <View style={styles.liveBadge}>
                        <Text style={styles.liveBadgeText}>● LIVE NOW</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.postedJobCompany}>{job.company} • {job.location}</Text>
                </View>

                <Text style={styles.postedJobSalary}>{job.salary}</Text>
              </View>

              <View style={styles.postedJobTagsRow}>
                <View style={styles.postedJobTag}>
                  <Text style={styles.postedJobTagText}>{job.jobType}</Text>
                </View>
                <View style={styles.postedJobTag}>
                  <Text style={styles.postedJobTagText}>{job.workMode}</Text>
                </View>
                <View style={styles.postedJobTag}>
                  <Text style={styles.postedJobTagText}>{job.experience}</Text>
                </View>
                <View style={{ flex: 1 }} />
                <Text style={styles.postedJobApplicants}>
                  <Feather name="users" size={12} color={COLORS.textSecondary} /> {applications.filter(a => a.jobId === job.id).length} in pipeline ({job.applicantsCount || 0} platform)
                </Text>
              </View>
            </View>
          ))
        )}

        {/* Candidate Management Section */}
        <View style={[styles.sectionHeaderRow, { marginTop: 16 }]}>
          <Text style={styles.sectionHeading}>Applicant Pipeline ({applications.length})</Text>
          <Text style={styles.sectionSub}>Review applicants & issue company offer letters</Text>
        </View>

        {applications.length === 0 ? (
          <View style={styles.emptyBox}>
            <Feather name="inbox" size={36} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No candidates in pipeline yet</Text>
            <Text style={styles.emptyText}>When candidates apply to your posted jobs, their profiles and resumes will appear here.</Text>
          </View>
        ) : (
          applications.map((app) => {
            const isOfferStage = app.status === 'Offer' || app.offerStatus === 'accepted';
            const isRejected = app.status === 'Rejected';

            return (
              <View 
                key={app.id} 
                style={[
                  styles.candidateCard, 
                  isOfferStage && styles.candidateCardOffer,
                  isRejected && { borderColor: 'rgba(244, 63, 94, 0.3)', backgroundColor: 'rgba(244, 63, 94, 0.03)' }
                ]}
              >
                <View style={styles.candidateTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.candidateName}>{app.applicantName || 'Applicant'}</Text>
                    <Text style={styles.roleApplied}>Role: {app.jobTitle}</Text>
                    <Text style={styles.compApplied}>Company: {app.company}</Text>
                  </View>

                  <View style={[
                    styles.statusPill, 
                    isOfferStage && styles.statusPillOffer,
                    isRejected && { backgroundColor: 'rgba(244, 63, 94, 0.15)', borderColor: 'rgba(244, 63, 94, 0.35)' },
                    app.status === 'Interview' && { backgroundColor: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.35)' },
                    app.status === 'Shortlisted' && { backgroundColor: 'rgba(52, 211, 153, 0.15)', borderColor: 'rgba(52, 211, 153, 0.35)' }
                  ]}>
                    <Text style={[
                      styles.statusText, 
                      isOfferStage && { color: '#000000', fontWeight: '800' },
                      isRejected && { color: '#f43f5e', fontWeight: '800' },
                      app.status === 'Interview' && { color: '#38bdf8', fontWeight: '800' },
                      app.status === 'Shortlisted' && { color: '#34d399', fontWeight: '800' }
                    ]}>
                      {app.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.resumeUsed}>
                    <Feather name="file-text" size={11} color={COLORS.textMuted} /> {app.resumeUsed || 'Standard Resume'}
                  </Text>
                  <Text style={styles.dateApplied}>
                    Applied: {new Date(app.appliedDate || Date.now()).toLocaleDateString()}
                  </Text>
                </View>

                {/* Interview Scheduled Callout */}
                {app.status === 'Interview' && app.interviewDetails && (
                  <View style={{
                    marginTop: 8,
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: 'rgba(56, 189, 248, 0.08)',
                    borderWidth: 1,
                    borderColor: 'rgba(56, 189, 248, 0.25)',
                    gap: 3
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Feather name="video" size={12} color="#38bdf8" />
                      <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>
                        Round: {app.interviewDetails.interviewTime} with {app.interviewDetails.interviewer}
                      </Text>
                    </View>
                    <Text style={{ color: '#94a3b8', fontSize: 10 }}>
                      Topics: {app.interviewDetails.topics}
                    </Text>
                  </View>
                )}

                {/* Rejection Feedback Note */}
                {isRejected && (
                  <View style={{
                    marginTop: 8,
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: 'rgba(244, 63, 94, 0.08)',
                    borderWidth: 1,
                    borderColor: 'rgba(244, 63, 94, 0.25)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    <Feather name="alert-circle" size={13} color="#f43f5e" />
                    <Text style={{ color: '#fca5a5', fontSize: 11, flex: 1 }}>
                      Feedback: {app.rejectionReason || 'Skills gap in required technology stack.'}
                    </Text>
                  </View>
                )}

                {/* Offer Letter Callout for Recruiter */}
                {isOfferStage && (
                  <View style={styles.offerBadgeBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                      <Feather name="check-circle" size={14} color="#ffffff" />
                      <Text style={styles.offerBadgeText}>Official Offer Issued for {app.company}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.previewOfferBtn}
                      onPress={() => setPreviewOfferApp(app)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.previewOfferBtnText}>View Letter 📄</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Recruiter Action Buttons */}
                <View style={styles.actionBtnsRow}>
                  <TouchableOpacity
                    style={[styles.statusBtn, app.status === 'Shortlisted' && styles.statusBtnActive]}
                    onPress={() => onUpdateCandidateStatus(app.id, 'Shortlisted', 'Profile approved and shortlisted for technical round.')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.statusBtnText, app.status === 'Shortlisted' && { color: '#34d399', fontWeight: '800' }]}>Shortlist ✓</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.statusBtn, app.status === 'Interview' && styles.statusBtnActive]}
                    onPress={() => {
                      setCandidateForInterview(app);
                      setInterviewTopics(app.jobTitle.includes('Frontend') || app.jobTitle.includes('React') 
                        ? 'Live React Coding, Hooks & CSS Architecture' 
                        : 'Node.js, Express, MongoDB Indexing & System Design');
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.statusBtnText, app.status === 'Interview' && { color: '#38bdf8', fontWeight: '800' }]}>Interview 📅</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.statusBtnOffer, isOfferStage && styles.statusBtnOfferActive]}
                    onPress={() => handleOpenOfferModal(app)}
                    activeOpacity={0.8}
                  >
                    <Feather name="file-text" size={11} color={isOfferStage ? "#000" : "#fff"} />
                    <Text style={[styles.statusBtnOfferText, isOfferStage && { color: '#000' }]}>
                      {isOfferStage ? "Offer Sent" : "Offer 📄"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.statusBtn, 
                      { flex: 0.9, backgroundColor: 'rgba(244, 63, 94, 0.08)', borderColor: 'rgba(244, 63, 94, 0.25)' },
                      isRejected && { backgroundColor: 'rgba(244, 63, 94, 0.25)', borderColor: '#f43f5e' }
                    ]}
                    onPress={() => setCandidateForReject(app)}
                    activeOpacity={0.8}
                  >
                    <Text style={{ color: '#f43f5e', fontSize: 11, fontWeight: '700' }}>
                      {isRejected ? "Rejected" : "Reject ✕"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Post Job Modal */}
      <Modal visible={showPostModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Post New Opportunity</Text>
              <TouchableOpacity onPress={() => setShowPostModal(false)}>
                <Ionicons name="close" size={20} color={COLORS.textMain} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <Text style={styles.inputLabel}>Job Title *</Text>
              <TextInput 
                style={styles.modalInput} 
                placeholder="e.g. Frontend Engineer, Product Designer"
                placeholderTextColor={COLORS.textMuted}
                value={title} 
                onChangeText={setTitle} 
              />

              <Text style={styles.inputLabel}>Company Name *</Text>
              <TextInput 
                style={styles.modalInput} 
                placeholder="e.g. Microsoft, Razorpay, Tech Innovations"
                placeholderTextColor={COLORS.textMuted}
                value={company} 
                onChangeText={setCompany} 
              />

              <Text style={styles.inputLabel}>Job Type *</Text>
              <View style={styles.pillsRow}>
                {['Full Time', 'Internship', 'Contract'].map(t => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typePill, jobType === t && styles.typePillActive]}
                    onPress={() => setJobType(t)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.typePillText, jobType === t && styles.typePillTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Work Mode *</Text>
              <View style={styles.pillsRow}>
                {['Hybrid', 'Remote', 'On-site'].map(m => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.typePill, workMode === m && styles.typePillActive]}
                    onPress={() => setWorkMode(m)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.typePillText, workMode === m && styles.typePillTextActive]}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Experience Required *</Text>
              <View style={styles.pillsRow}>
                {['Fresher', '0–1 years', '1–3 years', '3+ years'].map(e => (
                  <TouchableOpacity
                    key={e}
                    style={[styles.typePill, experience === e && styles.typePillActive]}
                    onPress={() => setExperience(e)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.typePillText, experience === e && styles.typePillTextActive]}>{e}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Location</Text>
              <TextInput 
                style={styles.modalInput} 
                placeholder="e.g. Bangalore, Mumbai, Remote (Pan-India)"
                placeholderTextColor={COLORS.textMuted}
                value={location} 
                onChangeText={setLocation} 
              />

              <Text style={styles.inputLabel}>Annual Package / Monthly Stipend</Text>
              <TextInput 
                style={styles.modalInput} 
                placeholder={jobType === 'Internship' ? "e.g. ₹35,000 / month" : "e.g. ₹10–14 LPA"}
                placeholderTextColor={COLORS.textMuted}
                value={salary} 
                onChangeText={setSalary} 
              />

              <Text style={styles.inputLabel}>Required Skills (comma separated)</Text>
              <TextInput 
                style={styles.modalInput} 
                placeholder="e.g. React, Node.js, TypeScript"
                placeholderTextColor={COLORS.textMuted}
                value={skills} 
                onChangeText={setSkills} 
              />

              <Text style={styles.inputLabel}>Role Description</Text>
              <TextInput
                style={[styles.modalInput, { height: 70 }]}
                placeholder="Describe role responsibilities and qualifications..."
                placeholderTextColor={COLORS.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline={true}
              />

              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleCreate} activeOpacity={0.8}>
                <Feather name="upload-cloud" size={16} color="#000000" />
                <Text style={styles.modalSubmitText}>Publish Live Job Post</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Generate & Issue Company Offer Letter Modal */}
      {candidateForOffer && (
        <Modal visible={!!candidateForOffer} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={styles.sheetTitle}>Generate Company Offer Letter 📄</Text>
                  <Text style={styles.sheetSub}>
                    For {candidateForOffer.applicantName || 'Applicant'} • {candidateForOffer.jobTitle}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setCandidateForOffer(null)}>
                  <Ionicons name="close" size={20} color={COLORS.textMain} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                <Text style={styles.inputLabel}>Employing Company Name</Text>
                <TextInput 
                  style={styles.modalInput} 
                  value={offerCompany} 
                  onChangeText={setOfferCompany} 
                  placeholder="Enter issuing company name"
                  placeholderTextColor={COLORS.textMuted}
                />

                <Text style={styles.inputLabel}>Annual CTC Package / Remuneration</Text>
                <TextInput 
                  style={styles.modalInput} 
                  value={offerSalary} 
                  onChangeText={setOfferSalary} 
                  placeholder="e.g. ₹12,00,000 per annum"
                  placeholderTextColor={COLORS.textMuted}
                />

                <Text style={styles.inputLabel}>Proposed Joining Period</Text>
                <TextInput 
                  style={styles.modalInput} 
                  value={offerJoining} 
                  onChangeText={setOfferJoining} 
                  placeholder="e.g. Within 15 Days of Acceptance"
                  placeholderTextColor={COLORS.textMuted}
                />

                <View style={styles.offerLetterNoticeBox}>
                  <Feather name="info" size={14} color="#ffffff" />
                  <Text style={styles.offerLetterNoticeText}>
                    An official employment offer letter from {offerCompany || candidateForOffer.company} will be generated with authorized company seal, compensation details, and candidate acceptance tracking.
                  </Text>
                </View>

                <TouchableOpacity 
                  style={styles.modalSubmitBtn} 
                  onPress={handleIssueOfferSubmit}
                  activeOpacity={0.8}
                >
                  <Feather name="send" size={15} color="#000" />
                  <Text style={styles.modalSubmitText}>Generate & Issue Offer Letter</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      {/* Technical Interview Scheduler Modal */}
      {candidateForInterview && (
        <Modal visible={!!candidateForInterview} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={styles.sheetTitle}>Schedule Technical Interview 📅</Text>
                  <Text style={styles.sheetSub}>
                    For {candidateForInterview.applicantName || 'Candidate'} • {candidateForInterview.jobTitle}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setCandidateForInterview(null)}>
                  <Ionicons name="close" size={20} color={COLORS.textMain} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                <Text style={styles.inputLabel}>Interview Date & Time</Text>
                <TextInput
                  style={styles.modalInput}
                  value={interviewTime}
                  onChangeText={setInterviewTime}
                  placeholder="e.g. Tomorrow at 4:00 PM IST"
                  placeholderTextColor={COLORS.textMuted}
                />

                <Text style={styles.inputLabel}>Interviewer Details</Text>
                <TextInput
                  style={styles.modalInput}
                  value={interviewer}
                  onChangeText={setInterviewer}
                  placeholder="e.g. Senior Tech Lead / Staff Engineer"
                  placeholderTextColor={COLORS.textMuted}
                />

                <Text style={styles.inputLabel}>Video Room Link (Google Meet / Zoom)</Text>
                <TextInput
                  style={styles.modalInput}
                  value={meetLink}
                  onChangeText={setMeetLink}
                  placeholder="e.g. https://meet.google.com/abc-xyz-pqr"
                  placeholderTextColor={COLORS.textMuted}
                />

                <Text style={styles.inputLabel}>Technical Topics / Rounds</Text>
                <TextInput
                  style={[styles.modalInput, { height: 60 }]}
                  value={interviewTopics}
                  onChangeText={setInterviewTopics}
                  multiline={true}
                  placeholder="e.g. Live Coding, DSA, System Architecture"
                  placeholderTextColor={COLORS.textMuted}
                />

                <View style={{
                  marginVertical: 14,
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: 'rgba(56, 189, 248, 0.08)',
                  borderWidth: 1,
                  borderColor: 'rgba(56, 189, 248, 0.25)',
                  flexDirection: 'row',
                  gap: 8,
                  alignItems: 'center'
                }}>
                  <Feather name="bell" size={16} color="#38bdf8" />
                  <Text style={{ color: '#bae6fd', fontSize: 11, flex: 1, lineHeight: 16 }}>
                    Candidate will immediately receive a notification on their phone with the Google Meet link, scheduled time, and AI interview prep guide.
                  </Text>
                </View>

                <TouchableOpacity 
                  style={[styles.modalSubmitBtn, { backgroundColor: '#38bdf8' }]} 
                  onPress={handleScheduleInterviewSubmit}
                  activeOpacity={0.8}
                >
                  <Feather name="calendar" size={15} color="#000" />
                  <Text style={[styles.modalSubmitText, { color: '#000' }]}>Confirm & Schedule Interview</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Candidate Rejection Modal */}
      {candidateForReject && (
        <Modal visible={!!candidateForReject} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={[styles.sheetTitle, { color: '#f43f5e' }]}>Decline Candidate Application</Text>
                  <Text style={styles.sheetSub}>
                    {candidateForReject.applicantName || 'Candidate'} • {candidateForReject.jobTitle}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setCandidateForReject(null)}>
                  <Ionicons name="close" size={20} color={COLORS.textMain} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                <Text style={styles.inputLabel}>Select Rejection Reason</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 6 }}>
                  {[
                    "Skills gap in required technology stack",
                    "Experience level does not match role",
                    "Position filled / High candidate volume",
                    "Graduation batch criteria mismatch"
                  ].map((r, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => setRejectReason(r)}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 8,
                        backgroundColor: rejectReason === r ? 'rgba(244, 63, 94, 0.2)' : '#1a1a1a',
                        borderWidth: 1,
                        borderColor: rejectReason === r ? '#f43f5e' : '#333333'
                      }}
                    >
                      <Text style={{ color: rejectReason === r ? '#ffffff' : '#a3a3a3', fontSize: 11, fontWeight: rejectReason === r ? '700' : '500' }}>
                        {r}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Custom Constructive Feedback</Text>
                <TextInput
                  style={[styles.modalInput, { height: 70 }]}
                  value={rejectReason}
                  onChangeText={setRejectReason}
                  multiline={true}
                  placeholder="Provide helpful feedback to help candidate improve..."
                  placeholderTextColor={COLORS.textMuted}
                />

                <View style={{
                  marginVertical: 14,
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: 'rgba(244, 63, 94, 0.08)',
                  borderWidth: 1,
                  borderColor: 'rgba(244, 63, 94, 0.25)',
                  flexDirection: 'row',
                  gap: 8,
                  alignItems: 'center'
                }}>
                  <Feather name="info" size={16} color="#f43f5e" />
                  <Text style={{ color: '#fca5a5', fontSize: 11, flex: 1, lineHeight: 16 }}>
                    The candidate will be shown encouraging upskilling tips and recommendations for other open positions in their tracker.
                  </Text>
                </View>

                <TouchableOpacity 
                  style={[styles.modalSubmitBtn, { backgroundColor: '#f43f5e' }]} 
                  onPress={handleRejectSubmit}
                  activeOpacity={0.8}
                >
                  <Feather name="x-circle" size={15} color="#fff" />
                  <Text style={[styles.modalSubmitText, { color: '#fff' }]}>Confirm Rejection & Send Feedback</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Recruiter Preview of Offer Letter */}
      {previewOfferApp && (
        <OfferLetterModal
          visible={!!previewOfferApp}
          application={previewOfferApp}
          candidateName={previewOfferApp.applicantName || 'Candidate'}
          onClose={() => setPreviewOfferApp(null)}
        />
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
  subTag: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    color: COLORS.textMain,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  postJobBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
  },
  postJobText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
  },
  content: {
    paddingHorizontal: SPACING.lg,
    gap: 14,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricBox: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.md,
    padding: 12,
  },
  metricLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  metricVal: {
    color: COLORS.textMain,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 3,
  },
  sectionHeaderRow: {
    marginTop: 6,
  },
  sectionHeading: {
    color: COLORS.textMain,
    fontSize: 15,
    fontWeight: '800',
  },
  sectionSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
    gap: 8,
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
  candidateCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.lg,
    padding: 14,
  },
  candidateCardOffer: {
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: '#161616',
  },
  candidateTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  candidateName: {
    color: COLORS.textMain,
    fontSize: 15,
    fontWeight: '800',
  },
  roleApplied: {
    color: COLORS.textMain,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  compApplied: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  statusPill: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
  },
  statusPillOffer: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  statusText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  resumeUsed: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  dateApplied: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  offerBadgeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  offerBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  previewOfferBtn: {
    backgroundColor: '#ffffff',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  previewOfferBtnText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '800',
  },
  actionBtnsRow: {
    flexDirection: 'row',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    paddingTop: 10,
  },
  statusBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.sm,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.3)',
  },
  statusBtnText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  statusBtnOffer: {
    flex: 1.2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.sm,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  statusBtnOfferActive: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  statusBtnOfferText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#262626',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
    paddingBottom: 12,
  },
  sheetTitle: {
    color: COLORS.textMain,
    fontSize: 16,
    fontWeight: '800',
  },
  sheetSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalInput: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.textMain,
    fontSize: 13,
  },
  offerLetterNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    padding: 10,
    marginVertical: 14,
  },
  offerLetterNoticeText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  modalSubmitBtn: {
    backgroundColor: '#ffffff',
    height: 46,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  modalSubmitText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '800',
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  typePill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#262626',
  },
  typePillActive: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  typePillText: {
    color: '#a3a3a3',
    fontSize: 12,
    fontWeight: '600',
  },
  typePillTextActive: {
    color: '#000000',
    fontWeight: '800',
  },
  smallPostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADIUS.sm,
  },
  smallPostBtnText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '800',
  },
  postedJobCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 6,
  },
  postedJobTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  postedJobCompany: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  postedJobSalary: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  postedJobTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  postedJobTag: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  postedJobTagText: {
    color: '#d4d4d4',
    fontSize: 11,
    fontWeight: '600',
  },
  postedJobApplicants: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  liveBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  liveBadgeText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '900',
  },
});
