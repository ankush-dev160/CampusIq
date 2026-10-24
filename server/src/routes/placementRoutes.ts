import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../seed-data/json');

const QUESTION_BANK_FILE = path.join(DATA_DIR, 'question_bank.json');
const TEST_ATTEMPTS_FILE = path.join(DATA_DIR, 'test_attempts.json');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');

// Helper to safely read JSON
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

// Helper to safely write JSON
function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

export interface QuestionItem {
  id: string;
  track: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tags?: string[];
  isSample: boolean;
}

export interface TestAttempt {
  attemptId: string;
  studentId: string;
  studentName?: string;
  studentBranch?: string;
  track: string;
  mode: 'quick' | 'standard';
  questionCount: number;
  questionIds: string[];
  startedAt: string;
  submittedAt?: string;
  status: 'in-progress' | 'completed';
  score?: number;
  total?: number;
  percentage?: number;
  level?: 'Beginner' | 'Intermediate' | 'Job-ready';
  timeSpentSeconds?: number;
  topicBreakdown?: {
    topic: string;
    total: number;
    correct: number;
    accuracy: number;
  }[];
  strengths?: string[];
  weakTopics?: string[];
  answers?: Record<string, number>;
  review?: {
    id: string;
    question: string;
    options: string[];
    studentAnswer: number | null;
    correctAnswer: number;
    isCorrect: boolean;
    explanation: string;
    topic: string;
    difficulty: string;
  }[];
}

