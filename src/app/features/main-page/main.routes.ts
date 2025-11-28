import { Routes } from '@angular/router';

export const MAIN_ROUTES: Routes = [
<<<<<<< Updated upstream
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
=======
  {
    path: 'conductor',
      component: RutasLayoutComponent,   // 👈 aquí va el layout con sidebar
      children: [
        {
          path: '',
          loadComponent: () => import('./page/main-conductor/main.conductor.component').then((m) => m.MainPageConductorComponent)
        },
    ],
  },
  {
    path: 'pasajero',
      component: RutasPasajeroLayoutComponent,   // 👈 aquí va el layout con sidebar
      children: [
        {
          path: '',
          loadComponent: () => import('./page/main-pasajero/main.pasajero.component').then((m) => m.MainPagePasajeroComponent)
        }
    ],
  },
];
>>>>>>> Stashed changes
