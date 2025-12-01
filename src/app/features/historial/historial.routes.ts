// src/app/features/historial/historial.routes.ts
import { Routes } from '@angular/router';
import { RutasPasajeroLayoutComponent } from '@shared/layouts/rutas-pasajero-layout.component';
import { RutasLayoutComponent } from '@shared/layouts/rutas-layout.component';
import { HistorialPasajero } from './pages/historial-pasajero/historial-pasajero.component';
import { HistorialConductor } from './pages/historial-conductor/historial-conductor.component';

export const HISTORIAL_ROUTES: Routes = [
  {
    path: 'pasajero',
    component: RutasPasajeroLayoutComponent,
    children: [
      {
        path: '',
        component: HistorialPasajero,
      }
    ]
  },
  {
    path: 'conductor',
    component: RutasLayoutComponent,
    children: [
      {
        path: '',
        component: HistorialConductor,
      }
    ]
  }
];
