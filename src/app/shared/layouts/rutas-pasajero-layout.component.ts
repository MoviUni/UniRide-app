import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidebarPasajeroComponent } from '@shared/components/sidebar/sidebar-pasajero.component';

@Component({
  selector: 'app-rutas-pasajero-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarPasajeroComponent],
  template: `
    <div class="rutas-layout">
      <!-- Barra lateral rosada -->
      <app-sidebar-pasajero></app-sidebar-pasajero>

      <!-- Contenido de cada página de /rutas -->
      <div class="rutas-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #F4F6FF;
      font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .rutas-layout {
      display: flex;
      min-height: 100vh;
    }

    app-sidebar {
      flex-shrink: 0;   /* que no se achique el sidebar */
    }

    .rutas-content {
      flex: 1;
      padding: 32px 56px;
    }

    @media (max-width: 900px) {
      .rutas-layout {
        flex-direction: column;
      }

      .rutas-content {
        padding: 16px;
      }
    }
  `],
})
export class RutasPasajeroLayoutComponent {}
