import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { authGuard } from './shared/auth-guard';

export const routes: Routes = [

  {
    path: 'login',
    component: Login
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./layouts/admin-shell/admin-shell').then((m) => m.AdminShell),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./features/users/users.routes').then((m) => m.usersRoutes),
      },
      {
        path: 'interviews',
        loadChildren: () =>
          import('./features/interviews/interviews.routes').then((m) => m.interviewsRoutes),
      },
      {
        path: 'master-data',
        loadChildren: () =>
          import('./features/master-data/master-data.routes').then((m) => m.masterDataRoutes),
      },
      {
        path: 'subscriptions',
        loadChildren: () =>
          import('./features/subscriptions/subscriptions.routes').then(
            (m) => m.subscriptionsRoutes,
          ),
      },
      {
        path: 'faq',
        loadChildren: () =>
          import('./features/faq/faq.routes').then((m) => m.faqRoutes),
      },
      { path: '**', redirectTo: 'dashboard' },
    ],
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
