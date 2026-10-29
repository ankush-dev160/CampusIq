/**
 * CurrentUserContext — Handles authentication state, persistent localStorage sessions,
 * Supabase backend integration, dynamic user profile resolution, and multi-student data switching.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EXCEL_STUDENTS } from '../data/excelDataset';
import excelRawData from '../data/excelRawData.json';
import { INITIAL_STUDENTS } from '../data/initialStudents';
import { DEMO_STUDENT, DEMO_FACULTY, PortalRole } from '../data/portalData';
import type { UnifiedStudent } from '../types/student';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { getFirestoreDoc, saveStudentToFirestore } from '../lib/firebaseClient';
import serverStudentsData from '../../server/seed-data/json/students.json';
import serverSubjectsData from '../../server/seed-data/json/subjects.json';
import serverSemesterResults from '../../server/seed-data/json/semester_results.json';
import serverMarksData from '../../server/seed-data/json/marks.json';
import type { SemesterRecord, SemesterSubject } from '../data/portalData';

export type PortalStudentProfile = typeof DEMO_STUDENT;

interface StoredSession {
  role: PortalRole;
  email: string;
}

const STORAGE_KEY = 'edupulse_auth_session';

interface CurrentUserContextType {
  loggedInEmail: string;
  activeRole: PortalRole;
  currentStudent: UnifiedStudent | null;
  currentFaculty: typeof DEMO_FACULTY[0] | null;
  portalStudent: PortalStudentProfile;
  isLoading: boolean;
  isBackendConnected: boolean;
  login: (role: PortalRole, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setActiveRole: (role: PortalRole) => void;
}

const CurrentUserContext = createContext<CurrentUserContextType>({
  loggedInEmail: '',
  activeRole: 'landing',
  currentStudent: null,
  currentFaculty: null,
  portalStudent: DEMO_STUDENT,
  isLoading: false,
  isBackendConnected: false,
  login: async () => ({ success: false }),
  logout: async () => {},
  setActiveRole: () => {},
});

// 10 Faculty members lookup
const FACULTY_LOOKUP: Record<string, string> = {
  'FAC-CSE-001': 'Dr. Priya Menon',
  'FAC-CSE-002': 'Prof. Suresh Kumar',
  'FAC-CSE-003': 'Dr. Anita Bose',
  'FAC-CSE-004': 'Prof. Harish Chandra Verma',
  'FAC-CSE-005': 'Dr. Priya Menon',
  'FAC-CSE-006': 'Prof. Suresh Kumar',
  'FAC-IT-001': 'Prof. Rajeshwar Rao',
  'FAC-IT-002': 'Dr. Ananya Sen',
  'FAC-IT-003': 'Prof. Rajeshwar Rao',
  'FAC-IT-004': 'Dr. Ananya Sen',
  'FAC-ECE-001': 'Dr. Meenakshi Sundaram',
  'FAC-ECE-002': 'Prof. Amitav Banerjee',
  'FAC-ECE-003': 'Dr. Meenakshi Sundaram',
  'FAC-ECE-004': 'Prof. Amitav Banerjee',
  'FAC-ECE-005': 'Dr. Meenakshi Sundaram',
  'FAC-ME-001': 'Prof. Vikramaditya Rathore',
  'FAC-ME-002': 'Dr. Kavita Deshmukh',
  'FAC-ME-003': 'Prof. Vikramaditya Rathore',
  'FAC-ME-004': 'Dr. Kavita Deshmukh',
  'FAC-CE-001': 'Dr. Kavita Deshmukh',
  'FAC-CE-002': 'Prof. Vikramaditya Rathore',
  'FAC-CE-003': 'Dr. Kavita Deshmukh',
  'FAC-APS-001': 'Dr. Anita Bose',
  'FAC-APS-002': 'Prof. Harish Chandra Verma',
  'FAC-APS-003': 'Prof. Suresh Kumar',
  'FAC-AIML-001': 'Dr. Priya Menon',
  'FAC-AIML-002': 'Prof. Suresh Kumar',
  'FAC-AIML-003': 'Dr. Anita Bose',
  'FAC-AIML-004': 'Prof. Harish Chandra Verma',
  'FAC-AIML-005': 'Dr. Ananya Sen',
};

const DEFAULT_FACULTY_BY_BRANCH: Record<string, string[]> = {
  CSE: ['Dr. Priya Menon', 'Prof. Suresh Kumar', 'Dr. Anita Bose', 'Prof. Harish Chandra Verma'],
  IT: ['Prof. Rajeshwar Rao', 'Dr. Ananya Sen', 'Dr. Priya Menon', 'Prof. Suresh Kumar'],
  ECE: ['Dr. Meenakshi Sundaram', 'Prof. Amitav Banerjee', 'Prof. Harish Chandra Verma'],
  ME: ['Prof. Vikramaditya Rathore', 'Dr. Kavita Deshmukh'],
  CE: ['Dr. Kavita Deshmukh', 'Prof. Vikramaditya Rathore'],
};

// Semester 8 Capstone & Advanced Elective subjects
const SEMESTER_8_SUBJECTS: Record<string, Array<{ code: string; name: string; credits: number; faculty: string }>> = {
  CSE: [
    { code: 'CSE801', name: 'Capstone Project Phase II & Defense', credits: 10, faculty: 'Dr. Priya Menon' },
    { code: 'CSE802', name: 'Professional Ethics & Cyber Law', credits: 3, faculty: 'Dr. Anita Bose' },
    { code: 'CSE803', name: 'Cloud Native & DevOps Engineering', credits: 3, faculty: 'Prof. Rajeshwar Rao' },
    { code: 'CSE804', name: 'High Performance & Quantum Computing', credits: 3, faculty: 'Prof. Harish Chandra Verma' },
    { code: 'CSE805', name: 'Open Elective II (Industry Internship)', credits: 3, faculty: 'Prof. Suresh Kumar' },
  ],
  IT: [
    { code: 'IT801', name: 'Enterprise Capstone Project Phase II', credits: 10, faculty: 'Prof. Rajeshwar Rao' },
    { code: 'IT802', name: 'Enterprise IT Architecture & Strategy', credits: 3, faculty: 'Dr. Ananya Sen' },
    { code: 'IT803', name: 'Cyber Forensics & Incident Response', credits: 3, faculty: 'Dr. Ananya Sen' },
    { code: 'IT804', name: 'Site Reliability Engineering', credits: 3, faculty: 'Prof. Suresh Kumar' },
    { code: 'IT805', name: 'Open Elective II (Industry Internship)', credits: 3, faculty: 'Prof. Rajeshwar Rao' },
  ],
  ECE: [
    { code: 'ECE801', name: 'Major Capstone Project & Viva', credits: 10, faculty: 'Dr. Meenakshi Sundaram' },
    { code: 'ECE802', name: '5G & Next-Gen Wireless Systems', credits: 3, faculty: 'Prof. Amitav Banerjee' },
    { code: 'ECE803', name: 'Mixed Signal VLSI Design', credits: 3, faculty: 'Dr. Meenakshi Sundaram' },
    { code: 'ECE804', name: 'Radar & Satellite Navigation', credits: 3, faculty: 'Prof. Amitav Banerjee' },
    { code: 'ECE805', name: 'Open Elective II (Industrial Internship)', credits: 3, faculty: 'Dr. Meenakshi Sundaram' },
  ],
  ME: [
    { code: 'ME801', name: 'Major Industrial Capstone Project', credits: 10, faculty: 'Prof. Vikramaditya Rathore' },
    { code: 'ME802', name: 'Industrial Robotics & Automation', credits: 3, faculty: 'Prof. Vikramaditya Rathore' },
    { code: 'ME803', name: 'Computational Fluid Dynamics', credits: 3, faculty: 'Dr. Kavita Deshmukh' },
    { code: 'ME804', name: 'Renewable Energy & Hybrid Systems', credits: 3, faculty: 'Prof. Vikramaditya Rathore' },
    { code: 'ME805', name: 'Open Elective II (Industry Internship)', credits: 3, faculty: 'Dr. Kavita Deshmukh' },
  ],
  CE: [
    { code: 'CE801', name: 'Infrastructure Capstone Project & Defense', credits: 10, faculty: 'Dr. Kavita Deshmukh' },
    { code: 'CE802', name: 'Earthquake Resistant Structural Design', credits: 3, faculty: 'Dr. Kavita Deshmukh' },
    { code: 'CE803', name: 'Prestressed Concrete & Bridge Eng', credits: 3, faculty: 'Prof. Vikramaditya Rathore' },
    { code: 'CE804', name: 'Smart Cities & Sustainable Infra', credits: 3, faculty: 'Dr. Kavita Deshmukh' },
    { code: 'CE805', name: 'Open Elective II (Industry Internship)', credits: 3, faculty: 'Dr. Kavita Deshmukh' },
  ],
};

function getSubjectsForSemesterAndBranch(branch: string, sem: number): Array<{ code: string; name: string; credits: number; faculty: string }> {
  const branchKey = branch === 'AIML' ? 'CSE' : branch;

  if (sem === 1 || sem === 2) {
    // 1st Year Common curriculum from subjects.json
    const common = (serverSubjectsData as any[]).filter(s => s.branch === 'COMMON' && s.semester === sem);
    if (common.length) {
      return common.map((s, idx) => ({
        code: s.code,
        name: s.name,
        credits: s.credits || 4,
        faculty: FACULTY_LOOKUP[s.facultyId] || (DEFAULT_FACULTY_BY_BRANCH[branchKey] || DEFAULT_FACULTY_BY_BRANCH.CSE)[idx % 4],
      }));
    }
  }

  if (sem === 8) {
    return SEMESTER_8_SUBJECTS[branchKey] || SEMESTER_8_SUBJECTS.CSE;
  }

  // Branch-specific subjects from subjects.json (Sem 3..7)
  const branchSubs = (serverSubjectsData as any[]).filter(
    s => (s.branch === branchKey || (branchKey === 'CSE' && s.branch === 'AIML')) && s.semester === sem
  );

  if (branchSubs.length) {
    return branchSubs.slice(0, 5).map((s, idx) => ({
      code: s.code,
      name: s.name,
      credits: s.credits || 4,
      faculty: FACULTY_LOOKUP[s.facultyId] || (DEFAULT_FACULTY_BY_BRANCH[branchKey] || DEFAULT_FACULTY_BY_BRANCH.CSE)[idx % 4],
    }));
  }

  return SEMESTER_8_SUBJECTS[branchKey] || SEMESTER_8_SUBJECTS.CSE;
}

function getMarksForSubject(
  studentSeed: string,
  subjectCode: string,
  semSgpa: number,
  baseAttendance: number
) {
  let hash = 0;
  const str = `${studentSeed}_${subjectCode}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const variance = ((Math.abs(hash) % 15) - 7) * 0.1;
  const effGpa = Math.max(4.0, Math.min(10.0, semSgpa + variance));

  const test1 = Math.min(20, Math.max(8, Math.round((effGpa / 10) * 20 + (((Math.abs(hash) % 5) - 2) * 0.5))));
  const test2 = Math.min(20, Math.max(7, Math.round((effGpa / 10) * 20 + (((Math.abs(hash >> 3) % 5) - 2) * 0.5))));
  const assignment = Math.min(10, Math.max(5, Math.round((effGpa / 10) * 10)));
  const practical = Math.min(25, Math.max(12, Math.round((effGpa / 10) * 25 + (((Math.abs(hash >> 6) % 5) - 2) * 0.5))));
  const internal_pct = Math.min(100, Math.max(45, Math.round(((test1 + test2 + assignment + practical) / 75) * 100)));

  let grade = 'B';
  if (effGpa >= 9.0) grade = 'O';
  else if (effGpa >= 8.0) grade = 'A+';
  else if (effGpa >= 7.0) grade = 'A';
  else if (effGpa >= 6.0) grade = 'B+';
  else if (effGpa >= 5.0) grade = 'B';
  else grade = 'C';

  const status: 'Safe' | 'Watch' | 'Critical' =
    baseAttendance < 65 || effGpa < 5.5 ? 'Critical' : baseAttendance < 75 || effGpa < 6.5 ? 'Watch' : 'Safe';

  return { test1, test2, assignment, practical, internal_pct, grade, status };
}

/**
 * Maps any UnifiedStudent to a rich, dynamic PortalStudentProfile.
 * Customizes courses, faculty, marks, roll number, address, and SGPA history
 * so that each student gets their exact individualized academic cockpit.
 */
