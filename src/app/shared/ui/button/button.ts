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
      return 'admin-header__icon-btn';
    }

    const classes = ['admin-btn', `admin-btn--${this.variant}`];

    if (this.fullWidth) {
      classes.push('admin-btn--full');
    }

    return classes.join(' ');
  }
}
