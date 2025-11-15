import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [RouterModule]
})
export class Register {

  private router = inject(Router); // ← inyección en standalone

  select(rol: 'passenger' | 'conductor') {
    console.log('Rol seleccionado:', rol);

    // Redirige según el rol seleccionado
    this.router.navigate([`/auth/register/${rol}`]);
  }
}