// Track definitions with branch mappings
export const TRACK_DEFINITIONS = [
  {
    id: 'dsa',
    name: 'Data Structures and Algorithms',
    shortName: 'DSA',
    branches: ['CSE', 'AIML'],
    icon: 'Code',
    description: 'Arrays, Trees, Graphs, Dynamic Programming, Complexity',
    topics: ['Arrays & Strings', 'Linked Lists & Stacks', 'Binary Trees & BST', 'Graph Algorithms', 'Dynamic Programming', 'Sorting & Searching']
  },
  {
    id: 'database-sql',
    name: 'Database and SQL',
    shortName: 'DBMS & SQL',
    branches: ['CSE', 'AIML', 'IT'],
    icon: 'Database',
    description: 'Relational algebra, SQL joins, Normalization, ACID, Indexing',
    topics: ['SQL Queries & Joins', 'Normalization (1NF-BCNF)', 'Indexing & B-Trees', 'Transactions & ACID', 'Aggregation & Grouping', 'Window Functions']
  },
  {
    id: 'web-dev',
    name: 'Web Development',
    shortName: 'Web Dev',
    branches: ['CSE', 'IT'],
    icon: 'Globe',
    description: 'DOM, JavaScript ES6+, React, REST APIs, HTTP/HTTPS, CSS Grid',
    topics: ['JavaScript Core & Event Loop', 'DOM & Browser APIs', 'React State & Hooks', 'HTTP & REST APIs', 'CSS Layouts & Flexbox', 'Web Performance']
  },
  {
    id: 'cyber-security',
    name: 'Cyber Security',
    shortName: 'Cyber Security',
    branches: ['CSE', 'IT'],
    icon: 'ShieldCheck',
    description: 'Networking, Cryptography, Web exploits (XSS, SQLi), Linux security',
    topics: ['Networking & Firewalls', 'Cryptography & PKI', 'Common Web Attacks', 'Authentication & OAuth', 'Linux Security & Permissions', 'Malware & Incident Response']
  },
  {
    id: 'ai-ml',
    name: 'Data Science / AI-ML',
    shortName: 'AI & Data Science',
    branches: ['AIML'],
    icon: 'Cpu',
    description: 'Supervised/Unsupervised models, Neural nets, Metrics, Pandas',
    topics: ['Model Evaluation & Metrics', 'Supervised Learning', 'Unsupervised & Clustering', 'Neural Networks & Deep Learning', 'Feature Engineering & PCA', 'Loss Functions & Optimization']
  },
  {
    id: 'cloud-devops',
    name: 'Cloud and DevOps',
    shortName: 'Cloud & DevOps',
    branches: ['IT'],
    icon: 'Cloud',
    description: 'Docker, CI/CD pipelines, AWS/GCP services, Kubernetes, IaC',
    topics: ['Docker & Containerization', 'Kubernetes Orchestration', 'CI/CD Pipelines', 'Cloud Architecture (IaaS/PaaS)', 'Infrastructure as Code (Terraform)', 'Monitoring & Observability']
  },
  {
    id: 'embedded-iot',
    name: 'Embedded and IoT',
    shortName: 'Embedded & IoT',
    branches: ['ECE'],
    icon: 'Radio',
    description: 'Microcontrollers, GPIO, I2C/SPI, FreeRTOS, MQTT, Sensors',
    topics: ['Microcontrollers & Architecture', 'Communication Protocols (I2C/SPI/UART)', 'Real-Time Operating Systems (RTOS)', 'IoT Networking (MQTT/CoAP)', 'Sensors & Interfacing', 'Hardware Security']
  },
  {
    id: 'vlsi-digital',
    name: 'VLSI and Digital Electronics',
    shortName: 'VLSI & Digital',
    branches: ['ECE'],
    icon: 'Layers',
    description: 'CMOS logic, STA, Setup/Hold time, Verilog, K-Maps, FSMs',
    topics: ['CMOS Logic & Gates', 'Static Timing Analysis (STA)', 'Verilog HDL & Synthesis', 'Finite State Machines', 'Combinational & Sequential Circuits', 'Power Dissipation & DRC']
  },
  {
    id: 'comm-systems',
    name: 'Communication Systems',
    shortName: 'Comm Systems',
    branches: ['ECE'],
    icon: 'Wifi',
    description: 'Modulation (QAM/OFDM), Nyquist/Shannon, Antennas, Optical fiber',
    topics: ['Digital Modulation (QAM/PSK)', 'Information Theory & Nyquist', 'Antennas & Wave Propagation', 'Optical Fiber Communication', 'Wireless & Cellular Systems', 'Fourier Analysis & Sampling']
  },
  {
    id: 'core-mech',
    name: 'Core Mechanical',
    shortName: 'Core Mechanical',
    branches: ['ME'],
    icon: 'Wrench',
    description: 'Thermodynamics, Strength of materials, Fluid mechanics, Manufacturing',
    topics: ['Thermodynamic Cycles (Carnot/Rankine)', 'Strength of Materials (Stress/Strain)', 'Fluid Mechanics (Bernoulli/Reynolds)', 'Heat Transfer (Conduction/Convection)', 'Manufacturing Processes (Casting/Welding)', 'Machine Design & Gears']
  },
  {
    id: 'cad-cam-robotics',
    name: 'CAD/CAM and Robotics',
    shortName: 'CAD/CAM & Robotics',
    branches: ['ME'],
    icon: 'Activity',
    description: 'Kinematics, CNC G-codes, Parametric 3D CAD, FEA, Actuators',
    topics: ['Robot Kinematics (Forward/Inverse)', 'CNC Programming & G-Codes', 'Parametric 3D CAD Modeling', 'Finite Element Analysis (FEA)', 'Sensors & Actuators (Pneumatics/Servos)', 'Additive Manufacturing (3D Printing)']
  },
  {
    id: 'civil-structures',
    name: 'Civil Structures and Construction',
    shortName: 'Civil & Structures',
    branches: ['CE'],
    icon: 'Building',
    description: 'RCC design, Soil mechanics, Highway engineering, Concrete, Trusses',
    topics: ['RCC Design & Limit State Method', 'Structural Analysis & Trusses', 'Soil Mechanics & Compaction', 'Concrete Technology & Hydration', 'Fluid Mechanics & Open Channel', 'Highway Engineering & Superelevation']
  },
  {
    id: 'aptitude',
    name: 'Aptitude and Logical Reasoning',
    shortName: 'Aptitude',
    branches: ['COMMON', 'CSE', 'AIML', 'IT', 'ECE', 'ME', 'CE'],
    icon: 'Brain',
    description: 'Quantitative aptitude, Work & time, Percentages, Syllogisms, Probability',
    topics: ['Percentages & Profit-Loss', 'Time, Speed & Distance', 'Work & Pipes', 'Permutation, Combination & Probability', 'Logical Deduction & Syllogisms', 'Number Theory & Progressions']
  }
];

