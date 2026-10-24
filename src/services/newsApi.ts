import { NewsItem, NewsCategory, NewsAudience } from '../types/news';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Shared in-memory fallback store matching seed dataset
export const INITIAL_SAMPLE_NEWS: NewsItem[] = [
  {
    id: 'news-hack-01',
    title: 'Smart India Hackathon 2026: Team Finalist Selection',
    body: 'Congratulations! You have been selected to represent the department in the upcoming internal hackathon qualifier on 15th November. Please attend the briefing in Lab 3 at 4:00 PM.',
    summary: 'Selected for department hackathon qualifier round in Lab 3.',
    category: 'Hackathon',
    priority: 'Urgent',
    createdBy: {
      id: 'FAC-CSE-001',
      name: 'Dr. Priya Menon',
      role: 'faculty',
      department: 'CSE',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    eventDate: '2026-11-15',
    venue: 'Computing Lab 3, Innovation Block',
    registrationLink: 'https://sih.gov.in',
    audience: {
      type: 'selected',
      studentIds: ['2026CSE001', '2026CSE002', 'CS21B021', 'EP-CS-021', '2023CSE001', '2023CSE002', '2023CSE003', '2023CSE004'],
    },
    selectedForYou: true,
    isRead: false,
  },
  {
    id: 'news-exam-02',
    title: 'Mid-Term Examination Timetable Released (Nov 2026)',
    body: 'The end-semester and mid-term consolidated schedule has been published on the student portal. Review dates for conflicting lab sessions before Friday.',
    summary: 'Consolidated mid-term schedule published on the university portal.',
    category: 'Exam',
    priority: 'Important',
    createdBy: {
      id: 'ADM-COE-01',
      name: 'Controller of Examinations',
      role: 'admin',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    attachmentLink: '/documents/midterm-schedule-nov2026.pdf',
    audience: {
      type: 'all',
    },
    selectedForYou: false,
    isRead: false,
  },
  {
    id: 'news-placement-03',
    title: 'Google & Microsoft Campus Drive 2026: CSE/IT Pre-Placement Talk',
    body: 'Pre-placement talk and registration portal for final & pre-final year students (Years 3 & 4) of CSE, IT, and AIML branches are now open.',
    summary: 'Joint campus placement drive registration open for 3rd & 4th year CSE/IT students.',
    category: 'Placement',
    priority: 'Urgent',
    createdBy: {
      id: 'ADM-TPO-01',
      name: 'Training & Placement Office',
      role: 'admin',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    eventDate: '2026-11-20',
    venue: 'Main University Auditorium',
    registrationLink: 'https://careers.edupulse.edu/drives/2026-tier1',
    audience: {
      type: 'branch',
      branches: ['CSE', 'IT', 'AIML'],
      years: [3, 4],
    },
    selectedForYou: false,
    isRead: false,
  },
  {
    id: 'news-holiday-04',
    title: 'Campus Holiday Notice: National Youth Day Observance',
    body: 'All academic instruction, lectures, and laboratory sessions will remain suspended on Monday, 3rd November in observance of National Youth Day.',
    summary: 'Instruction and laboratories suspended on Monday, 3rd November.',
    category: 'Holiday',
    priority: 'Normal',
    createdBy: {
      id: 'ADM-REG-01',
      name: 'Registrar Office',
      role: 'admin',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    audience: {
      type: 'all',
    },
    selectedForYou: false,
    isRead: true,
  },
  {
    id: 'news-fees-05',
    title: 'Odd Semester Tuition Fee Payment Deadline Extension',
    body: 'The treasury office has extended the final deadline for odd-semester tuition fees payment without penalty till November 10th.',
    summary: 'Tuition fee submission without penalty extended till Nov 10th.',
    category: 'Fees',
    priority: 'Important',
    createdBy: {
      id: 'ADM-FIN-01',
      name: 'Finance & Treasury Office',
      role: 'admin',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
    registrationLink: 'https://fees.edupulse.edu/pay',
    audience: {
      type: 'all',
    },
    selectedForYou: false,
    isRead: true,
  },
  {
    id: 'news-scholarship-06',
    title: 'Merit-cum-Means National Scholarship Portal 2026-27',
    body: 'Eligible students with CGPA >= 8.0 and family income criteria may submit verified income affidavits and marksheets to the student welfare cell.',
    summary: 'National merit scholarship application window open for CGPA >= 8.0.',
    category: 'Scholarship',
    priority: 'Normal',
    createdBy: {
      id: 'ADM-DSA-01',
      name: 'Dean of Student Affairs',
      role: 'admin',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    attachmentLink: '/documents/scholarship-guidelines-2026.pdf',
    audience: {
      type: 'all',
    },
    selectedForYou: false,
    isRead: false,
  },
];

// In-browser read tracking state
const readNewsStorageKey = 'edupulse_read_news_ids';
function getLocalReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(readNewsStorageKey);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}
function setLocalReadId(id: string) {
  try {
    const ids = getLocalReadIds();
    ids.add(id);
    localStorage.setItem(readNewsStorageKey, JSON.stringify(Array.from(ids)));
  } catch {}
}

export function formatRelativeTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 7) return `${diffDay}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

export const NewsApiService = {
  async getStudentNews(params?: {
    studentId?: string;
    branch?: string;
    year?: number;
    division?: string;
    category?: NewsCategory | 'All';
    unreadOnly?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ items: NewsItem[]; total: number; unreadCount: number }> {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('edupulse_token') : null;
    
    // Attempt backend fetch
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'All') query.set('category', params.category);
      if (params?.unreadOnly) query.set('unreadOnly', 'true');
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));

      const res = await fetch(`${API_BASE}/news?${query.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Backend unavailable or starting up, fall back to offline dataset
    }

    // Client-side fallback matching rules strictly
    const readIds = getLocalReadIds();
    const currentStudentId = params?.studentId || 'CS21B021';
    const currentBranch = params?.branch || 'CSE';
    const currentYear = params?.year || 3;
    const currentDivision = params?.division || 'A';

    const matched = INITIAL_SAMPLE_NEWS.filter(item => {
      // Check expiration
      if (item.expiresAt && new Date(item.expiresAt) < new Date()) {
        return false;
      }

      const aud = item.audience;
      let isTargeted = false;
      let personallySelected = false;

      if (aud.type === 'all') {
        isTargeted = true;
      } else if (aud.type === 'selected') {
        if (aud.studentIds?.includes(currentStudentId)) {
          isTargeted = true;
          personallySelected = true;
        }
      } else {
        const branchMatch = !aud.branches?.length || aud.branches.includes(currentBranch);
        const yearMatch = !aud.years?.length || aud.years.includes(currentYear);
        const divMatch = !aud.divisions?.length || aud.divisions.includes(currentDivision);
        const selectedMatch = aud.studentIds?.includes(currentStudentId);

        if (branchMatch && yearMatch && divMatch) {
          isTargeted = true;
        }
        if (selectedMatch) {
          isTargeted = true;
          personallySelected = true;
        }
      }

      if (!isTargeted) return false;

      // Category filter
      if (params?.category && params.category !== 'All' && item.category !== params.category) {
        return false;
      }

      const isRead = readIds.has(item.id) || !!item.isRead;
      if (params?.unreadOnly && isRead) {
        return false;
      }

      return true;
    }).map(item => {
      const isRead = readIds.has(item.id) || !!item.isRead;
      const isSelected = item.audience.type === 'selected' || item.audience.studentIds?.includes(currentStudentId);
      
      // Clean up sensitive studentIds array before returning
      const sanitizedAudience = { ...item.audience };
      delete sanitizedAudience.studentIds;

      return {
        ...item,
        isRead,
        selectedForYou: isSelected,
        audience: sanitizedAudience,
      };
    });

    const unreadCount = matched.filter(i => !i.isRead).length;
    return {
      items: matched,
      total: matched.length,
      unreadCount,
    };
  },

  async markAsRead(newsId: string): Promise<void> {
    setLocalReadId(newsId);
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('edupulse_token') : null;
    try {
      await fetch(`${API_BASE}/news/${newsId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch {
      // offline / stored locally
    }
  },

  async getUnreadCount(studentId?: string): Promise<number> {
    try {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('edupulse_token') : null;
      const res = await fetch(`${API_BASE}/news/unread-count`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        return data.unreadCount ?? 0;
      }
    } catch {}

    const res = await this.getStudentNews({ studentId, limit: 100 });
    return res.unreadCount;
  },

  async getFacultyManageNews(): Promise<NewsItem[]> {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('edupulse_token') : null;
    try {
      const res = await fetch(`${API_BASE}/news/manage`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        return data.items || [];
      }
    } catch {}
    return INITIAL_SAMPLE_NEWS;
  },

  async createNews(payload: Partial<NewsItem>): Promise<NewsItem> {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('edupulse_token') : null;
    try {
      const res = await fetch(`${API_BASE}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    // Fallback in-memory create
    const newItem: NewsItem = {
      id: `news-${Date.now()}`,
      title: payload.title || 'Announcement',
      body: payload.body || '',
      summary: payload.summary || payload.body?.slice(0, 100),
      category: payload.category || 'Notice',
      priority: payload.priority || 'Normal',
      createdBy: payload.createdBy || {
        id: 'FAC-CURRENT',
        name: 'Faculty Incharge',
        role: 'faculty',
      },
      createdAt: new Date().toISOString(),
      eventDate: payload.eventDate,
      venue: payload.venue,
      registrationLink: payload.registrationLink,
      attachmentLink: payload.attachmentLink,
      audience: payload.audience || { type: 'all' },
      isRead: false,
    };
    INITIAL_SAMPLE_NEWS.unshift(newItem);
    return newItem;
  },

  async deleteNews(id: string): Promise<void> {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('edupulse_token') : null;
    try {
      await fetch(`${API_BASE}/news/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch {}
    const idx = INITIAL_SAMPLE_NEWS.findIndex(i => i.id === id);
    if (idx !== -1) INITIAL_SAMPLE_NEWS.splice(idx, 1);
  },
};
