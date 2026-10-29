import React, { useState } from 'react';
import {
  FileText, Download, X, Printer, ZoomIn, ZoomOut, RotateCcw,
  Sparkles, CheckCircle2, ShieldCheck, BookOpen, User, Calendar
} from 'lucide-react';
import { CourseResource, downloadResourceFile } from '../../data/courseResources';
import { useTheme } from '../../context/ThemeContext';

interface ResourceViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: CourseResource | null;
  onAskAI?: (prompt: string) => void;
}

export const ResourceViewerModal: React.FC<ResourceViewerModalProps> = ({
  isOpen,
  onClose,
  resource,
  onAskAI,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!isOpen || !resource) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadResourceFile(resource);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-[#0f172a] border-white/15 text-slate-100 shadow-cyan-950/40'
            : 'bg-white border-slate-300 text-slate-900 shadow-xl'
        }`}
      >
        {/* Top Control Bar / Toolbar */}
        <div
          className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
            isDark ? 'bg-slate-900/90 border-white/10' : 'bg-slate-50 border-slate-200'
          }`}
        >
          {/* Left: Document Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-500 border border-red-500/30 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold truncate text-theme-text" title={resource.title}>
                  {resource.title}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 uppercase tracking-wider shrink-0">
                  {resource.fileType || (resource as any).fileFormat || 'PDF'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shrink-0">
                  {resource.category}
                </span>
              </div>
              <p className="text-xs text-theme-muted truncate mt-0.5">
                {resource.subjectName} ({resource.subjectCode}) · Uploaded by {resource.uploadedBy} · {resource.fileSize}
              </p>
            </div>
          </div>

          {/* Right: Actions & Zoom */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-xl bg-theme-surface border border-theme-border text-xs">
              <button
                onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
                className="p-1 text-theme-muted hover:text-theme-text rounded transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] px-1 font-bold text-theme-muted min-w-[36px] text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
                className="p-1 text-theme-muted hover:text-theme-text rounded transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-1 text-theme-muted hover:text-theme-text rounded transition ml-0.5"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Direct Download Button */}
            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-xl text-xs font-bold btn-primary flex items-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-theme-surface hover:bg-theme-elevated border border-theme-border text-theme-muted hover:text-theme-text transition"
              title="Close Viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Content View Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-900/40 flex justify-center scrollbar-thin">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className={`w-full max-w-3xl p-6 sm:p-10 rounded-2xl shadow-xl border space-y-6 transition-transform duration-200 ${
              isDark
                ? 'bg-[#1e293b] border-white/10 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Document Header Page Badge */}
            <div className="border-b border-theme-border pb-5 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-theme-muted">
                <span className="font-bold tracking-wider uppercase text-cyan-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  CampusIQ Verified Academic Resource
                </span>
                <span className="font-mono">{resource.uploadedDate}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-theme-text tracking-tight leading-snug">
                {resource.title}
              </h1>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-border">
                  <span className="text-[10px] text-theme-muted uppercase font-bold block">Course</span>
                  <span className="font-bold text-theme-text">{resource.subjectCode}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-border">
                  <span className="text-[10px] text-theme-muted uppercase font-bold block">Faculty</span>
                  <span className="font-bold text-theme-text truncate block">{resource.uploadedBy}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-border">
                  <span className="text-[10px] text-theme-muted uppercase font-bold block">Units</span>
                  <span className="font-bold text-theme-text">{Array.isArray(resource.unitsCovered) ? resource.unitsCovered.join(', ') : (resource.unitsCovered || 'All Units')}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-border">
                  <span className="text-[10px] text-theme-muted uppercase font-bold block">Priority</span>
                  <span className="font-bold text-emerald-400">{resource.examImportance}</span>
                </div>
              </div>
            </div>

            {/* Syllabus Topics */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-theme-muted flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Core Topics & Derivations Included</span>
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {(resource.keyTopics || []).map((topic, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-theme-surface border border-theme-border text-xs flex items-center gap-2.5 text-theme-text"
                  >
                    <span className="w-5 h-5 rounded-md bg-cyan-500/15 text-cyan-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-medium">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Body / High-Yield Summary */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-theme-muted flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Executive Study Guide & University Exam Solutions</span>
              </h4>
              <div className="p-4 sm:p-5 rounded-xl bg-theme-surface/70 border border-theme-border text-xs leading-relaxed whitespace-pre-wrap font-sans text-theme-text">
                {resource.contentPreview}
              </div>
            </div>

            {/* AI Action Box */}
            {onAskAI && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-transparent border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-theme-text">Want Elara AI to Quiz You on This PDF?</h5>
                    <p className="text-[11px] text-theme-muted">
                      Elara can generate 5 sample university exam questions from this document.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onAskAI(`Quiz me on the core exam questions from ${resource.title}`);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 text-white hover:bg-cyan-600 transition shadow-sm shrink-0"
                >
                  Generate AI Quiz
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer info bar */}
        <div
          className={`p-3 px-5 border-t text-xs flex items-center justify-between ${
            isDark ? 'bg-slate-900 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Document verified by Course Instructor · 100% End-Sem Syllabus Compliant</span>
          </span>
          <button onClick={handleDownload} className="text-theme-accent hover:underline font-bold">
            Download File ({resource.fileSize})
          </button>
        </div>
      </div>
    </div>
  );
};
