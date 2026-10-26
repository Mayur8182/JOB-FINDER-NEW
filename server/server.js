import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Persistent storage path
const DATA_FILE = path.join(__dirname, 'store.json');

// Initial seed data
const initialJobs = [
  {
    id: "job-1",
    title: "Software Engineer - Frontend",
    company: "ABC Technologies",
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80",
    companyVerified: true,
    location: "Bangalore",
    workMode: "Hybrid",
    jobType: "Full Time",
    experience: "0–1 years",
    salary: "₹6–10 LPA",
    salaryMin: 6,
    salaryMax: 10,
    category: "Software Development",
    skills: ["React", "JavaScript", "TypeScript", "Tailwind CSS", "Redux"],
    description: "ABC Technologies is looking for a passionate Frontend Software Engineer to build high-performance web applications used by millions of global customers.",
    responsibilities: [
      "Develop responsive and dynamic web interfaces using React and modern CSS.",
      "Collaborate with UX designers, product managers, and backend engineers.",
      "Optimize web application performance for maximum speed and scalability.",
      "Write clean, maintainable, and well-tested code."
    ],
    requirements: [
      "B.Tech / B.E. / BCA / MCA in Computer Science or related branch.",
      "Strong understanding of JavaScript (ES6+), React hooks, and state management.",
      "Familiarity with REST APIs and modern frontend build tools."
    ],
    niceToHave: ["Experience with React Native or Next.js", "Contribution to Open Source projects"],
    benefits: ["Flexible work hours", "Comprehensive health insurance", "Learning stipend ₹25,000/yr", "Free catered lunches"],
    deadline: "2026-10-31",
    applicantsCount: 42,
    postedDate: "2026-10-01",
    featured: true
  },
  {
    id: "job-2",
    title: "Backend Developer Intern",
    company: "Razorpay",
    logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&auto=format&fit=crop&q=80",
    companyVerified: true,
    location: "Bangalore",
    workMode: "Remote",
    jobType: "Internship",
    experience: "Fresher",
    salary: "₹35,000 / month",
    salaryMin: 4,
    salaryMax: 4.5,
    category: "Backend",
    skills: ["Node.js", "Express", "MongoDB", "Redis", "REST API"],
    description: "Join the core payments infrastructure team at Razorpay to design reliable, distributed microservices handling millions of transactions every minute.",
    responsibilities: [
      "Build high-throughput API endpoints using Node.js and Express.",
      "Design database schemas in MongoDB and write efficient queries.",
      "Implement Redis caching to optimize response times below 50ms.",
      "Participate in code reviews and automated test pipeline integration."
    ],
    requirements: [
      "Currently pursuing B.Tech / BE or recent graduate (2025-2027 batch).",
      "Proficient in Node.js, Express, and asynchronous programming.",
      "Understanding of database fundamentals (SQL or NoSQL)."
    ],
    niceToHave: ["Familiarity with Docker and AWS", "Knowledge of Webhooks and Payment Gateways"],
    benefits: ["Full PPO opportunity based on internship performance", "Work-from-home allowance", "Mentorship from Principal Engineers"],
    deadline: "2026-10-25",
    applicantsCount: 128,
    postedDate: "2026-10-03",
    featured: true
  },
  {
    id: "job-3",
    title: "Mobile App Developer (React Native)",
    company: "Cred Innovations",
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80",
    companyVerified: true,
    location: "Mumbai",
    workMode: "On-site",
    jobType: "Full Time",
    experience: "1–3 years",
    salary: "₹12–18 LPA",
    salaryMin: 12,
    salaryMax: 18,
    category: "Mobile App",
    skills: ["React Native", "Expo", "TypeScript", "Redux Toolkit", "iOS", "Android"],
    description: "Create buttery-smooth native animations and delightful mobile UI experiences for India's premier financial app ecosystem.",
    responsibilities: [
      "Build fluid iOS and Android mobile features using React Native and Expo.",
      "Implement 60fps animations with Reanimated and Gesture Handler.",
      "Integrate native modules, push notification services, and biometric auth.",
      "Ensure robust offline-first functionality and fast startup times."
    ],
    requirements: [
      "1+ years of demonstrated hands-on React Native development.",
      "Deep understanding of native device APIs, state management, and debugging.",
      "Experience publishing apps to Google Play Store or Apple App Store."
    ],
    niceToHave: ["Knowledge of Swift or Kotlin bridge integrations", "Experience with fintech security practices"],
    benefits: ["Premium health cover for family", "ESOP equity grant", "Gym membership", "Annual gadget allowance"],
    deadline: "2026-11-15",
    applicantsCount: 65,
    postedDate: "2026-10-04",
    featured: true
  },
  {
    id: "job-4",
    title: "AI / ML Engineer Intern",
    company: "Glance AI Lab",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80",
    companyVerified: true,
    location: "Ahmedabad",
    workMode: "Hybrid",
    jobType: "Internship",
    experience: "Fresher",
    salary: "₹30,000 / month",
    salaryMin: 3.6,
    salaryMax: 4,
    category: "AI & Data Science",
    skills: ["Python", "PyTorch", "NLP", "LLMs", "FastAPI"],
    description: "Contribute to cutting-edge Generative AI workflows, fine-tuning open source LLMs, and deploying real-time AI microservices for smart mobile lockscreens.",
    responsibilities: [
      "Curate and preprocess multimodal datasets for fine-tuning transformer models.",
      "Evaluate model performance, latency, and token efficiency.",
      "Build lightweight REST microservices using FastAPI and Docker."
    ],
    requirements: [
      "Solid foundation in Linear Algebra, Probability, and Machine Learning.",
      "Hands-on experience with Python, PyTorch, Hugging Face transformers.",
      "Strong algorithmic problem-solving skills."
    ],
    niceToHave: ["Projects built with LangChain, LlamaIndex, or RAG architecture"],
    benefits: ["Direct mentorship by Senior AI Researchers", "High-performance GPU cloud access", "Conference travel sponsorship"],
    deadline: "2026-10-28",
    applicantsCount: 89,
    postedDate: "2026-10-05",
    featured: false
  },
  {
    id: "job-5",
    title: "Cloud & DevOps Engineer",
    company: "CloudScale Systems",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80",
    companyVerified: true,
    location: "Vadodara",
    workMode: "On-site",
    jobType: "Full Time",
    experience: "1–3 years",
    salary: "₹8–12 LPA",
    salaryMin: 8,
    salaryMax: 12,
    category: "DevOps",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux"],
    description: "Own our multi-region Kubernetes infrastructure, automate zero-downtime deployment pipelines, and elevate system reliability to 99.99%.",
    responsibilities: [
      "Provision and manage cloud infrastructure using Terraform on AWS.",
      "Maintain Dockerized Kubernetes clusters and Helm charts.",
      "Set up comprehensive monitoring dashboards using Prometheus and Grafana.",
      "Implement robust automated security and backup policies."
    ],
    requirements: [
      "Knowledge of AWS services (EC2, S3, RDS, EKS, CloudFront).",
      "Proficiency in Linux shell scripting and containerization.",
      "Experience with GitHub Actions or GitLab CI."
    ],
    niceToHave: ["AWS Certified Solutions Architect certification"],
    benefits: ["Hybrid flexibility after probation", "Annual bonus", "Relocation assistance"],
    deadline: "2026-11-05",
    applicantsCount: 31,
    postedDate: "2026-10-02",
    featured: false
  },
  {
    id: "job-6",
    title: "Product Design (UI/UX) Intern",
    company: "Zomato",
    logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&auto=format&fit=crop&q=80",
    companyVerified: true,
    location: "Remote",
    workMode: "Remote",
    jobType: "Internship",
    experience: "Fresher",
    salary: "₹28,000 / month",
    salaryMin: 3.3,
    salaryMax: 3.5,
    category: "UI/UX Design",
    skills: ["Figma", "User Research", "Wireframing", "Design Systems", "Prototyping"],
    description: "Design hyper-intuitive delivery tracking, interactive restaurant menus, and delight-driven micro-interactions for over 50 million active users.",
    responsibilities: [
      "Craft interactive mobile app wireframes and high-fidelity mockups in Figma.",
      "Conduct rapid usability testing with real users and synthesize actionable insights.",
      "Contribute components and design tokens to our unified Design System."
    ],
    requirements: [
      "A creative design portfolio demonstrating mobile UI/UX case studies.",
      "Mastery of Figma (auto-layout, components, interactive prototypes).",
      "Empathy for user pain points and clear visual communication skills."
    ],
    niceToHave: ["Basic understanding of HTML/CSS constraints in mobile apps"],
    benefits: ["Food coupons & Zomato Gold membership", "PPO consideration", "Remote setup budget"],
    deadline: "2026-10-22",
    applicantsCount: 154,
    postedDate: "2026-10-06",
    featured: true
  }
];