export const BRANCH_TRACK_MAP: Record<string, string[]> = {
  CSE: ['dsa', 'database-sql', 'web-dev', 'cyber-security', 'aptitude'],
  AIML: ['ai-ml', 'dsa', 'database-sql', 'aptitude'],
  IT: ['web-dev', 'database-sql', 'cloud-devops', 'cyber-security', 'aptitude'],
  ECE: ['embedded-iot', 'vlsi-digital', 'comm-systems', 'aptitude'],
  ME: ['core-mech', 'cad-cam-robotics', 'aptitude'],
  CE: ['civil-structures', 'aptitude']
};

/**
 * Normalizes branch name to standard code
 */
export function normalizeBranch(branch?: string): string {
  if (!branch) return 'CSE';
  const b = branch.toUpperCase();
  if (b.includes('CSE') || b.includes('COMPUTER')) return 'CSE';
  if (b.includes('AIML') || b.includes('ARTIFICIAL')) return 'AIML';
  if (b.includes('IT') || b.includes('INFORMATION')) return 'IT';
  if (b.includes('ECE') || b.includes('ELECTRONIC') || b.includes('COMM')) return 'ECE';
  if (b.includes('ME') || b.includes('MECHANIC')) return 'ME';
  if (b.includes('CE') || b.includes('CIVIL')) return 'CE';
  return 'CSE';
}

// ─────────────────────────────────────────────────────────────────────────────
// ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/placement/tracks
 * Returns all tracks with branch suggestions mapping
 */
router.get('/tracks', (req: Request, res: Response) => {
  const branchParam = req.query.branch as string | undefined;
  const normalizedBranch = normalizeBranch(branchParam);
  const suggestedTrackIds = BRANCH_TRACK_MAP[normalizedBranch] || BRANCH_TRACK_MAP.CSE;

  // Add suggested flag based on branch
  const tracks = TRACK_DEFINITIONS.map(t => ({
    ...t,
    isSuggested: suggestedTrackIds.includes(t.id)
  }));

  // Sort suggested first
  tracks.sort((a, b) => {
    if (a.isSuggested && !b.isSuggested) return -1;
    if (!a.isSuggested && b.isSuggested) return 1;
    return 0;
  });

  return res.json({
    branch: normalizedBranch,
    suggestedTrackIds,
    tracks
  });
});

/**
 * GET /api/placement/questions
 * Read-only view for Placement Officer / Authorized Admin
 */
router.get('/questions', (req: Request, res: Response) => {
  const { track, difficulty, limit = '100' } = req.query;
  let questions = readJsonFile<QuestionItem[]>(QUESTION_BANK_FILE, []);

  if (track) {
    questions = questions.filter(q => q.track.toLowerCase() === String(track).toLowerCase());
  }
  if (difficulty) {
    questions = questions.filter(q => q.difficulty.toLowerCase() === String(difficulty).toLowerCase());
  }

  const parsedLimit = Math.min(parseInt(String(limit), 10) || 100, 400);

  // Group count by track
  const trackCounts: Record<string, number> = {};
  for (const q of readJsonFile<QuestionItem[]>(QUESTION_BANK_FILE, [])) {
    trackCounts[q.track] = (trackCounts[q.track] || 0) + 1;
  }

  return res.json({
    total: questions.length,
    trackCounts,
    questions: questions.slice(0, parsedLimit)
  });
});

/**
 * POST /api/placement/questions
 * Placement Officer / Admin can add or edit questions
 */
