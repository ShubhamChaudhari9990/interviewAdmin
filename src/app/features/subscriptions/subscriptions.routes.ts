import { Routes } from '@angular/router';

export const subscriptionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/subscriptions-page/subscriptions-page').then((m) => m.SubscriptionsPage),
  },
];
