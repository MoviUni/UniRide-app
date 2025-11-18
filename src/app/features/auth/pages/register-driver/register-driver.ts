import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register-driver',
  standalone: true,
  templateUrl: './register-driver.html',
  styleUrl: './register-driver.css',
  imports: [RouterModule, CommonModule, ReactiveFormsModule]
})
export class RegisterDriver implements OnInit {

  driverForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.driverForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    });
  }

  goToNext() {
    if (this.driverForm.invalid) {
      this.driverForm.markAllAsTouched();
      return;
    }

    this.router.navigate(['/auth/register/driver/account']);
  }
}