const initialProfile = {
  id: 'user-1',
  name: 'Mayur Bharvad',
  headline: 'Full Stack Developer & AI Enthusiast | B.Tech CSE',
  email: 'mayur.dev@example.com',
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
  bio: 'Passionate developer proficient in React, Node.js, and modern full-stack systems. Built several web applications and seeking high-impact software engineering roles.',
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
      description: 'Built responsive UI components in React and optimized backend API routes with Node.js.'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'AI Resume & ATS Matcher',
      tech: 'React, Node.js, OpenAI',
      description: 'Real-time resume parser scoring job match accuracy.'
    }
  ],
  savedJobIds: ['job-1', 'job-3'],
  completionPercent: 92
};

const initialResumes = [
  {
    id: "res-1",
    name: "Mayur_FullStack_Resume.pdf",
    title: "Full Stack Engineer Resume",
    fileSize: "1.1 MB",
    uploadedAt: "2026-10-18T10:00:00.000Z",
    isPrimary: true,
    atsScore: 88,
    parsedSkills: ["React", "JavaScript", "Node.js", "Express", "MongoDB", "TypeScript", "REST APIs"],
    downloadUrl: "#"
  }
];

const initialApplications = [
  {
    id: "app-101",
    jobId: "job-1",
    jobTitle: "Software Engineer - Frontend",
    company: "ABC Technologies",
    companyLogo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80",
    location: "Bangalore",
    salary: "₹6–10 LPA",
    applicantName: "Mayur Bharvad",
    applicantEmail: "mayur.dev@example.com",
    appliedDate: "2026-10-18T12:00:00.000Z",
    resumeUsed: "Mayur_FullStack_Resume.pdf",
    status: "Shortlisted",
    timeline: [
      { step: "Applied", title: "Application Submitted", date: "Oct 18, 2026", completed: true, note: "Resume submitted via portal" },
      { step: "Under Review", title: "Profile Evaluated", date: "Oct 19, 2026", completed: true, note: "Skills matched 92% with requirements" },
      { step: "Shortlisted", title: "Candidate Shortlisted", date: "Oct 20, 2026", completed: true, note: "Selected for technical interview round" },
      { step: "Assessment", title: "Coding Round", date: "Oct 24, 2026", completed: false, note: "Live React coding test" },
      { step: "Interview", title: "Technical Interview", date: "Pending", completed: false, note: "Virtual interview with Engineering Lead" },
      { step: "Offer", title: "Official Offer Letter", date: "Pending", completed: false, note: "Employment confirmation & compensation letter" }
    ]
  }
];

