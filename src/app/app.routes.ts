import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './shared/layouts/auth-layout.component';
import { LandingLayoutComponent } from './shared/layouts/landing-layout.component';
import { RoleGuard } from '@core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home/landing', pathMatch: 'full' },

  //  Landing page pública
  {
    path: 'home',
    component: LandingLayoutComponent,
    loadChildren: () =>
      import('./features/home/home.routes').then(m => m.HOME_ROUTES),
  },

  // Auth pública (login / registro)
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },

  // Rutas protegidas (dashboard del conductor)
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'main',
        loadChildren: () =>
        import('./features/main-page/main.routes').then(m => m.MAIN_ROUTES),
      },
      {
        path: 'rutas',
        loadChildren: () =>
          import('./features/rutas/ruta.routes').then(m => m.RUTA_ROUTES),
      },
      {
        path: 'solicitudes',
        loadChildren: () =>
          import('./features/solicitudes/solicitud.routes').then(m => m.SOLICITUD_ROUTES),
      },
      {
        path: 'main',
        loadChildren: () =>
          import('./features/main-page/main.routes').then(m => m.MAIN_ROUTES),
      }
    ],
  },

  //  Ruta de inicio → landing
  { path: '', pathMatch: 'full', redirectTo: 'home/landing' },

  // ⭐ Catch-all
  { path: '**', redirectTo: 'home/landing' }
];
