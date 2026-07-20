import { InterviewDomain } from '../../core/models/interview-domain.model';

/** Domains shown in the user-facing "Type of Interview" dropdown. */
export const MOCK_INTERVIEW_DOMAINS: InterviewDomain[] = [
  {
    id: 'dom-1',
    name: 'Technical',
    description: 'Core technical knowledge and problem-solving assessment.',
    status: 'Active',
    sortOrder: 1,
    usageCount: 428,
    updatedAt: '2 days ago',
  },
  {
    id: 'dom-2',
    name: 'Coding',
    description: 'Live coding and algorithmic challenges.',
    status: 'Active',
    sortOrder: 2,
    usageCount: 391,
    updatedAt: '2 days ago',
  },
  {
    id: 'dom-3',
    name: 'System Design',
    description: 'Architecture, scalability, and design trade-offs.',
    status: 'Active',
    sortOrder: 3,
    usageCount: 214,
    updatedAt: '5 days ago',
  },
  {
    id: 'dom-4',
    name: 'Debugging',
    description: 'Root-cause analysis and code troubleshooting.',
    status: 'Active',
    sortOrder: 4,
    usageCount: 156,
    updatedAt: '1 week ago',
  },
  {
    id: 'dom-5',
    name: 'HR',
    description: 'Company culture fit and HR screening questions.',
    status: 'Active',
    sortOrder: 5,
    usageCount: 98,
    updatedAt: '1 week ago',
  },
  {
    id: 'dom-6',
    name: 'Behavioral',
    description: 'Soft skills, collaboration, and past experience.',
    status: 'Active',
    sortOrder: 6,
    usageCount: 187,
    updatedAt: '3 days ago',
  },
];
