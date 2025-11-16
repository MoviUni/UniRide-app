import { Routes } from '@angular/router';
import { PublishRouteComponent } from './pages/publish-route.component';
import { MyRoutesComponent } from './pages/my-routes.component';

export const HOME_ROUTES: Routes = [
  {
    path: 'publicar-ruta',
    component: PublishRouteComponent,
  },
  {
    path: 'mis-rutas',
    component: MyRoutesComponent,
  },
];
