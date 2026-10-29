/**
 * Portal Data — shared demo student/faculty data for Student and Faculty portals.
 * All data is synthetic demo data. No real student information.
 */

export type PortalRole = 'landing' | 'login' | 'student' | 'faculty' | 'admin';

export interface SemesterSubject {
  code: string;
  name: string;
  faculty: string;
  credits: number;
  test1: number;
  test2: number;
  assignment: number;
  practical: number;
  internal_pct: number;
  grade: string;
  status: 'Safe' | 'Watch' | 'Critical';
}

export interface SemesterRecord {
  semester: string;
  semNumber: number;
  sgpa: number;
  credits: number;
  attendance: number;
  backlogs: number;
  status: 'Pass' | 'Pass with Backlog' | 'In Progress';
  subjects: SemesterSubject[];
}

// --- The logged-in demo student ---
export const DEMO_STUDENT = {
  id: 'EP-CS-022',
  name: 'Ganesh Sharma',
  department: 'Computer Science',
  academic_year: '3rd Year',
  semester: 'Sem 5',
  email: 'ganesh.sharma22@campusiq.edu',
  roll_no: 'CS21B022',
  phone: '+91 9876543211',
  dob: '2003-04-16',
  address: 'Coimbatore, Tamil Nadu',
  guardian: 'Ramesh Sharma',
  avatar_initials: 'GS',

  // Academic
  cgpa: 7.85,
  sgpa_history: [
    { semester: 'Sem 1', sgpa: 7.7, credits: 19, attendance: 84 },
    { semester: 'Sem 2', sgpa: 7.95, credits: 20, attendance: 86 },
    { semester: 'Sem 3', sgpa: 8.0, credits: 18, attendance: 82 },
    { semester: 'Sem 4', sgpa: 7.75, credits: 18, attendance: 79 },
    { semester: 'Sem 5', sgpa: 7.85, credits: 19, attendance: 82 },
  ],
  backlogs: 0,
  internal_marks: 82,

  // Current semester subjects
  subjects: [
    { code: 'CS501', name: 'Machine Learning', faculty: 'Dr. Priya Menon', credits: 4, test1: 18, test2: 19, assignment: 9, practical: 24, internal_pct: 82, grade: 'A', status: 'Safe' as const },
    { code: 'CS502', name: 'Computer Networks', faculty: 'Prof. Suresh Kumar', credits: 4, test1: 16, test2: 17, assignment: 8, practical: 22, internal_pct: 78, grade: 'B+', status: 'Safe' as const },
    { code: 'CS503', name: 'Operating Systems', faculty: 'Dr. Anita Bose', credits: 4, test1: 20, test2: 19, assignment: 10, practical: 25, internal_pct: 86, grade: 'A', status: 'Safe' as const },
    { code: 'CS504', name: 'Database Systems', faculty: 'Dr. Priya Menon', credits: 4, test1: 17, test2: 18, assignment: 9, practical: 23, internal_pct: 80, grade: 'A', status: 'Safe' as const },
    { code: 'CS505', name: 'Software Engineering', faculty: 'Prof. Suresh Kumar', credits: 3, test1: 16, test2: 17, assignment: 8, practical: 21, internal_pct: 78, grade: 'B+', status: 'Safe' as const },
  ],

  // Comprehensive semester-by-semester records
  semester_records: {
    'Sem 1': {
      semester: 'Sem 1',
      semNumber: 1,
      sgpa: 7.7,
      credits: 19,
      attendance: 84,
      backlogs: 0,
      status: 'Pass' as const,
      subjects: [
        { code: 'FY101', name: 'Engineering Mathematics I', faculty: 'Prof. Suresh Kumar', credits: 4, test1: 17, test2: 18, assignment: 8, practical: 22, internal_pct: 78, grade: 'A', status: 'Safe' as const },
        { code: 'FY102', name: 'Engineering Physics', faculty: 'Prof. Harish Chandra Verma', credits: 4, test1: 16, test2: 17, assignment: 9, practical: 23, internal_pct: 79, grade: 'A', status: 'Safe' as const },
        { code: 'FY103', name: 'Programming for Problem Solving', faculty: 'Dr. Anita Bose', credits: 4, test1: 19, test2: 18, assignment: 9, practical: 24, internal_pct: 84, grade: 'A+', status: 'Safe' as const },
        { code: 'FY104', name: 'Basic Electrical Engineering', faculty: 'Prof. Amitav Banerjee', credits: 4, test1: 15, test2: 16, assignment: 8, practical: 20, internal_pct: 73, grade: 'B+', status: 'Safe' as const },
        { code: 'FY105', name: 'Communication Skills', faculty: 'Dr. Priya Menon', credits: 3, test1: 18, test2: 18, assignment: 9, practical: 22, internal_pct: 81, grade: 'A', status: 'Safe' as const },
      ],
    },
    'Sem 2': {
      semester: 'Sem 2',
      semNumber: 2,
      sgpa: 7.95,
      credits: 20,
      attendance: 86,
      backlogs: 0,
      status: 'Pass' as const,
      subjects: [
        { code: 'FY201', name: 'Engineering Mathematics II', faculty: 'Prof. Suresh Kumar', credits: 4, test1: 18, test2: 18, assignment: 9, practical: 23, internal_pct: 82, grade: 'A', status: 'Safe' as const },
        { code: 'FY202', name: 'Engineering Chemistry', faculty: 'Prof. Harish Chandra Verma', credits: 4, test1: 17, test2: 18, assignment: 8, practical: 22, internal_pct: 79, grade: 'A', status: 'Safe' as const },
        { code: 'FY203', name: 'Engineering Graphics', faculty: 'Prof. Vikramaditya Rathore', credits: 4, test1: 19, test2: 19, assignment: 9, practical: 24, internal_pct: 85, grade: 'A+', status: 'Safe' as const },
        { code: 'FY204', name: 'Object Oriented Programming', faculty: 'Dr. Anita Bose', credits: 4, test1: 18, test2: 19, assignment: 9, practical: 24, internal_pct: 84, grade: 'A+', status: 'Safe' as const },
        { code: 'FY205', name: 'Environmental Science', faculty: 'Dr. Kavita Deshmukh', credits: 4, test1: 16, test2: 17, assignment: 8, practical: 21, internal_pct: 76, grade: 'B+', status: 'Safe' as const },
      ],
    },
    'Sem 3': {
      semester: 'Sem 3',
      semNumber: 3,
      sgpa: 8.0,
      credits: 18,
      attendance: 82,
      backlogs: 0,
      status: 'Pass' as const,
      subjects: [
        { code: 'CSE301', name: 'Data Structures', faculty: 'Dr. Anita Bose', credits: 4, test1: 19, test2: 19, assignment: 9, practical: 24, internal_pct: 85, grade: 'A+', status: 'Safe' as const },
        { code: 'CSE302', name: 'Discrete Mathematics', faculty: 'Prof. Suresh Kumar', credits: 4, test1: 17, test2: 18, assignment: 8, practical: 22, internal_pct: 79, grade: 'A', status: 'Safe' as const },
        { code: 'CSE303', name: 'Digital Logic Design', faculty: 'Prof. Amitav Banerjee', credits: 4, test1: 18, test2: 17, assignment: 8, practical: 23, internal_pct: 80, grade: 'A', status: 'Safe' as const },
        { code: 'CSE304', name: 'Computer Organization', faculty: 'Prof. Amitav Banerjee', credits: 3, test1: 17, test2: 18, assignment: 9, practical: 22, internal_pct: 80, grade: 'A', status: 'Safe' as const },
        { code: 'CSE305', name: 'Python Programming', faculty: 'Dr. Priya Menon', credits: 3, test1: 20, test2: 19, assignment: 10, practical: 25, internal_pct: 88, grade: 'A+', status: 'Safe' as const },
      ],
    },
    'Sem 4': {
      semester: 'Sem 4',
      semNumber: 4,
      sgpa: 7.75,
      credits: 18,
      attendance: 79,
      backlogs: 0,
      status: 'Pass' as const,
      subjects: [
        { code: 'CSE401', name: 'Design and Analysis of Algorithms', faculty: 'Dr. Anita Bose', credits: 4, test1: 17, test2: 18, assignment: 8, practical: 22, internal_pct: 78, grade: 'A', status: 'Safe' as const },
        { code: 'CSE402', name: 'Operating Systems', faculty: 'Dr. Priya Menon', credits: 4, test1: 18, test2: 17, assignment: 9, practical: 23, internal_pct: 80, grade: 'A', status: 'Safe' as const },
        { code: 'CSE403', name: 'Database Management Systems', faculty: 'Dr. Priya Menon', credits: 4, test1: 18, test2: 19, assignment: 9, practical: 24, internal_pct: 84, grade: 'A', status: 'Safe' as const },
        { code: 'CSE404', name: 'Theory of Computation', faculty: 'Prof. Suresh Kumar', credits: 3, test1: 16, test2: 16, assignment: 8, practical: 21, internal_pct: 75, grade: 'B+', status: 'Safe' as const },
        { code: 'CSE405', name: 'Software Engineering', faculty: 'Prof. Suresh Kumar', credits: 3, test1: 17, test2: 18, assignment: 8, practical: 22, internal_pct: 79, grade: 'A', status: 'Safe' as const },
      ],
    },
    'Sem 5': {
      semester: 'Sem 5',
      semNumber: 5,
      sgpa: 7.85,
      credits: 19,
      attendance: 82,
      backlogs: 0,
      status: 'Pass' as const,
      subjects: [
        { code: 'CS501', name: 'Machine Learning', faculty: 'Dr. Priya Menon', credits: 4, test1: 18, test2: 19, assignment: 9, practical: 24, internal_pct: 82, grade: 'A', status: 'Safe' as const },
        { code: 'CS502', name: 'Computer Networks', faculty: 'Prof. Suresh Kumar', credits: 4, test1: 16, test2: 17, assignment: 8, practical: 22, internal_pct: 78, grade: 'B+', status: 'Safe' as const },
        { code: 'CS503', name: 'Operating Systems', faculty: 'Dr. Anita Bose', credits: 4, test1: 20, test2: 19, assignment: 10, practical: 25, internal_pct: 86, grade: 'A', status: 'Safe' as const },
        { code: 'CS504', name: 'Database Systems', faculty: 'Dr. Priya Menon', credits: 4, test1: 17, test2: 18, assignment: 9, practical: 23, internal_pct: 80, grade: 'A', status: 'Safe' as const },
        { code: 'CS505', name: 'Software Engineering', faculty: 'Prof. Suresh Kumar', credits: 3, test1: 16, test2: 17, assignment: 8, practical: 21, internal_pct: 78, grade: 'B+', status: 'Safe' as const },
      ],
    },
  } as Record<string, SemesterRecord>,

  // Attendance
  overall_attendance: 82,
  classes_conducted: 120,
  classes_attended: 98,
  subject_attendance: [
    { subject: 'Machine Learning',     pct: 85, conducted: 24, attended: 20, status: 'Safe' as const },
    { subject: 'Computer Networks',    pct: 80, conducted: 24, attended: 19, status: 'Safe' as const },
    { subject: 'Operating Systems',    pct: 88, conducted: 24, attended: 21, status: 'Safe' as const },
    { subject: 'Database Systems',     pct: 75, conducted: 24, attended: 18, status: 'Safe' as const },
    { subject: 'Software Engineering', pct: 71, conducted: 24, attended: 17, status: 'Low' as const },
  ],

  // LMS
  lms_logins: 18,
  assignment_completion: 80,

  // Engagement
  events_participated: 3,
  club_participation: 1,
  hackathons: 1,
  certifications: 2,

  // Placement
  aptitude_score: 65,
  coding_score: 58,
  mock_interview_score: 62,
  placement_prep: true,

  // Skills
  technical_skill_score: 68,
  soft_skill_score: 72,

  // Feedback
  student_satisfaction: 4.0,
  faculty_feedback: 'Good' as 'Excellent' | 'Good' | 'Average' | 'Needs Attention',

  // Success score (pre-computed)
  success_score: 72,
  academic_risk: 'Low' as 'Low' | 'Moderate' | 'High',
  placement_risk: 'Moderate' as 'Low' | 'Moderate' | 'High',
};

