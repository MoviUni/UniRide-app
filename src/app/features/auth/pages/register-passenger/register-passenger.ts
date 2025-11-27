// src/app/features/auth/page/register-passenger/register-passenger.ts
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RegisterPassengerStateService } from '../../../../core/services/register-passenger-state.service';

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
    private fb: FormBuilder,
    private passengerState: RegisterPassengerStateService
  ) {

    this.passengerForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      edad: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{1,2}$/) // 1 o 2 dígitos
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

    const saved = this.passengerState.getPassengerData();
    if (saved) {
      this.passengerForm.patchValue(saved);
    }
  }

  goToNext() {
    if (this.passengerForm.invalid) {
      this.passengerForm.markAllAsTouched();
      return;
    }

    this.passengerState.setPassengerData(this.passengerForm.value);
    this.router.navigate(['/auth/register/passenger/account']);
  }
}
