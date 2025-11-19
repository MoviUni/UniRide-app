import { Routes } from '@angular/router';
import { RutasLayoutComponent } from '../../shared/layouts/rutas-layout.component';

export const RUTA_ROUTES: Routes = [
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

      // Buscar rutas
      {
        path: 'buscar',
        loadComponent: () =>
          import('./page/busqueda/busqueda.component')
            .then(m => m.BusquedaRutasComponent),
      },

      // Gestionar solicitudes de una ruta
      {
        path: ':idRuta/solicitudes',
        loadComponent: () =>
          import('./page/gestionar-viaje/gestionar-viaje.component')
            .then(m => m.GestionarViajeComponent),
      },

      // Fallback opcional dentro de /rutas
      {
        path: '**',
        redirectTo: 'estadisticas',
      },
    ],
  },
];
