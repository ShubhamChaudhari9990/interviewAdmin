export type InterviewDomainStatus = 'Active' | 'Inactive';

export interface InterviewDomain {
  id: string;
  name: string;
  description: string;
  status: InterviewDomainStatus;
  sortOrder: number;
  usageCount: number;
  updatedAt: string;
}
