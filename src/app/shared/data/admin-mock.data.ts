import { AdminUser } from '../../core/models/user.model';
import { ActivityItem, KpiStat } from '../../core/models/dashboard.model';
import { AppIcons } from '../ui/icon/icon';

export const MOCK_USERS: AdminUser[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    email: 'alex.rivera@techcorp.com',
    avatar: 'https://i.pravatar.cc/80?u=alex',
    plan: 'Enterprise',
    status: 'Active',
    lastLogin: '2 hours ago',
    totalInterviews: 142,
    interviewCapacity: 150,
  },
  {
    id: '2',
    name: 'Sarah Connor',
    email: 'sarah.c@skynet.io',
    avatar: 'https://i.pravatar.cc/80?u=sarah',
    plan: 'Pro',
    status: 'Active',
    lastLogin: '5 mins ago',
    totalInterviews: 89,
    interviewCapacity: 120,
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'john.d@example.com',
    avatar: 'https://i.pravatar.cc/80?u=john',
    plan: 'Free',
    status: 'Inactive',
    lastLogin: '3 days ago',
    totalInterviews: 12,
    interviewCapacity: 50,
  },
  {
    id: '4',
    name: 'Emily Chen',
    email: 'emily.chen@startup.dev',
    avatar: 'https://i.pravatar.cc/80?u=emily',
    plan: 'Enterprise',
    status: 'Active',
    lastLogin: '1 hour ago',
    totalInterviews: 210,
    interviewCapacity: 220,
  },
];

export const KPI_STATS: KpiStat[] = [
  {
    label: 'Total Users',
    value: '12,540',
    trend: '+12%',
    trendDirection: 'up',
    icon: AppIcons.usersKpi,
  },
  {
    label: 'Active Today',
    value: '842',
    trend: '+5.4%',
    trendDirection: 'up',
    icon: AppIcons.zap,
  },
  {
    label: 'Avg Score',
    value: '78%',
    trend: '-2.1%',
    trendDirection: 'down',
    icon: AppIcons.star,
  },
  {
    label: 'Monthly Revenue',
    value: '$42,800',
    trend: '+8.2%',
    trendDirection: 'up',
    icon: AppIcons.banknote,
  },
];

export const DOMAIN_STATS = [
  { label: 'Information Tech', value: 42, color: '#3525cd' },
  { label: 'Healthcare', value: 28, color: '#6366f1' },
  { label: 'Finance', value: 15, color: '#818cf8' },
  { label: 'Manufacturing', value: 10, color: '#a5b4fc' },
  { label: 'Others', value: 5, color: '#c7d2fe' },
];

export const ACTIVITY_ITEMS: ActivityItem[] = [
  {
    title: 'New User Registered',
    description: '@sarah_dev onboarded as Senior Frontend Developer candidate',
    time: '2 mins ago',
    tone: 'success',
    icon: AppIcons.userRegistered,
  },
  {
    title: 'Interview Completed',
    description: 'John Doe - Senior Dev · SCORE: 88 · TECH STACK: REACT/NODE',
    time: '45 mins ago',
    tone: 'info',
    icon: AppIcons.interviewCompleted,
  },
  {
    title: 'System Alert',
    description: 'API Latency Spike detected in US-East-1 region',
    time: '2 hours ago',
    tone: 'warning',
    icon: AppIcons.systemAlert,
  },
];
