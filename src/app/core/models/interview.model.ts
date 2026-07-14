import type { AppIconDefinition } from '../../shared/ui/icon/icon';

export type InterviewStatus = 'Completed' | 'In Progress';
export type InterviewType = 'AI-Voice' | 'Text-based';
export type InterviewScoreLevel = 'high' | 'medium' | 'low' | 'na';

export interface InterviewStat {
  label: string;
  value: string;
  icon: AppIconDefinition;
  tone: 'purple' | 'rose' | 'blue' | 'amber';
}

export interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidateInitials: string;
  candidateColor: string;
  domain: string;
  role: string;
  type: InterviewType;
  score: number | null;
  scoreLevel: InterviewScoreLevel;
  duration: string;
  status: InterviewStatus;
}
