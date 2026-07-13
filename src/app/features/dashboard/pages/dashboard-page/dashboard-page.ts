import { Component } from '@angular/core';
import { AppButton, AppDropdown, AppIcon, KpiCard } from '../../../../shared/ui';
import { AppIcons } from '../../../../shared/ui/icon/icon';
import { PERIOD_FILTER_OPTIONS } from '../../../../shared/data/filter-options.data';
import { MonthlyTrendChart } from '../../components/monthly-trend-chart/monthly-trend-chart';
import {
  ACTIVITY_ITEMS,
  DOMAIN_STATS,
  KPI_STATS,
} from '../../../../shared/data/admin-mock.data';

@Component({
  selector: 'app-dashboard-page',
  imports: [KpiCard, AppIcon, AppButton, AppDropdown, MonthlyTrendChart],
  templateUrl: './dashboard-page.html',
})
export class DashboardPage {
  readonly icons = AppIcons;
  readonly kpiStats = KPI_STATS;
  readonly domainStats = DOMAIN_STATS;
  readonly activityItems = ACTIVITY_ITEMS;
  readonly periodOptions = PERIOD_FILTER_OPTIONS;
  selectedPeriod = '6m';

  readonly quickActions = [
    { label: 'Add Domain', icon: AppIcons.addDomain },
    { label: 'Create Coupon', icon: AppIcons.createCoupon },
    { label: 'Manage Prompt', icon: AppIcons.managePrompt },
    { label: 'Security Audit', icon: AppIcons.securityAudit },
  ];
}
