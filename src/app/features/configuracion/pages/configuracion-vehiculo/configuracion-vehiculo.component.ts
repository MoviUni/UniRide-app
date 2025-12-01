// src/app/features/configuracion/pages/configuracion-vehiculo/configuracion-vehiculo.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VehiculoService } from '../../../../core/services/vehiculo.service';
import { AuthService } from '../../../../core/services/auth.service';
import { VehiculoResponse } from '../../../../core/models/vehiculo.model';

@Component({
  selector: 'app-configuracion-vehiculo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './configuracion-vehiculo.component.html',
  styleUrls: ['./configuracion-vehiculo.component.css']
})
export class ConfiguracionVehiculoComponent implements OnInit {
  private vehiculoService = inject(VehiculoService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Signals
  vehiculo = signal<VehiculoResponse | null>(null);
  fotoPerfil = signal<string>('assets/default-avatar.png');
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  // Formulario
  vehiculoForm: FormGroup;

  constructor() {
    this.vehiculoForm = this.fb.group({
      matricula: ['', [Validators.required]],
      marca: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      capacidad: ['', [Validators.required, Validators.min(1)]],
      color: ['', [Validators.required]],
      aireAcondicionado: [false]
    });
  }

  ngOnInit(): void {
    this.loadVehiculo();
  }

  loadVehiculo(): void {
    const conductorId = this.authService.getConductorId();
    
    if (!conductorId) {
      this.errorMessage.set('No se encontró ID de conductor');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.vehiculoService.getVehiculoByConductor(conductorId).subscribe({
      next: (data: VehiculoResponse) => {
        this.vehiculo.set(data);
        
        // Llenar formulario con datos actuales
        this.vehiculoForm.patchValue({
          matricula: data.placa || '',
          marca: data.marca || '',
          modelo: data.modelo || '',
          capacidad: data.capacidad || '',
          color: data.color || '',
          aireAcondicionado: data.aireAcondicionado || false
        });

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar datos del vehículo:', error);
        this.errorMessage.set('Error al cargar los datos del vehículo');
        this.loading.set(false);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage.set('La imagen no debe superar los 5MB');
      return;
    }

    // Leer el archivo y mostrar preview
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        this.fotoPerfil.set(e.target.result as string);
        this.errorMessage.set('');
      }
    };
    reader.readAsDataURL(file);
  }

  guardarCambios(): void {
    if (this.vehiculoForm.invalid) {
      this.errorMessage.set('Por favor completa todos los campos correctamente');
      return;
    }

    const vehiculoActual = this.vehiculo();
    if (!vehiculoActual) {
      this.errorMessage.set('No se encontró vehículo para actualizar');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const formData = this.vehiculoForm.value;

    // Preparar datos para actualización
    const updateData = {
      placa: formData.matricula,
      marca: formData.marca,
      modelo: formData.modelo,
      capacidad: Number(formData.capacidad),
      color: formData.color,
      aireAcondicionado: formData.aireAcondicionado
    };

    console.log('📤 Actualizando vehículo:', updateData);

    this.vehiculoService.update(vehiculoActual.idVehiculo, updateData).subscribe({
      next: (response) => {
        console.log('✅ Vehículo actualizado:', response);
        this.vehiculo.set(response);
        this.loading.set(false);
        this.successMessage.set('Cambios guardados exitosamente');
        
        setTimeout(() => {
          this.successMessage.set('');
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Error al actualizar vehículo:', error);
        this.loading.set(false);
        this.errorMessage.set('Error al guardar los cambios. Intenta nuevamente.');
      }
    });
  }

  cancelar(): void {
    this.loadVehiculo();
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  navegarConfiguracionCuenta(): void {
    this.router.navigate(['/rutas/configuracion-conductor']);
  }

  navegarHistorial(): void {
    this.router.navigate(['/historial/conductor']);
  }
}
