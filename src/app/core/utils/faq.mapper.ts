import type { FaqCategory, FaqEntry } from '../models/faq.model';

/** Preferred display order for known FAQ category document ids. */
const FAQ_CATEGORY_ORDER = [
  'how-it-works',
  'candidates',
  'recruiters',
  'account-profile',
  'pricing-billing',
  'enterprise',
  'ai-fairness',
  'privacy-security',
  'setup-integrations',
  'technical-support',
] as const;

const FAQ_CATEGORY_TITLES: Record<string, string> = {
  'how-it-works': 'How It Works',
  candidates: 'Candidates',
  recruiters: 'Recruiters',
  'account-profile': 'Account & Profile',
  'pricing-billing': 'Pricing & Billing',
  enterprise: 'Enterprise',
  'ai-fairness': 'AI Fairness',
  'privacy-security': 'Privacy & Security',
  'setup-integrations': 'Setup & Integrations',
  'technical-support': 'Technical Support',
};

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function readString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback;
}

export function formatFaqCategoryTitle(id: string): string {
  if (FAQ_CATEGORY_TITLES[id]) {
    return FAQ_CATEGORY_TITLES[id];
  }

  return id
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function parseFaqEntry(value: unknown): FaqEntry | null {
  const record = asRecord(value);
  const question = readString(record['question']);
  const answer = readString(record['answer']);

  if (!question && !answer) {
    return null;
  }

  return { question, answer };
}

export function parseFaqCategory(
  id: string,
  data: Record<string, unknown>,
): FaqCategory {
  const rawQuestions = data['questions'];
  const questions = Array.isArray(rawQuestions)
    ? rawQuestions
        .map((entry) => parseFaqEntry(entry))
        .filter((entry): entry is FaqEntry => entry !== null)
    : [];

  return {
    id,
    title: formatFaqCategoryTitle(id),
    questions,
  };
}

export function sortFaqCategories(categories: FaqCategory[]): FaqCategory[] {
  return [...categories].sort((a, b) => {
    const aIndex = FAQ_CATEGORY_ORDER.indexOf(a.id as (typeof FAQ_CATEGORY_ORDER)[number]);
    const bIndex = FAQ_CATEGORY_ORDER.indexOf(b.id as (typeof FAQ_CATEGORY_ORDER)[number]);
    const safeA = aIndex === -1 ? FAQ_CATEGORY_ORDER.length : aIndex;
    const safeB = bIndex === -1 ? FAQ_CATEGORY_ORDER.length : bIndex;
    if (safeA !== safeB) {
      return safeA - safeB;
    }
    return a.title.localeCompare(b.title);
  });
}

export function toFirestoreQuestions(questions: FaqEntry[]): FaqEntry[] {
  return questions.map((entry) => ({
    question: entry.question.trim(),
    answer: entry.answer.trim(),
  }));
}
