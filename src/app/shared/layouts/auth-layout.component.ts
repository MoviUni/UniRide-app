import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
  <div>
    <a routerLink="/rutas" routerLinkActive="active">Rutas</a>
    <main>
      <router-outlet></router-outlet>
    </main>
  </div>
  `,  
  styles: []
})
export class AuthLayoutComponent {

}
