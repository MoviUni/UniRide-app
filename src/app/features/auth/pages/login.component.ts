import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { LoginRequest } from '@core/models/usuario.model';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-image">
        <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=1000&fit=crop" alt="Conductor" />
      </div>
      
      <div class="login-form-container">
        <div class="login-header">
          <div class="logo">
            <span class="logo-ur">UR</span>
            <span class="logo-text">UniRide</span>
          </div>
          <h2>Accede a tu cuenta</h2>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              placeholder="tu@email.com"
              [class.error]="email?.invalid && email?.touched"
            />
            <span class="error-message" *ngIf="email?.invalid && email?.touched">
              Email inválido
            </span>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password"
              placeholder="••••••••"
              [class.error]="password?.invalid && password?.touched"
            />
            <span class="error-message" *ngIf="password?.invalid && password?.touched">
              La contraseña es requerida
            </span>
          </div>

          <button type="submit" class="btn-acceder" [disabled]="loginForm.invalid">
            Acceder
          </button>
        </form>

        <div class="login-footer">
          <span class="footer-text">¿No tienes cuenta?</span>
          <a href="#" class="link" (click)="crearCuenta($event)">Crear cuenta</a>
          <br>
          <span class="footer-text">¿Olvidaste tu contraseña?</span>
          <a href="#" class="link" (click)="restaurarContrasena($event)">Restaurar contraseña</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .login-container {
      display: flex;
      min-height: 100vh;
      background-color: #e5e5e5;
    }

    .login-image {
      flex: 1;
      max-width: 600px;
      overflow: hidden;
      border-radius: 0 30px 30px 0;
    }

    .login-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .login-form-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 40px;
      background-color: #e5e5e5;
    }

    .login-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 30px;
    }

    .logo-ur {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      font-size: 32px;
      font-weight: 900;
      padding: 8px 16px;
      border-radius: 8px;
      letter-spacing: 2px;
    }

    .logo-text {
      font-size: 36px;
      font-weight: 700;
      color: #1f2937;
    }

    .login-header h2 {
      font-size: 18px;
      font-weight: 400;
      color: #4b5563;
    }

    .login-form {
      width: 100%;
      max-width: 400px;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
    }

    .form-group input {
      width: 100%;
      padding: 14px 20px;
      border: 2px solid transparent;
      border-radius: 25px;
      background-color: #f3f4f6;
      font-size: 15px;
      transition: all 0.3s ease;
      outline: none;
    }

    .form-group input:focus {
      background-color: white;
      border-color: #6366f1;
    }

    .form-group input.error {
      border-color: #ef4444;
      background-color: #fef2f2;
    }

    .error-message {
      display: block;
      margin-top: 6px;
      font-size: 12px;
      color: #ef4444;
      padding-left: 20px;
    }

    .btn-acceder {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      color: white;
      border: none;
      border-radius: 25px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 10px;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }

    .btn-acceder:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
    }

    .btn-acceder:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .login-footer {
      margin-top: 30px;
      text-align: center;
      font-size: 14px;
      line-height: 1.8;
    }

    .footer-text {
      color: #6b7280;
      margin-right: 6px;
    }

    .link {
      color: #6366f1;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .link:hover {
      color: #4f46e5;
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .login-container {
        flex-direction: column;
      }

      .login-image {
        max-width: 100%;
        max-height: 300px;
        border-radius: 0 0 30px 30px;
      }

      .login-form-container {
        padding: 30px 20px;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Login attempt:', { email, password });
      
      // Aquí implementarías tu lógica de autenticación
      // Por ejemplo, llamar a un servicio de autenticación
      // this.authService.login(email, password).subscribe(...)
      
      alert(`Intentando iniciar sesión con: ${email}`);
    }
  }

  crearCuenta(event: Event) {
    event.preventDefault();
    console.log('Navegar a crear cuenta');
    // this.router.navigate(['/register']);
  }

  restaurarContrasena(event: Event) {
    event.preventDefault();
    console.log('Navegar a restaurar contraseña');
    // this.router.navigate(['/forgot-password']);
  }
}