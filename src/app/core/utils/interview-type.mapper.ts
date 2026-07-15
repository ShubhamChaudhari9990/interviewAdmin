import type { FirestoreInterviewDomain } from '../models/interview-domain-firestore.model';
import type {
  InterviewType,
  InterviewTypeCareerDomain,
  InterviewTypeData,
  InterviewTypeStatus,
} from '../models/interview-type.model';

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toStatus(value: unknown): InterviewTypeStatus {
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

export function toInterviewTypeData(
  firestoreDomains: FirestoreInterviewDomain[],
  updatedAt?: unknown,
): InterviewTypeData {
  const updatedLabel = formatUpdatedAt(updatedAt);
  const careerDomains: InterviewTypeCareerDomain[] = [];
  const interviewTypes: InterviewType[] = [];

  firestoreDomains.forEach((domain, domainIndex) => {
    const domainId = domain.id ?? `domain-${slugify(domain.domainName)}`;

    careerDomains.push({
      id: domainId,
      name: domain.domainName,
      status: toStatus(domain.status),
      sortOrder: domain.sortOrder ?? domainIndex + 1,
    });

    (domain.interviewTypes ?? []).forEach((typeName, typeIndex) => {
      const meta = domain.interviewTypeDetails?.[typeName];

      interviewTypes.push({
        id: meta?.id ?? `${domainId}-${slugify(typeName)}`,
        domainId,
        name: typeName,
        description: meta?.description ?? '',
        status: toStatus(meta?.status),
        sortOrder: meta?.sortOrder ?? typeIndex + 1,
        usageCount: 0,
        updatedAt: updatedLabel,
      });
    });
  });

  return { careerDomains, interviewTypes };
}

export function applyInterviewTypesToDomains(
  existingDomains: FirestoreInterviewDomain[],
  interviewTypes: InterviewType[],
): FirestoreInterviewDomain[] {
  const typesByDomain = new Map<string, InterviewType[]>();

  interviewTypes.forEach((type) => {
    const current = typesByDomain.get(type.domainId) ?? [];
    current.push(type);
    typesByDomain.set(type.domainId, current);
  });

  return existingDomains.map((domain) => {
    const domainId = domain.id ?? `domain-${slugify(domain.domainName)}`;
    const types = (typesByDomain.get(domainId) ?? []).sort(
      (left, right) => left.sortOrder - right.sortOrder,
    );

    return {
      ...domain,
      interviewTypes: types.map((type) => type.name),
      interviewTypeDetails: Object.fromEntries(
        types.map((type) => [
          type.name,
          {
            id: type.id,
            description: type.description,
            status: type.status,
            sortOrder: type.sortOrder,
          },
        ]),
      ),
    };
  });
}