// Monthly internal marks trend (for analytics)
export const MONTHLY_MARKS = [
  { month: 'Jun', marks: 68 },
  { month: 'Jul', marks: 72 },
  { month: 'Aug', marks: 70 },
  { month: 'Sep', marks: 75 },
  { month: 'Oct', marks: 72 },
];

// Monthly attendance trend
export const MONTHLY_ATTENDANCE = [
  { month: 'Jun', pct: 80 },
  { month: 'Jul', pct: 75 },
  { month: 'Aug', pct: 82 },
  { month: 'Sep', pct: 76 },
  { month: 'Oct', pct: 78 },
];

// Assessment history
export const ASSESSMENT_HISTORY = [
  { date: '2025-09-28', subject: 'Operating Systems',   type: 'Test 2',     score: 19, max: 20, pct: 95 },
  { date: '2025-09-22', subject: 'Machine Learning',    type: 'Test 2',     score: 19, max: 20, pct: 95 },
  { date: '2025-09-15', subject: 'Database Systems',    type: 'Assignment', score: 9,  max: 10, pct: 90 },
  { date: '2025-09-10', subject: 'Computer Networks',   type: 'Test 2',     score: 16, max: 20, pct: 80 },
  { date: '2025-08-30', subject: 'Software Engineering',type: 'Test 1',     score: 16, max: 20, pct: 80 },
  { date: '2025-08-20', subject: 'Machine Learning',    type: 'Test 1',     score: 18, max: 20, pct: 90 },
  { date: '2025-08-15', subject: 'Operating Systems',   type: 'Test 1',     score: 20, max: 20, pct: 100},
];

