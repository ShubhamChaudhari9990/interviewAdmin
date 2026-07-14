import { Component, Input } from '@angular/core';
import { AppIconDefinition } from '../icon/icon';
import { AppIcon } from '../icon/icon';

export type ButtonVariant =
  | 'primary'
  | 'outline'
  | 'icon'
  | 'ghost'
  | 'white'
  | 'white-outline'
  | 'soft'
  | 'danger';

const BUTTON_BASE =
  'admin-btn inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[length:var(--type-sm)] font-semibold cursor-pointer transition disabled:cursor-not-allowed disabled:opacity-55 md:px-4';

const BUTTON_VARIANTS: Record<Exclude<ButtonVariant, 'icon'>, string> = {
  primary: 'border-0 bg-[var(--color-primary)] text-[var(--color-primary-foreground)]',
  outline:
    'border border-[var(--card-border)] bg-[var(--color-surface)] text-[var(--text-heading)]',
  ghost: 'border-0 bg-transparent text-[var(--color-primary)]',
  white: 'border-0 bg-white text-[var(--text-heading)]',
  'white-outline': 'border border-white/45 bg-transparent text-white',
  soft: 'border-0 bg-blue-50 text-blue-600',
  danger: 'border-0 bg-[var(--danger)] text-white',
};

@Component({
  selector: 'app-button',
  imports: [AppIcon],
  template: `
    <button
      [type]="type"
      [class]="hostClass"
      [disabled]="disabled"
      [attr.aria-label]="ariaLabel"
      [attr.form]="form || null"
    >
      @if (icon) {
        <app-icon [icon]="icon" [size]="iconSize" [color]="iconColor" />
      }
      <ng-content />
    </button>
  `,
})
export class AppButton {
  @Input() variant: ButtonVariant = 'outline';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() icon?: AppIconDefinition;
  @Input() iconSize = 16;
  @Input() iconColor = 'currentColor';
  @Input() disabled = false;
  @Input() ariaLabel?: string;
  @Input() fullWidth = false;
  /** Associates a submit button with a form outside the button's DOM tree. */
  @Input() form?: string;

  get hostClass(): string {
    if (this.variant === 'icon') {
      return 'admin-header__icon-btn inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--color-surface)] text-[var(--text-subtle)] max-md:size-8';
    }

    const classes = [BUTTON_BASE, BUTTON_VARIANTS[this.variant]];

    if (this.fullWidth) {
      classes.push('w-full');
    }

    return classes.join(' ');
  }
}