export function adaptUnifiedStudentToPortal(student: UnifiedStudent): PortalStudentProfile {
  const safeName = student?.name || 'Student';
  const initials =
    safeName
      .split(' ')
      .filter(Boolean)
      .map(p => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'ST';

  const cgpa = student?.academic?.cgpa ?? (student as any)?.cgpa ?? 7.5;
  const attendance =
    student?.attendance?.overall_attendance ??
    (student as any)?.attendance?.overall_attendance ??
    (student as any)?.overall_attendance ??
    78;
  const backlogs = student?.academic?.backlogs ?? (student as any)?.backlogs ?? 0;
  const internals = student?.academic?.internal_marks ?? (student as any)?.internal_marks ?? Math.round(cgpa * 9.5);

  // Cross-reference with raw data for rich profile metadata (City, Phone, DOB, Guardian, etc.)
  const rawExcel = (excelRawData as any[]).find(
    r =>
      r['Student ID'] === student?.student_id ||
      r['Full Name']?.toLowerCase() === safeName.toLowerCase() ||
      r['Email']?.toLowerCase() === student?.email?.toLowerCase()
  );

  const rawServer = (serverStudentsData as any[]).find(
    r =>
      r.rollNo === student?.student_id ||
      r.id === student?.student_id ||
      r.name?.toLowerCase() === safeName.toLowerCase() ||
      r.email?.toLowerCase() === student?.email?.toLowerCase()
  );

  const roll_no = rawServer?.rollNo || rawExcel?.['Student ID'] || student?.student_id || 'STU001';
  const phone = rawExcel?.['Phone (Dummy)'] || rawServer?.phone || '+91 9876543210';
  const dob = rawServer?.dob || (rawExcel?.Age ? `${2026 - rawExcel.Age}-05-15` : '2004-04-16');
  const city = rawServer?.address?.city || rawExcel?.City || 'Campus';
  const state = rawServer?.address?.state || '';
  const address = state ? `${city}, ${state}` : `${city}, India`;
  const guardian = rawServer?.guardianName || `${safeName.split(' ')[0]}'s Guardian`;

  // Determine branch code
  const deptStr = String(student?.department || 'CSE').toUpperCase();
  const branchKey =
    deptStr.includes('INFO') || deptStr === 'IT'
      ? 'IT'
      : deptStr.includes('ELECT') || deptStr === 'ECE'
      ? 'ECE'
      : deptStr.includes('MECH') || deptStr === 'ME'
      ? 'ME'
      : deptStr.includes('CIVIL') || deptStr === 'CE'
      ? 'CE'
      : 'CSE';

  // Determine year index (1..4)
  const yearStr = String(student?.academic_year || '1st Year');
  const yearNum = yearStr.startsWith('1')
    ? 1
    : yearStr.startsWith('2')
    ? 2
    : yearStr.startsWith('3')
    ? 3
    : 4;

  const semStr = String(student?.semester || `Sem ${yearNum * 2 - 1}`);
  const currentSemNum = Math.min(8, Math.max(1, parseInt(semStr.replace(/\D/g, '') || String(yearNum * 2 - 1), 10)));

  // Query real historical semester results for this student if available
  const studentResults = (serverSemesterResults as any[]).filter(
    r => r.studentId === student?.student_id || r.studentId === roll_no
  );

  // Build authentic semester records from Sem 1 up to currentSemNum
  const sgpa_history: Array<{ semester: string; sgpa: number; credits: number; attendance: number }> = [];
  const semester_records: Record<string, SemesterRecord> = {};

  for (let sNum = 1; sNum <= currentSemNum; sNum++) {
    const semKey = `Sem ${sNum}`;
    const matchedRes = studentResults.find(r => r.semester === sNum);

    let semSgpa = cgpa;
    let semAtt = attendance;
    let semCredits = 20;
    let semBacklogs = 0;
    let semStatus: 'Pass' | 'Pass with Backlog' | 'In Progress' = 'Pass';

    if (matchedRes) {
      semSgpa = Number(matchedRes.sgpa) || cgpa;
      semAtt = Number(matchedRes.attendancePercentage) || attendance;
      semCredits = Number(matchedRes.creditsEarned) || 20;
      semBacklogs = Number(matchedRes.backlogsInSemester) || 0;
      semStatus = matchedRes.result?.includes('Backlog') ? 'Pass with Backlog' : 'Pass';
    } else {
      // Deterministic realistic variance based on student ID and semester
      let hash = 0;
      const str = `${roll_no}_sem_${sNum}`;
      for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i);
      const semVar = ((Math.abs(hash) % 17) - 8) * 0.08;
      semSgpa = Math.round(Math.min(9.9, Math.max(4.5, (sNum === currentSemNum ? cgpa : cgpa + semVar))) * 100) / 100;
      const attVar = ((Math.abs(hash >> 3) % 9) - 4) * 1.5;
      semAtt = Math.round(Math.min(98, Math.max(55, attendance + attVar)));
      semCredits = semSgpa >= 5.0 ? 20 : 16;
      semBacklogs = (sNum === currentSemNum ? backlogs : (semSgpa < 5.0 ? 1 : 0));
      semStatus = semBacklogs > 0 ? 'Pass with Backlog' : 'Pass';
    }

    sgpa_history.push({
      semester: semKey,
      sgpa: semSgpa,
      credits: semCredits,
      attendance: semAtt,
    });

    // Resolve semester-specific curriculum subjects
    const subTemplates = getSubjectsForSemesterAndBranch(branchKey, sNum);
    const semSubjects: SemesterSubject[] = subTemplates.map((tpl) => {
      // Check if marks exist in marks.json
      const matchedMark = (serverMarksData as any[]).find(
        m => (m.studentId === roll_no || m.studentId === student.student_id) &&
             m.semester === sNum &&
             (m.subjectCode === tpl.code || m.subjectCode?.includes(tpl.code.slice(0, 5)))
      );

      if (matchedMark) {
        const test1 = Math.min(20, Math.max(6, Number(matchedMark.midsem) || 15));
        const test2 = Math.min(20, Math.max(6, Number(matchedMark.internal) || 16));
        const assignment = Math.min(10, Math.max(4, Math.round(((test1 + test2) / 4))));
        const practical = Math.min(25, Math.max(10, Math.round((Number(matchedMark.exam) || 55) * 0.35)));
        const internal_pct = Math.min(100, Math.max(40, Math.round(((test1 + test2 + assignment + practical) / 75) * 100)));
        const grade = matchedMark.grade || (internal_pct >= 85 ? 'A+' : internal_pct >= 75 ? 'A' : internal_pct >= 60 ? 'B+' : 'B');
        const subStatus: 'Safe' | 'Watch' | 'Critical' = semAtt < 65 || internal_pct < 55 ? 'Critical' : semAtt < 75 || internal_pct < 65 ? 'Watch' : 'Safe';
        return {
          code: tpl.code,
          name: tpl.name,
          faculty: tpl.faculty,
          credits: tpl.credits,
          test1,
          test2,
          assignment,
          practical,
          internal_pct,
          grade,
          status: subStatus,
        };
      }

      // Synthesize realistic personalized marks
      const scores = getMarksForSubject(roll_no, tpl.code, semSgpa, semAtt);
      return {
        code: tpl.code,
        name: tpl.name,
        faculty: tpl.faculty,
        credits: tpl.credits,
        ...scores,
      };
    });

    semester_records[semKey] = {
      semester: semKey,
      semNumber: sNum,
      sgpa: semSgpa,
      credits: semCredits,
      attendance: semAtt,
      backlogs: semBacklogs,
      status: semStatus,
      subjects: semSubjects,
    };
  }

  // Active enrolled subjects for the current semester
  const curSemKey = `Sem ${currentSemNum}`;
  const currentSemRecord = semester_records[curSemKey] || semester_records['Sem 1'];
  const subjects = currentSemRecord.subjects;

  const totalClasses = 120;
  const attendedClasses = Math.round((attendance / 100) * totalClasses);

  return {
    id: student.student_id,
    name: student.name,
    department: student.department,
    academic_year: student.academic_year,
    semester: student.semester,
    email: student.email,
    roll_no,
    phone,
    dob,
    address,
    guardian,
    avatar_initials: initials,

    cgpa,
    sgpa_history,
    semester_records,
    backlogs,
    internal_marks: internals,
    subjects,

    overall_attendance: attendance,
    classes_conducted: totalClasses,
    classes_attended: attendedClasses,
    subject_attendance: subjects.map((s, idx) => {
      const subPct = Math.min(100, Math.max(48, Math.round(attendance + (idx % 2 === 0 ? 1 : -1) * (idx + 1) * 2)));
      const conducted = 24;
      const attended = Math.round((subPct / 100) * conducted);
      return {
        subject: s.name,
        pct: subPct,
        conducted,
        attended,
        status: subPct >= 75 ? ('Safe' as const) : ('Low' as const),
      };
    }),

    lms_logins: student.lms?.lms_logins ?? 15,
    assignment_completion: student.lms?.assignment_completion ?? 80,

    events_participated: student.engagement?.events_participated ?? 2,
    club_participation: student.engagement?.club_participation ?? 1,
    hackathons: student.engagement?.hackathons ?? 1,
    certifications: student.engagement?.certifications ?? 1,

    aptitude_score: student.placement?.aptitude_score ?? Math.min(99, Math.round(cgpa * 9.5)),
    coding_score: student.placement?.coding_score ?? Math.min(98, Math.round(cgpa * 9.2)),
    mock_interview_score: student.placement?.mock_interview_score ?? Math.min(95, Math.round(cgpa * 9.0)),
    placement_prep: student.placement?.placement_preparation_participation ?? yearNum >= 3,

    technical_skill_score: student.skills?.technical_skill_score ?? Math.min(98, Math.round(cgpa * 9)),
    soft_skill_score: student.skills?.soft_skill_score ?? 75,

    student_satisfaction: student.feedback?.student_satisfaction ?? 4.0,
    faculty_feedback:
      (student.feedback?.faculty_feedback as any) ||
      (cgpa >= 8.5 ? 'Excellent' : cgpa >= 7.0 ? 'Good' : 'Needs Attention'),

    success_score: Math.min(99, Math.round(cgpa * 8.5 + attendance * 0.15)),
    academic_risk: backlogs > 1 || attendance < 65 ? 'High' : backlogs === 1 || attendance < 75 ? 'Moderate' : 'Low',
    placement_risk: cgpa < 6.5 ? 'High' : cgpa < 7.5 ? 'Moderate' : 'Low',
  };
}

