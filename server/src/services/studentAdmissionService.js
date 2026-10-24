import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../seed-data/json');

// Default bcrypt hash for password '@123'
const DEFAULT_PASSWORD_HASH = '$2b$10$Eui2E49lD3qdbEu0efLp9.qDDfOk5RUMQRzGXX050s98poE91hAGy';

const BRANCH_NAMES = {
  CSE: 'Computer Science & Engineering',
  AIML: 'Artificial Intelligence & Machine Learning',
  IT: 'Information Technology',
  ECE: 'Electronics & Communication Engineering',
  ME: 'Mechanical Engineering',
  CE: 'Civil Engineering',
};

function readJsonFile(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return [];
  }
}

function writeJsonFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
}

/**
 * Generates the next race-safe unique roll number for a given branch and year.
 * Format: [AdmissionYear][BRANCH][3-digit serial], e.g. 2026CSE017
 */
export function generateNextRollNo(admissionYear, branch, existingStudents) {
  const prefix = `${admissionYear}${branch.toUpperCase()}`;
  const regex = new RegExp(`^${prefix}(\\d{3})$`);
  
  let maxSerial = 0;
  for (const s of existingStudents) {
    const roll = s.rollNo || s.id;
    const match = roll.match(regex);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxSerial) maxSerial = num;
    }
  }

  const nextSerial = String(maxSerial + 1).padStart(3, '0');
  return `${prefix}${nextSerial}`;
}

/**
 * Generates a unique institutional email: firstname.lastname@ustu.edu.in
 * Appends numbers if duplicates exist (e.g. riya.patel2@ustu.edu.in)
 */
export function generateUniqueEmail(fullName, existingUsers) {
  const parts = fullName.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const first = parts[0] || 'student';
  const last = parts.length > 1 ? parts[parts.length - 1] : 'user';
  const baseEmail = `${first}.${last}@ustu.edu.in`;

  const existingEmails = new Set(existingUsers.map(u => (u.email || '').toLowerCase()));
  if (!existingEmails.has(baseEmail)) {
    return baseEmail;
  }

  let counter = 2;
  while (existingEmails.has(`${first}.${last}${counter}@ustu.edu.in`)) {
    counter++;
  }
  return `${first}.${last}${counter}@ustu.edu.in`;
}

/**
 * Creates a new student record and all associated records atomically.
 */
