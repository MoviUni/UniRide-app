import { Routes } from '@angular/router';

export const MAIN_ROUTES: Routes = [
    { 
      path: '', redirectTo: 'landing', pathMatch: 'full' },
    {
    path: 'pasajero',
    loadComponent: () => import('./page/main-pasajero/main.pasajero.component').then((m) => m.MainPagePasajeroComponent)    
    },
    {
    path: 'conductor',
    loadComponent: () => import('./page/main-conductor/main.conductor.component').then((m) => m.MainPageConductorComponent)    
    }
    
];