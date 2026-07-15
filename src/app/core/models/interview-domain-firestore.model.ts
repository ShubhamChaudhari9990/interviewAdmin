import type { MasterDataStatus } from './career-path.model';

export interface FirestoreTargetRoleMeta {
  id?: string;
  description?: string;
  status?: MasterDataStatus;
  sortOrder?: number;
}

export interface FirestoreInterviewTypeMeta {
  id?: string;
  description?: string;
  status?: MasterDataStatus;
  sortOrder?: number;
}

export interface FirestoreSpecialization {
  id?: string;
  name: string;
  description?: string;
  status?: MasterDataStatus;
  sortOrder?: number;
  roles: string[];
  roleDetails?: Record<string, FirestoreTargetRoleMeta>;
}

export interface FirestoreCategory {
  id?: string;
  name: string;
  description?: string;
  status?: MasterDataStatus;
  sortOrder?: number;
  specializations: FirestoreSpecialization[];
}

export interface FirestoreInterviewDomain {
  id?: string;
  domainName: string;
  description?: string;
  status?: MasterDataStatus;
  sortOrder?: number;
  interviewTypes?: string[];
  interviewTypeDetails?: Record<string, FirestoreInterviewTypeMeta>;
  categories: FirestoreCategory[];
}

export interface FirestoreInterviewDomainDocument {
  domains: FirestoreInterviewDomain[];
  updatedAt?: unknown;
}
