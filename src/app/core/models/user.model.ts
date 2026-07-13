export type UserPlan = 'Enterprise' | 'Pro' | 'Free';
export type UserStatus = 'Active' | 'Inactive';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: UserPlan;
  status: UserStatus;
  lastLogin: string;
  totalInterviews: number;
  interviewCapacity: number;
}
