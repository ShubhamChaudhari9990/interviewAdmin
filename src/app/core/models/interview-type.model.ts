export type InterviewTypeStatus = 'Active' | 'Inactive';

export interface InterviewTypeCareerDomain {
  id: string;
  name: string;
  status: InterviewTypeStatus;
  sortOrder: number;
}

export interface InterviewType {
  id: string;
  name: string;
  domainId: string;
  description: string;
  status: InterviewTypeStatus;
  sortOrder: number;
  usageCount: number;
  updatedAt: string;
}

export interface InterviewTypeData {
  careerDomains: InterviewTypeCareerDomain[];
  interviewTypes: InterviewType[];
}
