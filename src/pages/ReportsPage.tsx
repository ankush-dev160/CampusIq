import React, { useState } from 'react';
import { useCampusData } from '../context/CampusDataContext';
import { calculateStudentSuccessScore } from '../engine/scoringEngine';
import { evaluateAcademicRisk } from '../engine/academicRiskEngine';
import { evaluatePlacementRisk } from '../engine/placementRiskEngine';
import { assignStudentSegment, SEGMENT_METADATA } from '../engine/segmentationEngine';
import { SegmentType } from '../types/segmentation';
import { Printer, Download, FileText, CheckCircle2 } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { filteredStudents, weights, academicThresholds, placementThresholds, filters } = useCampusData();

  const [reportType, setReportType] = useState<
    'student' | 'department' | 'academic_risk' | 'placement_risk' | 'segment' | 'data_quality'
  >('student');

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  // CSV Export for active report type
  const handleExportCSV = () => {
    let csvContent = '';
    const dateStr = new Date().toISOString().split('T')[0];

    if (reportType === 'student') {
      csvContent = 'Student_ID,Name,Department,Year,Semester,Success_Score,Academic_Risk,Placement_Risk,Segment,CGPA,Attendance_Pct,Backlogs\n';
      filteredStudents.forEach(s => {
        const sc = calculateStudentSuccessScore(s, weights).final_score ?? 'N/A';
        const ar = evaluateAcademicRisk(s, academicThresholds).risk_level;
        const pr = evaluatePlacementRisk(s, placementThresholds).risk_level;
        const seg = assignStudentSegment(s).segment;
        csvContent += `"${s.student_id}","${s.name}","${s.department}","${s.academic_year}","${s.semester}",${sc},"${ar}","${pr}","${seg}",${s.academic.cgpa ?? ''},${s.attendance.overall_attendance ?? ''},${s.academic.backlogs ?? 0}\n`;
      });
    } else if (reportType === 'department') {
      csvContent = 'Department,Total_Students,Avg_Success_Score,High_Academic_Risk,High_Placement_Risk,Avg_Attendance\n';
      const depts = Array.from(new Set(filteredStudents.map(s => s.department)));
      depts.forEach(d => {
        const cohort = filteredStudents.filter(s => s.department === d);
        const scores = cohort.map(s => calculateStudentSuccessScore(s, weights).final_score).filter((s): s is number => s !== null);
        const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 'N/A';
        const hiAcad = cohort.filter(s => evaluateAcademicRisk(s, academicThresholds).risk_level === 'High').length;
        const hiPlace = cohort.filter(s => evaluatePlacementRisk(s, placementThresholds).risk_level === 'High').length;
        const atts = cohort.map(s => s.attendance.overall_attendance).filter((a): a is number => a !== null);
        const avgAtt = atts.length > 0 ? (atts.reduce((a, b) => a + b, 0) / atts.length).toFixed(1) : 'N/A';
        csvContent += `"${d}",${cohort.length},${avg},${hiAcad},${hiPlace},${avgAtt}\n`;
      });
    } else if (reportType === 'academic_risk') {
      csvContent = 'Student_ID,Name,Department,Academic_Risk,CGPA,Backlogs,Attendance_Pct,Triggered_Rules\n';
      filteredStudents.forEach(s => {
        const r = evaluateAcademicRisk(s, academicThresholds);
        const rules = r.triggered_rules.map(tr => tr.rule_name).join('; ');
        csvContent += `"${s.student_id}","${s.name}","${s.department}","${r.risk_level}",${s.academic.cgpa ?? ''},${s.academic.backlogs ?? 0},${s.attendance.overall_attendance ?? ''},"${rules}"\n`;
      });
    } else if (reportType === 'placement_risk') {
      csvContent = 'Student_ID,Name,Department,Placement_Risk,Readiness_Score,Aptitude,Coding,Pattern\n';
      filteredStudents.forEach(s => {
        const pr = evaluatePlacementRisk(s, placementThresholds);
        csvContent += `"${s.student_id}","${s.name}","${s.department}","${pr.risk_level}",${pr.readiness_score ?? ''},${s.placement.aptitude_score ?? ''},${s.placement.coding_score ?? ''},"${pr.patterns[0] || ''}"\n`;
      });
    } else if (reportType === 'segment') {
      csvContent = 'Segment_Name,Total_Count,Percentage\n';
      (Object.keys(SEGMENT_METADATA) as SegmentType[]).forEach(t => {
        const cnt = filteredStudents.filter(s => assignStudentSegment(s).segment === t).length;
        const pct = Math.round((cnt / (filteredStudents.length || 1)) * 100);
        csvContent += `"${t}",${cnt},${pct}%\n`;
      });
    } else if (reportType === 'data_quality') {
      csvContent = 'Student_ID,Name,Department,Completeness_Pct,Available_Fields,Missing_Fields\n';
      filteredStudents.forEach(s => {
        csvContent += `"${s.student_id}","${s.name}","${s.department}",${s.data_quality.data_completeness_percentage},${s.data_quality.available_fields},"${s.data_quality.missing_fields.join('; ')}"\n`;
      });
    }

    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CampusIQ_${reportType}_report_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const REPORT_TITLES = {
    student: 'Student Master Performance Roster',
    department: 'Departmental Institutional Audit',
    academic_risk: 'Academic Risk & Intervention Priority Audit',
    placement_risk: 'Placement Screening & Employability Readiness',
    segment: 'Cohort Segmentation Matrix',
    data_quality: 'Data Completeness & Ingestion Telemetry Audit',
  };

  return (
    <div className="space-y-6">
      {/* Control Card (Hidden during print) */}
      <div className="no-print bg-theme-surface p-4 sm:p-5 rounded-2xl border border-theme-border shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Report Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {(Object.keys(REPORT_TITLES) as (keyof typeof REPORT_TITLES)[]).map(key => (
            <button
              key={key}
              onClick={() => setReportType(key)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all duration-150 ${
                reportType === key
                  ? 'bg-theme-accent text-theme-accent-text font-bold shadow-sm'
                  : 'bg-theme-elevated text-theme-muted hover:text-theme-text hover:bg-theme-secondary border border-theme-border'
              }`}
            >
              {key.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-theme-border bg-theme-elevated hover:bg-theme-secondary text-theme-text text-xs font-semibold rounded-xl transition"
          >
            <Download className="w-3.5 h-3.5 text-theme-muted" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 btn-primary text-xs font-bold rounded-xl shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Container */}
      <div className="bg-theme-surface rounded-2xl border border-theme-border p-6 sm:p-8 shadow-sm space-y-6">
        {/* Institutional Report Letterhead */}
        <div className="border-b border-theme-border pb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-theme-text">CampusIQ</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-theme-accent-muted text-theme-accent border border-theme-accent-border">
                Institutional Audit
              </span>
            </div>
            <p className="text-xs text-theme-muted mt-0.5">Turn Campus Data Into Student Success</p>
          </div>

          <div className="text-right text-xs text-theme-muted space-y-0.5">
            <div>Generated: <strong className="text-theme-text">{new Date().toLocaleDateString()}</strong></div>
            <div>Active Scope: <strong className="text-theme-text">{filters.department} • {filters.academic_year}</strong></div>
            <div>Cohort Size: <strong className="text-theme-text">{filteredStudents.length} Students</strong></div>
          </div>
        </div>

        {/* 1. Student-level Summaries */}
        {reportType === 'student' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-theme-text uppercase tracking-wider">
              Student Master Performance Summary
            </h3>
            <div className="overflow-x-auto border border-theme-border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-theme-elevated text-theme-muted border-b border-theme-border">
                  <tr>
                    <th className="py-2.5 px-3">Student ID</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3 text-right">Success Score</th>
                    <th className="py-2.5 px-3 text-right">CGPA</th>
                    <th className="py-2.5 px-3 text-right">Attendance</th>
                    <th className="py-2.5 px-3">Academic Risk</th>
                    <th className="py-2.5 px-3">Placement Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border/50">
                  {filteredStudents.map(s => {
                    const score = calculateStudentSuccessScore(s, weights).final_score;
                    const acad = evaluateAcademicRisk(s, academicThresholds).risk_level;
                    const place = evaluatePlacementRisk(s, placementThresholds).risk_level;
                    return (
                      <tr key={s.student_id} className="hover:bg-theme-elevated/60">
                        <td className="py-2 px-3 font-mono text-[11px] text-theme-muted">{s.student_id}</td>
                        <td className="py-2 px-3 font-semibold text-theme-text">{s.name}</td>
                        <td className="py-2 px-3 text-theme-muted">{s.department}</td>
                        <td className="py-2 px-3 text-right font-bold text-theme-accent">{score ?? '—'}</td>
                        <td className="py-2 px-3 text-right text-theme-text">{s.academic.cgpa?.toFixed(2) ?? '—'}</td>
                        <td className="py-2 px-3 text-right text-theme-text">{s.attendance.overall_attendance?.toFixed(0) ?? '—'}%</td>
                        <td className="py-2 px-3 text-theme-text">{acad}</td>
                        <td className="py-2 px-3 text-theme-text">{place}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. Department-level Summaries */}
        {reportType === 'department' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-theme-text uppercase tracking-wider">
              Departmental Institutional Audit
            </h3>
            <div className="overflow-x-auto border border-theme-border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-theme-elevated text-theme-muted border-b border-theme-border">
                  <tr>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3 text-right">Enrolled</th>
                    <th className="py-2.5 px-3 text-right">Mean Success Score</th>
                    <th className="py-2.5 px-3 text-right">High Academic Risk</th>
                    <th className="py-2.5 px-3 text-right">High Placement Risk</th>
                    <th className="py-2.5 px-3 text-right">Mean Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border/50">
                  {Array.from(new Set(filteredStudents.map(s => s.department as string))).map((dept: string) => {
                    const cohort = filteredStudents.filter(s => s.department === dept);
                    const scores = cohort.map(s => calculateStudentSuccessScore(s, weights).final_score).filter((s): s is number => s !== null);
                    const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 'N/A';
                    const hiAcad = cohort.filter(s => evaluateAcademicRisk(s, academicThresholds).risk_level === 'High').length;
                    const hiPlace = cohort.filter(s => evaluatePlacementRisk(s, placementThresholds).risk_level === 'High').length;
                    const atts = cohort.map(s => s.attendance.overall_attendance).filter((a): a is number => a !== null);
                    const avgAtt = atts.length > 0 ? (atts.reduce((a, b) => a + b, 0) / atts.length).toFixed(1) : 'N/A';

                    return (
                      <tr key={dept} className="hover:bg-theme-elevated/60">
                        <td className="py-2.5 px-3 font-bold text-theme-text">{dept}</td>
                        <td className="py-2.5 px-3 text-right text-theme-text">{cohort.length}</td>
                        <td className="py-2.5 px-3 text-right font-extrabold text-theme-accent">{avg}</td>
                        <td className="py-2.5 px-3 text-right text-red-500 font-bold">{hiAcad}</td>
                        <td className="py-2.5 px-3 text-right text-amber-500 font-bold">{hiPlace}</td>
                        <td className="py-2.5 px-3 text-right text-theme-text">{avgAtt}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Academic Risk Report */}
        {reportType === 'academic_risk' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-theme-text uppercase tracking-wider">
              Academic Risk & Intervention Priority Audit
            </h3>
            <div className="overflow-x-auto border border-theme-border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-theme-elevated text-theme-muted border-b border-theme-border">
                  <tr>
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Risk Level</th>
                    <th className="py-2.5 px-3">CGPA</th>
                    <th className="py-2.5 px-3">Backlogs</th>
                    <th className="py-2.5 px-3">Attendance</th>
                    <th className="py-2.5 px-3">Primary Triggered Rule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border/50">
                  {filteredStudents
                    .filter(s => evaluateAcademicRisk(s, academicThresholds).risk_level !== 'Low')
                    .map(s => {
                      const risk = evaluateAcademicRisk(s, academicThresholds);
                      return (
                        <tr key={s.student_id} className="hover:bg-theme-elevated/60">
                          <td className="py-2 px-3 font-semibold text-theme-text">
                            {s.name} ({s.student_id})
                          </td>
                          <td className="py-2 px-3 font-bold text-red-500">{risk.risk_level}</td>
                          <td className="py-2 px-3 text-theme-text">{s.academic.cgpa?.toFixed(2) ?? '—'}</td>
                          <td className="py-2 px-3 text-red-500 font-bold">{s.academic.backlogs ?? 0}</td>
                          <td className="py-2 px-3 text-theme-text">{s.attendance.overall_attendance?.toFixed(0) ?? '—'}%</td>
                          <td className="py-2 px-3 text-theme-muted text-[11px]">
                            {risk.triggered_rules[0]?.rule_name || 'General Academic Concern'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. Placement Risk Report */}
        {reportType === 'placement_risk' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-theme-text uppercase tracking-wider">
              Placement Readiness & Corporate Screening Audit
            </h3>
            <div className="overflow-x-auto border border-theme-border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-theme-elevated text-theme-muted border-b border-theme-border">
                  <tr>
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Risk Level</th>
                    <th className="py-2.5 px-3 text-right">Readiness Score</th>
                    <th className="py-2.5 px-3 text-right">Aptitude</th>
                    <th className="py-2.5 px-3 text-right">Coding</th>
                    <th className="py-2.5 px-3">Detected Pattern</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border/50">
                  {filteredStudents
                    .filter(s => evaluatePlacementRisk(s, placementThresholds).risk_level !== 'Low')
                    .map(s => {
                      const pr = evaluatePlacementRisk(s, placementThresholds);
                      return (
                        <tr key={s.student_id} className="hover:bg-theme-elevated/60">
                          <td className="py-2 px-3 font-semibold text-theme-text">
                            {s.name} ({s.student_id})
                          </td>
                          <td className="py-2 px-3 font-bold text-amber-500">{pr.risk_level}</td>
                          <td className="py-2 px-3 text-right font-bold text-theme-accent">{pr.readiness_score ?? '—'}</td>
                          <td className="py-2 px-3 text-right text-theme-text">{s.placement.aptitude_score ?? '—'}</td>
                          <td className="py-2 px-3 text-right text-theme-text">{s.placement.coding_score ?? '—'}</td>
                          <td className="py-2 px-3 text-theme-muted text-[11px]">
                            {pr.patterns[0] || 'Benchmark Gap'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. Segment Breakdown */}
        {reportType === 'segment' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-theme-text uppercase tracking-wider">
              Cohort Segmentation Distribution
            </h3>
            <div className="overflow-x-auto border border-theme-border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-theme-elevated text-theme-muted border-b border-theme-border">
                  <tr>
                    <th className="py-2.5 px-3">Segment Name</th>
                    <th className="py-2.5 px-3 text-right">Count</th>
                    <th className="py-2.5 px-3 text-right">Percentage</th>
                    <th className="py-2.5 px-3">Key Criteria</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border/50">
                  {(Object.keys(SEGMENT_METADATA) as SegmentType[]).map(t => {
                    const cnt = filteredStudents.filter(s => assignStudentSegment(s).segment === t).length;
                    const pct = Math.round((cnt / (filteredStudents.length || 1)) * 100);
                    return (
                      <tr key={t} className="hover:bg-theme-elevated/60">
                        <td className="py-2.5 px-3 font-bold text-theme-text">{t}</td>
                        <td className="py-2.5 px-3 text-right font-extrabold text-theme-accent">{cnt}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-theme-text">{pct}%</td>
                        <td className="py-2.5 px-3 text-theme-muted text-[11px]">
                          {SEGMENT_METADATA[t].typicalIndicators.join(' • ')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. Data Quality */}
        {reportType === 'data_quality' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-theme-text uppercase tracking-wider">
              Data Quality & Field Completeness Audit
            </h3>
            <div className="overflow-x-auto border border-theme-border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-theme-elevated text-theme-muted border-b border-theme-border">
                  <tr>
                    <th className="py-2.5 px-3">Student ID</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3 text-right">Completeness</th>
                    <th className="py-2.5 px-3 text-right">Available Fields</th>
                    <th className="py-2.5 px-3">Missing Systems</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border/50">
                  {filteredStudents.map(s => (
                    <tr key={s.student_id} className="hover:bg-theme-elevated/60">
                      <td className="py-2 px-3 font-mono text-[11px] text-theme-muted">{s.student_id}</td>
                      <td className="py-2 px-3 font-semibold text-theme-text">{s.name}</td>
                      <td className="py-2 px-3 text-theme-muted">{s.department}</td>
                      <td className="py-2 px-3 text-right font-extrabold text-theme-accent">
                        {s.data_quality.data_completeness_percentage}%
                      </td>
                      <td className="py-2 px-3 text-right text-theme-text">
                        {s.data_quality.available_fields} / {s.data_quality.total_fields}
                      </td>
                      <td className="py-2 px-3 text-theme-muted text-[11px]">
                        {s.data_quality.missing_fields.join(', ') || 'All Verified'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Institutional Signoff */}
        <div className="pt-8 border-t border-theme-border text-xs text-theme-muted flex justify-between">
          <span>CampusIQ • Validated Institutional Scoring Engine</span>
          <span>Dean of Academic Affairs & Placement Directorate</span>
        </div>
      </div>
    </div>
  );
};
