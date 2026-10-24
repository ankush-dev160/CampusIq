import React, { useState } from 'react';
import { UnifiedStudent } from '../../types/student';
import { useCampusData } from '../../context/CampusDataContext';
import { calculateStudentSuccessScore } from '../../engine/scoringEngine';
import { evaluateAcademicRisk } from '../../engine/academicRiskEngine';
import { evaluatePlacementRisk } from '../../engine/placementRiskEngine';
import { assignStudentSegment } from '../../engine/segmentationEngine';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { ScoreBreakdownModal } from './ScoreBreakdownModal';
import { WhatIfSimulatorModal } from './WhatIfSimulatorModal';
import { CreateInterventionModal } from '../intervention/CreateInterventionModal';
import {
  X,
  HelpCircle,
  Sliders,
  LifeBuoy,
  BookOpen,
  CalendarCheck,
  Laptop,
  Briefcase,
  Award,
  AlertTriangle,
  CheckCircle,
  FileText,
} from 'lucide-react';

interface StudentDrawerProps {
  student: UnifiedStudent | null;
  onClose: () => void;
}

export const StudentDrawer: React.FC<StudentDrawerProps> = ({ student, onClose }) => {
  const { weights, academicThresholds, placementThresholds } = useCampusData();

  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showWhatIfModal, setShowWhatIfModal] = useState(false);
  const [showInterventionModal, setShowInterventionModal] = useState(false);

  if (!student) return null;

  const scoreResult = calculateStudentSuccessScore(student, weights);
  const acadRisk = evaluateAcademicRisk(student, academicThresholds);
  const placeRisk = evaluatePlacementRisk(student, placementThresholds);
  const segment = assignStudentSegment(student);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-theme-surface text-theme-text shadow-2xl border-l border-theme-border flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="p-5 border-b border-theme-border bg-theme-secondary/40 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-theme-secondary text-theme-text border border-theme-border">
                {student.student_id}
              </span>
              <Badge label={student.department} />
            </div>
            <h2 className="text-xl font-bold text-theme-text">{student.name}</h2>
            <p className="text-xs text-theme-muted">
              {student.academic_year} • {student.semester} • {student.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-theme-muted hover:text-theme-text rounded-lg hover:bg-theme-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons Bar */}
        <div className="px-5 py-3 bg-theme-surface border-b border-theme-border flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowScoreModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-theme-secondary text-theme-text border border-theme-border hover:bg-theme-elevated hover:border-theme-accent/40 transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-theme-accent" />
            Why this score?
          </button>
          <button
            onClick={() => setShowWhatIfModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-theme-secondary text-theme-text border border-theme-border hover:bg-theme-elevated hover:border-theme-accent/40 transition"
          >
            <Sliders className="w-3.5 h-3.5 text-theme-accent" />
            What-If Simulator
          </button>
          <button
            onClick={() => setShowInterventionModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-theme-secondary text-theme-text border border-theme-border hover:bg-theme-elevated hover:border-theme-accent/40 transition"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-emerald-400" />
            Add Intervention
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Key KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl panel border border-theme-border">
              <span className="text-[10px] uppercase font-bold text-theme-muted">Success Score</span>
              <div className="text-xl font-extrabold text-theme-text mt-0.5">
                {scoreResult.final_score !== null ? `${scoreResult.final_score}/100` : 'Insufficient'}
              </div>
            </div>

            <div className="p-3 rounded-xl panel border border-theme-border">
              <span className="text-[10px] uppercase font-bold text-theme-muted">Academic Risk</span>
              <div className="mt-1">
                <Badge label={acadRisk.risk_level} riskLevel={acadRisk.risk_level} size="sm" />
              </div>
            </div>

            <div className="p-3 rounded-xl panel border border-theme-border">
              <span className="text-[10px] uppercase font-bold text-theme-muted">Placement Risk</span>
              <div className="mt-1">
                <Badge label={placeRisk.risk_level} riskLevel={placeRisk.risk_level} size="sm" />
              </div>
            </div>

            <div className="p-3 rounded-xl panel border border-theme-border">
              <span className="text-[10px] uppercase font-bold text-theme-muted">Completeness</span>
              <div className="text-xl font-extrabold text-theme-text mt-0.5">
                {student.data_quality.data_completeness_percentage}%
              </div>
            </div>
          </div>

          {/* Segment Card */}
          <div className="p-4 rounded-xl panel border border-theme-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">Assigned Segment</span>
              <span className="text-xs font-bold text-theme-accent">{segment.segment}</span>
            </div>
            <p className="text-xs text-theme-muted mt-1.5 leading-relaxed">{segment.primary_reason}</p>
          </div>

          {/* Component Score Progress Bars */}
          <div className="space-y-3 panel p-4 rounded-xl border border-theme-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text">6 Core Dimension Scores</h3>
            <ProgressBar
              label="Academic Performance (CGPA & Internals)"
              value={scoreResult.components.academic.score ?? 0}
              sublabel={`Weight: ${weights.academic}%`}
              colorScheme="dynamic"
            />
            <ProgressBar
              label="Attendance Rate"
              value={scoreResult.components.attendance.score ?? 0}
              sublabel={`Weight: ${weights.attendance}%`}
              colorScheme="dynamic"
            />
            <ProgressBar
              label="LMS Participation & Assignments"
              value={scoreResult.components.lms.score ?? 0}
              sublabel={`Weight: ${weights.lms}%`}
              colorScheme="dynamic"
            />
            <ProgressBar
              label="Co-curricular & Certifications"
              value={scoreResult.components.engagement.score ?? 0}
              sublabel={`Weight: ${weights.engagement}%`}
              colorScheme="dynamic"
            />
            <ProgressBar
              label="Placement Diagnostic Readiness"
              value={scoreResult.components.placement.score ?? 0}
              sublabel={`Weight: ${weights.placement}%`}
              colorScheme="dynamic"
            />
            <ProgressBar
              label="Technical & Soft Skills"
              value={scoreResult.components.skills.score ?? 0}
              sublabel={`Weight: ${weights.skills}%`}
              colorScheme="dynamic"
            />
          </div>

          {/* Detailed Data Domain Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Academic */}
            <div className="p-3.5 rounded-xl border border-theme-border bg-theme-secondary/40 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-theme-text">
                <BookOpen className="w-4 h-4 text-theme-accent" />
                <span>Academic Record</span>
              </div>
              <div className="space-y-1 text-theme-muted">
                <div className="flex justify-between">
                  <span>CGPA:</span>
                  <strong className="text-theme-text">{student.academic.cgpa?.toFixed(2) ?? 'Unrecorded'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Internal Assessment:</span>
                  <strong className="text-theme-text">
                    {student.academic.internal_marks !== null ? `${student.academic.internal_marks}%` : 'Unrecorded'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Active Backlogs:</span>
                  <strong className={student.academic.backlogs ? 'text-red-500' : 'text-emerald-400'}>
                    {student.academic.backlogs ?? 0}
                  </strong>
                </div>
              </div>
            </div>

            {/* Attendance & LMS */}
            <div className="p-3.5 rounded-xl border border-theme-border bg-theme-secondary/40 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-theme-text">
                <CalendarCheck className="w-4 h-4 text-theme-accent" />
                <span>Attendance & LMS</span>
              </div>
              <div className="space-y-1 text-theme-muted">
                <div className="flex justify-between">
                  <span>Verified Attendance:</span>
                  <strong className="text-theme-text">
                    {student.attendance.overall_attendance !== null
                      ? `${student.attendance.overall_attendance.toFixed(1)}%`
                      : 'Unrecorded'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>LMS Monthly Logins:</span>
                  <strong className="text-theme-text">{student.lms.lms_logins ?? 'Unrecorded'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Assignment Completion:</span>
                  <strong className="text-theme-text">
                    {student.lms.assignment_completion !== null
                      ? `${student.lms.assignment_completion}%`
                      : 'Unrecorded'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Placement */}
            <div className="p-3.5 rounded-xl border border-theme-border bg-theme-secondary/40 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-theme-text">
                <Briefcase className="w-4 h-4 text-theme-accent" />
                <span>Placement Assessments</span>
              </div>
              <div className="space-y-1 text-theme-muted">
                <div className="flex justify-between">
                  <span>Aptitude Score:</span>
                  <strong className="text-theme-text">
                    {student.placement.aptitude_score !== null ? `${student.placement.aptitude_score}/100` : 'Pending'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Coding Assessment:</span>
                  <strong className="text-theme-text">
                    {student.placement.coding_score !== null ? `${student.placement.coding_score}/100` : 'Pending'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Mock Interview:</span>
                  <strong className="text-theme-text">
                    {student.placement.mock_interview_score !== null
                      ? `${student.placement.mock_interview_score}/100`
                      : 'Pending'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Engagement & Skills */}
            <div className="p-3.5 rounded-xl border border-theme-border bg-theme-secondary/40 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-theme-text">
                <Award className="w-4 h-4 text-theme-accent" />
                <span>Engagement & Skills</span>
              </div>
              <div className="space-y-1 text-theme-muted">
                <div className="flex justify-between">
                  <span>Events / Clubs:</span>
                  <strong className="text-theme-text">
                    {student.engagement.events_participated ?? 0} / {student.engagement.club_participation ?? 0}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Hackathons / Certs:</span>
                  <strong className="text-theme-text">
                    {student.engagement.hackathons ?? 0} / {student.engagement.certifications ?? 0}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Technical / Soft Skills:</span>
                  <strong className="text-theme-text">
                    {student.skills.technical_skill_score ?? 'N/A'} / {student.skills.soft_skill_score ?? 'N/A'}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Triggered Risk Rules & Evidence */}
          {(acadRisk.triggered_rules.length > 0 || placeRisk.triggered_rules.length > 0) && (
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 space-y-3">
              <h4 className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Triggered Risk Rules & Audit Evidence
              </h4>
              <div className="space-y-2 text-xs">
                {acadRisk.triggered_rules.map(rule => (
                  <div key={rule.id} className="p-2.5 rounded-lg bg-theme-surface border border-red-500/20">
                    <div className="flex items-center justify-between font-bold text-theme-text">
                      <span>{rule.rule_name}</span>
                      <Badge label={rule.severity} riskLevel={rule.severity as any} size="sm" />
                    </div>
                    <p className="text-theme-muted text-[11px] mt-1">{rule.evidence}</p>
                    <div className="mt-1.5 text-[11px] font-semibold text-red-400">
                      Prescribed action: {rule.suggested_action}
                    </div>
                  </div>
                ))}
                {placeRisk.triggered_rules.map(rule => (
                  <div key={rule.id} className="p-2.5 rounded-lg bg-theme-surface border border-amber-500/20">
                    <div className="flex items-center justify-between font-bold text-theme-text">
                      <span>{rule.rule_name}</span>
                      <Badge label={rule.severity} riskLevel={rule.severity as any} size="sm" />
                    </div>
                    <p className="text-theme-muted text-[11px] mt-1">{rule.evidence}</p>
                    <div className="mt-1.5 text-[11px] font-semibold text-amber-400">
                      Prescribed action: {rule.suggested_action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interventions Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text">Recorded Interventions</h4>
              <button
                onClick={() => setShowInterventionModal(true)}
                className="text-xs text-theme-accent hover:underline font-semibold"
              >
                + Add Plan
              </button>
            </div>
            {student.interventions.length > 0 ? (
              <div className="space-y-2 text-xs">
                {student.interventions.map(item => (
                  <div key={item.id} className="p-3 rounded-xl border border-theme-border bg-theme-secondary/40">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-theme-text">{item.category}</span>
                      <Badge label={item.status} variant="status" size="sm" />
                    </div>
                    <p className="text-theme-muted mt-1">{item.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-theme-muted mt-2">
                      <span>Faculty: {item.faculty_assigned}</span>
                      <span>Target: {item.target_date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-theme-muted italic">No formal interventions recorded for this student.</p>
            )}
          </div>
        </div>
      </div>

      {/* Sub-modals */}
      <ScoreBreakdownModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        student={student}
      />
      <WhatIfSimulatorModal
        isOpen={showWhatIfModal}
        onClose={() => setShowWhatIfModal(false)}
        student={student}
      />
      <CreateInterventionModal
        isOpen={showInterventionModal}
        onClose={() => setShowInterventionModal(false)}
        preselectedStudent={student}
      />
    </>
  );
};
