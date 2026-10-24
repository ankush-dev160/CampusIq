import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In Vercel serverless environment, files are in project root
const DATA_DIR = path.resolve(__dirname, '../server/seed-data/json');
const QUESTION_BANK_FILE = path.join(DATA_DIR, 'question_bank.json');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
const TEST_ATTEMPTS_FILE = path.join('/tmp', 'test_attempts.json');

// Memory cache for attempts in serverless runtime
let memoryAttempts = [];

function readJsonFile(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch {
    // If filesystem is read-only, keep in memory
  }
}

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

export const BRANCH_TRACK_MAP = {
  CSE: ['dsa', 'database-sql', 'web-dev', 'cyber-security', 'aptitude'],
  AIML: ['ai-ml', 'dsa', 'database-sql', 'aptitude'],
  IT: ['web-dev', 'database-sql', 'cloud-devops', 'cyber-security', 'aptitude'],
  ECE: ['embedded-iot', 'vlsi-digital', 'comm-systems', 'aptitude'],
  ME: ['core-mech', 'cad-cam-robotics', 'aptitude'],
  CE: ['civil-structures', 'aptitude']
};

function normalizeBranch(branch) {
  if (!branch) return 'CSE';
  const b = String(branch).toUpperCase();
  if (b.includes('CSE') || b.includes('COMPUTER')) return 'CSE';
  if (b.includes('AIML') || b.includes('ARTIFICIAL')) return 'AIML';
  if (b.includes('IT') || b.includes('INFORMATION')) return 'IT';
  if (b.includes('ECE') || b.includes('ELECTRONIC') || b.includes('COMM')) return 'ECE';
  if (b.includes('ME') || b.includes('MECHANIC')) return 'ME';
  if (b.includes('CE') || b.includes('CIVIL')) return 'CE';
  return 'CSE';
}

