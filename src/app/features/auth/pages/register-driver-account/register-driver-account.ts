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

  showPassword = false;
  showPassword2 = false;

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

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  togglePassword2(): void {
    this.showPassword2 = !this.showPassword2;
  }

  goToNext() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    this.driverState.setAccountData(this.accountForm.value);
    this.router.navigate(['/auth/register/driver/vehicle']);
  }
}

