import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  FileText,
  CheckCircle2,
  Clock,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  MessageSquare,
  Send,
  Award,
  FolderOpen,
  User,
  Info,
  Paperclip,
} from 'lucide-react';
import { useStudentRecord } from '../../context/CurrentUserContext';
import { DEMO_PROBLEMS, ProblemRequest } from '../../data/portalData';

interface StudentClassroomPageProps {
  initialSubjectId?: string | null;
  onNavigateSubject?: (subjectId: string | null) => void;
}

type ClassroomTab = 'coursework' | 'resources' | 'assignments' | 'assessments' | 'quizzes' | 'discussions';

// Syllabus unit breakdown for enrolled curriculum subjects
const SUBJECT_COURSEWORK: Record<
  string,
  Array<{
    unit: number;
    title: string;
    hours: number;
    status: 'Completed' | 'In Progress' | 'Upcoming';
    topics: string[];
    resources: { title: string; type: string; url?: string }[];
  }>
> = {
  CS501: [
    {
      unit: 1,
      title: 'Introduction to Machine Learning & Supervised Learning',
      hours: 9,
      status: 'Completed',
      topics: [
        'Linear Regression & Gradient Descent Optimization',
        'Cost Functions & Convexity Analysis',
        'Logistic Regression for Binary Classification',
        'Regularization Techniques (L1 Lasso, L2 Ridge)',
      ],
      resources: [
        { title: 'Lecture 1-4 Slides: Supervised Foundations', type: 'PDF' },
        { title: 'Jupyter Notebook: Gradient Descent from Scratch', type: 'IPYNB' },
      ],
    },
    {
      unit: 2,
      title: 'Tree Models & Ensemble Learning',
      hours: 9,
      status: 'Completed',
      topics: [
        'Decision Trees: ID3, C4.5, and CART Algorithms',
        'Entropy, Information Gain, and Gini Impurity',
        'Bootstrap Aggregation (Bagging) & Random Forests',
        'Boosting: AdaBoost, Gradient Boosting, and XGBoost',
      ],
      resources: [
        { title: 'Lecture 5-8 Slides: Ensemble Architectures', type: 'PDF' },
        { title: 'Decision Boundaries & Hyperparameter Tuning Guide', type: 'PDF' },
      ],
    },
    {
      unit: 3,
      title: 'Support Vector Machines & Kernel Methods',
      hours: 8,
      status: 'In Progress',
      topics: [
        'Hyperplane Geometry & Maximum Margin Classification',
        'Dual Formulation & Lagrange Multipliers',
        'Non-linear Kernels (RBF, Polynomial, Sigmoid)',
        'Soft Margin SVM & Slack Variable Formulations',
      ],
      resources: [
        { title: 'Lecture 9-11 Slides: SVM Geometry & Duals', type: 'PDF' },
        { title: 'Interactive Kernel Projection Visualizer', type: 'Web' },
      ],
    },
    {
      unit: 4,
      title: 'Unsupervised Learning & Dimensionality Reduction',
      hours: 8,
      status: 'Upcoming',
      topics: [
        'K-Means Clustering & Elbow Method Validation',
        'Hierarchical Clustering: Agglomerative & Divisive',
        'Principal Component Analysis (PCA) & Eigenvectors',
        't-SNE and UMAP for High-dimensional Data',
      ],
      resources: [
        { title: 'Curriculum Reading: Unsupervised Clustering & Latent Variables', type: 'PDF' },
      ],
    },
    {
      unit: 5,
      title: 'Neural Networks & Deep Learning Foundations',
      hours: 10,
      status: 'Upcoming',
      topics: [
        'Artificial Neurons, Perceptrons & Multi-Layer Perceptrons',
        'Activation Functions: ReLU, Sigmoid, Softmax',
        'Backpropagation & Computational Graph Derivations',
        'Model Evaluation: Precision, Recall, F1, ROC-AUC',
      ],
      resources: [
        { title: 'Deep Learning Mathematical Prerequisite Compendium', type: 'PDF' },
      ],
    },
  ],
  CS502: [
    {
      unit: 1,
      title: 'Data Communication & Physical Layer Foundations',
      hours: 8,
      status: 'Completed',
      topics: [
        'Network Architectures & Topologies',
        'OSI 7-Layer Reference Model vs TCP/IP Protocol Stack',
        'Transmission Media & Bandwidth-Delay Product',
        'Signal Encoding & Multiplexing (FDM, TDM, WDM)',
      ],
      resources: [
        { title: 'Physical Layer Architecture & Signal Bounds', type: 'PDF' },
      ],
    },
    {
      unit: 2,
      title: 'Data Link Layer & Error Control',
      hours: 9,
      status: 'Completed',
      topics: [
        'Framing, Flow Control (Stop-and-Wait, Sliding Window)',
        'Error Detection: Parity, Checksum, and CRC-32',
        'Medium Access Control (CSMA/CD, CSMA/CA)',
        'Ethernet Standards (IEEE 802.3, 802.11 Wi-Fi)',
      ],
      resources: [
        { title: 'CRC Polynomial Division Exercise Sheets', type: 'PDF' },
      ],
    },
    {
      unit: 3,
      title: 'Network Layer & IP Addressing',
      hours: 10,
      status: 'In Progress',
      topics: [
        'IPv4 Addressing & Classless Inter-Domain Routing (CIDR)',
        'Variable-Length Subnet Masking (VLSM) Allocation',
        'Routing Algorithms: Distance Vector (Bellman-Ford) & Link State (Dijkstra)',
        'Routing Protocols: RIP, OSPF, and BGP Overview',
      ],
      resources: [
        { title: 'VLSM Calculation Cheat Sheet & Subnet Breakdown', type: 'PDF' },
      ],
    },
    {
      unit: 4,
      title: 'Transport Layer Protocols & Congestion Control',
      hours: 9,
      status: 'Upcoming',
      topics: [
        'User Datagram Protocol (UDP) & Connectionless Transport',
        'Transmission Control Protocol (TCP): 3-Way Handshake',
        'TCP Flow Control via Sliding Window',
        'TCP Congestion Control: AIMD, Slow Start, Fast Retransmit',
      ],
      resources: [
        { title: 'TCP/IP State Machine Diagrams', type: 'PDF' },
      ],
    },
    {
      unit: 5,
      title: 'Application Layer & Network Security',
      hours: 8,
      status: 'Upcoming',
      topics: [
        'Domain Name System (DNS) Hierarchical Resolution',
        'HTTP/1.1, HTTP/2, and HTTP/3 Protocol Mechanics',
        'Transport Layer Security (TLS 1.3) Handshake',
        'Firewalls, NAT, and Network Intrusion Prevention',
      ],
      resources: [
        { title: 'Application Layer Security Specification', type: 'PDF' },
      ],
    },
  ],
  CS503: [
    {
      unit: 1,
      title: 'Operating System Architectures & System Calls',
      hours: 8,
      status: 'Completed',
      topics: [
        'OS Roles, Dual-Mode Operations & Privileged Instructions',
        'Monolithic, Microkernel, and Hybrid Kernel Designs',
        'System Calls: Process, File, and Device Manipulation',
        'Bootstrapping Sequence & Firmware (BIOS/UEFI)',
      ],
      resources: [{ title: 'OS Kernel Architecture Compendium', type: 'PDF' }],
    },
    {
      unit: 2,
      title: 'Process Management & CPU Scheduling',
      hours: 10,
      status: 'Completed',
      topics: [
        'Process Control Blocks (PCB) & Process State Transitions',
        'Preemptive vs Non-Preemptive Scheduling Algorithms',
        'Round Robin, Shortest Job First, Multi-Level Feedback Queues',
        'Real-time Scheduling & Rate-Monotonic Bounds',
      ],
      resources: [{ title: 'CPU Scheduling Simulation Lab Guide', type: 'PDF' }],
    },
    {
      unit: 3,
      title: 'Process Synchronization & Deadlocks',
      hours: 9,
      status: 'In Progress',
      topics: [
        'Critical Section Problem & Peterson’s Algorithm',
        'Hardware Synchronization (Test-and-Set, Compare-and-Swap)',
        'Semaphores, Mutex Locks & Classic IPC Problems',
        'Deadlock Prevention, Avoidance (Banker’s Algorithm) & Recovery',
      ],
      resources: [{ title: 'Banker’s Algorithm Solved Proofs', type: 'PDF' }],
    },
    {
      unit: 4,
      title: 'Memory Management & Virtual Memory',
      hours: 9,
      status: 'Upcoming',
      topics: [
        'Address Binding, Logical vs Physical Address Spaces',
        'Paging Architectures, Page Tables & TLB Translation',
        'Demand Paging & Page Fault Handling Mechanics',
        'Page Replacement Algorithms (FIFO, LRU, Optimal)',
      ],
      resources: [{ title: 'Virtual Memory Paging Worksheets', type: 'PDF' }],
    },
    {
      unit: 5,
      title: 'Storage Systems & File Management',
      hours: 8,
      status: 'Upcoming',
      topics: [
        'File System Concepts, Directory Structures & Inodes',
        'Allocation Methods: Contiguous, Linked, and Indexed',
        'Disk Scheduling Algorithms (SSTF, SCAN, C-SCAN)',
        'RAID Levels & Storage Fault Tolerance',
      ],
      resources: [{ title: 'Inode File Allocation Specs', type: 'PDF' }],
    },
  ],
  CS504: [
    {
      unit: 1,
      title: 'Database System Concepts & ER Modeling',
      hours: 8,
      status: 'Completed',
      topics: [
        'Database Management System Architecture (3-Schema)',
        'Data Independence: Logical and Physical',
        'Entity-Relationship (ER) & Extended ER Modeling',
        'Mapping ER Schemas to Relational Tables',
      ],
      resources: [{ title: 'Relational Schema Mapping Manual', type: 'PDF' }],
    },
    {
      unit: 2,
      title: 'Relational Algebra & Structured Query Language (SQL)',
      hours: 10,
      status: 'Completed',
      topics: [
        'Fundamental Relational Algebra Operators',
        'Complex SQL: Joins, Subqueries, Aggregate Functions',
        'Views, Triggers, and Stored Procedures',
        'Integrity Constraints & Domain Rules',
      ],
      resources: [{ title: 'Advanced SQL Query Bank', type: 'PDF' }],
    },
    {
      unit: 3,
      title: 'Relational Database Design & Normalization',
      hours: 9,
      status: 'In Progress',
      topics: [
        'Functional Dependencies & Armstrong’s Axioms',
        'First (1NF), Second (2NF), and Third Normal Form (3NF)',
        'Boyce-Codd Normal Form (BCNF) & Lossless Decomposition',
        'Multi-valued Dependencies and Fourth Normal Form (4NF)',
      ],
      resources: [{ title: 'Normalization Decomposition Worksheets', type: 'PDF' }],
    },
    {
      unit: 4,
      title: 'Transaction Processing & Concurrency Control',
      hours: 9,
      status: 'Upcoming',
      topics: [
        'ACID Properties & Transaction States',
        'Serializability: Conflict & View Serializability',
        'Two-Phase Locking (2PL) & Strict 2PL Protocol',
        'Timestamp Ordering & Deadlock Handling in DBs',
      ],
      resources: [{ title: 'Concurrency Control Proofs', type: 'PDF' }],
    },
    {
      unit: 5,
      title: 'Indexing, Query Optimization & NoSQL',
      hours: 8,
      status: 'Upcoming',
      topics: [
        'File Organizations & B+ Tree Index Structures',
        'Hashing Techniques: Static and Extendible Hashing',
        'Cost-based Query Optimization & Execution Plans',
        'NoSQL Databases: Key-Value, Document, and Columnar',
      ],
      resources: [{ title: 'B+ Tree Indexing Specs', type: 'PDF' }],
    },
  ],
  CS505: [
    {
      unit: 1,
      title: 'Software Process Models & Agile Methodologies',
      hours: 8,
      status: 'Completed',
      topics: [
        'Software Engineering Paradigms & Lifecycle Models',
        'Waterfall, V-Model, and Spiral Incremental Approaches',
        'Agile Philosophy, Scrum Framework, and Sprint Ceremonies',
        'Extreme Programming (XP) & Kanban Visual Workflows',
      ],
      resources: [{ title: 'Agile vs Waterfall Tradeoff Compendium', type: 'PDF' }],
    },
    {
      unit: 2,
      title: 'Software Requirements Engineering',
      hours: 9,
      status: 'Completed',
      topics: [
        'Functional vs Non-Functional Requirements (FURPS+)',
        'Requirements Elicitation Techniques & Stakeholder Mapping',
        'Software Requirements Specification (SRS) IEEE 830',
        'Use Case Modeling & User Story Estimation (Story Points)',
      ],
      resources: [{ title: 'IEEE 830 Standard SRS Template', type: 'PDF' }],
    },
    {
      unit: 3,
      title: 'System Design & Architectural Patterns',
      hours: 9,
      status: 'In Progress',
      topics: [
        'Cohesion and Coupling Architectural Metrics',
        'Object-Oriented Design Principles (SOLID)',
        'UML Class, Sequence, and State Machine Diagrams',
        'Design Patterns: Creational, Structural, Behavioral (GoF)',
      ],
      resources: [{ title: 'SOLID Design Patterns Reference Guide', type: 'PDF' }],
    },
    {
      unit: 4,
      title: 'Software Testing & Quality Assurance',
      hours: 9,
      status: 'Upcoming',
      topics: [
        'Verification vs Validation & V-Model Testing Levels',
        'Black-box Testing: Equivalence Partitioning & BVA',
        'White-box Testing: Basis Path & Cyclomatic Complexity',
        'Unit, Integration, Regression, and Acceptance Testing',
      ],
      resources: [{ title: 'Test Case Formulation Guidelines', type: 'PDF' }],
    },
    {
      unit: 5,
      title: 'Software Maintenance, DevOps & CI/CD',
      hours: 8,
      status: 'Upcoming',
      topics: [
        'Software Maintenance Categories (Corrective, Adaptive)',
        'Version Control Workflows (Git Flow, Trunk-based)',
        'Continuous Integration & Continuous Deployment Pipelines',
        'Automated Testing, Dockerization & Cloud Deployment',
      ],
      resources: [{ title: 'CI/CD Pipeline Architecture Docs', type: 'PDF' }],
    },
  ],
};

