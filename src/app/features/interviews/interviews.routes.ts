import { Routes } from '@angular/router';

export const interviewsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/interviews-page/interviews-page').then((m) => m.InterviewsPage),
  },
];
