import { UnifiedStudent, Department, AcademicYear, Semester } from '../types/student';

// Seed names
const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Priya', 'Aditya', 'Diya', 'Karan', 'Sneha',
  'Vikram', 'Isha', 'Rahul', 'Pooja', 'Arjun', 'Meera', 'Varun', 'Neha',
  'Siddharth', 'Tanvi', 'Gaurav', 'Riya', 'Kunal', 'Anika', 'Dhruv', 'Sanya',
  'Harsh', 'Tara', 'Rishi', 'Kavya', 'Nikhil', 'Simran', 'Dev', 'Shreya'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Reddy', 'Iyer', 'Nair', 'Singh', 'Chopra',
  'Gupta', 'Mehta', 'Kulkarni', 'Deshmukh', 'Joshi', 'Bose', 'Chatterjee', 'Rao'
];

const DEPARTMENTS: Department[] = [
  'Computer Science',
  'Information Technology',
  'Electronics & Comm.',
  'Mechanical Eng.',
  'Civil Eng.',
];

const YEARS: AcademicYear[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const SEMESTERS: Semester[] = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];

// Department prefixes
const DEPT_PREFIX: Record<Department, string> = {
  'Computer Science': 'CS',
  'Information Technology': 'IT',
  'Electronics & Comm.': 'EC',
  'Mechanical Eng.': 'ME',
  'Civil Eng.': 'CE',
};

/**
 * Deterministically generate 130 realistic student records
 */
