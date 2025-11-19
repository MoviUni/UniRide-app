// role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
  const expectedRole = route.data['role'] as 'CONDUCTOR' | 'PASAJERO';

  const user = this.authService.currentUser();
  if (!user) {
    this.router.navigate(['/home/landing']);
    return false;
  }

  // Normalizamos el rol
  const userRole = 'rol' in user ? user.rol : user.role;

  if (userRole === expectedRole) {
    return true;
  } else {
    this.router.navigate(['/home/landing']);
    return false;
  }
}

}
