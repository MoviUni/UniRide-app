import { Routes } from '@angular/router';

export const HOME_ROUTES: Routes = [
  {
    path: 'landing',
    loadComponent: () => import('./page/landing/landing.component').then((m) => m.LandingComponent)    
    },
    {
    path: 'nosotros',
    loadComponent: () => import('./page/nosotros/nosotros.component').then((m) => m.NosotrosComponent)
    },
    {
    path: 'servicios',
    loadComponent: () => import('./page/servicios/servicios.component').then((m) => m.ServiciosComponent)
    }
];