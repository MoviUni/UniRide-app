// src/app/features/historial/historial.routes.ts
import { Routes } from '@angular/router';
import { RutasPasajeroLayoutComponent } from '@shared/layouts/rutas-pasajero-layout.component';
import { HistorialPasajero } from './pages/historial-pasajero/historial-pasajero';
import { HistorialConductor } from './pages/historial-conductor/historial-conductor';

export const HISTORIAL_ROUTES: Routes = [
  {
    path: '',
    component: RutasPasajeroLayoutComponent,
    children: [
      {
        path: 'pasajero',
        component: HistorialPasajero,
      },
      {
        path: 'conductor',
        component: HistorialConductor,
      }
    ]
  }
];
