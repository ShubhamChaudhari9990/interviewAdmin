import { Component, Input } from '@angular/core';
import { KpiStat } from '../../../core/models/dashboard.model';
import { AppIcon } from '../icon/icon';

@Component({
  selector: 'app-kpi-card',
  imports: [AppIcon],
  template: `
    <article
      class="rounded-[var(--shell-radius)] border border-[var(--card-border)] bg-[var(--color-surface)] p-5 shadow-[var(--card-shadow)]"
    >
      <div class="mb-4 flex items-start justify-between">
        <span
          class="inline-flex size-10 items-center justify-center rounded-xl bg-slate-100 text-[var(--color-primary)]"
        >
          <app-icon [icon]="stat.icon" [size]="18" />
        </span>
        <span
          class="rounded-full px-2 py-0.5 text-[length:var(--type-trend)] font-semibold"
          [class.bg-[var(--success-bg)]]="stat.trendDirection === 'up'"
          [class.text-[var(--success)]]="stat.trendDirection === 'up'"
          [class.bg-[var(--danger-bg)]]="stat.trendDirection === 'down'"
          [class.text-[var(--danger)]]="stat.trendDirection === 'down'"
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
