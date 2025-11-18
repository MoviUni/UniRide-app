import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-passenger-account',
  standalone: true,
  templateUrl: './register-passenger-account.html',
  styleUrl: './register-passenger-account.css',
  imports: [RouterModule, CommonModule, ReactiveFormsModule]
})
export class RegisterPassengerAccount {

  accountForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {

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

    console.log("Cuenta creada:", this.accountForm.value);

    // Aquí podrías dirigir al login o dashboard
    // this.router.navigate(['/auth/login']);
  }
}
