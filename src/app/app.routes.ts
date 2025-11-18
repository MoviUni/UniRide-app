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
            }
            
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
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
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
];
