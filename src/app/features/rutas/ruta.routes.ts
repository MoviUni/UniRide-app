import { Routes } from '@angular/router';

export const RUTA_ROUTES: Routes = [
    {
    path: '',
    loadComponent: () => import('./page/estadisticas/estadisticas.component').then((m) => m.EstadisticasComponent)
    }
];  