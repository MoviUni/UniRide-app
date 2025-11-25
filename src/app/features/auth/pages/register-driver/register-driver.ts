import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RegisterDriverStateService } from '../../../../core/services/register-driver-state.service';

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
    private fb: FormBuilder,
    private driverState: RegisterDriverStateService
  ) {}

  ngOnInit(): void {
    this.driverForm = this.fb.group({
    nombres: ['', [Validators.required, Validators.minLength(3)]],
    apellidos: ['', [Validators.required, Validators.minLength(3)]],
    edad: ['', [Validators.required, Validators.min(18), Validators.max(80)]],
    dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
  });


    // por si el usuario regresó hacia atrás
    const saved = this.driverState.getDriverData();
    if (saved) {
      this.driverForm.patchValue(saved);
    }
  }

  goToNext() {
    if (this.driverForm.invalid) {
      this.driverForm.markAllAsTouched();
      return;
    }

    // guardar datos en el estado global
    this.driverState.setDriverData(this.driverForm.value);

    this.router.navigate(['/auth/register/driver/account']);
  }
}
