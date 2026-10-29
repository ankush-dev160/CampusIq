import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  Sparkles,
  Send,
  RefreshCw,
  Zap,
  Volume2,
  VolumeX,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Brain,
  ShieldCheck,
  FileText,
  Download,
  Eye,
  ExternalLink,
  BookOpen,
  FolderOpen,
  Settings,
  Key,
  X,
  Cpu,
  Check,
} from 'lucide-react';
import { useStudentRecord } from '../../context/CurrentUserContext';
import { useTheme } from '../../context/ThemeContext';
import { CourseResource, getCourseResources, downloadResourceFile } from '../../data/courseResources';
import { ResourceViewerModal } from '../common/ResourceViewerModal';
import { queryElaraAI } from '../../services/aiService';

export type BotState = 'idle' | 'listening' | 'thinking' | 'speaking';

// ─── 3D Procedural Stylized Glowing Orb-Bot Model ────────────────────────────

interface BotModelProps {
  botState: BotState;
  reducedMotion: boolean;
}

function BotModel({ botState, reducedMotion }: BotModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const { pointer } = useThree();

  // Color tokens based on bot state
  const colors = useMemo(() => {
    switch (botState) {
      case 'listening':
        return {
          core: '#06b6d4', // Bright cyan
          emissiveIntensity: 2.5,
          ring: '#22d3ee',
          eyes: '#00f5d4',
        };
      case 'thinking':
        return {
          core: '#2563eb', // Royal Blue
          emissiveIntensity: 3.2,
          ring: '#38bdf8',
          eyes: '#2af5c8',
        };
      case 'speaking':
        return {
          core: '#2af5c8', // Mint cyber glow
          emissiveIntensity: 2.8,
          ring: '#38bdf8',
          eyes: '#22d3ee',
        };
      case 'idle':
      default:
        return {
          core: '#0284c7', // Sky blue
          emissiveIntensity: 1.8,
          ring: '#0ea5e9',
          eyes: '#10b981',
        };
    }
  }, [botState]);

  // Particle positions
  const particleGeo = useMemo(() => {
    const count = 140;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.35 + Math.random() * 0.75;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (!reducedMotion && groupRef.current) {
      // 1. Idle Floating & Parallax Tilt
      const floatOffset = Math.sin(t * 1.8) * 0.08;
      groupRef.current.position.y = floatOffset;

      // Parallax mouse tilt
      const targetRotY = pointer.x * 0.35;
      const targetRotX = -pointer.y * 0.25;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.06);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.06);

      // 2. Head breathing pulse
      if (headRef.current) {
        const pulse = 1 + Math.sin(t * 2.4) * 0.015;
        headRef.current.scale.set(pulse, pulse, pulse);
      }

      // 3. Eye tracking cursor
      const eyeLookX = pointer.x * 0.08;
      const eyeLookY = pointer.y * 0.06;

      if (leftEyeRef.current) {
        leftEyeRef.current.position.x = -0.22 + eyeLookX;
        leftEyeRef.current.position.y = 0.05 + eyeLookY;
      }
      if (rightEyeRef.current) {
        rightEyeRef.current.position.x = 0.22 + eyeLookX;
        rightEyeRef.current.position.y = 0.05 + eyeLookY;
      }

      // 4. State-based Gyro Rings Animation
      if (outerRingRef.current) {
        if (botState === 'thinking') {
          outerRingRef.current.rotation.z += delta * 3.8;
          outerRingRef.current.rotation.x += delta * 2.2;
        } else if (botState === 'listening') {
          outerRingRef.current.rotation.z += delta * 1.5;
          const ringPulse = 1.05 + Math.sin(t * 6.0) * 0.05;
          outerRingRef.current.scale.set(ringPulse, ringPulse, ringPulse);
        } else if (botState === 'speaking') {
          outerRingRef.current.rotation.z += delta * 2.0;
          outerRingRef.current.rotation.y += delta * 1.2;
        } else {
          outerRingRef.current.rotation.z += delta * 0.7;
          outerRingRef.current.rotation.x += delta * 0.4;
        }
      }

      if (innerRingRef.current) {
        if (botState === 'thinking') {
          innerRingRef.current.rotation.y -= delta * 3.4;
          innerRingRef.current.rotation.z -= delta * 1.8;
        } else if (botState === 'speaking') {
          innerRingRef.current.rotation.y -= delta * 1.8;
        } else {
          innerRingRef.current.rotation.y -= delta * 0.6;
          innerRingRef.current.rotation.x -= delta * 0.3;
        }
      }

      // 5. Core Speech Rhythm scaling
      if (coreRef.current) {
        if (botState === 'speaking') {
          const speechMod = 1 + (Math.sin(t * 14.0) * 0.08 + Math.cos(t * 19.0) * 0.05);
          coreRef.current.scale.set(speechMod, speechMod, speechMod);
        } else if (botState === 'listening') {
          const listenMod = 1 + Math.sin(t * 5.0) * 0.04;
          coreRef.current.scale.set(listenMod, listenMod, listenMod);
        } else {
          const idleMod = 1 + Math.sin(t * 2.0) * 0.02;
          coreRef.current.scale.set(idleMod, idleMod, idleMod);
        }
      }

      // 6. Orbital Particles rotation
      if (particlesRef.current) {
        const speed = botState === 'thinking' ? 0.9 : 0.25;
        particlesRef.current.rotation.y += delta * speed;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ── Outer Gyro Ring (Dark Metallic + Glowing Edge) ── */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[1.32, 0.038, 16, 64]} />
        <meshStandardMaterial
          color="#1e1b4b"
          roughness={0.2}
          metalness={0.9}
          emissive={colors.ring}
          emissiveIntensity={botState === 'thinking' ? 1.5 : 0.8}
        />
      </mesh>

      {/* ── Inner Orbital Gyro Ring ── */}
      <mesh ref={innerRingRef} rotation={[-Math.PI / 3, 0, Math.PI / 4]}>
        <torusGeometry args={[1.18, 0.026, 16, 64]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.15}
          metalness={0.95}
          emissive={colors.ring}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* ── Main Head / Floating Obsidian Orb ── */}
      <mesh ref={headRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.78, 48, 48]} />
        <meshPhysicalMaterial
          color="#0d1117"
          roughness={0.12}
          metalness={0.88}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          reflectivity={1.0}
        />
      </mesh>

      {/* ── Curved Dark Cyber Visor Band ── */}
      <mesh position={[0, 0.05, 0.42]}>
        <sphereGeometry args={[0.62, 32, 16, 0, Math.PI * 2, Math.PI * 0.25, Math.PI * 0.45]} />
        <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* ── Inner Luminous Cyber Core (Visible glowing sphere inside) ── */}
      <mesh ref={coreRef} position={[0, 0.04, 0.15]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color={colors.core}
          emissive={colors.core}
          emissiveIntensity={colors.emissiveIntensity}
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* ── Visor Left Eye ── */}
      <mesh ref={leftEyeRef} position={[-0.22, 0.05, 0.68]}>
        <capsuleGeometry args={[0.045, 0.09, 8, 16]} />
        <meshStandardMaterial
          color={colors.eyes}
          emissive={colors.eyes}
          emissiveIntensity={3.0}
          toneMapped={false}
        />
      </mesh>

      {/* ── Visor Right Eye ── */}
      <mesh ref={rightEyeRef} position={[0.22, 0.05, 0.68]}>
        <capsuleGeometry args={[0.045, 0.09, 8, 16]} />
        <meshStandardMaterial
          color={colors.eyes}
          emissive={colors.eyes}
          emissiveIntensity={3.0}
          toneMapped={false}
        />
      </mesh>

      {/* ── Top Levitation Halo / Crown ── */}
      <mesh position={[0, 0.94, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.34, 0.022, 16, 32]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={1.8}
          roughness={0.2}
        />
      </mesh>

      {/* ── Floating Orbital Particles ── */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.038}
          color={colors.ring}
          transparent
          opacity={0.65}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// ─── Lightweight CSS/SVG Fallback for Non-WebGL or Low-End Devices ───────────

function FallbackBotVisual({ botState }: { botState: BotState }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative w-48 h-48 flex items-center justify-center select-none">
      {/* Outer pulsing energy ring */}
      <div
        className={`absolute inset-0 rounded-full border border-blue-500/40 animate-spin ${
          botState === 'thinking' ? 'duration-1000' : 'duration-7000'
        }`}
      />
      <div className="absolute inset-3 rounded-full border border-cyan-400/30 animate-ping duration-3000 opacity-30" />

      {/* Glowing Orb Body */}
      <div
        className={`w-32 h-32 rounded-full border shadow-2xl flex flex-col items-center justify-center relative overflow-hidden animate-float ${
          isDark
            ? 'bg-gradient-to-tr from-blue-950 via-slate-900 to-cyan-950 border-white/20'
            : 'bg-gradient-to-tr from-blue-100 via-indigo-50 to-cyan-100 border-blue-200'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-cyan-400/20" />

        {/* Visor & Eyes */}
        <div
          className={`w-20 h-7 rounded-full border flex items-center justify-around px-3 z-10 shadow-inner ${
            isDark ? 'bg-slate-950/90 border-cyan-500/40' : 'bg-slate-800 border-cyan-400'
          }`}
        >
          <div
            className={`w-2.5 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] ${
              botState === 'speaking' ? 'animate-pulse' : ''
            }`}
          />
          <div
            className={`w-2.5 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] ${
              botState === 'speaking' ? 'animate-pulse' : ''
            }`}
          />
        </div>

        {/* Status text */}
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-cyan-600 dark:text-cyan-400/80 mt-1 z-10">
          {botState}
        </span>
      </div>
    </div>
  );
}

// ─── Main 3D AI Assistant Companion Component ────────────────────────────────

interface OrbBot3DProps {
  onNavigate?: (page: any) => void;
}

export function OrbBot3D({ onNavigate }: OrbBot3DProps) {
  const student = useStudentRecord();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [botState, setBotState] = useState<BotState>('idle');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isOffscreen, setIsOffscreen] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [selectedResource, setSelectedResource] = useState<CourseResource | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('campusiq_gemini_api_key') || '');
  const [saveApiKeyMsg, setSaveApiKeyMsg] = useState<string | null>(null);

  // Chat message state with live streaming support
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<
    Array<{ sender: 'user' | 'bot'; text: string; time: string; isStreaming?: boolean; isInvalid?: boolean; resourceData?: CourseResource[] }>
  >([
    {
      sender: 'bot',
      text: `Hello ${student.name}! I'm Elara, your live campus copilot. Your Success Score is ${student.success_score}/100. Ask me anything about your attendance telemetry, internal assessments, or SGPA trajectory!`,
      time: 'Just now',
      isStreaming: false,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup active streaming interval on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, []);

  // Check reduced motion & WebGL capabilities
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);

      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) setWebglSupported(false);
      } catch {
        setWebglSupported(false);
      }

      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Pause rendering when offscreen
  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        setIsOffscreen(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Quick Suggestion Chips
  const suggestions = [
    { label: '📚 Exam Resources From Sir', query: 'Any resources has sir provided for exam?' },
    { label: '📊 Attendance Telemetry', query: 'Give info about the attendance' },
    { label: '⚡ Fix Networks 71%', query: 'How can I safely recover my Computer Networks attendance above 75%?' },
    { label: '🎯 SGPA Forecast', query: 'Can I achieve 8.5+ SGPA this semester based on my current tests?' },
    { label: '💼 Placement Readiness', query: 'What is my current eligibility and preparation for Tier-1 placements?' },
  ];

  // Dynamic Bot Answer Generator grounded in active student telemetry
  const generateBotReply = (_query: string): { replyText: string; isInvalid?: boolean; resources?: CourseResource[] } => {
    return { replyText: '', isInvalid: false };
  };
  /* LEGACY_UNUSED_START
    const q = query.toLowerCase().trim();
    const att = (student as any)?.overall_attendance ?? (student as any)?.attendance?.overall_attendance ?? 78;
    const cgpa = (student as any)?.cgpa ?? (student as any)?.academic?.cgpa ?? 7.85;
    const backlogs = (student as any)?.backlogs ?? (student as any)?.academic?.backlogs ?? 0;
    const rollNo = (student as any)?.roll_no ?? (student as any)?.student_id ?? 'CS21B022';
    const dept = student.department || 'Computer Science';
    const sem = student.semester || 'Semester 5';

    // 0. GREETINGS & INTRO
    if (q === 'hi' || q === 'hello' || q === 'hey' || q.startsWith('hello') || q.startsWith('hi ') || q.includes('who are you') || q.includes('elara') || q.includes('help')) {
      return {
        replyText:
          `👋 Hello ${student.name}! I am Elara, your autonomous AI academic companion for ${dept}.\n\n` +
          `• Roll Number: ${rollNo} · Current Standing: ${sem}\n` +
          `• Success Score: ${student.success_score}/100\n` +
          `• Biometric Attendance: ${att}% · Cumulative CGPA: ${cgpa.toFixed(2)}\n\n` +
          `How can I help you today? You can ask about your subject attendance, SGPA projections, backlog status, course faculty, or placement eligibility!`,
      };
    }

    // 1. ATTENDANCE INQUIRIES
    if (q.includes('attendance') || q.includes('absent') || q.includes('bunk') || q.includes('71') || q.includes('leave') || q.includes('shortage') || q.includes('debar') || q.includes('missed')) {
      const attendedClasses = Math.round((att / 100) * 120);
      return {
        replyText:
          `📊 Live Attendance Telemetry for ${student.name}:\n\n` +
          `• Overall Attendance: ${att}% (${attendedClasses} of 120 total lectures attended).\n` +
          `• Status: ${att >= 75 ? 'Safe — Cleared for End-Semester Examinations.' : 'Watchlist (<75% min requirement).'}\n\n` +
          `Subject-Wise Roster:\n` +
          `• Operating Systems: 88% (Excellent Standing)\n` +
          `• Machine Learning: 85% (Safe)\n` +
          `• Database Systems: 75% (Borderline Safe)\n` +
          `• Computer Networks: 71% (⚠️ Priority Focus Required)\n\n` +
          `💡 Prescriptive Recovery Formula:\n` +
          `Attending your next 4 consecutive scheduled Computer Networks lectures will bring your subject standing to 75.8%, fully removing all debarment risks!`,
      };
    }

    // 2. ACADEMIC & GRADES & CGPA / SGPA
    if (q.includes('cgpa') || q.includes('sgpa') || q.includes('grade') || q.includes('gpa') || q.includes('mark') || q.includes('exam') || q.includes('test') || q.includes('cat') || q.includes('score')) {
      return {
        replyText:
          `📈 Academic & Performance Intelligence for ${student.name}:\n\n` +
          `• Cumulative CGPA: ${cgpa.toFixed(2)} (Percentile: Top 18% in ${dept}).\n` +
          `• Active Backlogs: ${backlogs} (${backlogs === 0 ? 'Clean academic record' : 'Action required'}).\n` +
          `• Continuous Evaluation: 78% average across CAT 1 and CAT 2.\n` +
          `• Projected Semester 5 SGPA: 8.20 – 8.45.\n\n` +
          `🎯 Recommendation: Keep your assignment submissions at 100% and score 80%+ on upcoming practical vivas to breach the 8.50+ milestone!`,
      };
    }

    // 3. BACKLOGS & ARREARS
    if (q.includes('backlog') || q.includes('arrear') || q.includes('failed') || q.includes('kt') || q.includes('fail') || q.includes('remedial') || q.includes('re-exam')) {
      if (backlogs === 0) {
        return {
          replyText:
            `🎉 Clean Academic Track Record for ${student.name}:\n\n` +
            `• Active Backlogs: 0\n` +
            `• Examination Standing: Clear for all university end-semester papers.\n` +
            `• All prerequisite courses are verified as cleared. You are fully eligible for early campus placement drives!`,
        };
      } else {
        return {
          replyText:
            `⚠️ Academic Arrear Notice for ${student.name}:\n\n` +
            `• Active Backlogs: ${backlogs} subject${backlogs > 1 ? 's' : ''}\n` +
            `• Remedial Roadmap: Please register for the supplementary examination before the university deadline.\n` +
            `• Support: Saturday bridge tutorials are scheduled with your department faculty advisor.`,
        };
      }
    }

    // 3.5 EXAM RESOURCES & FACULTY PDF MATERIALS INQUIRY
    if (
      q.includes('resource') ||
      q.includes('pdf') ||
      q.includes('notes') ||
      q.includes('material') ||
      q.includes('question bank') ||
      q.includes('formula sheet') ||
      q.includes('exam material') ||
      q.includes('has sir provided') ||
      q.includes('sir provided') ||
      q.includes('faculty upload') ||
      q.includes('study pack') ||
      q.includes('exam pack')
    ) {
      const allResources = getCourseResources();

      // Check if user requested a specific subject
      let matched = allResources;
      if (q.includes('ml') || q.includes('machine learning') || q.includes('501')) {
        matched = allResources.filter(r => r.subjectCode === 'CS501');
      } else if (q.includes('network') || q.includes('cn') || q.includes('502')) {
        matched = allResources.filter(r => r.subjectCode === 'CS502');
      } else if (q.includes('os') || q.includes('operating system') || q.includes('503')) {
        matched = allResources.filter(r => r.subjectCode === 'CS503');
      } else if (q.includes('dbms') || q.includes('database') || q.includes('504')) {
        matched = allResources.filter(r => r.subjectCode === 'CS504');
      } else if (q.includes('software') || q.includes('se') || q.includes('505')) {
        matched = allResources.filter(r => r.subjectCode === 'CS505');
      }

      const selectedResources = matched.slice(0, 4);

      return {
        replyText:
          `📚 Verified Faculty Exam Materials & Study Packs:\n\n` +
          `Yes! Your course instructors have published ${selectedResources.length} official end-semester PDF resources to CampusIQ.\n\n` +
          `You can view or download the verified PDF materials directly below:`,
        resources: selectedResources,
      };
    }

    if (q.includes('quiz me') || q.includes('summarize') || q.includes('summary of') || q.includes('explain key')) {
      return {
        replyText:
          `🧠 Elara AI High-Yield Exam Quiz & Key Derivations:\n\n` +
          `Based on Dr. Priya Menon's verified ML Exam Pack, here are the top 3 high-probability university questions:\n\n` +
          `1. [Mathematical Proof]: Prove that the Mean Squared Error cost function for linear regression is strictly convex. (8 Marks)\n` +
          `2. [Numerical Derivation]: Compute the Information Gain for weather outlook given a 14-record dataset using Shannon Entropy: H(S) = -Σ p_i log2(p_i). (10 Marks)\n` +
          `3. [Analytical Algorithm]: Explain the SVM Kernel Trick and why the dual formulation depends only on inner products <x_i, x_j>. (8 Marks)\n\n` +
          `💡 Tip: You can click "Preview" or "Download PDF" on the card above to inspect the complete step-by-step answer key!`,
      };
    }

    // 4. SUBJECTS & FACULTY DIRECTORY
    if (q.includes('subject') || q.includes('course') || q.includes('faculty') || q.includes('professor') || q.includes('teacher') || q.includes('priya menon') || q.includes('suresh kumar') || q.includes('anita bose') || q.includes('who teaches') || q.includes('syllabus')) {
      return {
        replyText:
          `📚 Current Enrolled Courses & Faculty for ${sem}:\n\n` +
          `• CS501: Machine Learning — Dr. Priya Menon (priya.menon@campusiq.edu)\n` +
          `• CS502: Computer Networks — Prof. Suresh Kumar (suresh.kumar@campusiq.edu)\n` +
          `• CS503: Operating Systems — Dr. Anita Bose (anita.bose@campusiq.edu)\n` +
          `• CS504: Database Systems — Dr. Priya Menon (priya.menon@campusiq.edu)\n` +
          `• CS505: Software Engineering — Prof. Suresh Kumar (suresh.kumar@campusiq.edu)\n\n` +
          `All course lecture notes and laboratory manuals are synced on the Classroom module.`,
      };
    }

    // 5. PLACEMENT & INTERNSHIP
    if (q.includes('placement') || q.includes('job') || q.includes('hiring') || q.includes('package') || q.includes('tier') || q.includes('company') || q.includes('internship') || q.includes('interview') || q.includes('coding') || q.includes('aptitude')) {
      return {
        replyText:
          `💼 Placement & Career Readiness for ${student.name}:\n\n` +
          `• Eligibility Status: Qualified for Tier-1 campus hiring drives (Threshold: CGPA >= 7.0).\n` +
          `• Aptitude Mastery: 75/100 (Strong logical reasoning).\n` +
          `• Coding Assessment: 72/100 (Proficient in arrays, hashing, and trees).\n` +
          `• Mock Technical Interview: 75/100 (Cleared data structures & system fundamentals).\n\n` +
          `🚀 Action Item: Practice 5 dynamic programming problems in the Intervention Hub this week to boost your Tier-1 dream company shortlists!`,
      };
    }

    // 6. TIMETABLE & CLASS SCHEDULE
    if (q.includes('schedule') || q.includes('timetable') || q.includes('time table') || q.includes('routine') || q.includes('class today') || q.includes('timing') || q.includes('room') || q.includes('lab')) {
      return {
        replyText:
          `🗓️ Today's Academic Schedule for ${student.name}:\n\n` +
          `• 09:00 – 10:00 AM: Database Systems (Hall 204, Dr. Priya Menon)\n` +
          `• 10:00 – 11:00 AM: Computer Networks (Hall 102, Prof. Suresh Kumar)\n` +
          `• 11:15 – 01:15 PM: Machine Learning Practical Lab (Lab 3B)\n` +
          `• 02:00 – 03:00 PM: Operating Systems (Hall 204, Dr. Anita Bose)\n\n` +
          `All lectures take biometric attendance at the start of each hour.`,
      };
    }

    // 7. PROFILE & STUDENT DOSSIER
    if (q.includes('profile') || q.includes('my details') || q.includes('who am i') || q.includes('roll number') || q.includes('email') || q.includes('info about me')) {
      return {
        replyText:
          `👤 Authenticated Student Dossier:\n\n` +
          `• Full Name: ${student.name}\n` +
          `• Roll Number / ID: ${rollNo}\n` +
          `• Department: ${dept}\n` +
          `• Academic Cohort: Year 3 · ${sem}\n` +
          `• Success Score: ${student.success_score}/100\n` +
          `• Overall Attendance: ${att}%\n` +
          `• CGPA: ${cgpa.toFixed(2)} · Active Backlogs: ${backlogs}\n` +
          `• Status: Verified in Good Standing.`,
      };
    }

    // 8. PROBLEMS & GRIEVANCES
    if (q.includes('problem') || q.includes('grievance') || q.includes('ticket') || q.includes('issue') || q.includes('complaint')) {
      return {
        replyText:
          `📋 My Problem Requests Status:\n\n` +
          `• Ticket #PR-2025-081: Attendance Discrepancy in Computer Networks (Status: In Review by Prof. Suresh Kumar)\n` +
          `• Last Updated: 2 days ago\n\n` +
          `You can submit fresh grievance tickets anytime via the "My Problem" section in your portal.`,
      };
    }

    // 9. STUDY TIPS & IMPROVEMENT ROADMAP
    if (q.includes('tip') || q.includes('tips') || q.includes('improve') || q.includes('how to study') || q.includes('advice') || q.includes('roadmap') || q.includes('strategy')) {
      return {
        replyText:
          `🎯 Personalized Academic Strategy for ${student.name}:\n\n` +
          `1. Attendance Priority: Computer Networks is at 71%. Attend next 4 classes to cross 75%.\n` +
          `2. Technical Coding: Score 75%+ on graph traversals to ensure Tier-1 coding shortlists.\n` +
          `3. End-Semester SGPA: Aim for 80%+ in CAT 2 to lock in an 8.50+ SGPA for Semester 5.\n` +
          `4. Faculty Office Hours: Consult Dr. Priya Menon on Tuesdays for Machine Learning term project guidance.`,
      };
    }

    // ─── 10. INVALID / OUT-OF-SCOPE QUERY HANDLER ────────────────────────────
    // If the question is outside campus database scope, explicitly indicate that it cannot be answered from the DB!
    return {
      replyText:
        `⚠️ [INVALID QUESTION — NOT IN CAMPUS DATABASE]\n\n` +
        `I could not find records matching "${query}" in your CampusIQ institutional database.\n\n` +
        `As your academic AI companion, I only have read access to verified university records:\n` +
        `• Your attendance telemetry & subject-wise debarment status\n` +
        `• Continuous Assessment marks (CAT-1, CAT-2) & CGPA/SGPA trajectory\n` +
        `• Active Backlog / KT status & examination clearance\n` +
        `• Enrolled courses, assigned faculty (Dr. Priya Menon, etc.)\n` +
        `• Placement diagnostics (Aptitude, Coding, Mock Interview scores)\n` +
        `• Class schedule & campus problem tickets\n\n` +
        `💡 Try asking one of these verified questions:\n` +
        `1. "Any resources has sir provided for exam?"\n` +
        `2. "Give info about my attendance and shortage"\n` +
        `3. "What is my current CGPA and active backlogs?"\n` +
        `4. "Am I eligible for Tier-1 campus placements?"\n` +
        `5. "How many Computer Networks lectures do I need to attend to cross 75%?"`,
      isInvalid: true,
    };
  };
  LEGACY_UNUSED_END */

  const handleSendMessage = async (textToSend?: string) => {
    const msg = (textToSend || inputMessage).trim();
    if (!msg) return;

    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
    }

    // 1. User message
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatHistory(prev => [...prev, { sender: 'user', text: msg, time: now }]);
    setInputMessage('');

    // 2. Set bot state: listening -> thinking -> live streaming
    setBotState('listening');
    setIsTyping(true);

    try {
      setTimeout(async () => {
        setBotState('thinking');

        const { replyText, isInvalid, resources } = await queryElaraAI(msg, student);

        setBotState('speaking');
        setIsTyping(false);

        // Add empty streaming message with resourceData
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setChatHistory(prev => [
          ...prev,
          { sender: 'bot', text: '', isStreaming: true, time: replyTime, isInvalid, resourceData: resources },
        ]);

        // Stream word by word like ChatGPT / Claude
        const words = replyText.split(' ');
        let currentWordIdx = 0;
        let accumulated = '';

        streamIntervalRef.current = setInterval(() => {
          if (currentWordIdx < words.length) {
            accumulated += (currentWordIdx === 0 ? '' : ' ') + words[currentWordIdx];
            currentWordIdx++;
            setChatHistory(prev => {
              const updated = [...prev];
              const lastIdx = updated.length - 1;
              if (lastIdx >= 0 && updated[lastIdx].sender === 'bot') {
                updated[lastIdx] = { ...updated[lastIdx], text: accumulated, isStreaming: true, isInvalid, resourceData: resources };
              }
              return updated;
            });
            chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
          } else {
            if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
            setChatHistory(prev => {
              const updated = [...prev];
              const lastIdx = updated.length - 1;
              if (lastIdx >= 0 && updated[lastIdx].sender === 'bot') {
                updated[lastIdx] = { ...updated[lastIdx], isStreaming: false, isInvalid, resourceData: resources };
              }
              return updated;
            });
            setBotState('idle');
          }
        }, 18);
      }, 250);
    } catch (err) {
      console.error('Elara AI error:', err);
      setBotState('idle');
      setIsTyping(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-3xl border transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 ${
        isDark
          ? 'border-white/10 bg-gradient-to-br from-[#0b1220]/95 via-[#0f1a2e]/90 to-[#142038]/95 shadow-[0_20px_50px_rgba(37,99,235,0.15)]'
          : 'border-slate-200/90 bg-gradient-to-br from-white via-slate-50/95 to-blue-50/40 shadow-[0_16px_40px_rgba(0,0,0,0.06)]'
      }`}
    >
      {/* Background Soft Ambient Glow Orbs */}
      <div
        className={`absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isDark ? 'bg-blue-600/15' : 'bg-blue-400/10'
        }`}
      />
      <div
        className={`absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isDark ? 'bg-cyan-500/15' : 'bg-cyan-400/10'
        }`}
      />

      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div
        className={`relative z-10 flex items-center justify-between border-b pb-4 mb-4 ${
          isDark ? 'border-white/10' : 'border-slate-200/80'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
              isDark
                ? 'bg-gradient-to-tr from-blue-600/40 via-cyan-500/20 to-transparent border border-blue-500/30 text-cyan-300'
                : 'bg-blue-50 border border-blue-200 text-blue-600'
            }`}
          >
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-theme-text tracking-tight">Elara AI</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-500 dark:text-cyan-300 border border-blue-500/30">
                Live Neural Copilot
              </span>
            </div>
            <p className="text-[11px] text-theme-muted">Real-time WebGL Academic & Career Intelligence</p>
          </div>
        </div>

        {/* State Badge & Sound Toggle */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
              botState === 'thinking'
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-600 dark:text-blue-300 animate-pulse'
                : botState === 'speaking'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-300'
                : botState === 'listening'
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-600 dark:text-cyan-300'
                : isDark
                ? 'bg-white/5 border-white/10 text-slate-300'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                botState === 'thinking'
                  ? 'bg-blue-500 animate-ping'
                  : botState === 'speaking'
                  ? 'bg-emerald-500 animate-pulse'
                  : botState === 'listening'
                  ? 'bg-cyan-500 animate-ping'
                  : 'bg-cyan-500'
              }`}
            />
            <span className="capitalize">{botState}</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-xl bg-theme-secondary hover:bg-theme-elevated border border-theme-border text-theme-muted hover:text-theme-text transition-colors"
            title={soundEnabled ? 'Mute AI feedback' : 'Unmute AI feedback'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-500" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 rounded-xl bg-theme-secondary hover:bg-theme-elevated border border-theme-border text-theme-muted hover:text-theme-text transition-colors flex items-center gap-1.5"
            title="Configure AI Model & Gemini API Key"
            aria-label="AI Engine Settings"
          >
            <Settings className="w-4 h-4 text-theme-muted hover:text-cyan-400" />
            <span className="hidden sm:inline text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {geminiApiKey ? 'Gemini 1.5' : 'Neural RAG'}
            </span>
          </button>
        </div>
      </div>

      {/* ── Middle: 3D WebGL Canvas & Live Speech Bubble ─────────────────────── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center my-2">
        {/* Left Column: 3D WebGL Model (md:col-span-5) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative min-h-[240px] sm:min-h-[260px]">
          {webglSupported ? (
            <div className="w-full h-64 sm:h-72 relative cursor-grab active:cursor-grabbing">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <FallbackBotVisual botState={botState} />
                  </div>
                }
              >
                {!isOffscreen && (
                  <Canvas
                    camera={{ position: [0, 0, 3.2], fov: 45 }}
                    dpr={[1, 2]}
                    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                  >
                    {/* Lighting */}
                    <ambientLight intensity={isDark ? 0.7 : 1.0} />
                    {/* Blue Key Light */}
                    <pointLight position={[-3, 3, 3]} intensity={2.8} color="#2563eb" />
                    {/* Cyan Rim Light */}
                    <pointLight position={[3, -1, -2]} intensity={3.5} color="#06b6d4" />
                    {/* Front Fill Light */}
                    <directionalLight position={[0, 2, 4]} intensity={isDark ? 1.2 : 1.6} color="#ffffff" />

                    <BotModel botState={botState} reducedMotion={reducedMotion} />
                  </Canvas>
                )}
              </Suspense>
            </div>
          ) : (
            <FallbackBotVisual botState={botState} />
          )}

          {/* Micro status caption */}
          <div className="text-[10px] text-theme-muted flex items-center gap-1.5 mt-1 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span>Pointer-tracking neural avatar · Live WebGL</span>
          </div>
        </div>

        {/* Right Column: Conversational Live Stream (md:col-span-7) */}
        <div className="md:col-span-7 flex flex-col justify-between h-full space-y-3">
          {/* Messages Scroll Area */}
          <div className="space-y-2.5 max-h-[280px] sm:max-h-[320px] overflow-y-auto scrollbar-thin pr-1">
            {chatHistory.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} transition-all`}
              >
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[94%] shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none border border-blue-400/30'
                      : m.isInvalid
                      ? isDark
                        ? 'bg-rose-950/25 border border-rose-500/40 text-slate-200 rounded-bl-none'
                        : 'bg-rose-50 border border-rose-300 text-slate-800 rounded-bl-none shadow-xs'
                      : isDark
                      ? 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none backdrop-blur-md'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-none shadow-xs'
                  }`}
                >
                  {m.isInvalid && (
                    <div className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 mb-2 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 w-fit">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Not in Campus Database</span>
                    </div>
                  )}
                  <p className="text-xs leading-relaxed whitespace-pre-line">
                    {m.text}
                    {m.isStreaming && (
                      <span className="inline-block w-1.5 h-3.5 ml-1 bg-cyan-400 animate-pulse align-middle" />
                    )}
                  </p>

                  {/* Verified Faculty PDF Resource Cards */}
                  {m.resourceData && m.resourceData.length > 0 && !m.isStreaming && (
                    <div className="mt-3 pt-3 border-t border-cyan-500/25 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Direct PDF Downloads ({m.resourceData.length} Study Packs)</span>
                        </span>
                      </div>

                      <div className="space-y-2">
                        {m.resourceData.map((res) => (
                          <div
                            key={res.id}
                            className={`p-2.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs ${
                              isDark
                                ? 'bg-slate-900/90 border-white/10 hover:border-cyan-500/40'
                                : 'bg-slate-50 border-slate-200 hover:border-blue-400'
                            }`}
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[9px]">
                                PDF
                              </div>
                              <div className="min-w-0">
                                <h5 className="text-[11px] font-bold text-theme-text truncate" title={res.title}>
                                  {res.title}
                                </h5>
                                <p className="text-[10px] text-theme-muted truncate">
                                  {res.subjectName} · By {res.uploadedBy} · {res.fileSize}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                              <button
                                onClick={() => {
                                  setSelectedResource(res);
                                  setIsViewerOpen(true);
                                }}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-theme-surface hover:bg-theme-elevated border border-theme-border text-theme-text flex items-center gap-1 transition"
                                title="Open in-app reader"
                              >
                                <Eye className="w-3 h-3 text-cyan-400" />
                                <span>Preview</span>
                              </button>
                              <button
                                onClick={() => downloadResourceFile(res)}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 flex items-center gap-1 transition"
                                title="Download PDF to device"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download PDF</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestion buttons for invalid query */}
                  {m.isInvalid && !m.isStreaming && (
                    <div className="mt-2.5 pt-2 border-t border-rose-500/20 space-y-1.5">
                      <span className="text-[10px] font-bold text-cyan-400 block">
                        Ask a verified academic question:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {[
                          'Any resources has sir provided for exam?',
                          'Give info about the attendance',
                          'What is my current CGPA and active backlogs?',
                          'Am I eligible for Tier-1 placements?',
                          'How can I recover Networks attendance?',
                        ].map((qText) => (
                          <button
                            key={qText}
                            onClick={() => handleSendMessage(qText)}
                            className="text-[9.5px] px-2 py-0.5 rounded-lg bg-theme-surface/80 border border-theme-border hover:border-cyan-400 text-theme-text hover:text-cyan-400 transition"
                          >
                            {qText}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[9.5px] text-theme-muted mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div
                className={`flex items-center gap-1.5 p-3 rounded-2xl w-fit backdrop-blur-md border ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                <span className="text-[10px] text-theme-muted ml-1 font-medium">
                  Elara is synthesizing live data...
                </span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Suggestion Chips */}
          <div
            className={`pt-2 border-t ${
              isDark ? 'border-white/10' : 'border-slate-200/80'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3 h-3 text-cyan-500" />
              <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider">
                Instant Live Inquiries:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => handleSendMessage(s.query)}
                  className={`text-[11px] px-2.5 py-1 rounded-xl border font-medium active:scale-95 text-left transition-all ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200'
                      : 'bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 shadow-xs'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Input Bar ────────────────────────────────────────────────── */}
      <div
        className={`relative z-10 pt-3 border-t mt-2 flex items-center gap-2 ${
          isDark ? 'border-white/10' : 'border-slate-200/80'
        }`}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Ask Elara about your attendance info, SGPA, exams, or career..."
          className={`flex-1 px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:ring-1 transition-all ${
            isDark
              ? 'bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-cyan-400/30'
              : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20 shadow-xs'
          }`}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive In-App PDF Document Viewer Modal */}
      <ResourceViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        resource={selectedResource}
        onAskAI={(prompt) => handleSendMessage(prompt)}
      />

      {/* AI Model & Engine Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-theme-elevated border border-theme-border rounded-2xl shadow-2xl p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-theme-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-theme-text">Elara AI Neural Engine Settings</h3>
                  <p className="text-xs text-theme-muted">Configure model architecture & API providers</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-lg text-theme-muted hover:text-theme-text hover:bg-theme-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Mode Card */}
            <div className="p-4 rounded-xl bg-theme-secondary border border-theme-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-theme-text flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Active Model Mode:
                </span>
                <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${
                  geminiApiKey
                    ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                }`}>
                  {geminiApiKey ? 'Google Gemini 1.5 Flash' : 'CampusIQ Grounded Neural RAG'}
                </span>
              </div>
              <p className="text-xs text-theme-muted leading-relaxed">
                {geminiApiKey
                  ? 'Queries are transmitted to Google Gemini with institutional student context and course resources injected as system instructions.'
                  : 'Zero-latency local neural architecture grounded strictly in verified institutional database records, attendance shortage formulas, and faculty PDF study packs.'}
              </p>
            </div>

            {/* Google Gemini API Key Input */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-theme-text mb-1">
                  Google Gemini API Key (Optional)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={e => setGeminiApiKey(e.target.value)}
                    placeholder="Enter AIzaSy... API key from Google AI Studio"
                    className="w-full bg-theme-secondary border border-theme-border rounded-xl px-3.5 py-2 text-xs text-theme-text placeholder-theme-muted/50 focus:outline-none focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-theme-muted">
                    <Key className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[11px] text-theme-muted mt-1">
                  Leave blank to use the built-in <strong>CampusIQ Neural RAG Engine</strong> (zero external setup required).
                </p>
              </div>

              {saveApiKeyMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>{saveApiKeyMsg}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-theme-border">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('campusiq_gemini_api_key');
                  setGeminiApiKey('');
                  setSaveApiKeyMsg('Reverted to CampusIQ Grounded Neural RAG Engine!');
                  setTimeout(() => setSaveApiKeyMsg(null), 3000);
                }}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
              >
                Reset to Default RAG
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-theme-muted hover:text-theme-text bg-theme-secondary border border-theme-border"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (geminiApiKey.trim()) {
                      localStorage.setItem('campusiq_gemini_api_key', geminiApiKey.trim());
                      setSaveApiKeyMsg('Gemini API key saved! Elara AI is now powered by Gemini 1.5 Flash.');
                    } else {
                      localStorage.removeItem('campusiq_gemini_api_key');
                      setSaveApiKeyMsg('Saved! Using CampusIQ Grounded Neural RAG.');
                    }
                    setTimeout(() => {
                      setSaveApiKeyMsg(null);
                      setIsSettingsOpen(false);
                    }, 1200);
                  }}
                  className="btn-primary text-white text-xs font-bold px-4 py-1.5 rounded-xl shadow-md shadow-blue-500/20"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrbBot3D;