function sendJson(res, statusCode, data) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.statusCode = statusCode;
  res.end(JSON.stringify(data));
}

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.statusCode = 204;
    return res.end();
  }

  const host = req.headers.host || 'localhost';
  const urlObj = new URL(req.url, `http://${host}`);
  const pathname = urlObj.pathname;

  // Health
  if (pathname === '/api/health' || pathname === '/api') {
    return sendJson(res, 200, {
      status: 'ok',
      service: 'EduPulse Serverless API on Vercel',
      timestamp: new Date().toISOString()
    });
  }

  // 1. GET /api/placement/tracks
  if (req.method === 'GET' && pathname === '/api/placement/tracks') {
    const branchParam = urlObj.searchParams.get('branch');
    const normalizedBranch = normalizeBranch(branchParam);
    const suggestedTrackIds = BRANCH_TRACK_MAP[normalizedBranch] || BRANCH_TRACK_MAP.CSE;

    const tracks = TRACK_DEFINITIONS.map(t => ({
      ...t,
      isSuggested: suggestedTrackIds.includes(t.id)
    }));

    tracks.sort((a, b) => {
      if (a.isSuggested && !b.isSuggested) return -1;
      if (!a.isSuggested && b.isSuggested) return 1;
      return 0;
    });

    return sendJson(res, 200, {
      branch: normalizedBranch,
      suggestedTrackIds,
      tracks
    });
  }

  // 2. GET /api/placement/questions
  if (req.method === 'GET' && pathname === '/api/placement/questions') {
    const track = urlObj.searchParams.get('track');
    const difficulty = urlObj.searchParams.get('difficulty');
    const limit = parseInt(urlObj.searchParams.get('limit') || '100', 10);

    let questions = readJsonFile(QUESTION_BANK_FILE, []);
    if (track) questions = questions.filter(q => q.track.toLowerCase() === track.toLowerCase());
    if (difficulty) questions = questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());

    const trackCounts = {};
    for (const q of readJsonFile(QUESTION_BANK_FILE, [])) {
      trackCounts[q.track] = (trackCounts[q.track] || 0) + 1;
    }

    return sendJson(res, 200, {
      total: questions.length,
      trackCounts,
      questions: questions.slice(0, Math.min(limit, 400))
    });
  }

  // 3. POST /api/placement/tests/start
  if (req.method === 'POST' && pathname === '/api/placement/tests/start') {
    const body = await parseBody(req);
    const { studentId, track, mode = 'quick' } = body;

    if (!studentId || !track) {
      return sendJson(res, 400, { error: 'studentId and track are required' });
    }

    const allQuestions = readJsonFile(QUESTION_BANK_FILE, []);
    const trackQuestions = allQuestions.filter(q => q.track.toLowerCase() === track.toLowerCase());

    if (trackQuestions.length === 0) {
      return sendJson(res, 404, { error: `No questions found for track '${track}'` });
    }

    const requestedCount = mode === 'standard' ? 20 : 10;
    const count = Math.min(requestedCount, trackQuestions.length);
    const shuffled = [...trackQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    const attemptId = `ATT-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const newAttempt = {
      attemptId,
      studentId,
      track,
      mode: mode === 'standard' ? 'standard' : 'quick',
      questionCount: selected.length,
      questionIds: selected.map(q => q.id),
      startedAt: new Date().toISOString(),
      status: 'in-progress'
    };

    memoryAttempts.push(newAttempt);
    writeJsonFile(TEST_ATTEMPTS_FILE, memoryAttempts);

    // SECURITY: Exclude correctIndex and explanation from payload!
    const sanitizedQuestions = selected.map(q => ({
      id: q.id,
      track: q.track,
      topic: q.topic,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options,
      isSample: q.isSample
    }));

    return sendJson(res, 200, {
      attemptId,
      track,
      mode: newAttempt.mode,
      totalQuestions: sanitizedQuestions.length,
      timeLimitMinutes: count,
      timeLimitSeconds: count * 60,
      startedAt: newAttempt.startedAt,
      questions: sanitizedQuestions
    });
  }

  // 4. POST /api/placement/tests/:attemptId/submit
  const submitMatch = pathname.match(/^\/api\/placement\/tests\/([^/]+)\/submit$/);
  if (req.method === 'POST' && submitMatch) {
    const attemptId = submitMatch[1];
    const body = await parseBody(req);
    const { studentId, answers = {}, timeSpentSeconds = 0 } = body;

    if (!studentId) return sendJson(res, 400, { error: 'studentId is required' });

    let attempts = memoryAttempts.length ? memoryAttempts : readJsonFile(TEST_ATTEMPTS_FILE, []);
    const attemptIndex = attempts.findIndex(a => a.attemptId === attemptId);

    if (attemptIndex === -1) {
      return sendJson(res, 404, { error: 'Test attempt not found' });
    }

    const attempt = attempts[attemptIndex];

    if (attempt.studentId !== studentId) {
      return sendJson(res, 403, { error: 'Forbidden: You can only submit your own test attempt.' });
    }

    if (attempt.status === 'completed') {
      return sendJson(res, 403, { error: 'Forbidden: Test already submitted. Multiple submissions not allowed.' });
    }

    // Server-side scoring
    const allQuestions = readJsonFile(QUESTION_BANK_FILE, []);
    const questionMap = new Map(allQuestions.map(q => [q.id, q]));

    let score = 0;
    const total = attempt.questionIds.length;
    const topicStats = {};
    const review = [];

    for (let i = 0; i < attempt.questionIds.length; i++) {
      const qId = attempt.questionIds[i];
      const q = questionMap.get(qId);
      if (!q) continue;

      const studentChoice = answers[qId] !== undefined ? Number(answers[qId]) : null;
      const isCorrect = studentChoice === q.correctIndex;

      if (isCorrect) score++;

      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { total: 0, correct: 0 };
      }
      topicStats[q.topic].total++;
      if (isCorrect) topicStats[q.topic].correct++;

      review.push({
        questionNumber: i + 1,
        questionId: q.id,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        studentSelected: studentChoice,
        isCorrect,
        explanation: q.explanation,
        topic: q.topic,
        difficulty: q.difficulty
      });
    }

    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    let level = 'Beginner';
    if (percentage >= 70) level = 'Job-ready';
    else if (percentage >= 40) level = 'Intermediate';

    const topicBreakdown = Object.entries(topicStats).map(([topic, stats]) => ({
      topic,
      total: stats.total,
      correct: stats.correct,
      accuracy: Math.round((stats.correct / stats.total) * 100)
    }));

    const strengths = topicBreakdown.filter(t => t.accuracy >= 70).map(t => t.topic);
    const weakTopics = topicBreakdown.filter(t => t.accuracy < 70).map(t => t.topic);

    const completedAttempt = {
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
    memoryAttempts = attempts;
    writeJsonFile(TEST_ATTEMPTS_FILE, attempts);

    return sendJson(res, 200, {
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
      whatToPractiseNext: weakTopics.length > 0 ? weakTopics.map(t => `Focus on ${t}`) : ['Great performance! Continue timed practice.'],
      review
    });
  }

  // 5. GET /api/placement/attempts/:studentId
  const attemptsMatch = pathname.match(/^\/api\/placement\/attempts\/([^/]+)$/);
  if (req.method === 'GET' && attemptsMatch) {
    const studentId = attemptsMatch[1];
    const allAttempts = memoryAttempts.length ? memoryAttempts : readJsonFile(TEST_ATTEMPTS_FILE, []);
    const studentAttempts = allAttempts.filter(a => a.studentId === studentId && a.status === 'completed');

    return sendJson(res, 200, {
      studentId,
      totalAttempts: studentAttempts.length,
      latestAttempt: studentAttempts[0] || null,
      overallReadinessScore: studentAttempts.length ? Math.round(studentAttempts.reduce((s, a) => s + (a.percentage || 0), 0) / studentAttempts.length) : null,
      overallLevel: 'Intermediate',
      attempts: studentAttempts
    });
  }

  // Fallback 404
  return sendJson(res, 404, { error: `Not found: ${pathname}` });
}
