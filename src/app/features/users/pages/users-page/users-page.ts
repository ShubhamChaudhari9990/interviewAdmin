import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { AppButton, AppDropdown, AppIcon, AppPagination } from '../../../../shared/ui';
import { AppIcons } from '../../../../shared/ui/icon/icon';
import {
  USER_DOMAIN_FILTER_OPTIONS,
  USER_PLAN_FILTER_OPTIONS,
  USER_STATUS_FILTER_OPTIONS,
} from '../../../../shared/data/filter-options.data';
import { MOCK_USERS } from '../../../../shared/data/admin-mock.data';
import { AdminUser } from '../../../../core/models/user.model';

@Component({
  selector: 'app-users-page',
  imports: [TableModule, ProgressBarModule, AppIcon, AppButton, AppDropdown, AppPagination],
  templateUrl: './users-page.html',
})
export class UsersPage {
  readonly icons = AppIcons;
  readonly users = MOCK_USERS;
  readonly statusOptions = USER_STATUS_FILTER_OPTIONS;
  readonly planOptions = USER_PLAN_FILTER_OPTIONS;
  readonly domainOptions = USER_DOMAIN_FILTER_OPTIONS;

  currentPage = 1;
  readonly paginationPages = [1, 2, 3];
  readonly totalUsers = 1284;

  statusFilter = 'all';
  planFilter = 'all';
  domainFilter = 'all';

  planClass(plan: AdminUser['plan']): string {
    return {
      Enterprise: 'bg-violet-100 text-violet-700',
      Pro: 'bg-blue-100 text-blue-700',
      Free: 'bg-slate-100 text-slate-500',
    }[plan];
  }

  statusClass(status: AdminUser['status']): string {
    return status === 'Active'
      ? 'bg-[var(--success-bg)] text-[var(--success)]'
      : 'bg-[var(--danger-bg)] text-[var(--danger)]';
  }

  interviewProgress(user: AdminUser): number {
    return Math.round((user.totalInterviews / user.interviewCapacity) * 100);
  }
}
