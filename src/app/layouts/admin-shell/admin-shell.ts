import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';
import { AdminTopbar } from './components/admin-topbar/admin-topbar';

export interface TopbarConfig {
  searchPlaceholder: string;
  userName: string;
  userRole: string;
  userAvatar: string;
}

const DEFAULT_TOPBAR: TopbarConfig = {
  searchPlaceholder: 'Search analytics, users, or logs...',
  userName: 'Alex Rivera',
  userRole: 'Super Admin',
  userAvatar: 'https://i.pravatar.cc/80?u=alex-admin',
};

const USERS_TOPBAR: TopbarConfig = {
  searchPlaceholder: 'Global search...',
  userName: 'Sarah Connor',
  userRole: 'Super Admin',
  userAvatar: 'https://i.pravatar.cc/80?u=sarah-admin',
};

const INTERVIEWS_TOPBAR: TopbarConfig = {
  searchPlaceholder: 'Search interviews...',
  userName: 'Sarah Connor',
  userRole: 'Super Admin',
  userAvatar: 'https://i.pravatar.cc/80?u=sarah-admin',
};

function resolveTopbar(url: string): TopbarConfig {
  if (url.startsWith('/interviews')) {
    return INTERVIEWS_TOPBAR;
  }

  if (url.startsWith('/users')) {
    return USERS_TOPBAR;
  }

  return DEFAULT_TOPBAR;
}

@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, AdminSidebar, AdminTopbar],
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
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      this.closeMobileNav();
    }
  }
}
