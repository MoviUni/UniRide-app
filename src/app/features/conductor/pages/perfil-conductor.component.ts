// src/app/features/conductor/pages/perfil-conductor.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConductorService } from '@core/services/conductor.service';
import { AuthService } from '@core/services/auth.service';
import { VehiculoService } from '@core/services/vehiculo.service';
import { RoutesService } from '@core/services/routes.service';
import { ConductorResponse, ComentarioConductorResponse, SolicitudViajeCardResponse } from '@core/models/conductor.model';
import { VehiculoResponse } from '@core/models/vehiculo.model';

@Component({
  selector: 'app-perfil-conductor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './perfil-conductor.html',
  styleUrls: ['./perfil-conductor.css']
})
export class PerfilConductor implements OnInit {
  private conductorService = inject(ConductorService);
  private auth = inject(AuthService);
  private vehiculoService = inject(VehiculoService);
  private routesService = inject(RoutesService);

  conductor = signal<ConductorResponse | null>(null);
  vehiculo = signal<VehiculoResponse | null>(null);
  solicitudes = signal<SolicitudViajeCardResponse[]>([]);
  comentarios = signal<ComentarioConductorResponse[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  fotoPerfil = signal<string>('assets/default-avatar.png');

  ngOnInit(): void {
    this.loadPerfil();
    this.loadVehiculo();
    this.loadSolicitudes();
    this.loadComentarios();
  }

  loadPerfil(): void {
    const id = this.auth.getConductorId();
    
    if (!id) {
      this.errorMessage.set('Usuario no autenticado');
      return;
    }

    this.loading.set(true);

    this.conductorService.getById(id).subscribe({
      next: (data) => {
        console.log('Perfil conductor cargado:', data);
        this.conductor.set(data);
        
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

  loadVehiculo(): void {
    const id = this.auth.getConductorId();
    if (!id) return;

    this.vehiculoService.getVehiculoByConductor(id).subscribe({
      next: (data) => {
        console.log('Vehículo cargado:', data);
        this.vehiculo.set(data);
      },
      error: (err) => {
        console.error('Error cargando vehículo:', err);
      }
    });
  }

  loadSolicitudes(): void {
    const id = this.auth.getConductorId();
    if (!id) return;

    // Cargar próximos viajes del conductor
    this.routesService.getMisRutas(id).subscribe({
      next: (rutas) => {
        console.log('Rutas cargadas:', rutas);
        
        // Filtrar solo rutas futuras y programadas
        const ahora = new Date();
        const rutasFuturas = rutas
          .filter(r => {
            const fechaRuta = new Date(r.fechaSalida);
            return fechaRuta >= ahora && r.estadoRuta === 'PROGRAMADO';
          })
          .map(r => ({
            idRuta: r.idRuta,
            origen: (r as any).origen || 'Origen',
            destino: (r as any).destino || 'Destino',
            fechaSalida: r.fechaSalida,
            horaSalida: r.horaSalida,
            capacidad: r.asientosDisponibles,
            tarifa: r.tarifa || 0
          }));
        
        this.solicitudes.set(rutasFuturas);
      },
      error: (err) => {
        console.error('Error cargando solicitudes:', err);
      }
    });
  }

  loadComentarios(): void {
    // Simulación de comentarios - reemplazar con llamada real al backend
    const mockComentarios: ComentarioConductorResponse[] = [
      {
        idComentario: 1,
        nombreUsuario: 'Ricardo',
        calificacion: 5,
        comentario: 'Llegó muy rápido a la universidad cuando pensaba que iba a llegar tarde',
        fecha: '2025-09-20'
      },
      {
        idComentario: 2,
        nombreUsuario: 'Andrea',
        calificacion: 1,
        comentario: 'Se pasaba todas las luces rojas!',
        fecha: '2025-09-15'
      }
    ];
    
    this.comentarios.set(mockComentarios);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.fotoPerfil.set(result);
        this.subirFoto(result);
      };
      reader.readAsDataURL(file);
    }
  }

  subirFoto(fotoBase64: string): void {
    const id = this.auth.getConductorId();
    if (!id) return;

    // Aquí llamar al servicio para actualizar la foto
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
    return this.conductor()?.calificacionPromedio || 4;
  }

  getTotalCalificaciones(): number {
    return this.conductor()?.totalCalificaciones || 131;
  }

  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const diaSemana = diasSemana[date.getDay()];
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const año = date.getFullYear();

    return `${diaSemana} ${dia} de ${mes}, ${año}`;
  }

  verDetalles(solicitud: SolicitudViajeCardResponse): void {
    console.log('Ver detalles de solicitud:', solicitud);
  }
}
