import React, { useState } from 'react';
import { useCampusData } from '../../context/CampusDataContext';
import { queryCampusAnalyst, AnalystResponse } from '../../engine/aiCampusAnalyst';
import { Modal } from '../common/Modal';
import { Sparkles, Send, HelpCircle, ArrowRight, ShieldCheck, Database } from 'lucide-react';
import { NavigationPage } from '../layout/Sidebar';

interface CampusAnalystModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: NavigationPage) => void;
}

const PRESET_QUERIES = [
  'How many students need academic support?',
  'Which department has the highest proportion of academic risk flags?',
  'How many students have strong academics but low placement readiness?',
  'What are the most common reasons for placement risk?',
  'Which students have incomplete placement assessments?',
];

export const CampusAnalystModal: React.FC<CampusAnalystModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { filteredStudents, setSelectedStudent } = useCampusData();

  const [inputQuery, setInputQuery] = useState('');
  const [history, setHistory] = useState<AnalystResponse[]>([
    queryCampusAnalyst('How many students need academic support?', filteredStudents),
  ]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const response = queryCampusAnalyst(q, filteredStudents);
    setHistory(prev => [response, ...prev]);
    setInputQuery('');
  };

  const handleStudentClick = (studentId: string) => {
    const found = filteredStudents.find(s => s.student_id === studentId);
    if (found) {
      setSelectedStudent(found);
      onClose();
    }
  };

  const handleNavigatePage = (target?: string) => {
    if (target && onNavigate) {
      onNavigate(target as NavigationPage);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Campus Analyst"
      subtitle="Deterministic, privacy-preserving institutional intelligence engine."
      maxWidth="4xl"
    >
      <div className="space-y-4">
        {/* Privacy & Deterministic Guarantee */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-theme-accent/10 border border-theme-accent/30 text-xs text-theme-text">
          <ShieldCheck className="w-4 h-4 text-theme-accent shrink-0" />
          <span>
            <strong>Local Deterministic Calculation:</strong> Calculations execute locally over your authenticated cohort ({filteredStudents.length} students). Zero private student data is transmitted externally.
          </span>
        </div>

        {/* Query Input Box */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Ask an analytical question about risk, departments, or cohorts..."
              className="flex-1 px-3.5 py-2 text-xs bg-theme-secondary border border-theme-border rounded-xl text-theme-text placeholder-theme-muted focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent/30"
            />
            <button
              onClick={() => handleSend()}
              className="btn-primary px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Analyze</span>
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-theme-muted flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-theme-accent" /> Presets:
            </span>
            {PRESET_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(preset)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-theme-secondary text-theme-muted hover:bg-theme-elevated hover:text-theme-text border border-theme-border transition"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Responses Stream */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {history.map((resp, i) => (
            <div key={i} className="panel p-4 rounded-xl border border-theme-border space-y-3">
              {/* Question badge */}
              <div className="flex items-center justify-between text-xs text-theme-muted border-b border-theme-border pb-2">
                <span className="font-medium text-theme-text italic">"{resp.query}"</span>
                <span className="text-[10px] font-mono text-theme-muted">Calculated locally</span>
              </div>

              {/* Title & Summary */}
              <div>
                <h4 className="text-sm font-bold text-theme-text">{resp.answerTitle}</h4>
                <p className="text-xs text-theme-muted mt-1 leading-relaxed">{resp.answerSummary}</p>
              </div>

              {/* Metric Cards Grid */}
              {resp.metrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {resp.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="panel-raised p-2.5 rounded-lg border border-theme-border">
                      <div className="text-[10px] font-semibold text-theme-muted truncate">{m.label}</div>
                      <div className="text-base font-extrabold text-theme-text mt-0.5">{m.value}</div>
                      {m.sublabel && <div className="text-[10px] text-theme-accent font-medium">{m.sublabel}</div>}
                    </div>
                  ))}
                </div>
              )}

              {/* Detailed Breakdown */}
              <div className="space-y-1 bg-theme-secondary/50 p-3 rounded-lg border border-theme-border text-xs text-theme-muted">
                <div className="font-semibold text-theme-text text-[11px] mb-1">Underlying Conditions & Telemetry:</div>
                {resp.detailedBreakdown.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-start gap-1.5 text-[11px]">
                    <span className="text-theme-accent font-bold">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Related Student Links if present */}
              {resp.relatedStudentIds && resp.relatedStudentIds.length > 0 && (
                <div className="pt-1">
                  <span className="text-[11px] font-semibold text-theme-muted block mb-1">
                    Direct Cohort Links:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {resp.relatedStudentIds.map(sId => (
                      <button
                        key={sId}
                        onClick={() => handleStudentClick(sId)}
                        className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-theme-accent/15 text-theme-accent border border-theme-accent/30 hover:bg-theme-accent/25 transition"
                      >
                        {sId}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Action & Navigation Link */}
              <div className="flex items-center justify-between pt-2 border-t border-theme-border text-xs">
                <span className="text-theme-muted font-medium">{resp.suggestedAction}</span>
                {resp.targetPage && (
                  <button
                    onClick={() => handleNavigatePage(resp.targetPage)}
                    className="flex items-center gap-1 text-theme-accent hover:underline font-bold ml-2"
                  >
                    <span>View Section</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
