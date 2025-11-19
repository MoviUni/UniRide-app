import { Routes } from '@angular/router';
import { MyRoutesComponent } from './pages/my-routes.component';
import { PublishRouteComponent } from './pages/publish-route.component';
import { ManageTripComponent } from './pages/manage-trip.component';
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

  // 🔐 Zona “app” CON sidebar (mis rutas, publicar, gestionar)
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      { path: 'mis-rutas', component: MyRoutesComponent },
      { path: 'publicar-ruta', component: PublishRouteComponent },
      { path: 'gestionar-viaje/:id', component: ManageTripComponent },
    ],
  },
];