// Attendance calendar (October 2025)
export const ATTENDANCE_CALENDAR_OCT: Record<string, 'present' | 'absent' | 'holiday' | 'partial'> = {
  '2025-10-01': 'present',
  '2025-10-02': 'present',
  '2025-10-03': 'present',
  '2025-10-06': 'present',
  '2025-10-07': 'absent',
  '2025-10-08': 'present',
  '2025-10-09': 'present',
  '2025-10-13': 'holiday',
  '2025-10-14': 'present',
  '2025-10-15': 'present',
  '2025-10-16': 'partial',
  '2025-10-17': 'present',
  '2025-10-20': 'present',
  '2025-10-21': 'absent',
  '2025-10-22': 'present',
  '2025-10-23': 'present',
  '2025-10-24': 'present',
};

// Day-wise lecture details
export const DAY_LECTURES: Record<string, Array<{subject: string; time: string; faculty: string; status: 'Present' | 'Absent' | 'Holiday'}>> = {
  '2025-10-07': [
    { subject: 'Machine Learning',    time: '9:00–10:00',   faculty: 'Dr. Priya Menon',    status: 'Absent' },
    { subject: 'Computer Networks',   time: '10:00–11:00',  faculty: 'Prof. Suresh Kumar', status: 'Absent' },
    { subject: 'Operating Systems',   time: '11:00–12:00',  faculty: 'Dr. Anita Bose',     status: 'Absent' },
  ],
  '2025-10-01': [
    { subject: 'Database Systems',    time: '9:00–10:00',   faculty: 'Dr. Priya Menon',    status: 'Present' },
    { subject: 'Software Engineering',time: '10:00–11:00',  faculty: 'Prof. Suresh Kumar', status: 'Present' },
    { subject: 'Machine Learning',    time: '2:00–3:00',    faculty: 'Dr. Priya Menon',    status: 'Present' },
  ],
};

