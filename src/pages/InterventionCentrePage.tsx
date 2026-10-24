import React, { useState } from 'react';
import { useCampusData } from '../context/CampusDataContext';
import { InterventionItem, InterventionStatus } from '../types/intervention';
import { Badge } from '../components/common/Badge';
import { CreateInterventionModal } from '../components/intervention/CreateInterventionModal';
import {
  LifeBuoy,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  User,
  MessageSquare,
  Search,
  Filter,
} from 'lucide-react';

export const InterventionCentrePage: React.FC = () => {
  const { interventions, updateInterventionStatus, setSelectedStudent, students } = useCampusData();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<InterventionStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  // Statistics
  const totalCount = interventions.length;
  const completedCount = interventions.filter(i => i.status === 'Completed').length;
  const inProgressCount = interventions.filter(i => i.status === 'In Progress').length;
  const plannedCount = interventions.filter(i => i.status === 'Planned').length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered interventions
  const filteredList = interventions.filter(item => {
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchName = item.student_name.toLowerCase().includes(q);
      const matchId = item.student_id.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchFaculty = item.faculty_assigned.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchCat && !matchFaculty) return false;
    }
    return true;
  });

  const handleAddNote = (id: string) => {
    if (!newNoteText.trim()) return;
    updateInterventionStatus(id, 'In Progress', newNoteText.trim());
    setNewNoteText('');
  };

  return (
    <div className="space-y-6">
      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-5 rounded-2xl bg-theme-surface border border-theme-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
              Total Interventions
            </span>
            <div className="text-2xl font-extrabold text-theme-text mt-1">{totalCount}</div>
            <span className="text-xs text-theme-muted">Institutional action plans</span>
          </div>
          <div className="p-3 rounded-xl bg-theme-accent-muted text-theme-accent border border-theme-accent-border">
            <LifeBuoy className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-theme-surface border border-theme-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
              In Progress
            </span>
            <div className="text-2xl font-extrabold text-blue-500 mt-1">{inProgressCount}</div>
            <span className="text-xs text-theme-muted">Active mentor sessions</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-theme-surface border border-theme-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
              Completed
            </span>
            <div className="text-2xl font-extrabold text-emerald-500 mt-1">{completedCount}</div>
            <span className="text-xs text-theme-muted">{completionRate}% resolution rate</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-theme-surface border border-theme-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
              Planned / Backlog
            </span>
            <div className="text-2xl font-extrabold text-theme-text mt-1">{plannedCount}</div>
            <span className="text-xs text-theme-muted">Pending initial intake</span>
          </div>
          <div className="p-3 rounded-xl bg-theme-elevated text-theme-muted border border-theme-border">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Create Button Header */}
      <div className="bg-theme-surface p-4 rounded-2xl border border-theme-border shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by student, mentor, or category..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-theme-elevated border border-theme-border rounded-xl text-theme-text placeholder:text-theme-subtle focus:outline-none focus:border-theme-accent"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto">
          {(['All', 'In Progress', 'Planned', 'Completed', 'Follow-up Needed'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all duration-150 whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-theme-accent text-theme-accent-text font-bold shadow-sm'
                  : 'bg-theme-elevated text-theme-muted hover:text-theme-text hover:bg-theme-secondary border border-theme-border'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Create Intervention Button */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3.5 py-1.5 btn-primary text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Intervention</span>
        </button>
      </div>

      {/* Interventions List */}
      <div className="space-y-3.5">
        {filteredList.map(item => {
          const isExpanded = expandedId === item.id;
          const targetStudent = students.find(s => s.student_id === item.student_id);

          return (
            <div
              key={item.id}
              className="bg-theme-surface rounded-2xl border border-theme-border p-5 shadow-sm hover:border-theme-accent-border/50 transition-all duration-200 space-y-3"
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-theme-accent bg-theme-accent-muted border border-theme-accent-border px-2.5 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <Badge label={item.status} variant="status" size="sm" />
                  </div>
                  <h4 className="text-sm font-bold text-theme-text mt-2">{item.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-theme-muted mt-1">
                    <button
                      onClick={() => targetStudent && setSelectedStudent(targetStudent)}
                      className="font-bold text-theme-accent hover:underline flex items-center gap-1"
                    >
                      {item.student_name} ({item.student_id})
                    </button>
                    <span>• {item.department}</span>
                    <span>• Assigned to: <strong className="text-theme-text">{item.faculty_assigned}</strong></span>
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-2">
                  <select
                    value={item.status}
                    onChange={e => updateInterventionStatus(item.id, e.target.value as InterventionStatus)}
                    className="text-xs bg-theme-elevated border border-theme-border rounded-xl px-2.5 py-1 text-theme-text font-semibold focus:outline-none focus:border-theme-accent"
                  >
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Follow-up Needed">Follow-up Needed</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-theme-muted leading-relaxed bg-theme-elevated p-3.5 rounded-xl border border-theme-border">
                {item.description}
              </p>

              {/* Milestones & Note Accordion */}
              <div className="flex items-center justify-between text-xs text-theme-muted pt-1">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-theme-muted" />
                    Target: <strong className="text-theme-text">{item.target_date}</strong>
                  </span>
                  <span>Logged: {item.created_at}</span>
                </div>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="text-theme-accent font-semibold flex items-center gap-1 hover:underline"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{item.notes.length} Progress Notes</span>
                </button>
              </div>

              {/* Expanded Notes Section */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-theme-border space-y-3">
                  <h5 className="text-xs font-bold text-theme-text">Faculty Log & Progress Audit</h5>

                  {item.notes.length > 0 ? (
                    <div className="space-y-2">
                      {item.notes.map(note => (
                        <div key={note.id} className="p-3 rounded-xl bg-theme-elevated border border-theme-border text-xs">
                          <div className="flex justify-between font-semibold text-theme-text mb-1">
                            <span>{note.author}</span>
                            <span className="text-[10px] text-theme-muted">{note.created_at}</span>
                          </div>
                          <p className="text-theme-muted">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-theme-subtle italic">No follow-up notes logged yet.</p>
                  )}

                  {/* Add note input */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={e => setNewNoteText(e.target.value)}
                      placeholder="Add follow-up faculty note..."
                      className="flex-1 px-3 py-1.5 text-xs bg-theme-elevated border border-theme-border rounded-xl text-theme-text placeholder:text-theme-subtle focus:outline-none focus:border-theme-accent"
                    />
                    <button
                      onClick={() => handleAddNote(item.id)}
                      className="px-3 py-1.5 text-xs font-bold btn-primary rounded-xl transition shadow-sm"
                    >
                      Post Note
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredList.length === 0 && (
          <div className="bg-theme-surface rounded-2xl border border-theme-border p-8 text-center text-xs text-theme-muted">
            No interventions found matching current search or status filter.
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateInterventionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
