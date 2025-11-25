import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const expectedRole = route.data['role'] as 'CONDUCTOR' | 'PASAJERO';
    const user = this.authService.currentUser();

    // 1. Usuario no logueado
    if (!user) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    // 2. Obtenemos su rol REAL
    const userRole = user.rol;  // 👈 YA NO NECESITAMOS NADA MÁS

    // 3. Coincide?
    if (userRole === expectedRole) {
      return true;
    }

    // 4. No coincide → redirigir
    this.router.navigate(['/home/landing']);
    return false;
  }
}
