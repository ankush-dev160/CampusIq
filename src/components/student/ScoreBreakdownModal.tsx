import React from 'react';
import { UnifiedStudent } from '../../types/student';
import { useCampusData } from '../../context/CampusDataContext';
import { calculateStudentSuccessScore } from '../../engine/scoringEngine';
import { Modal } from '../common/Modal';
import { CheckCircle2, AlertCircle, HelpCircle, Info } from 'lucide-react';

interface ScoreBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: UnifiedStudent | null;
}

export const ScoreBreakdownModal: React.FC<ScoreBreakdownModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const { weights } = useCampusData();

  if (!student) return null;

  const scoreResult = calculateStudentSuccessScore(student, weights);
  const { final_score, is_insufficient_data, data_coverage_percentage, components, positive_indicators, areas_needing_attention } = scoreResult;

  const componentRows = [
    { key: 'academic', label: 'Academic Performance', data: components.academic },
    { key: 'attendance', label: 'Attendance Telemetry', data: components.attendance },
    { key: 'lms', label: 'LMS Engagement', data: components.lms },
    { key: 'engagement', label: 'Co-curricular & Certifications', data: components.engagement },
    { key: 'placement', label: 'Placement Readiness', data: components.placement },
    { key: 'skills', label: 'Skills Assessment', data: components.skills },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Explainable Student Success Score"
      subtitle={`Deterministic audit for ${student.name} (${student.student_id})`}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Top Summary Banner */}
        <div className="panel p-4 rounded-xl border border-theme-border flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">Composite Success Score</span>
            <div className="flex items-baseline gap-2 mt-1">
              {is_insufficient_data ? (
                <span className="text-xl font-bold text-theme-muted">Insufficient Data</span>
              ) : (
                <>
                  <span className="text-3xl font-extrabold text-theme-text">{final_score}</span>
                  <span className="text-sm font-semibold text-theme-muted">/ 100</span>
                </>
              )}
            </div>
            <p className="text-xs text-theme-muted mt-1">
              Verified campus data coverage: <strong className="text-theme-text">{data_coverage_percentage}%</strong>
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-theme-accent/15 text-theme-accent border border-theme-accent/30">
              Deterministic Engine
            </span>
          </div>
        </div>

        {/* Dynamic Weight Re-normalization Notice */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-600 dark:text-cyan-300">
          <Info className="w-4 h-4 shrink-0 text-cyan-500 dark:text-cyan-400 mt-0.5" />
          <p>
            Missing metrics are never penalized as zero. The engine transparently re-normalizes weights across present, verified indicators to prevent skewed administrative decisions.
          </p>
        </div>

        {/* Detailed Component Table */}
        <div className="border border-theme-border rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-theme-secondary/60 text-theme-muted border-b border-theme-border">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Component</th>
                <th className="py-2.5 px-3 font-semibold text-right">Score</th>
                <th className="py-2.5 px-3 font-semibold text-right">Config Weight</th>
                <th className="py-2.5 px-3 font-semibold text-right">Effective Weight</th>
                <th className="py-2.5 px-3 font-semibold text-right">Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border/50">
              {componentRows.map(row => (
                <tr key={row.key} className="hover:bg-theme-secondary/30 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-theme-text">{row.label}</div>
                    <div className="text-[11px] text-theme-muted truncate max-w-[260px]">{row.data.notes}</div>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {row.data.is_available ? (
                      <span className="font-semibold text-theme-text">{row.data.score}</span>
                    ) : (
                      <span className="text-theme-muted italic">Missing</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right text-theme-muted">{row.data.weight}%</td>
                  <td className="py-2.5 px-3 text-right text-theme-text font-medium">
                    {row.data.is_available ? `${row.data.effective_weight}%` : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-theme-accent">
                    {row.data.is_available ? `+${row.data.weighted_points}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Evidence & Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Positive indicators */}
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Positive Indicators</span>
            </div>
            {positive_indicators.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-emerald-300">
                {positive_indicators.map((ind, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-theme-muted italic">No exceptional strengths identified.</p>
            )}
          </div>

          {/* Areas needing attention */}
          <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 mb-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>Areas Needing Attention</span>
            </div>
            {areas_needing_attention.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-red-300">
                {areas_needing_attention.map((area, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-red-400 font-bold">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-theme-muted italic">No critical performance deficits detected.</p>
            )}
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={onClose}
            className="btn-primary px-4 py-2 text-xs font-semibold rounded-lg transition"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </Modal>
  );
};
