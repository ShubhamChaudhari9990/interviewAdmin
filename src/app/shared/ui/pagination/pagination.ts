import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppIcons } from '../icon/icon';
import { AppButton } from '../button/button';

export type PaginationNavMode = 'text' | 'icon';

@Component({
  selector: 'app-pagination',
  imports: [AppButton],
  templateUrl: './pagination.html',
})
export class AppPagination {
  readonly icons = AppIcons;

  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Input() totalItems = 0;
  @Input() itemLabel = 'entries';
  @Input() pages: number[] = [1];
  @Input() navMode: PaginationNavMode = 'text';

  @Output() pageChange = new EventEmitter<number>();

  get summary(): string {
    const start = this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalItems);

    return `Showing ${start} to ${end} of ${this.totalItems.toLocaleString()} ${this.itemLabel}`;
  }

  get isFirstPage(): boolean {
    return this.currentPage <= 1;
  }

  get isLastPage(): boolean {
    const lastPage = this.pages[this.pages.length - 1] ?? this.currentPage;
    return this.currentPage >= lastPage;
  }

  goToPage(page: number): void {
    if (page === this.currentPage) {
      return;
    }

    this.pageChange.emit(page);
  }

  goPrevious(): void {
    if (this.isFirstPage) {
      return;
    }

    this.pageChange.emit(this.currentPage - 1);
  }

  goNext(): void {
    if (this.isLastPage) {
      return;
    }

    this.pageChange.emit(this.currentPage + 1);
  }
}
