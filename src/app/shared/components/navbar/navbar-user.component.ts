import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { RoleType } from '@core/models/usuario.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.css']
})
export class NavbarComponent {

  // links que usará el template
  perfilLink = '/auth/login';
  configLink = '/auth/login';

  constructor(private authService: AuthService) {
    const role = this.authService.getUserRole();

    if (role === RoleType.ROLE_CONDUCTOR) {
      this.perfilLink = '/rutas/perfil-conductor';
      this.configLink = '/rutas/configuracion-conductor';
    } else if (role === RoleType.ROLE_PASAJERO) {
      this.perfilLink = '/rutas/perfil-pasajero';
      this.configLink = '/rutas/configuracion-pasajero';
    }
  }
}
