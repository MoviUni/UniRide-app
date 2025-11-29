import { Routes } from '@angular/router';
import { RutasPasajeroLayoutComponent } from '../../shared/layouts/rutas-pasajero-layout.component';

export const PERFIL_CONDUCTOR_ROUTES: Routes = [
  {
    path: '',
    component: RutasPasajeroLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/perfil-conductor').then(
            (m) => m.PerfilConductor
          ),
      },
    ],
  },
];
