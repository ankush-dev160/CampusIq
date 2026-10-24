import React, { useState } from 'react';
import {
  Users, BookOpen, Shield, Key, Check, Plus, Edit2, Trash2, Award
} from 'lucide-react';
import { DEMO_FACULTY } from '../data/portalData';

// ─── 1. ADMIN USERS MANAGEMENT ────────────────────────────────────────────────

export function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<'students' | 'faculty'>('students');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-theme-text">User Management</h1>
        <p className="text-sm text-theme-muted mt-0.5">Manage student enrollments, faculty profiles, and institutional credentials</p>
      </div>

      <div className="flex gap-2 border-b border-theme-border pb-3">
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'students'
              ? 'btn-primary'
              : 'bg-theme-secondary text-theme-muted border border-theme-border hover:text-theme-text'
          }`}
        >
          Enrolled Students (135 Active)
        </button>
        <button
          onClick={() => setActiveTab('faculty')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'faculty'
              ? 'btn-primary'
              : 'bg-theme-secondary text-theme-muted border border-theme-border hover:text-theme-text'
          }`}
        >
          Faculty Members (18 Active)
        </button>
      </div>

      {activeTab === 'students' ? (
        <div className="panel p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-theme-text">Registered Student Cohort</h3>
            <span className="text-xs text-theme-accent font-semibold">Managed via SIS Sync</span>
          </div>
          <p className="text-xs text-theme-muted">
            For full student exploration, deep filtering, and risk indicators, visit the <strong className="text-theme-text">Student Intelligence</strong> page.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="panel-raised p-4 rounded-xl border border-theme-border">
              <span className="text-xs text-theme-muted font-bold uppercase">Computer Science</span>
              <div className="text-xl font-extrabold text-theme-text mt-1">27 Students</div>
            </div>
            <div className="panel-raised p-4 rounded-xl border border-theme-border">
              <span className="text-xs text-theme-muted font-bold uppercase">Information Technology</span>
              <div className="text-xl font-extrabold text-theme-text mt-1">27 Students</div>
            </div>
            <div className="panel-raised p-4 rounded-xl border border-theme-border">
              <span className="text-xs text-theme-muted font-bold uppercase">Electronics & Comm.</span>
              <div className="text-xl font-extrabold text-theme-text mt-1">27 Students</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="panel p-5 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-theme-border text-theme-muted">
                <th className="text-left py-2 px-3">Faculty Name</th>
                <th className="text-left py-2 px-3">Department</th>
                <th className="text-left py-2 px-3">Assigned Courses</th>
                <th className="text-center py-2 px-3">Students</th>
                <th className="text-right py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_FACULTY.map(f => (
                <tr key={f.id} className="border-b border-theme-border/50 hover:bg-theme-secondary/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-theme-text">{f.name}</td>
                  <td className="py-2.5 px-3 text-theme-muted">{f.department}</td>
                  <td className="py-2.5 px-3 text-theme-accent">{f.subjects.join(', ')}</td>
                  <td className="py-2.5 px-3 text-center text-theme-muted">{f.students_count}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── 2. DEPARTMENTS & SUBJECTS ────────────────────────────────────────────────

export function AdminDepartmentsPage() {
  const departments = [
    { name: 'Computer Science', code: 'CS', hod: 'Dr. Priya Menon', facultyCount: 8, studentCount: 27, subjects: ['Machine Learning', 'Database Systems', 'Algorithms'] },
    { name: 'Information Technology', code: 'IT', hod: 'Prof. Suresh Kumar', facultyCount: 6, studentCount: 27, subjects: ['Computer Networks', 'Cloud Computing', 'Web Tech'] },
    { name: 'Electronics & Comm.', code: 'EC', hod: 'Dr. Anita Bose', facultyCount: 7, studentCount: 27, subjects: ['Signals & Systems', 'VLSI Design', 'Embedded Systems'] },
    { name: 'Mechanical Eng.', code: 'ME', hod: 'Dr. R. K. Sharma', facultyCount: 6, studentCount: 27, subjects: ['Thermodynamics', 'Fluid Mechanics', 'Robotics'] },
    { name: 'Civil Eng.', code: 'CE', hod: 'Dr. V. K. Patel', facultyCount: 5, studentCount: 27, subjects: ['Structural Analysis', 'Geotechnical Eng', 'Surveying'] },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-theme-text">Departments & Subjects</h1>
        <p className="text-sm text-theme-muted mt-0.5">Academic structures, department heads, and curriculum offerings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map(d => (
          <div key={d.code} className="panel p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <div>
                <span className="text-[10px] font-bold text-theme-accent uppercase tracking-wider block">Dept Code: {d.code}</span>
                <h3 className="text-base font-bold text-theme-text">{d.name}</h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-theme-accent/10 text-theme-accent font-bold border border-theme-accent/20">
                {d.studentCount} Students
              </span>
            </div>

            <div className="text-xs text-theme-muted space-y-1">
              <p><strong className="text-theme-text">Head of Dept:</strong> {d.hod}</p>
              <p><strong className="text-theme-text">Faculty Count:</strong> {d.facultyCount} Professors</p>
              <div className="pt-1">
                <strong className="text-theme-text block mb-1">Core Offerings:</strong>
                <div className="flex flex-wrap gap-1.5">
                  {d.subjects.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded bg-theme-secondary border border-theme-border text-[11px] text-theme-text">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 3. FACULTY ASSIGNMENTS ───────────────────────────────────────────────────

export function AdminAssignmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-theme-text">Faculty Course Assignments</h1>
        <p className="text-sm text-theme-muted mt-0.5">Teaching assignments, section allocations, and course workload distribution</p>
      </div>

      <div className="panel p-5 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-theme-border text-theme-muted">
              <th className="text-left py-2 px-3">Faculty Member</th>
              <th className="text-left py-2 px-3">Subject / Course</th>
              <th className="text-center py-2 px-3">Section</th>
              <th className="text-center py-2 px-3">Weekly Hours</th>
              <th className="text-right py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Dr. Priya Menon', subject: 'Machine Learning', sec: 'CS-A', hours: 4, status: 'Active' },
              { name: 'Dr. Priya Menon', subject: 'Database Systems', sec: 'CS-B', hours: 4, status: 'Active' },
              { name: 'Prof. Suresh Kumar', subject: 'Computer Networks', sec: 'CS-A', hours: 4, status: 'Active' },
              { name: 'Prof. Suresh Kumar', subject: 'Software Engineering', sec: 'CS-A', hours: 3, status: 'Active' },
              { name: 'Dr. Anita Bose', subject: 'Operating Systems', sec: 'CS-A', hours: 4, status: 'Active' },
              { name: 'Dr. Anita Bose', subject: 'Algorithm Design', sec: 'CS-B', hours: 4, status: 'Active' },
            ].map((row, idx) => (
              <tr key={idx} className="border-b border-theme-border/50 hover:bg-theme-secondary/40 transition-colors">
                <td className="py-2.5 px-3 font-bold text-theme-text">{row.name}</td>
                <td className="py-2.5 px-3 text-theme-accent font-semibold">{row.subject}</td>
                <td className="py-2.5 px-3 text-center text-theme-muted">{row.sec}</td>
                <td className="py-2.5 px-3 text-center text-theme-muted">{row.hours} hrs/wk</td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── 4. ACCESS PERMISSIONS ────────────────────────────────────────────────────

export function AdminPermissionsPage() {
  const [permissions, setPermissions] = useState([
    { role: 'Student Portal', feature: 'View Personal Success Score & Breakdown', enabled: true },
    { role: 'Student Portal', feature: 'Submit Academic Problem Requests', enabled: true },
    { role: 'Student Portal', feature: 'View Other Students Data (Strictly Disabled)', enabled: false },
    { role: 'Faculty Portal', feature: 'Mark & Update Class Attendance', enabled: true },
    { role: 'Faculty Portal', feature: 'Create Student Interventions', enabled: true },
    { role: 'Faculty Portal', feature: 'Respond to Problem Requests', enabled: true },
    { role: 'Admin Portal', feature: 'Configure Institution Success Weights', enabled: true },
    { role: 'Admin Portal', feature: 'Upload & Merge CSV Cohort Datasets', enabled: true },
    { role: 'Admin Portal', feature: 'Purge & Reset Synthetic Demonstration Data', enabled: true },
  ]);

  const togglePerm = (idx: number) => {
    setPermissions(prev =>
      prev.map((p, i) => (i === idx ? { ...p, enabled: !p.enabled } : p))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-theme-text">Role-Based Access Permissions</h1>
        <p className="text-sm text-theme-muted mt-0.5">Enforce role isolation and access control across Student, Faculty, and Admin portals</p>
      </div>

      <div className="panel p-5 space-y-3">
        {permissions.map((p, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-theme-secondary border border-theme-border">
            <div>
              <span className="text-[10px] font-bold text-theme-accent uppercase tracking-wide block">{p.role}</span>
              <p className="text-xs font-semibold text-theme-text mt-0.5">{p.feature}</p>
            </div>
            <button
              onClick={() => togglePerm(idx)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                p.enabled
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                  : 'bg-red-500/15 text-red-400 border border-red-500/40'
              }`}
            >
              {p.enabled ? 'Granted' : 'Denied'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
