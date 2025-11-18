import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-driver-account',
  standalone: true,
  templateUrl: './register-driver-account.html',
  styleUrl: './register-driver-account.css',
  imports: [RouterModule, CommonModule, ReactiveFormsModule]
})
export class RegisterDriverAccount implements OnInit {

  accountForm: any;

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit() {
    this.accountForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  goToNext() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    this.router.navigate(['/auth/register/driver/vehicle']);
  }
}
