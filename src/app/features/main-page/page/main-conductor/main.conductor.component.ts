import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-page-conductor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <img class="banner" src="assets/MainBanner.png" />
    <div class="content">

        <p class="inicio"> Inicio </p>
        <div class="main-buttons">
          <div>
            <button type="button" class="btn" routerLink="/rutas/mis-rutas">
              <p class="btn-text">  Mis rutas</p>
              <img class="image" src="assets/Ruta.png" />
            </button>
            
          </div>
          <div>
            <button type="button" class="btn" > <!--routerLink="/historial" -->
              <p class="btn-text">  Historial de viajes</p>
              <img class="image" src="assets/Book.png" />
            </button>
            
          </div>
            
          <div>
            <button type="button" class="btn" routerLink="/rutas"> 
              <p class="btn-text">  Estadísticas de viajes</p>
              <img class="image" src="assets/Estadisticas.png" />
            </button>
            
          </div>
            
          <div>
            <button type="button" class="btn"  > <!--routerLink="/perfil" -->
              <p class="btn-text">  Mi perfil</p>
              <img class="image" src="assets/user.png" />
            </button>
          </div>
        </div>
    </div>
  `,
  styleUrl: './main.conductor.component.css'
})
export class MainPageConductorComponent {}