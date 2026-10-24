import React, { useState, useEffect, useCallback } from 'react';
import {
  Newspaper,
  ArrowRight,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Clock,
  CheckCheck,
} from 'lucide-react';
import { NewsItem, NewsCategory, NewsPriority } from '../../types/news';
import { NewsApiService, formatRelativeTime } from '../../services/newsApi';
import { useStudentRecord } from '../../context/CurrentUserContext';

interface CampusNewsCardProps {
  onNavigate?: (page: any) => void;
  onOpenNewsDetail?: (news: NewsItem) => void;
}

const CATEGORY_STYLES: Record<NewsCategory, string> = {
  Hackathon: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  Exam: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Placement: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Event: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Holiday: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  Fees: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Notice: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Scholarship: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
};

const PRIORITY_BADGES: Record<NewsPriority, { label: string; style: string } | null> = {
  Urgent: {
    label: 'Urgent',
    style: 'bg-red-500/15 text-red-400 border-red-500/30',
  },
  Important: {
    label: 'Important',
    style: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  Normal: null,
};

export const CampusNewsCard: React.FC<CampusNewsCardProps> = ({
  onNavigate,
  onOpenNewsDetail,
}) => {
  const student = useStudentRecord();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const studentId = student.id || student.roll_no;
      const deptCode = student.department?.toLowerCase().includes('comp') ? 'CSE' : student.department;
      const year = typeof student.academic_year === 'string' && student.academic_year.includes('3') ? 3 : 1;

      const res = await NewsApiService.getStudentNews({
        studentId,
        branch: deptCode,
        year,
        limit: 5,
      });

      setNewsList(res.items.slice(0, 5));
      setUnreadCount(res.unreadCount);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [student]);

  useEffect(() => {
    fetchNews();

    // Fallback polling every 30 seconds as specified in requirements
    const timer = setInterval(() => {
      fetchNews();
    }, 30000);

    return () => clearInterval(timer);
  }, [fetchNews]);

  const handleItemClick = (item: NewsItem) => {
    if (!item.isRead) {
      NewsApiService.markAsRead(item.id);
      setNewsList(prev =>
        prev.map(n => (n.id === item.id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    if (onOpenNewsDetail) {
      onOpenNewsDetail(item);
    } else if (onNavigate) {
      onNavigate('news');
    }
  };

  return (
    <div
      style={{ animationDelay: '300ms' }}
      className="col-span-12 lg:col-span-4 bento-card p-5 sm:p-6 bg-theme-surface/80 dark:bg-slate-900/60 backdrop-blur-xl border border-theme-border/80 dark:border-white/10 rounded-[22px] flex flex-col justify-between animate-bento-in relative overflow-hidden shadow-2xl"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div>
        <div className="flex items-center justify-between border-b border-theme-border/60 dark:border-white/10 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-theme-text tracking-tight">
                  Campus News
                </h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[10px] text-theme-muted mt-0.5">
                Personalised announcements & alerts
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate?.('news')}
            className="group flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-cyan-300 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Content Body: Loading skeleton */}
        {isLoading && newsList.length === 0 && (
          <div className="space-y-3 py-1">
            {[1, 2, 3, 4].map(idx => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-theme-secondary/40 border border-theme-border/50 animate-pulse space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="w-16 h-4 bg-slate-300 dark:bg-slate-800 rounded-md" />
                  <div className="w-12 h-3 bg-slate-300 dark:bg-slate-800 rounded-md" />
                </div>
                <div className="w-3/4 h-3.5 bg-slate-300 dark:bg-slate-800 rounded-md" />
                <div className="w-full h-2.5 bg-slate-300 dark:bg-slate-800 rounded-md" />
              </div>
            ))}
          </div>
        )}

        {/* Content Body: Error State with Retry */}
        {isError && newsList.length === 0 && (
          <div className="py-8 text-center space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-theme-text">Unable to load news feed</p>
              <p className="text-[11px] text-theme-muted mt-0.5">Please check your connection and retry</p>
            </div>
            <button
              onClick={fetchNews}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-theme-secondary hover:bg-theme-secondary/80 text-theme-text border border-theme-border transition-all"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Content Body: Empty State */}
        {!isLoading && !isError && newsList.length === 0 && (
          <div className="py-10 text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center">
              <CheckCheck className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-theme-text">No news right now</p>
            <p className="text-[11px] text-theme-muted max-w-[200px] mx-auto">
              You are all caught up with your academic updates and notices.
            </p>
          </div>
        )}

        {/* Content Body: News Item List */}
        {!isLoading && newsList.length > 0 && (
          <div className="space-y-2.5">
            {newsList.map(item => {
              const priorityInfo = PRIORITY_BADGES[item.priority];
              const isSelected = item.selectedForYou;

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`group relative p-2.5 rounded-xl border transition-all cursor-pointer ${
                    !item.isRead
                      ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/25 hover:border-blue-400/50 shadow-sm'
                      : 'bg-theme-secondary/40 border-theme-border/60 dark:border-white/5 hover:border-theme-border'
                  }`}
                >
                  {/* Top line: Category chip, relative time, badges, unread dot */}
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Unread dot */}
                      {!item.isRead && (
                        <span
                          className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse flex-shrink-0"
                          title="Unread"
                        />
                      )}

                      {/* Category Chip */}
                      <span
                        className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                          CATEGORY_STYLES[item.category] || 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                        }`}
                      >
                        {item.category}
                      </span>

                      {/* Priority badge if Urgent or Important */}
                      {priorityInfo && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${priorityInfo.style}`}
                        >
                          {priorityInfo.label}
                        </span>
                      )}

                      {/* Selected for you badge */}
                      {isSelected && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Selected for you</span>
                        </span>
                      )}
                    </div>

                    {/* Relative Time */}
                    <span className="text-[10px] text-theme-muted font-medium flex items-center gap-1 flex-shrink-0">
                      <Clock className="w-2.5 h-2.5" />
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-xs font-bold text-theme-text group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {item.title}
                  </h4>

                  {/* One-line summary */}
                  <p className="text-[10.5px] text-theme-muted mt-0.5 line-clamp-1 leading-snug">
                    {item.summary || item.body}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="mt-3 pt-2.5 border-t border-theme-border/60 dark:border-white/10 flex items-center justify-between text-[11px]">
        <span className="text-theme-muted flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Live feed active
        </span>
        <button
          onClick={() => onNavigate?.('news')}
          className="text-theme-muted hover:text-theme-text font-semibold transition-colors"
        >
          Explore All Announcements &rarr;
        </button>
      </div>
    </div>
  );
};