router.post('/questions', (req: Request, res: Response) => {
  const { id, track, topic, difficulty, question, options, correctIndex, explanation } = req.body;

  if (!track || !topic || !question || !Array.isArray(options) || options.length !== 4 || correctIndex === undefined || !explanation) {
    return res.status(400).json({ error: 'Missing required question fields. 4 options and valid correctIndex (0-3) are mandatory.' });
  }

  const questions = readJsonFile<QuestionItem[]>(QUESTION_BANK_FILE, []);
  let updatedQuestion: QuestionItem;

  if (id) {
    const existingIndex = questions.findIndex(q => q.id === id);
    if (existingIndex >= 0) {
      updatedQuestion = {
        ...questions[existingIndex],
        track,
        topic,
        difficulty: difficulty || 'Medium',
        question,
        options,
        correctIndex: Number(correctIndex),
        explanation,
        isSample: false
      };
      questions[existingIndex] = updatedQuestion;
    } else {
      return res.status(404).json({ error: 'Question ID not found for update' });
    }
  } else {
    const trackCount = questions.filter(q => q.track === track).length + 1;
    updatedQuestion = {
      id: `Q-${track.toUpperCase()}-${String(trackCount).padStart(3, '0')}`,
      track,
      topic,
      difficulty: difficulty || 'Medium',
      type: 'MCQ',
      question,
      options,
      correctIndex: Number(correctIndex),
      explanation,
      isSample: false
    };
    questions.push(updatedQuestion);
  }

  writeJsonFile(QUESTION_BANK_FILE, questions);
  return res.json({ success: true, question: updatedQuestion });
});

/**
 * POST /api/placement/tests/start
 * Starts a new test attempt.
 * Server selects random questions and stores attempt.
 * CRITICAL ANTI-CHEAT: Sends questions WITHOUT correctIndex and WITHOUT explanation.
 */
