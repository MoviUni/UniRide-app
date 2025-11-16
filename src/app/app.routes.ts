import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.routes').then(m => m.HOME_ROUTES),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',   // que abra el login al inicio
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
