import React, { useState, useEffect } from 'react';
import { UnifiedStudent } from '../../types/student';
import { useCampusData } from '../../context/CampusDataContext';
import { simulateWhatIfScenario, WhatIfAdjustments } from '../../engine/whatIfSimulator';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Sliders, ArrowRight, RotateCcw, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';

interface WhatIfSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: UnifiedStudent | null;
}

export const WhatIfSimulatorModal: React.FC<WhatIfSimulatorModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const { weights } = useCampusData();

  const [adjustments, setAdjustments] = useState<WhatIfAdjustments>({
    attendance: student?.attendance.overall_attendance ?? 75,
    internal_marks: student?.academic.internal_marks ?? 65,
    assignment_completion: student?.lms.assignment_completion ?? 70,
    aptitude_score: student?.placement.aptitude_score ?? 60,
    coding_score: student?.placement.coding_score ?? 55,
    mock_interview_score: student?.placement.mock_interview_score ?? 60,
  });

  // Sync adjustments whenever student changes
  useEffect(() => {
    if (student) {
      setAdjustments({
        attendance: student.attendance.overall_attendance ?? 75,
        internal_marks: student.academic.internal_marks ?? 65,
        assignment_completion: student.lms.assignment_completion ?? 70,
        aptitude_score: student.placement.aptitude_score ?? 60,
        coding_score: student.placement.coding_score ?? 55,
        mock_interview_score: student.placement.mock_interview_score ?? 60,
      });
    }
  }, [student]);

  if (!student) return null;

  const simulation = simulateWhatIfScenario(student, adjustments, weights);
  const {
    originalScore,
    simulatedScore,
    scoreDelta,
    originalAcademicRisk,
    simulatedAcademicRisk,
    originalPlacementRisk,
    simulatedPlacementRisk,
    componentDeltas,
    keyTakeaways,
  } = simulation;

  const resetValues = () => {
    setAdjustments({
      attendance: student.attendance.overall_attendance ?? 75,
      internal_marks: student.academic.internal_marks ?? 65,
      assignment_completion: student.lms.assignment_completion ?? 70,
      aptitude_score: student.placement.aptitude_score ?? 60,
      coding_score: student.placement.coding_score ?? 55,
      mock_interview_score: student.placement.mock_interview_score ?? 60,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Interactive What-If Simulator"
      subtitle={`Simulate hypothetical performance trajectories for ${student.name} (${student.student_id})`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Advisory banner */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-400">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            <strong>Hypothetical Projection:</strong> Simulated scores evaluate sensitivity to specific interventions and are not a guarantee of future outcomes.
          </span>
        </div>

        {/* Score & Risk Comparison Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Success score comparison */}
          <div className="panel p-4 rounded-xl border border-theme-border flex flex-col justify-between">
            <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">Success Score Projection</span>
            <div className="my-2 flex items-center justify-between">
              <div>
                <span className="text-xs text-theme-muted">Current</span>
                <div className="text-2xl font-bold text-theme-text">
                  {originalScore.final_score ?? 'N/A'}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-theme-muted" />
              <div>
                <span className="text-xs text-theme-accent font-semibold">Simulated</span>
                <div className="text-3xl font-extrabold text-theme-accent">
                  {simulatedScore.final_score ?? 'N/A'}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-theme-border">
              <span className="text-theme-muted">Net Impact</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-xs ${
                  scoreDelta > 0
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : scoreDelta < 0
                    ? 'bg-red-500/15 text-red-400'
                    : 'bg-theme-secondary text-theme-muted'
                }`}
              >
                {scoreDelta > 0 ? `+${scoreDelta}` : `${scoreDelta}`} pts
              </span>
            </div>
          </div>

          {/* Academic Risk Transition */}
          <div className="panel p-4 rounded-xl border border-theme-border flex flex-col justify-between">
            <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">Academic Risk Status</span>
            <div className="my-3 flex items-center justify-between gap-2">
              <Badge label={originalAcademicRisk.risk_level} riskLevel={originalAcademicRisk.risk_level} />
              <ArrowRight className="w-4 h-4 text-theme-muted" />
              <Badge label={simulatedAcademicRisk.risk_level} riskLevel={simulatedAcademicRisk.risk_level} />
            </div>
            <p className="text-[11px] text-theme-muted">
              Triggered rules: {simulatedAcademicRisk.triggered_rules.length} (originally {originalAcademicRisk.triggered_rules.length})
            </p>
          </div>

          {/* Placement Risk Transition */}
          <div className="panel p-4 rounded-xl border border-theme-border flex flex-col justify-between">
            <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">Placement Readiness Status</span>
            <div className="my-3 flex items-center justify-between gap-2">
              <Badge label={originalPlacementRisk.risk_level} riskLevel={originalPlacementRisk.risk_level} />
              <ArrowRight className="w-4 h-4 text-theme-muted" />
              <Badge label={simulatedPlacementRisk.risk_level} riskLevel={simulatedPlacementRisk.risk_level} />
            </div>
            <p className="text-[11px] text-theme-muted">
              Readiness Score: {simulatedPlacementRisk.readiness_score ?? 'N/A'}/100
            </p>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="panel border border-theme-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-theme-border pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-theme-accent" />
              Hypothetical Indicator Controls
            </h4>
            <button
              onClick={resetValues}
              className="text-xs font-semibold text-theme-muted hover:text-theme-text flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Sliders
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-xs">
            {/* Attendance */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-theme-text">Hypothetical Attendance (%)</span>
                <span className="font-bold text-theme-accent">{adjustments.attendance}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={adjustments.attendance}
                onChange={e => setAdjustments({ ...adjustments, attendance: Number(e.target.value) })}
                className="w-full cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-theme-muted">
                <span>30%</span>
                <span>Original: {student.attendance.overall_attendance ?? 0}%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Internal Marks */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-theme-text">Internal Marks (%)</span>
                <span className="font-bold text-theme-accent">{adjustments.internal_marks}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={adjustments.internal_marks}
                onChange={e => setAdjustments({ ...adjustments, internal_marks: Number(e.target.value) })}
                className="w-full cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-theme-muted">
                <span>20%</span>
                <span>Original: {student.academic.internal_marks ?? 0}%</span>
                <span>100%</span>
              </div>
            </div>

            {/* LMS Assignment Completion */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-theme-text">LMS Assignment Completion (%)</span>
                <span className="font-bold text-theme-accent">{adjustments.assignment_completion}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={adjustments.assignment_completion}
                onChange={e => setAdjustments({ ...adjustments, assignment_completion: Number(e.target.value) })}
                className="w-full cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-theme-muted">
                <span>10%</span>
                <span>Original: {student.lms.assignment_completion ?? 0}%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Coding Score */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-theme-text">Coding Assessment Score</span>
                <span className="font-bold text-theme-accent">{adjustments.coding_score}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.coding_score}
                onChange={e => setAdjustments({ ...adjustments, coding_score: Number(e.target.value) })}
                className="w-full cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-theme-muted">
                <span>0</span>
                <span>Original: {student.placement.coding_score ?? 0}</span>
                <span>100</span>
              </div>
            </div>

            {/* Aptitude Score */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-theme-text">Aptitude Score</span>
                <span className="font-bold text-theme-accent">{adjustments.aptitude_score}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.aptitude_score}
                onChange={e => setAdjustments({ ...adjustments, aptitude_score: Number(e.target.value) })}
                className="w-full cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-theme-muted">
                <span>0</span>
                <span>Original: {student.placement.aptitude_score ?? 0}</span>
                <span>100</span>
              </div>
            </div>

            {/* Mock Interview */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-theme-text">Mock Interview Score</span>
                <span className="font-bold text-theme-accent">{adjustments.mock_interview_score}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.mock_interview_score}
                onChange={e => setAdjustments({ ...adjustments, mock_interview_score: Number(e.target.value) })}
                className="w-full cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-theme-muted">
                <span>0</span>
                <span>Original: {student.placement.mock_interview_score ?? 0}</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Takeaways & Strategic Recommendation */}
        <div className="panel p-4 rounded-xl border border-theme-accent/30 bg-theme-accent/5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-theme-text mb-2">
            <Sparkles className="w-4 h-4 text-theme-accent" />
            <span>Scenario Key Insights</span>
          </div>
          <ul className="space-y-1 text-xs text-theme-muted">
            {keyTakeaways.map((point, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-theme-accent font-bold">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="btn-primary px-4 py-2 text-xs font-semibold rounded-lg transition"
          >
            Done Simulating
          </button>
        </div>
      </div>
    </Modal>
  );
};
