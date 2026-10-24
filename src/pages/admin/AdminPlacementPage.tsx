import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  ShieldCheck,
  Award,
  AlertTriangle,
  Download,
  Plus,
  Edit2,
  Brain,
  Filter,
  CheckCircle2,
  Clock,
  Search,
  Database,
  BarChart2,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useCurrentUser } from '../../context/CurrentUserContext';
import {
  fetchAdminAnalytics,
  fetchQuestions,
  saveQuestion,
} from '../../services/placementApi';
import {
  checkFirebaseConnection,
  saveQuestionToFirestore,
} from '../../lib/firebaseClient';
import type { PlacementAdminAnalytics } from '../../types/placement';

type AdminTab = 'analytics' | 'questions' | 'firebase';

export const AdminPlacementPage: React.FC = () => {
  const { loggedInEmail } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  // Analytics State
  const [analytics, setAnalytics] = useState<PlacementAdminAnalytics | null>(null);

  // Questions State
  const [questions, setQuestions] = useState<any[]>([]);
  const [trackFilter, setTrackFilter] = useState<string>('all');

  // Question Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const [modalForm, setModalForm] = useState({
    track: 'dsa',
    topic: '',
    difficulty: 'Medium',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctIndex: 0,
    explanation: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Firebase status
  const [firebaseStatus, setFirebaseStatus] = useState<any>(null);

  const isHOD = loggedInEmail.includes('hod');

  const loadAnalytics = async () => {
    try {
      const data = await fetchAdminAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load placement analytics:', err);
    }
  };

  const loadQuestions = async () => {
    try {
      const data = await fetchQuestions();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error('Failed to load questions:', err);
    }
  };

  useEffect(() => {
    loadAnalytics();
    loadQuestions();
    checkFirebaseConnection().then(setFirebaseStatus).catch(() => {});
  }, []);

  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setModalForm({
      track: 'dsa',
      topic: '',
      difficulty: 'Medium',
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctIndex: 0,
      explanation: ''
    });
    setSaveSuccess(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (q: any) => {
    setEditingQuestion(q);
    setModalForm({
      track: q.track,
      topic: q.topic,
      difficulty: q.difficulty || 'Medium',
      question: q.question,
      optionA: q.options[0] || '',
      optionB: q.options[1] || '',
      optionC: q.options[2] || '',
      optionD: q.options[3] || '',
      correctIndex: q.correctIndex ?? 0,
      explanation: q.explanation || ''
    });
    setSaveSuccess(null);
    setIsAddModalOpen(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveSuccess(null);

    const payload = {
      ...(editingQuestion ? { id: editingQuestion.id } : {}),
      track: modalForm.track,
      topic: modalForm.topic.trim(),
      difficulty: modalForm.difficulty,
      question: modalForm.question.trim(),
      options: [
        modalForm.optionA.trim(),
        modalForm.optionB.trim(),
        modalForm.optionC.trim(),
        modalForm.optionD.trim()
      ],
      correctIndex: Number(modalForm.correctIndex),
      explanation: modalForm.explanation.trim()
    };

    try {
      const result = await saveQuestion(payload);
      // Sync to Firebase Firestore
      if (result.question) {
        saveQuestionToFirestore(result.question).catch(() => {});
      }
      setSaveSuccess(editingQuestion ? 'Question updated successfully!' : 'New question added to Question Bank!');
      loadQuestions();
      setTimeout(() => {
        setIsAddModalOpen(false);
      }, 1200);
    } catch (err: any) {
      alert(err.message || 'Failed to save question');
    } finally {
      setSaveLoading(false);
    }
  };

  const filteredQuestions = trackFilter === 'all'
    ? questions
    : questions.filter(q => q.track === trackFilter);

  // Branch Averages chart data
  const branchData = (analytics?.branchAverages || []).map(b => ({
    branch: b.branch,
    percentage: b.averagePercentage ?? 0,
    attempts: b.attemptCount
  }));

  // Track Averages chart data
  const trackData = (analytics?.trackAverages || [])
    .filter(t => t.attemptCount > 0)
    .map(t => ({
      name: t.trackName.length > 15 ? t.trackName.substring(0, 14) + '...' : t.trackName,
      fullName: t.trackName,
      percentage: t.averagePercentage ?? 0,
      attempts: t.attemptCount
    }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-theme-text tracking-tight flex items-center gap-2">
              Placement Cell Administration
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                Placement Officer / TPO
              </span>
            </h1>
            <p className="text-xs text-theme-muted mt-0.5">
              Aggregated skill assessments, branch-wise readiness benchmarks, students with no attempts, and question bank manager.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Question
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-theme-border/60 pb-1">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'analytics'
              ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
              : 'text-theme-muted hover:text-theme-text'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Skill Test Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'questions'
              ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
              : 'text-theme-muted hover:text-theme-text'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Question Bank Manager ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('firebase')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'firebase'
              ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
              : 'text-theme-muted hover:text-theme-text'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Firebase Database</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-theme-surface border border-theme-border space-y-1.5">
              <div className="text-xs text-theme-muted">Total Test Attempts</div>
              <div className="text-2xl font-black text-theme-text">
                {analytics?.totalAttempts ?? 0}
              </div>
              <div className="text-[11px] text-theme-muted">
                {analytics?.uniqueStudentsTested ?? 0} unique students tested
              </div>
            </div>

            <div className="p-4 rounded-xl bg-theme-surface border border-theme-border space-y-1.5">
              <div className="text-xs text-theme-muted">Overall Average Score</div>
              <div className="text-2xl font-black text-blue-400">
                {analytics?.overallAveragePercentage ?? 0}%
              </div>
              <div className="text-[11px] text-theme-muted">Across all branch attempts</div>
            </div>

            <div className="p-4 rounded-xl bg-theme-surface border border-theme-border space-y-1.5">
              <div className="text-xs text-theme-muted">Job-Ready Rate (&gt;70%)</div>
              <div className="text-2xl font-black text-emerald-400">
                {analytics?.jobReadyRate ?? 0}%
              </div>
              <div className="text-[11px] text-theme-muted">Eligible for premium campus drives</div>
            </div>

            <div className="p-4 rounded-xl bg-theme-surface border border-theme-border space-y-1.5">
              <div className="text-xs text-theme-muted">Zero Attempts (Pending)</div>
              <div className="text-2xl font-black text-amber-400">
                {analytics?.studentsWithNoAttemptsCount ?? 0} students
              </div>
              <div className="text-[11px] text-theme-muted">Action: Send test diagnostic invite</div>
            </div>
          </div>

          {/* Charts: Branch Averages & Track Averages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Branch Averages Bar Chart */}
            <div className="bg-theme-surface border border-theme-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-blue-400" />
                  <span>Branch-Wise Average Readiness</span>
                </h3>
                <span className="text-xs text-theme-muted">Threshold: 70%</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="branch" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Avg Score']}
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: 8, fontSize: 12 }}
                    />
                    <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                      {branchData.map((b, i) => (
                        <Cell
                          key={i}
                          fill={b.percentage >= 70 ? '#10b981' : b.percentage >= 40 ? '#f59e0b' : '#38bdf8'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Track Averages */}
            <div className="bg-theme-surface border border-theme-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-cyan-400" />
                  <span>Track-Wise Performance Benchmark</span>
                </h3>
                <span className="text-xs text-theme-muted">Active Tracks</span>
              </div>

              {trackData.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trackData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                      <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} />
                      <Tooltip
                        formatter={(val: any) => [`${val}%`, 'Average']}
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: 8, fontSize: 12 }}
                      />
                      <Bar dataKey="percentage" fill="#0284c7" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center text-xs text-theme-muted">
                  <Brain className="w-8 h-8 text-blue-400/40 mb-2" />
                  <span>Student attempts in progress. Track averages will display dynamically as tests are submitted.</span>
                </div>
              )}
            </div>
          </div>

          {/* Students With No Attempts Table */}
          <div className="bg-theme-surface border border-theme-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-theme-text">Students With No Attempts</h3>
                <p className="text-xs text-theme-muted">
                  Students who have not completed any domain skill tests yet. Target for diagnostic reminders.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                {analytics?.studentsWithNoAttemptsCount ?? 0} Pending
              </span>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-theme-border text-theme-muted">
                    <th className="pb-2.5 font-semibold">Roll No</th>
                    <th className="pb-2.5 font-semibold">Student Name</th>
                    <th className="pb-2.5 font-semibold">Branch</th>
                    <th className="pb-2.5 font-semibold">Year</th>
                    <th className="pb-2.5 font-semibold">CGPA</th>
                    <th className="pb-2.5 font-semibold">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border/50 text-theme-text">
                  {(analytics?.studentsWithNoAttempts || []).slice(0, 10).map((s, idx) => (
                    <tr key={idx} className="hover:bg-theme-secondary/20">
                      <td className="py-2.5 font-mono text-blue-400 font-semibold">{s.rollNo}</td>
                      <td className="py-2.5 font-bold">{s.name}</td>
                      <td className="py-2.5">{s.branch}</td>
                      <td className="py-2.5">{s.year}</td>
                      <td className="py-2.5">{s.cgpa || 'N/A'}</td>
                      <td className="py-2.5 text-theme-muted">{s.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUESTION BANK MANAGER */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-theme-surface border border-theme-border">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-theme-muted" />
              <span className="text-xs font-semibold text-theme-muted">Filter Track:</span>
              <select
                value={trackFilter}
                onChange={e => setTrackFilter(e.target.value)}
                className="text-xs bg-theme-secondary border border-theme-border rounded-lg px-2.5 py-1.5 text-theme-text"
              >
                <option value="all">All Tracks ({questions.length})</option>
                <option value="dsa">DSA</option>
                <option value="database-sql">Database & SQL</option>
                <option value="web-dev">Web Development</option>
                <option value="cyber-security">Cyber Security</option>
                <option value="ai-ml">AI & Data Science</option>
                <option value="cloud-devops">Cloud & DevOps</option>
                <option value="embedded-iot">Embedded & IoT</option>
                <option value="vlsi-digital">VLSI & Digital</option>
                <option value="comm-systems">Comm Systems</option>
                <option value="core-mech">Core Mechanical</option>
                <option value="cad-cam-robotics">CAD/CAM & Robotics</option>
                <option value="civil-structures">Civil Structures</option>
                <option value="aptitude">Aptitude & Reasoning</option>
              </select>
            </div>

            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Placement MCQ</span>
            </button>
          </div>

          {/* Questions Table */}
          <div className="bg-theme-surface border border-theme-border rounded-2xl p-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-theme-border text-theme-muted">
                  <th className="pb-3 font-semibold">ID</th>
                  <th className="pb-3 font-semibold">Track</th>
                  <th className="pb-3 font-semibold">Topic</th>
                  <th className="pb-3 font-semibold">Difficulty</th>
                  <th className="pb-3 font-semibold">Question Preview</th>
                  <th className="pb-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border/50 text-theme-text">
                {filteredQuestions.slice(0, 50).map(q => (
                  <tr key={q.id} className="hover:bg-theme-secondary/20 transition">
                    <td className="py-3 font-mono text-[11px] text-blue-400 font-semibold">{q.id}</td>
                    <td className="py-3 uppercase font-bold text-[11px] text-theme-muted">{q.track}</td>
                    <td className="py-3 font-medium">{q.topic}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        q.difficulty === 'Easy'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : q.difficulty === 'Hard'
                          ? 'bg-red-500/15 text-red-400 border-red-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="py-3 max-w-md truncate text-theme-muted">{q.question}</td>
                    <td className="py-3">
                      <button
                        onClick={() => handleOpenEdit(q)}
                        className="px-2.5 py-1 rounded-md bg-theme-secondary hover:bg-theme-secondary/80 text-blue-400 text-xs font-semibold flex items-center gap-1 border border-theme-border"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FIREBASE STATUS */}
      {activeTab === 'firebase' && (
        <div className="space-y-4">
          <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-theme-text">Firebase Cloud Integration</h3>
                <p className="text-xs text-theme-muted">
                  Project: <code className="text-blue-400 font-mono">details-of-student</code>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-theme-secondary/40 border border-theme-border space-y-2">
                <div className="text-xs text-theme-muted font-bold">Cloud Firestore Database</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${firebaseStatus?.firestoreAccessible ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span className="text-sm font-bold text-theme-text">
                    {firebaseStatus?.firestoreAccessible ? 'Connected & Active' : 'Configuration Valid (Permission/API)'}
                  </span>
                </div>
                <p className="text-[11px] text-theme-muted leading-relaxed">
                  Used for persistent student profiles, question bank, and scored placement attempts.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-theme-secondary/40 border border-theme-border space-y-2">
                <div className="text-xs text-theme-muted font-bold">Firebase Realtime Database</div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-sm font-bold text-theme-text">
                    details-of-student-default-rtdb
                  </span>
                </div>
                <p className="text-[11px] text-theme-muted leading-relaxed">
                  Real-time synchronization for concurrent placement test sessions and leaderboards.
                </p>
              </div>
            </div>

            {firebaseStatus?.message && (
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-400 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>{firebaseStatus.message}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Question Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-theme-surface border border-theme-border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <h3 className="text-base font-bold text-theme-text">
                {editingQuestion ? 'Edit Question' : 'Add New Placement MCQ'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-theme-muted hover:text-theme-text text-sm"
              >
                ✕
              </button>
            </div>

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveQuestion} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-theme-muted block mb-1">Track</label>
                  <select
                    value={modalForm.track}
                    onChange={e => setModalForm(p => ({ ...p, track: e.target.value }))}
                    className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2 text-theme-text"
                  >
                    <option value="dsa">DSA</option>
                    <option value="database-sql">Database & SQL</option>
                    <option value="web-dev">Web Development</option>
                    <option value="cyber-security">Cyber Security</option>
                    <option value="ai-ml">AI & Data Science</option>
                    <option value="cloud-devops">Cloud & DevOps</option>
                    <option value="embedded-iot">Embedded & IoT</option>
                    <option value="vlsi-digital">VLSI & Digital</option>
                    <option value="comm-systems">Comm Systems</option>
                    <option value="core-mech">Core Mechanical</option>
                    <option value="cad-cam-robotics">CAD/CAM & Robotics</option>
                    <option value="civil-structures">Civil Structures</option>
                    <option value="aptitude">Aptitude</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-theme-muted block mb-1">Difficulty</label>
                  <select
                    value={modalForm.difficulty}
                    onChange={e => setModalForm(p => ({ ...p, difficulty: e.target.value as any }))}
                    className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2 text-theme-text"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-theme-muted block mb-1">Topic</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Binary Trees & BST"
                  value={modalForm.topic}
                  onChange={e => setModalForm(p => ({ ...p, topic: e.target.value }))}
                  className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2 text-theme-text"
                />
              </div>

              <div>
                <label className="font-semibold text-theme-muted block mb-1">Question Statement</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter the technical question text..."
                  value={modalForm.question}
                  onChange={e => setModalForm(p => ({ ...p, question: e.target.value }))}
                  className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2 text-theme-text"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="font-semibold text-theme-muted block">Options & Correct Solution</label>
                {(['optionA', 'optionB', 'optionC', 'optionD'] as const).map((key, optIdx) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctIndex"
                      checked={modalForm.correctIndex === optIdx}
                      onChange={() => setModalForm(p => ({ ...p, correctIndex: optIdx }))}
                      className="accent-blue-500 cursor-pointer"
                    />
                    <span className="font-mono font-bold text-theme-muted w-4">
                      {['A', 'B', 'C', 'D'][optIdx]}.
                    </span>
                    <input
                      required
                      type="text"
                      placeholder={`Option ${['A', 'B', 'C', 'D'][optIdx]}`}
                      value={modalForm[key]}
                      onChange={e => setModalForm(p => ({ ...p, [key]: e.target.value }))}
                      className="flex-1 bg-theme-secondary border border-theme-border rounded-lg p-2 text-theme-text"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="font-semibold text-theme-muted block mb-1">Explanation</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Explain why the chosen option is correct..."
                  value={modalForm.explanation}
                  onChange={e => setModalForm(p => ({ ...p, explanation: e.target.value }))}
                  className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2 text-theme-text"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-theme-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-theme-surface hover:bg-theme-secondary border border-theme-border text-theme-text"
                >
                  Cancel
                </button>
                <button
                  disabled={saveLoading}
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {saveLoading ? 'Saving...' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
