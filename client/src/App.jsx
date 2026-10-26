import React, { useState, useEffect } from 'react';
import PhoneSimulator from './components/PhoneSimulator';
import AuthScreens from './components/AuthScreens';
import HomeFeed from './components/HomeFeed';
import JobDetailsModal from './components/JobDetailsModal';
import ApplyModal from './components/ApplyModal';
import FilterModal from './components/FilterModal';
import ApplicationTracker from './components/ApplicationTracker';
import SavedJobs from './components/SavedJobs';
import ProfileView from './components/ProfileView';
import ResumeModule from './components/ResumeModule';
import NotificationsModal from './components/NotificationsModal';
import RecruiterDashboard from './components/RecruiterDashboard';
import SalaryCalculatorModal from './components/SalaryCalculatorModal';
import MockInterviewSimulatorModal from './components/MockInterviewSimulatorModal';
import SkillGapModal from './components/SkillGapModal';

import { initialJobs } from './data/initialJobs';

import { 
  Home, Search, ClipboardList, Bookmark, User, 
  Briefcase, Bell, CheckCircle2 
} from 'lucide-react';

export default function App() {
  // Device & App Simulator State
  const [deviceType, setDeviceType] = useState('iphone'); // 'iphone' | 'android' | 'fullscreen'
  const [userRole, setUserRole] = useState('student'); // 'student' | 'recruiter'
  const [user, setUser] = useState({
    id: 'user-1',
    name: 'Candidate Profile',
    email: 'candidate@example.com',
    role: 'student'
  });
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // Active Bottom Tab
  // 'home' | 'applications' | 'saved' | 'profile' | 'resumes' | 'recruiter'
  const [activeTab, setActiveTab] = useState('home');

  // Backend Data State — seed with real verified opportunities
  const [jobs, setJobs] = useState(initialJobs);
  const [recruiterJobs, setRecruiterJobs] = useState(initialJobs.filter(j => j.company === 'ABC Technologies'));
  const [profile, setProfile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Modals & Sheets
  const [selectedJobForDetails, setSelectedJobForDetails] = useState(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // New Career Features Modals
  const [showSalaryCalculator, setShowSalaryCalculator] = useState(false);
  const [selectedCtcForCalculator, setSelectedCtcForCalculator] = useState(12);
  const [mockSimulatorJob, setMockSimulatorJob] = useState(null);
  const [skillGapJob, setSkillGapJob] = useState(null);

  // Search & Filter Query
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filters, setFilters] = useState({
    type: 'All',
    experience: 'All',
    location: 'All',
    workMode: 'All',
    salaryMin: ''
  });

  // Toast alert
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch initial data with safe offline fallbacks
  const loadAllData = async () => {
    try {
      const [jobsRes, profileRes, resumesRes, appsRes, savedRes, notifsRes] = await Promise.all([
        fetch('/api/v1/jobs').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/v1/profile').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/v1/resumes').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/v1/applications').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/v1/saved-jobs').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/v1/notifications').then(r => r.json()).catch(() => ({ success: false }))
      ]);

      if (jobsRes?.success && jobsRes.jobs?.length > 0) setJobs(jobsRes.jobs);
      if (profileRes?.success && profileRes.profile) setProfile(profileRes.profile);
      if (resumesRes?.success && resumesRes.resumes) setResumes(resumesRes.resumes);
      if (appsRes?.success && appsRes.applications) setApplications(appsRes.applications);
      if (savedRes?.success && savedRes.savedJobIds) setSavedJobIds(savedRes.savedJobIds);
      if (notifsRes?.success && notifsRes.notifications) setNotifications(notifsRes.notifications);
    } catch (err) {
      console.log("Using initial seed dataset");
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handle Search & Filter fetch
  const fetchFilteredJobs = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (filters.type && filters.type !== 'All') params.append('type', filters.type);
      if (filters.experience && filters.experience !== 'All') params.append('experience', filters.experience);
      if (filters.location && filters.location !== 'All') params.append('location', filters.location);
      if (filters.workMode && filters.workMode !== 'All') params.append('workMode', filters.workMode);
      if (filters.salaryMin) params.append('salaryMin', filters.salaryMin);

      const res = await fetch(`/api/v1/jobs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        let results = data.jobs;
        // Category pill filter
        if (selectedCategory === 'Internship') results = results.filter(j => j.jobType === 'Internship');
        if (selectedCategory === 'Full Time') results = results.filter(j => j.jobType === 'Full Time');
        if (selectedCategory === 'Remote') results = results.filter(j => j.workMode === 'Remote');
        if (selectedCategory === 'Fresher') results = results.filter(j => j.experience === 'Fresher');
        if (selectedCategory === 'HighPay') results = results.filter(j => j.salaryMax >= 10);
        setJobs(results);
      }
    } catch (err) {
      console.error("Filter error:", err);
    }
  };

  useEffect(() => {
    fetchFilteredJobs();
  }, [searchQuery, selectedCategory]);

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => v && v !== 'All').length;

  const handleResetFilters = () => {
    setFilters({
      type: 'All',
      experience: 'All',
      location: 'All',
      workMode: 'All',
      salaryMin: ''
    });
    setSearchQuery('');
    setSelectedCategory('All');
    loadAllData();
  };

  // Toggle Save Job
  const handleToggleSave = async (jobId) => {
    try {
      const res = await fetch('/api/v1/saved-jobs/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId })
      });
      const data = await res.json();
      if (data.success) {
        setSavedJobIds(data.savedJobIds);
        showToast(data.isSaved ? "Saved to your bookmarks! ❤️" : "Removed from saved jobs.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Application
  const handleApplicationSubmitted = (newApp) => {
    setApplications(prev => [newApp, ...prev]);
    // update jobs applicant count
    setJobs(prev => prev.map(j => j.id === newApp.jobId ? { ...j, applicantsCount: (j.applicantsCount || 0) + 1 } : j));
    // refresh notifs
    fetch('/api/v1/notifications').then(r => r.json()).then(d => {
      if (d.success) setNotifications(d.notifications);
    });
    showToast(`Application submitted to ${newApp.company}! 🎉`);
    setActiveTab('applications');
  };

  // Withdraw Application
  const handleWithdrawApplication = async (appId) => {
    try {
      const res = await fetch(`/api/v1/applications/${appId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setApplications(prev => prev.filter(a => a.id !== appId));
        showToast("Application withdrawn successfully.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Resume handlers
  const handleUploadResume = async (resumeData) => {
    try {
      const res = await fetch('/api/v1/resumes/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData)
      });
      const data = await res.json();
      if (data.success) {
        setResumes(prev => [data.resume, ...prev]);
        showToast("Resume parsed & ATS score computed! 🚀");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateResume = async (builderData) => {
    try {
      const res = await fetch('/api/v1/resumes/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(builderData)
      });
      const data = await res.json();
      if (data.success) {
        setResumes(prev => [data.resume, ...prev.map(r => ({ ...r, isPrimary: false }))]);
        showToast("ATS Resume generated successfully! 📄");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    try {
      const res = await fetch(`/api/v1/resumes/${resumeId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setResumes(prev => prev.filter(r => r.id !== resumeId));
        showToast("Resume deleted.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Recruiter actions
  const handlePostJob = async (jobPayload) => {
    const newJob = {
      id: "job-" + Date.now(),
      applicantsCount: 0,
      postedDate: "Just now",
      companyVerified: true,
      featured: true,
      isNewUpload: true,
      ...jobPayload
    };
    // Always add immediately so recruiter and student feed have it at the very top
    setRecruiterJobs(prev => [newJob, ...prev]);
    setJobs(prev => [newJob, ...prev]);
    setSearchQuery('');
    setSelectedCategory('All');
    showToast(`New Job "${newJob.title}" published! 🚀`);

    try {
      await fetch('/api/v1/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
      });
    } catch (err) {
      console.log("Local offline mode active");
    }
  };

  const handleUpdateCandidateStatus = async (appId, status, note, extraDetails = {}) => {
    try {
      const res = await fetch(`/api/v1/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note, ...extraDetails })
      });
      const data = await res.json();
      if (data.success) {
        setApplications(prev => prev.map(a => a.id === appId ? data.application : a));
        // refresh notifs
        fetch('/api/v1/notifications').then(r => r.json()).then(d => {
          if (d.success) setNotifications(d.notifications);
        });
        showToast(`Candidate status updated to "${status}"! ⚡`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllNotifsRead = async () => {
    try {
      const res = await fetch('/api/v1/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;
  const savedJobs = jobs.filter(j => savedJobIds.includes(j.id));

  const handleRoleChange = (role) => {
    setUserRole(role);
    setActiveTab(role === 'recruiter' ? 'recruiter' : 'home');
    showToast(role === 'recruiter' ? "Switched to Recruiter Workspace 🏢" : "Switched to Candidate Portal 🎓");
  };

  const handleOpenSalaryCalc = (job) => {
    setSelectedCtcForCalculator(job?.salaryMin || 12);
    setShowSalaryCalculator(true);
  };

  const handleOpenMockSimulator = (job) => {
    setMockSimulatorJob(job || jobs[0]);
  };

  const handleOpenSkillGap = (job) => {
    setSkillGapJob(job || jobs[0]);
  };

  const handleSkillAdded = (updatedProfile, skillName) => {
    setProfile(updatedProfile);
    showToast(`Added "${skillName}" to verified skills! 🚀`);
  };

  return (
    <PhoneSimulator
      deviceType={deviceType}
      setDeviceType={setDeviceType}
      userRole={userRole}
      setUserRole={handleRoleChange}
      onResetDemo={() => {
        loadAllData();
        showToast("Demo refreshed with seed opportunities.");
      }}
    >
      {/* Toast popup */}
      {toastMessage && (
        <div style={{
          position: 'absolute',
          top: '50px',
          left: '20px',
          right: '20px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid var(--primary)',
          color: '#fff',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8rem',
          fontWeight: '600',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideUp 0.2s ease-out'
        }}>
          <CheckCircle2 size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Auth Screen Flow if logged out */}
      {isLoggedOut ? (
        <AuthScreens
          onLoginSuccess={(userData) => {
            setUser(userData);
            setUserRole(userData.role || 'student');
            setIsLoggedOut(false);
            showToast(`Signed in as ${userData.name}!`);
          }}
        />
      ) : (
        <>
          {/* Main Content depending on active tab */}
          {activeTab === 'home' && (
            <HomeFeed
              jobs={jobs}
              profile={profile}
              savedJobIds={savedJobIds}
              onToggleSave={handleToggleSave}
              onSelectJob={(j) => setSelectedJobForDetails(j)}
              onOpenApply={(j) => setSelectedJobForApply(j)}
              onOpenFilter={() => setShowFilterModal(true)}
              activeFilterCount={activeFilterCount}
              onOpenNotifications={() => setShowNotificationsModal(true)}
              unreadNotifsCount={unreadNotifsCount}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onOpenSalaryCalculator={handleOpenSalaryCalc}
              onOpenMockSimulator={handleOpenMockSimulator}
              onOpenSkillGap={handleOpenSkillGap}
            />
          )}

          {activeTab === 'applications' && (
            <ApplicationTracker
              applications={applications}
              onWithdrawApplication={handleWithdrawApplication}
              onSelectJobForDetails={(j) => setSelectedJobForDetails(j)}
              allJobs={jobs}
            />
          )}

          {activeTab === 'saved' && (
            <SavedJobs
              savedJobs={savedJobs}
              onToggleSave={handleToggleSave}
              onSelectJob={(j) => setSelectedJobForDetails(j)}
              onOpenApply={(j) => setSelectedJobForApply(j)}
            />
          )}

          {activeTab === 'resumes' && (
            <ResumeModule
              resumes={resumes}
              onUploadResume={handleUploadResume}
              onCreateResume={handleCreateResume}
              onDeleteResume={handleDeleteResume}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              profile={profile}
              resumes={resumes}
              onUpdateProfile={(p) => {
                setProfile(p);
                showToast("Profile details updated! ✓");
              }}
              onLogout={() => setIsLoggedOut(true)}
              onOpenResumeTab={() => setActiveTab('resumes')}
            />
          )}

          {activeTab === 'recruiter' && (
            <RecruiterDashboard
              jobs={recruiterJobs}
              applications={applications}
              onPostJob={handlePostJob}
              onUpdateCandidateStatus={handleUpdateCandidateStatus}
              onViewFeed={() => setActiveTab('home')}
            />
          )}

          {/* Role-Specific Bottom Navigation Bar */}
          {userRole === 'student' ? (
            <div className="bottom-nav">
              <button
                className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                <Home size={18} />
                <span>Home</span>
              </button>

              <button
                className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`}
                onClick={() => setActiveTab('applications')}
              >
                <ClipboardList size={18} />
                <span>Tracker</span>
                {applications.length > 0 && (
                  <span className="nav-badge" style={{ background: '#ffffff', color: '#000000' }}>
                    {applications.length}
                  </span>
                )}
              </button>

              <button
                className={`nav-item ${activeTab === 'saved' ? 'active' : ''}`}
                onClick={() => setActiveTab('saved')}
              >
                <Bookmark size={18} />
                <span>Saved</span>
                {savedJobIds.length > 0 && (
                  <span className="nav-badge" style={{ background: '#737373', color: '#ffffff' }}>
                    {savedJobIds.length}
                  </span>
                )}
              </button>

              <button
                className={`nav-item ${activeTab === 'resumes' ? 'active' : ''}`}
                onClick={() => setActiveTab('resumes')}
              >
                <Briefcase size={18} />
                <span>Resume</span>
              </button>

              <button
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} />
                <span>Profile</span>
              </button>
            </div>
          ) : (
            <div className="bottom-nav">
              <button
                className={`nav-item ${activeTab === 'recruiter' ? 'active' : ''}`}
                onClick={() => setActiveTab('recruiter')}
              >
                <Briefcase size={18} />
                <span>Dashboard</span>
              </button>

              <button
                className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                <Home size={18} />
                <span>Student Feed</span>
              </button>

              <button
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} />
                <span>Profile</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals & Bottom Sheets */}
      {selectedJobForDetails && (
        <JobDetailsModal
          job={selectedJobForDetails}
          onClose={() => setSelectedJobForDetails(null)}
          onOpenApply={(job) => {
            setSelectedJobForDetails(null);
            setSelectedJobForApply(job);
          }}
          isSaved={savedJobIds.includes(selectedJobForDetails.id)}
          onToggleSave={handleToggleSave}
          onOpenSalaryCalculator={handleOpenSalaryCalc}
          onOpenMockSimulator={handleOpenMockSimulator}
          onOpenSkillGap={handleOpenSkillGap}
        />
      )}

      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          resumes={resumes}
          onClose={() => setSelectedJobForApply(null)}
          onApplicationSubmitted={handleApplicationSubmitted}
        />
      )}

      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={fetchFilteredJobs}
        onResetFilters={handleResetFilters}
      />

      <NotificationsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotifsRead}
        onNotificationClick={(notif) => {
          if (notif.appId) {
            setActiveTab('applications');
          } else if (notif.jobId) {
            const j = jobs.find(job => job.id === notif.jobId);
            if (j) setSelectedJobForDetails(j);
          }
        }}
      />

      {/* Interactive Indian Salary & Tax Regime Calculator Modal */}
      <SalaryCalculatorModal
        isOpen={showSalaryCalculator}
        onClose={() => setShowSalaryCalculator(false)}
        initialCtc={selectedCtcForCalculator}
        jobs={jobs}
      />

      {/* AI Mock Interview Coach Simulator Modal */}
      <MockInterviewSimulatorModal
        isOpen={!!mockSimulatorJob}
        onClose={() => setMockSimulatorJob(null)}
        job={mockSimulatorJob}
      />

      {/* Skill Gap Radar & Upskilling Roadmap Modal */}
      <SkillGapModal
        isOpen={!!skillGapJob}
        onClose={() => setSkillGapJob(null)}
        job={skillGapJob}
        profile={profile}
        onSkillAdded={handleSkillAdded}
      />
    </PhoneSimulator>
  );
}
