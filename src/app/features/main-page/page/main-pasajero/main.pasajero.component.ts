import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-page-pasajero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `

      <img class="banner" src="assets/banner2.png" />

      <div class="content">

        <p class="inicio"> Inicio </p>

        <div class="main-buttons">
          <div>
            <button type="button" class="btn" routerLink="/solicitudes/pasajero/estados">
              <p class="btn-text">Mis solicitudes</p>
              <img class="image" src="assets/sidebar/calendar.png" />
            </button>
          </div>

          <div>
            <button type="button" class="btn" routerLink="/rutas/pasajero/buscar">
              <p class="btn-text">Buscar Rutas</p>
              <img class="image" src="assets/sidebar/Ubicacion.png" />
            </button>
          </div>

          <div>
            <button type="button" class="btn" routerLink="/historial/pasajero">
              <p class="btn-text">Historial de viajes</p>
              <img class="image" src="assets/sidebar/Libro.png" />
            </button>
          </div>

          <div>
            <button type="button" class="btn" routerLink="/rutas/perfil-pasajero">
              <p class="btn-text">Mi perfil</p>
              <img class="image" src="assets/sidebar/user.png" />
            </button>
          </div>

          <div>
            <button type="button" class="btn" routerLink="/rutas/configuracion-pasajero">
              <p class="btn-text">Configuración</p>
              <img class="image" src="assets/sidebar/Engranaje.png" />
            </button>
          </div>
        </div>

      </div>

  `,
  styleUrl: './main.pasajero.component.css'
})
export class MainPagePasajeroComponent {}
