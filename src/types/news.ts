export type NewsCategory =
  | 'Hackathon'
  | 'Exam'
  | 'Placement'
  | 'Event'
  | 'Holiday'
  | 'Fees'
  | 'Notice'
  | 'Scholarship';

export type NewsPriority = 'Normal' | 'Important' | 'Urgent';

export type AudienceType =
  | 'all'
  | 'branch'
  | 'year'
  | 'division'
  | 'subject'
  | 'selected';

export interface NewsAudience {
  type: AudienceType;
  branches?: string[];
  years?: number[];
  divisions?: string[];
  subjectCodes?: string[];
  studentIds?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  body: string;
  summary?: string;
  category: NewsCategory;
  priority: NewsPriority;
  createdBy: {
    id: string;
    name: string;
    role: string;
    department?: string;
  };
  createdAt: string;
  expiresAt?: string;
  eventDate?: string;
  venue?: string;
  registrationLink?: string;
  attachmentLink?: string;
  audience: NewsAudience;
  selectedForYou?: boolean;
  isRead?: boolean;
  readAt?: string;
}

export interface NewsManageStats {
  reachCount: number;
  readCount: number;
}
