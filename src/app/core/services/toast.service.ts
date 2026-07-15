import { Injectable, signal } from '@angular/core';
import type { ToastMessage, ToastOptions, ToastVariant } from '../models/toast.model';

const DEFAULT_DURATION: Record<ToastVariant, number> = {
  success: 4000,
  error: 6000,
  warning: 5000,
  info: 4000,
};

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

  readonly toasts = signal<ToastMessage[]>([]);

  success(title: string, message?: string, duration?: number): void {
    this.show('success', { title, message, duration });
  }

  error(title: string, message?: string, duration?: number): void {
    this.show('error', { title, message, duration });
  }

  warning(title: string, message?: string, duration?: number): void {
    this.show('warning', { title, message, duration });
  }

  info(title: string, message?: string, duration?: number): void {
    this.show('info', { title, message, duration });
  }

  show(variant: ToastVariant, options: ToastOptions): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const duration = options.duration ?? DEFAULT_DURATION[variant];

    const toast: ToastMessage = {
      id,
      variant,
      title: options.title,
      message: options.message,
      duration,
    };

    this.toasts.update((items) => [...items, toast]);
    this.scheduleDismiss(id, duration);
  }

  dismiss(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    this.toasts.update((items) => items.filter((item) => item.id !== id));
  }

  clear(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.toasts.set([]);
  }

  private scheduleDismiss(id: string, duration: number): void {
    const timer = setTimeout(() => this.dismiss(id), duration);
    this.timers.set(id, timer);
  }
}
