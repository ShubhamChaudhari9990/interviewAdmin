import type { AppIconDefinition } from '../../shared/ui/icon/icon';
import { AppIcons } from '../../shared/ui/icon/icon';

export interface NavigationItem {
  label: string;
  route: string;
  icon: AppIconDefinition;
  danger?: boolean;
}

export { AppIcons };
