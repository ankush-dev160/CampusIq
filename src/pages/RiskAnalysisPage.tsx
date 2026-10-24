import React, { useState } from 'react';
import { useCampusData } from '../context/CampusDataContext';
import { evaluateAcademicRisk } from '../engine/academicRiskEngine';
import { evaluatePlacementRisk } from '../engine/placementRiskEngine';
import { Badge } from '../components/common/Badge';
import { CreateInterventionModal } from '../components/intervention/CreateInterventionModal';
import { UnifiedStudent } from '../types/student';
import {
  AlertTriangle,
  Briefcase,
  CheckCircle,
  HelpCircle,
  LifeBuoy,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';

export const RiskAnalysisPage: React.FC = () => {
  const { filteredStudents, academicThresholds, placementThresholds, setSelectedStudent } = useCampusData();

  const [activeTab, setActiveTab] = useState<'matrix' | 'academic' | 'placement'>('matrix');
  const [selectedStudentForIntervention, setSelectedStudentForIntervention] = useState<UnifiedStudent | null>(null);

  // 1. Cross-tabulation Matrix (Academic Risk vs Placement Risk)
  const matrix: Record<string, Record<string, UnifiedStudent[]>> = {
    High: { High: [], Moderate: [], Low: [] },
    Moderate: { High: [], Moderate: [], Low: [] },
    Low: { High: [], Moderate: [], Low: [] },
  };

  const highPriorityRoster: {
    student: UnifiedStudent;
    acadRisk: ReturnType<typeof evaluateAcademicRisk>;
    placeRisk: ReturnType<typeof evaluatePlacementRisk>;
  }[] = [];

  // 2. Count rule frequencies
  const ruleCounts: Record<string, { name: string; count: number; category: string; severity: string }> = {};

  filteredStudents.forEach(s => {
    const acad = evaluateAcademicRisk(s, academicThresholds);
    const place = evaluatePlacementRisk(s, placementThresholds);

    if (matrix[acad.risk_level]?.[place.risk_level]) {
      matrix[acad.risk_level][place.risk_level].push(s);
    }

    if (acad.risk_level === 'High' || place.risk_level === 'High') {
      highPriorityRoster.push({ student: s, acadRisk: acad, placeRisk: place });
    }

    acad.triggered_rules.forEach(r => {
      if (!ruleCounts[r.id]) {
        ruleCounts[r.id] = { name: r.rule_name, count: 0, category: r.category, severity: r.severity };
      }
      ruleCounts[r.id].count += 1;
    });

    place.triggered_rules.forEach(r => {
      if (!ruleCounts[r.id]) {
        ruleCounts[r.id] = { name: r.rule_name, count: 0, category: r.category, severity: r.severity };
      }
      ruleCounts[r.id].count += 1;
    });
  });

  const sortedRules = Object.values(ruleCounts).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-theme-border overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all duration-150 whitespace-nowrap ${
            activeTab === 'matrix'
              ? 'border-theme-accent text-theme-accent'
              : 'border-transparent text-theme-muted hover:text-theme-text'
          }`}
        >
          Cross-Tabulation Matrix
        </button>
        <button
          onClick={() => setActiveTab('academic')}
          className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all duration-150 whitespace-nowrap ${
            activeTab === 'academic'
              ? 'border-theme-accent text-theme-accent'
              : 'border-transparent text-theme-muted hover:text-theme-text'
          }`}
        >
          Academic Risk Rules ({filteredStudents.filter(s => evaluateAcademicRisk(s, academicThresholds).risk_level !== 'Low').length})
        </button>
        <button
          onClick={() => setActiveTab('placement')}
          className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all duration-150 whitespace-nowrap ${
            activeTab === 'placement'
              ? 'border-theme-accent text-theme-accent'
              : 'border-transparent text-theme-muted hover:text-theme-text'
          }`}
        >
          Placement Risk Rules ({filteredStudents.filter(s => evaluatePlacementRisk(s, placementThresholds).risk_level !== 'Low').length})
        </button>
      </div>

      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Dual Risk Cross-Tabulation Grid */}
          <div className="bg-theme-surface rounded-2xl border border-theme-border p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-theme-text">Dual Risk Cross-Tabulation Grid</h3>
              <p className="text-xs text-theme-muted mt-0.5">
                Segmenting students across both Academic Support criteria (Vertical) and Career Placement Readiness (Horizontal).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 text-left font-semibold text-theme-muted uppercase text-[10px] w-36">
                      Academic ↓ / Placement →
                    </th>
                    <th className="p-3 font-bold text-red-600 dark:text-red-400 bg-red-500/10 border border-theme-border rounded-t-lg">
                      Placement: High Risk
                    </th>
                    <th className="p-3 font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-theme-border">
                      Placement: Moderate
                    </th>
                    <th className="p-3 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-theme-border rounded-t-lg">
                      Placement: Low Risk
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Row 1: Academic High */}
                  <tr>
                    <td className="p-3 font-bold text-left text-red-600 dark:text-red-400 bg-red-500/10 border border-theme-border">
                      Academic High
                    </td>
                    <td className="p-4 border border-theme-border bg-red-500/15">
                      <div className="text-xl font-extrabold text-red-600 dark:text-red-400">{matrix.High.High.length}</div>
                      <div className="text-[10px] text-red-600 dark:text-red-400 font-semibold uppercase tracking-wider mt-0.5">
                        Urgent Dual Intervention
                      </div>
                    </td>
                    <td className="p-4 border border-theme-border bg-theme-surface">
                      <div className="text-xl font-extrabold text-theme-text">{matrix.High.Moderate.length}</div>
                      <div className="text-[10px] text-theme-muted mt-0.5">Academic Focus First</div>
                    </td>
                    <td className="p-4 border border-theme-border bg-theme-surface">
                      <div className="text-xl font-extrabold text-theme-text">{matrix.High.Low.length}</div>
                      <div className="text-[10px] text-theme-muted mt-0.5">Good Skills, Clear Arrears</div>
                    </td>
                  </tr>

                  {/* Row 2: Academic Moderate */}
                  <tr>
                    <td className="p-3 font-bold text-left text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-theme-border">
                      Academic Moderate
                    </td>
                    <td className="p-4 border border-theme-border bg-theme-surface">
                      <div className="text-xl font-extrabold text-theme-text">{matrix.Moderate.High.length}</div>
                      <div className="text-[10px] text-theme-muted mt-0.5">Placement Priority</div>
                    </td>
                    <td className="p-4 border border-theme-border bg-theme-surface">
                      <div className="text-xl font-extrabold text-theme-text">{matrix.Moderate.Moderate.length}</div>
                      <div className="text-[10px] text-theme-muted mt-0.5">Balanced Support</div>
                    </td>
                    <td className="p-4 border border-theme-border bg-theme-surface">
                      <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{matrix.Moderate.Low.length}</div>
                      <div className="text-[10px] text-theme-muted mt-0.5">Monitor Attendance</div>
                    </td>
                  </tr>

                  {/* Row 3: Academic Low */}
                  <tr>
                    <td className="p-3 font-bold text-left text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-theme-border">
                      Academic Low
                    </td>
                    <td className="p-4 border border-theme-border bg-theme-surface">
                      <div className="text-xl font-extrabold text-theme-text">{matrix.Low.High.length}</div>
                      <div className="text-[10px] text-theme-muted font-semibold uppercase tracking-wider mt-0.5">
                        High GPA / Low Skill Gap
                      </div>
                    </td>
                    <td className="p-4 border border-theme-border bg-theme-surface">
                      <div className="text-xl font-extrabold text-theme-text">{matrix.Low.Moderate.length}</div>
                      <div className="text-[10px] text-theme-muted mt-0.5">Prep Needed</div>
                    </td>
                    <td className="p-4 border border-theme-border bg-emerald-500/10">
                      <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{matrix.Low.Low.length}</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider mt-0.5">
                        Dual Excellence
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Rule Trigger Frequency Leaderboard */}
          <div className="bg-theme-surface rounded-2xl border border-theme-border p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-theme-text">Campus-Wide Rule Trigger Frequency</h3>
            <p className="text-xs text-theme-muted">
              Institutional rules triggered most frequently across active students in descending order.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {sortedRules.slice(0, 6).map((rule, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-theme-border bg-theme-elevated flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-theme-text">{rule.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-theme-surface text-theme-muted border border-theme-border">
                        {rule.category}
                      </span>
                    </div>
                    <span className="text-[11px] text-theme-muted mt-1 block">
                      Severity: <strong className={rule.severity === 'High' ? 'text-red-500' : 'text-amber-500'}>{rule.severity}</strong>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-theme-text">{rule.count}</span>
                    <span className="text-[10px] text-theme-muted block">students affected</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High Priority Urgent Review Roster */}
          <div className="bg-theme-surface rounded-2xl border border-theme-border p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-theme-text flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  Urgent Priority Review Roster ({highPriorityRoster.length} Students)
                </h3>
                <p className="text-xs text-theme-muted mt-0.5">
                  Students flagged with Critical High Risk in either Academic Standing or Placement Screening.
                </p>
              </div>
            </div>

            <div className="divide-y divide-theme-border/50 max-h-[450px] overflow-y-auto pr-1">
              {highPriorityRoster.map(({ student, acadRisk, placeRisk }) => (
                <div
                  key={student.student_id}
                  className="py-3 flex flex-wrap items-center justify-between gap-3 hover:bg-theme-elevated/60 p-2.5 rounded-xl transition"
                >
                  <div
                    className="cursor-pointer space-y-0.5 flex-1 min-w-[200px]"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-theme-text hover:text-theme-accent transition">
                        {student.name}
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-theme-elevated text-theme-muted border border-theme-border">
                        {student.student_id}
                      </span>
                      <span className="text-xs text-theme-muted">• {student.department}</span>
                    </div>
                    <div className="text-xs text-theme-muted">
                      CGPA: <strong className="text-theme-text">{student.academic.cgpa?.toFixed(2) ?? '—'}</strong> | Backlogs:{' '}
                      <strong className="text-red-500">{student.academic.backlogs ?? 0}</strong> | Att:{' '}
                      <strong className="text-theme-text">{student.attendance.overall_attendance?.toFixed(0) ?? '—'}%</strong> | Coding:{' '}
                      <strong className="text-theme-text">{student.placement.coding_score ?? '—'}</strong>
                    </div>
                  </div>

                  {/* Risk Badges */}
                  <div className="flex items-center gap-2">
                    <Badge label={`Acad: ${acadRisk.risk_level}`} riskLevel={acadRisk.risk_level} size="sm" />
                    <Badge label={`Place: ${placeRisk.risk_level}`} riskLevel={placeRisk.risk_level} size="sm" />
                    <button
                      onClick={() => setSelectedStudentForIntervention(student)}
                      className="px-3 py-1 text-xs font-semibold rounded-xl bg-theme-accent-muted text-theme-accent border border-theme-accent-border hover:bg-theme-accent hover:text-theme-accent-text transition flex items-center gap-1.5"
                    >
                      <LifeBuoy className="w-3.5 h-3.5" />
                      Intervene
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ACADEMIC TAB */}
      {activeTab === 'academic' && (
        <div className="space-y-4">
          <div className="bg-theme-surface rounded-2xl border border-theme-border p-5 shadow-sm space-y-2">
            <h3 className="text-sm font-bold text-theme-text">Academic Risk Rule Thresholds</h3>
            <p className="text-xs text-theme-muted">
              Deterministic academic rules evaluated: Attendance &lt; {academicThresholds.min_attendance_critical}% (Critical), CGPA &lt; {academicThresholds.min_cgpa_critical} (Critical), Backlogs &gt; 0, and Internals &lt; {academicThresholds.min_internal_marks_critical}%.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents
              .filter(s => evaluateAcademicRisk(s, academicThresholds).risk_level !== 'Low')
              .map(student => {
                const risk = evaluateAcademicRisk(student, academicThresholds);
                return (
                  <div
                    key={student.student_id}
                    onClick={() => setSelectedStudent(student)}
                    className="p-5 rounded-2xl bg-theme-surface border border-theme-border shadow-sm hover:border-theme-accent-border transition cursor-pointer space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-theme-text">{student.name}</h4>
                        <span className="text-[11px] font-mono text-theme-muted">
                          {student.student_id} • {student.department}
                        </span>
                      </div>
                      <Badge label={risk.risk_level} riskLevel={risk.risk_level} size="sm" />
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {risk.triggered_rules.map(r => (
                        <div key={r.id} className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                          <div className="font-semibold text-red-600 dark:text-red-400">{r.rule_name}</div>
                          <div className="text-[11px] text-theme-muted mt-0.5">{r.evidence}</div>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] font-semibold text-theme-accent pt-1">
                      Next Step: {risk.suggested_next_steps[0]}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* PLACEMENT TAB */}
      {activeTab === 'placement' && (
        <div className="space-y-4">
          <div className="bg-theme-surface rounded-2xl border border-theme-border p-5 shadow-sm space-y-2">
            <h3 className="text-sm font-bold text-theme-text">Placement Screening Risk Engine</h3>
            <p className="text-xs text-theme-muted">
              Evaluates aptitude (cutoff {placementThresholds.min_aptitude_score}), coding (cutoff {placementThresholds.min_coding_score}), mock interviews, and training attendance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents
              .filter(s => evaluatePlacementRisk(s, placementThresholds).risk_level !== 'Low')
              .map(student => {
                const place = evaluatePlacementRisk(student, placementThresholds);
                return (
                  <div
                    key={student.student_id}
                    onClick={() => setSelectedStudent(student)}
                    className="p-5 rounded-2xl bg-theme-surface border border-theme-border shadow-sm hover:border-theme-accent-border transition cursor-pointer space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-theme-text">{student.name}</h4>
                        <span className="text-[11px] font-mono text-theme-muted">
                          {student.student_id} • {student.department}
                        </span>
                      </div>
                      <div className="text-right">
                        <Badge label={place.risk_level} riskLevel={place.risk_level} size="sm" />
                        <span className="text-[10px] text-theme-muted block mt-0.5">
                          Readiness: {place.readiness_score ?? 'N/A'}/100
                        </span>
                      </div>
                    </div>

                    {place.patterns.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                        Pattern: {place.patterns[0]}
                      </div>
                    )}

                    <div className="space-y-1.5 text-xs">
                      {place.triggered_rules.map(r => (
                        <div key={r.id} className="p-2.5 rounded-xl bg-theme-elevated border border-theme-border">
                          <div className="font-semibold text-theme-text">{r.rule_name}</div>
                          <div className="text-[11px] text-theme-muted mt-0.5">{r.evidence}</div>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] font-semibold text-theme-accent pt-1">
                      Suggested Action: {place.suggested_next_steps[0]}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Intervention Modal */}
      <CreateInterventionModal
        isOpen={!!selectedStudentForIntervention}
        onClose={() => setSelectedStudentForIntervention(null)}
        preselectedStudent={selectedStudentForIntervention}
      />
    </div>
  );
};