const initialNotifications = [
  {
    id: "notif-1",
    title: "Application Shortlisted! 🎉",
    message: "ABC Technologies has shortlisted your application for Software Engineer - Frontend.",
    time: "2 hours ago",
    read: false,
    type: "shortlist",
    jobId: "job-1",
    appId: "app-101"
  },
  {
    id: "notif-2",
    title: "Interview Scheduled 📅",
    message: "Razorpay scheduled your technical interview for Backend Intern on Oct 10, 2026 at 3:30 PM.",
    time: "1 day ago",
    read: false,
    type: "interview",
    jobId: "job-2",
    appId: "app-102"
  },
  {
    id: "notif-3",
    title: "New Job Matching Your Profile ✨",
    message: "Cred Innovations just posted 'Mobile App Developer (React Native)' matching 95% of your skills.",
    time: "2 days ago",
    read: true,
    type: "match",
    jobId: "job-3"
  },
  {
    id: "notif-4",
    title: "Application Deadline Tomorrow ⚠️",
    message: "Zomato UI/UX Design Intern applications close tomorrow. Apply before slots fill!",
    time: "3 days ago",
    read: true,
    type: "deadline",
    jobId: "job-6"
  }
];

const initialCandidates = [
  {
    id: "cand-1",
    name: "Mayur Bharvad",
    role: "Full Stack Engineer & AI Enthusiast",
    email: "mayur.dev@example.com",
    college: "National Institute of Technology",
    cgpa: "8.6",
    graduationYear: "2026",
    location: "Bangalore",
    workMode: "Hybrid / Remote",
    skills: ["React", "JavaScript", "TypeScript", "Node.js", "Express", "MongoDB", "Redux"],
    atsScore: 92,
    bio: "Passionate developer proficient in React, Node.js, and modern full-stack systems. Built several web applications and seeking high-impact software engineering roles.",
    availability: "Immediate / 2 Weeks"
  },
  {
    id: "cand-2",
    name: "Ananya Sharma",
    role: "Frontend Engineer & UI Architect",
    email: "ananya.sharma@example.com",
    college: "Birla Institute of Technology and Science (BITS)",
    cgpa: "9.1",
    graduationYear: "2026",
    location: "Bangalore",
    workMode: "Remote",
    skills: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Figma", "Redux Toolkit", "GraphQL"],
    atsScore: 95,
    bio: "Frontend specialist building pixel-perfect micro-interactions and accessible web applications.",
    availability: "Immediate"
  },
  {
    id: "cand-3",
    name: "Rohan Verma",
    role: "Backend & Distributed Systems Developer",
    email: "rohan.v@example.com",
    college: "IIT Roorkee",
    cgpa: "8.8",
    graduationYear: "2025",
    location: "Hyderabad",
    workMode: "On-site / Hybrid",
    skills: ["Node.js", "Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "REST API", "Kafka"],
    atsScore: 89,
    bio: "Backend developer specializing in high-throughput transactional APIs, caching systems, and database optimization.",
    availability: "1 Month"
  },
  {
    id: "cand-4",
    name: "Priya Patel",
    role: "AI / ML & NLP Research Engineer",
    email: "priya.ai@example.com",
    college: "IIIT Hyderabad",
    cgpa: "9.3",
    graduationYear: "2026",
    location: "Remote / Ahmedabad",
    workMode: "Remote",
    skills: ["Python", "PyTorch", "Hugging Face", "LLMs", "NLP", "FastAPI", "LangChain"],
    atsScore: 94,
    bio: "Published researcher in multimodal LLMs and RAG systems. Passionate about efficient transformer inference.",
    availability: "Immediate"
  },
  {
    id: "cand-5",
    name: "Siddharth Nair",
    role: "Cross-Platform Mobile Developer",
    email: "sid.nair@example.com",
    college: "VIT Vellore",
    cgpa: "8.4",
    graduationYear: "2025",
    location: "Mumbai",
    workMode: "Hybrid",
    skills: ["React Native", "Expo", "TypeScript", "iOS", "Android", "Redux", "GraphQL"],
    atsScore: 87,
    bio: "Shipped 4 production mobile apps to the Play Store and App Store with 60fps animations.",
    availability: "2 Weeks"
  },
  {
    id: "cand-6",
    name: "Tanvi Kulkarni",
    role: "Cloud & DevOps Engineer",
    email: "tanvi.k@example.com",
    college: "Pune Institute of Computer Technology",
    cgpa: "8.7",
    graduationYear: "2026",
    location: "Pune / Bangalore",
    workMode: "Hybrid",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "GitHub Actions"],
    atsScore: 91,
    bio: "DevOps practitioner passionate about immutable infrastructure as code and zero-downtime CI/CD workflows.",
    availability: "Immediate"
  }
];

