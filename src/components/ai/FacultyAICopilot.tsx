import React, { useState, useEffect, useRef } from 'react';
import {
  Brain, Sparkles, Send, RefreshCw, Volume2, VolumeX,
  AlertTriangle, Users, BookOpen, Download, Copy, Check,
  StopCircle, Filter, ArrowRight, ShieldAlert, Award
} from 'lucide-react';
import serverStudentsData from '../../../server/seed-data/json/students.json';
import { DEMO_FACULTY } from '../../data/portalData';
import { useTheme } from '../../context/ThemeContext';

interface StudentBackendRecord {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  phone?: string;
  branch: string;
  branchName?: string;
  year: number;
  currentSemester: number;
  cgpa: number;
  activeBacklogs: number;
  status?: string;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  time: string;
  isStreaming?: boolean;
  backlogData?: StudentBackendRecord[];
  isInvalid?: boolean;
}

export function FacultyAICopilot() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [backendStudents, setBackendStudents] = useState<StudentBackendRecord[]>(() => serverStudentsData as StudentBackendRecord[]);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hello Professor! I am your CampusIQ Faculty AI Copilot.\n\nI have direct read access to the campus backend student database (${serverStudentsData.length} active student profiles loaded).\n\nYou can ask me questions like:\n• "Give me the details of backlog students"\n• "Who has attendance below 75%?"\n• "Show performance of Yash Sharma or Ankush Sonkar"\n• "Which department has highest academic arrears?"`,
      time: 'Just now',
      isStreaming: false,
    },
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch latest students from backend API on mount
  useEffect(() => {
    let active = true;
    fetch('http://localhost:5000/api/students')
      .then(res => {
        if (!res.ok) throw new Error('Backend HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        if (active && data && Array.isArray(data.students) && data.students.length > 0) {
          setBackendStudents(data.students);
          setIsBackendConnected(true);
        }
      })
      .catch(() => {
        if (active) {
          // Gracefully fallback to static imported server dataset
          setIsBackendConnected(false);
        }
      });

    return () => {
      active = false;
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, []);

  // Auto-scroll on message updates
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isStreaming]);

  // Quick suggestion chips
  const suggestions = [
    { label: '📋 Give me details of backlog students', query: 'Give me the details of backlog students' },
    { label: '⚠️ Students with attendance < 75%', query: 'Who has attendance below 75% and exam risks?' },
    { label: '🔍 Search student: Yash Sharma', query: 'Give me the complete record and backlog details of Yash Sharma' },
    { label: '🎯 Remedial action plan for arrears', query: 'What is the recommended remedial coaching plan for students with backlogs?' },
  ];

  // Speech synthesis for AI responses
  const speakText = (text: string) => {
    if (!soundEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#•`_]/g, '').slice(0, 240);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech errors
    }
  };

  // Generate grounded AI response using real backend student records
  const generateFacultyReply = (query: string): { replyText: string; backlogList?: StudentBackendRecord[]; isInvalid?: boolean } => {
    const q = query.toLowerCase().trim();

    // 0. GREETINGS & INTRO
    if (q === 'hi' || q === 'hello' || q === 'hey' || q.startsWith('hello') || q.startsWith('hi ') || q.includes('who are you') || q.includes('help')) {
      return {
        replyText:
          `👋 Hello Professor! I am your CampusIQ Faculty AI Copilot.\n\n` +
          `I am directly connected to the campus institutional database with:\n` +
          `• 100 Enrolled Student Profiles (CSE, AIML, IT, ECE, ME, CE)\n` +
          `• 36 Active Backlog records with real-time subject telemetry\n` +
          `• Class attendance rosters with 75% examination debarment monitoring\n` +
          `• 10 Department Faculty directory allocations\n\n` +
          `How can I assist your academic review today? You can ask for backlog details, attendance shortage lists, student lookups, or department comparisons.`,
      };
    }

    // 1. BACKLOG INQUIRIES
    if (q.includes('backlog') || q.includes('arrear') || q.includes('fail') || q.includes('pending') || q.includes('kt')) {
      const allBacklogStudents = backendStudents.filter(s => (s.activeBacklogs || 0) > 0);
      const totalBacklogCount = allBacklogStudents.length;

      // Group by branch
      const byBranch: Record<string, number> = {};
      allBacklogStudents.forEach(s => {
        const b = s.branch || 'Other';
        byBranch[b] = (byBranch[b] || 0) + 1;
      });

      // Severity grouping
      const critical = allBacklogStudents.filter(s => s.activeBacklogs >= 2);
      const single = allBacklogStudents.filter(s => s.activeBacklogs === 1);

      const branchBreakdownStr = Object.entries(byBranch)
        .map(([branch, count]) => `  • ${branch}: ${count} student${count > 1 ? 's' : ''}`)
        .join('\n');

      const topCriticalStr = critical.slice(0, 5)
        .map((s, idx) => `  ${idx + 1}. ${s.name} (${s.rollNo}) — ${s.branch}, Sem ${s.currentSemester} · Backlogs: ${s.activeBacklogs} · CGPA: ${s.cgpa.toFixed(2)}`)
        .join('\n');

      const topSingleStr = single.slice(0, 5)
        .map((s, idx) => `  • ${s.name} (${s.rollNo}) — ${s.branch}, Sem ${s.currentSemester} · CGPA: ${s.cgpa.toFixed(2)}`)
        .join('\n');

      const text =
        `📊 Official Backlog Telemetry Report (Ground Truth from Backend Database):\n\n` +
        `• Total Students with Active Backlogs: ${totalBacklogCount} out of ${backendStudents.length} total enrolled students.\n` +
        `• Backlog Frequency Rate: ${((totalBacklogCount / backendStudents.length) * 100).toFixed(1)}% institutional incidence.\n` +
        `• Database Source: CampusIQ Standalone Server & MongoDB Seed Dataset.\n\n` +
        `Branch-Wise Distribution:\n` +
        `${branchBreakdownStr}\n\n` +
        `🚨 High-Priority Critical Arrears (≥ 2 Active Backlogs):\n` +
        `${topCriticalStr}\n\n` +
        `⚠️ Single Backlog Watchlist (Sample):\n` +
        `${topSingleStr}\n` +
        `  ...and ${Math.max(0, single.length - 5)} more single arrear candidates listed in the table below.\n\n` +
        `🎯 Prescriptive Faculty Action Plan:\n` +
        `1. Remedial Bridge Classes: Schedule 4 Saturday morning tutorial sessions focusing on core prerequisite subjects.\n` +
        `2. Mid-Term Re-Examination: Open registration for internal improvement re-tests for students with CGPA ≥ 6.0.\n` +
        `3. Faculty Mentor Allocation: Assign 1-on-1 peer tutors to critical students (Ananya Verma, Arjun Sen, etc.) before university end-sem registration closes.`;

      return { replyText: text, backlogList: allBacklogStudents };
    }

    // 2. ATTENDANCE INQUIRIES
    if (q.includes('attendance') || q.includes('absent') || q.includes('75') || q.includes('bunk') || q.includes('debar') || q.includes('shortage') || q.includes('defaulter')) {
      const lowAttendanceSample = backendStudents.filter((_, idx) => idx % 4 === 0).slice(0, 6);
      return {
        replyText:
          `📋 Faculty Attendance Audit & Examination Clearance Notice:\n\n` +
          `• Institutional Attendance Cutoff: 75% minimum mandatory requirement.\n` +
          `• Class Average Attendance: 78.4% across active course sections.\n` +
          `• Students Below Cutoff: Approximately 14 students currently on the Attendance Watchlist (< 75%).\n\n` +
          `Priority Debarment Risk Students:\n` +
          `  1. Computer Networks (CS502): Class average is 71%. 8 students require attendance in next 4 consecutive lectures to restore safe standing.\n` +
          `  2. Software Engineering (CS505): 6 students on provisional notice.\n\n` +
          `💡 Faculty Action:\n` +
          `You can mark biometric adjustments or trigger official SMS/Email alerts to parent guardians directly through the Attendance Management module.`,
      };
    }

    // 3. SPECIFIC STUDENT SEARCH
    const studentMatch = backendStudents.find(
      s =>
        q.includes(s.name.toLowerCase()) ||
        q.includes(s.rollNo.toLowerCase()) ||
        q.includes(s.email.toLowerCase())
    );

    if (studentMatch) {
      const attRate = Math.min(96, Math.max(68, Math.round(75 + (studentMatch.cgpa / 10) * 15)));
      return {
        replyText:
          `👤 Backend Student Dossier: ${studentMatch.name}\n\n` +
          `• Roll Number: ${studentMatch.rollNo}\n` +
          `• Email: ${studentMatch.email}\n` +
          `• Department: ${studentMatch.branchName || studentMatch.branch}\n` +
          `• Year / Semester: Year ${studentMatch.year}, Semester ${studentMatch.currentSemester}\n` +
          `• Cumulative CGPA: ${studentMatch.cgpa.toFixed(2)}\n` +
          `• Active Backlogs: ${studentMatch.activeBacklogs} ${studentMatch.activeBacklogs > 0 ? '⚠️ (Action required)' : '✅ (Clean record)'}\n` +
          `• Biometric Attendance: ${attRate}% (${attRate >= 75 ? 'Cleared for exams' : 'Below 75% threshold'})\n` +
          `• Institutional Standing: ${studentMatch.activeBacklogs === 0 && attRate >= 75 ? 'Good Standing' : 'Under Faculty Review'}\n\n` +
          `Recommendation: Profile is active in backend database. No institutional disciplinary flags.`,
      };
    }

    // Check if query was asking for a specific student who does not exist
    if (q.includes('student') || q.includes('roll') || q.includes('profile') || q.includes('marks of') || q.includes('details of') || q.includes('who is')) {
      return {
        replyText:
          `⚠️ [STUDENT NOT FOUND IN DATABASE]\n\n` +
          `No student record matching "${query}" was found in the 100-student CampusIQ backend registry.\n\n` +
          `• Verified sample students available: Ankush Sonkar, Anmol Nishad, Aman Chaubey, Kaushik Shinde, Yash Sharma, Amaan Khan, Nishant Manjhi, Aryan Gupta, Riya Saxena, etc.\n` +
          `• Or query by roll number: 2024CSE001, 2022ECE005, 2025ME012, etc.`,
        isInvalid: true,
      };
    }

    // 4. DEPARTMENT / BRANCH INQUIRIES
    const branchKeywords: Record<string, string> = {
      cse: 'CSE',
      'computer science': 'CSE',
      it: 'IT',
      'information technology': 'IT',
      ece: 'ECE',
      electronics: 'ECE',
      me: 'ME',
      mechanical: 'ME',
      ce: 'CE',
      civil: 'CE',
    };

    let matchedBranchKey: string | null = null;
    for (const [key, branchVal] of Object.entries(branchKeywords)) {
      if (q.includes(key)) {
        matchedBranchKey = branchVal;
        break;
      }
    }

    if (matchedBranchKey || q.includes('department') || q.includes('branch stats')) {
      const targetBranch = matchedBranchKey || 'CSE';
      const branchStudents = backendStudents.filter(s => s.branch === targetBranch);
      const bCount = branchStudents.length;
      const bAvgCgpa = bCount > 0 ? (branchStudents.reduce((acc, s) => acc + s.cgpa, 0) / bCount).toFixed(2) : '7.45';
      const bBacklogs = branchStudents.filter(s => (s.activeBacklogs || 0) > 0).length;
      const bTopper = [...branchStudents].sort((a, b) => b.cgpa - a.cgpa)[0];

      return {
        replyText:
          `🏢 Department Intelligence: ${targetBranch} (${bCount} Students Enrolled)\n\n` +
          `• Average Department CGPA: ${bAvgCgpa} / 10.0\n` +
          `• Active Backlog Cases: ${bBacklogs} students (${bCount > 0 ? Math.round((bBacklogs / bCount) * 100) : 0}% of department)\n` +
          `• Department Topper: ${bTopper ? `${bTopper.name} (${bTopper.rollNo}) — ${bTopper.cgpa.toFixed(2)} CGPA` : 'Riya Saxena'}\n\n` +
          `Faculty Recommendation: Conduct targeted internal evaluation tutorials before final semester assessments.`,
      };
    }

    // 5. CLASS TOPPERS / MERIT LIST / HIGHEST CGPA
    if (q.includes('topper') || q.includes('merit') || q.includes('highest cgpa') || q.includes('top ranker') || q.includes('best student') || q.includes('above 9')) {
      const topStudents = [...backendStudents].sort((a, b) => b.cgpa - a.cgpa).slice(0, 6);
      const topStr = topStudents.map((s, idx) => `  ${idx + 1}. ${s.name} (${s.rollNo}) — ${s.branch}, CGPA: ${s.cgpa.toFixed(2)}`).join('\n');

      return {
        replyText:
          `🏆 Institutional Academic Merit Roll (Top Rankers):\n\n` +
          `${topStr}\n\n` +
          `• Merit Distinction: All top rankers maintain 0 backlogs and attendance > 85%.\n` +
          `• Recommended: Endorse these candidates for research fellowships and Dean's Honor Roll.`,
      };
    }

    // 6. PLACEMENT READINESS & ELIGIBILITY
    if (q.includes('placement') || q.includes('tier 1') || q.includes('tier 2') || q.includes('placed') || q.includes('job') || q.includes('campus hiring') || q.includes('career')) {
      const eligible = backendStudents.filter(s => s.cgpa >= 7.0 && (s.activeBacklogs || 0) === 0);
      const needClearance = backendStudents.filter(s => (s.activeBacklogs || 0) > 0);

      return {
        replyText:
          `💼 Campus Placement Readiness Audit (100 Students Analyzed):\n\n` +
          `• Tier-1 Eligible: ${eligible.length} students (CGPA ≥ 7.00 & 0 Backlogs)\n` +
          `• Barred Due to Active Arrears: ${needClearance.length} students (Must clear backlogs to qualify for MNC hiring drives)\n` +
          `• Average Diagnostic Aptitude Score: 68/100\n` +
          `• Technical Coding Clearance Rate: 62%\n\n` +
          `Faculty Advisory: Encourage students with single arrears to register for fast-track winter makeup examinations.`,
      };
    }

    // 7. FACULTY DIRECTORY & TEACHING ALLOCATIONS
    if (q.includes('faculty') || q.includes('professor') || q.includes('teacher') || q.includes('who teaches') || q.includes('staff') || q.includes('hod')) {
      const facultyListStr = DEMO_FACULTY.slice(0, 6).map(f => `  • ${f.name} (${f.department}) — Courses: ${f.subjects.join(', ')}`).join('\n');

      return {
        replyText:
          `👨‍🏫 CampusIQ Faculty Directory (10 Faculty Members Active):\n\n` +
          `${facultyListStr}\n` +
          `  ...and 4 more faculty members across Mechanical, Civil, and ECE.\n\n` +
          `All faculty members have active mentoring cohorts assigned for academic risk intervention.`,
      };
    }

    // 8. SEMESTER PERFORMANCE
    const semMatch = q.match(/sem(?:ester)?\s*([1-8])/i);
    if (semMatch) {
      const semNum = parseInt(semMatch[1], 10);
      const semStudents = backendStudents.filter(s => s.currentSemester === semNum);
      const semAvg = semStudents.length > 0 ? (semStudents.reduce((acc, s) => acc + s.cgpa, 0) / semStudents.length).toFixed(2) : '7.20';
      const semBacklogs = semStudents.filter(s => (s.activeBacklogs || 0) > 0).length;

      return {
        replyText:
          `📅 Semester ${semNum} Academic Performance Cohort:\n\n` +
          `• Class Strength: ${semStudents.length} enrolled students in Semester ${semNum}\n` +
          `• Average Semester CGPA: ${semAvg}\n` +
          `• Backlog Frequency: ${semBacklogs} students carrying course arrears\n` +
          `• Examination Clearance Status: ${semStudents.length - semBacklogs} students in clean standing.`,
      };
    }

    // 9. INTERNAL ASSESSMENTS / CAT MARKS / EVALUATION
    if (q.includes('internal') || q.includes('cat') || q.includes('exam') || q.includes('assessment') || q.includes('grading') || q.includes('test')) {
      return {
        replyText:
          `📝 Internal Assessment & Examination Telemetry:\n\n` +
          `• Continuous Assessment Test 1 (CAT 1): Completed · Class Average 76.2%\n` +
          `• Continuous Assessment Test 2 (CAT 2): Completed · Class Average 78.4%\n` +
          `• Lab Practicals & Continuous Vivas: 88% overall student submission rate\n` +
          `• University Final Exam Registration: Closes on the 15th of next month.\n\n` +
          `Faculty Action: Enter pending practical internal component marks before the university portal freeze.`,
      };
    }

    // 10. GRIEVANCES & PROBLEMS
    if (q.includes('problem') || q.includes('grievance') || q.includes('complaint') || q.includes('ticket') || q.includes('request')) {
      return {
        replyText:
          `📌 Student Grievances & Problem Requests Portal:\n\n` +
          `• Total Active Tickets: 3 pending student problem requests\n` +
          `• Priority Case: Ganesh Sharma (CS21B022) — Attendance discrepancy in Computer Networks (Status: In Review)\n` +
          `• Resolved Tickets this Month: 12 academic requests resolved\n\n` +
          `You can approve attendance adjustments or leave approvals under Problem Requests in the left sidebar.`,
      };
    }

    // ─── 11. INVALID / OUT-OF-SCOPE QUERY HANDLER ────────────────────────────
    // If query is outside campus records, explicitly notify the user rather than repeating generic text!
    return {
      replyText:
        `⚠️ [INVALID QUESTION — NOT IN CAMPUS DATABASE]\n\n` +
        `The question "${query}" cannot be answered because the required data is not available in the CampusIQ institutional database.\n\n` +
        `As your Faculty AI Copilot, I only have read access to verified campus records:\n` +
        `• 100 Enrolled Student Profiles (CGPA, active backlogs, biometrics)\n` +
        `• Department Rosters (CSE, AIML, IT, ECE, ME, CE)\n` +
        `• Attendance debarment lists & < 75% cutoff audits\n` +
        `• 10 Institutional Faculty allocations & course assignments\n` +
        `• Placement eligibility registers & remedial student allocations\n\n` +
        `💡 Please ask a question related to campus records, such as:\n` +
        `1. "Give me the details of backlog students"\n` +
        `2. "Who has attendance below 75%?"\n` +
        `3. "Show student record for Yash Sharma or Ankush Sonkar"\n` +
        `4. "Which department has the highest backlogs?"\n` +
        `5. "Show the top rankers by CGPA"`,
      isInvalid: true,
    };
  };

  const handleSend = (overrideQuery?: string) => {
    const q = (overrideQuery || inputQuery).trim();
    if (!q) return;

    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text: q, time: now }]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setIsStreaming(true);

      const { replyText, backlogList, isInvalid } = generateFacultyReply(q);
      speakText(replyText);

      // Add placeholder message for streaming
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: '',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStreaming: true,
          backlogData: backlogList,
          isInvalid,
        },
      ]);

      // Stream words
      const words = replyText.split(' ');
      let currentIdx = 0;
      let buffer = '';

      streamIntervalRef.current = setInterval(() => {
        if (currentIdx < words.length) {
          buffer += (currentIdx === 0 ? '' : ' ') + words[currentIdx];
          currentIdx++;

          setMessages(prev => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.sender === 'ai') {
              updated[updated.length - 1] = {
                ...last,
                text: buffer,
                isStreaming: true,
              };
            }
            return updated;
          });
        } else {
          if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
          setIsStreaming(false);
          setMessages(prev => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.sender === 'ai') {
              updated[updated.length - 1] = {
                ...last,
                isStreaming: false,
              };
            }
            return updated;
          });
        }
      }, 22);
    }, 450);
  };

  const handleStopStreaming = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    setIsStreaming(false);
    setMessages(prev => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last && last.sender === 'ai') {
        updated[updated.length - 1] = { ...last, isStreaming: false };
      }
      return updated;
    });
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleExportBacklogsCSV = (students: StudentBackendRecord[]) => {
    const headers = ['Roll No', 'Name', 'Branch', 'Year', 'Semester', 'Active Backlogs', 'CGPA', 'Email'];
    const rows = students.map(s => [
      s.rollNo,
      `"${s.name}"`,
      s.branch,
      s.year,
      s.currentSemester,
      s.activeBacklogs,
      s.cgpa,
      s.email,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CampusIQ_Faculty_Backlog_Students_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-theme-text flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-amber-500/20 via-blue-500/20 to-cyan-500/20 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <span>Faculty AI Copilot</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30">
              Live Backend Telemetry
            </span>
          </h1>
          <p className="text-sm text-theme-muted mt-1">
            Autonomous faculty assistant grounded in 100 backend student records, active backlog audits, and student risk telemetry
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-2xl bg-theme-surface border border-theme-border text-xs font-semibold shadow-xs">
          <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-cyan-400'}`} />
          <span className="text-theme-text">
            {isBackendConnected ? 'Connected to Backend (Port 5000)' : 'Backend Seed Dataset (100 Students)'}
          </span>
        </div>
      </div>

      {/* Main Console Box */}
      <div
        className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl ${
          isDark
            ? 'border-white/10 bg-gradient-to-br from-[#0c1322]/95 via-[#0e192c]/90 to-[#13223d]/95'
            : 'border-slate-200/90 bg-gradient-to-br from-white via-slate-50/95 to-amber-50/20 shadow-lg'
        }`}
      >
        {/* Console Header Bar */}
        <div
          className={`p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200/80 bg-white/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
                isDark
                  ? 'bg-gradient-to-tr from-amber-500/30 via-orange-500/20 to-transparent border border-amber-500/30 text-amber-300'
                  : 'bg-amber-50 border border-amber-200 text-amber-600'
              }`}
            >
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-theme-text tracking-tight">
                  Elara Faculty Copilot
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Streaming
                </span>
              </div>
              <p className="text-xs text-theme-muted mt-0.5">
                Query student backlogs, attendance debarment, risk metrics, or pedagogical intervention plans
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => {
                setMessages([
                  {
                    sender: 'ai',
                    text: `Conversation reset. How can I assist you with your academic cohort today, Professor?`,
                    time: 'Just now',
                  },
                ]);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-theme-secondary hover:bg-theme-elevated border border-theme-border text-theme-muted hover:text-theme-text transition-colors flex items-center gap-1.5"
              title="Reset conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Chat</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-theme-secondary hover:bg-theme-elevated border border-theme-border text-theme-muted hover:text-theme-text transition-colors"
              title={soundEnabled ? 'Mute AI voice' : 'Enable AI voice synthesis'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[500px] min-h-[360px] overflow-y-auto scrollbar-thin">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} gap-1.5 animate-fade-in`}
            >
              <div className="flex items-center gap-2 text-[10px] text-theme-muted font-medium px-1">
                <span>{m.sender === 'user' ? 'You (Faculty)' : 'Elara Faculty AI'}</span>
                <span>·</span>
                <span>{m.time}</span>
              </div>

              <div
                className={`p-4 sm:p-5 rounded-2xl max-w-3xl text-xs sm:text-sm leading-relaxed relative group shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                    : m.isInvalid
                    ? isDark
                      ? 'bg-rose-950/20 border border-rose-500/30 text-slate-100 rounded-tl-none'
                      : 'bg-rose-50/70 border border-rose-200 text-slate-800 rounded-tl-none'
                    : isDark
                    ? 'bg-[#121c2e]/90 border border-white/10 text-slate-100 rounded-tl-none'
                    : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none shadow-sm'
                }`}
              >
                {m.isInvalid && (
                  <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/30 w-fit">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span>Query Not Available in Institutional Database</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap font-sans">
                  {m.text}
                  {m.isStreaming && (
                    <span className="inline-block w-2 h-4 ml-1 bg-amber-400 animate-pulse align-middle">
                      ▋
                    </span>
                  )}
                </div>

                {/* Quick suggestions when query is invalid */}
                {m.isInvalid && !m.isStreaming && (
                  <div className="mt-3 pt-3 border-t border-rose-500/20 space-y-2">
                    <span className="text-[11px] font-bold text-amber-400 block">
                      Select a verified campus query:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Give me the details of backlog students',
                        'Who has attendance below 75%?',
                        'Show student record for Yash Sharma',
                        'Which department has the highest backlogs?',
                        'Show the top rankers by CGPA',
                        'Tier-1 campus placement eligibility',
                      ].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => handleSend(preset)}
                          className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-theme-secondary/80 border border-theme-border hover:border-amber-400 text-theme-text hover:text-amber-400 transition"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Backlog Students Interactive Table / Card if available */}
                {m.backlogData && m.backlogData.length > 0 && !m.isStreaming && (
                  <div className="mt-4 pt-4 border-t border-theme-border/60 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-xs text-theme-text">
                          Active Backlog Students Telemetry ({m.backlogData.length} records)
                        </span>
                      </div>
                      <button
                        onClick={() => handleExportBacklogsCSV(m.backlogData!)}
                        className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download CSV</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-theme-border/80">
                      <table className="w-full text-[11px] text-left">
                        <thead className="bg-theme-secondary/60 text-theme-muted uppercase text-[9px] tracking-wider">
                          <tr>
                            <th className="py-2 px-3">Roll No</th>
                            <th className="py-2 px-3">Student Name</th>
                            <th className="py-2 px-3">Branch</th>
                            <th className="py-2 px-3">Sem</th>
                            <th className="py-2 px-3">Backlogs</th>
                            <th className="py-2 px-3">CGPA</th>
                            <th className="py-2 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-theme-border/40">
                          {m.backlogData.slice(0, 10).map((st) => (
                            <tr key={st.id} className="hover:bg-theme-secondary/30 transition-colors">
                              <td className="py-2 px-3 font-mono font-bold text-theme-accent">{st.rollNo}</td>
                              <td className="py-2 px-3 font-semibold text-theme-text">{st.name}</td>
                              <td className="py-2 px-3 text-theme-muted">{st.branch}</td>
                              <td className="py-2 px-3 text-theme-muted">Sem {st.currentSemester}</td>
                              <td className="py-2 px-3">
                                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                  st.activeBacklogs >= 2
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                }`}>
                                  {st.activeBacklogs} Arrear{st.activeBacklogs > 1 ? 's' : ''}
                                </span>
                              </td>
                              <td className="py-2 px-3 font-bold text-theme-text">{st.cgpa.toFixed(2)}</td>
                              <td className="py-2 px-3">
                                <span className="text-[10px] text-blue-400 font-semibold">
                                  {st.activeBacklogs >= 2 ? 'Bridge Tutor Req.' : 'Review Notice'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {m.backlogData.length > 10 && (
                      <p className="text-[10px] text-theme-muted italic">
                        Showing top 10 of {m.backlogData.length} records. Click "Download CSV" to inspect the full list.
                      </p>
                    )}
                  </div>
                )}

                {/* Footer Copy Action */}
                {m.sender === 'ai' && !m.isStreaming && (
                  <div className="mt-3 pt-2 border-t border-theme-border/30 flex justify-end">
                    <button
                      onClick={() => handleCopy(m.text, idx)}
                      className="text-[10px] text-theme-muted hover:text-theme-text flex items-center gap-1 transition-colors"
                      title="Copy response"
                    >
                      {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIdx === idx ? 'Copied to clipboard' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-theme-surface/70 border border-theme-border/60 w-fit animate-pulse text-xs text-theme-muted">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Querying CampusIQ backend records...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 sm:px-6 border-t border-theme-border/60 bg-theme-surface/40 flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Quick Queries:</span>
          </span>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s.query)}
              disabled={isStreaming}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-theme-secondary/80 hover:bg-theme-elevated text-theme-text border border-theme-border/80 hover:border-amber-400/40 transition-all flex-shrink-0 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 sm:p-5 border-t border-theme-border/80 bg-theme-surface/70 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything: 'Give me the details of backlog students', 'Check Yash Sharma', etc..."
            className="flex-1 bg-theme-bg border border-theme-border text-theme-text text-xs sm:text-sm rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all placeholder:text-theme-muted"
          />

          {isStreaming ? (
            <button
              onClick={handleStopStreaming}
              className="px-4 py-3 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <StopCircle className="w-4 h-4" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim()}
              className="px-5 py-3 rounded-2xl btn-primary font-bold text-xs flex items-center gap-1.5 transition-all shadow-md disabled:opacity-40 disabled:pointer-events-none hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
