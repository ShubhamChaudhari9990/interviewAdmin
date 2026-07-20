import { NavigationItem } from '../models/navigation-item.model';
import { AppIcons } from '../../shared/ui/icon/icon';

export const MAIN_NAVIGATION: NavigationItem[] = [
  { label: 'Dashboard', route: '/admin/dashboard', icon: AppIcons.dashboard },
  { label: 'User Management', route: '/admin/users', icon: AppIcons.users },
  { label: 'Interview Management', route: '/admin/interviews', icon: AppIcons.interviews },
  { label: 'Master Data', route: '/admin/master-data', icon: AppIcons.masterData },
  { label: 'FAQ', route: '/admin/faq', icon: AppIcons.faq },
  { label: 'Subscriptions', route: '/admin/subscriptions', icon: AppIcons.subscriptions },
  
];

export const FOOTER_NAVIGATION: NavigationItem[] = [
  { label: 'Sign Out', route: '/sign-out', icon: AppIcons.signOut, danger: true },
];
