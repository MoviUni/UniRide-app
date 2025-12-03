// src/app/features/historial/pages/historial-conductor/historial-conductor.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router  } from '@angular/router';
import { SolicitudService } from '../../../../core/services/solicitud.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SolicitudCardResponse, EstadoSolicitud } from '../../../../core/models/solicitud.model';
import { ModalCalificacionComponent } from '../../../../shared/components/modal-calificacion/modal-calificacion.component';
import { forkJoin } from 'rxjs';
import { PasajeroService } from '@core/services/pasajero.service';

interface ViajeAgrupado {
  fecha: string;
  fechaCompleta: string;
  viajes: SolicitudCardResponse[];
}

@Component({
  selector: 'app-historial-conductor',
  standalone: true,
  imports: [CommonModule, RouterModule, ModalCalificacionComponent],
  templateUrl: './historial-conductor.html',
  styleUrls: ['./historial-conductor.css']
})
export class HistorialConductor implements OnInit {
  private solicitudService = inject(SolicitudService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private pasajeroService = inject(PasajeroService);


  historialAgrupado = signal<ViajeAgrupado[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  // Modal de calificación
  isModalOpen = signal(false);
  viajeSeleccionado = signal<SolicitudCardResponse | null>(null);

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    const conductorId = this.auth.getConductorId();
    
    if (!conductorId) {
      this.errorMessage.set('Usuario no autenticado');
      return;
    }

    this.loading.set(true);

    this.solicitudService.getInfoConductor(conductorId).subscribe({
      next: (data: SolicitudCardResponse[]) => {
        console.log('Historial conductor cargado:', data);
        
        // Filtrar solo solicitudes aceptadas (viajes realizados)
        const viajesRealizados = data.filter(
          (s) => s.estadoSolicitud === EstadoSolicitud.FINALIZADO
        );

        // Agrupar por fecha
        const agrupado = this.agruparPorFecha(viajesRealizados);
        this.historialAgrupado.set(agrupado);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando historial:', err);
        this.errorMessage.set('Error al cargar el historial. Intenta más tarde.');
        this.loading.set(false);
      }
    });
  }

  agruparPorFecha(viajes: SolicitudCardResponse[]): ViajeAgrupado[] {
    const grupos: { [key: string]: SolicitudCardResponse[] } = {};

    viajes.forEach((viaje) => {
      const fecha = viaje.fechaSalida;
      if (!grupos[fecha]) {
        grupos[fecha] = [];
      }
      grupos[fecha].push(viaje);
    });

    // Convertir a array y ordenar por fecha descendente
    const resultado = Object.keys(grupos)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((fecha) => ({
        fecha,
        fechaCompleta: this.formatFechaCompleta(fecha),
        viajes: grupos[fecha]
      }));

    return resultado;
  }

  formatFechaCompleta(fecha: string): string {
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

  getEstrellas(rating: number = 4): string[] {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(i <= rating ? '★' : '☆');
    }
    return estrellas;
  }

  verDetalles(viaje: SolicitudCardResponse): void {
    console.log('Ver detalles del viaje:', viaje);
    // Aquí puedes navegar a una página de detalles si existe
    // this.router.navigate(['/historial/detalle', viaje.idSolicitudViaje]);
  }

  abrirModalCalificacion(viaje: SolicitudCardResponse): void {
    this.viajeSeleccionado.set(viaje);
    this.isModalOpen.set(true);
  }

  cerrarModal(): void {
    this.isModalOpen.set(false);
    this.viajeSeleccionado.set(null);
  }

  onCalificacionGuardada(): void {
    // Recargar el historial después de calificar
    this.loadHistory();
  }

  //Pop up para ver más detalles
  mensajePopup: string = '';
  mostrarPopup: boolean = false;
  rutaDetails = signal<any[]>([]);

  mostrarMensaje(dt: any) {
  this.mensajePopup = 'Detalles de la solicitud';
  this.mostrarPopup = true;

  // 1. Traer todas las solicitudes de esa ruta
  this.solicitudService.getSolicitudesPorRuta(dt.idRuta).subscribe({
    next: (solicitudes) => {
      // 2. Filtrar solo las aceptadas
      const solicitudesRelevantes = solicitudes.filter(
  s => [EstadoSolicitud.ACEPTADO, EstadoSolicitud.FINALIZADO].includes(s.estadoSolicitud)
);

      // 3. Sacar los IDs de pasajero
      const idsPasajeros = solicitudesRelevantes.map(s => s.pasajeroId);

      if (idsPasajeros.length === 0) {
        this.rutaDetails.set([{ ...dt, pasajeros: [] }]);
        return;
      }

      // 4. Traer los datos de los pasajeros
      const observables = idsPasajeros.map(id => this.pasajeroService.getById(id));
      forkJoin(observables).subscribe({
        next: (pasajeros) => {
          const dtConPasajeros = { ...dt, pasajeros };
          this.rutaDetails.set([dtConPasajeros]);
        },
        error: (err) => {
          console.error('Error cargando pasajeros:', err);
          this.rutaDetails.set([{ ...dt, pasajeros: [] }]); // fallback sin pasajeros
        }
      });
    },
    error: (err) => {
      console.error('Error cargando solicitudes de la ruta:', err);
      this.rutaDetails.set([{ ...dt, pasajeros: [] }]); // fallback sin pasajeros
    }
  });
}


cerrarPopup(event: Event) {
  this.mostrarPopup = false;
  this.rutaDetails.set([]);
}



}