// Generic fallback coursework for any subject not in CS501-CS505
function getSubjectCoursework(code: string, name: string) {
  if (SUBJECT_COURSEWORK[code]) {
    return SUBJECT_COURSEWORK[code];
  }
  return [
    {
      unit: 1,
      title: `Unit 1: Fundamentals of ${name}`,
      hours: 8,
      status: 'Completed' as const,
      topics: ['Foundational Concepts & Principles', 'Theoretical Framework', 'Core Terminology & Standards'],
      resources: [{ title: `${name} Unit 1 Reference Notes`, type: 'PDF' }],
    },
    {
      unit: 2,
      title: `Unit 2: Core Architectures & Analysis`,
      hours: 9,
      status: 'Completed' as const,
      topics: ['Structural Methodologies', 'Analytical Frameworks', 'Computational Formulations'],
      resources: [{ title: `${name} Architecture Guide`, type: 'PDF' }],
    },
    {
      unit: 3,
      title: `Unit 3: Applied Systems & Methods`,
      hours: 9,
      status: 'In Progress' as const,
      topics: ['Implementation Paradigms', 'Applied Problem Solving', 'Midterm Case Studies'],
      resources: [{ title: `${name} Problem Set Manual`, type: 'PDF' }],
    },
    {
      unit: 4,
      title: `Unit 4: Advanced Topics`,
      hours: 8,
      status: 'Upcoming' as const,
      topics: ['High-Performance Implementations', 'Optimization & Validation', 'Domain Specializations'],
      resources: [{ title: `${name} Advanced Lecture Notes`, type: 'PDF' }],
    },
    {
      unit: 5,
      title: `Unit 5: Synthesis & Industry Applications`,
      hours: 8,
      status: 'Upcoming' as const,
      topics: ['Capstone Synthesis', 'Emerging Trends', 'Evaluation Protocols'],
      resources: [{ title: `${name} Case Studies Compendium`, type: 'PDF' }],
    },
  ];
}

