import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="ur-sidebar">
      <!-- LOGO -->
      <div class="ur-sidebar-top">
        <div class="ur-logo-circle">
          <span class="ur-logo-text">UR</span>
        </div>
      </div>

      <!-- ICONOS PRINCIPALES -->
      <ul class="ur-nav-main">
        <!-- Mis rutas -->
        <li>
          <a
            class="ur-nav-icon"
            routerLink="/home/mis-rutas"
            routerLinkActive="ur-nav-icon-active"
            [routerLinkActiveOptions]="{ exact: true }"
            title="Mis rutas"
          >
            <span class="ur-icon-symbol">🛣️</span>
            <span class="ur-icon-label">Rutas</span>
          </a>
        </li>

        <!-- Publicar ruta -->
        <li>
          <a
            class="ur-nav-icon"
            routerLink="/home/publicar-ruta"
            routerLinkActive="ur-nav-icon-active"
            title="Publicar ruta"
          >
            <span class="ur-icon-symbol">＋</span>
            <span class="ur-icon-label">Publicar</span>
          </a>
        </li>
      </ul>

      <!-- PARTE INFERIOR: logout -->
      <ul class="ur-nav-bottom">
        <li>
          <button
            type="button"
            class="ur-nav-icon ur-nav-logout"
            title="Cerrar sesión"
            (click)="logout()"
          >
            <span class="ur-icon-symbol">⏻</span>
            <span class="ur-icon-label">Salir</span>
          </button>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .ur-sidebar {
      --ur-primary: #242F9B;
      --ur-soft-blue: #E0ECFF;

      height: calc(100vh - 3rem);
      width: 82px;
      margin: 1.5rem 0 1.5rem 1.5rem;
      padding: 1.2rem 0.4rem;
      border-radius: 30px;
      background: #FFFFFF;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }

    .ur-sidebar-top {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.4rem;
    }

    .ur-logo-circle {
      width: 48px;
      height: 48px;
      border-radius: 999px;
      background: linear-gradient(145deg, #242F9B, #4E6BFF);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(36, 47, 155, 0.55);
    }

    .ur-logo-text {
      font-size: 1.1rem;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: 0.08em;
    }

    .ur-nav-main,
    .ur-nav-bottom {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .ur-nav-main {
      flex: 1;
      justify-content: center;
    }

    .ur-nav-icon {
      width: 56px;
      height: 56px;
      border-radius: 18px;
      border: 1px solid transparent;
      background: #F9FAFB;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.15rem;
      cursor: pointer;
      text-decoration: none;
      font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      transition:
        background 0.18s ease,
        border-color 0.18s ease,
        box-shadow 0.18s ease,
        transform 0.12s ease;
      color: #4B5563;
    }

    .ur-nav-icon:hover {
      background: #EEF3FF;
      border-color: var(--ur-soft-blue);
      box-shadow: 0 10px 25px rgba(36, 47, 155, 0.18);
      transform: translateY(-1px);
    }

    .ur-nav-icon-active {
      background: #242F9B;
      border-color: #1D2A7A;
      box-shadow: 0 14px 32px rgba(36, 47, 155, 0.4);
      color: #FFFFFF;
    }

    .ur-icon-symbol {
      font-size: 1.25rem;
      line-height: 1;
    }

    .ur-icon-label {
      font-size: 0.63rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .ur-nav-logout {
      background: #FEF2F2;
      color: #B91C1C;
      border-color: #FECACA;
    }

    .ur-nav-logout:hover {
      background: #FEE2E2;
      box-shadow: 0 10px 24px rgba(185, 28, 28, 0.25);
    }

    button.ur-nav-icon {
      border-width: 1px;
      border-style: solid;
    }

    @media (max-width: 900px) {
      .ur-sidebar {
        height: auto;
        width: 100%;
        margin: 0;
        border-radius: 0 0 18px 18px;
        flex-direction: row;
        padding: 0.7rem 1rem;
        gap: 1.5rem;
      }

      .ur-sidebar-top {
        flex-direction: row;
      }

      .ur-nav-main {
        flex-direction: row;
        justify-content: center;
      }

      .ur-nav-bottom {
        flex-direction: row;
      }

      .ur-nav-icon {
        width: 64px;
        height: 56px;
      }
    }
  `],
})
export class SidebarComponent {
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
