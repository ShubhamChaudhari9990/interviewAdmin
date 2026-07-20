import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { AppButton } from '../button/button';
import { AppIcons } from '../icon/icon';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-modal',
  imports: [AppButton],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
  encapsulation: ViewEncapsulation.None,
})
export class AppModal implements OnChanges, OnDestroy {
  readonly icons = AppIcons;

  @Input() open = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() size: ModalSize = 'md';
  @Input() closeOnBackdrop = true;
  @Input() showCloseButton = true;

  @Output() openChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']) {
      this.syncBodyScroll(this.open);
      if (!this.open) {
        this.hideDetachedOverlays();
      }
    }
  }

  ngOnDestroy(): void {
    this.syncBodyScroll(false);
    this.hideDetachedOverlays();
  }

  close(): void {
    if (!this.open) {
      return;
    }

    // Hide body-appended overlays (e.g. p-select) before the modal content is destroyed.
    this.hideDetachedOverlays();
    this.openChange.emit(false);
    this.closed.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.close();
    }
  }

  private syncBodyScroll(locked: boolean): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.body.style.overflow = locked ? 'hidden' : '';
  }

  private hideDetachedOverlays(): void {
    if (typeof document === 'undefined') {
      return;
    }

    document
      .querySelectorAll('.p-select-overlay, .p-datepicker-panel, .p-connected-overlay, .p-overlay')
      .forEach((el) => el.remove());
  }
}
