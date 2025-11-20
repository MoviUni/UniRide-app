import { Routes } from '@angular/router';
import { RutasPasajeroLayoutComponent } from '@shared/layouts/rutas-pasajero-layout.component';

export const SOLICITUD_ROUTES: Routes = [
    {
        path: 'pasajero',
        component: RutasPasajeroLayoutComponent,
        children: [
          {
            path: 'estados',
            loadComponent: () => import('./pages/pasajero-solicitudes/pasajero.solicitudes.component').then((m) => m.PasajeroSolicitudesComponent)
            }
        ]
      },
    
];