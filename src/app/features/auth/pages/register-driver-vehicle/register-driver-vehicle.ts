import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);
  // Popup de éxito
  mostrarExitoso: boolean = false;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private driverState: RegisterDriverStateService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.vehicleForm = this.fb.group({
      placa: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      capacidad: [null, [Validators.required, Validators.min(1)]],
      color: ['', Validators.required],
      soat: ['si', Validators.required] // 'si' | 'no'
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
      alert('Faltan datos del registro. Empieza nuevamente.');
      this.router.navigate(['/auth/register/driver']);
      return;
    }

    //  Construir EXACTAMENTE el DTO que espera el backend
    const payload = {
      email: account.email,
      password: account.password,
      conductor: {
        nombre: driver.nombres,
        apellido: driver.apellidos,
        dni: driver.dni,
        edad: Number(driver.edad),
        codigoUni: account.codigo,
        carrera: null
      },
      vehiculo: {
        placa: vehicle.placa,
        soat: vehicle.soat === 'si',
        modelo: vehicle.modelo,
        marca: vehicle.marca,
        color: vehicle.color,
        capacidad: Number(vehicle.capacidad)
      }
    };

    console.log('Payload final:', payload);

    this.authService.registerDriver(payload).subscribe({
      next: () => {
        this.driverState.clear();
        this.mostrarExito();
        
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        alert(err?.error?.message ?? 'No se pudo completar el registro.');
      }
    });
  }

  mostrarExito() {
    
    this.mostrarExitoso = true;
    this.cdr.detectChanges();
  }

  cerrarExito() {
    this.mostrarExitoso = false;
    this.router.navigate(['/auth/login']);
    this.cdr.detectChanges();
    
  }
}
