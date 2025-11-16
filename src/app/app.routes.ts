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
                path:'main',
                loadChildren: () => import('./features/main-page/main.routes').then((m) => m.MAIN_ROUTES)
            }
            
        ]
    },
    {
        path: '**', 
        redirectTo: '/  ' //aquí muestra la ruta por defecto
    }
];
