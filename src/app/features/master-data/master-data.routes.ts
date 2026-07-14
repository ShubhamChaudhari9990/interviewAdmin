import { Routes } from '@angular/router';

export const masterDataRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/master-data-page/master-data-page').then((m) => m.MasterDataPage),
  },
];
