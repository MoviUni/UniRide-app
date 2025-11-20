import { Routes } from '@angular/router';
import { RutasLayoutComponent } from '../../shared/layouts/rutas-layout.component';
import { RutasPasajeroLayoutComponent } from '@shared/layouts/rutas-pasajero-layout.component';


export const MAIN_ROUTES: Routes = [
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