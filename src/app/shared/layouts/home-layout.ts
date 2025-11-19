import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>

      <div class="page-container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #F5F7FF;
      font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #111827;
    }

    .layout {
      display: flex;
      min-height: 100vh;
      align-items: stretch;
    }

    .page-container {
      flex: 1;
      max-width: 1120px;
      margin: 2.5rem auto 3rem;
      padding: 0 1.5rem;
    }

    @media (max-width: 900px) {
      .layout {
        flex-direction: column;
      }

      .page-container {
        margin: 1.5rem auto 2rem;
      }
    }
  `],
})
export class HomeLayoutComponent {}
