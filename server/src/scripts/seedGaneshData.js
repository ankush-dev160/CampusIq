import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JSON_DIR = path.resolve(__dirname, '../../seed-data/json');
const CSV_DIR = path.resolve(__dirname, '../../seed-data/csv');

// Default bcrypt hash for password '@123'
const PASSWORD_HASH = '$2b$10$Eui2E49lD3qdbEu0efLp9.qDDfOk5RUMQRzGXX050s98poE91hAGy';

function readJson(filename) {
  const p = path.join(JSON_DIR, filename);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(filename, data) {
  const p = path.join(JSON_DIR, filename);
  fs.writeFileSync(p, JSON.stringify(data), 'utf8');
}

export function seedGanesh() {
  console.log('Seeding Ganesh across backend datasets...');

  const rollNo = '2024CSE014';
  const name = 'Ganesh Sharma';
  const ustuEmail = 'ganesh.sharma@ustu.edu.in';
  const edupulseEmail = 'ganesh.sharma22@edupulse.edu';
  const phone = '9876543211';

  // 1. students.json
  const students = readJson('students.json');
  const existingStudentIdx = students.findIndex(s => s.rollNo === rollNo || s.email === ustuEmail || s.email === edupulseEmail);
  const studentDoc = {
    id: rollNo,
    name,
    rollNo,
    email: ustuEmail,
    phone,
    gender: 'Male',
    dob: '2003-04-16',
    branch: 'CSE',
    branchName: 'Computer Science & Engineering',
    division: 'A',
    year: 3,
    currentSemester: 5,
    admissionYear: 2024,
    batch: '2024-2028',
    bloodGroup: 'B+',
    address: {
      city: 'Coimbatore',
      state: 'Tamil Nadu'
    },
    guardianName: 'Ramesh Sharma',
    guardianPhone: '9876543210',
    cgpa: 7.85,
    activeBacklogs: 0,
    totalCreditsEarned: 75,
    status: 'Active'
  };

  if (existingStudentIdx >= 0) {
    students[existingStudentIdx] = studentDoc;
  } else {
    students.push(studentDoc);
  }
  writeJson('students.json', students);
  console.log('✓ students.json updated');

  // 2. users.json
  const users = readJson('users.json');
  const userIndices = [];
  users.forEach((u, idx) => {
    if (u.rollNo === rollNo || u.email === ustuEmail || u.email === edupulseEmail) {
      userIndices.push(idx);
    }
  });

  const ustuUser = {
    id: `USR-${rollNo}`,
    email: ustuEmail,
    rollNo,
    passwordHash: PASSWORD_HASH,
    role: 'student',
    refId: rollNo,
    isActive: true,
    mustChangePassword: false,
    lastLogin: new Date().toISOString(),
    createdAt: '2024-08-01T00:00:00.000Z'
  };

  const edupulseUser = {
    id: `USR-CS21B022`,
    email: edupulseEmail,
    rollNo: 'CS21B022',
    passwordHash: PASSWORD_HASH,
    role: 'student',
    refId: rollNo,
    isActive: true,
    mustChangePassword: false,
    lastLogin: new Date().toISOString(),
    createdAt: '2024-08-01T00:00:00.000Z'
  };

  const cleanUsers = users.filter(u => u.rollNo !== rollNo && u.email !== ustuEmail && u.email !== edupulseEmail && u.email !== 'arjun.sharma21@edupulse.edu');
  cleanUsers.push(ustuUser, edupulseUser);
  writeJson('users.json', cleanUsers);
  console.log('✓ users.json updated with USTU & EduPulse credentials');

  // 3. enrollments_current.json
  const enrollments = readJson('enrollments_current.json').filter(e => e.studentId !== rollNo);
  const sem5Subjects = ['CSE501', 'CSE502', 'CSE503', 'CSE504', 'CSE505'];
  for (const code of sem5Subjects) {
    enrollments.push({
      studentId: rollNo,
      subjectCode: code,
      semester: 5,
      academicYear: '2026-27'
    });
  }
  writeJson('enrollments_current.json', enrollments);
  console.log('✓ enrollments_current.json updated with 5 CSE subjects');

  // 4. fees.json
  const fees = readJson('fees.json').filter(f => f.studentId !== rollNo);
  const feeRecords = [
    {
      id: `FEE-${rollNo}-S1`,
      studentId: rollNo,
      semester: 1,
      academicYear: '2024-2025',
      tuitionFee: 62500,
      examFee: 2500,
      otherFees: 3500,
      totalFee: 68500,
      paidAmount: 68500,
      dueAmount: 0,
      dueDate: '2026-11-30',
      status: 'Paid'
    },
    {
      id: `FEE-${rollNo}-S2`,
      studentId: rollNo,
      semester: 2,
      academicYear: '2024-2025',
      tuitionFee: 62500,
      examFee: 2500,
      otherFees: 3500,
      totalFee: 68500,
      paidAmount: 68500,
      dueAmount: 0,
      dueDate: '2026-11-30',
      status: 'Paid'
    },
    {
      id: `FEE-${rollNo}-S3`,
      studentId: rollNo,
      semester: 3,
      academicYear: '2025-2026',
      tuitionFee: 62500,
      examFee: 2500,
      otherFees: 3500,
      totalFee: 68500,
      paidAmount: 68500,
      dueAmount: 0,
      dueDate: '2026-11-30',
      status: 'Paid'
    },
    {
      id: `FEE-${rollNo}-S4`,
      studentId: rollNo,
      semester: 4,
      academicYear: '2025-2026',
      tuitionFee: 62500,
      examFee: 2500,
      otherFees: 3500,
      totalFee: 68500,
      paidAmount: 68500,
      dueAmount: 0,
      dueDate: '2026-11-30',
      status: 'Paid'
    },
    {
      id: `FEE-${rollNo}-S5`,
      studentId: rollNo,
      semester: 5,
      academicYear: '2026-2027',
      tuitionFee: 62500,
      examFee: 2500,
      otherFees: 3500,
      totalFee: 68500,
      paidAmount: 0,
      dueAmount: 68500,
      dueDate: '2026-11-30',
      status: 'Pending'
    }
  ];
  fees.push(...feeRecords);
  writeJson('fees.json', fees);
  console.log('✓ fees.json updated');

  // 5. payments.json
  const payments = readJson('payments.json').filter(p => p.studentId !== rollNo);
  const paymentRecords = [
    {
      id: `PAY-${rollNo}-1`,
      feeId: `FEE-${rollNo}-S1`,
      studentId: rollNo,
      amount: 68500,
      paymentDate: '2024-08-16',
      mode: 'NetBanking',
      receiptNo: `RCP-2024-G001`,
      transactionRef: 'TXN88912401',
      status: 'Success'
    },
    {
      id: `PAY-${rollNo}-2`,
      feeId: `FEE-${rollNo}-S2`,
      studentId: rollNo,
      amount: 68500,
      paymentDate: '2025-01-14',
      mode: 'NetBanking',
      receiptNo: `RCP-2025-G002`,
      transactionRef: 'TXN88912402',
      status: 'Success'
    },
    {
      id: `PAY-${rollNo}-3`,
      feeId: `FEE-${rollNo}-S3`,
      studentId: rollNo,
      amount: 68500,
      paymentDate: '2025-08-11',
      mode: 'UPI',
      receiptNo: `RCP-2025-G003`,
      transactionRef: 'TXN88912403',
      status: 'Success'
    },
    {
      id: `PAY-${rollNo}-4`,
      feeId: `FEE-${rollNo}-S4`,
      studentId: rollNo,
      amount: 68500,
      paymentDate: '2026-01-20',
      mode: 'NetBanking',
      receiptNo: `RCP-2026-G004`,
      transactionRef: 'TXN88912404',
      status: 'Success'
    }
  ];
  payments.push(...paymentRecords);
  writeJson('payments.json', payments);
  console.log('✓ payments.json updated');

  // 6. semester_results.json
  const semesterResults = readJson('semester_results.json').filter(sr => sr.studentId !== rollNo);
  const resultsRecords = [
    {
      studentId: rollNo,
      semester: 1,
      academicYear: '2024-25',
      creditsRegistered: 19,
      creditsEarned: 19,
      sgpa: 7.7,
      cgpaUpto: 7.7,
      backlogsInSemester: 0,
      attendancePercentage: 83.5,
      result: 'Pass',
      status: 'Published'
    },
    {
      studentId: rollNo,
      semester: 2,
      academicYear: '2024-25',
      creditsRegistered: 20,
      creditsEarned: 20,
      sgpa: 7.95,
      cgpaUpto: 7.83,
      backlogsInSemester: 0,
      attendancePercentage: 84.0,
      result: 'Pass',
      status: 'Published'
    },
    {
      studentId: rollNo,
      semester: 3,
      academicYear: '2025-26',
      creditsRegistered: 18,
      creditsEarned: 18,
      sgpa: 8.0,
      cgpaUpto: 7.88,
      backlogsInSemester: 0,
      attendancePercentage: 81.5,
      result: 'Pass',
      status: 'Published'
    },
    {
      studentId: rollNo,
      semester: 4,
      academicYear: '2025-26',
      creditsRegistered: 18,
      creditsEarned: 18,
      sgpa: 7.75,
      cgpaUpto: 7.85,
      backlogsInSemester: 0,
      attendancePercentage: 82.0,
      result: 'Pass',
      status: 'Published'
    }
  ];
  semesterResults.push(...resultsRecords);
  writeJson('semester_results.json', semesterResults);
  console.log('✓ semester_results.json updated');

  // 7. attendance_summary.json
  const attendanceSummary = readJson('attendance_summary.json').filter(a => a.studentId !== rollNo);
  const subjectList = [
    { code: 'FY101', sem: 1, held: 48, attended: 40, pct: 83.3 },
    { code: 'FY102', sem: 1, held: 50, attended: 42, pct: 84.0 },
    { code: 'FY103', sem: 1, held: 52, attended: 43, pct: 82.7 },
    { code: 'FY104', sem: 1, held: 46, attended: 39, pct: 84.8 },
    { code: 'FY105', sem: 1, held: 48, attended: 39, pct: 81.3 },
    { code: 'FY201', sem: 2, held: 50, attended: 42, pct: 84.0 },
    { code: 'FY202', sem: 2, held: 52, attended: 44, pct: 84.6 },
    { code: 'FY203', sem: 2, held: 48, attended: 40, pct: 83.3 },
    { code: 'FY204', sem: 2, held: 46, attended: 39, pct: 84.8 },
    { code: 'FY205', sem: 2, held: 50, attended: 41, pct: 82.0 },
    { code: 'CSE301', sem: 3, held: 44, attended: 36, pct: 81.8 },
    { code: 'CSE302', sem: 3, held: 46, attended: 38, pct: 82.6 },
    { code: 'CSE303', sem: 3, held: 48, attended: 39, pct: 81.3 },
    { code: 'CSE304', sem: 3, held: 44, attended: 36, pct: 81.8 },
    { code: 'CSE305', sem: 3, held: 46, attended: 37, pct: 80.4 },
    { code: 'CSE401', sem: 4, held: 48, attended: 40, pct: 83.3 },
    { code: 'CSE402', sem: 4, held: 46, attended: 38, pct: 82.6 },
    { code: 'CSE403', sem: 4, held: 44, attended: 36, pct: 81.8 },
    { code: 'CSE404', sem: 4, held: 48, attended: 39, pct: 81.3 },
    { code: 'CSE405', sem: 4, held: 46, attended: 37, pct: 80.4 },
    { code: 'CSE501', sem: 5, held: 34, attended: 28, pct: 82.4 },
    { code: 'CSE502', sem: 5, held: 34, attended: 28, pct: 82.4 },
    { code: 'CSE503', sem: 5, held: 32, attended: 27, pct: 84.4 },
    { code: 'CSE504', sem: 5, held: 34, attended: 27, pct: 79.4 },
    { code: 'CSE505', sem: 5, held: 34, attended: 28, pct: 82.4 }
  ];

  for (const s of subjectList) {
    attendanceSummary.push({
      studentId: rollNo,
      subjectCode: s.code,
      semester: s.sem,
      classesHeld: s.held,
      classesAttended: s.attended,
      percentage: s.pct
    });
  }
  writeJson('attendance_summary.json', attendanceSummary);
  console.log('✓ attendance_summary.json updated (25 subjects, 82% avg)');

  // 8. marks.json
  const marks = readJson('marks.json').filter(m => m.studentId !== rollNo);
  const marksSeed = [
    // Sem 1
    { code: 'FY101', sem: 1, ay: '2024-25', int: 16, mid: 16, ex: 48, tot: 80, g: 'A+', gp: 9, res: 'Pass', st: 'Published' },
    { code: 'FY102', sem: 1, ay: '2024-25', int: 15, mid: 15, ex: 44, tot: 74, g: 'A', gp: 8, res: 'Pass', st: 'Published' },
    { code: 'FY103', sem: 1, ay: '2024-25', int: 14, mid: 15, ex: 42, tot: 71, g: 'A', gp: 8, res: 'Pass', st: 'Published' },
    { code: 'FY104', sem: 1, ay: '2024-25', int: 17, mid: 16, ex: 46, tot: 79, g: 'A', gp: 8, res: 'Pass', st: 'Published' },
    { code: 'FY105', sem: 1, ay: '2024-25', int: 16, mid: 17, ex: 48, tot: 81, g: 'A+', gp: 9, res: 'Pass', st: 'Published' },
    // Sem 2
    { code: 'FY201', sem: 2, ay: '2024-25', int: 17, mid: 17, ex: 49, tot: 83, g: 'A+', gp: 9, res: 'Pass', st: 'Published' },
    { code: 'FY202', sem: 2, ay: '2024-25', int: 16, mid: 16, ex: 47, tot: 79, g: 'A', gp: 8, res: 'Pass', st: 'Published' },
    { code: 'FY203', sem: 2, ay: '2024-25', int: 16, mid: 15, ex: 45, tot: 76, g: 'A', gp: 8, res: 'Pass', st: 'Published' },
    { code: 'FY204', sem: 2, ay: '2024-25', int: 18, mid: 17, ex: 50, tot: 85, g: 'A+', gp: 9, res: 'Pass', st: 'Published' },
    { code: 'FY205', sem: 2, ay: '2024-25', int: 15, mid: 16, ex: 44, tot: 75, g: 'A', gp: 8, res: 'Pass', st: 'Published' },
    // Sem 3
    { code: 'CSE301', sem: 3, ay: '2025-26', int: 17, mid: 17, ex: 48, tot: 82, g: 'A+', gp: 9, res: 'Pass', st: 'Published' },
    { code: 'CSE302', sem: 3, ay: '2025-26', int: 18, mid: 18, ex: 50, tot: 86, g: 'A+', gp: 9, res: 'Pass', st: 'Published' },
    { code: 'CSE303', sem: 3, ay: '2025-26', int: 16, mid: 16, ex: 46, tot: 78, g: 'A', gp: 8, res: 'Pass', st: 'Published' },
    { code: 'CSE304', sem: 3, ay: '2025-26', int: 15, mid: 15, ex: 44, tot: 74, g: 'A', gp: 8, res: 'Pass', st: 'Published' },
    { code: 'CSE305', sem: 3, ay: '2025-26', int: 16, mid: 16, ex: 46, tot: 78, g: 'A', gp: 8, res: 'Pass', st: 'Published' },
    // Sem 4
    { code: 'CSE401', sem: 4, ay: '2025-26', int: 16, mid: 16, ex: 45, tot: 77, g: 'A', gp: 8, res: 'Pass', st: 'Published' },
    { code: 'CSE402', sem: 4, ay: '2025-26', int: 15, mid: 15, ex: 44, tot: 74, g: 'A', gp: 8, res: 'Pass', st: 'Published' },
    { code: 'CSE403', sem: 4, ay: '2025-26', int: 17, mid: 16, ex: 47, tot: 80, g: 'A+', gp: 9, res: 'Pass', st: 'Published' },
    { code: 'CSE404', sem: 4, ay: '2025-26', int: 16, mid: 16, ex: 45, tot: 77, g: 'A', gp: 8, res: 'Pass', st: 'Published' },
    { code: 'CSE405', sem: 4, ay: '2025-26', int: 16, mid: 15, ex: 44, tot: 75, g: 'A', gp: 8, res: 'Pass', st: 'Published' },
    // Sem 5 (Current semester - Exam pending)
    { code: 'CSE501', sem: 5, ay: '2026-27', int: 16, mid: 17, ex: null, tot: null, g: null, gp: null, res: 'Pending', st: 'Pending' },
    { code: 'CSE502', sem: 5, ay: '2026-27', int: 15, mid: 16, ex: null, tot: null, g: null, gp: null, res: 'Pending', st: 'Pending' },
    { code: 'CSE503', sem: 5, ay: '2026-27', int: 18, mid: 18, ex: null, tot: null, g: null, gp: null, res: 'Pending', st: 'Pending' },
    { code: 'CSE504', sem: 5, ay: '2026-27', int: 17, mid: 16, ex: null, tot: null, g: null, gp: null, res: 'Pending', st: 'Pending' },
    { code: 'CSE505', sem: 5, ay: '2026-27', int: 16, mid: 16, ex: null, tot: null, g: null, gp: null, res: 'Pending', st: 'Pending' }
  ];

  for (const m of marksSeed) {
    marks.push({
      studentId: rollNo,
      subjectCode: m.code,
      semester: m.sem,
      academicYear: m.ay,
      credits: 4,
      internal: m.int,
      midsem: m.mid,
      exam: m.ex,
      total: m.tot,
      grade: m.g,
      gradePoints: m.gp,
      result: m.res,
      status: m.st,
      backlogCleared: false,
      clearedInSemester: null
    });
  }
  writeJson('marks.json', marks);
  console.log('✓ marks.json updated (25 records)');

  // 9. notifications.json
  const notifications = readJson('notifications.json').filter(n => n.userId !== rollNo);
  const notifRecords = [
    {
      id: `NTF-G001`,
      userId: rollNo,
      type: 'welcome',
      title: 'Welcome to EduPulse',
      message: `Welcome, Ganesh Sharma! Your student portal is configured for CSE Semester 5.`,
      isRead: false,
      createdAt: '2026-10-24'
    },
    {
      id: `NTF-G002`,
      userId: rollNo,
      type: 'attendance',
      title: 'Attendance Standing: Safe',
      message: 'Your overall attendance is 82.0%, well above the 75% institutional threshold.',
      isRead: true,
      createdAt: '2026-10-22'
    },
    {
      id: `NTF-G003`,
      userId: rollNo,
      type: 'academic',
      title: 'Midsem Performance Released',
      message: 'Your continuous assessment marks for CSE501-CSE505 are now available.',
      isRead: false,
      createdAt: '2026-10-20'
    }
  ];
  notifications.push(...notifRecords);
  writeJson('notifications.json', notifications);
  console.log('✓ notifications.json updated');

  // 10. logins_demo.csv
  const csvPath = path.join(CSV_DIR, 'logins_demo.csv');
  if (fs.existsSync(csvPath)) {
    let csvContent = fs.readFileSync(csvPath, 'utf8');
    if (!csvContent.includes('ganesh.sharma@ustu.edu.in')) {
      csvContent += `\nstudent,Ganesh Sharma,ganesh.sharma@ustu.edu.in,${rollNo},@123`;
      csvContent += `\nstudent,Ganesh Sharma,ganesh.sharma22@edupulse.edu,CS21B022,@123`;
      fs.writeFileSync(csvPath, csvContent.trim() + '\n', 'utf8');
      console.log('✓ logins_demo.csv updated');
    }
  }

  console.log('\nAll backend datasets successfully updated for student Ganesh Sharma!');
}

seedGanesh();
