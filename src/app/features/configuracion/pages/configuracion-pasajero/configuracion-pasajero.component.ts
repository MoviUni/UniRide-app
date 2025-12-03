// src/app/features/configuracion/pages/configuracion-pasajero/configuracion-pasajero.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PasajeroService } from '../../../../core/services/pasajero.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PasajeroResponse } from '../../../../core/models/pasajero.model';

@Component({
  selector: 'app-configuracion-pasajero',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './configuracion-pasajero.component.html',
  styleUrls: ['./configuracion-pasajero.component.css']
})
export class ConfiguracionPasajeroComponent implements OnInit {
  private pasajeroService = inject(PasajeroService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Signals
  pasajero = signal<PasajeroResponse | null>(null);
  fotoPerfil = signal<string>('assets/default-avatar.jpg');
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  // Formulario
  configuracionForm: FormGroup;

  constructor() {
    this.configuracionForm = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadPasajero();
  }

  loadPasajero(): void {
    const pasajeroId = this.authService.getPasajeroId();
    
    if (!pasajeroId) {
      this.errorMessage.set('No se encontró ID de pasajero');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.pasajeroService.getById(pasajeroId).subscribe({
      next: (data: PasajeroResponse) => {
        this.pasajero.set(data);
        
        // Actualizar foto de perfil
        if (data.fotoPerfil) {
          this.fotoPerfil.set(data.fotoPerfil);
        }

        // Llenar formulario con datos actuales
        this.configuracionForm.patchValue({
          nombres: data.nombre,
          apellidos: data.apellido,
          codigo: data.codigoUni, // El teléfono no está en el modelo, agrégalo si es necesario
        });

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar datos del pasajero:', error);
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
    console.log("HOLAAA", this.configuracionForm.value);
    const pasajeroId = this.authService.getPasajeroId();
    if (!pasajeroId) {
      this.errorMessage.set('No se encontró ID de pasajero');
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
      email: "",
      password: "",
      dni: this.pasajero()?.dni,
      edad: this.pasajero()?.edad,
      codigoUni: formData.codigo,

    };

    console.log('📤 Actualizando pasajero:', updateData);

    this.pasajeroService.update(pasajeroId, updateData).subscribe({
      next: (response) => {
        console.log('✅ Pasajero actualizado:', response);
        this.pasajero.set(response);
        this.loading.set(false);
        this.successMessage.set('Cambios guardados exitosamente');
        
        setTimeout(() => {
          this.successMessage.set('');
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Error al actualizar pasajero:', error);
        this.loading.set(false);
        this.errorMessage.set('Error al guardar los cambios. Intenta nuevamente.');
      }
    });
  }

  cancelar(): void {
    // Recargar datos originales
    this.loadPasajero();
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  navegarHistorial(): void {
    this.router.navigate(['/historial/pasajero']);
  }
}