export function admitStudent(input, createdBy = { id: 'ADM-SYS-01', role: 'admin', name: 'System Administrator' }) {
  const {
    name,
    branch,
    year = 1,
    division = 'A',
    gender = 'Male',
    dob,
    phone,
    guardianName,
    guardianPhone,
    city = 'Jaipur',
    state = 'Rajasthan',
    bloodGroup = 'B+',
    generateSampleHistory = false,
  } = input;

  // Validation
  if (!name || !name.trim()) throw new Error('Full name is required');
  if (!branch) throw new Error('Branch is required');
  if (!BRANCH_NAMES[branch.toUpperCase()]) throw new Error(`Invalid branch: ${branch}`);
  if (!phone || !/^[6-9]\d{9}$/.test(String(phone).trim())) {
    throw new Error('Phone must be a valid 10-digit mobile number starting with 6-9');
  }

  const cleanBranch = branch.toUpperCase();
  const numYear = Number(year);
  const admissionYear = 2026 - (numYear - 1);
  const currentSemester = numYear * 2 - 1;
  const batch = `${admissionYear}-${admissionYear + 4}`;

  // Read existing datasets
  const students = readJsonFile('students.json');
  const users = readJsonFile('users.json');
  const subjects = readJsonFile('subjects.json');
  const enrollments = readJsonFile('enrollments_current.json');
  const fees = readJsonFile('fees.json');
  const notifications = readJsonFile('notifications.json');
  const auditLogs = readJsonFile('audit_logs.json');

  // Check for duplicate phone or duplicate name + dob + branch
  const phoneDuplicate = students.find(s => s.phone === String(phone).trim());
  if (phoneDuplicate) {
    throw new Error(`A student with phone number ${phone} is already registered (${phoneDuplicate.rollNo} - ${phoneDuplicate.name})`);
  }

  if (dob) {
    const identDuplicate = students.find(
      s => s.name.toLowerCase() === name.trim().toLowerCase() && s.dob === dob && s.branch === cleanBranch
    );
    if (identDuplicate) {
      throw new Error(`Duplicate student detected with identical name, birth date, and branch (${identDuplicate.rollNo})`);
    }
  }

  // 1. Generate unique roll number & institutional email
  const rollNo = generateNextRollNo(admissionYear, cleanBranch, students);
  const email = generateUniqueEmail(name, users);

  // 2. Build Student Document
  const newStudent = {
    id: rollNo,
    name: name.trim(),
    rollNo,
    email,
    phone: String(phone).trim(),
    gender,
    dob: dob || '2008-01-01',
    branch: cleanBranch,
    branchName: BRANCH_NAMES[cleanBranch],
    division: division.toUpperCase(),
    year: numYear,
    currentSemester,
    admissionYear,
    batch,
    bloodGroup,
    address: {
      city: city.trim(),
      state: state.trim(),
    },
    guardianName: guardianName ? guardianName.trim() : 'Guardian',
    guardianPhone: guardianPhone ? String(guardianPhone).trim() : '9876543210',
    cgpa: generateSampleHistory ? 7.65 : null,
    activeBacklogs: 0,
    totalCreditsEarned: generateSampleHistory ? (numYear - 1) * 22 : 0,
    status: 'Active',
    createdAt: new Date().toISOString(),
    isSample: !!generateSampleHistory,
  };

  // 3. Build User Auth Document
  const newUser = {
    id: `USR-${rollNo}`,
    email,
    rollNo,
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'student',
    refId: rollNo,
    isActive: true,
    mustChangePassword: true,
    lastLogin: null,
    createdAt: new Date().toISOString(),
  };

  // 4. Enroll in current semester subjects
  const relevantSubjects = subjects.filter(s => {
    if (currentSemester === 1) {
      return s.semester === 1 && (s.branch === 'COMMON' || s.branch === cleanBranch);
    }
    return s.semester === currentSemester && (s.branch === cleanBranch || s.branch === 'COMMON');
  });

  const newEnrollments = relevantSubjects.map(sub => ({
    studentId: rollNo,
    subjectCode: sub.code,
    semester: currentSemester,
    academicYear: '2026-27',
    enrolledAt: new Date().toISOString(),
  }));

  // 5. Generate Fee Ledger
  const newFeeRecords = [];
  for (let sem = 1; sem <= currentSemester; sem++) {
    const isCurrent = sem === currentSemester;
    newFeeRecords.push({
      id: `FEE-${rollNo}-S${sem}`,
      studentId: rollNo,
      semester: sem,
      academicYear: `${2026 - Math.floor((currentSemester - sem) / 2)}-${2027 - Math.floor((currentSemester - sem) / 2)}`,
      tuitionFee: 62500,
      examFee: 2500,
      otherFees: 3500,
      totalFee: 68500,
      paidAmount: isCurrent ? 0 : 68500,
      dueAmount: isCurrent ? 68500 : 0,
      dueDate: '2026-11-30',
      status: isCurrent ? 'Pending' : 'Paid',
      createdAt: new Date().toISOString(),
    });
  }

  // 6. Welcome Notification
  const newNotification = {
    id: `NTF-${Date.now().toString().slice(-5)}`,
    userId: rollNo,
    type: 'welcome',
    title: 'Welcome to EduPulse Campus ERP',
    message: `Welcome, ${name}! Your roll number is ${rollNo}. Please explore your enrolled subjects and update your password on first login.`,
    isRead: false,
    createdAt: new Date().toISOString().split('T')[0],
  };

  // 7. Audit Log
  const auditEntry = {
    id: `AUDIT-${Date.now()}`,
    action: 'STUDENT_ADMISSION',
    performerId: createdBy.id,
    performerRole: createdBy.role,
    targetId: rollNo,
    targetName: name,
    details: `Admitted student ${name} (${rollNo}) into ${cleanBranch} Year ${numYear} Division ${division}`,
    timestamp: new Date().toISOString(),
  };

  // Commit all writes
  students.push(newStudent);
  users.push(newUser);
  enrollments.push(...newEnrollments);
  fees.push(...newFeeRecords);
  notifications.push(newNotification);
  auditLogs.push(auditEntry);

  writeJsonFile('students.json', students);
  writeJsonFile('users.json', users);
  writeJsonFile('enrollments_current.json', enrollments);
  writeJsonFile('fees.json', fees);
  writeJsonFile('notifications.json', notifications);
  writeJsonFile('audit_logs.json', auditLogs);

  return {
    success: true,
    student: newStudent,
    credentials: {
      email,
      rollNo,
      defaultPassword: '@123',
      mustChangePassword: true,
    },
    enrolledSubjectsCount: newEnrollments.length,
    enrolledSubjects: relevantSubjects.map(s => s.code),
    feesCreatedCount: newFeeRecords.length,
  };
}
