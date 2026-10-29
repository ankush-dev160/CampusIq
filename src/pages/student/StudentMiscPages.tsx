import React, { useState } from 'react';
import {
  MessageSquare, Send, CheckCircle2, Clock, AlertCircle,
  User, Shield, Mail, Phone, MapPin, Camera, Moon, Sun, Lock, Sparkles
} from 'lucide-react';
import { DEMO_PROBLEMS, DEMO_STUDENT } from '../../data/portalData';
import { useStudentRecord } from '../../context/CurrentUserContext';
import { useTheme } from '../../context/ThemeContext';

// ─── 1. MY PROBLEM REQUESTS PAGE ──────────────────────────────────────────────

export function StudentMyProblemPage() {
  const studentRecord = useStudentRecord();
  const student = studentRecord || DEMO_STUDENT;
  const subjects = student.subjects?.length ? student.subjects : DEMO_STUDENT.subjects;
  const [requests, setRequests] = useState(DEMO_PROBLEMS);
  const [subject, setSubject] = useState(subjects[0]?.name || 'Machine Learning');
  const [topic, setTopic] = useState('');
  const [faculty, setFaculty] = useState(subjects[0]?.faculty || 'Dr. Priya Menon');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'Important'>('Normal');
  const [submittedAlert, setSubmittedAlert] = useState<string | null>(null);

  // Sync faculty when subject changes
  const handleSubjectChange = (newSub: string) => {
    setSubject(newSub);
    const match = (subjects || []).find((s: any) => s.name === newSub);
    if (match) setFaculty(match.faculty);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.length < 10) return;

    const newId = `REQ-00${requests.length + 1}`;
    const newReq = {
      id: newId,
      student: student.name,
      roll: student.roll_no,
      subject,
      topic: topic.trim() || 'General Query',
      faculty,
      description,
      priority,
      status: 'Pending' as const,
      submitted: new Date().toISOString().split('T')[0],
      reply: '',
      next_step: '',
    };

    setRequests([newReq, ...requests]);
    setSubmittedAlert(`Request ${newId} submitted. Status: Pending`);
    setDescription('');
    setTopic('');
    setTimeout(() => setSubmittedAlert(null), 5000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-theme-text">My Problem Requests</h1>
        <p className="text-sm text-theme-muted mt-0.5">Submit academic queries and support requests directly to assigned course faculty</p>
      </div>

      {submittedAlert && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {submittedAlert}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Submission Form (5 cols) */}
        <div className="lg:col-span-5 panel p-5 space-y-4">
          <h3 className="text-sm font-bold text-theme-text">Submit New Academic Request</h3>
          <p className="text-xs text-theme-muted">
            Faculty will be notified and can propose one-on-one reviews or assignment revisions.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-theme-text block mb-1">Subject</label>
              <select
                value={subject}
                onChange={e => handleSubjectChange(e.target.value)}
                className="w-full bg-theme-secondary border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text focus:border-theme-accent outline-none"
              >
                {(subjects || []).map(s => (
                  <option key={s.name} value={s.name} className="bg-theme-surface text-theme-text">
                    {s.name} ({s.faculty})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-theme-text block mb-1">Faculty In-Charge</label>
              <input
                type="text"
                disabled
                value={faculty}
                className="w-full bg-theme-secondary/60 border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-muted cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-theme-text block mb-1">Topic / Specific Concept (Optional)</label>
              <input
                type="text"
                placeholder="e.g., Dynamic Programming memoization"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full bg-theme-secondary border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text placeholder-theme-muted focus:border-theme-accent outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-theme-text block mb-1">Priority Level</label>
              <div className="flex gap-4">
                {(['Normal', 'Important'] as const).map(p => (
                  <label key={p} className="flex items-center gap-1.5 text-xs text-theme-text cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      checked={priority === p}
                      onChange={() => setPriority(p)}
                      className="accent-theme-accent"
                    />
                    {p}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-theme-text block mb-1">
                Detailed Description <span className="text-[10px] text-theme-muted">(min. 10 chars)</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Describe specifically what concept you are struggling with..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-theme-secondary border border-theme-border rounded-lg p-3 text-xs text-theme-text placeholder-theme-muted focus:border-theme-accent outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={description.trim().length < 10}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                description.trim().length >= 10
                  ? 'btn-primary text-white shadow-sm'
                  : 'bg-theme-secondary border border-theme-border text-theme-muted cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" /> Submit Request
            </button>
          </form>
        </div>

        {/* Right: Request History & Replies (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-theme-text">Your Submitted Requests ({requests.length})</h3>

          <div className="space-y-3">
            {requests.map(req => (
              <div key={req.id} className="panel p-4 space-y-3">
                <div className="flex items-start justify-between flex-wrap gap-2 border-b border-theme-border pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-theme-accent">{req.id}</span>
                      <span className="text-xs font-bold text-theme-text">{req.subject}</span>
                    </div>
                    <p className="text-[11px] text-theme-muted mt-0.5">Faculty: {req.faculty} · Submitted: {req.submitted}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {req.priority === 'Important' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30">
                        Important
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      req.status === 'Resolved' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                      req.status === 'In Progress' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' :
                      'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] text-theme-muted uppercase font-semibold">Topic: {req.topic}</p>
                  <p className="text-xs text-theme-text mt-1 leading-relaxed">{req.description}</p>
                </div>

                {/* Faculty Response if available */}
                {req.reply ? (
                  <div className="p-3 rounded-lg bg-theme-secondary border border-theme-border space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-theme-accent font-bold">
                      <span>Faculty Response ({req.faculty})</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs text-theme-text">{req.reply}</p>
                    {req.next_step && (
                      <p className="text-[11px] text-amber-400 font-semibold pt-1 border-t border-theme-border">
                        Next Step: {req.next_step}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-theme-secondary/50 border border-theme-border text-[11px] text-theme-muted flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Awaiting faculty review and response.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 2. STUDENT PROFILE & SETTINGS ────────────────────────────────────────────

export function StudentProfilePage() {
  const sRecord = useStudentRecord();
  const s = sRecord || DEMO_STUDENT;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-theme-text">My Profile</h1>
        <p className="text-sm text-theme-muted mt-0.5">Academic registration details, institutional credentials, and student snapshot</p>
      </div>

      {/* Header banner card */}
      <div className="panel overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-blue-600/25 via-cyan-500/15 to-blue-800/25 border-b border-theme-border" />
        <div className="p-6 relative pt-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-12 gap-4 pb-4 border-b border-theme-border">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-md border-4 border-theme-surface">
                {s.avatar_initials}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-theme-text">{s.name}</h2>
                <p className="text-xs text-theme-muted mt-0.5">{s.department} · {s.academic_year} ({s.semester})</p>
                <div className="flex items-center gap-2 justify-center sm:justify-start mt-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    Roll: {s.roll_no}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Enrolled Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Snapshot Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="panel-raised p-3 rounded-xl border border-theme-border">
              <span className="text-[10px] text-theme-muted uppercase font-semibold">Cumulative CGPA</span>
              <div className="text-lg font-bold text-blue-400 mt-0.5">{(Number(s?.cgpa) || 7.5).toFixed(2)}</div>
            </div>
            <div className="panel-raised p-3 rounded-xl border border-theme-border">
              <span className="text-[10px] text-theme-muted uppercase font-semibold">Overall Attendance</span>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">{s?.overall_attendance ?? 82}%</div>
            </div>
            <div className="panel-raised p-3 rounded-xl border border-theme-border">
              <span className="text-[10px] text-theme-muted uppercase font-semibold">Success Score</span>
              <div className="text-lg font-bold text-cyan-400 mt-0.5">{s?.success_score ?? 85}/100</div>
            </div>
            <div className="panel-raised p-3 rounded-xl border border-theme-border">
              <span className="text-[10px] text-theme-muted uppercase font-semibold">Active Backlogs</span>
              <div className="text-lg font-bold text-theme-text mt-0.5">{s?.backlogs ?? 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="panel p-5 space-y-3">
          <h3 className="text-sm font-bold text-theme-text">Contact & Institutional Info</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-theme-border">
              <span className="text-theme-muted">Institutional Email</span>
              <span className="text-theme-text font-medium">{s?.email || 'student@campusiq.edu'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-theme-border">
              <span className="text-theme-muted">Contact Number</span>
              <span className="text-theme-text font-medium">{s?.phone || '+91 98765 43210'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-theme-border">
              <span className="text-theme-muted">Date of Birth</span>
              <span className="text-theme-text font-medium">{s?.dob || '2004-05-15'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-theme-border">
              <span className="text-theme-muted">Parent / Guardian</span>
              <span className="text-theme-text font-medium">{s?.guardian || 'Guardian'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-theme-muted">Permanent Address</span>
              <span className="text-theme-text font-medium">{s?.address || 'Campus Hostel Block B'}</span>
            </div>
          </div>
        </div>

        <div className="panel p-5 space-y-3">
          <h3 className="text-sm font-bold text-theme-text">Current Semester Enrolled Subjects</h3>
          <div className="space-y-2 text-xs">
            {(Array.isArray(s?.subjects) && s.subjects.length > 0 ? s.subjects : DEMO_STUDENT.subjects).map(sub => (
              <div key={sub.code} className="flex items-center justify-between p-2.5 rounded-lg bg-theme-secondary border border-theme-border">
                <div>
                  <span className="font-bold text-theme-text">{sub.code}: {sub.name}</span>
                  <p className="text-[10px] text-theme-muted">{sub.faculty}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  {sub.internal_pct ?? 78}% int
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 3. SETTINGS PAGE ─────────────────────────────────────────────────────────

export function StudentSettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-theme-text">Settings</h1>
        <p className="text-sm text-theme-muted mt-0.5">Portal preferences, appearance, and credentials</p>
      </div>

      <div className="panel p-5 space-y-4">
        <h3 className="text-sm font-bold text-theme-text">Interface Theme</h3>
        <p className="text-xs text-theme-muted">
          Select your visual environment preference. Both themes are calibrated for spatial clarity and high contrast.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              theme === 'dark'
                ? 'border-theme-accent bg-theme-secondary shadow-md'
                : 'border-theme-border bg-theme-surface hover:border-theme-accent/40'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#0b0f19] border border-white/10 flex items-center justify-center">
                <Moon className="w-4 h-4 text-blue-400" />
              </div>
              {theme === 'dark' && (
                <span className="w-2.5 h-2.5 rounded-full bg-theme-accent shadow-sm" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-theme-text">Theme A · Dark</p>
              <p className="text-[11px] text-theme-muted mt-0.5">Deep Blue & Slate</p>
            </div>
          </div>

          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              theme === 'light'
                ? 'border-theme-accent bg-theme-secondary shadow-md'
                : 'border-theme-border bg-theme-surface hover:border-theme-accent/40'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#f8fafc] border border-slate-200 flex items-center justify-center">
                <Sun className="w-4 h-4 text-blue-600" />
              </div>
              {theme === 'light' && (
                <span className="w-2.5 h-2.5 rounded-full bg-theme-accent shadow-sm" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-theme-text">Theme B · Light</p>
              <p className="text-[11px] text-theme-muted mt-0.5">Clean Blue & Crisp Glass</p>
            </div>
          </div>
        </div>
      </div>

      <div className="panel p-5 space-y-4">
        <h3 className="text-sm font-bold text-theme-text">Security Credentials</h3>
        <p className="text-xs text-theme-muted">
          Single sign-on managed via institutional directory. Password reset requires IT helpdesk ticket.
        </p>
        <button
          disabled
          className="px-4 py-2 rounded-xl text-xs font-bold bg-theme-secondary border border-theme-border text-theme-muted cursor-not-allowed flex items-center gap-2"
        >
          <Lock className="w-4 h-4" /> Change Password (Managed by College SSO)
        </button>
      </div>
    </div>
  );
}
