import { DropdownOption } from '../../core/models/dropdown-option.model';

export const USER_STATUS_FILTER_OPTIONS: DropdownOption[] = [
  { label: 'Status: All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

export const USER_PLAN_FILTER_OPTIONS: DropdownOption[] = [
  { label: 'Plan: All', value: 'all' },
  { label: 'Enterprise', value: 'enterprise' },
  { label: 'Pro', value: 'pro' },
  { label: 'Free', value: 'free' },
];

export const USER_DOMAIN_FILTER_OPTIONS: DropdownOption[] = [
  { label: 'Domain: All', value: 'all' },
  { label: 'Information Tech', value: 'it' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Finance', value: 'finance' },
];

export const PERIOD_FILTER_OPTIONS: DropdownOption[] = [
  { label: 'Last 6 Months', value: '6m' },
  { label: 'Last 3 Months', value: '3m' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 7 Days', value: '7d' },
];
