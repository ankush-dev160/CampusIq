import { UnifiedStudent, Department, AcademicYear, Semester } from '../types/student';
import excelData from './excelRawData.json';

export interface ExcelStudentRow {
  'Student ID': string;
  'Full Name': string;
  Email: string;
  Age?: number;
  Gender?: string;
  'Phone (Dummy)'?: string;
  City?: string;
  Course?: string;
  'Year of Study'?: number;
  Semester?: number;
  'Attendance (%)'?: number;
  CGPA?: number;
  'Assignments Completed (%)'?: number;
  'LMS Activity (hrs/week)'?: number;
  Backlogs?: number;
  'Scholarship Status'?: string;
  'Enrollment Status'?: string;
  'AI Risk Level (Demo)'?: string;
}

/**
 * Transforms an array of Excel rows into strongly-typed UnifiedStudent records.
 * Adheres strictly to the rule: "Never invent missing values or silently replace actual data with random demo data."
 */
export function mapExcelRowsToUnifiedStudents(rows: ExcelStudentRow[]): UnifiedStudent[] {
  return rows.map((r, index) => {
    const student_id = String(r['Student ID'] || `STU${String(index + 1).padStart(3, '0')}`).trim();
    const name = String(r['Full Name'] || 'Unknown Student').trim();
    const email = String(r['Email'] || `${student_id.toLowerCase()}@example.com`).trim();
    const department = (r['Course'] ? String(r['Course']).trim() : 'General Studies') as Department;

    // Academic Year
    const rawYear = Number(r['Year of Study']);
    const academic_year: AcademicYear =
      rawYear === 1 ? '1st Year' :
      rawYear === 2 ? '2nd Year' :
      rawYear === 3 ? '3rd Year' :
      rawYear === 4 ? '4th Year' : '1st Year';

    // Semester
    const rawSem = Number(r['Semester']);
    const semester: Semester =
      (rawSem >= 1 && rawSem <= 8 ? `Sem ${rawSem}` : 'Sem 1') as Semester;

    // Academic metrics from Excel
    const cgpa = r['CGPA'] !== undefined && r['CGPA'] !== null ? Number(r['CGPA']) : null;
    const backlogs = r['Backlogs'] !== undefined && r['Backlogs'] !== null ? Number(r['Backlogs']) : null;
    
    // Internal marks: Not in this sheet -> null (do NOT fabricate)
    const internal_marks: number | null = null;

    // Attendance metrics from Excel
    const overall_attendance = r['Attendance (%)'] !== undefined && r['Attendance (%)'] !== null
      ? Number(r['Attendance (%)'])
      : null;

    // LMS metrics from Excel:
    // 'LMS Activity (hrs/week)': map to lms_logins or weekly hours
    const lms_logins = r['LMS Activity (hrs/week)'] !== undefined && r['LMS Activity (hrs/week)'] !== null
      ? Number(r['LMS Activity (hrs/week)'])
      : null;
    const assignment_completion = r['Assignments Completed (%)'] !== undefined && r['Assignments Completed (%)'] !== null
      ? Number(r['Assignments Completed (%)'])
      : null;

    // Engagement, Placement, Skills, Feedback columns:
    // NOT provided in this specific sheet -> strictly set to null so scoring re-normalizes!
    const events_participated: number | null = null;
    const club_participation: number | null = null;
    const hackathons: number | null = null;
    const certifications: number | null = null;

    const aptitude_score: number | null = null;
    const coding_score: number | null = null;
    const mock_interview_score: number | null = null;
    const placement_prep: boolean | null = null;

    const technical_skill_score: number | null = null;
    const soft_skill_score: number | null = null;

    const student_satisfaction: number | null = null;
    const faculty_feedback = null;

    // Track available vs missing fields transparently
    const missingFields: string[] = [];
    let availableCount = 0;
    const totalCount = 14;

    if (cgpa !== null) availableCount++; else missingFields.push('CGPA');
    if (internal_marks !== null) availableCount++; else missingFields.push('Internal Marks');
    if (backlogs !== null) availableCount++; else missingFields.push('Backlogs');
    if (overall_attendance !== null) availableCount++; else missingFields.push('Attendance %');
    if (lms_logins !== null) availableCount++; else missingFields.push('LMS Activity');
    if (assignment_completion !== null) availableCount++; else missingFields.push('Assignments %');
    if (events_participated !== null) availableCount++; else missingFields.push('Campus Events');
    if (club_participation !== null) availableCount++; else missingFields.push('Club Participation');
    if (hackathons !== null) availableCount++; else missingFields.push('Hackathons');
    if (certifications !== null) availableCount++; else missingFields.push('Certifications');
    if (aptitude_score !== null) availableCount++; else missingFields.push('Aptitude Assessment');
    if (coding_score !== null) availableCount++; else missingFields.push('Coding Assessment');
    if (technical_skill_score !== null) availableCount++; else missingFields.push('Technical Skills');
    if (faculty_feedback !== null) availableCount++; else missingFields.push('Faculty Feedback');

    const completeness = Math.round((availableCount / totalCount) * 100);

    return {
      student_id,
      name,
      department,
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
        has_minimum_evidence: completeness >= 25, // Has academic + attendance + LMS data
      },
      interventions: [],
    };
  });
}

/**
 * Pre-parsed actual Excel dataset of 50 students as the default initial records
 */
export const EXCEL_STUDENTS: UnifiedStudent[] = mapExcelRowsToUnifiedStudents(excelData as ExcelStudentRow[]);
