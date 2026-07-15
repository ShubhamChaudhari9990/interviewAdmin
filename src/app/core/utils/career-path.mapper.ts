import type {
  CareerCategory,
  CareerDomain,
  CareerPathData,
  CareerSpecialization,
  CareerTargetRole,
  MasterDataStatus,
} from '../models/career-path.model';
import type {
  FirestoreCategory,
  FirestoreInterviewDomain,
  FirestoreInterviewTypeMeta,
  FirestoreSpecialization,
  FirestoreTargetRoleMeta,
} from '../models/interview-domain-firestore.model';

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toStatus(value: unknown): MasterDataStatus {
  return value === 'Inactive' ? 'Inactive' : 'Active';
}

function formatUpdatedAt(value: unknown): string {
  if (!value) {
    return '—';
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    const timestamp = value as { toDate: () => Date };
    if (typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleDateString();
    }
  }

  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toLocaleDateString();
    }
    return value;
  }

  return '—';
}

function normalizeFirestoreDomains(rawDomains: unknown[]): FirestoreInterviewDomain[] {
  return rawDomains
    .map((raw) => normalizeFirestoreDomain(raw))
    .filter((domain): domain is FirestoreInterviewDomain => Boolean(domain?.domainName));
}

function normalizeFirestoreDomain(raw: unknown): FirestoreInterviewDomain | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const record = raw as Record<string, unknown>;
  const domainName = String(record['domainName'] ?? record['name'] ?? '').trim();
  if (!domainName) {
    return null;
  }

  const categoriesRaw = Array.isArray(record['categories']) ? record['categories'] : [];
  const interviewTypesRaw = Array.isArray(record['interviewTypes']) ? record['interviewTypes'] : [];
  const interviewTypeDetailsRaw =
    record['interviewTypeDetails'] && typeof record['interviewTypeDetails'] === 'object'
      ? (record['interviewTypeDetails'] as Record<string, unknown>)
      : {};

  const interviewTypeDetails = Object.fromEntries(
    Object.entries(interviewTypeDetailsRaw).map(([typeName, meta]) => {
      const details = (meta ?? {}) as Record<string, unknown>;
      return [
        typeName,
        {
          id: typeof details['id'] === 'string' ? details['id'] : undefined,
          description: typeof details['description'] === 'string' ? details['description'] : '',
          status: toStatus(details['status']),
          sortOrder: typeof details['sortOrder'] === 'number' ? details['sortOrder'] : undefined,
        } satisfies FirestoreInterviewTypeMeta,
      ];
    }),
  );

  return {
    id: typeof record['id'] === 'string' ? record['id'] : undefined,
    domainName,
    description: typeof record['description'] === 'string' ? record['description'] : '',
    status: toStatus(record['status']),
    sortOrder: typeof record['sortOrder'] === 'number' ? record['sortOrder'] : undefined,
    interviewTypes: interviewTypesRaw.map((type) => String(type).trim()).filter(Boolean),
    interviewTypeDetails,
    categories: categoriesRaw
      .map((categoryRaw) => normalizeFirestoreCategory(categoryRaw))
      .filter((category): category is FirestoreCategory => Boolean(category?.name)),
  };
}

function normalizeFirestoreCategory(raw: unknown): FirestoreCategory | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const record = raw as Record<string, unknown>;
  const name = String(record['name'] ?? '').trim();
  if (!name) {
    return null;
  }

  const specializationsRaw = Array.isArray(record['specializations']) ? record['specializations'] : [];

  return {
    id: typeof record['id'] === 'string' ? record['id'] : undefined,
    name,
    description: typeof record['description'] === 'string' ? record['description'] : '',
    status: toStatus(record['status']),
    sortOrder: typeof record['sortOrder'] === 'number' ? record['sortOrder'] : undefined,
    specializations: specializationsRaw
      .map((specializationRaw) => normalizeFirestoreSpecialization(specializationRaw))
      .filter((item): item is FirestoreSpecialization => Boolean(item?.name)),
  };
}

function normalizeFirestoreSpecialization(raw: unknown): FirestoreSpecialization | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const record = raw as Record<string, unknown>;
  const name = String(record['name'] ?? '').trim();
  if (!name) {
    return null;
  }

  const roles = Array.isArray(record['roles'])
    ? record['roles'].map((role) => String(role).trim()).filter(Boolean)
    : [];

  const roleDetailsRaw =
    record['roleDetails'] && typeof record['roleDetails'] === 'object'
      ? (record['roleDetails'] as Record<string, unknown>)
      : {};

  const roleDetails = Object.fromEntries(
    Object.entries(roleDetailsRaw).map(([roleName, meta]) => {
      const details = (meta ?? {}) as Record<string, unknown>;
      return [
        roleName,
        {
          id: typeof details['id'] === 'string' ? details['id'] : undefined,
          description: typeof details['description'] === 'string' ? details['description'] : '',
          status: toStatus(details['status']),
          sortOrder: typeof details['sortOrder'] === 'number' ? details['sortOrder'] : undefined,
        } satisfies FirestoreTargetRoleMeta,
      ];
    }),
  );

  return {
    id: typeof record['id'] === 'string' ? record['id'] : undefined,
    name,
    description: typeof record['description'] === 'string' ? record['description'] : '',
    status: toStatus(record['status']),
    sortOrder: typeof record['sortOrder'] === 'number' ? record['sortOrder'] : undefined,
    roles,
    roleDetails,
  };
}

