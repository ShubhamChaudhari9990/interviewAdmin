export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  variant: ToastVariant;
  title: string;
  message?: string;
  duration: number;
}

export interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
}
