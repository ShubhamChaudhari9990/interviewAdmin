import { Component, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { AppButton, AppIcon, AppPagination } from '../../../../shared/ui';
import { AppIcons } from '../../../../shared/ui/icon/icon';
import { Interview } from '../../../../core/models/interview.model';
import {
  INTERVIEW_STATS,
  INTERVIEW_SUMMARY,
  MOCK_INTERVIEWS,
} from '../../../../shared/data/interviews-mock.data';

type InterviewTab = 'all' | 'completed' | 'in-progress';

@Component({
  selector: 'app-interviews-page',
  imports: [DecimalPipe, TableModule, AppIcon, AppButton, AppPagination],
  templateUrl: './interviews-page.html',
})
export class InterviewsPage {
  readonly icons = AppIcons;
  readonly summary = INTERVIEW_SUMMARY;
  readonly stats = INTERVIEW_STATS;
  readonly interviews = MOCK_INTERVIEWS;

  readonly activeTab = signal<InterviewTab>('all');
  currentPage = 1;
  readonly paginationPages = [1, 2, 3, 124];
  readonly totalEntries = 1240;

  readonly tabs: { id: InterviewTab; label: string }[] = [
    { id: 'all', label: 'All Interviews' },
    { id: 'completed', label: 'Completed' },
    { id: 'in-progress', label: 'In Progress' },
  ];

  setTab(tab: InterviewTab): void {
    this.activeTab.set(tab);
  }

  filteredInterviews(): Interview[] {
    const tab = this.activeTab();

    if (tab === 'completed') {
      return this.interviews.filter((item) => item.status === 'Completed');
    }

    if (tab === 'in-progress') {
      return this.interviews.filter((item) => item.status === 'In Progress');
    }

    return this.interviews;
  }

  typeIcon(type: Interview['type']) {
    return type === 'AI-Voice' ? AppIcons.aiVoice : AppIcons.textBased;
  }

  scoreClass(level: Interview['scoreLevel']): string {
    return {
      high: 'bg-[var(--success-bg)] text-[var(--success)]',
      medium: 'bg-[var(--warning-bg)] text-[var(--warning)]',
      low: 'bg-[var(--danger-bg)] text-[var(--danger)]',
      na: 'bg-slate-100 text-slate-500',
    }[level];
  }

  statusClass(status: Interview['status']): string {
    return status === 'Completed'
      ? 'bg-[var(--success-bg)] text-[var(--success)] before:mr-1.5 before:inline-block before:size-1.5 before:rounded-full before:bg-current before:content-[\'\']'
      : 'bg-[var(--info-bg)] text-[var(--info)] before:mr-1.5 before:inline-block before:size-1.5 before:rounded-full before:bg-current before:content-[\'\']';
  }

  scoreLabel(interview: Interview): string {
    return interview.score === null ? 'N/A' : `${interview.score}%`;
  }

  statIconTone(tone: string): string {
    return (
      {
        purple: 'bg-violet-100 text-violet-700',
        rose: 'bg-rose-100 text-rose-600',
        blue: 'bg-blue-100 text-blue-600',
        amber: 'bg-orange-100 text-amber-600',
      }[tone] ?? 'bg-slate-100 text-slate-600'
    );
  }
}