/**
 * Fast synchronous in-memory search across EXCEL_STUDENTS and serverStudentsData.
 * Resolves within <1ms without any external network delay.
 */
function findStudentLocally(input: string): UnifiedStudent | null {
  const q = input.toLowerCase().trim();
  if (!q) return null;

  // Direct match for DEMO_STUDENT
  if (
    q === 'ganesh.sharma22@campusiq.edu' ||
    q === 'cs21b022' ||
    q === 'ep-cs-022' ||
    q === 'demo' ||
    q === 'student' ||
    q === 'student@campusiq.edu'
  ) {
    return {
      student_id: DEMO_STUDENT.id,
      name: DEMO_STUDENT.name,
      department: DEMO_STUDENT.department as any,
      academic_year: DEMO_STUDENT.academic_year as any,
      semester: DEMO_STUDENT.semester as any,
      email: DEMO_STUDENT.email,
      academic: {
        cgpa: DEMO_STUDENT.cgpa,
        internal_marks: DEMO_STUDENT.internal_marks,
        backlogs: DEMO_STUDENT.backlogs,
      },
      attendance: {
        overall_attendance: DEMO_STUDENT.overall_attendance,
      },
      lms: {
        lms_logins: DEMO_STUDENT.lms_logins,
        assignment_completion: DEMO_STUDENT.assignment_completion,
      },
      engagement: {
        events_participated: DEMO_STUDENT.events_participated,
        club_participation: DEMO_STUDENT.club_participation,
        hackathons: DEMO_STUDENT.hackathons,
        certifications: DEMO_STUDENT.certifications,
      },
      placement: {
        aptitude_score: DEMO_STUDENT.aptitude_score,
        coding_score: DEMO_STUDENT.coding_score,
        mock_interview_score: DEMO_STUDENT.mock_interview_score,
        placement_preparation_participation: DEMO_STUDENT.placement_prep,
      },
      skills: {
        technical_skill_score: 82,
        soft_skill_score: 75,
      },
      feedback: {
        student_satisfaction: 4,
        faculty_feedback: 'Good',
      },
      data_quality: {
        available_fields: 12,
        total_fields: 13,
        missing_fields: [],
        data_completeness_percentage: 95,
        has_minimum_evidence: true,
      },
      interventions: [],
    };
  }

  // 1. Direct match in EXCEL_STUDENTS
  let match = EXCEL_STUDENTS.find(
    s =>
      s.name.toLowerCase() === q ||
      s.email.toLowerCase() === q ||
      s.student_id.toLowerCase() === q
  );
  if (match) return match;

  // Partial name match in EXCEL_STUDENTS
  match = EXCEL_STUDENTS.find(s => {
    const sName = s.name.toLowerCase();
    return sName.includes(q) || q.includes(sName);
  });
  if (match) return match;

  // Word token matching (first name / last name match)
  const qTokens = q.split(/\s+/).filter(Boolean);
  if (qTokens.length > 0) {
    match = EXCEL_STUDENTS.find(s => {
      const sTokens = s.name.toLowerCase().split(/\s+/).filter(Boolean);
      return qTokens.every(qt => sTokens.some(st => st.includes(qt))) ||
             qTokens.some(qt => sTokens.includes(qt));
    });
    if (match) return match;
  }

  // 2. Search in serverStudentsData (100 backend students)
  const deptMap: Record<string, string> = {
    CSE: 'Computer Science',
    AIML: 'Computer Science',
    IT: 'Information Technology',
    ECE: 'Electronics & Comm.',
    ME: 'Mechanical Eng.',
    CE: 'Civil Eng.',
  };

  const rawServer = (serverStudentsData as any[]).find(s => {
    const nameLower = (s.name || '').toLowerCase();
    const rollLower = (s.rollNo || s.id || '').toLowerCase();
    const emailLower = (s.email || '').toLowerCase();
    if (nameLower === q || rollLower === q || emailLower === q) return true;
    if (nameLower.includes(q) || q.includes(nameLower)) return true;
    const parts = nameLower.split(/\s+/).filter(Boolean);
    return qTokens.some(qt => parts.includes(qt));
  });

  if (rawServer) {
    const yearNum = Number(rawServer.year) || 1;
    const semNum = Number(rawServer.currentSemester) || (yearNum * 2 - 1);
    const yearStr = `${yearNum}${yearNum === 1 ? 'st' : yearNum === 2 ? 'nd' : yearNum === 3 ? 'rd' : 'th'} Year` as any;
    const semStr = `Sem ${semNum}` as any;
    const cgpa = Number(rawServer.cgpa) || 7.5;
    const backlogs = Number(rawServer.activeBacklogs) || 0;
    const attendance = 75 + Math.round((cgpa / 10) * 15);

    return {
      student_id: rawServer.rollNo || rawServer.id,
      name: rawServer.name,
      department: deptMap[rawServer.branch] || rawServer.branchName || 'Computer Science',
      academic_year: yearStr,
      semester: semStr,
      email: rawServer.email,
      academic: {
        cgpa,
        internal_marks: Math.round(cgpa * 9.5),
        backlogs,
      },
      attendance: {
        overall_attendance: Math.min(98, attendance),
      },
      lms: {
        lms_logins: Math.round(10 + cgpa * 1.5),
        assignment_completion: Math.min(100, Math.round(70 + cgpa * 3)),
      },
      engagement: {
        events_participated: 3,
        club_participation: 1,
        hackathons: 1,
        certifications: 2,
      },
      placement: {
        aptitude_score: Math.round(cgpa * 9),
        coding_score: Math.round(cgpa * 8.8),
        mock_interview_score: Math.round(cgpa * 8.5),
        placement_preparation_participation: yearNum >= 3,
      },
      skills: {
        technical_skill_score: Math.round(cgpa * 9),
        soft_skill_score: 75,
      },
      feedback: {
        student_satisfaction: 4,
        faculty_feedback: cgpa > 8 ? 'Excellent' : 'Good',
      },
      data_quality: {
        available_fields: 12,
        total_fields: 13,
        missing_fields: [],
        data_completeness_percentage: 95,
        has_minimum_evidence: true,
      },
      interventions: [],
    };
  }

  // 3. Baseline initial fallback
  const initMatch = INITIAL_STUDENTS.find(
    s =>
      s.name.toLowerCase() === q ||
      s.email.toLowerCase() === q ||
      s.student_id.toLowerCase() === q ||
      s.name.toLowerCase().includes(q)
  );
  if (initMatch) return initMatch;

  return null;
}

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRoleState] = useState<PortalRole>('landing');
  const [loggedInEmail, setLoggedInEmail] = useState<string>('');
  const [currentStudent, setCurrentStudent] = useState<UnifiedStudent | null>(null);
  const [currentFaculty, setCurrentFaculty] = useState<typeof DEMO_FACULTY[0] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isBackendConnected = isSupabaseConfigured();

  // Helper to persist session in localStorage
  const persistSession = (role: PortalRole, email: string) => {
    setActiveRoleState(role);
    setLoggedInEmail(email);
    if (role === 'landing' || role === 'login') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      const session: StoredSession = { role, email };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  };

  // Resolve student from in-memory datasets first (0ms), with asynchronous fallback
  const resolveStudentRecord = useCallback(async (queryOrEmail: string): Promise<UnifiedStudent | null> => {
    // 1. Instant local memory resolution (0ms, no network delay)
    const local = findStudentLocally(queryOrEmail);
    if (local) {
      return local;
    }

    const emailLower = queryOrEmail.toLowerCase().trim();

    // 2. Try Supabase if configured (optional)
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .or(`email.ilike.${emailLower},student_id.ilike.${emailLower}`)
          .maybeSingle();

        if (data && !error) {
          const mapped: UnifiedStudent = {
            student_id: data.student_id,
            name: data.name,
            email: data.email,
            department: data.department,
            academic_year: data.academic_year,
            semester: data.semester,
            academic: {
              cgpa: data.cgpa ? Number(data.cgpa) : null,
              internal_marks: data.internal_marks ? Number(data.internal_marks) : null,
              backlogs: data.backlogs ? Number(data.backlogs) : 0,
            },
            attendance: {
              overall_attendance: data.overall_attendance ? Number(data.overall_attendance) : null,
            },
            lms: {
              lms_logins: data.lms_logins ? Number(data.lms_logins) : null,
              assignment_completion: data.assignment_completion ? Number(data.assignment_completion) : null,
            },
            engagement: {
              events_participated: data.events_participated ? Number(data.events_participated) : 0,
              club_participation: data.club_participation ? Number(data.club_participation) : 0,
              hackathons: data.hackathons ? Number(data.hackathons) : 0,
              certifications: data.certifications ? Number(data.certifications) : 0,
            },
            placement: {
              aptitude_score: data.aptitude_score ? Number(data.aptitude_score) : null,
              coding_score: data.coding_score ? Number(data.coding_score) : null,
              mock_interview_score: data.mock_interview_score ? Number(data.mock_interview_score) : null,
              placement_preparation_participation: data.placement_preparation_participation ?? null,
            },
            skills: {
              technical_skill_score: data.technical_skill_score ? Number(data.technical_skill_score) : null,
              soft_skill_score: data.soft_skill_score ? Number(data.soft_skill_score) : null,
            },
            feedback: {
              student_satisfaction: data.student_satisfaction ? Number(data.student_satisfaction) : null,
              faculty_feedback: data.faculty_feedback || null,
            },
            data_quality: {
              available_fields: 10,
              total_fields: 13,
              missing_fields: [],
              data_completeness_percentage: data.data_completeness_pct || 90,
              has_minimum_evidence: true,
            },
            interventions: [],
          };
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase student query failed, using offline datasets:', err);
      }
    }

    // 3. Fast timed Firebase query (caps timeout to 800ms)
    try {
      const firestoreRecord = await Promise.race([
        getFirestoreDoc<UnifiedStudent>('students', emailLower),
        new Promise<null>(resolve => setTimeout(() => resolve(null), 800)),
      ]);
      if (firestoreRecord && firestoreRecord.name && firestoreRecord.student_id) {
        return firestoreRecord;
      }
    } catch (err) {
      console.warn('Firebase student query bypassed:', err);
    }

    return null;
  }, []);

  // Restore session from localStorage on startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const path = typeof window !== 'undefined' ? window.location.pathname : '/';
        const isPublicLanding = path === '/' || path === '';
        const isLoginPage = path === '/login';

        if (isPublicLanding) {
          setActiveRoleState('landing');
          setIsLoading(false);
          return;
        }

        if (isLoginPage) {
          setActiveRoleState('login');
          setIsLoading(false);
          return;
        }

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const { role, email } = JSON.parse(stored) as StoredSession;
          if (role && email) {
            setLoggedInEmail(email);
            setActiveRoleState(role);

            if (role === 'student') {
              const student = await resolveStudentRecord(email);
              setCurrentStudent(student);
            } else if (role === 'faculty') {
              const cleanLower = email.toLowerCase();
              const fac = DEMO_FACULTY.find(
                f =>
                  f.email.toLowerCase() === cleanLower ||
                  f.name.toLowerCase() === cleanLower ||
                  f.name.toLowerCase().includes(cleanLower) ||
                  cleanLower.includes(f.name.toLowerCase())
              );
              setCurrentFaculty(fac ?? DEMO_FACULTY[0]);
            }
          }
        } else {
          // No stored session: ensure unauthenticated user starts on landing page
          setActiveRoleState('landing');
          setLoggedInEmail('');
          setCurrentStudent(null);
          setCurrentFaculty(null);
        }
      } catch (err) {
        console.error('Failed to restore local session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [resolveStudentRecord]);

  // Login handler: avoids triggering full-screen restoring session spinner
  const login = async (
    role: PortalRole,
    emailOrName: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanInput = emailOrName.trim();

    if (!cleanInput) {
      return {
        success: false,
        error: role === 'student'
          ? 'Please enter your student roll number, email, or full name.'
          : role === 'faculty'
          ? 'Please enter your faculty name or institutional email.'
          : 'Please enter your administrator institutional email.',
      };
    }

    if (!password || password.trim().length < 4) {
      return {
        success: false,
        error: 'Please enter your password (minimum 4 characters required).',
      };
    }

    try {
      // 1. Authenticate against Supabase if configured and password provided
      if (isSupabaseConfigured() && supabase && cleanInput.includes('@')) {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanInput,
          password: password.trim(),
        });

        if (error) {
          return { success: false, error: error.message };
        }
      }

      // 2. Resolve user record and verify existence for selected role
      if (role === 'student') {
        const student = await resolveStudentRecord(cleanInput);
        if (!student) {
          return {
            success: false,
            error: `Student profile "${cleanInput}" was not found. Please verify your roll number, institutional email, or registered name.`,
          };
        }
        setCurrentStudent(student);
      } else if (role === 'faculty') {
        const cleanLower = cleanInput.toLowerCase();
        const fac = DEMO_FACULTY.find(
          f =>
            f.email.toLowerCase() === cleanLower ||
            f.name.toLowerCase() === cleanLower ||
            f.name.toLowerCase().includes(cleanLower) ||
            cleanLower.includes(f.name.toLowerCase())
        );
        if (!fac) {
          return {
            success: false,
            error: `Faculty profile "${cleanInput}" was not found. Please enter a valid faculty name or institutional email.`,
          };
        }
        setCurrentFaculty(fac);
      } else if (role === 'admin') {
        const cleanLower = cleanInput.toLowerCase();
        if (!cleanLower.includes('admin') && !cleanLower.includes('dean')) {
          return {
            success: false,
            error: 'Administrator credentials required. Please enter an authorized administrator email.',
          };
        }
      }

      persistSession(role, cleanInput);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  // Logout handler
  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Supabase signOut error:', err);
      }
    }
    persistSession('landing', '');
    setCurrentStudent(null);
    setCurrentFaculty(null);
  };

  const portalStudent: PortalStudentProfile = currentStudent
    ? adaptUnifiedStudentToPortal(currentStudent)
    : DEMO_STUDENT;

  return (
    <CurrentUserContext.Provider
      value={{
        loggedInEmail,
        activeRole,
        currentStudent,
        currentFaculty,
        portalStudent,
        isLoading,
        isBackendConnected,
        login,
        logout,
        setActiveRole: (r: PortalRole) => persistSession(r, loggedInEmail),
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => useContext(CurrentUserContext);

export function useStudentRecord(): PortalStudentProfile {
  const { portalStudent } = useCurrentUser();
  return portalStudent || DEMO_STUDENT;
}
