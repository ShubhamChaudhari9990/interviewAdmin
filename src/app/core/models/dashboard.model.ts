import type { AppIconDefinition } from '../../shared/ui/icon/icon';

export interface KpiStat {
  label: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down';
  icon: AppIconDefinition;
}

export interface DomainStat {
  label: string;
  value: number;
  color: string;
}

export interface ActivityItem {
  title: string;
  description: string;
  time: string;
  tone: 'success' | 'info' | 'warning';
  icon: AppIconDefinition;
}