// In-memory data store with disk persistence
let db = {
  jobs: initialJobs,
  profile: initialProfile,
  resumes: initialResumes,
  applications: initialApplications,
  notifications: initialNotifications,
  candidates: initialCandidates
};

// Load saved data if exists
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    db = JSON.parse(raw);
  } catch (err) {
    console.error("Error reading store.json, using default seed data", err);
  }
}

function persistDb() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error("Error persisting data:", err);
  }
}

// ---------------- API ROUTES ----------------

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', service: 'Job/Internship Portal API v1', time: new Date().toISOString() });
});

// Authentication
app.post('/api/v1/auth/login', (req, res) => {
  const { identifier, password, role = 'student' } = req.body;
  // Demo mock authentication
  res.json({
    success: true,
    token: "mock-jwt-token-" + Date.now(),
    user: {
      id: role === 'recruiter' ? 'rec-1' : db.profile.id,
      name: role === 'recruiter' ? 'Sarah Jenkins (ABC Tech Recruiter)' : db.profile.name,
      email: identifier || (role === 'recruiter' ? 'recruiter@abctech.com' : db.profile.email),
      role: role
    }
  });
});

app.post('/api/v1/auth/register', (req, res) => {
  const { name, email, phone, role = 'student' } = req.body;
  const user = {
    id: "user-" + Date.now(),
    name: name || db.profile.name || "Job Seeker",
    email: email || "seeker@example.com",
    phone: phone || "",
    role: role
  };
  res.json({
    success: true,
    message: "Registration successful! Welcome to Job Finder.",
    token: "mock-jwt-token-" + Date.now(),
    user
  });
});

app.post('/api/v1/auth/verify-otp', (req, res) => {
  const { email, otp, role = 'student' } = req.body;
  if (otp === "1234" || otp?.length === 4) {
    res.json({
      success: true,
      token: "mock-jwt-token-" + Date.now(),
      user: {
        id: "user-" + Date.now(),
        name: db.profile.name,
        email: email || db.profile.email,
        role: role
      }
    });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP. Use demo OTP: 1234" });
  }
});

// Profile
app.get('/api/v1/profile', (req, res) => {
  res.json({ success: true, profile: db.profile });
});

app.put('/api/v1/profile', (req, res) => {
  db.profile = { ...db.profile, ...req.body };

  // Recalculate genuine profile completion score based on actual data
  let score = 0;
  const p = db.profile;
  if (p.name?.trim()) score += 15;
  if (p.headline?.trim()) score += 10;
  if (p.email?.trim() && p.phone?.trim()) score += 15;
  if (p.college?.trim() && p.degree?.trim()) score += 15;
  if (p.skills && p.skills.length >= 3) score += 15;
  else if (p.skills && p.skills.length > 0) score += 5;
  if (p.education && p.education.length > 0) score += 10;
  if (p.experience && p.experience.length > 0) score += 10;
  if (p.preferredLocation?.trim() || p.expectedSalary?.trim()) score += 10;
  db.profile.completionPercent = Math.min(100, score);

  persistDb();
  res.json({ success: true, profile: db.profile });
});

// Resumes
app.get('/api/v1/resumes', (req, res) => {
  res.json({ success: true, resumes: db.resumes });
});

app.post('/api/v1/resumes/upload', (req, res) => {
  const { fileName, title, skills } = req.body;
  const newResume = {
    id: "res-" + Date.now(),
    name: fileName || "My_Uploaded_Resume.pdf",
    title: title || "Software Engineer Resume",
    fileSize: "1.1 MB",
    uploadedAt: new Date().toISOString(),
    isPrimary: db.resumes.length === 0,
    atsScore: Math.floor(Math.random() * 15) + 82, // realistic 82-97
    parsedSkills: skills || ["React", "JavaScript", "HTML/CSS", "Git", "Problem Solving"],
    downloadUrl: "#"
  };
  db.resumes.unshift(newResume);
  persistDb();
  res.json({ success: true, resume: newResume });
});

app.post('/api/v1/resumes/build', (req, res) => {
  const { title, summary, skills, education, experience, projects } = req.body;
  const builtResume = {
    id: "res-" + Date.now(),
    name: `${title.replace(/\s+/g, '_')}_Resume.pdf`,
    title: title,
    fileSize: "850 KB",
    uploadedAt: new Date().toISOString(),
    isPrimary: true,
    atsScore: 92,
    parsedSkills: skills || ["React", "Node.js", "Express", "MongoDB"],
    details: { summary, education, experience, projects },
    downloadUrl: "#"
  };
  // unmark other primaries
  db.resumes.forEach(r => r.isPrimary = false);
  db.resumes.unshift(builtResume);
  persistDb();
  res.json({ success: true, resume: builtResume });
});

