import { Routes } from '@angular/router';
import { RutasPasajeroLayoutComponent } from '../../shared/layouts/rutas-pasajero-layout.component';

export const PERFIL_PASAJERO_ROUTES: Routes = [
  {
    path: '',
    component: RutasPasajeroLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/perfil-pasajero.component').then(
            (m) => m.PerfilPasajero
          ),
      },
    ],
  },
];
