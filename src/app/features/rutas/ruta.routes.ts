import { Routes } from '@angular/router';
import { RutasLayoutComponent } from '../../shared/layouts/rutas-layout.component';
import { RutasPasajeroLayoutComponent } from '@shared/layouts/rutas-pasajero-layout.component';


export const RUTA_ROUTES: Routes = [
  {
    path: 'pasajero',
    component: RutasPasajeroLayoutComponent,
    children: [
      {
        path: 'buscar',
        loadComponent: () => import('./page/busqueda/busqueda.component').then(m => m.BusquedaRutasComponent),
      },
    ]
  },
  {
    path: '',
    component: RutasPasajeroLayoutComponent,
    children: [
      {
        path: 'configuracion-pasajero',
        loadComponent: () =>
          import('../configuracion/pages/configuracion-pasajero/configuracion-pasajero.component')
            .then(m => m.ConfiguracionPasajeroComponent),
      },
      {
        path: 'perfil-pasajero',
        loadComponent: () =>
          import('../pasajero/pages/perfil-pasajero.component')
            .then(m => m.PerfilPasajero),
      },
    ]
  },
  {
    path: '',
    component: RutasLayoutComponent,   // 👈 aquí va el layout con sidebar
    children: [
      // /rutas -> /rutas/estadisticas
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'estadisticas',
      },

      // Estadísticas
      {
        path: 'estadisticas',
        loadComponent: () =>
          import('./page/estadisticas/estadisticas.component')
            .then(m => m.EstadisticasComponent),
      },

      // Mis rutas como conductor
      {
        path: 'mis-rutas',
        loadComponent: () =>
          import('./page/rutas-conductor/rutas-conductor.component')
            .then(m => m.RutasConductorComponent),
      },

      // Publicar ruta
      {
        path: 'publicar-ruta',
        loadComponent: () =>
          import('./page/publicar-ruta/publish-route.component')
            .then(m => m.PublishRouteComponent),
      },


      // Gestionar solicitudes de una ruta
      {
        path: ':idRuta/solicitudes',
        loadComponent: () =>
          import('./page/gestionar-viaje/gestionar-viaje.component')
            .then(m => m.GestionarViajeComponent),
      },

      // Perfil conductor
      {
        path: 'perfil-conductor',
        loadComponent: () =>
          import('../conductor/pages/perfil-conductor.component')
            .then(m => m.PerfilConductor),
      },

      // Configuración conductor
      {
        path: 'configuracion-conductor',
        loadComponent: () =>
          import('../configuracion/pages/configuracion-conductor/configuracion-conductor.component')
            .then(m => m.ConfiguracionConductorComponent),
      },

      // Configuración vehículo
      {
        path: 'configuracion-vehiculo',
        loadComponent: () =>
          import('../configuracion/pages/configuracion-vehiculo/configuracion-vehiculo.component')
            .then(m => m.ConfiguracionVehiculoComponent),
      },

      // Fallback opcional dentro de /rutas
      {
        path: '**',
        redirectTo: 'estadisticas',
      },
    ],
  },
  
  
];
