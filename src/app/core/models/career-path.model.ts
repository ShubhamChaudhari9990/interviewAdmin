export type MasterDataStatus = 'Active' | 'Inactive';

export type CareerPathLevel = 'domain' | 'category' | 'specialization' | 'targetRole';

export interface CareerPathItemBase {
  id: string;
  name: string;
  description: string;
  status: MasterDataStatus;
  sortOrder: number;
  usageCount: number;
  updatedAt: string;
}

export interface CareerDomain extends CareerPathItemBase {}

export interface CareerCategory extends CareerPathItemBase {
  domainId: string;
}

export interface CareerSpecialization extends CareerPathItemBase {
  categoryId: string;
}

export interface CareerTargetRole extends CareerPathItemBase {
  specializationId: string;
}

export interface CareerPathData {
  domains: CareerDomain[];
  categories: CareerCategory[];
  specializations: CareerSpecialization[];
  targetRoles: CareerTargetRole[];
}
