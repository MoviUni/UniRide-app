import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './shared/layouts/auth-layout.component';
import { LandingLayoutComponent } from './shared/layouts/landing-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: AuthLayoutComponent,
        children: [  //Aqui van las rutas que requieren autenticación
            {
                path:'rutas',
                loadChildren: () => import('./features/rutas/ruta.routes').then((m) => m.RUTA_ROUTES)
            },
            {
                path:'solicitudes',
                loadChildren: () => import('./features/solicitudes/solicitud.routes').then((m) => m.SOLICITUD_ROUTES)
            },
            {
                
                path:'main',
                loadChildren: () => import('./features/main-page/main.routes').then((m) => m.MAIN_ROUTES)
            }

<<<<<<< Updated upstream
        ]
    },
    {
        path: 'home',
        component: LandingLayoutComponent,
        loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES)
    },
    {
        path: '**', 
        redirectTo: '/home/landing' //aquí muestra la ruta por defecto
    },
=======
  {
    path: 'home',
    component: LandingLayoutComponent,
    loadChildren: () =>
      import('./features/home/home.routes').then(m => m.HOME_ROUTES),
  },

>>>>>>> Stashed changes
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
<<<<<<< Updated upstream
  {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.routes').then(m => m.HOME_ROUTES),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',   // que abra el login al inicio
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
=======

  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'main',
        loadChildren: () =>
          import('./features/main-page/main.routes').then(m => m.MAIN_ROUTES),
      },
      {
        path: 'rutas',
        loadChildren: () =>
          import('./features/rutas/ruta.routes').then(m => m.RUTA_ROUTES),
      },
      {
        path: 'solicitudes',
        loadChildren: () =>
          import('./features/solicitudes/solicitud.routes').then(m => m.SOLICITUD_ROUTES),
      },
      {
        path: 'historial',
        loadChildren: () =>
          import('./features/historial/historial.routes').then(m => m.HISTORIAL_ROUTES)
      },
      {
        path: 'perfil-pasajero',
        loadChildren: () =>
            import('./features/pasajero/perfil-pasajero.routes').then(m => m.PERFIL_PASAJERO_ROUTES)
      },
      {
        path: 'perfil-conductor',
        loadChildren: () =>
          import('./features/conductor/perfil-conductor.routes')
            .then(m => m.PERFIL_CONDUCTOR_ROUTES)
      }

    ],
  },

  { path: '', pathMatch: 'full', redirectTo: 'home/landing' },

  { path: '**', redirectTo: 'home/landing' }
>>>>>>> Stashed changes
];