// --- Faculty Demo Data (10 Faculty Members across Departments) ---
export const DEMO_FACULTY = [
  { id: 'FAC-01', name: 'Dr. Priya Menon',    email: 'priya.menon@campusiq.edu',    department: 'Computer Science', subjects: ['Machine Learning', 'Database Systems'], students_count: 54, avatar_initials: 'PM' },
  { id: 'FAC-02', name: 'Prof. Suresh Kumar', email: 'suresh.kumar@campusiq.edu', department: 'Computer Science', subjects: ['Computer Networks', 'Software Engineering'], students_count: 54, avatar_initials: 'SK' },
  { id: 'FAC-03', name: 'Dr. Anita Bose',     email: 'anita.bose@campusiq.edu',     department: 'Computer Science', subjects: ['Operating Systems', 'Algorithm Design'], students_count: 48, avatar_initials: 'AB' },
  { id: 'FAC-04', name: 'Prof. Rajeshwar Rao', email: 'rajeshwar.rao@campusiq.edu', department: 'Information Technology', subjects: ['Cloud Computing', 'Distributed Systems'], students_count: 52, avatar_initials: 'RR' },
  { id: 'FAC-05', name: 'Dr. Meenakshi Sundaram', email: 'meenakshi.sundaram@campusiq.edu', department: 'Electronics & Comm.', subjects: ['Digital Signal Processing', 'VLSI Design'], students_count: 46, avatar_initials: 'MS' },
  { id: 'FAC-06', name: 'Prof. Vikramaditya Rathore', email: 'vikramaditya.rathore@campusiq.edu', department: 'Mechanical Eng.', subjects: ['Thermodynamics', 'Fluid Mechanics'], students_count: 42, avatar_initials: 'VR' },
  { id: 'FAC-07', name: 'Dr. Kavita Deshmukh', email: 'kavita.deshmukh@campusiq.edu', department: 'Civil Eng.', subjects: ['Structural Analysis', 'Geotechnical Eng.'], students_count: 40, avatar_initials: 'KD' },
  { id: 'FAC-08', name: 'Prof. Harish Chandra Verma', email: 'harish.verma@campusiq.edu', department: 'Computer Science', subjects: ['Artificial Intelligence', 'Deep Learning'], students_count: 58, avatar_initials: 'HV' },
  { id: 'FAC-09', name: 'Dr. Ananya Sen',     email: 'ananya.sen@campusiq.edu',     department: 'Information Technology', subjects: ['Cyber Security', 'Cryptography & Network Security'], students_count: 50, avatar_initials: 'AS' },
  { id: 'FAC-10', name: 'Prof. Amitav Banerjee', email: 'amitav.banerjee@campusiq.edu', department: 'Electronics & Comm.', subjects: ['Embedded Systems', 'IoT & Microcontrollers'], students_count: 45, avatar_initials: 'AB' },
];

