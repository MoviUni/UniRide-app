// src/app/features/pagos/pagos.routes.ts

import { Routes } from '@angular/router';

export const pagosRoutes: Routes = [
  {
    path: 'registrar',
    loadComponent: () => 
      import('./pages/registrar-pago/registrar-pago.component').then(m => m.RegistrarPagoComponent),
    title: 'Registrar Pago'
  },
  {
    path: 'mis-pagos',
    loadComponent: () => 
      import('./pages/mis-pagos/mis-pagos.component').then(m => m.MisPagosComponent),
    title: 'Mis Pagos'
  },
  {
    path: '',
    redirectTo: 'mis-pagos',
    pathMatch: 'full'
  }
];
