import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente / red
        errorMessage = error.error.message;
      } else {
        errorMessage = error.message || errorMessage;

        // 401 → sin autenticación / token inválido
        if (error.status === 401 || error.status === 0) {
          console.warn('[HTTP 401] Cerrando sesión y yendo al login');
          authService.logout();
          // tu login REAL está en /auth/login
          router.navigate(['/auth/login']);
        }

        // 403 → autenticado pero sin permisos
        if (error.status === 403) {
          console.warn('[HTTP 403] Sin permisos, redirigiendo al inicio');
          router.navigate(['/']);
        }
      }

      console.error('[HTTP ERROR]', errorMessage, error);
      return throwError(() => error);
    })
  );
};
