import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register-driver-vehicle',
  standalone: true,
  templateUrl: './register-driver-vehicle.html',
  styleUrl: './register-driver-vehicle.css',
  imports: [RouterModule, CommonModule, ReactiveFormsModule]
})
export class RegisterDriverVehicle implements OnInit {

  vehicleForm!: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit() {
    this.vehicleForm = this.fb.group({
      matricula: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      capacidad: [null, [Validators.required, Validators.min(1)]],
      color: ['', Validators.required],
      soat: ['', Validators.required],
    });
  }

  register() {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    console.log("Vehículo registrado:", this.vehicleForm.value);

    // Aquí luego llamas a API → AuthService.registerDriver()
    this.router.navigate(['/auth/login']);
  }
}
