import { NavigationItem } from '../models/navigation-item.model';
import { AppIcons } from '../../shared/ui/icon/icon';

export const MAIN_NAVIGATION: NavigationItem[] = [
  { label: 'Dashboard', route: '/dashboard', icon: AppIcons.dashboard },
  { label: 'User Management', route: '/users', icon: AppIcons.users },
  { label: 'Interview Management', route: '/interviews', icon: AppIcons.interviews },
  { label: 'Master Data', route: '/master-data', icon: AppIcons.masterData },
  { label: 'AI Management', route: '/ai-management', icon: AppIcons.aiManagement },
  { label: 'Subscriptions', route: '/subscriptions', icon: AppIcons.subscriptions },
  { label: 'Analytics', route: '/analytics', icon: AppIcons.analytics },
  { label: 'Logs', route: '/logs', icon: AppIcons.logs },
  { label: 'Settings', route: '/settings', icon: AppIcons.settings },
];

export const FOOTER_NAVIGATION: NavigationItem[] = [
  { label: 'Support', route: '/support', icon: AppIcons.support },
  { label: 'Sign Out', route: '/sign-out', icon: AppIcons.signOut, danger: true },
];
