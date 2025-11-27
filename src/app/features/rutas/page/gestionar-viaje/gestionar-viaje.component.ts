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

import { ToastService } from '../../../../shared/services/toast.service';

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
  private toast = inject(ToastService);   // inyectamos toast

  ruta = signal<RutaResponseDTO | null>(null);
  private _solicitudes = signal<SolicitudViajeResponse[]>([]);

  loadingRuta = signal(true);
  loadingSolicitudes = signal(true);
  error = signal<string | null>(null);

  // ----------------- Helpers de tiempo -----------------
  private getDiffMinHastaSalida(r: RutaResponseDTO | null): number | null {
    if (!r) return null;
    const fechaHora = new Date(`${r.fechaSalida}T${r.horaSalida}`);
    const ahora = new Date();
    return (fechaHora.getTime() - ahora.getTime()) / 60000;
  }

  // límite 1h antes de la salida
  limiteHabilitacion = computed(() => {
    const r = this.ruta();
    if (!r) return null;

    const fechaHora = new Date(`${r.fechaSalida}T${r.horaSalida}`);
    fechaHora.setHours(fechaHora.getHours() - 1);

    const opcionesFecha: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };

    const opcionesHora: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const fechaFormateada = fechaHora.toLocaleDateString('es-PE', opcionesFecha);
    const horaFormateada = fechaHora.toLocaleTimeString('es-PE', opcionesHora);

    return `${fechaFormateada} a las ${horaFormateada}`;
  });

  // ----------------- Computeds de estado UI -----------------

  //  - Confirmar / Cancelar solo si:
  //      estado = PROGRAMADO y falta > 60 min
  puedeConfirmar = computed(() => {
    const r = this.ruta();
    const diff = this.getDiffMinHastaSalida(r);
    if (!r || diff === null) return false;
    if (r.estadoRuta !== EstadoRuta.PROGRAMADO) return false;
    return diff > 60;
  });

  puedeCancelar = computed(() => {
    const r = this.ruta();
    const diff = this.getDiffMinHastaSalida(r);
    if (!r || diff === null) return false;
    if (r.estadoRuta !== EstadoRuta.PROGRAMADO) return false;
    return diff > 60;
  });

  //  - Gestionar solicitudes:
  //      * PROGRAMADO: solo si falta > 60 min
  //      * CONFIRMADO: siempre (hasta que se inicie)
  //      * otros estados: no
  puedeGestionarSolicitudes = computed(() => {
    const r = this.ruta();
    const diff = this.getDiffMinHastaSalida(r);
    if (!r || diff === null) return false;

    if (r.estadoRuta === EstadoRuta.CANCELADO ||
        r.estadoRuta === EstadoRuta.FINALIZADO ||
        r.estadoRuta === EstadoRuta.EN_PROGRESO) {
      return false;
    }

    if (r.estadoRuta === EstadoRuta.PROGRAMADO) {
      return diff > 60;
    }

    if (r.estadoRuta === EstadoRuta.CONFIRMADO) {
      return true;
    }

    return false;
  });

  // ----------------- Listas derivadas -----------------

  solicitudesPendientes = computed(() =>
    this._solicitudes().filter(
      (s) => s.estadoSolicitud === EstadoSolicitud.PENDIENTE
    )
  );

  pasajerosConfirmados = computed(() =>
    this._solicitudes().filter(
      (s) => s.estadoSolicitud === EstadoSolicitud.ACEPTADO
    )
  );

  // ----------------------------------------------------------------

  ngOnInit(): void {
    const idRuta = Number(
      this.activatedRoute.snapshot.paramMap.get('idRuta')
    );

    if (!idRuta) {
      this.error.set('Ruta no encontrada');
      this.toast.show('Ruta no encontrada.', 'error');
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
        this.toast.show(
          err?.error?.message ?? 'No se pudo cargar la información de la ruta.',
          'error'
        );
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
        this.toast.show(
          err?.error?.message ?? 'No se pudieron cargar las solicitudes.',
          'error'
        );
        this.loadingSolicitudes.set(false);
      },
    });
  }

  // Helpers para mostrar en la UI
  nombreCompleto(s: SolicitudViajeResponse): string {
    return `${s.pasajeroNombre} ${s.pasajeroApellido}`;
  }

  // ----------------------------------------------------------------
  //  Acciones sobre solicitudes (el botón ya se desactiva si no se puede)
  // ----------------------------------------------------------------

  aceptarSolicitud(s: SolicitudViajeResponse): void {
    if (!this.puedeGestionarSolicitudes()) {
      this.toast.show(
        'Ya no puedes gestionar solicitudes para este viaje.',
        'info'
      );
      return;
    }

    this.solicitudService
      .cambiarEstadoSolicitud(s.idSolicitudViaje, EstadoSolicitud.ACEPTADO)
      .subscribe({
        next: () => {
          this._solicitudes.update((actuales) =>
            actuales.map((sol) =>
              sol.idSolicitudViaje === s.idSolicitudViaje
                ? { ...sol, estadoSolicitud: EstadoSolicitud.ACEPTADO }
                : sol
            )
          );

          this.ruta.update((rutaActual) => {
            if (!rutaActual) return rutaActual;
            return {
              ...rutaActual,
              asientosDisponibles: rutaActual.asientosDisponibles - 1,
            };
          });

          this.toast.show('Solicitud aceptada.', 'success');
        },
        error: (err) => {
          console.error('Error al aceptar solicitud', err);
          this.toast.show(
            err?.error?.message ?? 'No se pudo aceptar la solicitud.',
            'error'
          );
        },
      });
  }

  rechazarSolicitud(s: SolicitudViajeResponse): void {
    if (!this.puedeGestionarSolicitudes()) {
      this.toast.show(
        'Ya no puedes gestionar solicitudes para este viaje.',
        'info'
      );
      return;
    }

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
          this.toast.show('Solicitud rechazada.', 'success');
        },
        error: (err) => {
          console.error('Error al rechazar solicitud', err);
          this.toast.show(
            err?.error?.message ?? 'No se pudo rechazar la solicitud.',
            'error'
          );
        },
      });
  }

  // ----------------------------------------------------------------
  //  Confirmar / cancelar viaje (el backend sigue validando)
  // ----------------------------------------------------------------

  confirmarViaje(): void {
    if (!this.puedeConfirmar()) {
      this.toast.show(
        'Solo puedes confirmar si falta más de 1 hora y la ruta está en estado PROGRAMADO.',
        'info'
      );
      return;
    }

    const ruta = this.ruta();
    if (!ruta) return;

    this.rutaService
      .cambiarEstadoRuta(ruta.idRuta!, EstadoRuta.CONFIRMADO)
      .subscribe({
        next: (updated) => {
          this.ruta.set(updated);
          this.toast.show('Viaje confirmado correctamente.', 'success');
        },
        error: (err) => {
          console.error('Error al confirmar viaje', err);
          this.toast.show(
            err?.error?.message ?? 'No se pudo confirmar el viaje.',
            'error'
          );
        },
      });
  }

  cancelarViaje(): void {
    if (!this.puedeCancelar()) {
      this.toast.show(
        'Solo puedes cancelar si falta más de 1 hora y la ruta está en estado PROGRAMADO.',
        'info'
      );
      return;
    }

    const ruta = this.ruta();
    if (!ruta) return;

    this.rutaService
      .cambiarEstadoRuta(ruta.idRuta!, EstadoRuta.CANCELADO)
      .subscribe({
        next: (updated) => {
          this.ruta.set(updated);
          this.toast.show('Viaje cancelado correctamente.', 'success');
        },
        error: (err) => {
          console.error('Error al cancelar viaje', err);
          this.toast.show(
            err?.error?.message ?? 'No se pudo cancelar el viaje.',
            'error'
          );
        },
      });
  }
}
