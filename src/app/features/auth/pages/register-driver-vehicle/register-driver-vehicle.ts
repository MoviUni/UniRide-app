import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RegisterDriverStateService } from '../../../../core/services/register-driver-state.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register-driver-vehicle',
  standalone: true,
  templateUrl: './register-driver-vehicle.html',
  styleUrl: './register-driver-vehicle.css',
  imports: [RouterModule, CommonModule, ReactiveFormsModule]
})
export class RegisterDriverVehicle implements OnInit {

  vehicleForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private driverState: RegisterDriverStateService,
    private authService: AuthService
  ) {}

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

    const driver = this.driverState.getDriverData();
    const account = this.driverState.getAccountData();
    const vehicle = this.vehicleForm.value;

    if (!driver || !account) {
      console.error('Faltan datos de pasos anteriores del registro');
      alert('Ocurrió un problema con los datos del registro. Vuelve a empezar.');
      this.router.navigate(['/auth/register/driver']);
      return;
    }

    // ⚠️ Ajusta los nombres de campos a lo que espera tu ConductorRequestDTO
    const payload: any = {
      // datos personales
      nombre: driver.nombres,
      apellido: driver.apellidos,
      telefono: driver.telefono,
      dni: driver.dni,

      // cuenta / usuario
      codigoUniversitario: account.codigo,
      email: account.email,
      password: account.password,

      // datos del vehículo (puede ser embebido o plano según tu DTO)
      vehiculo: {
        matricula: vehicle.matricula,
        marca: vehicle.marca,
        modelo: vehicle.modelo,
        capacidad: vehicle.capacidad,
        color: vehicle.color,
        soatVigente: vehicle.soat === 'si'
      }
    };

    console.log('Payload de registro de conductor:', payload);

    this.authService.registerDriver(payload).subscribe({
      next: () => {
        // limpiar estado del wizard
        this.driverState.clear();
        // ir al login
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Error registrando conductor', err);
        alert(err?.error?.message ?? 'No se pudo completar el registro de conductor');
      }
    });
  }
}
