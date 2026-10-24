import React, { useState } from 'react';
import {
  Calendar, CheckCircle, AlertTriangle, Clock, ArrowRight,
  TrendingUp, Calculator, ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ReferenceLine
} from 'recharts';
import {
  MONTHLY_ATTENDANCE, ATTENDANCE_CALENDAR_OCT, DAY_LECTURES
} from '../../data/portalData';
import { useStudentRecord } from '../../context/CurrentUserContext';
import { useTheme } from '../../context/ThemeContext';

export function StudentAttendancePage() {
  const s = useStudentRecord();
  const { chartPalette } = useTheme();
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [targetAttendance, setTargetAttendance] = useState<number>(75);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(1); // 0: Sept, 1: Oct, 2: Nov

  const months = ['September 2025', 'October 2025', 'November 2025'];
  const calMonth = months[currentMonthIndex];

  // Projection math
  const targetPct = targetAttendance / 100;
  let classesNeeded = 0;
  if (targetPct < 1 && targetPct > (s.classes_attended / s.classes_conducted)) {
    classesNeeded = Math.ceil(((targetPct * s.classes_conducted) - s.classes_attended) / (1 - targetPct));
    if (classesNeeded < 0) classesNeeded = 0;
  }

  // Calendar setup for Oct 2025
  const daysInOct = 31;
  const startDay = 3;
  const calCells = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInOct }, (_, i) => i + 1),
  ];

  const statusColor: Record<string, string> = {
    present: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25',
    absent:  'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25',
    partial: 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25',
    holiday: 'bg-theme-secondary text-theme-muted border-theme-border',
  };

  const filteredSubjectAttendance = selectedSubject === 'All' 
    ? s.subject_attendance 
    : s.subject_attendance.filter(sub => sub.subject === selectedSubject);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-theme-text">Attendance Tracking</h1>
        <p className="text-sm text-theme-muted mt-0.5">Real-time attendance metrics, threshold alerts, and attendance projection</p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="panel p-5 rounded-xl border border-theme-border">
          <span className="text-[11px] font-semibold text-theme-muted uppercase tracking-wider">Overall Attendance</span>
          <div className="text-2xl font-extrabold text-theme-accent mt-1">{s.overall_attendance}%</div>
          <span className="text-xs text-theme-muted">Threshold: 75% required</span>
        </div>
        <div className="panel p-5 rounded-xl border border-theme-border">
          <span className="text-[11px] font-semibold text-theme-muted uppercase tracking-wider">Classes Attended</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{s.classes_attended}</div>
          <span className="text-xs text-theme-muted">Across 5 subjects</span>
        </div>
        <div className="panel p-5 rounded-xl border border-theme-border">
          <span className="text-[11px] font-semibold text-theme-muted uppercase tracking-wider">Classes Conducted</span>
          <div className="text-2xl font-extrabold text-theme-text mt-1">{s.classes_conducted}</div>
          <span className="text-xs text-theme-muted">Semester to date</span>
        </div>
        <div className="panel p-5 rounded-xl border border-theme-border">
          <span className="text-[11px] font-semibold text-theme-muted uppercase tracking-wider">Classes Missed</span>
          <div className="text-2xl font-extrabold text-red-400 mt-1">{s.classes_conducted - s.classes_attended}</div>
          <span className="text-xs text-theme-muted">26 absences total</span>
        </div>
      </div>

      {/* Low attendance warning box if any subject < 75 */}
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-bold text-red-400">Action Required: Low Attendance Subjects</h4>
          <p className="text-xs text-theme-muted mt-1 leading-relaxed">
            You are below the mandatory 75% threshold in <strong className="text-red-400">Computer Networks (71%)</strong> and <strong className="text-red-400">Software Engineering (71%)</strong>.
            You must attend approximately <strong>4 consecutive classes</strong> in each subject without absence to restore safe standing.
          </p>
        </div>
      </div>

      {/* Subject-wise Table + Subject Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 panel p-5 rounded-xl border border-theme-border space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-bold text-theme-text uppercase tracking-wide">Subject-wise Attendance Status</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-theme-muted">Filter:</span>
              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                className="bg-theme-secondary border border-theme-border text-xs text-theme-text rounded-lg px-2.5 py-1 focus:border-theme-accent outline-none"
              >
                <option value="All">All Subjects</option>
                {s.subject_attendance.map(sub => (
                  <option key={sub.subject} value={sub.subject}>{sub.subject}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-theme-border text-theme-muted">
                  <th className="text-left py-2 px-3">Subject</th>
                  <th className="text-center py-2 px-3">Conducted</th>
                  <th className="text-center py-2 px-3">Attended</th>
                  <th className="text-center py-2 px-3">Percentage</th>
                  <th className="text-right py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjectAttendance.map((sub, i) => (
                  <tr key={i} className="border-b border-theme-border/50 hover:bg-theme-secondary/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-theme-text">{sub.subject}</td>
                    <td className="py-2.5 px-3 text-center text-theme-muted">{sub.conducted}</td>
                    <td className="py-2.5 px-3 text-center text-theme-muted">{sub.attended}</td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`font-bold ${sub.pct < 75 ? 'text-red-400' : 'text-theme-accent'}`}>{sub.pct}%</span>
                        <div className="w-16 h-1.5 bg-theme-secondary rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full ${sub.pct < 75 ? 'bg-red-400' : 'bg-theme-accent'}`}
                            style={{ width: `${sub.pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sub.pct < 75 ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {sub.pct < 75 ? 'Low (<75%)' : 'Safe'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Projection Calculator */}
        <div className="panel p-5 rounded-xl border border-theme-border space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-theme-accent" />
            <h3 className="text-sm font-bold text-theme-text uppercase tracking-wide">Attendance Projection</h3>
          </div>
          <p className="text-xs text-theme-muted leading-relaxed">
            Estimate how many consecutive future classes you need to attend to achieve your desired target percentage.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-xs text-theme-text font-semibold block mb-1">Target Percentage (%)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="70"
                  max="95"
                  value={targetAttendance}
                  onChange={e => setTargetAttendance(Number(e.target.value))}
                  className="flex-1 accent-blue-500"
                />
                <span className="text-sm font-bold text-theme-accent w-10 text-right">{targetAttendance}%</span>
              </div>
            </div>

            <div className="panel-raised p-4 rounded-xl border border-theme-border text-center space-y-1">
              <span className="text-[11px] text-theme-muted uppercase font-semibold">Classes You Must Attend</span>
              <div className="text-3xl font-extrabold text-theme-text">{classesNeeded}</div>
              <p className="text-[11px] text-theme-muted">
                {classesNeeded === 0 
                  ? 'Your current attendance already meets or exceeds this target!'
                  : `Attend next ${classesNeeded} lectures without absence`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Month-wise Bar Chart with 75% Reference Line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="panel p-5 rounded-xl border border-theme-border space-y-4">
          <h3 className="text-sm font-bold text-theme-text uppercase tracking-wide">Monthly Attendance vs Institutional Threshold</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_ATTENDANCE}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.grid} />
              <XAxis dataKey="month" tick={{ fill: chartPalette.text, fontSize: 11 }} />
              <YAxis domain={[50, 100]} tick={{ fill: chartPalette.text, fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: chartPalette.tooltipBg,
                  borderColor: chartPalette.tooltipBorder,
                  color: chartPalette.tooltipText,
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <ReferenceLine y={75} stroke={chartPalette.danger} strokeDasharray="4 4" label={{ value: '75% Threshold', fill: chartPalette.danger, fontSize: 10, position: 'top' }} />
              <Bar dataKey="pct" fill={chartPalette.accent} radius={[6, 6, 0, 0]} name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Attendance Calendar Card */}
        <div className="panel p-5 rounded-xl border border-theme-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMonthIndex(prev => Math.max(0, prev - 1))}
                disabled={currentMonthIndex === 0}
                className="p-1 rounded-lg border border-theme-border text-theme-muted hover:text-theme-text disabled:opacity-30"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-bold text-theme-text">{calMonth}</h3>
              <button
                onClick={() => setCurrentMonthIndex(prev => Math.min(months.length - 1, prev + 1))}
                disabled={currentMonthIndex === months.length - 1}
                className="p-1 rounded-lg border border-theme-border text-theme-muted hover:text-theme-text disabled:opacity-30"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-theme-muted">Click any date for details</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
              <div key={d} className="text-[10px] font-bold text-theme-muted">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calCells.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} />;
              const key = `2025-10-${String(day).padStart(2,'0')}`;
              const st = ATTENDANCE_CALENDAR_OCT[key];
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(selectedDate === key ? null : key)}
                  className={`aspect-square flex items-center justify-center text-xs rounded-xl border transition-all ${
                    st ? statusColor[st] : 'text-theme-muted border-transparent hover:bg-theme-secondary'
                  } ${selectedDate === key ? 'ring-2 ring-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.4)]' : ''}`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Useful Legend */}
          <div className="flex flex-wrap gap-3 pt-2 text-[10px] text-theme-muted border-t border-theme-border">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500/25 border border-emerald-500/50" /> Present</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500/25 border border-red-500/50" /> Absent</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500/25 border border-amber-500/50" /> Partial</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-theme-secondary border border-theme-border" /> Holiday</span>
          </div>

          {selectedDate && DAY_LECTURES[selectedDate] && (
            <div className="panel-raised p-3.5 rounded-xl border border-theme-border space-y-1.5">
              <span className="text-xs font-bold text-theme-accent block mb-1">Lectures on {selectedDate}:</span>
              {DAY_LECTURES[selectedDate].map((lec, idx) => (
                <div key={idx} className="flex justify-between text-xs py-0.5">
                  <span className="text-theme-text">{lec.time} · {lec.subject} ({lec.faculty})</span>
                  <span className={`font-bold ${lec.status === 'Present' ? 'text-emerald-400' : 'text-red-400'}`}>{lec.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
