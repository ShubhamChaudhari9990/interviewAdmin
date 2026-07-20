import type {
  AiFeedbackLevel,
  PlanBilling,
  PlanBillingPeriod,
  PlanFeatures,
  SubscriptionPlan,
  SubscriptionPlanForm,
} from '../models/subscription-plan.model';

const PLAN_ORDER = ['free', 'pro', 'enterprise'] as const;

const DEFAULT_FEATURES: PlanFeatures = {
  monthlyInterviewLimit: 0,
  monthlyResumeUploadLimit: 0,
  interviewCredits: 0,
  voiceInterview: false,
  codingInterview: false,
  pdfReport: false,
  analytics: false,
  communitySupport: false,
  prioritySupport: false,
  dedicatedAccountManager: false,
  aiFeedbackLevel: 'basic',
};

const DEFAULT_BILLING_PERIOD: PlanBillingPeriod = {
  amount: 0,
  durationDays: 30,
};

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function readString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback;
}

function readBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function readNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function readNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/** Reads map fields even when keys have accidental leading/trailing spaces. */
function readMapField(map: Record<string, unknown>, key: string): unknown {
  if (key in map) {
    return map[key];
  }

  const match = Object.keys(map).find((entry) => entry.trim() === key);
  return match ? map[match] : undefined;
}

function parseBillingPeriod(
  value: unknown,
  fallbackDurationDays: number,
): PlanBillingPeriod {
  const record = asRecord(value);
  return {
    amount: readNumber(readMapField(record, 'amount'), 0),
    durationDays: readNumber(readMapField(record, 'durationDays'), fallbackDurationDays),
  };
}

function parseBilling(value: unknown): PlanBilling {
  const record = asRecord(value);
  return {
    monthly: parseBillingPeriod(readMapField(record, 'monthly'), 30),
    yearly: parseBillingPeriod(readMapField(record, 'yearly'), 365),
  };
}

function parseFeatures(value: unknown): PlanFeatures {
  const record = asRecord(value);
  return {
    monthlyInterviewLimit: readNumber(
      readMapField(record, 'monthlyInterviewLimit'),
      DEFAULT_FEATURES.monthlyInterviewLimit,
    ),
    monthlyResumeUploadLimit: readNumber(
      readMapField(record, 'monthlyResumeUploadLimit'),
      DEFAULT_FEATURES.monthlyResumeUploadLimit,
    ),
    interviewCredits: readNumber(
      readMapField(record, 'interviewCredits'),
      DEFAULT_FEATURES.interviewCredits,
    ),
    voiceInterview: readBoolean(
      readMapField(record, 'voiceInterview'),
      DEFAULT_FEATURES.voiceInterview,
    ),
    codingInterview: readBoolean(
      readMapField(record, 'codingInterview'),
      DEFAULT_FEATURES.codingInterview,
    ),
    pdfReport: readBoolean(readMapField(record, 'pdfReport'), DEFAULT_FEATURES.pdfReport),
    analytics: readBoolean(readMapField(record, 'analytics'), DEFAULT_FEATURES.analytics),
    communitySupport: readBoolean(
      readMapField(record, 'communitySupport'),
      DEFAULT_FEATURES.communitySupport,
    ),
    prioritySupport: readBoolean(
      readMapField(record, 'prioritySupport'),
      DEFAULT_FEATURES.prioritySupport,
    ),
    dedicatedAccountManager: readBoolean(
      readMapField(record, 'dedicatedAccountManager'),
      DEFAULT_FEATURES.dedicatedAccountManager,
    ),
    aiFeedbackLevel: readString(
      readMapField(record, 'aiFeedbackLevel'),
      DEFAULT_FEATURES.aiFeedbackLevel,
    ) as AiFeedbackLevel,
  };
}

export function parseSubscriptionPlan(
  id: string,
  data: Record<string, unknown>,
): SubscriptionPlan {
  const features = parseFeatures(data['features']);
  const billing = parseBilling(data['billing']);

  return {
    id: readString(data['id'], id) || id,
    name: readString(data['name'], id),
    description: readString(data['description']),
    icon: readString(data['icon'], 'credit-card'),
    buttonText: readString(data['buttonText'], 'Select plan'),
    isActive: readBoolean(data['isActive'], true),
    isPopular: readBoolean(data['isPopular'], false),
    currency: readString(data['currency'], 'INR').toUpperCase() || 'INR',
    interviewCredits: readNullableNumber(data['interviewCredits']),
    monthlyInterviewLimit: readNullableNumber(data['monthlyInterviewLimit']),
    monthlyResumeAnalysisLimit: readNullableNumber(data['monthlyResumeAnalysisLimit']),
    amount: readNullableNumber(data['amount']),
    billing: {
      monthly: billing.monthly.amount || billing.monthly.durationDays
        ? billing.monthly
        : { ...DEFAULT_BILLING_PERIOD },
      yearly: billing.yearly.amount || billing.yearly.durationDays
        ? billing.yearly
        : { amount: 0, durationDays: 365 },
    },
    features,
  };
}

