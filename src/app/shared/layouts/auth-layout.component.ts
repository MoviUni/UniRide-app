import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FooterComponent } from '../components/footer/footer.component';
import { NavbarComponent } from '../components/navbar/navbar-user.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FooterComponent,
    NavbarComponent
  ],
  template: `
    <div class="layout-container">
      
      <!-- 🔵 MENÚ SUPERIOR -->
      <nav class="top-links">
        <a routerLink="/rutas" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
          Estadísticas
        </a>

        <a routerLink="/rutas/mis-rutas" routerLinkActive="active">
          Mis rutas
        </a>
      </nav>

      <app-navbar></app-navbar>

      <main>
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .top-links {
      display: flex;
      gap: 20px;
      padding: 10px 20px;
      font-size: 18px;
    }
    .active {
      font-weight: bold;
      text-decoration: underline;
    }
  `]
})
export class AuthLayoutComponent { }