router.post('/tests/start', (req: Request, res: Response) => {
  const { studentId, track, mode = 'quick' } = req.body;

  if (!studentId) {
    return res.status(400).json({ error: 'studentId is required' });
  }
  if (!track) {
    return res.status(400).json({ error: 'track is required' });
  }

  const allQuestions = readJsonFile<QuestionItem[]>(QUESTION_BANK_FILE, []);
  const trackQuestions = allQuestions.filter(q => q.track.toLowerCase() === track.toLowerCase());

  if (trackQuestions.length === 0) {
    return res.status(404).json({ error: `No questions found for track '${track}'` });
  }

  const requestedCount = mode === 'standard' ? 20 : 10;
  const count = Math.min(requestedCount, trackQuestions.length);

  // Shuffle questions randomly
  const shuffled = [...trackQuestions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  const attemptId = `ATT-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  // Find student metadata if available
  const students = readJsonFile<any[]>(STUDENTS_FILE, []);
  const studentMeta = students.find(s => s.id === studentId || s.rollNo === studentId || s.email === studentId);

  const newAttempt: TestAttempt = {
    attemptId,
    studentId,
    studentName: studentMeta?.name || 'Student',
    studentBranch: normalizeBranch(studentMeta?.branch),
    track,
    mode: mode === 'standard' ? 'standard' : 'quick',
    questionCount: selected.length,
    questionIds: selected.map(q => q.id),
    startedAt: new Date().toISOString(),
    status: 'in-progress'
  };

  const attempts = readJsonFile<TestAttempt[]>(TEST_ATTEMPTS_FILE, []);
  attempts.push(newAttempt);
  writeJsonFile(TEST_ATTEMPTS_FILE, attempts);

  // SECURE PAYLOAD: Strip correctIndex and explanation!
  const sanitizedQuestions = selected.map(q => ({
    id: q.id,
    track: q.track,
    topic: q.topic,
    difficulty: q.difficulty,
    question: q.question,
    options: q.options,
    isSample: q.isSample
  }));

  return res.json({
    attemptId,
    track,
    mode: newAttempt.mode,
    totalQuestions: sanitizedQuestions.length,
    timeLimitMinutes: count, // 1 minute per question as per specs
    timeLimitSeconds: count * 60,
    startedAt: newAttempt.startedAt,
    questions: sanitizedQuestions
  });
});

/**
 * POST /api/placement/tests/:attemptId/submit
 * Server-side scoring with identity and anti-tamper verification.
 * Re-submission is rejected with 403.
 * Another student submitting returns 403.
 */
router.post('/tests/:attemptId/submit', (req: Request, res: Response) => {
  const { attemptId } = req.params;
  const { studentId, answers = {}, timeSpentSeconds = 0 } = req.body;

  if (!studentId) {
    return res.status(400).json({ error: 'studentId is required' });
  }

  const attempts = readJsonFile<TestAttempt[]>(TEST_ATTEMPTS_FILE, []);
  const attemptIndex = attempts.findIndex(a => a.attemptId === attemptId);

  if (attemptIndex === -1) {
    return res.status(404).json({ error: 'Test attempt not found' });
  }

  const attempt = attempts[attemptIndex];

  // ANTI-TAMPER CHECK 1: Ensure submission belongs to the same student
  if (attempt.studentId !== studentId) {
    return res.status(403).json({
      error: 'Forbidden: You can only submit your own test attempt.'
    });
  }

  // ANTI-TAMPER CHECK 2: Prevent multiple submissions
  if (attempt.status === 'completed') {
    return res.status(403).json({
      error: 'Forbidden: Test already submitted. Multiple submissions are not allowed.'
    });
  }

  // Score answers on the server
  const allQuestions = readJsonFile<QuestionItem[]>(QUESTION_BANK_FILE, []);
  const questionMap = new Map<string, QuestionItem>();
  for (const q of allQuestions) {
    questionMap.set(q.id, q);
  }

  let score = 0;
  const total = attempt.questionIds.length;
  const topicStats: Record<string, { total: number; correct: number }> = {};

  const review = attempt.questionIds.map(qId => {
    const q = questionMap.get(qId);
    if (!q) {
      return {
        id: qId,
        question: 'Question metadata unavailable',
        options: [],
        studentAnswer: null,
        correctAnswer: -1,
        isCorrect: false,
        explanation: 'N/A',
        topic: 'General',
        difficulty: 'Medium'
      };
    }

    const studentAns = answers[qId] !== undefined ? Number(answers[qId]) : null;
    const isCorrect = studentAns === q.correctIndex;

    if (isCorrect) {
      score += 1;
    }

    // Topic stats
    if (!topicStats[q.topic]) {
      topicStats[q.topic] = { total: 0, correct: 0 };
    }
    topicStats[q.topic].total += 1;
    if (isCorrect) {
      topicStats[q.topic].correct += 1;
    }

    return {
      id: q.id,
      question: q.question,
      options: q.options,
      studentAnswer: studentAns,
      correctAnswer: q.correctIndex,
      isCorrect,
      explanation: q.explanation,
      topic: q.topic,
      difficulty: q.difficulty
    };
  });

  const percentage = Math.round((score / total) * 100);

  // Level determination: Beginner < 40%, Intermediate 40-70%, Job-ready > 70%
  let level: 'Beginner' | 'Intermediate' | 'Job-ready';
  if (percentage >= 70) {
    level = 'Job-ready';
  } else if (percentage >= 40) {
    level = 'Intermediate';
  } else {
    level = 'Beginner';
  }

  // Topic breakdown
  const topicBreakdown = Object.entries(topicStats).map(([topic, stats]) => ({
    topic,
    total: stats.total,
    correct: stats.correct,
    accuracy: Math.round((stats.correct / stats.total) * 100)
  }));

  const strengths = topicBreakdown.filter(t => t.accuracy >= 70).map(t => t.topic);
  const weakTopics = topicBreakdown.filter(t => t.accuracy < 70).map(t => t.topic);

  // Recommendations for next practice
  const whatToPractiseNext = weakTopics.length > 0
    ? weakTopics.map(topic => `Focus on ${topic}: review fundamental concepts and solve 5-10 practice MCQs.`)
    : ['Excellent performance across all topics! Proceed to timed mock interview assessments or advanced track tests.'];

  // Update attempt record
  const completedAttempt: TestAttempt = {
    ...attempt,
    status: 'completed',
    submittedAt: new Date().toISOString(),
    score,
    total,
    percentage,
    level,
    timeSpentSeconds: Number(timeSpentSeconds) || 0,
    topicBreakdown,
    strengths,
    weakTopics,
    answers,
    review
  };

  attempts[attemptIndex] = completedAttempt;
  writeJsonFile(TEST_ATTEMPTS_FILE, attempts);

  return res.json({
    attemptId,
    track: attempt.track,
    mode: attempt.mode,
    score,
    total,
    percentage,
    level,
    timeSpentSeconds: completedAttempt.timeSpentSeconds,
    topicBreakdown,
    strengths,
    weakTopics,
    whatToPractiseNext,
    review
  });
});

/**
 * GET /api/placement/attempts/:studentId
 * Returns student's historical test attempts and track performance trends
 */
router.get('/attempts/:studentId', (req: Request, res: Response) => {
  const { studentId } = req.params;
  const allAttempts = readJsonFile<TestAttempt[]>(TEST_ATTEMPTS_FILE, []);

  // Filter completed attempts for this student
  const studentAttempts = allAttempts
    .filter(a => a.studentId === studentId && a.status === 'completed')
    .sort((a, b) => new Date(b.submittedAt || b.startedAt).getTime() - new Date(a.submittedAt || a.startedAt).getTime());

  // Best score per track
  const bestScorePerTrack: Record<string, {
    bestScore: number;
    total: number;
    percentage: number;
    level: string;
    submittedAt: string;
    trackName: string;
  }> = {};

  // Track performance trends
  const trackTrends: Record<string, { date: string; percentage: number; score: number }[]> = {};

  for (const a of studentAttempts) {
    if (!a.track || a.score === undefined || a.percentage === undefined) continue;

    const trackDef = TRACK_DEFINITIONS.find(t => t.id === a.track);
    const trackName = trackDef?.name || a.track;

    if (!bestScorePerTrack[a.track] || a.percentage > bestScorePerTrack[a.track].percentage) {
      bestScorePerTrack[a.track] = {
        bestScore: a.score,
        total: a.total || (a.mode === 'standard' ? 20 : 10),
        percentage: a.percentage,
        level: a.level || 'Beginner',
        submittedAt: a.submittedAt || a.startedAt,
        trackName
      };
    }

    if (!trackTrends[a.track]) {
      trackTrends[a.track] = [];
    }
    trackTrends[a.track].push({
      date: (a.submittedAt || a.startedAt).split('T')[0],
      percentage: a.percentage,
      score: a.score
    });
  }

  // Calculate overall readiness score based on best attempt
  let overallReadinessScore: number | null = null;
  let overallLevel: string = 'Beginner';
  if (studentAttempts.length > 0) {
    const percentages = Object.values(bestScorePerTrack).map(b => b.percentage);
    if (percentages.length > 0) {
      overallReadinessScore = Math.round(percentages.reduce((sum, p) => sum + p, 0) / percentages.length);
      if (overallReadinessScore >= 70) overallLevel = 'Job-ready';
      else if (overallReadinessScore >= 40) overallLevel = 'Intermediate';
      else overallLevel = 'Beginner';
    }
  }

  return res.json({
    studentId,
    totalAttempts: studentAttempts.length,
    latestAttempt: studentAttempts[0] || null,
    overallReadinessScore,
    overallLevel,
    bestScorePerTrack,
    trackTrends,
    attempts: studentAttempts.map(a => ({
      attemptId: a.attemptId,
      track: a.track,
      trackName: TRACK_DEFINITIONS.find(t => t.id === a.track)?.name || a.track,
      mode: a.mode,
      score: a.score,
      total: a.total,
      percentage: a.percentage,
      level: a.level,
      startedAt: a.startedAt,
      submittedAt: a.submittedAt,
      timeSpentSeconds: a.timeSpentSeconds,
      topicBreakdown: a.topicBreakdown,
      strengths: a.strengths,
      weakTopics: a.weakTopics
    }))
  });
});

/**
 * GET /api/placement/admin/analytics
 * Aggregated view for Placement Officer / Authorized Faculty:
 * - Average per track
 * - Average per branch
 * - List of students with no attempts
 */
router.get('/admin/analytics', (_req: Request, res: Response) => {
  const attempts = readJsonFile<TestAttempt[]>(TEST_ATTEMPTS_FILE, []);
  const students = readJsonFile<any[]>(STUDENTS_FILE, []);
  const completed = attempts.filter(a => a.status === 'completed');

  // Overall stats
  const totalAttempts = completed.length;
  const uniqueStudentsTested = new Set(completed.map(a => a.studentId)).size;
  const avgScore = totalAttempts > 0
    ? Math.round(completed.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalAttempts)
    : 0;

  const jobReadyCount = completed.filter(a => a.level === 'Job-ready').length;
  const jobReadyRate = totalAttempts > 0 ? Math.round((jobReadyCount / totalAttempts) * 100) : 0;

  // Track averages
  const trackStats: Record<string, { sum: number; count: number; name: string }> = {};
  for (const t of TRACK_DEFINITIONS) {
    trackStats[t.id] = { sum: 0, count: 0, name: t.name };
  }

  for (const a of completed) {
    if (a.track && a.percentage !== undefined) {
      if (!trackStats[a.track]) {
        trackStats[a.track] = { sum: 0, count: 0, name: a.track };
      }
      trackStats[a.track].sum += a.percentage;
      trackStats[a.track].count += 1;
    }
  }

  const trackAverages = Object.entries(trackStats).map(([trackId, stat]) => ({
    trackId,
    trackName: stat.name,
    attemptCount: stat.count,
    averagePercentage: stat.count > 0 ? Math.round(stat.sum / stat.count) : null
  }));

  // Branch averages: join student data
  const studentMap = new Map<string, any>();
  for (const s of students) {
    studentMap.set(s.id, s);
    studentMap.set(s.rollNo, s);
    studentMap.set(s.email, s);
  }

  const branchStats: Record<string, { sum: number; count: number }> = {
    CSE: { sum: 0, count: 0 },
    AIML: { sum: 0, count: 0 },
    IT: { sum: 0, count: 0 },
    ECE: { sum: 0, count: 0 },
    ME: { sum: 0, count: 0 },
    CE: { sum: 0, count: 0 }
  };

  for (const a of completed) {
    const s = studentMap.get(a.studentId);
    const branch = normalizeBranch(s?.branch || a.studentBranch);
    if (!branchStats[branch]) {
      branchStats[branch] = { sum: 0, count: 0 };
    }
    branchStats[branch].sum += a.percentage || 0;
    branchStats[branch].count += 1;
  }

  const branchAverages = Object.entries(branchStats).map(([branch, stat]) => ({
    branch,
    attemptCount: stat.count,
    averagePercentage: stat.count > 0 ? Math.round(stat.sum / stat.count) : null
  }));

  // Students with 0 attempts
  const testedStudentIds = new Set(completed.map(a => a.studentId));
  const studentsWithNoAttempts = students
    .filter(s => !testedStudentIds.has(s.id) && !testedStudentIds.has(s.rollNo) && !testedStudentIds.has(s.email))
    .slice(0, 50)
    .map(s => ({
      id: s.id,
      rollNo: s.rollNo,
      name: s.name,
      email: s.email,
      branch: normalizeBranch(s.branch),
      year: s.year || 3,
      cgpa: s.cgpa
    }));

  return res.json({
    totalAttempts,
    uniqueStudentsTested,
    totalStudents: students.length,
    overallAveragePercentage: avgScore,
    jobReadyRate,
    trackAverages,
    branchAverages,
    studentsWithNoAttemptsCount: students.length - uniqueStudentsTested,
    studentsWithNoAttempts,
    recentAttempts: completed.slice(0, 15)
  });
});

export default router;
