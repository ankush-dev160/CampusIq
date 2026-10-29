import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../seed-data/json');

const QUESTION_BANK_FILE = path.join(DATA_DIR, 'question_bank.json');
const TEST_ATTEMPTS_FILE = path.join(DATA_DIR, 'test_attempts.json');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
const FACULTY_FILE = path.join(DATA_DIR, 'faculty.json');

const PORT = process.env.PORT || 5000;

function readJsonFile(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
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

export function normalizeBranch(branch) {
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
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost:5000'}`);
  const pathname = urlObj.pathname;

  // Read Body helper
  function getRequestBody(callback) {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 5 * 1024 * 1024) {
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        callback(null, parsed);
      } catch (e) {
        callback(e);
      }
    });
  }

  // Health
  if (req.method === 'GET' && pathname === '/api/health') {
    return sendJson(res, 200, { status: 'ok', service: 'CampusIQ Server', timestamp: new Date().toISOString() });
  }

  // GET /api/students (and /api/placement/students)
  if (req.method === 'GET' && (pathname === '/api/students' || pathname === '/api/placement/students')) {
    const branch = urlObj.searchParams.get('branch');
    const year = urlObj.searchParams.get('year');
    const semester = urlObj.searchParams.get('semester');
    const search = urlObj.searchParams.get('search');

    let students = readJsonFile(STUDENTS_FILE, []);

    if (branch && branch !== 'All') {
      students = students.filter(s => s.branch && s.branch.toLowerCase() === branch.toLowerCase());
    }
    if (year && year !== 'All') {
      students = students.filter(s => String(s.year) === String(year));
    }
    if (semester && semester !== 'All') {
      students = students.filter(s => String(s.currentSemester) === String(semester));
    }
    if (search) {
      const q = search.toLowerCase();
      students = students.filter(s =>
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.rollNo && s.rollNo.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q))
      );
    }

    return sendJson(res, 200, {
      total: students.length,
      students
    });
  }

  // GET /api/faculty
  if (req.method === 'GET' && pathname === '/api/faculty') {
    const faculty = readJsonFile(FACULTY_FILE, []);
    return sendJson(res, 200, {
      total: faculty.length,
      faculty
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
    if (track) {
      questions = questions.filter(q => q.track.toLowerCase() === track.toLowerCase());
    }
    if (difficulty) {
      questions = questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

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

  // 3. POST /api/placement/questions
  if (req.method === 'POST' && pathname === '/api/placement/questions') {
    return getRequestBody((err, body) => {
      if (err) return sendJson(res, 400, { error: 'Invalid JSON payload' });
      const { id, track, topic, difficulty, question, options, correctIndex, explanation } = body;

      if (!track || !topic || !question || !Array.isArray(options) || options.length !== 4 || correctIndex === undefined || !explanation) {
        return sendJson(res, 400, { error: 'Missing required question fields. 4 options and valid correctIndex (0-3) are mandatory.' });
      }

      const questions = readJsonFile(QUESTION_BANK_FILE, []);
      let updatedQuestion;

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
          return sendJson(res, 404, { error: 'Question ID not found for update' });
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
      return sendJson(res, 200, { success: true, question: updatedQuestion });
    });
  }

  // 4. POST /api/placement/tests/start
  if (req.method === 'POST' && pathname === '/api/placement/tests/start') {
    return getRequestBody((err, body) => {
      if (err) return sendJson(res, 400, { error: 'Invalid JSON' });
      const { studentId, track, mode = 'quick' } = body;

      if (!studentId) return sendJson(res, 400, { error: 'studentId is required' });
      if (!track) return sendJson(res, 400, { error: 'track is required' });

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

      const students = readJsonFile(STUDENTS_FILE, []);
      const studentMeta = students.find(s => s.id === studentId || s.rollNo === studentId || s.email === studentId);

      const newAttempt = {
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

      const attempts = readJsonFile(TEST_ATTEMPTS_FILE, []);
      attempts.push(newAttempt);
      writeJsonFile(TEST_ATTEMPTS_FILE, attempts);

      // SECURITY: Exclude correctIndex and explanation!
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
    });
  }

  // 5. POST /api/placement/tests/:attemptId/submit
  const submitMatch = pathname.match(/^\/api\/placement\/tests\/([^/]+)\/submit$/);
  if (req.method === 'POST' && submitMatch) {
    const attemptId = submitMatch[1];
    return getRequestBody((err, body) => {
      if (err) return sendJson(res, 400, { error: 'Invalid JSON' });
      const { studentId, answers = {}, timeSpentSeconds = 0 } = body;

      if (!studentId) return sendJson(res, 400, { error: 'studentId is required' });

      const attempts = readJsonFile(TEST_ATTEMPTS_FILE, []);
      const attemptIndex = attempts.findIndex(a => a.attemptId === attemptId);

      if (attemptIndex === -1) {
        return sendJson(res, 404, { error: 'Test attempt not found' });
      }

      const attempt = attempts[attemptIndex];

      // Anti-tamper 1: Student check
      if (attempt.studentId !== studentId) {
        return sendJson(res, 403, {
          error: 'Forbidden: You can only submit your own test attempt.'
        });
      }

      // Anti-tamper 2: Re-submission check
      if (attempt.status === 'completed') {
        return sendJson(res, 403, {
          error: 'Forbidden: Test already submitted. Multiple submissions are not allowed.'
        });
      }

      // Server-side scoring
      const allQuestions = readJsonFile(QUESTION_BANK_FILE, []);
      const questionMap = new Map();
      for (const q of allQuestions) {
        questionMap.set(q.id, q);
      }

      let score = 0;
      const total = attempt.questionIds.length;
      const topicStats = {};

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

        if (isCorrect) score += 1;

        if (!topicStats[q.topic]) {
          topicStats[q.topic] = { total: 0, correct: 0 };
        }
        topicStats[q.topic].total += 1;
        if (isCorrect) topicStats[q.topic].correct += 1;

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
      let level;
      if (percentage >= 70) {
        level = 'Job-ready';
      } else if (percentage >= 40) {
        level = 'Intermediate';
      } else {
        level = 'Beginner';
      }

      const topicBreakdown = Object.entries(topicStats).map(([topic, stats]) => ({
        topic,
        total: stats.total,
        correct: stats.correct,
        accuracy: Math.round((stats.correct / stats.total) * 100)
      }));

      const strengths = topicBreakdown.filter(t => t.accuracy >= 70).map(t => t.topic);
      const weakTopics = topicBreakdown.filter(t => t.accuracy < 70).map(t => t.topic);

      const whatToPractiseNext = weakTopics.length > 0
        ? weakTopics.map(topic => `Focus on ${topic}: review core principles and complete 5-10 practice MCQs.`)
        : ['Excellent performance across all topics! Continue to advanced timed practice or mock interview rounds.'];

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
        whatToPractiseNext,
        review
      });
    });
  }

  // 6. GET /api/placement/attempts/:studentId
  const attemptsMatch = pathname.match(/^\/api\/placement\/attempts\/([^/]+)$/);
  if (req.method === 'GET' && attemptsMatch) {
    const studentId = attemptsMatch[1];
    const allAttempts = readJsonFile(TEST_ATTEMPTS_FILE, []);

    const studentAttempts = allAttempts
      .filter(a => a.studentId === studentId && a.status === 'completed')
      .sort((a, b) => new Date(b.submittedAt || b.startedAt).getTime() - new Date(a.submittedAt || a.startedAt).getTime());

    const bestScorePerTrack = {};
    const trackTrends = {};

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

      if (!trackTrends[a.track]) trackTrends[a.track] = [];
      trackTrends[a.track].push({
        date: (a.submittedAt || a.startedAt).split('T')[0],
        percentage: a.percentage,
        score: a.score
      });
    }

    let overallReadinessScore = null;
    let overallLevel = 'Beginner';
    if (studentAttempts.length > 0) {
      const percentages = Object.values(bestScorePerTrack).map(b => b.percentage);
      if (percentages.length > 0) {
        overallReadinessScore = Math.round(percentages.reduce((sum, p) => sum + p, 0) / percentages.length);
        if (overallReadinessScore >= 70) overallLevel = 'Job-ready';
        else if (overallReadinessScore >= 40) overallLevel = 'Intermediate';
        else overallLevel = 'Beginner';
      }
    }

    return sendJson(res, 200, {
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
  }

  // 7. GET /api/placement/admin/analytics
  if (req.method === 'GET' && pathname === '/api/placement/admin/analytics') {
    const attempts = readJsonFile(TEST_ATTEMPTS_FILE, []);
    const students = readJsonFile(STUDENTS_FILE, []);
    const completed = attempts.filter(a => a.status === 'completed');

    const totalAttempts = completed.length;
    const uniqueStudentsTested = new Set(completed.map(a => a.studentId)).size;
    const avgScore = totalAttempts > 0
      ? Math.round(completed.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalAttempts)
      : 0;

    const jobReadyCount = completed.filter(a => a.level === 'Job-ready').length;
    const jobReadyRate = totalAttempts > 0 ? Math.round((jobReadyCount / totalAttempts) * 100) : 0;

    const trackStats = {};
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

    const studentMap = new Map();
    for (const s of students) {
      studentMap.set(s.id, s);
      studentMap.set(s.rollNo, s);
      studentMap.set(s.email, s);
    }

    const branchStats = {
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

    return sendJson(res, 200, {
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
  }

  // 404 for unknown
  sendJson(res, 404, { error: 'Not Found' });
});

server.listen(PORT, () => {
  console.log(`✓ CampusIQ Standalone Placement API Server running on http://localhost:${PORT}`);
  console.log(`✓ Ready for requests at http://localhost:${PORT}/api/placement`);
});
