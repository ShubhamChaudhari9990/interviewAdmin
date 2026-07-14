import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppIcon, AppIcons } from '../../shared/ui/icon/icon';
import { AppTooltip } from '../../shared/ui/tooltip/tooltip';
import {
  FOOTER_NAVIGATION,
  MAIN_NAVIGATION,
} from '../../core/constants/navigation';

@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterLink, RouterLinkActive, AppIcon, AppTooltip],
  templateUrl: './admin-sidebar.html',
})
export class AdminSidebar {
  readonly icons = AppIcons;
  readonly mainNav = MAIN_NAVIGATION;
  readonly footerNav = FOOTER_NAVIGATION;

  @Input() collapsed = false;
  @Input() productName = 'InterviewAI';

  @Output() toggleCollapse = new EventEmitter<void>();
}
