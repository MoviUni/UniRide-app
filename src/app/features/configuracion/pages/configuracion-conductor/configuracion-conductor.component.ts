// src/app/features/configuracion/pages/configuracion-conductor/configuracion-conductor.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ConductorService } from '../../../../core/services/conductor.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ConductorResponse } from '../../../../core/models/conductor.model';

@Component({
  selector: 'app-configuracion-conductor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './configuracion-conductor.component.html',
  styleUrls: ['./configuracion-conductor.component.css']
})
export class ConfiguracionConductorComponent implements OnInit {
  private conductorService = inject(ConductorService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Signals
  conductor = signal<ConductorResponse | null>(null);
  fotoPerfil = signal<string>('assets/default-avatar.png');
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  // Formulario
  configuracionForm: FormGroup;

  constructor() {
    this.configuracionForm = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      codigoUni: ['', [Validators.required]],
      carrera: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadConductor();
  }

  loadConductor(): void {
    const conductorId = this.authService.getConductorId();
    
    if (!conductorId) {
      this.errorMessage.set('No se encontró ID de conductor');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.conductorService.getById(conductorId).subscribe({
      next: (data: ConductorResponse) => {
        this.conductor.set(data);
        
        // Actualizar foto de perfil
        if (data.fotoPerfil) {
          this.fotoPerfil.set(data.fotoPerfil);
        }

        // Llenar formulario con datos actuales
        this.configuracionForm.patchValue({
          nombres: data.nombre,
          apellidos: data.apellido,
          codigoUni: data.codigoUni,
          carrera: data.carrera
        });

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar datos del conductor:', error);
        this.errorMessage.set('Error al cargar los datos del perfil');
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
    if (this.configuracionForm.invalid) {
      this.errorMessage.set('Por favor completa todos los campos correctamente');
      return;
    }

    const conductorId = this.authService.getConductorId();
    if (!conductorId) {
      this.errorMessage.set('No se encontró ID de conductor');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const formData = this.configuracionForm.value;

    // Preparar datos para actualización
    const updateData = {
      nombre: formData.nombres,
      apellido: formData.apellidos,
      codigoUni: formData.codigoUni,
      carrera: formData.carrera,
      fotoPerfil: this.fotoPerfil() !== 'assets/default-avatar.png' ? this.fotoPerfil() : undefined
    };

    console.log('📤 Actualizando conductor:', updateData);

    this.conductorService.update(conductorId, updateData).subscribe({
      next: (response) => {
        console.log('✅ Conductor actualizado:', response);
        this.conductor.set(response);
        this.loading.set(false);
        this.successMessage.set('Cambios guardados exitosamente');
        
        setTimeout(() => {
          this.successMessage.set('');
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Error al actualizar conductor:', error);
        this.loading.set(false);
        this.errorMessage.set('Error al guardar los cambios. Intenta nuevamente.');
      }
    });
  }

  cancelar(): void {
    this.loadConductor();
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  navegarVehiculo(): void {
    this.router.navigate(['/rutas/configuracion-vehiculo']);
  }

  navegarHistorial(): void {
    this.router.navigate(['/historial/conductor']);
  }
}
