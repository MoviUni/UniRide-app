import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class Register {

  private router = inject(Router);

  select(rol: 'passenger' | 'driver'): void {
    console.log('Rol seleccionado:', rol);

    // Redirigir al flujo correspondiente
    this.router.navigate([`/auth/register/${rol}`]);
  }
}