app.delete('/api/v1/resumes/:id', (req, res) => {
  db.resumes = db.resumes.filter(r => r.id !== req.params.id);
  persistDb();
  res.json({ success: true, message: "Resume deleted" });
});

// Jobs
app.get('/api/v1/jobs', (req, res) => {
  const { q, type, experience, location, workMode, salaryMin } = req.query;
  let results = [...db.jobs];

  if (q) {
    const term = q.toLowerCase();
    results = results.filter(j => 
      j.title.toLowerCase().includes(term) ||
      j.company.toLowerCase().includes(term) ||
      j.skills.some(s => s.toLowerCase().includes(term)) ||
      j.location.toLowerCase().includes(term)
    );
  }

  if (type && type !== 'All') {
    results = results.filter(j => j.jobType.toLowerCase() === type.toLowerCase());
  }

  if (experience && experience !== 'All') {
    results = results.filter(j => j.experience.toLowerCase().includes(experience.toLowerCase()));
  }

  if (location && location !== 'All') {
    results = results.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
  }

  if (workMode && workMode !== 'All') {
    results = results.filter(j => j.workMode.toLowerCase() === workMode.toLowerCase());
  }

  if (salaryMin) {
    const minVal = parseFloat(salaryMin);
    results = results.filter(j => j.salaryMax >= minVal);
  }

  res.json({ success: true, count: results.length, jobs: results });
});

app.get('/api/v1/jobs/:id', (req, res) => {
  const job = db.jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ success: false, message: "Job not found" });
  res.json({ success: true, job });
});

// Recruiter creates a new job
app.post('/api/v1/jobs', (req, res) => {
  const newJob = {
    id: "job-" + Date.now(),
    ...req.body,
    companyVerified: true,
    applicantsCount: 0,
    postedDate: new Date().toISOString().split('T')[0],
    featured: false
  };
  db.jobs.unshift(newJob);

  // Trigger notification for job seeker
  db.notifications.unshift({
    id: "notif-" + Date.now(),
    title: `New Job Posted: ${newJob.title}`,
    message: `${newJob.company} has just opened applications for ${newJob.title} in ${newJob.location}.`,
    time: "Just now",
    read: false,
    type: "match",
    jobId: newJob.id
  });

  persistDb();
  res.status(201).json({ success: true, job: newJob });
});

// Applications
app.get('/api/v1/applications', (req, res) => {
  res.json({ success: true, applications: db.applications });
});

app.get('/api/v1/applications/:id', (req, res) => {
  const appItem = db.applications.find(a => a.id === req.params.id);
  if (!appItem) return res.status(404).json({ success: false, message: "Application not found" });
  res.json({ success: true, application: appItem });
});

// Student applies to a job
app.post('/api/v1/jobs/:id/apply', (req, res) => {
  const job = db.jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ success: false, message: "Job not found" });

  const existing = db.applications.find(a => a.jobId === job.id);
  if (existing) {
    return res.status(400).json({ success: false, message: "You have already applied to this position!" });
  }

  const { resumeName, coverPitch, answers } = req.body;
  const newApplication = {
    id: "app-" + Date.now(),
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    companyLogo: job.logo,
    location: job.location,
    salary: job.salary,
    workMode: job.workMode,
    appliedDate: new Date().toISOString(),
    resumeUsed: resumeName || (db.resumes[0]?.name || "Default_Resume.pdf"),
    coverPitch: coverPitch || "",
    answers: answers || {},
    status: "Applied",
    timeline: [
      { step: "Applied", title: "Application Submitted", date: new Date().toLocaleString(), completed: true, note: "Application successfully submitted with resume and candidate profile." },
      { step: "Under Review", title: "Profile Under Review", date: "Pending", completed: false, note: "Recruiter will evaluate your profile and qualifications." },
      { step: "Shortlisted", title: "Candidate Shortlisted", date: "Pending", completed: false, note: "If qualified, you will be shortlisted for subsequent rounds." },
      { step: "Assessment", title: "Skill / Coding Assessment", date: "Pending", completed: false, note: "Online evaluation test or portfolio review." },
      { step: "Interview", title: "Interview Round", date: "Pending", completed: false, note: "Technical or HR interview discussion." },
      { step: "Offer", title: "Offer Letter", date: "Pending", completed: false, note: "Final selection and offer release." }
    ]
  };

  db.applications.unshift(newApplication);
  job.applicantsCount = (job.applicantsCount || 0) + 1;

  // Add notification
  db.notifications.unshift({
    id: "notif-" + Date.now(),
    title: "Application Received ✓",
    message: `Your application for ${job.title} at ${job.company} has been received.`,
    time: "Just now",
    read: false,
    type: "applied",
    jobId: job.id,
    appId: newApplication.id
  });

  persistDb();
  res.status(201).json({ success: true, application: newApplication });
});

