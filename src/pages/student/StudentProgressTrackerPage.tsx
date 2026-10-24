import React, { useState } from 'react';
import {
  Brain, Target, TrendingUp, AlertTriangle, CheckCircle2,
  Calendar, Mail, ShieldAlert, Award, ArrowUpRight
} from 'lucide-react';
import { RECOMMENDATIONS } from '../../data/portalData';
import { useStudentRecord } from '../../context/CurrentUserContext';

export function StudentProgressTrackerPage() {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'recommendations' | 'history' | 'email'>('weekly');
  const [weeklyEmailEnabled, setWeeklyEmailEnabled] = useState(true);
  const [monthlyEmailEnabled, setMonthlyEmailEnabled] = useState(false);

  const s = useStudentRecord();

  // Breakdown weights (UI_SPEC): Academic 30%, Attendance 20%, LMS 15%, Placement 20%, Skills 10%, Engagement 5%
  const scoreBreakdown = [
    { component: 'Academic Performance', score: 76, weight: 30, contribution: 22.8, notes: 'CGPA 7.8, Internals 72%' },
    { component: 'Attendance Record', score: 78, weight: 20, contribution: 15.6, notes: '78% overall attendance' },
    { component: 'Placement Readiness', score: 62, weight: 20, contribution: 12.4, notes: 'Coding 58, Aptitude 65, Interview 62' },
    { component: 'LMS Engagement', score: 80, weight: 15, contribution: 12.0, notes: '18 logins/mo, 80% assignments' },
    { component: 'Skills Assessment', score: 70, weight: 10, contribution: 7.0, notes: 'Technical 68, Soft Skills 72' },
    { component: 'Extracurricular Engagement', score: 65, weight: 5, contribution: 3.2, notes: '1 club, 1 hackathon, 2 certs' },
  ];

  const totalCalculated = Math.round(scoreBreakdown.reduce((sum, item) => sum + item.contribution, 0));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-theme-text">AI Progress Tracker</h1>
        <p className="text-sm text-theme-muted mt-0.5">Automated progress synthesis, explainable success score breakdowns, and prescriptive next steps</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-theme-border pb-3">
        {[
          { id: 'weekly', label: 'Weekly Report' },
          { id: 'monthly', label: 'Monthly Report' },
          { id: 'recommendations', label: 'Actionable Recommendations' },
          { id: 'history', label: 'Report History' },
          { id: 'email', label: 'Email Preferences' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'btn-primary'
                : 'bg-theme-secondary text-theme-muted hover:text-theme-text border border-theme-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: WEEKLY REPORT */}
      {activeTab === 'weekly' && (
        <div className="space-y-6">
          <div className="panel p-5 space-y-4 rounded-xl border border-theme-border">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-theme-text">Weekly Progress Digest (Week 41, Oct 2025)</h3>
                <p className="text-xs text-theme-muted">Generated on Monday, Oct 6, 2025</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-theme-accent/10 text-theme-accent border border-theme-accent/30">
                Weekly Active
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-theme-text uppercase tracking-wide">What Changed This Week</h4>
              <ul className="text-xs text-theme-muted space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-theme-accent mt-1.5" />
                  <span><strong className="text-theme-text">Machine Learning Test 2:</strong> Scored 19/20 (95%). Internal percentage jumped from 72% to 78%.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" />
                  <span><strong className="text-theme-text">Attendance Slippage:</strong> Missed 3 consecutive lectures on Tuesday (Oct 7), bringing Networks attendance down to 71%.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                  <span><strong className="text-theme-text">Assignment Completion:</strong> Submitted Operating Systems Lab assignment ahead of the deadline.</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold text-theme-text uppercase tracking-wide mb-3">Priority Action Goals for This Week</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="panel-raised p-4 rounded-xl border border-theme-border space-y-2">
                  <div className="flex items-center gap-2 text-theme-accent font-bold text-xs">
                    <Target className="w-4 h-4" /> Goal 1: Zero Absences
                  </div>
                  <p className="text-[11px] text-theme-muted">Maintain 100% attendance across Computer Networks and Software Engineering this entire week.</p>
                </div>
                <div className="panel-raised p-4 rounded-xl border border-theme-border space-y-2">
                  <div className="flex items-center gap-2 text-theme-accent font-bold text-xs">
                    <Brain className="w-4 h-4" /> Goal 2: Coding Practice
                  </div>
                  <p className="text-[11px] text-theme-muted">Complete 5 LeetCode array and string questions to prepare for the upcoming technical round.</p>
                </div>
                <div className="panel-raised p-4 rounded-xl border border-theme-border space-y-2">
                  <div className="flex items-center gap-2 text-theme-accent font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> Goal 3: Faculty Connect
                  </div>
                  <p className="text-[11px] text-theme-muted">Follow up with Prof. Suresh Kumar regarding problem request REQ-001 (VLSM subnetting).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MONTHLY REPORT & EXPLAINABLE BREAKDOWN */}
      {activeTab === 'monthly' && (
        <div className="space-y-6">
          <div className="panel p-5 space-y-5 rounded-xl border border-theme-border">
            <div>
              <h3 className="text-sm font-bold text-theme-text">Student Success Score — Explainable Breakdown</h3>
              <p className="text-xs text-theme-muted mt-0.5">
                Calculated deterministically using standardized institutional weights without black-box estimation.
              </p>
            </div>

            {/* Score Pill */}
            <div className="panel-raised p-4 rounded-xl border border-theme-border flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-[11px] font-semibold text-theme-muted uppercase tracking-wider block">Unified Student Success Score</span>
                <div className="text-3xl font-extrabold text-theme-text mt-0.5">
                  <span className="text-theme-accent">{totalCalculated}</span> / 100
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs px-3 py-1 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Good Standing (Balanced Performer)
                </span>
                <p className="text-[10px] text-theme-muted mt-1">Data Completeness: 100% (6 of 6 domains valid)</p>
              </div>
            </div>

            {/* Component breakdown table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-theme-border text-theme-muted">
                    <th className="text-left py-2 px-3">Domain</th>
                    <th className="text-center py-2 px-3">Raw Score (0-100)</th>
                    <th className="text-center py-2 px-3">Configured Weight</th>
                    <th className="text-center py-2 px-3">Weighted Points</th>
                    <th className="text-left py-2 px-3">Evidence & Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {scoreBreakdown.map((row, idx) => (
                    <tr key={idx} className="border-b border-theme-border/50 hover:bg-theme-secondary/40 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-theme-text">{row.component}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-theme-text">{row.score}</td>
                      <td className="py-2.5 px-3 text-center text-theme-muted">{row.weight}%</td>
                      <td className="py-2.5 px-3 text-center font-extrabold text-theme-accent">{row.contribution.toFixed(1)}</td>
                      <td className="py-2.5 px-3 text-theme-muted">{row.notes}</td>
                    </tr>
                  ))}
                  <tr className="bg-theme-secondary/60 font-bold border-t border-theme-border">
                    <td className="py-3 px-3 text-theme-text">Total Composite Score</td>
                    <td className="py-3 px-3 text-center text-theme-muted">—</td>
                    <td className="py-3 px-3 text-center text-theme-accent">100%</td>
                    <td className="py-3 px-3 text-center text-theme-accent text-sm font-extrabold">{totalCalculated.toFixed(1)}</td>
                    <td className="py-3 px-3 text-theme-muted">Deterministic linear sum</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Risk Explanation */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <AlertTriangle className="w-4 h-4" /> Why Placement Risk is Flagged as "Moderate":
              </div>
              <p className="text-xs text-theme-muted leading-relaxed">
                While your academic CGPA (7.8) and attendance (78%) are satisfactory, your <strong className="text-theme-text">Coding Assessment Score (58/100)</strong> falls below the 65-point benchmark. 
                Improving coding proficiency by just +15 points would raise your Placement Readiness score from 62 to 74, shifting your overall Success Score to 76/100.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          <p className="text-xs text-theme-muted">
            Action items synthesized from your latest academic submissions, attendance records, and placement assessments:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RECOMMENDATIONS.map(rec => (
              <div key={rec.id} className="panel p-5 rounded-xl border border-theme-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-theme-accent/15 text-theme-accent border border-theme-accent/30">
                    {rec.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rec.priority === 'High' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                    rec.priority === 'Medium' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                    'bg-theme-secondary text-theme-muted'
                  }`}>
                    {rec.priority} Priority
                  </span>
                </div>
                <h4 className="text-sm font-bold text-theme-text">{rec.title}</h4>
                <div className="text-xs text-theme-muted">
                  <strong className="text-theme-text">Observed Evidence:</strong> {rec.evidence}
                </div>
                <div className="p-3 rounded-lg bg-theme-secondary border border-theme-border text-xs text-theme-accent flex items-start gap-2">
                  <ArrowUpRight className="w-4 h-4 text-theme-accent shrink-0 mt-0.5" />
                  <span><strong className="text-theme-text">Suggested Action:</strong> {rec.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REPORT HISTORY */}
      {activeTab === 'history' && (
        <div className="panel p-5 space-y-4 rounded-xl border border-theme-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-theme-text uppercase tracking-wide">Archived Progress Reports</h3>
            <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Sample archived records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-theme-border text-theme-muted">
                  <th className="text-left py-2 px-3">Report Period</th>
                  <th className="text-left py-2 px-3">Type</th>
                  <th className="text-center py-2 px-3">Success Score</th>
                  <th className="text-center py-2 px-3">CGPA Recorded</th>
                  <th className="text-center py-2 px-3">Attendance</th>
                  <th className="text-right py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { period: 'October 2025 (W1)', type: 'Weekly', score: 72, cgpa: 7.8, att: '78%', status: 'Active' },
                  { period: 'September 2025', type: 'Monthly', score: 71, cgpa: 7.8, att: '76%', status: 'Archived' },
                  { period: 'August 2025', type: 'Monthly', score: 74, cgpa: 7.7, att: '82%', status: 'Archived' },
                  { period: 'July 2025', type: 'Monthly', score: 70, cgpa: 7.6, att: '75%', status: 'Archived' },
                ].map((rep, idx) => (
                  <tr key={idx} className="border-b border-theme-border/50 hover:bg-theme-secondary/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-theme-text">{rep.period}</td>
                    <td className="py-2.5 px-3 text-theme-muted">{rep.type}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-theme-accent">{rep.score}/100</td>
                    <td className="py-2.5 px-3 text-center text-theme-muted">{rep.cgpa}</td>
                    <td className="py-2.5 px-3 text-center text-theme-muted">{rep.att}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="text-[10px] font-semibold text-theme-muted px-2 py-0.5 rounded bg-theme-secondary border border-theme-border">
                        {rep.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: EMAIL PREFERENCES */}
      {activeTab === 'email' && (
        <div className="panel p-5 space-y-6 max-w-xl rounded-xl border border-theme-border">
          <div>
            <h3 className="text-sm font-bold text-theme-text">Automated Report Email Preferences</h3>
            <p className="text-xs text-theme-muted mt-0.5">
              Choose how and when progress digests are dispatched to your registered college email.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-theme-secondary border border-theme-border">
              <div>
                <p className="text-xs font-bold text-theme-text">Weekly Performance Digest</p>
                <p className="text-[11px] text-theme-muted">Receive assessment updates and weekly priority goals every Monday at 8:00 AM.</p>
              </div>
              <input
                type="checkbox"
                checked={weeklyEmailEnabled}
                onChange={e => setWeeklyEmailEnabled(e.target.checked)}
                className="w-4 h-4 accent-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-theme-secondary border border-theme-border">
              <div>
                <p className="text-xs font-bold text-theme-text">Monthly Success Score Summary</p>
                <p className="text-[11px] text-theme-muted">Comprehensive report with domain-by-domain breakdown on the 1st of every month.</p>
              </div>
              <input
                type="checkbox"
                checked={monthlyEmailEnabled}
                onChange={e => setMonthlyEmailEnabled(e.target.checked)}
                className="w-4 h-4 accent-blue-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              disabled
              className="px-4 py-2 rounded-xl text-xs font-bold bg-theme-secondary text-theme-muted opacity-50 cursor-not-allowed flex items-center gap-2 border border-theme-border"
            >
              <Mail className="w-4 h-4" /> Send Test Email (Disabled — Requires SMTP Backend)
            </button>
            <p className="text-[10px] text-theme-muted mt-2">
              Note: Email dispatch is an enterprise backend capability and simulated in demo mode.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
