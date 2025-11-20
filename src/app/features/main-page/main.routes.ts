import { Routes } from '@angular/router';
import { RutasLayoutComponent } from '../../shared/layouts/rutas-layout.component';


export const MAIN_ROUTES: Routes = [
    { 
      path: '',
          component: RutasLayoutComponent,   // 👈 aquí va el layout con sidebar
          children: [
    {
      path: '', redirectTo: 'landing', pathMatch: 'full' },
    {
    path: 'pasajero',
    loadComponent: () => import('./page/main-pasajero/main.pasajero.component').then((m) => m.MainPagePasajeroComponent)    
    },
    {
    path: 'conductor',
    loadComponent: () => import('./page/main-conductor/main.conductor.component').then((m) => m.MainPageConductorComponent)    
    },
   ],
  },
];