// Recruiter updates status of an application
app.patch('/api/v1/applications/:id/status', (req, res) => {
  const { status, note, interviewDetails } = req.body;
  const appItem = db.applications.find(a => a.id === req.params.id);
  if (!appItem) return res.status(404).json({ success: false, message: "Application not found" });

  appItem.status = status;
  const nowStr = new Date().toLocaleString();

  if (status === 'Rejected') {
    appItem.rejectionReason = note || 'Profile not aligned with current requirements';
    appItem.timeline = [
      ...appItem.timeline.filter(t => t.completed),
      {
        step: 'Rejected',
        title: 'Application Not Moving Forward',
        date: nowStr,
        completed: true,
        note: note || 'Thank you for your interest. We encourage you to apply for other matching openings.'
      }
    ];

    db.notifications.unshift({
      id: "notif-" + Date.now(),
      title: "Application Status Update",
      message: `${appItem.company} has updated your application for ${appItem.jobTitle}: Not moving forward at this time.`,
      time: "Just now",
      read: false,
      type: "status",
      appId: appItem.id
    });
  } else {
    if (status === 'Interview' && interviewDetails) {
      appItem.interviewDetails = interviewDetails;
    }

    // Update timeline
    const stages = ["Applied", "Under Review", "Shortlisted", "Assessment", "Interview", "Offer"];
    const currentStageIndex = stages.indexOf(status);

    if (currentStageIndex !== -1) {
      appItem.timeline.forEach((step, idx) => {
        if (idx <= currentStageIndex) {
          step.completed = true;
          if (step.date === "Pending") step.date = nowStr;
        } else {
          step.completed = false;
        }
        if (step.step === status && note) {
          step.note = note;
        }
      });
    }

    let notifTitle = `Status Update: ${status} ⚡`;
    let notifMsg = `${appItem.company} updated your application status for ${appItem.jobTitle} to "${status}".`;

    if (status === 'Interview') {
      notifTitle = "Technical Interview Scheduled! 📅";
      notifMsg = `${appItem.company} scheduled your Technical Interview for ${interviewDetails?.interviewTime || "Tomorrow at 4:00 PM IST"}. Join link is in Tracker.`;
    } else if (status === 'Offer') {
      notifTitle = "Official Offer Letter Issued! 📄";
      notifMsg = `${appItem.company} has issued your official employment offer letter. Check your Tracker tab.`;
    }

    db.notifications.unshift({
      id: "notif-" + Date.now(),
      title: notifTitle,
      message: notifMsg,
      time: "Just now",
      read: false,
      type: status.toLowerCase(),
      appId: appItem.id
    });
  }

  persistDb();
  res.json({ success: true, application: appItem });
});

// Withdraw application
app.delete('/api/v1/applications/:id', (req, res) => {
  db.applications = db.applications.filter(a => a.id !== req.params.id);
  persistDb();
  res.json({ success: true, message: "Application withdrawn successfully." });
});

// Saved Jobs
app.get('/api/v1/saved-jobs', (req, res) => {
  const savedJobs = db.jobs.filter(j => db.profile.savedJobIds?.includes(j.id));
  res.json({ success: true, savedJobIds: db.profile.savedJobIds || [], savedJobs });
});

app.post('/api/v1/saved-jobs/toggle', (req, res) => {
  const { jobId } = req.body;
  if (!db.profile.savedJobIds) db.profile.savedJobIds = [];

  const index = db.profile.savedJobIds.indexOf(jobId);
  let isSaved = false;

  if (index > -1) {
    db.profile.savedJobIds.splice(index, 1);
    isSaved = false;
  } else {
    db.profile.savedJobIds.push(jobId);
    isSaved = true;
  }

  persistDb();
  res.json({ success: true, isSaved, savedJobIds: db.profile.savedJobIds });
});

// Notifications
app.get('/api/v1/notifications', (req, res) => {
  res.json({ success: true, notifications: db.notifications });
});

app.post('/api/v1/notifications/mark-read', (req, res) => {
  const { id } = req.body;
  if (id) {
    const notif = db.notifications.find(n => n.id === id);
    if (notif) notif.read = true;
  } else {
    db.notifications.forEach(n => n.read = true);
  }
  persistDb();
  res.json({ success: true, notifications: db.notifications });
});

// Candidates (Recruiter Talent Pool)
app.get('/api/v1/candidates', (req, res) => {
  const { q, skill, location, workMode } = req.query;
  let results = db.candidates || initialCandidates;

  if (q) {
    const term = q.toLowerCase();
    results = results.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.role.toLowerCase().includes(term) ||
      c.college.toLowerCase().includes(term) ||
      c.skills.some(s => s.toLowerCase().includes(term))
    );
  }

  if (skill && skill !== 'All') {
    results = results.filter(c => c.skills.some(s => s.toLowerCase() === skill.toLowerCase()));
  }

  if (location && location !== 'All') {
    results = results.filter(c => c.location.toLowerCase().includes(location.toLowerCase()));
  }

  if (workMode && workMode !== 'All') {
    results = results.filter(c => c.workMode.toLowerCase().includes(workMode.toLowerCase()));
  }

  res.json({ success: true, count: results.length, candidates: results });
});

