import React, { useState } from 'react';
import { useCampusData } from '../context/CampusDataContext';
import { assignStudentSegment, SEGMENT_METADATA } from '../engine/segmentationEngine';
import { SegmentType } from '../types/segmentation';
import { Badge } from '../components/common/Badge';
import { calculateStudentSuccessScore } from '../engine/scoringEngine';
import { Users, CheckCircle, ArrowRight, BookOpen, Briefcase, Award } from 'lucide-react';

export const StudentSegmentsPage: React.FC = () => {
  const { filteredStudents, weights, setSelectedStudent } = useCampusData();

  const [selectedSegment, setSelectedSegment] = useState<SegmentType>(
    'Strong Academics, Low Placement Readiness'
  );

  // Group filtered students by segment
  const segmentBuckets: Record<SegmentType, typeof filteredStudents> = {
    'Strong Academics, Strong Placement Readiness': [],
    'Strong Academics, Low Placement Readiness': [],
    'Academic Support Needed': [],
    'Placement Preparation Needed': [],
    'Low LMS Participation': [],
    'Balanced Performers': [],
    'Insufficient Data': [],
  };

  filteredStudents.forEach(s => {
    const assigned = assignStudentSegment(s);
    segmentBuckets[assigned.segment].push(s);
  });

  const totalFiltered = filteredStudents.length || 1;
  const currentMeta = SEGMENT_METADATA[selectedSegment];
  const currentCohort = segmentBuckets[selectedSegment];

  // Department distribution for current cohort
  const deptDist: Record<string, number> = {};
  currentCohort.forEach(s => {
    deptDist[s.department] = (deptDist[s.department] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Overview Cards for all 7 segments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(SEGMENT_METADATA) as SegmentType[]).map(segType => {
          const meta = SEGMENT_METADATA[segType];
          const count = segmentBuckets[segType].length;
          const pct = Math.round((count / totalFiltered) * 100);
          const isSelected = selectedSegment === segType;

          return (
            <div
              key={segType}
              onClick={() => setSelectedSegment(segType)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-theme-surface border-theme-accent shadow-md ring-2 ring-theme-accent/20'
                  : 'bg-theme-surface border-theme-border hover:border-theme-accent-border shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-theme-border bg-theme-elevated text-theme-muted">
                    {meta.title}
                  </span>
                  <span className="text-xs font-semibold text-theme-muted">{pct}%</span>
                </div>
                <h4 className="text-xs font-bold text-theme-text mt-2.5 line-clamp-1">{segType}</h4>
              </div>

              <div className="mt-3.5 flex items-baseline justify-between border-t border-theme-border pt-2.5">
                <span className="text-2xl font-extrabold text-theme-text">{count}</span>
                <span className="text-[11px] text-theme-muted">students</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Segment Deep Dive */}
      <div className="bg-theme-surface rounded-2xl border border-theme-border p-6 shadow-sm space-y-6">
        {/* Segment Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-theme-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-theme-text">{selectedSegment}</h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border border-theme-accent-border bg-theme-accent-muted text-theme-accent">
                {currentMeta.title}
              </span>
            </div>
            <p className="text-xs text-theme-muted mt-1 max-w-2xl">{currentMeta.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold text-theme-accent">{currentCohort.length}</div>
            <span className="text-xs text-theme-muted">
              {Math.round((currentCohort.length / totalFiltered) * 100)}% of active cohort
            </span>
          </div>
        </div>

        {/* 3-Column Info (Typical Indicators, Recommended Interventions, Department Breakdown) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Typical Indicators */}
          <div className="p-4 rounded-xl bg-theme-elevated border border-theme-border space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
              Typical Trigger Criteria
            </span>
            <ul className="space-y-1.5 text-xs text-theme-text">
              {currentMeta.typicalIndicators.map((ind, i) => (
                <li key={i} className="flex items-center gap-2 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-theme-accent" />
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Recommended Interventions */}
          <div className="p-4 rounded-xl bg-theme-accent-muted border border-theme-accent-border/40 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-accent">
              Recommended Campus Actions
            </span>
            <ul className="space-y-1.5 text-xs text-theme-text">
              {currentMeta.recommendedInterventions.map((action, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-theme-accent shrink-0 mt-0.5" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Department Distribution */}
          <div className="p-4 rounded-xl bg-theme-elevated border border-theme-border space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
              Department Distribution
            </span>
            <div className="space-y-1.5 text-xs">
              {Object.keys(deptDist).length > 0 ? (
                Object.entries(deptDist).map(([dept, count]) => (
                  <div key={dept} className="flex items-center justify-between">
                    <span className="text-theme-muted truncate mr-2">{dept}</span>
                    <span className="font-bold text-theme-text">{count}</span>
                  </div>
                ))
              ) : (
                <span className="text-theme-subtle italic">No students in segment</span>
              )}
            </div>
          </div>
        </div>

        {/* Student Roster in Selected Segment */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text">
              Cohort Roster ({currentCohort.length} Students)
            </h4>
            <span className="text-[11px] text-theme-muted">Click row to open detailed student profile</span>
          </div>

          <div className="border border-theme-border rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-theme-elevated/80 text-theme-muted border-b border-theme-border">
                <tr>
                  <th className="py-2.5 px-3.5 font-semibold">Student ID & Name</th>
                  <th className="py-2.5 px-3 font-semibold">Department & Year</th>
                  <th className="py-2.5 px-3 font-semibold">Success Score</th>
                  <th className="py-2.5 px-3 font-semibold">CGPA</th>
                  <th className="py-2.5 px-3 font-semibold">Attendance</th>
                  <th className="py-2.5 px-3 font-semibold text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border/50">
                {currentCohort.slice(0, 25).map(student => {
                  const scoreRes = calculateStudentSuccessScore(student, weights);
                  return (
                    <tr
                      key={student.student_id}
                      onClick={() => setSelectedStudent(student)}
                      className="hover:bg-theme-elevated/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-2.5 px-3.5">
                        <div className="font-bold text-theme-text group-hover:text-theme-accent transition">
                          {student.name}
                        </div>
                        <div className="text-[10px] font-mono text-theme-muted">{student.student_id}</div>
                      </td>
                      <td className="py-2.5 px-3 text-theme-text">
                        {student.department} • {student.academic_year}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-theme-accent">
                        {scoreRes.final_score ?? 'N/A'}
                      </td>
                      <td className="py-2.5 px-3 text-theme-text font-semibold">
                        {student.academic.cgpa?.toFixed(2) ?? '—'}
                      </td>
                      <td className="py-2.5 px-3 text-theme-text font-semibold">
                        {student.attendance.overall_attendance?.toFixed(0) ?? '—'}%
                      </td>
                      <td className="py-2.5 px-3 text-right text-theme-muted group-hover:text-theme-accent">
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
