<<<<<<< HEAD
import { Routes } from '@angular/router';

export const HOME_ROUTES: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
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
=======
// src/app/features/home/home.routes.ts
import { Routes } from '@angular/router';
import { MyRoutesComponent } from './pages/my-routes.component';
import { PublishRouteComponent } from './pages/publish-route.component';
import { ManageTripComponent } from './pages/manage-trip.component';

export const HOME_ROUTES: Routes = [
  { path: 'mis-rutas', component: MyRoutesComponent },
  { path: 'publicar-ruta', component: PublishRouteComponent },
  { path: 'gestionar-viaje/:id', component: ManageTripComponent },
];
>>>>>>> feature/modulo-2
