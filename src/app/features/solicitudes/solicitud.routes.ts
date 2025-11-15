import { Routes } from '@angular/router';

export const SOLICITUD_ROUTES: Routes = [
    {
    path: 'pasajero',
    loadComponent: () => import('./pages/pasajero-solicitudes/pasajero.solicitudes.component').then((m) => m.PasajeroSolicitudesComponent)
    }
];