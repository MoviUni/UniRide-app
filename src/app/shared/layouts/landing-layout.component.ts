import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { RouterOutlet} from '@angular/router';
import { FooterComponent } from '../components/footer/footer.component';
import { NavbarLandingComponent } from '../components/navbar-landing/navbar-landing.component';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent, NavbarLandingComponent],
  template: `
  <div>
    <!--<a routerLink="/home/landing" routerLinkActive="active">Landing</a>-->
    <app-navbar-landing></app-navbar-landing>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  </div>`,
  styles: []
})
export class LandingLayoutComponent {

}