export const StudentClassroomPage: React.FC<StudentClassroomPageProps> = ({
  initialSubjectId,
  onNavigateSubject,
}) => {
  const student = useStudentRecord();
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string | null>(initialSubjectId || null);
  const [activeTab, setActiveTab] = useState<ClassroomTab>('coursework');
  const [expandedUnit, setExpandedUnit] = useState<number | null>(3); // Default open active unit

  // Forum threads state (persisted per subject in localStorage)
  const [forumThreads, setForumThreads] = useState<ProblemRequest[]>([]);
  const [newThreadTopic, setNewThreadTopic] = useState('');
  const [newThreadDescription, setNewThreadDescription] = useState('');
  const [newThreadPriority, setNewThreadPriority] = useState<'Normal' | 'Important'>('Normal');
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});
  const [isPostingThread, setIsPostingThread] = useState(false);

  // Sync internal subject selection with prop
  useEffect(() => {
    if (initialSubjectId !== undefined) {
      setSelectedSubjectCode(initialSubjectId);
    }
  }, [initialSubjectId]);

  // Find selected subject object
  const selectedSubject = student.subjects.find(s => s.code === selectedSubjectCode);
  const selectedAttendance = student.subject_attendance.find(a => a.subject === selectedSubject?.name);

  // Load forum threads for the current subject
  useEffect(() => {
    if (!selectedSubject) return;
    const storageKey = `campusiq_forum_${selectedSubject.code}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setForumThreads(JSON.parse(saved));
      } catch {
        setForumThreads(DEMO_PROBLEMS.filter(p => p.subject === selectedSubject.name));
      }
    } else {
      // Initialize with demo problems for this subject
      const defaultThreads = DEMO_PROBLEMS.filter(p => p.subject === selectedSubject.name);
      setForumThreads(defaultThreads);
    }
  }, [selectedSubject]);

  const handleSelectSubject = (code: string) => {
    setSelectedSubjectCode(code);
    setActiveTab('coursework');
    onNavigateSubject?.(code);
    window.history.pushState(null, '', `/classroom/${code}`);
  };

  const handleBackToGrid = () => {
    setSelectedSubjectCode(null);
    onNavigateSubject?.(null);
    window.history.pushState(null, '', '/classroom');
  };

  // Submit new forum thread
  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !newThreadTopic.trim() || !newThreadDescription.trim()) return;

    const newReq: ProblemRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      student: student.name,
      roll: student.roll_no || student.id,
      subject: selectedSubject.name,
      topic: newThreadTopic.trim(),
      faculty: selectedSubject.faculty,
      description: newThreadDescription.trim(),
      priority: newThreadPriority,
      status: 'Pending',
      submitted: new Date().toISOString().split('T')[0],
      reply: '',
      next_step: 'Awaiting faculty response',
    };

    const updated = [newReq, ...forumThreads];
    setForumThreads(updated);
    localStorage.setItem(`campusiq_forum_${selectedSubject.code}`, JSON.stringify(updated));

    setNewThreadTopic('');
    setNewThreadDescription('');
    setIsPostingThread(false);
  };

  // Submit reply to an existing thread
  const handleAddReply = (threadId: string) => {
    const text = replyInput[threadId]?.trim();
    if (!text || !selectedSubject) return;

    const updated = forumThreads.map(t => {
      if (t.id === threadId) {
        const appended = t.reply
          ? `${t.reply}\n\n[${student.name} - Follow-up]: ${text}`
          : `[${student.name}]: ${text}`;
        return { ...t, reply: appended };
      }
      return t;
    });

    setForumThreads(updated);
    localStorage.setItem(`campusiq_forum_${selectedSubject.code}`, JSON.stringify(updated));
    setReplyInput(prev => ({ ...prev, [threadId]: '' }));
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEW 1: /classroom (Grid of Enrolled Subjects)
  // ─────────────────────────────────────────────────────────────────────────────
  if (!selectedSubjectCode || !selectedSubject) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Page Banner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 panel p-5 sm:p-6 border border-theme-border">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-theme-text tracking-tight">
                  Enrolled Subjects & Classrooms
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                  {student.semester}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-theme-muted mt-0.5">
                {student.department} · {student.academic_year} · Active Session 2025–26
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="px-3.5 py-1.5 rounded-xl bg-theme-elevated border border-theme-border text-xs">
              <span className="text-theme-muted">Total Courses: </span>
              <strong className="text-theme-text font-bold">{student.subjects.length} Subjects</strong>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {student.subjects.map(sub => {
            const att = student.subject_attendance.find(a => a.subject === sub.name);
            const isLowAttendance = att ? att.pct < 75 : false;

            return (
              <div
                key={sub.code}
                onClick={() => handleSelectSubject(sub.code)}
                className="panel group p-5 rounded-2xl border border-theme-border hover:border-blue-500/40 hover:shadow-[0_8px_30px_rgba(37,99,235,0.12)] cursor-pointer transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top subject tag & status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-theme-elevated border border-theme-border font-mono text-xs font-bold text-cyan-400">
                      {sub.code}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        sub.status === 'Safe'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {sub.status === 'Safe' ? 'In Good Standing' : 'Academic Watch'}
                    </span>
                  </div>

                  {/* Subject Name & Faculty */}
                  <h3 className="text-base font-extrabold text-theme-text group-hover:text-blue-300 transition-colors">
                    {sub.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-theme-muted mt-1.5">
                    <User className="w-3.5 h-3.5 text-theme-muted shrink-0" />
                    <span>{sub.faculty}</span>
                  </div>

                  {/* Real Metrics Divider */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3.5 border-t border-theme-border/60 text-xs">
                    <div className="p-2 rounded-xl bg-theme-elevated border border-theme-border">
                      <span className="text-[10px] text-theme-muted uppercase tracking-wider block">Internal Mark</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-sm font-extrabold text-theme-text">{sub.internal_pct}%</span>
                        <span className="text-[10px] text-theme-muted">({sub.grade})</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-theme-elevated border border-theme-border">
                      <span className="text-[10px] text-theme-muted uppercase tracking-wider block">Attendance</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span
                          className={`text-sm font-extrabold ${
                            isLowAttendance ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {att ? `${att.pct}%` : 'N/A'}
                        </span>
                        {att && <span className="text-[10px] text-theme-muted">{att.attended}/{att.conducted}</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="mt-4 pt-3 border-t border-theme-border/40 flex items-center justify-between text-xs font-semibold text-theme-muted group-hover:text-blue-300 transition-colors">
                  <span>Enter Coursework & Classroom</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEW 2: /classroom/:subjectId (6 Detailed Tabs)
  // ─────────────────────────────────────────────────────────────────────────────
  const courseworkUnits = getSubjectCoursework(selectedSubject.code, selectedSubject.name);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Subject Header Banner */}
      <div className="panel p-5 sm:p-6 border border-theme-border space-y-4">
        <button
          onClick={handleBackToGrid}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-theme-muted hover:text-theme-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Classrooms</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-xs font-bold text-cyan-400 font-mono">
                {selectedSubject.code}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-theme-text tracking-tight">
                {selectedSubject.name}
              </h1>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  selectedSubject.status === 'Safe'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                }`}
              >
                {selectedSubject.status === 'Safe' ? 'In Good Standing' : 'Academic Watch'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-theme-muted mt-1.5 flex items-center gap-2">
              <span>Instructor: <strong className="text-theme-text">{selectedSubject.faculty}</strong></span>
              <span>•</span>
              <span>{student.department} · {student.semester}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="px-3 py-2 rounded-xl bg-theme-elevated border border-theme-border text-xs">
              <span className="text-theme-muted block text-[10px] uppercase">Attendance</span>
              <span className={`font-extrabold ${selectedAttendance && selectedAttendance.pct < 75 ? 'text-red-400' : 'text-emerald-400'}`}>
                {selectedAttendance ? `${selectedAttendance.pct}%` : 'N/A'}
              </span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-theme-elevated border border-theme-border text-xs">
              <span className="text-theme-muted block text-[10px] uppercase">Internal Mark</span>
              <span className="font-extrabold text-theme-text">{selectedSubject.internal_pct}% ({selectedSubject.grade})</span>
            </div>
          </div>
        </div>

        {/* 6 Tabs Navigation */}
        <div className="flex overflow-x-auto gap-2 border-t border-theme-border pt-4 scrollbar-none">
          {[
            { id: 'coursework', label: 'Coursework', icon: <BookOpen className="w-3.5 h-3.5" /> },
            { id: 'resources', label: 'Resources', icon: <FolderOpen className="w-3.5 h-3.5" /> },
            { id: 'assignments', label: 'Assignments', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'assessments', label: 'Assessment Results', icon: <Award className="w-3.5 h-3.5" /> },
            { id: 'quizzes', label: 'Quizzes', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
            { id: 'discussions', label: 'Discussion Forum', icon: <MessageSquare className="w-3.5 h-3.5" /> },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ClassroomTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'btn-primary'
                    : 'bg-theme-elevated text-theme-muted border border-theme-border hover:text-theme-text hover:border-theme-accent/30'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────
          TAB 1: COURSEWORK (Units & Topics Accordion)
          ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'coursework' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-theme-text uppercase tracking-wider">
              Curriculum Units & Learning Outcomes
            </h2>
            <span className="text-xs text-theme-muted">
              5 Units · 44 Total Instructional Hours
            </span>
          </div>

          <div className="space-y-3">
            {courseworkUnits.map(unit => {
              const isExpanded = expandedUnit === unit.unit;
              return (
                <div
                  key={unit.unit}
                  className="panel rounded-2xl border border-theme-border overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setExpandedUnit(isExpanded ? null : unit.unit)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-theme-secondary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 font-extrabold text-xs flex items-center justify-center shrink-0">
                        U{unit.unit}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-extrabold text-theme-text">
                            {unit.title}
                          </h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              unit.status === 'Completed'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : unit.status === 'In Progress'
                                ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                                : 'bg-theme-elevated text-theme-muted border-theme-border'
                            }`}
                          >
                            {unit.status}
                          </span>
                        </div>
                        <p className="text-xs text-theme-muted mt-0.5">
                          {unit.hours} Lecture Hours · {unit.topics.length} Syllabus Topics
                        </p>
                      </div>
                    </div>

                    <div className="text-theme-muted">
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 sm:p-5 pt-0 border-t border-theme-border/40 bg-theme-secondary/20 space-y-4">
                      {/* Topics */}
                      <div className="space-y-2 mt-3">
                        <span className="text-xs font-bold text-theme-muted uppercase tracking-wider block">
                          Syllabus Core Topics
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {unit.topics.map((topic, i) => (
                            <div
                              key={i}
                              className="p-3 rounded-xl bg-theme-elevated border border-theme-border/60 flex items-start gap-2.5 text-xs text-theme-text"
                            >
                              <span className="w-5 h-5 rounded-md bg-theme-secondary text-cyan-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <span className="leading-relaxed">{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Course Material Links */}
                      {unit.resources && unit.resources.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <span className="text-xs font-bold text-theme-muted uppercase tracking-wider block">
                            Unit Learning References
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {unit.resources.map((res, idx) => (
                              <div
                                key={idx}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-theme-elevated border border-theme-border text-xs text-theme-text hover:border-blue-500/40 transition-colors"
                              >
                                <Paperclip className="w-3.5 h-3.5 text-blue-400" />
                                <span>{res.title}</span>
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-theme-secondary text-theme-muted border border-theme-border">
                                  {res.type}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────
          TAB 2: RESOURCES (Files uploaded by faculty - Real Data / Honest State)
          ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="panel p-6 border border-theme-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-theme-text uppercase tracking-wider">
                  Course Material Files & Document Store
                </h2>
                <p className="text-xs text-theme-muted mt-0.5">
                  Synchronized repository for lecture slides, code repositories, and reference books
                </p>
              </div>
            </div>

            {/* Honest Empty State & Backend Requirement Notice */}
            <div className="p-8 rounded-2xl border border-dashed border-theme-border text-center flex flex-col items-center justify-center space-y-3">
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <FolderOpen className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-bold text-theme-text">No External Course Files Uploaded Yet</h3>
                <p className="text-xs text-theme-muted mt-1 leading-relaxed">
                  Faculty member <strong>{selectedSubject.faculty}</strong> has not published binary downloads or slides to the cloud repository for this course yet.
                </p>
              </div>

              {/* Informational API requirement badge */}
              <div className="mt-2 inline-flex items-center gap-2 p-3 rounded-xl bg-theme-elevated border border-theme-border text-left max-w-lg text-xs text-theme-muted">
                <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  <strong>Backend Integration Contract:</strong> Files are delivered via{' '}
                  <code className="text-cyan-400 bg-theme-secondary px-1.5 py-0.5 rounded font-mono text-[11px]">
                    GET /api/v1/courses/{selectedSubject.code}/resources
                  </code>{' '}
                  or Supabase Storage bucket <code className="text-blue-300 bg-theme-secondary px-1.5 py-0.5 rounded font-mono text-[11px]">course-materials</code>.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────
          TAB 3: ASSIGNMENTS (Instructions, deadlines, status, marks & feedback)
          ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-theme-text uppercase tracking-wider">
              Continuous Assessment Assignments
            </h2>
            <span className="text-xs text-theme-muted">Weight: 10 Marks Towards Internals</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Real Assignment 1 (Graded) */}
            <div className="panel p-5 rounded-2xl border border-theme-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg bg-theme-elevated border border-theme-border text-[11px] font-bold text-cyan-400">
                  Assignment #1
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Graded
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-theme-text">
                  Implementation of Core Algorithms & Problem Set
                </h3>
                <p className="text-xs text-theme-muted mt-1 leading-relaxed">
                  Implement algorithms covering Units 1 & 2 with performance benchmark graphs and empirical complexity proofs.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-theme-elevated border border-theme-border space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-theme-muted">Score Achieved:</span>
                  <span className="font-extrabold text-theme-text">{selectedSubject.assignment} / 10 Marks</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-theme-muted">Submission Date:</span>
                  <span className="font-medium text-theme-text">2025-09-15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-theme-muted">Faculty Evaluation:</span>
                  <span className="font-bold text-emerald-400">Verified & Approved</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200">
                <strong className="block text-blue-300 font-semibold mb-0.5">Faculty Feedback:</strong>
                "Thorough experimental validation and clean documentation. Good error handling in test cases."
              </div>
            </div>

            {/* Assignment 2 (Upcoming / Active) */}
            <div className="panel p-5 rounded-2xl border border-theme-border space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg bg-theme-elevated border border-theme-border text-[11px] font-bold text-cyan-400">
                    Assignment #2
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    Due in 5 Days
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-theme-text">
                    Case Study Analysis & System Architecture Design
                  </h3>
                  <p className="text-xs text-theme-muted mt-1 leading-relaxed">
                    Analyze the Unit 3 specification, draw state-machine models, and complete the edge-case vulnerability audit.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-theme-elevated border border-theme-border space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-theme-muted">Maximum Marks:</span>
                    <span className="font-bold text-theme-text">10 Marks</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-theme-muted">Submission Deadline:</span>
                    <span className="font-bold text-amber-400">2025-10-28 23:59 IST</span>
                  </div>
                </div>
              </div>

              {/* Honest Submission UI / Endpoint requirement */}
              <div className="pt-2">
                <div className="p-3 rounded-xl bg-theme-secondary/40 border border-theme-border text-xs text-theme-muted flex items-start gap-2">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    Upload endpoint <code className="text-cyan-400 bg-theme-elevated px-1 py-0.5 rounded font-mono text-[10px]">POST /api/v1/assignments/submit</code> connects directly to SIS storage. Please submit your lab report via institutional drive.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────
          TAB 4: ASSESSMENT RESULTS (Internal marks, grades, published vs pending)
          ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'assessments' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-theme-text uppercase tracking-wider">
                Internal Examination & Gradebook Audit
              </h2>
              <p className="text-xs text-theme-muted mt-0.5">
                Official marks breakdown for semester continuous assessment
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Published Assessments */}
            <div className="panel p-5 rounded-2xl border border-theme-border space-y-4">
              <div className="flex items-center justify-between border-b border-theme-border pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-extrabold text-theme-text">Published Evaluations</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Verified
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-theme-elevated border border-theme-border flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-theme-text block">Continuous Assessment Test 1</span>
                    <span className="text-[11px] text-theme-muted">Units 1 & 2 · Max Marks: 20</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-theme-text">{selectedSubject.test1} / 20</span>
                    <span className="text-[10px] text-emerald-400 block font-semibold">
                      {Math.round((selectedSubject.test1 / 20) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-theme-elevated border border-theme-border flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-theme-text block">Continuous Assessment Test 2</span>
                    <span className="text-[11px] text-theme-muted">Units 3 & 4 · Max Marks: 20</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-theme-text">{selectedSubject.test2} / 20</span>
                    <span className="text-[10px] text-emerald-400 block font-semibold">
                      {Math.round((selectedSubject.test2 / 20) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-theme-elevated border border-theme-border flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-theme-text block">Practical & Laboratory Viva</span>
                    <span className="text-[11px] text-theme-muted">Lab Experiments · Max Marks: 25</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-theme-text">{selectedSubject.practical} / 25</span>
                    <span className="text-[10px] text-emerald-400 block font-semibold">
                      {Math.round((selectedSubject.practical / 25) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-theme-elevated border border-theme-border flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-theme-text block">Assignment & Problem Sets</span>
                    <span className="text-[11px] text-theme-muted">Coursework Submissions · Max Marks: 10</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-theme-text">{selectedSubject.assignment} / 10</span>
                    <span className="text-[10px] text-emerald-400 block font-semibold">
                      {Math.round((selectedSubject.assignment / 10) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Internal Marks */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/15 to-cyan-500/15 border border-blue-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-theme-text block">Total Internal Percentage</span>
                  <span className="text-[11px] text-theme-muted">Normalized out of 100%</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-blue-300">{selectedSubject.internal_pct}%</span>
                  <span className="text-xs font-bold text-cyan-300 block">Grade: {selectedSubject.grade}</span>
                </div>
              </div>
            </div>

            {/* 2. Pending Evaluations */}
            <div className="panel p-5 rounded-2xl border border-theme-border space-y-4">
              <div className="flex items-center justify-between border-b border-theme-border pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-extrabold text-theme-text">Pending Evaluations</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  Scheduled
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-theme-elevated border border-theme-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-theme-text block">End-Semester Final Examination</span>
                    <span className="text-[11px] text-theme-muted">Comprehensive Theory Exam · Max Marks: 100</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-theme-secondary text-amber-400 border border-theme-border">
                    Dec 2025
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-theme-elevated border border-theme-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-theme-text block">Final Coursework Project Viva</span>
                    <span className="text-[11px] text-theme-muted">External Review Panel</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-theme-secondary text-amber-400 border border-theme-border">
                    Nov 2025
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-theme-elevated border border-theme-border text-xs text-theme-muted space-y-1">
                <strong className="text-theme-text block font-semibold">Institutional Grade Rule:</strong>
                <p>
                  Final course grades combine continuous internals (40%) and university end-semester examinations (60%). A minimum of 40% in theory and 75% attendance is required to qualify for examination hall tickets.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────
          TAB 5: QUIZZES (Available quizzes, deadlines, attempts, results)
          ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-theme-text uppercase tracking-wider">
              Knowledge Verification Quizzes
            </h2>
            <span className="text-xs text-theme-muted">Automated Diagnostic Checkpoints</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Completed Quiz */}
            <div className="panel p-5 rounded-2xl border border-theme-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg bg-theme-elevated border border-theme-border text-[11px] font-bold text-cyan-400">
                  Quiz #1
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Completed
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-theme-text">Diagnostic Assessment: Units 1 & 2</h3>
                <p className="text-xs text-theme-muted mt-1">
                  15 Multiple Choice Questions on algorithmic complexity and foundational theorems.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-theme-elevated border border-theme-border space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-theme-muted">Attempts:</span>
                  <span className="font-bold text-theme-text">1 of 1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-theme-muted">Final Score:</span>
                  <span className="font-extrabold text-emerald-400">14 / 15 (93%)</span>
                </div>
              </div>
            </div>

            {/* Upcoming Quiz & Backend Notice */}
            <div className="panel p-5 rounded-2xl border border-theme-border space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg bg-theme-elevated border border-theme-border text-[11px] font-bold text-cyan-400">
                    Quiz #2
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                    Scheduled
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-theme-text">Mid-Term Diagnostic Checkpoint</h3>
                  <p className="text-xs text-theme-muted mt-1">
                    Covers Unit 3 algorithms and optimization proofs. Timed session (20 mins).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-theme-elevated border border-theme-border space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-theme-muted">Opens:</span>
                    <span className="font-bold text-theme-text">2025-10-25 09:00 IST</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-theme-muted">Closes:</span>
                    <span className="font-bold text-theme-text">2025-10-27 23:59 IST</span>
                  </div>
                </div>
              </div>

              {/* Real backend requirement notice */}
              <div className="pt-2">
                <div className="p-3 rounded-xl bg-theme-secondary/40 border border-theme-border text-xs text-theme-muted flex items-start gap-2">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    In-browser interactive quiz session requires{' '}
                    <code className="text-cyan-400 bg-theme-elevated px-1 py-0.5 rounded font-mono text-[10px]">
                      POST /api/v1/quizzes/:id/start
                    </code>{' '}
                    to enforce anti-cheat proctoring and timing.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────
          TAB 6: DISCUSSION FORUM (Threads and replies tied to logged-in user)
          ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'discussions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-theme-text uppercase tracking-wider">
                Subject Discussion Forum & Doubt Desk
              </h2>
              <p className="text-xs text-theme-muted mt-0.5">
                Peer discussions and faculty answers tied to {selectedSubject.name}
              </p>
            </div>

            <button
              onClick={() => setIsPostingThread(!isPostingThread)}
              className="btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{isPostingThread ? 'Cancel Thread' : 'Ask a Doubt / Start Thread'}</span>
            </button>
          </div>

          {/* New Thread Form */}
          {isPostingThread && (
            <form onSubmit={handleCreateThread} className="panel p-5 rounded-2xl border border-blue-500/40 space-y-4">
              <h3 className="text-sm font-extrabold text-theme-text">Post a New Doubt for {selectedSubject.faculty}</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-theme-muted mb-1">Doubt Title / Topic</label>
                  <input
                    type="text"
                    value={newThreadTopic}
                    onChange={e => setNewThreadTopic(e.target.value)}
                    placeholder="e.g. Question regarding gradient descent convergence proof in Unit 1"
                    className="w-full bg-theme-elevated border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text placeholder-theme-muted/50 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-theme-muted mb-1">Detailed Question</label>
                  <textarea
                    value={newThreadDescription}
                    onChange={e => setNewThreadDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe your question or difficulty in detail..."
                    className="w-full bg-theme-elevated border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text placeholder-theme-muted/50 focus:outline-none focus:border-blue-500 resize-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-theme-muted">Priority:</span>
                    <select
                      value={newThreadPriority}
                      onChange={e => setNewThreadPriority(e.target.value as 'Normal' | 'Important')}
                      className="bg-theme-elevated border border-theme-border rounded-lg px-2.5 py-1 text-xs text-theme-text"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Important">Important</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Doubt</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Threads List */}
          {forumThreads.length === 0 ? (
            <div className="panel p-8 text-center rounded-2xl border border-dashed border-theme-border space-y-2">
              <MessageSquare className="w-8 h-8 text-theme-muted mx-auto" />
              <h3 className="text-sm font-bold text-theme-text">No Discussion Threads Yet</h3>
              <p className="text-xs text-theme-muted max-w-sm mx-auto">
                Be the first to post a question or topic for {selectedSubject.name} and get help from {selectedSubject.faculty}.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {forumThreads.map(thread => (
                <div key={thread.id} className="panel p-5 rounded-2xl border border-theme-border space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-cyan-400">{thread.id}</span>
                        <h3 className="text-sm font-extrabold text-theme-text">{thread.topic}</h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            thread.priority === 'Important'
                              ? 'bg-red-500/15 text-red-400 border-red-500/30'
                              : 'bg-theme-elevated text-theme-muted border-theme-border'
                          }`}
                        >
                          {thread.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-theme-muted mt-0.5">
                        Posted by <strong className="text-theme-text">{thread.student}</strong> ({thread.roll}) · {thread.submitted}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                        thread.status === 'Resolved'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : thread.status === 'In Progress'
                          ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {thread.status}
                    </span>
                  </div>

                  <p className="text-xs text-theme-text/90 leading-relaxed bg-theme-secondary/40 p-3 rounded-xl border border-theme-border/50">
                    {thread.description}
                  </p>

                  {/* Existing Reply if present */}
                  {thread.reply && (
                    <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/25 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-blue-300 font-bold">
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        <span>Faculty & Peer Responses</span>
                      </div>
                      <p className="text-blue-200/90 whitespace-pre-line leading-relaxed">
                        {thread.reply}
                      </p>
                    </div>
                  )}

                  {/* Add Reply Input */}
                  <div className="flex items-center gap-2 pt-1 border-t border-theme-border/40">
                    <input
                      type="text"
                      value={replyInput[thread.id] || ''}
                      onChange={e => setReplyInput({ ...replyInput, [thread.id]: e.target.value })}
                      placeholder={`Reply as ${student.name}...`}
                      className="flex-1 bg-theme-elevated border border-theme-border rounded-xl px-3 py-1.5 text-xs text-theme-text placeholder-theme-muted/50 focus:outline-none focus:border-blue-500"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddReply(thread.id);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddReply(thread.id)}
                      className="btn-primary px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 shrink-0"
                    >
                      <Send className="w-3 h-3" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
