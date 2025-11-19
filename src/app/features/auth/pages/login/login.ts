import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthValidators } from '../../validators/auth.validators';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [RouterModule, ReactiveFormsModule]
})
export class Login {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      email: ['', [AuthValidators.email]],
      password: ['', [AuthValidators.password]],
    });

  }

  submit(): void {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const { email, password } = this.loginForm.value;

  this.authService.login(email, password).subscribe({
    next: (resp) => {
      console.log('Login OK, rol:', resp.rol);

      if (resp.rol === 'CONDUCTOR') {
        this.router.navigate(['/rutas/mis-rutas']);
      } else if (resp.rol === 'PASAJERO') {
        // 🔁 aquí pon la vista inicial del pasajero
        this.router.navigate(['rutas/buscar']); 
        // o '/solicitudes', o lo que tengan como dashboard de pasajero
      } else if (resp.rol === 'ADMIN') {
        // si tienen panel admin
        this.router.navigate(['/admin']);
      } else {
        // fallback
        this.router.navigate(['/home/landing']);
      }
    },
    error: err => {
      console.error('Error en login:', err);
    }
  });
}

}
