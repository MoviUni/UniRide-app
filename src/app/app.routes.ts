import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './shared/layouts/auth-layout.component';

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
                path:'login',
                loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
            },
            {
                path:'solicitudes',
                loadChildren: () => import('./features/solicitudes/solicitud.routes').then((m) => m.SOLICITUD_ROUTES)
            }
            
        ]
    },
    {
        path: '**', 
        redirectTo: '' //aquí muestra la ruta por defecto
    }
];