export function sortSubscriptionPlans(plans: SubscriptionPlan[]): SubscriptionPlan[] {
  return [...plans].sort((a, b) => {
    const aIndex = PLAN_ORDER.indexOf(a.id as (typeof PLAN_ORDER)[number]);
    const bIndex = PLAN_ORDER.indexOf(b.id as (typeof PLAN_ORDER)[number]);
    const safeA = aIndex === -1 ? PLAN_ORDER.length : aIndex;
    const safeB = bIndex === -1 ? PLAN_ORDER.length : bIndex;
    if (safeA !== safeB) {
      return safeA - safeB;
    }
    return a.name.localeCompare(b.name);
  });
}

/** Firestore amounts are stored in paise (1 INR = 100). */
export function paiseToRupees(paise: number): number {
  return Math.round((paise / 100) * 100) / 100;
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function formatPlanPrice(paise: number, currency = 'INR'): string {
  if (paise <= 0) {
    return 'Free';
  }

  const rupees = paiseToRupees(paise);
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: rupees % 1 === 0 ? 0 : 2,
    }).format(rupees);
  } catch {
    return `₹${rupees.toLocaleString('en-IN')}`;
  }
}

export function formatLimit(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '—';
  }
  if (value < 0) {
    return 'Unlimited';
  }
  return value.toLocaleString('en-IN');
}

export function planToForm(plan: SubscriptionPlan): SubscriptionPlanForm {
  return {
    name: plan.name,
    description: plan.description,
    buttonText: plan.buttonText,
    icon: plan.icon.trim(),
    isActive: plan.isActive,
    isPopular: plan.isPopular,
    currency: plan.currency || 'INR',
    monthlyAmountRupees: paiseToRupees(plan.billing.monthly.amount),
    yearlyAmountRupees: paiseToRupees(plan.billing.yearly.amount),
    monthlyDurationDays: plan.billing.monthly.durationDays || 30,
    yearlyDurationDays: plan.billing.yearly.durationDays || 365,
    monthlyInterviewLimit: plan.features.monthlyInterviewLimit,
    monthlyResumeUploadLimit: plan.features.monthlyResumeUploadLimit,
    interviewCredits: plan.features.interviewCredits,
    monthlyResumeAnalysisLimit: plan.monthlyResumeAnalysisLimit ?? plan.features.monthlyResumeUploadLimit,
    voiceInterview: plan.features.voiceInterview,
    codingInterview: plan.features.codingInterview,
    pdfReport: plan.features.pdfReport,
    analytics: plan.features.analytics,
    communitySupport: plan.features.communitySupport,
    prioritySupport: plan.features.prioritySupport,
    dedicatedAccountManager: plan.features.dedicatedAccountManager,
    aiFeedbackLevel: plan.features.aiFeedbackLevel || 'basic',
  };
}

export function formToPlanPatch(form: SubscriptionPlanForm): Record<string, unknown> {
  const monthlyAmount = rupeesToPaise(form.monthlyAmountRupees);
  const yearlyAmount = rupeesToPaise(form.yearlyAmountRupees);

  return {
    name: form.name.trim(),
    description: form.description.trim(),
    buttonText: form.buttonText.trim(),
    icon: form.icon.trim(),
    isActive: form.isActive,
    isPopular: form.isPopular,
    currency: form.currency.trim().toUpperCase() || 'INR',
    amount: yearlyAmount,
    interviewCredits: form.interviewCredits,
    monthlyInterviewLimit: form.monthlyInterviewLimit < 0 ? null : form.monthlyInterviewLimit,
    monthlyResumeAnalysisLimit:
      form.monthlyResumeAnalysisLimit < 0 ? null : form.monthlyResumeAnalysisLimit,
    billing: {
      monthly: {
        amount: monthlyAmount,
        durationDays: form.monthlyDurationDays,
      },
      yearly: {
        amount: yearlyAmount,
        durationDays: form.yearlyDurationDays,
      },
    },
    features: {
      monthlyInterviewLimit: form.monthlyInterviewLimit,
      monthlyResumeUploadLimit: form.monthlyResumeUploadLimit,
      interviewCredits: form.interviewCredits,
      voiceInterview: form.voiceInterview,
      codingInterview: form.codingInterview,
      pdfReport: form.pdfReport,
      analytics: form.analytics,
      communitySupport: form.communitySupport,
      prioritySupport: form.prioritySupport,
      dedicatedAccountManager: form.dedicatedAccountManager,
      aiFeedbackLevel: form.aiFeedbackLevel,
    },
  };
}
