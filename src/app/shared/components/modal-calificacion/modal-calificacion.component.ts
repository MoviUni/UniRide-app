// src/app/shared/components/modal-calificacion/modal-calificacion.component.ts
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalificacionService } from '../../../core/services/calificacion.service';
import { CalificacionRequest } from '../../../core/models/calificacion.model';

@Component({
  selector: 'app-modal-calificacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-calificacion.component.html',
  styleUrls: ['./modal-calificacion.component.css']
})
export class ModalCalificacionComponent {
  @Input() isOpen = false;
  @Input() idSolicitudViaje?: number;
  @Input() idUsuarioCalificado?: number; // ID del pasajero o conductor a calificar
  @Input() tipoUsuario: 'pasajero' | 'conductor' = 'conductor'; // Quien está siendo calificado
  @Input() nombreUsuario = ''; // Nombre de quien se califica
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() calificacionGuardada = new EventEmitter<void>();

  calificacionForm: FormGroup;
  calificacionSeleccionada = signal(0);
  estrellas = [1, 2, 3, 4, 5];
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private calificacionService: CalificacionService
  ) {
    this.calificacionForm = this.fb.group({
      comentario: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  seleccionarCalificacion(valor: number): void {
    this.calificacionSeleccionada.set(valor);
  }

  getIconoEstrella(posicion: number): string {
    return posicion <= this.calificacionSeleccionada() ? '★' : '☆';
  }

  close(): void {
    this.resetForm();
    this.closeModal.emit();
  }

  guardarCalificacion(): void {
    if (this.calificacionSeleccionada() === 0) {
      this.errorMessage.set('Por favor, selecciona una calificación');
      return;
    }

    if (this.calificacionForm.invalid) {
      this.errorMessage.set('Por favor, escribe un comentario (mínimo 10 caracteres)');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const request: CalificacionRequest = {
      puntaje: this.calificacionSeleccionada(),
      comentario: this.calificacionForm.value.comentario
    };

    // Solo asignar el ID si está disponible
    if (this.tipoUsuario === 'conductor' && this.idUsuarioCalificado) {
      request.conductor = this.idUsuarioCalificado;
    } else if (this.tipoUsuario === 'pasajero' && this.idUsuarioCalificado) {
      request.pasajero = this.idUsuarioCalificado;
    }

    console.log('📤 Enviando calificación:', request);

    this.calificacionService.createCalificacion(request).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('¡Calificación guardada exitosamente!');
        
        setTimeout(() => {
          this.calificacionGuardada.emit();
          this.close();
        }, 1500);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('❌ Error al guardar calificación:', err);
        console.error('Detalles del error:', err.error);
        this.errorMessage.set('Error al guardar la calificación. Intenta nuevamente.');
      }
    });
  }

  private resetForm(): void {
    this.calificacionSeleccionada.set(0);
    this.calificacionForm.reset();
    this.errorMessage.set('');
    this.successMessage.set('');
  }
}
