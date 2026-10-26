import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, SafeAreaView, 
  Platform, StatusBar as RNStatusBar, Alert, LogBox 
} from 'react-native';

// Suppress intrusive on-device yellow warnings
LogBox.ignoreAllLogs(true);

import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons } from '@expo/vector-icons';

import { COLORS, RADIUS, SPACING } from './src/theme';
import { api } from './src/api';

// Components
import Header from './src/components/Header';
import JobDetailsModal from './src/components/JobDetailsModal';
import ApplyModal from './src/components/ApplyModal';
import FilterModal from './src/components/FilterModal';
import NotificationsModal from './src/components/NotificationsModal';

// Screens
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import TrackerScreen from './src/screens/TrackerScreen';
import SavedScreen from './src/screens/SavedScreen';
import ResumeScreen from './src/screens/ResumeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RecruiterScreen from './src/screens/RecruiterScreen';
import { initialJobs } from './src/data/initialJobs';

// Default initial jobs — all real data synced from backend API
const defaultJobs = initialJobs;

const defaultProfile = {
  id: 'usr-1',
  name: 'Mayur',
  headline: 'Full Stack Developer & AI Enthusiast | B.Tech CSE',
  email: 'mkbharvad8080@gmail.com',
  phone: '+91 98765 43210',
  college: 'National Institute of Technology',
  degree: 'B.Tech in Computer Science & Engineering',
  branch: 'Computer Science',
  cgpa: '8.6',
  graduationYear: '2026',
  location: 'Bangalore, India',
  preferredLocation: 'Bangalore / Remote',
  expectedSalary: '₹8–12 LPA',
  preferredWorkMode: 'Hybrid',
  skills: ['React', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Tailwind CSS', 'Git'],
  education: [
    {
      id: 'edu-1',
      institution: 'National Institute of Technology',
      degree: 'B.Tech in Computer Science & Engineering',
      year: '2022 – 2026',
      score: 'CGPA: 8.6 / 10'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Full Stack Web Developer Intern',
      company: 'ABC Innovations',
      location: 'Bangalore (Hybrid)',
      duration: 'May 2025 – Aug 2025 (4 mos)',
      description: 'Built responsive UI components in React and optimized backend API routes.'
    }
  ],
  completionPercent: 88
};

const defaultResumes = [];
const defaultApplications = [];
const defaultNotifications = [];
const defaultRecruiterJobs = defaultJobs.filter(j => j.company === 'ABC Technologies');

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userRole, setUserRole] = useState('student'); // 'student' | 'recruiter'

  // Navigation state
  const [activeTab, setActiveTab] = useState('home'); // home, tracker, saved, resume, profile, recruiter

  // Data states
  const [jobs, setJobs] = useState(defaultJobs);
  const [recruiterJobs, setRecruiterJobs] = useState(defaultRecruiterJobs); // Jobs posted by recruiter
  const [profile, setProfile] = useState(defaultProfile);
  const [resumes, setResumes] = useState(defaultResumes);
  const [applications, setApplications] = useState(defaultApplications);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [notifications, setNotifications] = useState(defaultNotifications);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filters, setFilters] = useState({
    type: 'All',
    experience: 'All',
    location: 'All',
    workMode: 'All',
    salaryMin: ''
  });

  // Modals
  const [selectedJobForDetails, setSelectedJobForDetails] = useState(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);

  // Load from Express backend on start
  useEffect(() => {
    (async () => {
      const jRes = await api.getJobs();
      if (jRes.success && jRes.jobs) setJobs(jRes.jobs);

      const pRes = await api.getProfile();
      if (pRes.success && pRes.profile) setProfile(pRes.profile);

      const rRes = await api.getResumes();
      if (rRes.success && rRes.resumes) setResumes(rRes.resumes);

      const aRes = await api.getApplications();
      if (aRes.success && aRes.applications) setApplications(aRes.applications);

      const sRes = await api.getSavedJobs();
      if (sRes.success && sRes.savedJobIds) setSavedJobIds(sRes.savedJobIds);

      const nRes = await api.getNotifications();
      if (nRes.success && nRes.notifications) setNotifications(nRes.notifications);
    })();
  }, []);

  // Filter logic
  const filteredJobs = jobs.filter(j => {
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = j.title?.toLowerCase().includes(q);
      const matchComp = j.company?.toLowerCase().includes(q);
      const matchSkills = j.skills?.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchComp && !matchSkills) return false;
    }

    // Category pills
    if (selectedCategory === 'Internship' && j.jobType !== 'Internship') return false;
    if (selectedCategory === 'Full Time' && j.jobType !== 'Full Time') return false;
    if (selectedCategory === 'Remote' && j.workMode !== 'Remote') return false;
    if (selectedCategory === 'Fresher' && j.experience !== 'Fresher') return false;
    if (selectedCategory === 'HighPay' && (j.salaryMax || 0) < 10) return false;

    // Filter modal
    if (filters.type !== 'All' && j.jobType !== filters.type) return false;
    if (filters.experience !== 'All' && !j.experience?.toLowerCase().includes(filters.experience.toLowerCase())) return false;
    if (filters.location !== 'All' && !j.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.workMode !== 'All' && j.workMode?.toLowerCase() !== filters.workMode.toLowerCase()) return false;
    if (filters.salaryMin && (j.salaryMax || 0) < parseFloat(filters.salaryMin)) return false;

    return true;
  });

  const activeFilterCount = Object.entries(filters).filter(([_, v]) => v && v !== 'All').length;

  // Handlers
  const handleToggleSave = async (jobId) => {
    const isSaved = savedJobIds.includes(jobId);
    const newSaved = isSaved ? savedJobIds.filter(id => id !== jobId) : [...savedJobIds, jobId];
    setSavedJobIds(newSaved);
    api.toggleSaveJob(jobId);
  };

  const handleApplySubmit = async (appPayload) => {
    const chosenJob = jobs.find(j => j.id === appPayload.jobId) || selectedJobForApply;
    const newApp = {
      id: "app-" + Date.now(),
      jobId: chosenJob.id,
      jobTitle: chosenJob.title,
      company: chosenJob.company,
      companyLogo: chosenJob.logo,
      location: chosenJob.location,
      salary: chosenJob.salary || '₹10,00,000 LPA',
      applicantName: profile?.name || 'Applicant',
      appliedDate: new Date().toISOString(),
      resumeUsed: appPayload.resumeName || 'Primary Resume',
      status: "Applied",
      timeline: [
        { step: "Applied", title: "Application Submitted", date: "Just now", completed: true, note: "Application sent with attached resume." },
        { step: "Under Review", title: "Profile Under Review", date: "Pending", completed: false, note: "Awaiting recruiter evaluation." },
        { step: "Shortlisted", title: "Candidate Shortlisted", date: "Pending", completed: false, note: "If qualified, you will be shortlisted." },
        { step: "Assessment", title: "Technical Assessment", date: "Pending", completed: false, note: "Skill verification." },
        { step: "Interview", title: "Interview Round", date: "Pending", completed: false, note: "Virtual interview." },
        { step: "Offer", title: `Offer Letter (${chosenJob.company})`, date: "Pending", completed: false, note: "Official company compensation & employment letter." }
      ]
    };

    setApplications(prev => [newApp, ...prev]);
    api.applyToJob(chosenJob.id, appPayload);

    // Add notification
    const newNotif = {
      id: "notif-" + Date.now(),
      title: "Application Received ✓",
      message: `Your application for ${chosenJob.title} at ${chosenJob.company} was submitted.`,
      time: "Just now",
      read: false,
      type: "shortlist"
    };
    setNotifications(prev => [newNotif, ...prev]);

    setTimeout(() => {
      setActiveTab('tracker');
    }, 600);
  };

  const handleWithdraw = (appId) => {
    setApplications(prev => prev.filter(a => a.id !== appId));
    api.withdrawApplication(appId);
  };

  const handleUploadResume = (data) => {
    const newR = {
      id: "res-" + Date.now(),
      name: data.fileName,
      title: data.title,
      fileSize: "1.1 MB",
      isPrimary: true,
      atsScore: 88,
      parsedSkills: data.skills
    };
    setResumes(prev => [newR, ...prev.map(r => ({ ...r, isPrimary: false }))]);
    api.uploadResume(data);
  };

  const handleBuildResume = (data) => {
    const newR = {
      id: "res-" + Date.now(),
      name: `${data.title.replace(/\s+/g, '_')}_Resume.pdf`,
      title: data.title,
      fileSize: "850 KB",
      isPrimary: true,
      atsScore: 92,
      parsedSkills: data.skills
    };
    setResumes(prev => [newR, ...prev.map(r => ({ ...r, isPrimary: false }))]);
    api.buildResume(data);
  };

  const handleDeleteResume = (id) => {
    setResumes(prev => prev.filter(r => r.id !== id));
    api.deleteResume(id);
  };

  const handleUpdateProfile = (updated) => {
    setProfile(updated);
    api.updateProfile(updated);
  };

  const handlePostJob = (jobData) => {
    const newJob = {
      id: "job-" + Date.now(),
      applicantsCount: 0,
      postedDate: "Just now",
      companyVerified: true,
      featured: true,
      isNewUpload: true,
      ...jobData
    };
    // Add to BOTH recruiterJobs (employer list) AND jobs (student live feed)
    setRecruiterJobs(prev => [newJob, ...prev]);
    setJobs(prev => [newJob, ...prev]);
    api.postJob(newJob);

    // Reset filters so newly posted job is immediately visible at the top of student feed
    setSearchQuery('');
    setSelectedCategory('All');
    setFilters({
      type: 'All',
      experience: 'All',
      location: 'All',
      workMode: 'All',
      salaryMin: ''
    });

    setNotifications(prev => [{
      id: "notif-" + Date.now(),
      title: "Job Published Live! 🚀",
      message: `${newJob.title} at ${newJob.company} is now live and visible to all job seekers in the feed.`,
      time: "Just now",
      read: false,
      type: "job"
    }, ...prev]);
  };

  const handleUpdateCandidateStatus = (appId, status, note, extraDetails = {}) => {
    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        if (status === 'Rejected') {
          return {
            ...a,
            status: 'Rejected',
            rejectionReason: note || 'Profile not aligned with current requirements',
            timeline: [
              ...a.timeline.filter(t => t.completed),
              {
                step: 'Rejected',
                title: 'Application Not Moving Forward',
                date: 'Just now',
                completed: true,
                note: note || 'Thank you for your interest. We encourage you to apply for other matching openings.'
              }
            ]
          };
        }

        const stages = ["Applied", "Under Review", "Shortlisted", "Assessment", "Interview", "Offer"];
        const targetIdx = stages.indexOf(status);
        const updatedTimeline = a.timeline.map((step, idx) => {
          if (idx <= targetIdx) {
            return { 
              ...step, 
              completed: true, 
              date: step.date === "Pending" ? "Just now" : step.date, 
              note: step.step === status ? note : step.note 
            };
          }
          return { ...step, completed: false };
        });

        return { 
          ...a, 
          status, 
          timeline: updatedTimeline,
          offerStatus: status === 'Offer' ? (a.offerStatus || 'pending') : a.offerStatus,
          interviewDetails: status === 'Interview' ? (extraDetails || a.interviewDetails) : a.interviewDetails
        };
      }
      return a;
    }));
    api.updateCandidateStatus(appId, status, note);

    const app = applications.find(a => a.id === appId);
    const comp = app?.company || 'Company';

    if (status === 'Offer') {
      setNotifications(prev => [{
        id: "notif-" + Date.now(),
        title: "Official Offer Letter Issued! 📄",
        message: `${comp} has issued your official employment offer letter. Check your Tracker tab.`,
        time: "Just now",
        read: false,
        type: "offer"
      }, ...prev]);
    } else if (status === 'Interview') {
      const timeStr = extraDetails?.interviewTime || "Tomorrow at 4:00 PM IST";
      setNotifications(prev => [{
        id: "notif-" + Date.now(),
        title: "Technical Interview Scheduled! 📅",
        message: `${comp} scheduled your Technical Interview for ${timeStr}. Join link is available in your Tracker tab.`,
        time: "Just now",
        read: false,
        type: "interview"
      }, ...prev]);
    } else if (status === 'Rejected') {
      setNotifications(prev => [{
        id: "notif-" + Date.now(),
        title: "Application Status Update",
        message: `${comp} has updated your application for ${app?.jobTitle}: Not moving forward at this time.`,
        time: "Just now",
        read: false,
        type: "status"
      }, ...prev]);
    }
  };

  const handleAcceptOffer = (appId) => {
    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return { ...a, status: 'Offer', offerStatus: 'accepted' };
      }
      return a;
    }));
    const app = applications.find(a => a.id === appId);
    if (app) {
      setNotifications(prev => [{
        id: "notif-" + Date.now(),
        title: "Offer Accepted! 🎉",
        message: `You accepted the employment offer from ${app.company}. The HR team will contact you for onboarding.`,
        time: "Just now",
        read: false,
        type: "offer"
      }, ...prev]);
    }
  };

  const handleDeclineOffer = (appId) => {
    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return { ...a, offerStatus: 'declined' };
      }
      return a;
    }));
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;
  const savedJobs = jobs.filter(j => savedJobIds.includes(j.id));

  // Role toggle
  const toggleRole = () => {
    const newRole = userRole === 'student' ? 'recruiter' : 'student';
    setUserRole(newRole);
    setActiveTab(newRole === 'recruiter' ? 'recruiter' : 'home');
    Alert.alert(
      newRole === 'recruiter' ? "Switched to Recruiter Mode 🏢" : "Switched to Student Mode 🎓",
      newRole === 'recruiter' 
        ? "You are now in Employer Mode: manage your active postings and review applicants." 
        : "You are now in Candidate Mode: explore verified jobs and track your applications."
    );
  };

  if (!isLoggedIn) {
    return (
      <AuthScreen
        onLoginSuccess={(userData) => {
          setIsLoggedIn(true);
          setUserRole(userData.role || 'student');
          setActiveTab(userData.role === 'recruiter' ? 'recruiter' : 'home');
          if (userData.name) {
            setProfile(prev => ({
              ...prev,
              name: userData.name,
              email: userData.email || prev.email,
              phone: userData.phone || prev.phone
            }));
          }
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="light" />

      {/* Mobile Top Header */}
      <Header
        profile={profile}
        unreadCount={unreadNotifsCount}
        savedCount={savedJobIds.length}
        onOpenNotifications={() => setShowNotifModal(true)}
        onOpenSaved={() => setActiveTab('saved')}
        onRoleToggle={toggleRole}
        currentRole={userRole}
      />

      {/* Main Screen Body */}
      <View style={styles.body}>
        {activeTab === 'home' && (
          <HomeScreen
            jobs={filteredJobs}
            profile={profile}
            savedJobIds={savedJobIds}
            onToggleSave={handleToggleSave}
            onSelectJob={(j) => setSelectedJobForDetails(j)}
            onOpenApply={(j) => setSelectedJobForApply(j)}
            onOpenFilter={() => setShowFilterModal(true)}
            activeFilterCount={activeFilterCount}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {activeTab === 'tracker' && (
          <TrackerScreen
            applications={applications}
            profile={profile}
            onWithdrawApplication={handleWithdraw}
            onSelectJobForDetails={(j) => setSelectedJobForDetails(j)}
            onAcceptOffer={handleAcceptOffer}
            onDeclineOffer={handleDeclineOffer}
          />
        )}

        {activeTab === 'saved' && (
          <SavedScreen
            savedJobs={savedJobs}
            onToggleSave={handleToggleSave}
            onSelectJob={(j) => setSelectedJobForDetails(j)}
            onOpenApply={(j) => setSelectedJobForApply(j)}
          />
        )}

        {activeTab === 'resume' && (
          <ResumeScreen
            resumes={resumes}
            onUploadResume={handleUploadResume}
            onCreateResume={handleBuildResume}
            onDeleteResume={handleDeleteResume}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            profile={profile}
            resumes={resumes}
            savedJobsCount={savedJobIds.length}
            onUpdateProfile={handleUpdateProfile}
            onLogout={() => setIsLoggedIn(false)}
            onOpenResumes={() => setActiveTab('resume')}
            onOpenSaved={() => setActiveTab('saved')}
          />
        )}

        {activeTab === 'recruiter' && (
          <RecruiterScreen
            jobs={recruiterJobs}
            applications={applications}
            onPostJob={handlePostJob}
            onUpdateCandidateStatus={handleUpdateCandidateStatus}
            onViewFeed={() => setActiveTab('home')}
          />
        )}
      </View>

      {/* Dynamic Role-Based Mobile Bottom Navigation Bar */}
      {userRole === 'student' ? (
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('home')}
          >
            <Feather
              name="home"
              size={20}
              color={activeTab === 'home' ? '#ffffff' : COLORS.textMuted}
            />
            <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('tracker')}
          >
            <View style={{ position: 'relative' }}>
              <Feather
                name="clipboard"
                size={20}
                color={activeTab === 'tracker' ? '#ffffff' : COLORS.textMuted}
              />
              {applications.length > 0 && (
                <View style={styles.navBadge}>
                  <Text style={styles.navBadgeText}>{applications.length}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.navLabel, activeTab === 'tracker' && styles.navLabelActive]}>
              Tracker
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('saved')}
          >
            <View style={{ position: 'relative' }}>
              <Feather
                name="bookmark"
                size={20}
                color={activeTab === 'saved' ? '#ffffff' : COLORS.textMuted}
              />
              {savedJobIds.length > 0 && (
                <View style={[styles.navBadge, { backgroundColor: '#737373' }]}>
                  <Text style={[styles.navBadgeText, { color: '#ffffff' }]}>{savedJobIds.length}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.navLabel, activeTab === 'saved' && styles.navLabelActive]}>
              Saved
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('resume')}
          >
            <Feather
              name="file-text"
              size={20}
              color={activeTab === 'resume' ? '#ffffff' : COLORS.textMuted}
            />
            <Text style={[styles.navLabel, activeTab === 'resume' && styles.navLabelActive]}>
              Resume
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('profile')}
          >
            <Feather
              name="user"
              size={20}
              color={activeTab === 'profile' ? '#ffffff' : COLORS.textMuted}
            />
            <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* RECRUITER MODE BOTTOM NAVIGATION BAR */
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('recruiter')}
          >
            <Feather
              name="briefcase"
              size={20}
              color={activeTab === 'recruiter' ? '#ffffff' : COLORS.textMuted}
            />
            <Text style={[styles.navLabel, activeTab === 'recruiter' && styles.navLabelActive]}>
              Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('home')}
          >
            <Feather
              name="eye"
              size={20}
              color={activeTab === 'home' ? '#ffffff' : COLORS.textMuted}
            />
            <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>
              Student Feed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('profile')}
          >
            <Feather
              name="user"
              size={20}
              color={activeTab === 'profile' ? '#ffffff' : COLORS.textMuted}
            />
            <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Global Modals */}
      {selectedJobForDetails && (
        <JobDetailsModal
          visible={!!selectedJobForDetails}
          job={selectedJobForDetails}
          isSaved={savedJobIds.includes(selectedJobForDetails.id)}
          onClose={() => setSelectedJobForDetails(null)}
          onToggleSave={handleToggleSave}
          onOpenApply={(job) => {
            setSelectedJobForDetails(null);
            setSelectedJobForApply(job);
          }}
        />
      )}

      {selectedJobForApply && (
        <ApplyModal
          visible={!!selectedJobForApply}
          job={selectedJobForApply}
          resumes={resumes}
          onClose={() => setSelectedJobForApply(null)}
          onSubmit={handleApplySubmit}
        />
      )}

      <FilterModal
        visible={showFilterModal}
        filters={filters}
        setFilters={setFilters}
        onClose={() => setShowFilterModal(false)}
        onApply={() => setShowFilterModal(false)}
        onReset={() => {
          setFilters({ type: 'All', experience: 'All', location: 'All', workMode: 'All', salaryMin: '' });
          setShowFilterModal(false);
        }}
      />

      <NotificationsModal
        visible={showNotifModal}
        notifications={notifications}
        onClose={() => setShowNotifModal(false)}
        onMarkAllRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
          api.markAllNotificationsRead();
        }}
        onNotificationPress={(notif) => {
          setActiveTab('tracker');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 0,
  },
  body: {
    flex: 1,
    width: '100%',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderTopWidth: 1,
    borderTopColor: '#262626',
    height: Platform.OS === 'ios' ? 76 : 64,
    paddingBottom: Platform.OS === 'ios' ? 18 : 6,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    flex: 1,
  },
  navLabel: {
    color: '#737373',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 3,
  },
  navLabelActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  navBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBadgeText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '800',
  },
});
