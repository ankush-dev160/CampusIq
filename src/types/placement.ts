export type PlacementTrackId =
  | 'dsa'
  | 'database-sql'
  | 'web-dev'
  | 'cyber-security'
  | 'ai-ml'
  | 'cloud-devops'
  | 'embedded-iot'
  | 'vlsi-digital'
  | 'comm-systems'
  | 'core-mech'
  | 'cad-cam-robotics'
  | 'civil-structures'
  | 'aptitude';

export type ReadinessLevel = 'Beginner' | 'Intermediate' | 'Job-ready';

export interface PlacementTrack {
  id: PlacementTrackId | string;
  name: string;
  shortName: string;
  branches: string[];
  icon: string;
  description: string;
  topics: string[];
  isSuggested?: boolean;
}

export interface SanitizedQuestion {
  id: string;
  track: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  isSample: boolean;
}

export interface QuestionReviewItem {
  id: string;
  question: string;
  options: string[];
  studentAnswer: number | null;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
  topic: string;
  difficulty: string;
}

export interface TopicAccuracy {
  topic: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface TestResult {
  attemptId: string;
  track: string;
  mode: 'quick' | 'standard';
  score: number;
  total: number;
  percentage: number;
  level: ReadinessLevel;
  timeSpentSeconds: number;
  topicBreakdown: TopicAccuracy[];
  strengths: string[];
  weakTopics: string[];
  whatToPractiseNext: string[];
  review: QuestionReviewItem[];
}

export interface ActiveTest {
  attemptId: string;
  track: string;
  mode: 'quick' | 'standard';
  totalQuestions: number;
  timeLimitMinutes: number;
  timeLimitSeconds: number;
  startedAt: string;
  questions: SanitizedQuestion[];
}

export interface BestTrackScore {
  bestScore: number;
  total: number;
  percentage: number;
  level: ReadinessLevel | string;
  submittedAt: string;
  trackName: string;
}

export interface TrackTrendPoint {
  date: string;
  percentage: number;
  score: number;
}

export interface StudentAttemptHistoryItem {
  attemptId: string;
  track: string;
  trackName: string;
  mode: 'quick' | 'standard';
  score: number;
  total: number;
  percentage: number;
  level: ReadinessLevel;
  startedAt: string;
  submittedAt?: string;
  timeSpentSeconds?: number;
  topicBreakdown?: TopicAccuracy[];
  strengths?: string[];
  weakTopics?: string[];
}

export interface StudentAttemptsSummary {
  studentId: string;
  totalAttempts: number;
  latestAttempt: StudentAttemptHistoryItem | null;
  overallReadinessScore: number | null;
  overallLevel: ReadinessLevel | string;
  bestScorePerTrack: Record<string, BestTrackScore>;
  trackTrends: Record<string, TrackTrendPoint[]>;
  attempts: StudentAttemptHistoryItem[];
}

export interface PlacementAdminAnalytics {
  totalAttempts: number;
  uniqueStudentsTested: number;
  totalStudents: number;
  overallAveragePercentage: number;
  jobReadyRate: number;
  trackAverages: {
    trackId: string;
    trackName: string;
    attemptCount: number;
    averagePercentage: number | null;
  }[];
  branchAverages: {
    branch: string;
    attemptCount: number;
    averagePercentage: number | null;
  }[];
  studentsWithNoAttemptsCount: number;
  studentsWithNoAttempts: {
    id: string;
    rollNo: string;
    name: string;
    email: string;
    branch: string;
    year: number;
    cgpa: number | null;
  }[];
  recentAttempts: any[];
}
