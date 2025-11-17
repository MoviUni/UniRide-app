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
