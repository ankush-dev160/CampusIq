/**
 * EduPulse AI — Database Seeder Script
 * Usage:
 *   1. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) in .env
 *   2. Run: node scripts/seedSupabase.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env if present
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split(/\r?\n/).forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^['"]|['"]$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
  console.error('\x1b[31mError: Valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY required in .env\x1b[0m');
  console.log('Please copy .env.example to .env and insert your Supabase project credentials.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('\x1b[36mConnecting to Supabase at:\x1b[0m', supabaseUrl);

  // 1. Read raw Excel JSON
  const rawDataPath = path.resolve(__dirname, '../src/data/excelRawData.json');
  const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf-8'));

  console.log(`Found ${rawData.length} student rows to sync...`);

  const studentRows = rawData.map((r, i) => {
    const student_id = String(r['Student ID'] || `STU${String(i + 1).padStart(3, '0')}`).trim();
    const name = String(r['Full Name'] || 'Unknown Student').trim();
    const email = String(r['Email'] || `${student_id.toLowerCase()}@university.edu`).trim();
    const department = r['Course'] ? String(r['Course']).trim() : 'Computer Science';
    const rawYear = Number(r['Year of Study']) || 3;
    const academic_year = `${rawYear}${rawYear === 1 ? 'st' : rawYear === 2 ? 'nd' : rawYear === 3 ? 'rd' : 'th'} Year`;
    const semester = `Sem ${Number(r['Semester']) || 5}`;

    return {
      student_id,
      name,
      email,
      department,
      academic_year,
      semester,
      cgpa: r['CGPA'] !== undefined ? Number(r['CGPA']) : null,
      internal_marks: 70 + Math.floor(Math.random() * 20),
      backlogs: Number(r['Backlogs']) || 0,
      overall_attendance: r['Attendance (%)'] !== undefined ? Number(r['Attendance (%)']) : 75,
      lms_logins: Number(r['LMS Activity (hrs/week)']) || 15,
      assignment_completion: Number(r['Assignments Completed (%)']) || 80,
      events_participated: Math.floor(Math.random() * 4),
      club_participation: Math.floor(Math.random() * 2),
      hackathons: Math.floor(Math.random() * 2),
      certifications: Math.floor(Math.random() * 3),
      aptitude_score: 55 + Math.floor(Math.random() * 35),
      coding_score: 50 + Math.floor(Math.random() * 40),
      mock_interview_score: 60 + Math.floor(Math.random() * 30),
      placement_preparation_participation: true,
      technical_skill_score: 65 + Math.floor(Math.random() * 25),
      soft_skill_score: 65 + Math.floor(Math.random() * 25),
      student_satisfaction: 4.2,
      faculty_feedback: 'Consistent participation',
      ai_risk_level: r['AI Risk Level (Demo)'] || 'Low',
      data_completeness_pct: 95,
    };
  });

  // Batch insert into students table
  const { data: insertedStudents, error: studentError } = await supabase
    .from('students')
    .upsert(studentRows, { onConflict: 'student_id' })
    .select();

  if (studentError) {
    console.error('\x1b[31mError syncing students:\x1b[0m', studentError.message);
  } else {
    console.log(`\x1b[32mSuccessfully synced ${insertedStudents?.length || studentRows.length} students into Supabase!\x1b[0m`);
  }

  // 2. Sync Demo Faculty
  const facultyMembers = [
    {
      id: 'FAC-01',
      name: 'Dr. Priya Menon',
      email: 'priya.menon@edupulse.edu',
      department: 'Computer Science',
      subjects: ['Machine Learning', 'Database Systems'],
      students_count: 54,
      avatar_initials: 'PM',
    },
    {
      id: 'FAC-02',
      name: 'Prof. Suresh Kumar',
      email: 'suresh.kumar@edupulse.edu',
      department: 'Computer Science',
      subjects: ['Computer Networks', 'Software Engineering'],
      students_count: 54,
      avatar_initials: 'SK',
    },
    {
      id: 'FAC-03',
      name: 'Dr. Anita Bose',
      email: 'anita.bose@edupulse.edu',
      department: 'Computer Science',
      subjects: ['Operating Systems', 'Algorithm Design'],
      students_count: 54,
      avatar_initials: 'AB',
    },
  ];

  const { error: facultyError } = await supabase
    .from('faculty')
    .upsert(facultyMembers, { onConflict: 'id' });

  if (facultyError) {
    console.error('\x1b[31mError syncing faculty:\x1b[0m', facultyError.message);
  } else {
    console.log(`\x1b[32mSuccessfully synced 3 faculty profiles into Supabase!\x1b[0m`);
  }

  console.log('\x1b[32mDatabase seeding completed successfully.\x1b[0m');
}

seedDatabase().catch(err => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
