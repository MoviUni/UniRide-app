import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RoleType } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="ur-sidebar">
      <!-- HOME: vista principal según rol -->
      <button
        class="ur-icon-btn"
        type="button"
        aria-label="Inicio"
        (click)="goHome()"
      >
        <span class="ur-icon">
          <img src="assets/sidebar/Casa.png" alt="Inicio" />
        </span>
      </button>

      <div class="ur-divider"></div>

      <!-- JOURNEY → publicar ruta -->
      <button
        class="ur-icon-btn"
        type="button"
        aria-label="Publicar ruta"
        (click)="goPublicarRuta()"
      >
        <span class="ur-icon">
          <img src="assets/sidebar/Journey.png" alt="Publicar ruta" />
        </span>
      </button>

      <div class="ur-divider"></div>

      <!-- SOLICITUDES -->
      <button
        class="ur-icon-btn"
        type="button"
        aria-label="Mis solicitudes"
        (click)="goSolicitudes()"
      >
        <span class="ur-icon">
          <img src="assets/sidebar/Ubicacion.png" alt="Solicitudes" />
        </span>
      </button>

      <div class="ur-divider"></div>

      <!-- HISTORIAL DE VIAJES -->
      <button
        class="ur-icon-btn"
        type="button"
        aria-label="Historial de viajes"
        (click)="goHistorial()"
      >
        <span class="ur-icon">
          <img src="assets/sidebar/Libro.png" alt="Historial" />
        </span>
      </button>

      <div class="ur-divider"></div>

      <!-- PERFIL -->
      <button
        class="ur-icon-btn"
        type="button"
        aria-label="Mi perfil"
        (click)="goPerfil()"
      >
        <span class="ur-icon">
          <img src="assets/sidebar/Engranaje.png" alt="Perfil" />
        </span>
      </button>

      <!-- Empuja el power al fondo -->
      <div class="ur-spacer"></div>

      <div class="ur-divider"></div>

      <!-- LOGOUT -->
      <button
        class="ur-icon-btn ur-icon-btn-power"
        type="button"
        aria-label="Cerrar sesión"
        (click)="logout()"
      >
        <span class="ur-icon">
          <img src="assets/sidebar/On.png" alt="Cerrar sesión" />
        </span>
      </button>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .ur-sidebar {
      --ur-bg: #FFE6DE;
      --ur-accent: #F4A69A;
      --ur-icon: #7C1034;

      width: 82px;
      min-height: calc(100vh - 48px);
      margin: 24px 0 24px 24px;
      padding: 24px 12px;
      border-radius: 36px;
      background: var(--ur-bg);

      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 18px 35px rgba(124, 16, 52, 0.18);
    }

    .ur-icon-btn {
      width: 52px;
      height: 52px;
      border-radius: 26px;
      border: none;
      outline: none;
      background: transparent;

      display: flex;
      align-items: center;
      justify-content: center;

      cursor: pointer;
      transition:
        background 0.15s ease,
        box-shadow 0.15s ease,
        transform 0.10s ease;
      color: var(--ur-icon);
    }

    .ur-icon img {
      width: 26px;
      height: 26px;
      display: block;
    }

    .ur-icon-btn:hover {
      background: rgba(124, 16, 52, 0.08);
      box-shadow: 0 6px 14px rgba(124, 16, 52, 0.18);
      transform: translateY(-1px);
    }

    .ur-icon-btn-power {
      background: #FFFFFF;
    }

    .ur-icon-btn-power:hover {
      background: #FFE1DC;
      box-shadow: 0 8px 18px rgba(124, 16, 52, 0.25);
    }

    .ur-divider {
      width: 62%;
      height: 1px;
      margin: 12px 0;
      background: var(--ur-accent);
      opacity: 0.7;
    }

    .ur-spacer {
      flex: 1;
    }

    @media (max-width: 900px) {
      .ur-sidebar {
        width: 100%;
        min-height: auto;
        margin: 0;
        border-radius: 0 0 28px 28px;
        padding: 14px 24px;
        flex-direction: row;
      }

      .ur-divider {
        height: 60%;
        width: 1px;
        margin: 0 10px;
      }

      .ur-spacer {
        flex: 1;
      }
    }
  `],
})
export class SidebarComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

 /** Rol actual del usuario (CONDUCTOR / PASAJERO) */
  private readonly currentRole = computed(
    () => this.authService.getUserRole()
  );

  /** Casa → main conductor/pasajero */
  goHome(): void {
    const role = this.currentRole();

    if (role === RoleType.ROLE_CONDUCTOR) {
      this.router.navigate(['/main/conductor']);
    } else if (role === RoleType.ROLE_PASAJERO) {
      this.router.navigate(['/main/pasajero']);
    } else {
      this.router.navigate(['/home/landing']);
    }
  }

  /** Journey → publicar ruta */
  goPublicarRuta(): void {
    this.router.navigate(['/rutas/publicar-ruta']);
  }

  /** Ubicación → solicitudes (depende de rol) */
  goSolicitudes(): void {
    const role = this.currentRole();

    if (role === RoleType.ROLE_PASAJERO) {
      this.router.navigate(['/solicitudes/pasajero']);
    } else if (role === RoleType.ROLE_CONDUCTOR) {
      this.router.navigate(['/rutas/mis-rutas']);
      // Cuando tengas /solicitudes/conductor:
      // this.router.navigate(['/solicitudes/conductor']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  /** Libro → historial de viajes (por ahora estadísticas de rutas) */
  goHistorial(): void {
    const role = this.currentRole();

    if (role === RoleType.ROLE_CONDUCTOR || role === RoleType.ROLE_PASAJERO) {
      this.router.navigate(['/rutas/estadisticas']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  /** Engranaje → perfil (por ahora main según rol) */
  goPerfil(): void {
    const role = this.currentRole();

    if (role === RoleType.ROLE_CONDUCTOR) {
      this.router.navigate(['/main/conductor']);
    } else if (role === RoleType.ROLE_PASAJERO) {
      this.router.navigate(['/main/pasajero']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  /** Botón ON → logout */
  logout(): void {
    this.authService.logout();
  }
}