// Recruiter sends direct fast-track invite to candidate
app.post('/api/v1/candidates/:id/invite', (req, res) => {
  const candidate = (db.candidates || initialCandidates).find(c => c.id === req.params.id);
  if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });

  const { jobId, jobTitle, company, note } = req.body;
  const newNotif = {
    id: "notif-" + Date.now(),
    title: `Fast-Track Invite from ${company || "Top Employer"}! ⚡`,
    message: `${company || "HR Team"} has reviewed your profile and invited you for "${jobTitle || "Engineering Role"}". Note: ${note || "Your verified skills are an ideal match!"}`,
    time: "Just now",
    read: false,
    type: "invite",
    jobId: jobId || "job-1"
  };

  db.notifications.unshift(newNotif);
  persistDb();

  res.json({
    success: true,
    message: `Fast-track invitation successfully dispatched to ${candidate.name}!`,
    notification: newNotif
  });
});

// Interactive Indian Salary & In-Hand Tax Calculator (Old vs New Regime FY 2026-27)
app.post('/api/v1/salary/calculate', (req, res) => {
  const {
    ctcLpa = 12,
    regime = 'new',
    metroCity = true,
    customDeductions = {}
  } = req.body;

  const annualCTC = parseFloat(ctcLpa) * 100000;
  const basic = Math.round(annualCTC * 0.45);
  const hra = Math.round(metroCity ? basic * 0.50 : basic * 0.40);
  const employerPF = Math.min(21600, Math.round(basic * 0.12));
  const employeePF = employerPF;
  const gratuity = Math.round(basic * 0.0481);
  const specialAllowance = Math.max(0, annualCTC - basic - hra - employerPF - gratuity);
  const grossEarnings = basic + hra + specialAllowance;
  const professionalTax = 2400; // standard ₹200/month

  // Tax computation
  let annualTax = 0;
  let standardDeduction = 0;

  if (regime === 'new') {
    standardDeduction = 75000;
    const taxableIncome = Math.max(0, grossEarnings - standardDeduction);

    if (taxableIncome <= 700000) {
      annualTax = 0; // Section 87A rebate
    } else {
      let remaining = taxableIncome;
      // 0 - 3L: 0%
      remaining = Math.max(0, remaining - 300000);

      // 3L - 7L (4L @ 5%)
      const slab1 = Math.min(remaining, 400000);
      annualTax += slab1 * 0.05;
      remaining = Math.max(0, remaining - slab1);

      // 7L - 10L (3L @ 10%)
      const slab2 = Math.min(remaining, 300000);
      annualTax += slab2 * 0.10;
      remaining = Math.max(0, remaining - slab2);

      // 10L - 12L (2L @ 15%)
      const slab3 = Math.min(remaining, 200000);
      annualTax += slab3 * 0.15;
      remaining = Math.max(0, remaining - slab3);

      // 12L - 15L (3L @ 20%)
      const slab4 = Math.min(remaining, 300000);
      annualTax += slab4 * 0.20;
      remaining = Math.max(0, remaining - slab4);

      // Above 15L @ 30%
      if (remaining > 0) {
        annualTax += remaining * 0.30;
      }
    }
  } else {
    // Old Regime
    standardDeduction = 50000;
    const ded80C = Math.min(150000, (customDeductions.ded80C || 150000));
    const ded80D = Math.min(25000, (customDeductions.ded80D || 25000));
    const hraExempt = Math.min(hra, basic * 0.50);
    const taxableIncome = Math.max(0, grossEarnings - standardDeduction - ded80C - ded80D - hraExempt);

    if (taxableIncome <= 500000) {
      annualTax = 0;
    } else {
      let remaining = taxableIncome;
      remaining = Math.max(0, remaining - 250000);

      const slab1 = Math.min(remaining, 250000);
      annualTax += slab1 * 0.05;
      remaining = Math.max(0, remaining - slab1);

      const slab2 = Math.min(remaining, 500000);
      annualTax += slab2 * 0.20;
      remaining = Math.max(0, remaining - slab2);

      if (remaining > 0) {
        annualTax += remaining * 0.30;
      }
    }
  }

  // 4% Health & Education Cess
  annualTax = Math.round(annualTax * 1.04);

  const annualInHand = Math.max(0, grossEarnings - employeePF - professionalTax - annualTax);
  const monthlyInHand = Math.round(annualInHand / 12);
  const monthlyGross = Math.round(grossEarnings / 12);
  const monthlyPF = Math.round(employeePF / 12);
  const monthlyTax = Math.round(annualTax / 12);
  const monthlyPT = Math.round(professionalTax / 12);

  res.json({
    success: true,
    calculation: {
      ctcLpa,
      regime,
      annualCTC,
      monthlyGross,
      monthlyInHand,
      monthlyDeductions: {
        pf: monthlyPF,
        tax: monthlyTax,
        professionalTax: monthlyPT,
        total: monthlyPF + monthlyTax + monthlyPT
      },
      annualBreakdown: {
        basic,
        hra,
        specialAllowance,
        gratuity,
        employerPF,
        employeePF,
        professionalTax,
        annualTax,
        standardDeduction,
        annualInHand
      }
    }
  });
});

