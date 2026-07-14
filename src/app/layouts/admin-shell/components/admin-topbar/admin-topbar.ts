import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui';
import { AppIcons } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-admin-topbar',
  imports: [AppIcon],
  templateUrl: './admin-topbar.html',
})
export class AdminTopbar {
  readonly icons = AppIcons;

  @Input() searchPlaceholder = 'Search analytics, users, or logs...';
  @Input() userName = 'Alex Rivera';
  @Input() userRole = 'Super Admin';
  @Input() userAvatar = 'https://i.pravatar.cc/80?u=alex-admin';

  @Output() menuToggle = new EventEmitter<void>();
}
