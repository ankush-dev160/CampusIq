import React, { useState } from 'react';
import { useCampusData } from '../context/CampusDataContext';
import { ScoreWeights } from '../types/scoring';
import { AcademicRiskThresholds, PlacementRiskThresholds } from '../types/risk';
import { Sliders, AlertTriangle, CheckCircle2, RotateCcw, Info, Settings, Database } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    weights,
    academicThresholds,
    placementThresholds,
    updateWeights,
    updateAcademicThresholds,
    updatePlacementThresholds,
    resetToDemoData,
    students,
  } = useCampusData();

  // Local state for weights form
  const [localWeights, setLocalWeights] = useState<ScoreWeights>({ ...weights });
  const [weightSuccessMsg, setWeightSuccessMsg] = useState(false);

  // Local state for academic thresholds
  const [localAcad, setLocalAcad] = useState<AcademicRiskThresholds>({ ...academicThresholds });
  const [acadSuccessMsg, setAcadSuccessMsg] = useState(false);

  // Local state for placement thresholds
  const [localPlace, setLocalPlace] = useState<PlacementRiskThresholds>({ ...placementThresholds });
  const [placeSuccessMsg, setPlaceSuccessMsg] = useState(false);

  // Weight sum check
  const totalWeight =
    localWeights.academic +
    localWeights.attendance +
    localWeights.lms +
    localWeights.engagement +
    localWeights.placement +
    localWeights.skills;

  const isWeightValid = totalWeight === 100;

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWeightValid) return;
    updateWeights(localWeights);
    setWeightSuccessMsg(true);
    setTimeout(() => setWeightSuccessMsg(false), 3000);
  };

  const handleSaveAcad = (e: React.FormEvent) => {
    e.preventDefault();
    updateAcademicThresholds(localAcad);
    setAcadSuccessMsg(true);
    setTimeout(() => setAcadSuccessMsg(false), 3000);
  };

  const handleSavePlace = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlacementThresholds(localPlace);
    setPlaceSuccessMsg(true);
    setTimeout(() => setPlaceSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Institutional Calibration Notice */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-amber-400">Institutional Governance & Calibration Notice</h4>
          <p className="text-theme-muted leading-relaxed">
            The initial weights and risk cutoffs configured below represent prototype baseline standards designed for university demonstration. Before production campus deployment, these parameters should be validated with the Academic Council and Placement Directorate against longitudinal historical outcomes.
          </p>
        </div>
      </div>

      {/* 1. Student Success Score Component Weights */}
      <div className="panel p-6 rounded-xl border border-theme-border space-y-4">
        <div className="flex items-center justify-between border-b border-theme-border pb-3">
          <div>
            <h3 className="text-sm font-bold text-theme-text">Success Score Component Weights</h3>
            <p className="text-xs text-theme-muted">
              Weights must total precisely 100%. Dynamic re-normalization will preserve these relative proportions when student data is partially incomplete.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                isWeightValid
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-red-500/15 text-red-400 border-red-500/30'
              }`}
            >
              Sum: {totalWeight}% {isWeightValid ? '✓ Valid' : '⚠️ Must equal 100%'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveWeights} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-theme-text mb-1">
                Academic Performance (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={localWeights.academic}
                onChange={e => setLocalWeights({ ...localWeights, academic: Number(e.target.value) })}
                className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2 font-bold text-theme-text focus:border-theme-accent focus:outline-none"
              />
              <span className="text-[10px] text-theme-muted">70% CGPA + 30% Internals</span>
            </div>

            <div>
              <label className="block font-semibold text-theme-text mb-1">Attendance Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={localWeights.attendance}
                onChange={e => setLocalWeights({ ...localWeights, attendance: Number(e.target.value) })}
                className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2 font-bold text-theme-text focus:border-theme-accent focus:outline-none"
              />
              <span className="text-[10px] text-theme-muted">Overall verified presence</span>
            </div>

            <div>
              <label className="block font-semibold text-theme-text mb-1">LMS Engagement (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={localWeights.lms}
                onChange={e => setLocalWeights({ ...localWeights, lms: Number(e.target.value) })}
                className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2 font-bold text-theme-text focus:border-theme-accent focus:outline-none"
              />
              <span className="text-[10px] text-theme-muted">50% Logins + 50% Assignments</span>
            </div>

            <div>
              <label className="block font-semibold text-theme-text mb-1">
                Co-curricular & Certs (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={localWeights.engagement}
                onChange={e => setLocalWeights({ ...localWeights, engagement: Number(e.target.value) })}
                className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2 font-bold text-theme-text focus:border-theme-accent focus:outline-none"
              />
              <span className="text-[10px] text-theme-muted">Events, Clubs & Certifications</span>
            </div>

            <div>
              <label className="block font-semibold text-theme-text mb-1">
                Placement Readiness (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={localWeights.placement}
                onChange={e => setLocalWeights({ ...localWeights, placement: Number(e.target.value) })}
                className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2 font-bold text-theme-text focus:border-theme-accent focus:outline-none"
              />
              <span className="text-[10px] text-theme-muted">Aptitude, Coding & Interview</span>
            </div>

            <div>
              <label className="block font-semibold text-theme-text mb-1">Skills Assessment (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={localWeights.skills}
                onChange={e => setLocalWeights({ ...localWeights, skills: Number(e.target.value) })}
                className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2 font-bold text-theme-text focus:border-theme-accent focus:outline-none"
              />
              <span className="text-[10px] text-theme-muted">60% Tech + 40% Soft Skills</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {weightSuccessMsg ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Weights updated and persisted!
              </span>
            ) : <span />}

            <button
              type="submit"
              disabled={!isWeightValid}
              className="btn-primary px-4 py-2 text-xs font-semibold rounded-lg disabled:opacity-50 transition"
            >
              Save Weight Configuration
            </button>
          </div>
        </form>
      </div>

      {/* 2. Academic Risk Thresholds */}
      <div className="panel p-6 rounded-xl border border-theme-border space-y-4">
        <div className="border-b border-theme-border pb-3">
          <h3 className="text-sm font-bold text-theme-text">Academic Risk Rule Thresholds</h3>
          <p className="text-xs text-theme-muted">
            Configure early warning boundaries that trigger Academic Risk flags.
          </p>
        </div>

        <form onSubmit={handleSaveAcad} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-theme-text mb-1">
                Critical Attendance (&lt; %)
              </label>
              <input
                type="number"
                value={localAcad.min_attendance_critical}
                onChange={e => setLocalAcad({ ...localAcad, min_attendance_critical: Number(e.target.value) })}
                className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2 font-bold text-theme-text focus:border-theme-accent focus:outline-none"
              />
              <span className="text-[10px] text-theme-muted">Exam debarment risk</span>
            </div>

            <div>
              <label className="block font-semibold text-theme-text mb-1">
                Warning Attendance (&lt; %)
              </label>
              <input
                type="number"
                value={localAcad.min_attendance_low}
                onChange={e => setLocalAcad({ ...localAcad, min_attendance_low: Number(e.target.value) })}
                className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2 font-bold text-theme-text focus:border-theme-accent focus:outline-none"
              />
              <span className="text-[10px] text-theme-muted">Borderline watch</span>
            </div>

            <div>
              <label className="block font-semibold text-theme-text mb-1">Critical CGPA (&lt;)</label>
              <input
                type="number"
                step="0.1"
                value={localAcad.min_cgpa_critical}
                onChange={e => setLocalAcad({ ...localAcad, min_cgpa_critical: Number(e.target.value) })}
                className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2 font-bold text-theme-text focus:border-theme-accent focus:outline-none"
              />
              <span className="text-[10px] text-theme-muted">Academic probation</span>
            </div>

            <div>
              <label className="block font-semibold text-theme-text mb-1">
                Critical Internals (&lt; %)
              </label>
              <input
                type="number"
                value={localAcad.min_internal_marks_critical}
                onChange={e => setLocalAcad({ ...localAcad, min_internal_marks_critical: Number(e.target.value) })}
                className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2 font-bold text-theme-text focus:border-theme-accent focus:outline-none"
              />
              <span className="text-[10px] text-theme-muted">Continuous assessment fail</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {acadSuccessMsg ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Academic rules updated!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="btn-primary px-4 py-2 text-xs font-semibold rounded-lg transition"
            >
              Save Academic Thresholds
            </button>
          </div>
        </form>
      </div>

      {/* 3. Placement Risk Thresholds */}
      <div className="panel p-6 rounded-xl border border-theme-border space-y-4">
        <div className="border-b border-theme-border pb-3">
          <h3 className="text-sm font-bold text-theme-text">Placement Screening Cutoffs</h3>
          <p className="text-xs text-theme-muted">
            Recruiter benchmark cutoffs for aptitude, coding, and mock assessments.
          </p>
        </div>

        <form onSubmit={handleSavePlace} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-theme-text mb-1">
                Min Aptitude Benchmark (/100)
              </label>
              <input
                type="number"
                value={localPlace.min_aptitude_score}
                onChange={e => setLocalPlace({ ...localPlace, min_aptitude_score: Number(e.target.value) })}
                className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2 font-bold text-theme-text focus:border-theme-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-theme-text mb-1">
                Min Coding Benchmark (/100)
              </label>
              <input
                type="number"
                value={localPlace.min_coding_score}
                onChange={e => setLocalPlace({ ...localPlace, min_coding_score: Number(e.target.value) })}
                className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2 font-bold text-theme-text focus:border-theme-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-theme-text mb-1">
                Min Mock Interview Benchmark (/100)
              </label>
              <input
                type="number"
                value={localPlace.min_mock_interview_score}
                onChange={e => setLocalPlace({ ...localPlace, min_mock_interview_score: Number(e.target.value) })}
                className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2 font-bold text-theme-text focus:border-theme-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {placeSuccessMsg ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Placement benchmarks updated!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="btn-primary px-4 py-2 text-xs font-semibold rounded-lg transition"
            >
              Save Placement Thresholds
            </button>
          </div>
        </form>
      </div>

      {/* 4. Demonstration Reset & System Information */}
      <div className="panel p-6 rounded-xl border border-theme-border space-y-4">
        <div className="flex items-center justify-between border-b border-theme-border pb-3">
          <div>
            <h3 className="text-sm font-bold text-theme-text">Demonstration Reset & Data Purge</h3>
            <p className="text-xs text-theme-muted">
              Reset all student profiles, interventions, and rules back to initial 135-student seed dataset.
            </p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Reset all campus data to default initial demonstration state?')) {
                resetToDemoData();
                setLocalWeights({ academic: 30, attendance: 20, lms: 15, engagement: 10, placement: 15, skills: 10 });
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 rounded-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Dataset</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1 text-theme-muted">
          <div>
            <span className="text-[10px] uppercase font-bold text-theme-muted block">Platform Architecture</span>
            <strong className="text-theme-text">React 19 + TypeScript + Vite</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-theme-muted block">Scoring Engine</span>
            <strong className="text-theme-text">Deterministic Re-normalizing</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-theme-muted block">Active Student Cohort</span>
            <strong className="text-theme-text">{students.length} Records</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-theme-muted block">Data Privacy</span>
            <strong className="text-emerald-400">100% In-Browser Isolation</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
