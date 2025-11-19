import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterPassengerStateService } from '../../../../core/services/register-passenger-state.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register-passenger-account',
  standalone: true,
  templateUrl: './register-passenger-account.html',
  styleUrl: './register-passenger-account.css',
  imports: [RouterModule, CommonModule, ReactiveFormsModule]
})
export class RegisterPassengerAccount {

  accountForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private passengerState: RegisterPassengerStateService,
    private authService: AuthService
  ) {

    this.accountForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador personalizado para comparar contraseña y confirmación
  passwordMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const pass2 = form.get('password2')?.value;
    return pass === pass2 ? null : { mismatch: true };
  }

  createAccount() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    const passenger = this.passengerState.getPassengerData();
    const account = this.accountForm.value;

    if (!passenger) {
      console.error('Faltan datos del paso anterior de pasajero');
      alert('Ocurrió un problema con los datos del registro. Vuelve a empezar.');
      this.router.navigate(['/auth/register/pasajero']);
      return;
    }

    // ⚠️ Ajusta estos nombres a lo que pida tu PasajeroRequestDTO
    const payload: any = {
      nombre: passenger.nombres,
      apellido: passenger.apellidos,
      telefono: passenger.telefono,
      dni: passenger.dni,
      codigoUniversitario: account.codigo,
      email: account.email,
      password: account.password
    };

    console.log('Payload registro pasajero:', payload);

    this.authService.registerPassenger(payload).subscribe({
      next: () => {
        this.passengerState.clear();
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Error registrando pasajero', err);
        alert(err?.error?.message ?? 'No se pudo completar el registro de pasajero');
      }
    });
  }
}
