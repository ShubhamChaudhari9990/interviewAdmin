import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import type { ToastMessage, ToastVariant } from '../../../core/models/toast.model';
import { AppButton, AppIcon } from '..';
import { AppIcons } from '../icon/icon';

interface ToastStyle {
  container: string;
  icon: (typeof AppIcons)[keyof typeof AppIcons];
  iconClass: string;
}

const TOAST_STYLES: Record<ToastVariant, ToastStyle> = {
  success: {
    container: 'border-[color-mix(in_srgb,var(--success)_25%,var(--card-border))] bg-[var(--success-bg)]',
    icon: AppIcons.checkCircle,
    iconClass: 'text-[var(--success)]',
  },
  error: {
    container: 'border-[color-mix(in_srgb,var(--danger)_25%,var(--card-border))] bg-[var(--danger-bg)]',
    icon: AppIcons.alertTriangle,
    iconClass: 'text-[var(--danger)]',
  },
  warning: {
    container: 'border-[color-mix(in_srgb,var(--warning)_25%,var(--card-border))] bg-[var(--warning-bg)]',
    icon: AppIcons.alertTriangle,
    iconClass: 'text-[var(--warning)]',
  },
  info: {
    container: 'border-[color-mix(in_srgb,var(--info)_25%,var(--card-border))] bg-[var(--info-bg)]',
    icon: AppIcons.info,
    iconClass: 'text-[var(--info)]',
  },
};

@Component({
  selector: 'app-toast-container',
  imports: [AppIcon, AppButton],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.css',
})
export class AppToastContainer {
  private readonly toastService = inject(ToastService);

  readonly icons = AppIcons;
  readonly toasts = this.toastService.toasts;

  styleFor(toast: ToastMessage): ToastStyle {
    return TOAST_STYLES[toast.variant];
  }

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
