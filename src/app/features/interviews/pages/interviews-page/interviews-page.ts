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
  styleUrl: './interviews-page.css',
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
      high: 'admin-badge--score-high',
      medium: 'admin-badge--score-medium',
      low: 'admin-badge--score-low',
      na: 'admin-badge--score-na',
    }[level];
  }

  statusClass(status: Interview['status']): string {
    return status === 'Completed'
      ? 'admin-badge--status-completed admin-badge--dot'
      : 'admin-badge--status-progress admin-badge--dot';
  }

  scoreLabel(interview: Interview): string {
    return interview.score === null ? 'N/A' : `${interview.score}%`;
  }

  statIconTone(tone: string): string {
    return `interviews-stat-card__icon--${tone}`;
  }
}
