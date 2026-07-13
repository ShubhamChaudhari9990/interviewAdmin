import { AppIcons } from '../ui/icon/icon';
import { Interview, InterviewStat } from '../../core/models/interview.model';

export const INTERVIEW_SUMMARY = {
  pendingReviews: 158,
  totalThisMonth: 1240,
};

export const INTERVIEW_STATS: InterviewStat[] = [
  { label: 'Avg. Duration', value: '24m', icon: AppIcons.timer, tone: 'purple' },
  { label: 'Avg. Score', value: '82%', icon: AppIcons.trendingUp, tone: 'rose' },
  { label: 'Completed', value: '940', icon: AppIcons.completed, tone: 'blue' },
  { label: 'Live Now', value: '12', icon: AppIcons.liveNow, tone: 'amber' },
];

export const MOCK_INTERVIEWS: Interview[] = [
  {
    id: '#INT-9402',
    candidateName: 'John Doe',
    candidateEmail: 'john.d@example.com',
    candidateInitials: 'JD',
    candidateColor: '#dbeafe',
    domain: 'IT',
    role: 'Frontend Engineer',
    type: 'AI-Voice',
    score: 88,
    scoreLevel: 'high',
    duration: '22m 14s',
    status: 'Completed',
  },
  {
    id: '#INT-9403',
    candidateName: 'Sarah Miller',
    candidateEmail: 'sarah.m@design.io',
    candidateInitials: 'SM',
    candidateColor: '#ede9fe',
    domain: 'Design',
    role: 'UI/UX Designer',
    type: 'Text-based',
    score: 62,
    scoreLevel: 'medium',
    duration: '18m 05s',
    status: 'Completed',
  },
  {
    id: '#INT-9405',
    candidateName: 'Marcus Chen',
    candidateEmail: 'm.chen@data.ai',
    candidateInitials: 'MC',
    candidateColor: '#ffedd5',
    domain: 'Data Sci',
    role: 'Python Developer',
    type: 'AI-Voice',
    score: 41,
    scoreLevel: 'low',
    duration: '31m 45s',
    status: 'Completed',
  },
  {
    id: '#INT-9408',
    candidateName: 'Elena Rossi',
    candidateEmail: 'elena.r@product.co',
    candidateInitials: 'ER',
    candidateColor: '#dcfce7',
    domain: 'Product',
    role: 'Manager',
    type: 'Text-based',
    score: null,
    scoreLevel: 'na',
    duration: '04m 12s',
    status: 'In Progress',
  },
];
