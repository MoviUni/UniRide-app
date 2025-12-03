// src/app/features/pasajero/pages/perfil-pasajero.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PasajeroService } from '@core/services/pasajero.service';
import { AuthService } from '@core/services/auth.service';
import { PasajeroResponse, ComentarioResponse } from '@core/models/pasajero.model';
import { CalificacionService } from '@core/services/calificacion.service';
import { CalificacionResponse } from '@core/models/calificacion.model';

@Component({
  selector: 'app-perfil-pasajero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './perfil-pasajero.html',
  styleUrls: ['./perfil-pasajero.css']
})
export class PerfilPasajero implements OnInit {
  private pasajeroService = inject(PasajeroService);
  private auth = inject(AuthService);
  private calificacionService = inject(CalificacionService);

  pasajero = signal<PasajeroResponse | null>(null);
  comentarios = signal<ComentarioResponse[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  fotoPerfil = signal<string>('assets/default-avatar.png');

  ngOnInit(): void {
    this.loadPerfil();
    this.loadComentarios();
  }

  loadPerfil(): void {
    const id = this.auth.getPasajeroId();
    
    if (!id) {
      this.errorMessage.set('Usuario no autenticado');
      return;
    }

    this.loading.set(true);

    this.pasajeroService.getById(id).subscribe({
      next: (data) => {
        console.log('Perfil cargado:', data);
        this.pasajero.set(data);
        
        if (data.fotoPerfil) {
          this.fotoPerfil.set(data.fotoPerfil);
        }
        
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
        this.errorMessage.set('Error al cargar el perfil');
        this.loading.set(false);
      }
    });
  }

  loadComentarios(): void {
    const id = this.auth.getPasajeroId();
    if (!id) return;

    this.calificacionService.getCalificacionesByPasajero(id).subscribe({
      next: (calificaciones: CalificacionResponse[]) => {
        console.log('📝 Calificaciones de pasajero cargadas:', calificaciones);
        
        // Transformar CalificacionResponse a ComentarioResponse
        const comentarios: ComentarioResponse[] = calificaciones.map(cal => ({
          idComentario: cal.idCalificacion,
          nombreUsuario: cal.nombreCalificador || 'Usuario',
          calificacion: cal.calificacion,
          comentario: cal.comentario,
          fecha: cal.fechaCreacion || new Date().toISOString().split('T')[0]
        }));
        
        this.comentarios.set(comentarios);
      },
      error: (err) => {
        console.error('❌ Error cargando comentarios del pasajero:', err);
        // Mantener array vacío si hay error
        this.comentarios.set([]);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida');
        return;
      }
      
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }
      
      // Leer archivo y convertir a base64 o URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.fotoPerfil.set(result);
        
        // Aquí puedes llamar al backend para guardar la foto
        this.subirFoto(result);
      };
      reader.readAsDataURL(file);
    }
  }

  subirFoto(fotoBase64: string): void {
    const id = this.auth.getPasajeroId();
    if (!id) return;

    // Aquí deberías llamar al servicio para actualizar la foto
    // this.pasajeroService.updateFoto(id, fotoBase64).subscribe(...);
    console.log('Foto lista para subir al backend');
  }

  getEstrellas(rating: number): string[] {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(i <= rating ? '★' : '☆');
    }
    return estrellas;
  }

  getCalificacionPromedio(): number {
    const pasajero = this.pasajero();
    return pasajero?.calificacionPromedio || 4; // Default 4 si no hay
  }

  getTotalCalificaciones(): number {
    const pasajero = this.pasajero();
    return pasajero?.totalCalificaciones || 163; // Default del diseño
  }
}
