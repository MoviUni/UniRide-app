import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudService } from '@core/services/solicitud.service';
import { EstadoSolicitud, SolicitudCardResponse, SolicitudViajeRequest } from '@core/models/solicitud.model';
import { RutaService } from '@core/services/ruta.service';
import { RutaResponse } from '@core/models/ruta.model';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-pasajero-solicitudes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <div class="frame-427318940">
  <p class="title-sol"> Solicitudes realizadas </p>
  
  <!-- Filtros por estado -->
  <div class="filtros-container">
    <button 
      class="filtro-btn" 
      [class.active]="filtroActivo() === 'TODOS'"
      (click)="filtrarPorEstado('TODOS')">
      Todas
    </button>
    <button 
      class="filtro-btn" 
      [class.active]="filtroActivo() === 'PENDIENTE'"
      (click)="filtrarPorEstado('PENDIENTE')">
      Pendientes
    </button>
    <button 
      class="filtro-btn" 
      [class.active]="filtroActivo() === 'ACEPTADO'"
      (click)="filtrarPorEstado('ACEPTADO')">
      Aceptadas
    </button>
    <button 
      class="filtro-btn" 
      [class.active]="filtroActivo() === 'RECHAZADO'"
      (click)="filtrarPorEstado('RECHAZADO')">
      Rechazadas
    </button>
    <button 
      class="filtro-btn" 
      [class.active]="filtroActivo() === 'CANCELADO'"
      (click)="filtrarPorEstado('CANCELADO')">
      Canceladas
    </button>
  </div>

  <div class="mi_cuenta_contenido" >
    <div class="ruta-list-box">
    @if (loading()) {
      <p>Cargando solicitudes...</p>
    } @else if (errorMessage()) {
      <div class="rectangle2">
        <span class="sin-texto">{{ errorMessage() }}</span>
        <img class="sin-imagen" src="assets/history.png" />
      </div>
    } @else if (solicitudesFiltradas().length === 0) {
      <div class="rectangle2">
        <span class="sin-texto">No tienes solicitudes {{ filtroActivo() === 'TODOS' ? '' : filtroActivo().toLowerCase() }}...</span>
        <img class="sin-imagen" src="assets/history.png" />
      </div>
    } @else {
      @for (tx of solicitudesFiltradas(); track tx.idSolicitudViaje) {
        <button class="ruta-box1" (click)="mostrarMensaje(tx)">
          <div class="rectangle1"></div>

          <div class="hoy_01">
            <span class="hoy_01_span">{{ 'Empieza en ' + diferenciaFechas(tx.fechaSalida, tx.horaSalida) }}</span>
          </div>
          
          <div class="estado-btn" [ngStyle]="{'background-color': getColor(tx.estadoSolicitud)}">
            {{ tx.estadoSolicitud }}
          </div>
          
          <div class="origen-text-1">
            <span>{{ tx.origen }}</span>
            <span> → </span>
            <span>{{ tx.destino }}</span>
          </div>
          
          <div class="hora-salida1">
            <span>{{ 'Hora de salida: ' + tx.horaSalida }}</span>
          </div>
          <div class="capacidad-text1">
            <span>{{ 'Capacidad personas: ' + tx.asientosDisponibles }}</span>
          </div>
          <div class="precio-text-1">
            <span>{{ 's/.' + tx.tarifa }}</span>
          </div>
          <div class="conductor-text1">
            <span>{{ tx.nombreConductor + ' ' + tx.apellidoConductor }}</span>
          </div>
          <img class="image-conductor" src="assets/ConductorLogo.png" />
        </button>
        
        @if (tx.estadoSolicitud === 'PENDIENTE') {
          <button type="button" class="cancelar" (click)="cancelarSolicitud(tx)">
            Cancelar Solicitud
          </button>
        }
      }
    }
    </div>

    <div class="frame-427318923"></div>
    <div class="inicio">
      <a routerLink='/main/pasajero' class="inicio_span">Inicio</a>
    </div>
    <div class="text-"><span class="fspan">></span></div>
    <div class="bsqueda-de-rutas">
      <span class="bsquedaderutas_span">Mis solicitudes</span>
    </div>
  </div>
</div>

