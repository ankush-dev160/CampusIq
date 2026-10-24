import {
  PlacementTrack,
  ActiveTest,
  TestResult,
  StudentAttemptsSummary,
  PlacementAdminAnalytics,
} from '../types/placement';

const API_BASE = '/api/placement';

// Default static tracks for immediate offline display & fallback
export const DEFAULT_TRACKS: PlacementTrack[] = [
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

export async function fetchTracks(studentBranch?: string): Promise<{
  branch: string;
  suggestedTrackIds: string[];
  tracks: PlacementTrack[];
}> {
  const normBranch = normalizeBranch(studentBranch);
  try {
    const res = await fetch(`${API_BASE}/tracks?branch=${normBranch}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API error fetching tracks, using fallback:', err);
  }

  // Fallback
  const suggestedTrackIds = BRANCH_TRACK_MAP[normBranch] || BRANCH_TRACK_MAP.CSE;
  const tracks = DEFAULT_TRACKS.map(t => ({
    ...t,
    isSuggested: suggestedTrackIds.includes(t.id)
  }));
  tracks.sort((a, b) => {
    if (a.isSuggested && !b.isSuggested) return -1;
    if (!a.isSuggested && b.isSuggested) return 1;
    return 0;
  });

  return {
    branch: normBranch,
    suggestedTrackIds,
    tracks
  };
}

export async function startTest(
  studentId: string,
  track: string,
  mode: 'quick' | 'standard' = 'quick'
): Promise<ActiveTest> {
  const res = await fetch(`${API_BASE}/tests/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, track, mode })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to start test (${res.status})`);
  }

  return await res.json();
}

export async function submitTest(
  attemptId: string,
  studentId: string,
  answers: Record<string, number>,
  timeSpentSeconds: number
): Promise<TestResult> {
  const res = await fetch(`${API_BASE}/tests/${attemptId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, answers, timeSpentSeconds })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to submit test (${res.status})`);
  }

  return await res.json();
}

export async function fetchStudentAttempts(studentId: string): Promise<StudentAttemptsSummary> {
  try {
    const res = await fetch(`${API_BASE}/attempts/${studentId}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to fetch student attempts:', err);
  }

  return {
    studentId,
    totalAttempts: 0,
    latestAttempt: null,
    overallReadinessScore: null,
    overallLevel: 'Beginner',
    bestScorePerTrack: {},
    trackTrends: {},
    attempts: []
  };
}

export async function fetchAdminAnalytics(): Promise<PlacementAdminAnalytics> {
  const res = await fetch(`${API_BASE}/admin/analytics`);
  if (!res.ok) {
    throw new Error('Failed to fetch admin placement analytics');
  }
  return await res.json();
}

export async function fetchQuestions(track?: string, difficulty?: string, limit = 100): Promise<any> {
  const params = new URLSearchParams();
  if (track) params.append('track', track);
  if (difficulty) params.append('difficulty', difficulty);
  params.append('limit', String(limit));

  const res = await fetch(`${API_BASE}/questions?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch question bank');
  }
  return await res.json();
}

export async function saveQuestion(question: any): Promise<any> {
  const res = await fetch(`${API_BASE}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(question)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to save question');
  }
  return await res.json();
}
