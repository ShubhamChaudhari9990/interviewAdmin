import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';
import { AdminTopbar } from './components/admin-topbar/admin-topbar';
import { AppToastContainer, AppLoaderOverlay } from '../../shared/ui';

export interface TopbarConfig {
  searchPlaceholder: string;
}

const DEFAULT_TOPBAR: TopbarConfig = {
  searchPlaceholder: 'Search users, interviews, or plans...',
};

const SUBSCRIPTIONS_TOPBAR: TopbarConfig = {
  searchPlaceholder: 'Search plans...',
};

const FAQ_TOPBAR: TopbarConfig = {
  searchPlaceholder: 'Search FAQ...',
};

const USERS_TOPBAR: TopbarConfig = {
  searchPlaceholder: 'Global search...',
};

const INTERVIEWS_TOPBAR: TopbarConfig = {
  searchPlaceholder: 'Search interviews...',
};

const MASTER_DATA_TOPBAR: TopbarConfig = {
  searchPlaceholder: 'Search interview domains...',
};

function resolveTopbar(url: string): TopbarConfig {
  if (url.startsWith('/admin/interviews')) {
    return INTERVIEWS_TOPBAR;
  }

  if (url.startsWith('/admin/master-data')) {
    return MASTER_DATA_TOPBAR;
  }

  if (url.startsWith('/admin/users')) {
    return USERS_TOPBAR;
  }

  if (url.startsWith('/admin/subscriptions')) {
    return SUBSCRIPTIONS_TOPBAR;
  }

  if (url.startsWith('/admin/faq')) {
    return FAQ_TOPBAR;
  }

  return DEFAULT_TOPBAR;
}

@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, AdminSidebar, AdminTopbar, AppToastContainer, AppLoaderOverlay],
  templateUrl: './admin-shell.html',
})
export class AdminShell {
  private readonly router = inject(Router);

  readonly sidebarCollapsed = signal(false);
  readonly mobileNavOpen = signal(false);

  readonly topbar = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      tap(() => this.closeMobileNav()),
      startWith(null),
      map(() => resolveTopbar(this.router.url)),
    ),
    { initialValue: DEFAULT_TOPBAR },
  );

  toggleSidebar(): void {
    this.sidebarCollapsed.update((collapsed) => !collapsed);
  }

  toggleMobileNav(): void {
    this.mobileNavOpen.update((open) => !open);
  }

  closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (typeof window !== 'undefined' && window.innerWidth > 1024) {
      this.closeMobileNav();
    }
  }
}
