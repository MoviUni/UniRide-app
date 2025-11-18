import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-passenger',
  standalone: true,
  templateUrl: './register-passenger.html',
  styleUrl: './register-passenger.css',
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class RegisterPassenger {

  passengerForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {

    this.passengerForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{9}$/) // 9 dígitos
        ]
      ],
      dni: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{8}$/) // 8 dígitos
        ]
      ]
    });
  }

  goToNext() {
    if (this.passengerForm.invalid) {
      this.passengerForm.markAllAsTouched();
      return;
    }

    // Guarda los datos temporalmente (opcional)
    localStorage.setItem('registerPassengerData', JSON.stringify(this.passengerForm.value));

    // Navegar a la página de cuenta
    this.router.navigate(['/auth/register/passenger/account']);
  }
}
