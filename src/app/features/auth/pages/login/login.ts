import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthValidators } from '../../validators/auth.validators';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [RouterModule, ReactiveFormsModule, CommonModule]
})
export class Login {

  loginForm: FormGroup;
  loginError: string | null = null;

  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [AuthValidators.email]],
      password: ['', [Validators.required]]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }


    submit(): void {
    this.loginError = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: resp => {
        console.log('Login OK, rol:', resp.rol);

        if (resp.rol === 'CONDUCTOR') {
        this.router.navigate(['/main/conductor']);
      } else if (resp.rol === 'PASAJERO') {
        this.router.navigate(['/main/pasajero']);   
      } else if (resp.rol === 'ADMIN') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/home/landing']);
      }
      },
      error: err => {
        console.error('Error en login, status:', err.status, err);

        // 1) Intentar leer el mensaje que viene del backend
        let backendMessage: string | undefined;

        if (err.error) {
          if (typeof err.error === 'string') {
            backendMessage = err.error;
          } else if (typeof err.error === 'object' && 'message' in err.error) {
            backendMessage = (err.error as any).message;
          }
        }

        if (backendMessage) {
          // Opcional: limpiar el prefijo "An unexpected error occurred: "
          backendMessage = backendMessage.replace('An unexpected error occurred: ', '').trim();
          this.loginError = backendMessage;
          console.log('loginError ahora es:', this.loginError);
          this.cdr.detectChanges();
          return;
        }

        // 2) Si no vino mensaje, usamos algo genérico por código HTTP
        if (err.status === 401 || err.status === 400) {
          this.loginError = 'Email o contraseña incorrectos.';
        } else {
          this.loginError = 'El servidor está teniendo problemas. Inténtalo nuevamente más tarde.';
        }
        this.cdr.detectChanges();
      }
    });
  }

}