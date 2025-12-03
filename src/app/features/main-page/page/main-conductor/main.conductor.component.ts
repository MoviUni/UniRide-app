import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-page-conductor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Barra superior fija con Perfil y Configuración -->
    <div class="top-bar">
      <button
        type="button"
        class="top-icon-btn"
        routerLink="/rutas/perfil-conductor"
        aria-label="Mi perfil"
      >
        <img src="assets/sidebar/user.png" alt="Perfil" />
      </button>

      <button
        type="button"
        class="top-icon-btn"
        routerLink="/rutas/configuracion-conductor"
        aria-label="Configuración"
      >
        <img src="assets/sidebar/Engranaje.png" alt="Configuración" />
      </button>
    </div>

    <img class="banner" src="assets/MainBanner.png" />
    <div class="content">
      <p class="inicio"> Inicio </p>

      <div class="main-buttons">
        <div>
          <button type="button" class="btn" routerLink="/rutas/publicar-ruta">
            <p class="btn-text">Crear nueva ruta</p>
            <img class="image" src="assets/sidebar/Journey.png" />
          </button>
        </div>

        <div>
          <button type="button" class="btn" routerLink="/rutas/mis-rutas">
            <p class="btn-text">Mis rutas</p>
            <img class="image" src="assets/sidebar/Ubicacion.png" />
          </button>
        </div>

        <div>
          <button type="button" class="btn" routerLink="/historial/conductor">
            <p class="btn-text">Historial de viajes</p>
            <img class="image" src="assets/sidebar/Libro.png" />
          </button>
        </div>

        <div>
          <button type="button" class="btn" routerLink="/rutas/estadisticas">
            <p class="btn-text">Estadísticas de viajes</p>
            <img class="image" src="assets/Estadisticas.png" />
          </button>
        </div>

        <!-- Dejamos solo “Mi vehículo” en la grilla -->
        <div>
          <button type="button" class="btn" routerLink="/rutas/configuracion-vehiculo">
            <p class="btn-text">Mi vehículo</p>
            <img class="image" src="assets/sidebar/auto_icon.png" />
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './main.conductor.component.css'
})
export class MainPageConductorComponent {}
