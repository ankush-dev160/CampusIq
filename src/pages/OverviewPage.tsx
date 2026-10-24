import React from 'react';
import { useCampusData } from '../context/CampusDataContext';
import { useTheme } from '../context/ThemeContext';
import { calculateStudentSuccessScore } from '../engine/scoringEngine';
import { evaluateAcademicRisk } from '../engine/academicRiskEngine';
import { evaluatePlacementRisk } from '../engine/placementRiskEngine';
import { MetricCard } from '../components/common/MetricCard';
import {
  Users,
  GraduationCap,
  AlertTriangle,
  Briefcase,
  Database,
  LifeBuoy,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  CartesianGrid,
  Legend,
} from 'recharts';

export const OverviewPage: React.FC = () => {
  const { filteredStudents, students, weights, academicThresholds, placementThresholds, setSelectedStudent } = useCampusData();
  const { chartPalette, isDark } = useTheme();

  // 1. KPI Calculations from current filtered dataset
  const totalStudents = filteredStudents.length;

  const scoreResults = filteredStudents.map(s => calculateStudentSuccessScore(s, weights));
  const validScores = scoreResults.filter(r => r.final_score !== null).map(r => r.final_score as number);
  const avgSuccessScore = validScores.length > 0
    ? Math.round((validScores.reduce((a, b) => a + b, 0) / validScores.length) * 10) / 10
    : 0;

  const acadRisks = filteredStudents.map(s => evaluateAcademicRisk(s, academicThresholds));
  const placeRisks = filteredStudents.map(s => evaluatePlacementRisk(s, placementThresholds));

  const flaggedAcademic = acadRisks.filter(r => r.risk_level === 'High' || r.risk_level === 'Moderate').length;
  const flaggedAcademicHigh = acadRisks.filter(r => r.risk_level === 'High').length;

  const flaggedPlacement = placeRisks.filter(r => r.risk_level === 'High' || r.risk_level === 'Moderate').length;
  const flaggedPlacementHigh = placeRisks.filter(r => r.risk_level === 'High').length;

  const incompleteDataCount = filteredStudents.filter(
    s => s.data_quality.data_completeness_percentage < 50
  ).length;

  const recordedInterventionsCount = filteredStudents.filter(
    s => s.interventions.length > 0
  ).length;

  // 2. Chart Data: Success Score Distribution (Realistic Histogram buckets)
  const scoreBuckets = [
    { range: '< 50', count: 0 },
    { range: '50 - 64', count: 0 },
    { range: '65 - 79', count: 0 },
    { range: '80 - 89', count: 0 },
    { range: '90 - 100', count: 0 },
  ];
  validScores.forEach(score => {
    if (score < 50) scoreBuckets[0].count++;
    else if (score < 65) scoreBuckets[1].count++;
    else if (score < 80) scoreBuckets[2].count++;
    else if (score < 90) scoreBuckets[3].count++;
    else scoreBuckets[4].count++;
  });

  // 3. Academic Risk Distribution using theme-aware colors
  const acadRiskData = [
    { name: 'Low Risk', value: acadRisks.filter(r => r.risk_level === 'Low').length, color: chartPalette.success },
    { name: 'Moderate Risk', value: acadRisks.filter(r => r.risk_level === 'Moderate').length, color: chartPalette.warning },
    { name: 'High Risk', value: flaggedAcademicHigh, color: chartPalette.danger },
    { name: 'Incomplete', value: acadRisks.filter(r => r.risk_level === 'Insufficient Data').length, color: chartPalette.neutral },
  ].filter(d => d.value > 0);

  // 4. Placement Risk Distribution
  const placeRiskData = [
    { name: 'Low Risk', value: placeRisks.filter(r => r.risk_level === 'Low').length, color: chartPalette.success },
    { name: 'Moderate Risk', value: placeRisks.filter(r => r.risk_level === 'Moderate').length, color: chartPalette.warning },
    { name: 'High Risk', value: flaggedPlacementHigh, color: chartPalette.danger },
    { name: 'Incomplete', value: placeRisks.filter(r => r.risk_level === 'Insufficient Data').length, color: chartPalette.neutral },
  ].filter(d => d.value > 0);

  // 5. Department-wise Average Success Score
  const deptScoreMap: Record<string, { total: number; count: number }> = {};
  filteredStudents.forEach(s => {
    const sc = calculateStudentSuccessScore(s, weights).final_score;
    if (sc !== null) {
      if (!deptScoreMap[s.department]) deptScoreMap[s.department] = { total: 0, count: 0 };
      deptScoreMap[s.department].total += sc;
      deptScoreMap[s.department].count += 1;
    }
  });

  const departmentScores = Object.entries(deptScoreMap).map(([dept, data]) => ({
    department: dept.replace(' Engineering', '').replace('Eng.', ''),
    avgScore: Math.round((data.total / data.count) * 10) / 10,
    students: data.count,
  }));

  // 6. Attendance vs Academic Performance (Scatter)
  const attendanceVsAcademic = filteredStudents
    .filter(s => s.attendance.overall_attendance !== null && s.academic.cgpa !== null)
    .slice(0, 80)
    .map(s => ({
      name: s.name,
      id: s.student_id,
      attendance: s.attendance.overall_attendance as number,
      cgpa: s.academic.cgpa as number,
      score: (s.academic.cgpa as number) * 10,
    }));

  // 7. Academic Performance vs Placement Readiness (Scatter)
  const academicVsPlacement = filteredStudents
    .map(s => {
      const pScore = evaluatePlacementRisk(s, placementThresholds).readiness_score;
      if (s.academic.cgpa !== null && pScore !== null) {
        return {
          name: s.name,
          id: s.student_id,
          cgpa: s.academic.cgpa,
          placementScore: pScore,
        };
      }
      return null;
    })
    .filter((v): v is { name: string; id: string; cgpa: number; placementScore: number } => v !== null)
    .slice(0, 80);

  // 8. Priority Insights (Dynamically computed from actual dataset)
  const deptRiskMap: Record<string, { total: number; high: number }> = {};
  filteredStudents.forEach(s => {
    if (!deptRiskMap[s.department]) deptRiskMap[s.department] = { total: 0, high: 0 };
    deptRiskMap[s.department].total += 1;
    if (evaluateAcademicRisk(s, academicThresholds).risk_level === 'High') {
      deptRiskMap[s.department].high += 1;
    }
  });

  const deptRiskSorted = Object.entries(deptRiskMap)
    .map(([dept, d]) => ({ dept, rate: d.total > 0 ? (d.high / d.total) * 100 : 0, high: d.high, total: d.total }))
    .sort((a, b) => b.rate - a.rate);
  const highestRiskDept = deptRiskSorted[0];

  const attendanceDebarredCount = filteredStudents.filter(
    s => s.attendance.overall_attendance !== null && s.attendance.overall_attendance < 65
  ).length;

  const highGpaLowPlacement = filteredStudents.filter(
    s => (s.academic.cgpa ?? 0) >= 7.5 && (evaluatePlacementRisk(s, placementThresholds).readiness_score ?? 100) < 60
  ).length;

  const codingGapCount = filteredStudents.filter(
    s => s.placement.coding_score !== null && s.placement.coding_score < 50
  ).length;

  // Tooltip shared style
  const tooltipStyle = {
    backgroundColor: chartPalette.tooltipBg,
    borderColor: chartPalette.tooltipBorder,
    borderRadius: '12px',
    color: chartPalette.tooltipText,
    fontSize: '12px',
    boxShadow: 'var(--shadow-spatial)',
    borderWidth: '1px',
    padding: '8px 12px',
  };

  return (
    <div className="space-y-6">
      {/* 6 Core Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <MetricCard
          title="Total Students"
          value={totalStudents}
          subtitle={`Across ${new Set(filteredStudents.map(s => s.department)).size} departments`}
          icon={<Users className="w-4 h-4" />}
          badge="Verified"
        />
        <MetricCard
          title="Avg Success Score"
          value={`${avgSuccessScore}/100`}
          subtitle="Institutional composite"
          icon={<GraduationCap className="w-4 h-4" />}
          trendText={avgSuccessScore >= 70 ? 'Benchmark Met' : 'Attention Needed'}
          trendType={avgSuccessScore >= 70 ? 'positive' : 'warning'}
        />
        <MetricCard
          title="Academic Review"
          value={flaggedAcademic}
          subtitle={`${flaggedAcademicHigh} High, ${flaggedAcademic - flaggedAcademicHigh} Moderate`}
          icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
          trendText={`${Math.round((flaggedAcademic / (totalStudents || 1)) * 100)}% cohort`}
          trendType={flaggedAcademicHigh > 0 ? 'negative' : 'neutral'}
        />
        <MetricCard
          title="Placement Review"
          value={flaggedPlacement}
          subtitle={`${flaggedPlacementHigh} High, ${flaggedPlacement - flaggedPlacementHigh} Moderate`}
          icon={<Briefcase className="w-4 h-4 text-amber-500" />}
          trendText={`${Math.round((flaggedPlacement / (totalStudents || 1)) * 100)}% cohort`}
          trendType="warning"
        />
        <MetricCard
          title="Incomplete Data"
          value={incompleteDataCount}
          subtitle="< 50% system coverage"
          icon={<Database className="w-4 h-4 text-theme-muted" />}
          trendText={incompleteDataCount > 0 ? 'Sync Pending' : '100% Synced'}
          trendType={incompleteDataCount > 0 ? 'warning' : 'positive'}
        />
        <MetricCard
          title="Interventions"
          value={recordedInterventionsCount}
          subtitle="Assigned mentoring"
          icon={<LifeBuoy className="w-4 h-4 text-theme-accent" />}
          trendText={`${Math.round((recordedInterventionsCount / (totalStudents || 1)) * 100)}% covered`}
          trendType="positive"
        />
      </div>

      {/* Priority Insights Section */}
      <div className="bg-theme-surface rounded-2xl border border-theme-border p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-theme-border pb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-theme-accent" />
            <h3 className="text-xs font-bold text-theme-text uppercase tracking-wider">
              Priority Campus Insights
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-theme-muted">
            Calculated in real-time from active cohort data
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Priority Insight 1 */}
          <div className="p-4 rounded-xl border border-red-500/25 bg-red-500/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400">Departmental Risk Concentration</span>
            <div className="text-base font-extrabold text-theme-text">
              {highestRiskDept?.dept || 'None'}
            </div>
            <p className="text-xs text-theme-muted leading-snug">
              Has highest critical academic risk with{' '}
              <strong className="text-red-600 dark:text-red-400">{Math.round(highestRiskDept?.rate || 0)}%</strong> students flagged
              ({highestRiskDept?.high} of {highestRiskDept?.total} students).
            </p>
          </div>

          {/* Priority Insight 2 */}
          <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Exam Debarment Alert</span>
            <div className="text-base font-extrabold text-theme-text">
              {attendanceDebarredCount} Students &lt; 65%
            </div>
            <p className="text-xs text-theme-muted leading-snug">
              Severe attendance deficit violates university regulations and places these candidates at immediate risk of debarment.
            </p>
          </div>

          {/* Priority Insight 3 */}
          <div className="p-4 rounded-xl border border-blue-500/25 bg-blue-500/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">The Practical Skill-Gap Cohort</span>
            <div className="text-base font-extrabold text-theme-text">
              {highGpaLowPlacement} High-GPA Students
            </div>
            <p className="text-xs text-theme-muted leading-snug">
              Possess CGPA ≥ 7.5 but score &lt; 60% in coding/aptitude assessments. Immediate candidate pool for corporate bootcamps.
            </p>
          </div>

          {/* Priority Insight 4 */}
          <div className="p-4 rounded-xl border border-theme-accent-border/40 bg-theme-accent-muted space-y-1">
            <span className="text-[10px] uppercase font-bold text-theme-accent">Technical Screening Bottleneck</span>
            <div className="text-base font-extrabold text-theme-text">
              {codingGapCount} Below Coding Cutoff
            </div>
            <p className="text-xs text-theme-muted leading-snug">
              Scored below 50 in DSA/coding assessments, representing the primary friction point for campus hiring drives.
            </p>
          </div>
        </div>
      </div>

      {/* Visualizations Row 1: Score Distribution & Department Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Success Score Distribution */}
        <div className="bg-theme-surface rounded-2xl border border-theme-border p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text">
                Student Success Score Distribution
              </h4>
              <p className="text-[11px] text-theme-muted">0–100 Normalized composite scores across active cohort</p>
            </div>
            <span className="text-xs font-bold text-theme-accent">Mean: {avgSuccessScore}</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreBuckets}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartPalette.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: chartPalette.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: chartPalette.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: chartPalette.cursorFill }}
                />
                <Bar dataKey="count" fill={chartPalette.primary} radius={[6, 6, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Department-wise Average Success Score */}
        <div className="bg-theme-surface rounded-2xl border border-theme-border p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text">
                Department Performance Benchmarks
              </h4>
              <p className="text-[11px] text-theme-muted">Mean composite score comparison across academic divisions</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentScores} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={chartPalette.grid} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: chartPalette.textMuted }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="department" width={110} tick={{ fontSize: 11, fill: chartPalette.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: chartPalette.cursorFill }}
                />
                <Bar dataKey="avgScore" fill={chartPalette.secondary} radius={[0, 6, 6, 0]} name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Visualizations Row 2: Academic Risk & Placement Risk Donuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Donut 1: Academic Risk */}
        <div className="bg-theme-surface rounded-2xl border border-theme-border p-5 shadow-sm space-y-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text">
              Academic Risk Breakdown
            </h4>
            <p className="text-[11px] text-theme-muted">Based on CGPA, attendance, backlogs, and internals</p>
          </div>
          <div className="h-60 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={acadRiskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {acadRiskData.map((entry, index) => (
                    <Cell key={`cell-acad-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: chartPalette.textMuted }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut 2: Placement Risk */}
        <div className="bg-theme-surface rounded-2xl border border-theme-border p-5 shadow-sm space-y-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text">
              Placement Readiness Risk Breakdown
            </h4>
            <p className="text-[11px] text-theme-muted">Based on aptitude, coding, mock interviews, and training</p>
          </div>
          <div className="h-60 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={placeRiskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {placeRiskData.map((entry, index) => (
                    <Cell key={`cell-place-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: chartPalette.textMuted }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Visualizations Row 3: Correlation Analysis (Attendance vs CGPA & CGPA vs Placement) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Correlation 1: Attendance vs CGPA */}
        <div className="bg-theme-surface rounded-2xl border border-theme-border p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text">
                Attendance vs. Academic Standing (CGPA)
              </h4>
              <p className="text-[11px] text-theme-muted">Evaluating correlation between class presence and semester GPA</p>
            </div>
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.grid} />
                <XAxis
                  type="number"
                  dataKey="attendance"
                  name="Attendance"
                  unit="%"
                  domain={[40, 100]}
                  tick={{ fontSize: 11, fill: chartPalette.textMuted }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="number"
                  dataKey="cgpa"
                  name="CGPA"
                  domain={[3.0, 10.0]}
                  tick={{ fontSize: 11, fill: chartPalette.textMuted }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3', stroke: chartPalette.grid }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div style={tooltipStyle}>
                          <div className="font-bold text-theme-text">{data.name} ({data.id})</div>
                          <div className="text-theme-muted text-xs mt-0.5">Attendance: {data.attendance}%</div>
                          <div className="text-theme-accent font-semibold text-xs">CGPA: {data.cgpa}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Students" data={attendanceVsAcademic} fill={chartPalette.primary} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Correlation 2: Academic CGPA vs Placement Readiness */}
        <div className="bg-theme-surface rounded-2xl border border-theme-border p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text">
                Academic Performance vs. Placement Readiness
              </h4>
              <p className="text-[11px] text-theme-muted">Detecting divergence between theoretical GPA and recruiter screening</p>
            </div>
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.grid} />
                <XAxis
                  type="number"
                  dataKey="cgpa"
                  name="CGPA"
                  domain={[4.0, 10.0]}
                  tick={{ fontSize: 11, fill: chartPalette.textMuted }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="number"
                  dataKey="placementScore"
                  name="Placement Score"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: chartPalette.textMuted }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3', stroke: chartPalette.grid }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div style={tooltipStyle}>
                          <div className="font-bold text-theme-text">{data.name} ({data.id})</div>
                          <div className="text-theme-muted text-xs mt-0.5">CGPA: {data.cgpa}</div>
                          <div className="text-theme-accent font-semibold text-xs">Placement Score: {data.placementScore}/100</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Students" data={academicVsPlacement} fill={chartPalette.secondary} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Historical Monthly Trend Analysis Callout */}
      <div className="p-4 rounded-2xl bg-theme-elevated border border-theme-border flex items-start gap-3">
        <Info className="w-5 h-5 text-theme-accent shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h5 className="font-bold text-theme-text">Longitudinal Trend Analysis Notice</h5>
          <p className="text-theme-muted leading-relaxed">
            Historical monthly trend charts are purposefully withheld for the current ingestion batch because semester-over-semester longitudinal telemetry has not yet been connected. Historical progress tracking will automatically activate once recurring semester audits are registered via the Data Integration hub.
          </p>
        </div>
      </div>
    </div>
  );
};
