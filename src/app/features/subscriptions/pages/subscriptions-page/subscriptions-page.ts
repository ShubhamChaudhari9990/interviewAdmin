import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlansFirestoreService } from '../../../../core/services/plans-firestore.service';
import { LoaderService } from '../../../../core/services/loader.service';
import { ToastService } from '../../../../core/services/toast.service';
import type {
  AiFeedbackLevel,
  BillingCycle,
  SubscriptionPlan,
  SubscriptionPlanForm,
} from '../../../../core/models/subscription-plan.model';
import {
  formatLimit,
  formatPlanPrice,
  planToForm,
} from '../../../../core/utils/subscription-plan.mapper';
import { AppButton, AppDropdown, AppIcon, AppLoader, AppModal } from '../../../../shared/ui';
import { AppIcons, type AppIconDefinition } from '../../../../shared/ui/icon/icon';
import type { DropdownOption } from '../../../../core/models/dropdown-option.model';

const EMPTY_FORM: SubscriptionPlanForm = {
  name: '',
  description: '',
  buttonText: '',
  icon: '',
  isActive: true,
  isPopular: false,
  currency: 'INR',
  monthlyAmountRupees: 0,
  yearlyAmountRupees: 0,
  monthlyDurationDays: 30,
  yearlyDurationDays: 365,
  monthlyInterviewLimit: 0,
  monthlyResumeUploadLimit: 0,
  interviewCredits: 0,
  monthlyResumeAnalysisLimit: 0,
  voiceInterview: false,
  codingInterview: false,
  pdfReport: false,
  analytics: false,
  communitySupport: false,
  prioritySupport: false,
  dedicatedAccountManager: false,
  aiFeedbackLevel: 'basic',
};

const FEATURE_TOGGLE_FIELDS: Array<{
  key: keyof Pick<
    SubscriptionPlanForm,
    | 'voiceInterview'
    | 'codingInterview'
    | 'pdfReport'
    | 'analytics'
    | 'communitySupport'
    | 'prioritySupport'
    | 'dedicatedAccountManager'
  >;
  label: string;
  hint: string;
}> = [
  { key: 'voiceInterview', label: 'Voice interview', hint: 'AI voice-based interviews' },
  { key: 'codingInterview', label: 'Coding interview', hint: 'Live coding assessments' },
  { key: 'pdfReport', label: 'PDF report', hint: 'Downloadable performance reports' },
  { key: 'analytics', label: 'Analytics', hint: 'Detailed progress analytics' },
  { key: 'communitySupport', label: 'Community support', hint: 'Access to community help' },
  { key: 'prioritySupport', label: 'Priority support', hint: 'Faster support response' },
  {
    key: 'dedicatedAccountManager',
    label: 'Dedicated account manager',
    hint: 'Named account contact',
  },
];

@Component({
  selector: 'app-subscriptions-page',
  imports: [FormsModule, AppButton, AppDropdown, AppIcon, AppLoader, AppModal],
  templateUrl: './subscriptions-page.html',
})
export class SubscriptionsPage implements OnInit {
  private readonly plansFirestore = inject(PlansFirestoreService);
  private readonly loaderService = inject(LoaderService);
  private readonly toastService = inject(ToastService);

  readonly icons = AppIcons;
  readonly featureToggles = FEATURE_TOGGLE_FIELDS;
  readonly formatPrice = formatPlanPrice;
  readonly formatLimit = formatLimit;

  readonly plans = signal<SubscriptionPlan[]>([]);
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly loadError = signal('');
  readonly billingCycle = signal<BillingCycle>('monthly');
  readonly editOpen = signal(false);
  readonly editingPlanId = signal<string | null>(null);
  readonly form = signal<SubscriptionPlanForm>({ ...EMPTY_FORM });
  readonly formError = signal('');

  readonly feedbackOptions: DropdownOption[] = [
    { label: 'Basic', value: 'basic' },
    { label: 'Advanced', value: 'advanced' },
    { label: 'Premium', value: 'premium' },
  ];

  readonly activePlanCount = computed(
    () => this.plans().filter((plan) => plan.isActive).length,
  );

  readonly editingPlanName = computed(() => {
    const id = this.editingPlanId();
    return this.plans().find((plan) => plan.id === id)?.name ?? 'Plan';
  });

  ngOnInit(): void {
    void this.loadPlans();
  }

  async loadPlans(): Promise<void> {
    const isRetry = Boolean(this.loadError());
    this.isLoading.set(true);
    this.loadError.set('');

    try {
      const plans = await this.plansFirestore.loadPlans();
      this.plans.set(plans);

      if (isRetry) {
        this.toastService.success('Plans loaded', 'Subscription plans were refreshed.');
      }
    } catch (error) {
      const message = this.getErrorMessage(error, 'Failed to load subscription plans.');
      this.loadError.set(message);
      this.toastService.error('Load failed', message);
    } finally {
      this.isLoading.set(false);
    }
  }

