import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppIcon } from '../../../../shared/ui';
import { AppIcons } from '../../../../shared/ui/icon/icon';
import { AuthService } from '../../../../shared/service/auth.service';

@Component({
  selector: 'app-admin-topbar',
  imports: [AppIcon],
  templateUrl: './admin-topbar.html',
})
export class AdminTopbar {
  private readonly authService = inject(AuthService);

  readonly icons = AppIcons;

  @Input() searchPlaceholder = 'Search analytics, users, or logs...';

  @Output() menuToggle = new EventEmitter<void>();

  private readonly authUser = toSignal(this.authService.user$, { initialValue: null });

  readonly profile = computed(() => this.authService.resolveProfile(this.authUser()));
}
