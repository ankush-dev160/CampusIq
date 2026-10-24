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
} from 'lucide-react';
import { useStudentRecord } from '../../context/CurrentUserContext';

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
      <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-950 via-slate-900 to-cyan-950 border border-white/20 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden animate-float">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-cyan-400/20" />

        {/* Visor & Eyes */}
        <div className="w-20 h-7 rounded-full bg-slate-950/90 border border-cyan-500/40 flex items-center justify-around px-3 z-10 shadow-inner">
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
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-cyan-400/80 mt-1 z-10">
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
  const [botState, setBotState] = useState<BotState>('idle');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isOffscreen, setIsOffscreen] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  // Chat message state
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: `Hello ${student.name}! I'm Elara, your 3D campus copilot. Your Success Score is ${student.success_score}/100. Watch out for Computer Networks (71% attendance) — attending the next 4 lectures secures exam eligibility.`,
      time: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

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
      } catch (err) {
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
    { label: 'Fix 71% Attendance', query: 'How can I safely recover my Computer Networks attendance above 75%?' },
    { label: 'Explain ML 95% Test', query: 'What impact did my 19/20 score in Machine Learning have on my internals?' },
    { label: 'Check Placement Readiness', query: 'What are my top focus areas to qualify for Tier-1 campus hiring drives?' },
    { label: 'Simulate SGPA', query: 'Can I achieve 8.5+ SGPA this semester based on current test trends?' },
  ];

  // Bot Answer Generator
  const generateBotReply = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('attendance') || q.includes('71') || q.includes('network')) {
      return `Based on your attendance log, you missed 3 lectures on Oct 7. Currently at 71.4% (35/49 classes). Attending the next 4 consecutive lectures on Thursday and Friday will bring your average to 75.8%, fully restoring safe exam standing.`;
    }
    if (q.includes('ml') || q.includes('machine learning') || q.includes('test') || q.includes('95')) {
      return `Outstanding achievement! Scoring 19/20 (95%) elevated your continuous evaluation to 78%. Your projected course grade shifted from B to B+, contributing +0.4 points to your overall Semester 5 SGPA projection!`;
    }
    if (q.includes('placement') || q.includes('hiring') || q.includes('tier-1') || q.includes('cutoff')) {
      return `Your CGPA is 7.82 (Top 15%), which comfortably passes the 7.0 threshold for Tier-1 companies. However, your coding assessment average is 58/100. Practice dynamic programming and SQL mock tests in the Intervention Centre to breach the 70+ cutoff.`;
    }
    if (q.includes('sgpa') || q.includes('gpa') || q.includes('trend')) {
      return `With current internal scores averaging 76% and zero active backlogs, maintaining an 80%+ score on upcoming lab practicals projects your Semester 5 SGPA at 8.15 to 8.35. Keep assignment completion at 100%!`;
    }
    return `Analysis completed for: "${query}". Your overall institutional standing is Tier-1 (Success Score ${student.success_score}/100). All core metrics remain in good standing, with continuous mentoring available under the Intervention hub.`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const msg = (textToSend || inputMessage).trim();
    if (!msg) return;

    // 1. User message
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatHistory(prev => [...prev, { sender: 'user', text: msg, time: now }]);
    setInputMessage('');

    // 2. Set bot state: listening -> thinking -> speaking -> idle
    setBotState('listening');

    setTimeout(() => {
      setBotState('thinking');
      setIsTyping(true);

      setTimeout(() => {
        const reply = generateBotReply(msg);
        setBotState('speaking');
        setIsTyping(false);
        setChatHistory(prev => [
          ...prev,
          {
            sender: 'bot',
            text: reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);

        // Finish speaking after cadence
        const speechDuration = Math.min(Math.max(reply.length * 35, 2000), 4500);
        setTimeout(() => {
          setBotState('idle');
        }, speechDuration);
      }, 950);
    }, 450);
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b1220]/95 via-[#0f1a2e]/90 to-[#142038]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(37,99,235,0.15)] flex flex-col justify-between p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_25px_60px_rgba(37,99,235,0.22)]"
    >
      {/* Background Soft Blue/Cyan Ambient Glow Orbs */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600/40 via-cyan-500/20 to-transparent border border-blue-500/30 flex items-center justify-center text-cyan-300 shadow-lg">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white tracking-tight">Elara AI</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                3D Interactive Companion
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Real-time WebGL Academic & Career Copilot</p>
          </div>
        </div>

        {/* State Badge & Sound Toggle */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
              botState === 'thinking'
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-300 animate-pulse'
                : botState === 'speaking'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : botState === 'listening'
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-white/5 border-white/10 text-slate-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                botState === 'thinking'
                  ? 'bg-blue-400 animate-ping'
                  : botState === 'speaking'
                  ? 'bg-emerald-400 animate-pulse'
                  : botState === 'listening'
                  ? 'bg-cyan-400 animate-ping'
                  : 'bg-cyan-400'
              }`}
            />
            <span className="capitalize">{botState}</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
            title={soundEnabled ? 'Mute AI feedback' : 'Unmute AI feedback'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
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
                    <ambientLight intensity={0.7} />
                    {/* Blue Key Light */}
                    <pointLight position={[-3, 3, 3]} intensity={2.8} color="#2563eb" />
                    {/* Cyan Rim Light */}
                    <pointLight position={[3, -1, -2]} intensity={3.5} color="#06b6d4" />
                    {/* Front Fill Light */}
                    <directionalLight position={[0, 2, 4]} intensity={1.2} color="#ffffff" />

                    <BotModel botState={botState} reducedMotion={reducedMotion} />
                  </Canvas>
                )}
              </Suspense>
            </div>
          ) : (
            <FallbackBotVisual botState={botState} />
          )}

          {/* Micro status caption */}
          <div className="text-[10px] text-slate-400/80 flex items-center gap-1.5 mt-1 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Pointer-tracking neural avatar · Procedural WebGL</span>
          </div>
        </div>

        {/* Right Column: Conversational Glass Stream (md:col-span-7) */}
        <div className="md:col-span-7 flex flex-col justify-between h-full space-y-3">
          {/* Messages Scroll Area */}
          <div className="space-y-2.5 max-h-[200px] sm:max-h-[220px] overflow-y-auto scrollbar-thin pr-1">
            {chatHistory.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} transition-all`}
              >
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[92%] shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none border border-blue-400/30'
                      : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none backdrop-blur-md'
                  }`}
                >
                  <p className="text-xs leading-relaxed">{m.text}</p>
                </div>
                <span className="text-[9.5px] text-slate-500 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10 w-fit backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                <span className="text-[10px] text-slate-400 ml-1 font-medium">Elara is analyzing cohort telemetry...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Instant Prescriptions:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => handleSendMessage(s.query)}
                  className="text-[11px] px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 transition-all font-medium active:scale-95 text-left"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Input Bar ────────────────────────────────────────────────── */}
      <div className="relative z-10 pt-3 border-t border-white/10 mt-2 flex items-center gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Ask Elara about your attendance risk, grades, or career trajectory..."
          className="flex-1 px-4 py-2.5 text-xs bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/30 transition-all backdrop-blur-md"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-900/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default OrbBot3D;
