import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
<<<<<<< HEAD
import { authInterceptor } from './core/interceptors/auth.interceptor';
=======
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
>>>>>>> feature/modulo-2

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
<<<<<<< HEAD
      withInterceptors([authInterceptor])
=======
      withInterceptors([authInterceptor, errorInterceptor]),
>>>>>>> feature/modulo-2
    )
  ]
};