// AI Mock Interview Answer Evaluator
app.post('/api/v1/mock-interview/evaluate', (req, res) => {
  const { question, role, answer = "", category = "Technical" } = req.body;
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  if (wordCount < 10) {
    return res.status(400).json({
      success: false,
      message: "Please provide a more comprehensive answer (at least 15 words) for realistic AI evaluation."
    });
  }

  // Detect key engineering concepts
  const technicalKeywords = [
    "state", "props", "hook", "useeffect", "usememo", "virtual dom", "reconciliation",
    "component", "performance", "cache", "redis", "mongodb", "postgresql", "indexing",
    "concurrency", "asynchronous", "event loop", "microservice", "scalability", "docker",
    "kubernetes", "distributed", "api", "rest", "graphql", "authentication", "jwt",
    "security", "test", "ci/cd", "star", "trade-off", "complexity", "o(n)", "latency"
  ];

  const lowerAnswer = answer.toLowerCase();
  const detectedKeywords = technicalKeywords.filter(kw => lowerAnswer.includes(kw));

  // STAR framework heuristics
  const starIndicators = {
    situation: /when|situation|project|client|company|system was|context/i.test(answer),
    task: /goal|task|challenge|requirement|needed to|objective/i.test(answer),
    action: /implemented|built|designed|refactored|used|developed|optimized|configured/i.test(answer),
    result: /resulted|improved|reduced|increased|latency|achieved|outcome|delivered|impact/i.test(answer)
  };

  const starCount = Object.values(starIndicators).filter(Boolean).length;

  // Calculate scores
  let baseScore = Math.min(94, 60 + Math.min(20, Math.floor(wordCount / 6)));
  if (detectedKeywords.length >= 4) baseScore += 10;
  else if (detectedKeywords.length >= 2) baseScore += 5;
  if (starCount >= 3) baseScore += 8;

  const overallScore = Math.min(98, Math.max(68, baseScore));
  const technicalScore = Math.min(99, Math.max(70, 72 + detectedKeywords.length * 5));
  const starScore = Math.min(98, Math.max(65, 60 + starCount * 9));
  const clarityScore = Math.min(96, Math.max(72, wordCount > 40 && wordCount < 200 ? 92 : 78));

  // Strengths
  const strengths = [];
  if (detectedKeywords.length > 0) {
    strengths.push(`Strong domain terminology: accurately integrated ${detectedKeywords.slice(0, 3).join(', ')}.`);
  }
  if (starIndicators.action) {
    strengths.push("Direct engineering agency: clearly conveyed the actions and solutions you spearheaded.");
  }
  if (wordCount >= 40) {
    strengths.push("Thorough technical depth with structured context and reasoning.");
  } else {
    strengths.push("Concise and directly answered the primary premise of the question.");
  }

  // Constructive improvements
  const improvements = [];
  if (!starIndicators.result) {
    improvements.push("Quantify your business impact or metrics (e.g., 'reduced API latency by 35%' or 'served 10k daily users').");
  }
  if (detectedKeywords.length < 3) {
    improvements.push("Mention trade-offs and alternative architectures you considered before settling on this solution.");
  }
  if (wordCount < 40) {
    improvements.push("Elaborate on edge cases, error handling, or failure modes in production.");
  }

  // Recommended Model Answer
  const modelAnswer = `In my previous project building a high-traffic microservices backend, we faced an issue where database reads were bottlenecking request response times to ~350ms during peak loads. I implemented a write-through Redis caching layer with optimistic concurrency control in Node.js and indexed composite keys in PostgreSQL. Furthermore, I handled cache invalidation using Redis pub/sub. As a measurable result, 95th-percentile response latency dropped from 350ms to under 42ms, and DB connection load decreased by 70%.`;

  res.json({
    success: true,
    evaluation: {
      overallScore,
      technicalScore,
      starScore,
      clarityScore,
      rating: overallScore >= 90 ? "Senior / Exceptional ⭐" : overallScore >= 80 ? "Proficient & Hire Ready ✓" : "Promising — Polish Metrics 💡",
      strengths,
      improvements,
      detectedKeywords,
      suggestedKeywords: ["concurrency", "time complexity", "trade-offs", "monitoring", "scalability"].filter(k => !detectedKeywords.includes(k)),
      starBreakdown: starIndicators,
      modelAnswer
    }
  });
});

// Profile - 1-Click Skill Gap Addition & Upgrading
app.post('/api/v1/profile/skills/add', (req, res) => {
  const { skill } = req.body;
  if (!skill) return res.status(400).json({ success: false, message: "Skill name is required" });

  if (!db.profile.skills) db.profile.skills = [];
  if (!db.profile.skills.includes(skill)) {
    db.profile.skills.push(skill);
  }

  // Recalculate score
  let score = 0;
  const p = db.profile;
  if (p.name?.trim()) score += 15;
  if (p.headline?.trim()) score += 10;
  if (p.email?.trim() && p.phone?.trim()) score += 15;
  if (p.college?.trim() && p.degree?.trim()) score += 15;
  if (p.skills && p.skills.length >= 6) score += 20;
  else if (p.skills && p.skills.length >= 3) score += 15;
  else if (p.skills && p.skills.length > 0) score += 5;
  if (p.education && p.education.length > 0) score += 10;
  if (p.experience && p.experience.length > 0) score += 10;
  if (p.preferredLocation?.trim() || p.expectedSalary?.trim()) score += 5;
  db.profile.completionPercent = Math.min(100, score);

  persistDb();
  res.json({ success: true, profile: db.profile, addedSkill: skill });
});

app.listen(PORT, () => {
  console.log(`Job & Internship Portal API server running on http://localhost:${PORT}`);
});
