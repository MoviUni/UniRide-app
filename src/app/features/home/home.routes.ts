import { Routes } from '@angular/router';
import { PublishRouteComponent } from '../rutas/page/publicar-ruta/publish-route.component';
import { HomeLayoutComponent } from '../../shared/layouts/home-layout';

export const HOME_ROUTES: Routes = [
  // 👇 home/ redirige a landing
  { path: '', redirectTo: 'landing', pathMatch: 'full' },

  // 🔓 Páginas públicas SIN sidebar
  {
    path: 'landing',
    loadComponent: () =>
      import('./page/landing/landing.component').then(
        (m) => m.LandingComponent
      ),
  },
  {
    path: 'nosotros',
    loadComponent: () =>
      import('./page/nosotros/nosotros.component').then(
        (m) => m.NosotrosComponent
      ),
  },
  {
    path: 'servicios',
    loadComponent: () =>
      import('./page/servicios/servicios.component').then(
        (m) => m.ServiciosComponent
      ),
  },

  
];