  setBillingCycle(cycle: BillingCycle): void {
    this.billingCycle.set(cycle);
  }

  planIcon(plan: SubscriptionPlan): AppIconDefinition {
    const key = plan.icon.trim().toLowerCase().replace(/\s+/g, '-');
    switch (key) {
      case 'rocket':
        return this.icons.rocket;
      case 'star':
        return this.icons.star;
      case 'building-2':
      case 'building2':
      case 'building':
        return this.icons.building;
      case 'credit-card':
      case 'creditcard':
        return this.icons.creditCard;
      default:
        return this.icons.subscriptions;
    }
  }

  displayedAmount(plan: SubscriptionPlan): number {
    return this.billingCycle() === 'yearly'
      ? plan.billing.yearly.amount
      : plan.billing.monthly.amount;
  }

  billingLabel(plan: SubscriptionPlan): string {
    if (this.displayedAmount(plan) <= 0) {
      return 'Forever free';
    }
    return this.billingCycle() === 'yearly' ? '/ year' : '/ month';
  }

  featureRows(plan: SubscriptionPlan): Array<{ label: string; value: string; included?: boolean }> {
    return [
      {
        label: 'Interview credits',
        value: formatLimit(plan.features.interviewCredits),
      },
      {
        label: 'Monthly interviews',
        value: formatLimit(plan.features.monthlyInterviewLimit),
      },
      {
        label: 'Resume uploads',
        value: formatLimit(plan.features.monthlyResumeUploadLimit),
      },
      {
        label: 'AI feedback',
        value: this.formatFeedbackLevel(plan.features.aiFeedbackLevel),
      },
      {
        label: 'Voice interview',
        value: plan.features.voiceInterview ? 'Included' : 'Not included',
        included: plan.features.voiceInterview,
      },
      {
        label: 'Coding interview',
        value: plan.features.codingInterview ? 'Included' : 'Not included',
        included: plan.features.codingInterview,
      },
      {
        label: 'PDF report',
        value: plan.features.pdfReport ? 'Included' : 'Not included',
        included: plan.features.pdfReport,
      },
      {
        label: 'Analytics',
        value: plan.features.analytics ? 'Included' : 'Not included',
        included: plan.features.analytics,
      },
      {
        label: 'Priority support',
        value: plan.features.prioritySupport ? 'Included' : 'Not included',
        included: plan.features.prioritySupport,
      },
    ];
  }

  openEdit(plan: SubscriptionPlan): void {
    this.editingPlanId.set(plan.id);
    this.form.set(planToForm(plan));
    this.formError.set('');
    this.editOpen.set(true);
  }

  closeEdit(): void {
    this.editOpen.set(false);
    this.editingPlanId.set(null);
    this.form.set({ ...EMPTY_FORM });
    this.formError.set('');
  }

  updateFormField<K extends keyof SubscriptionPlanForm>(
    field: K,
    value: SubscriptionPlanForm[K],
  ): void {
    this.form.update((current) => ({ ...current, [field]: value }));
    this.formError.set('');
  }

  updateNumberField(field: keyof SubscriptionPlanForm, raw: string | number | null): void {
    const parsed = typeof raw === 'number' ? raw : Number(raw);
    this.updateFormField(field, (Number.isFinite(parsed) ? parsed : 0) as never);
  }

  onFeedbackChange(value: string): void {
    this.updateFormField('aiFeedbackLevel', value as AiFeedbackLevel);
  }

  async savePlan(): Promise<void> {
    const planId = this.editingPlanId();
    const draft = this.form();

    if (!planId) {
      return;
    }

    if (!draft.name.trim()) {
      this.formError.set('Plan name is required.');
      return;
    }

    if (!draft.buttonText.trim()) {
      this.formError.set('CTA button text is required.');
      return;
    }

    if (draft.monthlyAmountRupees < 0 || draft.yearlyAmountRupees < 0) {
      this.formError.set('Billing amounts cannot be negative.');
      return;
    }

    this.isSaving.set(true);
    this.loaderService.show('Saving plan...');

    try {
      await this.plansFirestore.updatePlan(planId, draft);
      const refreshed = await this.plansFirestore.loadPlans();
      this.plans.set(refreshed);
      this.toastService.success('Plan updated', `${draft.name.trim()} was saved successfully.`);
      this.closeEdit();
    } catch (error) {
      const message = this.getErrorMessage(error, 'Failed to save plan changes.');
      this.formError.set(message);
      this.toastService.error('Save failed', message);
    } finally {
      this.isSaving.set(false);
      this.loaderService.hide();
    }
  }

  private formatFeedbackLevel(level: string): string {
    if (!level) {
      return '—';
    }
    return level.charAt(0).toUpperCase() + level.slice(1);
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message.trim()) {
      return error.message;
    }
    return fallback;
  }
}
