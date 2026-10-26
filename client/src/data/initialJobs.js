export const initialJobs = [
  {
    id: "job-1",
    title: "Full Stack Node.js Engineer",
    company: "ABC Technologies",
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80",
    companyVerified: true,
    trustBadge: "Direct Recruiter Posting • Verified",
    location: "Bangalore",
    workMode: "Hybrid",
    jobType: "Full Time",
    experience: "0–1 years",
    salary: "₹8–12 LPA",
    salaryMin: 8,
    salaryMax: 12,
    inHandEstimate: "₹58,000 – ₹78,000 / month",
    category: "Software Development",
    skills: ["Node.js", "Express", "React", "MongoDB", "AWS", "REST APIs"],
    description: "ABC Technologies is expanding its core platform engineering team. Build scalable RESTful backend services and intuitive frontend features serving enterprise clients.",
    responsibilities: [
      "Design and maintain scalable Node.js microservices and REST APIs.",
      "Develop responsive UI components in React and modern CSS.",
      "Optimize MongoDB query performance and write unit tests.",
      "Collaborate in daily agile standups and sprint planning."
    ],
    requirements: [
      "B.Tech / B.E. / BCA / MCA in Computer Science or related field (2024–2026 batch).",
      "Proficient in JavaScript (ES6+), Node.js, Express, and React.",
      "Good understanding of relational or NoSQL database concepts."
    ],
    niceToHave: ["Familiarity with AWS, Docker, or Redis"],
    benefits: ["Hybrid work flexibility", "Medical insurance for self & family", "Annual learning stipend ₹25,000", "Free catered lunches"],
    deadline: "2026-11-20",
    applicantsCount: 38,
    postedDate: "2026-10-18",
    featured: true,
    interviewPrep: {
      technicalQuestions: [
        { q: "How does the Node.js event loop handle asynchronous I/O operations?", a: "Node uses libuv's thread pool and an event loop with distinct phases (timers, I/O callbacks, idle/prepare, poll, check, close callbacks) to handle non-blocking asynchronous calls without blocking the main JavaScript execution thread." },
        { q: "What is the difference between MongoDB findOneAndUpdate vs updateOne?", a: "findOneAndUpdate returns the document (either original or updated depending on {new: true}), whereas updateOne only returns an acknowledgment with matchedCount and modifiedCount." },
        { q: "How do you prevent memory leaks in Node.js Express servers?", a: "Avoid unclosed database connections, remove lingering event listeners (emitter.removeListener), avoid global variables caching request objects, and use heap profilers to inspect retainers." }
      ],
      topics: ["Event Loop & Streams", "Mongoose Aggregations", "JWT Auth & Middleware", "React Hooks Lifecycle"]
    }
  },
  {
    id: "job-2",
    title: "Backend Developer Intern",
    company: "Razorpay",
    logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&auto=format&fit=crop&q=80",
    companyVerified: true,
    trustBadge: "Top Fintech Unicorn • 100% Verified",
    location: "Bangalore",
    workMode: "Remote",
    jobType: "Internship",
    experience: "Fresher",
    salary: "₹40,000 / month",
    salaryMin: 4.8,
    salaryMax: 5.2,
    inHandEstimate: "₹40,000 / month (Full Stipend)",
    category: "Backend",
    skills: ["Node.js", "Express", "MongoDB", "Redis", "REST APIs", "Go"],
    description: "Join the core payments routing team at Razorpay. Build high-throughput microservices handling billions in payments transactions every month with sub-50ms latency.",
    responsibilities: [
      "Build high-throughput API endpoints using Node.js and Express.",
      "Design database schemas in MongoDB and write optimized queries.",
      "Implement Redis caching to optimize response times below 50ms.",
      "Participate in code reviews and automated CI/CD pipeline integration."
    ],
    requirements: [
      "Currently pursuing B.Tech / BE or recent graduate (2025–2027 batch).",
      "Strong coding foundation in Node.js, Express, and asynchronous programming.",
      "Understanding of database indexing, ACID properties, and REST protocols."
    ],
    niceToHave: ["Experience with Docker, Redis, or Payment Gateway APIs"],
    benefits: ["Full PPO opportunity based on internship performance", "Home office setup reimbursement", "Mentorship from Principal Architects"],
    deadline: "2026-11-15",
    applicantsCount: 142,
    postedDate: "2026-10-15",
    featured: true,
    interviewPrep: {
      technicalQuestions: [
        { q: "How do you handle idempotency in payment APIs?", a: "By generating a unique Idempotency-Key per transaction request and storing it in Redis. If a duplicate request arrives with the same key, return the cached previous response instead of re-charging." },
        { q: "Explain Redis caching strategies: Cache-Aside vs Write-Through.", a: "Cache-Aside queries cache first; if a miss occurs, loads from DB and stores in cache. Write-Through updates cache and database synchronously on write." }
      ],
      topics: ["Idempotent API Design", "Redis Distributed Locks", "Database Transactions & ACID", "System Scalability"]
    }
  },
  {
    id: "job-3",
    title: "Mobile App Engineer (React Native)",
    company: "CRED",
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80",
    companyVerified: true,
    trustBadge: "Top Fintech App • 100% Verified",
    location: "Bangalore",
    workMode: "On-site",
    jobType: "Full Time",
    experience: "0–2 years",
    salary: "₹14–20 LPA",
    salaryMin: 14,
    salaryMax: 20,
    inHandEstimate: "₹95,000 – ₹1,35,000 / month",
    category: "Mobile App",
    skills: ["React Native", "Expo", "TypeScript", "Redux Toolkit", "Reanimated"],
    description: "Create buttery-smooth 60fps native animations and delightful mobile UI experiences for India's premier high-trust financial app ecosystem.",
    responsibilities: [
      "Build fluid iOS and Android mobile features using React Native and Expo.",
      "Implement physics-based micro-animations with React Native Reanimated.",
      "Integrate native biometric auth, push notifications, and secure keychain storage.",
      "Optimize app bundle size and cold startup benchmarks."
    ],
    requirements: [
      "0–2 years of hands-on React Native development or exceptional college projects.",
      "Strong command of TypeScript, React hooks, and state management.",
      "Understanding of mobile UI performance profiling and memory management."
    ],
    niceToHave: ["Experience with native Swift/Kotlin bridging or Skia graphics"],
    benefits: ["Comprehensive health cover for family", "Generous ESOP grant", "Annual gadget and book allowance", "Gourmet cafeteria"],
    deadline: "2026-11-25",
    applicantsCount: 88,
    postedDate: "2026-10-16",
    featured: true,
    interviewPrep: {
      technicalQuestions: [
        { q: "How does the React Native New Architecture (Fabric & TurboModules) improve performance?", a: "Fabric replaces the asynchronous serialized JSON bridge with JSI (JavaScript Interface), allowing direct synchronous C++ method invocations and concurrent rendering." },
        { q: "How do you ensure 60fps animations in React Native?", a: "Use Reanimated 2/3 which runs animation logic directly on the UI native thread using worklets, avoiding bridge serialization overhead." }
      ],
      topics: ["JSI & New Architecture", "Reanimated Worklets", "FlatList Memory Optimization", "App Bundle Optimization"]
    }
  },
  {
    id: "job-4",
    title: "Associate Software Engineer",
    company: "Google India",
    logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=128&auto=format&fit=crop&q=80",
    companyVerified: true,
    trustBadge: "MNC Tech Leader • 100% Verified Direct",
    location: "Bangalore / Hyderabad",
    workMode: "Hybrid",
    jobType: "Full Time",
    experience: "Fresher",
    salary: "₹18–26 LPA",
    salaryMin: 18,
    salaryMax: 26,
    inHandEstimate: "₹1,20,000 – ₹1,65,000 / month",
    category: "Software Development",
    skills: ["JavaScript", "TypeScript", "C++", "Data Structures", "Algorithms", "React"],
    description: "Work on Google's globally accessible products touching billions of users daily. Solve complex algorithmic challenges and engineer high-reliability web and cloud systems.",
    responsibilities: [
      "Write clean, robust, and well-tested code for core Google applications.",
      "Collaborate with distributed global engineering teams across continents.",
      "Design fault-tolerant architectures capable of handling planetary scale.",
      "Participate in technical design discussions and automated code testing."
    ],
    requirements: [
      "B.Tech / B.E. / M.Tech in Computer Science or related degree (2025–2026 batch).",
      "Strong foundation in Data Structures, Algorithms, and System fundamentals.",
      "Proficiency in at least one modern programming language (TypeScript, C++, Java, Python)."
    ],
    niceToHave: ["Competitive programming rating or open source contributions"],
    benefits: ["World-class healthcare & wellness", "Generous Google stock units (GSUs)", "Free gourmet dining & micro-kitchens", "Global relocation support"],
    deadline: "2026-11-30",
    applicantsCount: 320,
    postedDate: "2026-10-17",
    featured: true,
    interviewPrep: {
      technicalQuestions: [
        { q: "How do you design an LRU (Least Recently Used) Cache with O(1) operations?", a: "Use a Hash Map combined with a Doubly Linked List. The hash map provides O(1) key lookup to the node, and the doubly linked list allows O(1) removal and insertion at the head." },
        { q: "Explain the difference between TCP and UDP with real-world examples.", a: "TCP is connection-oriented, ordered, and reliable with error checking (used in HTTP/Web). UDP is connectionless, fast, without retransmission (used in video streaming/gaming)." }
      ],
      topics: ["Graphs, Trees & Dynamic Programming", "Object Oriented Design", "Concurrency & Threading", "System Complexity Analysis"]
    }
  },
  {
    id: "job-5",
    title: "Full Stack Engineer (MERN)",
    company: "Swiggy",
    logo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=128&auto=format&fit=crop&q=80",
    companyVerified: true,
    trustBadge: "Top Consumer Tech • 100% Verified",
    location: "Bangalore",
    workMode: "Hybrid",
    jobType: "Full Time",
    experience: "0–2 years",
    salary: "₹12–16 LPA",
    salaryMin: 12,
    salaryMax: 16,
    inHandEstimate: "₹82,000 – ₹1,08,000 / month",
    category: "Full Stack",
    skills: ["React", "Node.js", "Express", "MongoDB", "PostgreSQL", "Kafka"],
    description: "Scale high-velocity food delivery ordering systems, partner dashboards, and real-time delivery tracking portals with modern web scale architecture.",
    responsibilities: [
      "Develop end-to-end features across React web portals and Node.js microservices.",
      "Design resilient order checkout and real-time live order tracking APIs.",
      "Optimize database queries and streaming pipelines using Kafka."
    ],
    requirements: [
      "Hands-on proficiency in React, Node.js, Express, and modern databases.",
      "Understanding of REST APIs, caching, and concurrent request handling.",
      "Passion for building reliable consumer web experiences."
    ],
    niceToHave: ["Familiarity with Kafka, Redis, or Docker containers"],
    benefits: ["Food coupons & Swiggy One membership", "Flexible hybrid schedule", "Annual wellness stipend", "Group health insurance"],
    deadline: "2026-11-20",
    applicantsCount: 95,
    postedDate: "2026-10-18",
    featured: true,
    interviewPrep: {
      technicalQuestions: [
        { q: "How do you manage high concurrent orders during peak hours in a food delivery app?", a: "By using an asynchronous message queue like Kafka/RabbitMQ to buffer incoming orders, combined with Redis caching for restaurant menus and read-replicas for database load distribution." },
        { q: "What is the difference between SQL and NoSQL for order history vs user profiles?", a: "Order transactions benefit from relational databases (PostgreSQL) for ACID consistency and financial auditing, whereas user cart and temporary session state fit NoSQL (MongoDB/Redis) for high-write throughput." }
      ],
      topics: ["Message Queues (Kafka)", "Database Sharding & Replication", "Microservices Communication", "React Server State Management"]
    }
  },
  {
    id: "job-6",
    title: "Product Design (UI/UX) Intern",
    company: "Zomato",
    logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&auto=format&fit=crop&q=80",
    companyVerified: true,
    trustBadge: "Top Consumer Brand • 100% Verified",
    location: "Gurugram",
    workMode: "Hybrid",
    jobType: "Internship",
    experience: "Fresher",
    salary: "₹30,000 / month",
    salaryMin: 3.6,
    salaryMax: 4.0,
    inHandEstimate: "₹30,000 / month (Full Stipend)",
    category: "UI/UX Design",
    skills: ["Figma", "User Research", "Wireframing", "Design Systems", "Prototyping"],
    description: "Design hyper-intuitive delivery tracking, interactive restaurant menus, and delight-driven micro-interactions for over 50 million active foodies.",
    responsibilities: [
      "Craft interactive mobile app wireframes and high-fidelity mockups in Figma.",
      "Conduct usability tests with real customers and synthesize actionable insights.",
      "Contribute reusable components and design tokens to our unified Design System."
    ],
    requirements: [
      "Strong portfolio demonstrating mobile UI/UX case studies and visual taste.",
      "Mastery of Figma (auto-layout, components, interactive prototypes).",
      "Empathy for user pain points and strong visual communication."
    ],
    niceToHave: ["Basic understanding of React Native or web CSS constraints"],
    benefits: ["Zomato Gold membership & daily lunch allowance", "Full PPO consideration for top performers", "Mentorship from Senior Design Leads"],
    deadline: "2026-11-18",
    applicantsCount: 160,
    postedDate: "2026-10-16",
    featured: true,
    interviewPrep: {
      technicalQuestions: [
        { q: "How do you approach a redesign of a checkout flow to reduce cart abandonment?", a: "Audit drop-off analytics, conduct 5 user interviews, eliminate unnecessary form fields, provide clear pricing breakdowns upfront with multiple payment options, and add progress indicators." },
        { q: "Explain your design system token structure in Figma.", a: "Hierarchical tokens: Global (raw color/size values), Semantic (e.g. surface-primary, text-muted), and Component-specific (button-primary-bg) enabling seamless dark mode and theme switching." }
      ],
      topics: ["Figma Auto-Layout & Variants", "Design Systems & Token Architecture", "User Journey Mapping", "Mobile Usability Heuristics"]
    }
  },
  {
    id: "job-7",
    title: "Software Engineer 1 - Cloud & Backend",
    company: "Microsoft",
    logo: "https://images.unsplash.com/photo-1642132652806-896884e0c451?w=128&auto=format&fit=crop&q=80",
    companyVerified: true,
    trustBadge: "Global Cloud Pioneer • 100% Verified",
    location: "Hyderabad",
    workMode: "Hybrid",
    jobType: "Full Time",
    experience: "Fresher",
    salary: "₹16–24 LPA",
    salaryMin: 16,
    salaryMax: 24,
    inHandEstimate: "₹1,10,000 – ₹1,55,000 / month",
    category: "Backend",
    skills: ["C#", "Node.js", "Azure", "Distributed Systems", "SQL", "Docker"],
    description: "Join Microsoft Azure cloud services team. Build hyperscale distributed storage, compute orchestration services, and developer tooling used by global Fortune 500 enterprises.",
    responsibilities: [
      "Build highly available cloud backend APIs and distributed services.",
      "Ensure service reliability with automated observability, metrics, and alerts.",
      "Collaborate with international teams to deliver features in weekly deployments."
    ],
    requirements: [
      "B.Tech / B.E. / M.Tech in Computer Science or related degree (2025–2026 batch).",
      "Solid understanding of Object-Oriented Programming and Cloud architecture.",
      "Proficient in C#, Java, Python, or TypeScript with strong SQL foundation."
    ],
    niceToHave: ["Hands-on experience with Microsoft Azure, AWS, or Kubernetes"],
    benefits: ["Microsoft stock awards (RSUs)", "Comprehensive medical & wellness coverage", "Tuition assistance program", "Hybrid work environment"],
    deadline: "2026-11-28",
    applicantsCount: 210,
    postedDate: "2026-10-17",
    featured: true,
    interviewPrep: {
      technicalQuestions: [
        { q: "What is CAP theorem and how does Azure Cosmos DB address it?", a: "CAP states a distributed system can only guarantee 2 of Consistency, Availability, Partition tolerance. Cosmos DB offers 5 well-defined consistency levels (Strong, Bounded Staleness, Session, Consistent Prefix, Eventual) letting developers balance consistency vs latency." },
        { q: "Explain the difference between horizontal and vertical scaling in cloud backend.", a: "Vertical scaling increases the RAM/CPU of an existing single server (limited by hardware bounds and single point of failure). Horizontal scaling adds more server instances behind a load balancer, providing virtually unlimited elasticity and fault tolerance." }
      ],
      topics: ["Distributed Systems Fundamentals", "Cloud Storage & Blobs", "Microservices & Load Balancing", "High-Availability Architecture"]
    }
  }
];
