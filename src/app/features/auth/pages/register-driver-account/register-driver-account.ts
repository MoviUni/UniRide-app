import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RegisterDriverStateService } from '../../../../core/services/register-driver-state.service';

@Component({
  selector: 'app-register-driver-account',
  standalone: true,
  templateUrl: './register-driver-account.html',
  styleUrl: './register-driver-account.css',
  imports: [RouterModule, CommonModule, ReactiveFormsModule]
})
export class RegisterDriverAccount implements OnInit {

  accountForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private driverState: RegisterDriverStateService
  ) {}

  ngOnInit() {
    this.accountForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]],
    });

    const saved = this.driverState.getAccountData();
    if (saved) {
      this.accountForm.patchValue(saved);
    }
  }

  goToNext() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    // (opcional) validar que password = password2 aquí

    this.driverState.setAccountData(this.accountForm.value);

    this.router.navigate(['/auth/register/driver/vehicle']);
  }
}
