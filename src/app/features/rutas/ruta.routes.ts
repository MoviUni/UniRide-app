import { Routes } from '@angular/router';

export const RUTA_ROUTES: Routes = [
  // 1) /rutas  → redirige a /rutas/estadisticas
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'estadisticas'
  },
  // 2) Estadísticas (pantalla de tu compañera)
  {
    path: 'estadisticas',
    loadComponent: () =>
      import('./page/estadisticas/estadisticas.component')
        .then(m => m.EstadisticasComponent)
  },
  // 3) Tus rutas como conductor
  {
    path: 'mis-rutas',
    loadComponent: () =>
      import('./page/rutas-conductor/rutas-conductor.component')
        .then(m => m.RutasConductorComponent)
  },
    {
    path: 'buscar',
    loadComponent: () =>
      import('./page/busqueda/busqueda.component')
        .then(m => m.BusquedaRutasComponent)
  },
  // 4) Gestionar solicitudes de una ruta
  {
    path: ':idRuta/solicitudes',
    loadComponent: () =>
      import('./page/gestionar-viaje/gestionar-viaje.component')
        .then(m => m.GestionarViajeComponent)   // <-- nombre de la CLASE
  }
];