export const DEMO_FACULTY_CURRENT = DEMO_FACULTY[0];

// Faculty student list (shared across faculty pages)
export const FACULTY_STUDENTS = Array.from({ length: 32 }, (_, i) => {
  const names = [
    'Ankush Sonkar', 'Anmol Nishad', 'Aman Chaubey', 'Kaushik Shinde', 'Yash Sharma',
    'Amaan Khan', 'Nishant Manjhi', 'Aryan Gupta', 'Ganesh Sharma', 'Diya Nair',
    'Rohan Patel', 'Ananya Verma', 'Priya Reddy', 'Aditya Iyer', 'Sneha Chopra',
    'Vikram Malhotra', 'Isha Mehta', 'Rahul Kulkarni', 'Pooja Deshmukh', 'Arjun Sen',
    'Meera Joshi', 'Varun Pillai', 'Neha Shukla', 'Siddharth Rao', 'Tanvi Agarwal',
    'Gaurav Thakur', 'Riya Chatterjee', 'Kunal Bansal', 'Anika Roy', 'Dhruv Pandey',
    'Sanya Mukherjee', 'Harsh Saxena',
  ];
  const cgpas = [8.75, 7.92, 8.45, 8.12, 7.60, 7.35, 6.85, 9.15, 7.85, 8.2, 7.9, 8.8, 8.5, 7.8, 6.9, 5.5, 8.1, 7.4, 6.8, 8.3, 7.1, 5.2, 8.7, 7.5, 6.3, 8.0, 7.3, 6.6, 8.4, 7.6, 5.9, 8.6];
  const attends = [88, 81, 85, 83, 76, 79, 72, 94, 82, 85, 78, 92, 88, 78, 70, 55, 83, 74, 68, 86, 72, 52, 91, 76, 63, 81, 74, 67, 87, 77, 60, 89];
  const backlogs = [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 4, 0, 0, 1, 0, 0, 5, 0, 0, 2, 0, 0, 1, 0, 0, 3, 0];
  const risks = ['Low','Low','Low','Low','Moderate','Low','Moderate','Low','Low','Low','Low','Low','Low','Low','Moderate','High','Low','Low','Moderate','Low','Low','High','Low','Low','Moderate','Low','Low','Moderate','Low','Low','High','Low'] as const;
  
  return {
    roll: `CS21B0${String(i + 1).padStart(2, '0')}`,
    name: names[i] || `Student ${i+1}`,
    cgpa: cgpas[i] || 7.5,
    backlogs: backlogs[i] || 0,
    attendance: attends[i] || 80,
    risk: risks[i] || 'Low',
    attendance_oct: {
      '2025-10-01': i % 5 === 0 ? 'Absent' : 'Present',
      '2025-10-02': i % 7 === 1 ? 'Absent' : 'Present',
      '2025-10-06': i % 4 === 2 ? 'Absent' : 'Present',
      '2025-10-07': i % 3 === 0 ? 'Absent' : 'Present',
      '2025-10-08': 'Present',
      '2025-10-09': i % 6 === 1 ? 'Absent' : 'Present',
    } as Record<string, 'Present' | 'Absent' | 'Holiday'>,
  };
});