function generateSyntheticStudents(): UnifiedStudent[] {
  const students: UnifiedStudent[] = [];
  const TOTAL_RECORDS = 135;

  for (let i = 1; i <= TOTAL_RECORDS; i++) {
    const dept = DEPARTMENTS[(i - 1) % DEPARTMENTS.length];
    const prefix = DEPT_PREFIX[dept];
    const student_id = `EP-${prefix}-${String(i).padStart(3, '0')}`;
    const firstName = FIRST_NAMES[(i * 7) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 11) % LAST_NAMES.length];
    const name = `${firstName} ${lastName}`;
    const yearIdx = (i - 1) % YEARS.length;
    const academic_year = YEARS[yearIdx];
    const semester = SEMESTERS[yearIdx * 2 + (i % 2)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@edupulse.edu`;

    // Define archetypes across the cohort
    // Archetype 1: Incomplete Data (approx 10 students: ~8%)
    // Archetype 2: Strong Academics + Strong Placement (approx 30 students: ~22%)
    // Archetype 3: Strong Academics + Weak Placement (approx 25 students: ~18%)
    // Archetype 4: Academic Support Needed / High Risk (approx 25 students: ~18%)
    // Archetype 5: Low LMS Participation (approx 15 students: ~11%)
    // Archetype 6: Balanced / Steady Performers (approx 30 students: ~22%)

    let cgpa: number | null = null;
    let internal_marks: number | null = null;
    let backlogs: number | null = 0;
    let overall_attendance: number | null = null;
    let lms_logins: number | null = null;
    let assignment_completion: number | null = null;
    let events_participated: number | null = 0;
    let club_participation: number | null = 0;
    let hackathons: number | null = 0;
    let certifications: number | null = 0;
    let aptitude_score: number | null = null;
    let coding_score: number | null = null;
    let mock_interview_score: number | null = null;
    let placement_prep: boolean | null = true;
    let technical_skill_score: number | null = null;
    let soft_skill_score: number | null = null;
    let student_satisfaction: number | null = 4.0;
    let faculty_feedback: 'Excellent' | 'Good' | 'Average' | 'Needs Attention' | null = 'Good';

    const profileIndex = i % 10;

    if (profileIndex === 0) {
      // Profile: Incomplete Data (< 50% completeness)
      cgpa = 6.8 + (i % 10) * 0.1;
      overall_attendance = 72;
      // Missing placement, skills, LMS
      lms_logins = null;
      assignment_completion = null;
      aptitude_score = null;
      coding_score = null;
      mock_interview_score = null;
      placement_prep = null;
      technical_skill_score = null;
      soft_skill_score = null;
      faculty_feedback = null;
    } else if (profileIndex === 1 || profileIndex === 2) {
      // Profile: Strong Academics + Strong Placement (Top Achiever)
      cgpa = Math.round((8.4 + (i % 15) * 0.1) * 100) / 100;
      internal_marks = 85 + (i % 12);
      backlogs = 0;
      overall_attendance = 88 + (i % 10);
      lms_logins = 25 + (i % 15);
      assignment_completion = 90 + (i % 10);
      events_participated = 2 + (i % 3);
      club_participation = 1 + (i % 2);
      hackathons = 1 + (i % 3);
      certifications = 2 + (i % 2);
      aptitude_score = 78 + (i % 20);
      coding_score = 82 + (i % 18);
      mock_interview_score = 80 + (i % 16);
      placement_prep = true;
      technical_skill_score = 85 + (i % 14);
      soft_skill_score = 82 + (i % 15);
      student_satisfaction = 4.5 + (i % 5) * 0.1;
      faculty_feedback = 'Excellent';
    } else if (profileIndex === 3 || profileIndex === 4) {
      // Profile: Strong Academics + Low Placement Readiness (The Skill-Gap Cohort)
      cgpa = Math.round((8.0 + (i % 12) * 0.12) * 100) / 100;
      internal_marks = 82 + (i % 10);
      backlogs = 0;
      overall_attendance = 86 + (i % 8);
      lms_logins = 20 + (i % 10);
      assignment_completion = 88 + (i % 8);
      events_participated = 1;
      club_participation = 0;
      hackathons = 0;
      certifications = 0;
      aptitude_score = 42 + (i % 14); // low
      coding_score = 38 + (i % 10);   // low
      mock_interview_score = 48 + (i % 8); // low
      placement_prep = false;
      technical_skill_score = 52 + (i % 8);
      soft_skill_score = 48 + (i % 8);
      student_satisfaction = 3.8;
      faculty_feedback = 'Good';
    } else if (profileIndex === 5 || profileIndex === 6) {
      // Profile: Academic Support Needed (High/Mod Risk)
      cgpa = Math.round((5.1 + (i % 9) * 0.08) * 100) / 100;
      internal_marks = 42 + (i % 12);
      backlogs = 1 + (i % 3); // 1, 2, or 3 backlogs!
      overall_attendance = 58 + (i % 14); // Low attendance (58 - 71%)
      lms_logins = 6 + (i % 8);
      assignment_completion = 40 + (i % 18);
      events_participated = 0;
      club_participation = 0;
      hackathons = 0;
      certifications = 0;
      aptitude_score = 48 + (i % 15);
      coding_score = 42 + (i % 12);
      mock_interview_score = 50 + (i % 10);
      placement_prep = false;
      technical_skill_score = 45 + (i % 12);
      soft_skill_score = 52 + (i % 10);
      student_satisfaction = 2.8;
      faculty_feedback = 'Needs Attention';
    } else if (profileIndex === 7) {
      // Profile: Good Attendance but Poor Internal Marks / Low LMS
      cgpa = Math.round((6.2 + (i % 6) * 0.1) * 100) / 100;
      internal_marks = 45 + (i % 10);
      backlogs = 1;
      overall_attendance = 88 + (i % 8); // High attendance!
      lms_logins = 4 + (i % 5);          // Very low logins!
      assignment_completion = 35 + (i % 15);
      events_participated = 1;
      club_participation = 0;
      hackathons = 0;
      certifications = 0;
      aptitude_score = 55 + (i % 10);
      coding_score = 52 + (i % 10);
      mock_interview_score = 58 + (i % 8);
      placement_prep = true;
      technical_skill_score = 56 + (i % 8);
      soft_skill_score = 60 + (i % 8);
      student_satisfaction = 3.2;
      faculty_feedback = 'Average';
    } else {
      // Profile: Balanced / Steady Performers
      cgpa = Math.round((6.8 + (i % 8) * 0.08) * 100) / 100;
      internal_marks = 68 + (i % 14);
      backlogs = 0;
      overall_attendance = 78 + (i % 10);
      lms_logins = 18 + (i % 10);
      assignment_completion = 75 + (i % 12);
      events_participated = 1 + (i % 2);
      club_participation = 1;
      hackathons = i % 2;
      certifications = 1;
      aptitude_score = 65 + (i % 12);
      coding_score = 62 + (i % 14);
      mock_interview_score = 66 + (i % 10);
      placement_prep = true;
      technical_skill_score = 68 + (i % 10);
      soft_skill_score = 70 + (i % 8);
      student_satisfaction = 4.0;
      faculty_feedback = 'Good';
    }

    // Pre-seed some realistic interventions for approx 18 students
    const interventions = [];
    if (backlogs > 0 || (overall_attendance !== null && overall_attendance < 65) || (profileIndex === 3)) {
      interventions.push({
        id: `INT-${i}`,
        category: backlogs > 0 ? 'Academic Mentoring' : (overall_attendance !== null && overall_attendance < 65) ? 'Attendance Support' : 'Coding Practice',
        description: backlogs > 0
          ? `Remedial tutoring scheduled for ${backlogs} uncleared subject(s).`
          : 'Attendance alert letter issued and mentor counseling ongoing.',
        faculty_assigned: 'Dr. S. Ramanathan',
        target_date: '2026-11-15',
        status: (i % 3 === 0 ? 'Completed' : i % 2 === 0 ? 'In Progress' : 'Planned') as any,
        created_at: '2026-09-20',
        follow_up_notes: ['First counseling session completed. Weekly tracking active.'],
      });
    }

    const fieldsList = [
      cgpa, internal_marks, backlogs, overall_attendance, lms_logins, assignment_completion,
      events_participated, aptitude_score, coding_score, mock_interview_score,
      technical_skill_score, soft_skill_score, student_satisfaction
    ];
    const availableCount = fieldsList.filter(f => f !== null).length;
    const totalCount = fieldsList.length;
    const completeness = Math.round((availableCount / totalCount) * 100);

    const missingFields: string[] = [];
    if (cgpa === null) missingFields.push('CGPA');
    if (overall_attendance === null) missingFields.push('Attendance');
    if (lms_logins === null) missingFields.push('LMS Logins');
    if (aptitude_score === null) missingFields.push('Aptitude Score');
    if (coding_score === null) missingFields.push('Coding Score');
    if (technical_skill_score === null) missingFields.push('Technical Skills');

    const student: UnifiedStudent = {
      student_id,
      name,
      department: dept,
      academic_year,
      semester,
      email,
      academic: {
        cgpa,
        internal_marks,
        backlogs,
      },
      attendance: {
        overall_attendance,
      },
      lms: {
        lms_logins,
        assignment_completion,
      },
      engagement: {
        events_participated,
        club_participation,
        hackathons,
        certifications,
      },
      placement: {
        aptitude_score,
        coding_score,
        mock_interview_score,
        placement_preparation_participation: placement_prep,
      },
      skills: {
        technical_skill_score,
        soft_skill_score,
      },
      feedback: {
        student_satisfaction,
        faculty_feedback,
      },
      data_quality: {
        available_fields: availableCount,
        total_fields: totalCount,
        missing_fields: missingFields,
        data_completeness_percentage: completeness,
        has_minimum_evidence: completeness >= 50,
      },
      interventions,
    };

    students.push(student);
  }

  return students;
}

export const INITIAL_STUDENTS: UnifiedStudent[] = generateSyntheticStudents();
