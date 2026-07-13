import { Component, Input } from '@angular/core';
import { KpiStat } from '../../../core/models/dashboard.model';
import { AppIcon } from '../icon/icon';

@Component({
  selector: 'app-kpi-card',
  imports: [AppIcon],
  template: `
    <article class="admin-card admin-kpi-card">
      <div class="admin-kpi-card__top">
        <span class="admin-kpi-card__icon">
          <app-icon [icon]="stat.icon" [size]="18" />
        </span>
        <span
          class="admin-kpi-card__trend"
          [class.admin-kpi-card__trend--up]="stat.trendDirection === 'up'"
          [class.admin-kpi-card__trend--down]="stat.trendDirection === 'down'"
        >
          {{ stat.trend }}
        </span>
      </div>
      <p class="stat-label">{{ stat.label }}</p>
      <strong class="stat-value">{{ stat.value }}</strong>
    </article>
  `,
})
export class KpiCard {
  @Input({ required: true }) stat!: KpiStat;
}
