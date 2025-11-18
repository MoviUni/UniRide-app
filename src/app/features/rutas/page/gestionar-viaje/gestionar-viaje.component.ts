// src/app/features/rutas/page/gestiona-tu-viaje/gestiona-viaje.component.ts

import {
  Component,
  OnInit,
  computed,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { RutaService } from '../../../../core/services/ruta.service';
import { SolicitudService } from '../../../../core/services/solicitud.service';

import {
  RutaResponseDTO,
  EstadoRuta,
} from '../../../../core/models/ruta.model';

import {
  SolicitudViajeResponse,
  EstadoSolicitud,
} from '../../../../core/models/solicitud.model';

@Component({
  selector: 'app-gestiona-tu-viaje',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestionar-viaje.component.html',
  styleUrls: ['./gestionar-viaje.component.css'],
})
export class GestionarViajeComponent implements OnInit {
  private rutaService = inject(RutaService);
  private solicitudService = inject(SolicitudService);
  private activatedRoute = inject(ActivatedRoute);

  ruta = signal<RutaResponseDTO | null>(null);
  private _solicitudes = signal<SolicitudViajeResponse[]>([]);

  loadingRuta = signal(true);
  loadingSolicitudes = signal(true);
  error = signal<string | null>(null);

  // 🔹 lista de pendientes (para la columna izquierda)
  solicitudesPendientes = computed(() =>
    this._solicitudes().filter(
      (s) => s.estadoSolicitud === EstadoSolicitud.PENDIENTE
    )
  );

  // 🔹 lista de aceptados (para “Pasajeros confirmados”)
  pasajerosConfirmados = computed(() =>
    this._solicitudes().filter(
      (s) => s.estadoSolicitud === EstadoSolicitud.ACEPTADO
    )
  );
  limiteHabilitacion = computed(() => {
  const r = this.ruta();
  if (!r) return null;

  // Crear un objeto Date a partir de fechaSalida + horaSalida
  const fechaStr = r.fechaSalida;  // "2025-11-30"
  const horaStr = r.horaSalida;    // "08:00:00"

  const fechaHora = new Date(`${fechaStr}T${horaStr}`);

  // Restar 1 hora
  fechaHora.setHours(fechaHora.getHours() - 1);

  // Formateo manual (muy simple y sin dependencias)
  const opcionesFecha: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };

  const opcionesHora: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };

  const fechaFormateada = fechaHora.toLocaleDateString('es-PE', opcionesFecha);
  const horaFormateada = fechaHora.toLocaleTimeString('es-PE', opcionesHora);

  return `${fechaFormateada} a las ${horaFormateada}`;
});
  // ----------------------------------------------------------------

  ngOnInit(): void {
    const idRuta = Number(
      this.activatedRoute.snapshot.paramMap.get('idRuta')
    );

    if (!idRuta) {
      this.error.set('Ruta no encontrada');
      this.loadingRuta.set(false);
      this.loadingSolicitudes.set(false);
      return;
    }

    this.cargarRuta(idRuta);
    this.cargarSolicitudes(idRuta);
  }

  private cargarRuta(idRuta: number): void {
    this.loadingRuta.set(true);
    this.rutaService.getRutaById(idRuta).subscribe({
      next: (ruta) => {
        this.ruta.set(ruta);
        this.loadingRuta.set(false);
      },
      error: (err) => {
        console.error('Error cargando ruta', err);
        this.error.set('No se pudo cargar la información de la ruta');
        this.loadingRuta.set(false);
      },
    });
  }

  private cargarSolicitudes(idRuta: number): void {
    this.loadingSolicitudes.set(true);
    this.solicitudService.getSolicitudesPorRuta(idRuta).subscribe({
      next: (lista) => {
        this._solicitudes.set(lista);
        this.loadingSolicitudes.set(false);
      },
      error: (err) => {
        console.error('Error cargando solicitudes', err);
        this.error.set('No se pudieron cargar las solicitudes');
        this.loadingSolicitudes.set(false);
      },
    });
  }

  // Helpers para mostrar en la UI
  nombreCompleto(s: SolicitudViajeResponse): string {
    return `${s.pasajeroNombre} ${s.pasajeroApellido}`;
  }

  // ----------------------------------------------------------------
  //  Acciones sobre solicitudes
  // ----------------------------------------------------------------

  aceptarSolicitud(s: SolicitudViajeResponse): void {
    this.solicitudService
      .cambiarEstadoSolicitud(s.idSolicitudViaje, EstadoSolicitud.ACEPTADO)
      .subscribe({
        // No confiamos en la forma de la respuesta, solo en que fue OK
        next: () => {
          // 1) Actualizar el estado de la solicitud en memoria
          this._solicitudes.update((actuales) =>
            actuales.map((sol) =>
              sol.idSolicitudViaje === s.idSolicitudViaje
                ? { ...sol, estadoSolicitud: EstadoSolicitud.ACEPTADO }
                : sol
            )
          );

          // 2) Actualizar asientos disponibles en la ruta (opcional pero bonito para la UI)
          this.ruta.update((rutaActual) => {
            if (!rutaActual) return rutaActual;
            return {
              ...rutaActual,
              asientosDisponibles: rutaActual.asientosDisponibles - 1,
            };
          });
        },
        error: (err) => {
          console.error('Error al aceptar solicitud', err);
          alert('No se pudo aceptar la solicitud');
        },
      });
  }

  rechazarSolicitud(s: SolicitudViajeResponse): void {
    this.solicitudService
      .cambiarEstadoSolicitud(s.idSolicitudViaje, EstadoSolicitud.RECHAZADO)
      .subscribe({
        next: () => {
          this._solicitudes.update((actuales) =>
            actuales.map((sol) =>
              sol.idSolicitudViaje === s.idSolicitudViaje
                ? { ...sol, estadoSolicitud: EstadoSolicitud.RECHAZADO }
                : sol
            )
          );
        },
        error: (err) => {
          console.error('Error al rechazar solicitud', err);
          alert('No se pudo rechazar la solicitud');
        },
      });
  }

  // ----------------------------------------------------------------
  //  Confirmar / cancelar viaje
  // ----------------------------------------------------------------

  confirmarViaje(): void {
    const ruta = this.ruta();
    if (!ruta) return;

    this.rutaService
      .cambiarEstadoRuta(ruta.idRuta!, EstadoRuta.CONFIRMADO)
      .subscribe({
        next: (updated) => {
          this.ruta.set(updated);
          alert('Viaje confirmado correctamente');
        },
        error: (err) => {
          console.error('Error al confirmar viaje', err);
          alert(err?.error?.message ?? 'No se pudo confirmar el viaje');
        },
      });
  }

  cancelarViaje(): void {
    const ruta = this.ruta();
    if (!ruta) return;

    this.rutaService
      .cambiarEstadoRuta(ruta.idRuta!, EstadoRuta.CANCELADO)
      .subscribe({
        next: (updated) => {
          this.ruta.set(updated);
          alert('Viaje cancelado correctamente');
        },
        error: (err) => {
          console.error('Error al cancelar viaje', err);
          alert(err?.error?.message ?? 'No se pudo cancelar el viaje');
        },
      });
  }
}