export function parseFirestoreInterviewDomains(payload: unknown): FirestoreInterviewDomain[] {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return normalizeFirestoreDomains(payload);
  }

  if (typeof payload !== 'object') {
    return [];
  }

  const record = payload as Record<string, unknown>;
  if (Array.isArray(record['domains'])) {
    return normalizeFirestoreDomains(record['domains'] as unknown[]);
  }

  const singleDomain = normalizeFirestoreDomain(record);
  return singleDomain ? [singleDomain] : [];
}

export function toCareerPathData(
  firestoreDomains: FirestoreInterviewDomain[],
  updatedAt?: unknown,
): CareerPathData {
  const domains: CareerDomain[] = [];
  const categories: CareerCategory[] = [];
  const specializations: CareerSpecialization[] = [];
  const targetRoles: CareerTargetRole[] = [];
  const updatedLabel = formatUpdatedAt(updatedAt);

  firestoreDomains.forEach((domain, domainIndex) => {
    const domainId = domain.id ?? `domain-${slugify(domain.domainName)}`;

    domains.push({
      id: domainId,
      name: domain.domainName,
      description: domain.description ?? '',
      status: domain.status ?? 'Active',
      sortOrder: domain.sortOrder ?? domainIndex + 1,
      usageCount: 0,
      updatedAt: updatedLabel,
    });

    domain.categories.forEach((category, categoryIndex) => {
      const categoryId = category.id ?? `${domainId}-${slugify(category.name)}`;

      categories.push({
        id: categoryId,
        domainId,
        name: category.name,
        description: category.description ?? '',
        status: category.status ?? 'Active',
        sortOrder: category.sortOrder ?? categoryIndex + 1,
        usageCount: 0,
        updatedAt: updatedLabel,
      });

      category.specializations.forEach((specialization, specializationIndex) => {
        const specializationId =
          specialization.id ?? `${categoryId}-${slugify(specialization.name)}`;

        specializations.push({
          id: specializationId,
          categoryId,
          name: specialization.name,
          description: specialization.description ?? '',
          status: specialization.status ?? 'Active',
          sortOrder: specialization.sortOrder ?? specializationIndex + 1,
          usageCount: 0,
          updatedAt: updatedLabel,
        });

        specialization.roles.forEach((roleName, roleIndex) => {
          const roleMeta = specialization.roleDetails?.[roleName];

          targetRoles.push({
            id: roleMeta?.id ?? `${specializationId}-${slugify(roleName)}`,
            specializationId,
            name: roleName,
            description: roleMeta?.description ?? '',
            status: roleMeta?.status ?? 'Active',
            sortOrder: roleMeta?.sortOrder ?? roleIndex + 1,
            usageCount: 0,
            updatedAt: updatedLabel,
          });
        });
      });
    });
  });

  return { domains, categories, specializations, targetRoles };
}

export function fromCareerPathData(
  data: CareerPathData,
  existingDomains: FirestoreInterviewDomain[] = [],
): FirestoreInterviewDomain[] {
  const interviewTypesByDomain = new Map(
    existingDomains.map((domain) => [
      domain.id ?? `domain-${slugify(domain.domainName)}`,
      domain.interviewTypes ?? [],
    ]),
  );
  const interviewTypeDetailsByDomain = new Map(
    existingDomains.map((domain) => [
      domain.id ?? `domain-${slugify(domain.domainName)}`,
      domain.interviewTypeDetails ?? {},
    ]),
  );

  return [...data.domains]
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((domain) => {
      const domainCategories = data.categories
        .filter((category) => category.domainId === domain.id)
        .sort((left, right) => left.sortOrder - right.sortOrder)
        .map((category) => {
          const categorySpecializations = data.specializations
            .filter((specialization) => specialization.categoryId === category.id)
            .sort((left, right) => left.sortOrder - right.sortOrder)
            .map((specialization) => {
              const roles = data.targetRoles
                .filter((role) => role.specializationId === specialization.id)
                .sort((left, right) => left.sortOrder - right.sortOrder);

              const roleDetails = Object.fromEntries(
                roles.map((role) => [
                  role.name,
                  {
                    id: role.id,
                    description: role.description,
                    status: role.status,
                    sortOrder: role.sortOrder,
                  },
                ]),
              );

              return {
                id: specialization.id,
                name: specialization.name,
                description: specialization.description,
                status: specialization.status,
                sortOrder: specialization.sortOrder,
                roles: roles.map((role) => role.name),
                roleDetails,
              } satisfies FirestoreSpecialization;
            });

          return {
            id: category.id,
            name: category.name,
            description: category.description,
            status: category.status,
            sortOrder: category.sortOrder,
            specializations: categorySpecializations,
          } satisfies FirestoreCategory;
        });

      return {
        id: domain.id,
        domainName: domain.name,
        description: domain.description,
        status: domain.status,
        sortOrder: domain.sortOrder,
        interviewTypes: interviewTypesByDomain.get(domain.id) ?? [],
        interviewTypeDetails: interviewTypeDetailsByDomain.get(domain.id) ?? {},
        categories: domainCategories,
      } satisfies FirestoreInterviewDomain;
    });
}