export interface ProblemRequest {
  id: string;
  student: string;
  roll: string;
  subject: string;
  topic: string;
  faculty: string;
  description: string;
  priority: 'Normal' | 'Important';
  status: 'Pending' | 'In Progress' | 'Resolved';
  submitted: string;
  reply: string;
  next_step: string;
}

// Problem requests (submitted by students)
export const DEMO_PROBLEMS: ProblemRequest[] = [
  {
    id: 'REQ-001',
    student: 'Anup Sharma',
    roll: 'CS21B022',
    subject: 'Computer Networks',
    topic: 'Subnetting confusion',
    faculty: 'Prof. Suresh Kumar',
    description: 'I am struggling to understand variable-length subnet masking (VLSM) and how to correctly allocate IP addresses across multiple subnets.',
    priority: 'Important' as const,
    status: 'In Progress' as const,
    submitted: '2025-10-05',
    reply: 'I will schedule an extra session on Thursday at 4pm. Please review the first 3 chapters before then.',
    next_step: 'Attend extra session on 2025-10-10',
  },
  {
    id: 'REQ-002',
    student: 'Ananya Verma',
    roll: 'CS21B002',
    subject: 'Machine Learning',
    topic: 'Gradient descent implementation',
    faculty: 'Dr. Priya Menon',
    description: 'My implementation of gradient descent is not converging for the assignment. I have checked the code multiple times but the loss keeps increasing.',
    priority: 'Important' as const,
    status: 'Pending' as const,
    submitted: '2025-10-07',
    reply: '',
    next_step: '',
  },
  {
    id: 'REQ-003',
    student: 'Rohan Patel',
    roll: 'CS21B003',
    subject: 'Operating Systems',
    topic: 'Process scheduling',
    faculty: 'Dr. Anita Bose',
    description: 'I do not understand the difference between preemptive and non-preemptive scheduling with regard to the examples in lecture 8.',
    priority: 'Normal' as const,
    status: 'Resolved' as const,
    submitted: '2025-09-28',
    reply: 'Great question. Preemptive means the OS can interrupt a running process. Check lecture 9 slides for the diagram — it should clarify things.',
    next_step: 'Resolved. Check lecture 9.',
  },
];

// Progress tracker recommendations
export const RECOMMENDATIONS = [
  {
    id: 'REC-01',
    category: 'Placement',
    title: 'Strengthen Coding Skills',
    evidence: 'Coding score (58/100) is below the 65-point threshold typically expected for campus placements.',
    action: 'Complete 3 LeetCode easy problems daily and join the weekly coding contest.',
    priority: 'High' as const,
  },
  {
    id: 'REC-02',
    category: 'Attendance',
    title: 'Improve Computer Networks Attendance',
    evidence: 'Computer Networks attendance is 71% — below the 75% institutional threshold.',
    action: 'Attend all remaining classes for this subject to avoid debarment from exams.',
    priority: 'High' as const,
  },
  {
    id: 'REC-03',
    category: 'Academic',
    title: 'Focus on Software Engineering',
    evidence: 'Internal percentage in Software Engineering (70%) is the lowest across subjects.',
    action: 'Review missed assignments and prepare for the next unit test thoroughly.',
    priority: 'Medium' as const,
  },
  {
    id: 'REC-04',
    category: 'Engagement',
    title: 'Consider Earning an Industry Certification',
    evidence: 'You have 2 certifications — adding one more relevant to your placement domain could strengthen your profile.',
    action: 'Explore AWS Cloud Practitioner or Google Data Analytics certificate programs.',
    priority: 'Low' as const,
  },
];
