import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AppIcon, AppIcons } from '../../shared/ui/icon/icon';
import { AppTooltip } from '../../shared/ui/tooltip/tooltip';
import {
  FOOTER_NAVIGATION,
  MAIN_NAVIGATION,
} from '../../core/constants/navigation';
import { AuthService } from '../../shared/service/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterLink, RouterLinkActive, AppIcon, AppTooltip],
  templateUrl: './admin-sidebar.html',
})
export class AdminSidebar {
  readonly icons = AppIcons;
  readonly mainNav = MAIN_NAVIGATION;
  readonly footerNav = FOOTER_NAVIGATION;

  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  
  @Input() collapsed = false;
  @Input() productName = 'InterviewAI';

  @Output() toggleCollapse = new EventEmitter<void>();

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    }).catch(err => {
      console.error(err);
    });
  }
}
