import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
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
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];
