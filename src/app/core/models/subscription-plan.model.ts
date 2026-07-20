/** AI feedback tier stored on plan feature maps. */
export type AiFeedbackLevel = 'basic' | 'advanced' | 'premium' | string;

export interface PlanBillingPeriod {
  amount: number;
  durationDays: number;
}

export interface PlanBilling {
  monthly: PlanBillingPeriod;
  yearly: PlanBillingPeriod;
}

export interface PlanFeatures {
  monthlyInterviewLimit: number;
  monthlyResumeUploadLimit: number;
  interviewCredits: number;
  voiceInterview: boolean;
  codingInterview: boolean;
  pdfReport: boolean;
  analytics: boolean;
  communitySupport: boolean;
  prioritySupport: boolean;
  dedicatedAccountManager: boolean;
  aiFeedbackLevel: AiFeedbackLevel;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  icon: string;
  buttonText: string;
  isActive: boolean;
  isPopular: boolean;
  currency: string;
  interviewCredits: number | null;
  monthlyInterviewLimit: number | null;
  monthlyResumeAnalysisLimit: number | null;
  /** Legacy top-level amount (often mirrors yearly billing). */
  amount: number | null;
  billing: PlanBilling;
  features: PlanFeatures;
}

export type BillingCycle = 'monthly' | 'yearly';

/** Editable form state for the plan admin modal (rupee amounts for billing). */
export interface SubscriptionPlanForm {
  name: string;
  description: string;
  buttonText: string;
  icon: string;
  isActive: boolean;
  isPopular: boolean;
  currency: string;
  monthlyAmountRupees: number;
  yearlyAmountRupees: number;
  monthlyDurationDays: number;
  yearlyDurationDays: number;
  monthlyInterviewLimit: number;
  monthlyResumeUploadLimit: number;
  interviewCredits: number;
  monthlyResumeAnalysisLimit: number;
  voiceInterview: boolean;
  codingInterview: boolean;
  pdfReport: boolean;
  analytics: boolean;
  communitySupport: boolean;
  prioritySupport: boolean;
  dedicatedAccountManager: boolean;
  aiFeedbackLevel: AiFeedbackLevel;
}