@if (mostrarPopup && rutaDetails().length > 0) {
  <div class="popup-overlay" (click)="cerrarPopup($event)">
    <div class="popup-box" (click)="$event.stopPropagation()">
      <div class="popup-close" (click)="cerrarPopup($event)">×</div>

      <p class="popup-message">{{ mensajePopup }}</p>
      <div class="popup-estado" [ngStyle]="{'background-color': getColor(rutaDetails()[0].estadoSolicitud)}">
        {{ rutaDetails()[0].estadoSolicitud }}
      </div>
      
      <div class="rectangle-trayecto">
        <p class="popup-section">Información del trayecto</p>
        
        <p class="popup-info">
          {{ "Origen y destino: " + rutaDetails()[0].origen + " → " + rutaDetails()[0].destino }}
        </p>
        
        <p class="popup-info">
          {{ "Hora y fecha de salida: " + rutaDetails()[0].horaSalida + " " + rutaDetails()[0].fechaSalida }}
        </p>
        
        <p class="popup-info">{{ "Precio: s/." + rutaDetails()[0].tarifa }}</p>

        <p class="popup-info">{{ "Capacidad de pasajeros: " + rutaDetails()[0].asientosDisponibles }}</p>
        
      </div>
      
      <div class="rectangle-conductor">
        <p class="popup-section">Información sobre el conductor</p>

        <p class="popup-info">
          {{ "Nombre y apellido: " + rutaDetails()[0].nombreConductor + " " + rutaDetails()[0].apellidoConductor }}
        </p>

        <p class="popup-section">Información sobre el vehículo</p>

        <p class="popup-info">{{ "Modelo: " + rutaDetails()[0].vehiculoModelo }}</p>
        <p class="popup-info">{{ "Color: " + rutaDetails()[0].vehiculoColor }}</p>
        <p class="popup-info">{{ "Placa: " + rutaDetails()[0].vehiculoPlaca }}</p>
        <img class="veh-img" src="assets/search.png" />
      </div>
    </div>
  </div>
}
  `,
  styleUrls: ['./pasajero.solicitudes.component.css']
})
export class PasajeroSolicitudesComponent implements OnInit {

  constructor(
    private solicitudService: SolicitudService, 
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}
    
  errorMessage = signal('');
  allSolicitudes = signal<SolicitudCardResponse[]>([]);
  solicitudes = signal<SolicitudCardResponse[]>([]);
  solicitudesFiltradas = signal<SolicitudCardResponse[]>([]);
  filtroActivo = signal<string>('TODOS');

  loading = signal(true);

  // Popup que muestra los detalles de las rutas
  mensajePopup: string = '';
  mostrarPopup: boolean = false;
  rutaDetails = signal<SolicitudCardResponse[]>([]);

  ngOnInit() {
    const pasajeroId = this.authService.getPasajeroId();

    if (!pasajeroId) {
      console.error('Usuario no autenticado');
      this.errorMessage.set('Usuario no autenticado');
      this.loading.set(false);
      return;
    }
    
    this.loadSolicitudes(pasajeroId);
  }

  loadSolicitudes(pasajeroId: number) {
    this.loading.set(true);
    
    this.solicitudService.getInfo(pasajeroId).subscribe({
      next: (solicitudes) => {
        console.log('Solicitudes recibidas del backend:', solicitudes);
        
        // Ordenar: primero ACEPTADO, luego PENDIENTE, luego las demás
        const ordenadas = solicitudes.sort((a, b) => {
          const orden: Record<string, number> = {
            'ACEPTADO': 1,
            'PENDIENTE': 2,
            'RECHAZADO': 3,
            'CANCELADO': 4
          };
          return (orden[a.estadoSolicitud] || 5) - (orden[b.estadoSolicitud] || 5);
        });

        this.allSolicitudes.set(ordenadas);
        this.solicitudes.set(ordenadas);
        this.solicitudesFiltradas.set(ordenadas);
        this.loading.set(false);
        
        console.log('Solicitudes cargadas:', solicitudes.length);
      },
      error: (error) => {
        console.error('Error cargando solicitudes:', error);
        this.errorMessage.set('No se pudieron cargar las solicitudes. Intenta de nuevo.');
        this.loading.set(false);
      }
    });
  }

  filtrarPorEstado(estado: string) {
    this.filtroActivo.set(estado);
    
    if (estado === 'TODOS') {
      this.solicitudesFiltradas.set(this.allSolicitudes());
    } else {
      const filtradas = this.allSolicitudes().filter(
        solicitud => solicitud.estadoSolicitud === estado
      );
      this.solicitudesFiltradas.set(filtradas);
    }
  }

  getColor(estado: string): string {
    const colores: Record<string, string> = {
      'PENDIENTE': '#FFA500',      // Naranja
      'ACEPTADO': '#4CAF50',       // Verde
      'RECHAZADO': '#757575',      // Gris oscuro
      'CANCELADO': '#F44336',      // Rojo
      'CANCELADO_CONDUCTOR': '#D32F2F'  // Rojo oscuro
    };
    
    return colores[estado] || '#9E9E9E';
  }

  diferenciaFechas(date1: string, hour1: string): string {
    const time1 = Date.now();
    const _date1 = new Date(date1 + "T" + hour1);
    const time2 = _date1.getTime();
    const diffInMs = time2 - time1;
    
    if (diffInMs < 0) {
      return 'Viaje pasado';
    }
    
    const daysToStart = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (daysToStart <= 1 && daysToStart > 0) {
      const horasToStart = Math.ceil(diffInMs / (1000 * 60 * 60));
      if (horasToStart <= 1) {
        const minutosToStart = Math.ceil(diffInMs / (1000 * 60));
        return minutosToStart + " minutos";
      }
      return horasToStart + " horas";
    }
    
    return daysToStart + " días";
  }

  cancelarSolicitud(solicitud: SolicitudCardResponse) {
    if (!confirm('¿Estás seguro de que deseas cancelar esta solicitud?')) {
      return;
    }

    this.solicitudService.cancelSolicitud(solicitud.idSolicitudViaje).subscribe({
      next: () => {
        alert("Solicitud cancelada exitosamente");
        // Recargar solicitudes
        const pasajeroId = this.authService.getPasajeroId();
        if (pasajeroId) {
          this.loadSolicitudes(pasajeroId);
        }
      },
      error: (error) => {
        console.error('Error cancelando solicitud:', error);
        alert('Error al cancelar la solicitud. Intenta de nuevo.');
      }
    });
  }

  mostrarMensaje(dt: SolicitudCardResponse) {
    this.mensajePopup = 'Detalles de la solicitud';
    this.mostrarPopup = true;
    this.rutaDetails.set([dt]);
  }

  cerrarPopup(event: Event) {
    this.mostrarPopup = false;
    this.rutaDetails.set([]);
  }
}