// src/app/features/configuracion/configuracion.routes.ts

import { Routes } from '@angular/router';

export const CONFIGURACION_ROUTES: Routes = [
  {
    path: 'pasajero',
    loadComponent: () =>
      import('./pages/configuracion-pasajero/configuracion-pasajero.component').then(
        (m) => m.ConfiguracionPasajeroComponent
      )
  },
  {
    path: 'conductor',
    loadComponent: () =>
      import('./pages/configuracion-conductor/configuracion-conductor.component').then(
        (m) => m.ConfiguracionConductorComponent
      )
  },
  {
    path: 'vehiculo',
    loadComponent: () =>
      import('./pages/configuracion-vehiculo/configuracion-vehiculo.component').then(
        (m) => m.ConfiguracionVehiculoComponent
      )
  },
  {
    path: '',
    redirectTo: 'pasajero',
    pathMatch: 'full'
  }
];
