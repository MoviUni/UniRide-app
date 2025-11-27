// src/app/features/rutas/page/rutas-conductor/rutas-conductor.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';

import { RutaService } from '@core/services/ruta.service';
import { RutaResponseDTO, EstadoRuta } from '@core/models/ruta.model';
import { SolicitudService } from '@core/services/solicitud.service';
import {
  EstadoSolicitud,
  SolicitudViajeResponse
} from '@core/models/solicitud.model';
import { AuthService } from '@core/services/auth.service';

import { ToastService } from '@shared/services/toast.service';

type RutaConSolicitudes = RutaResponseDTO & {
  solicitudesPendientes: number;
  pasajerosAceptados: number;
};

@Component({
  selector: 'app-rutas-conductor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rutas-conductor.component.html',
  styleUrls: ['./rutas-conductor.component.css'],
})
export class RutasConductorComponent implements OnInit {

  loading = signal(true);
  error = signal<string | null>(null);

  private _rutas = signal<RutaConSolicitudes[]>([]);
  rutas = this._rutas.asReadonly();

  constructor(
    private rutaService: RutaService,
    private solicitudService: SolicitudService,
    private router: Router,
    private authService: AuthService,
    private toast: ToastService,           // inyectamos toast
  ) {}

  // Helper fecha+hora → Date
  private toDate(fecha: string, hora: string): Date {
    // formato backend: 'YYYY-MM-DD' y 'HH:mm:ss'
    return new Date(`${fecha}T${hora}`);
  }

  // Diferencia en minutos (salida - ahora)
  private diffMinutosHastaSalida(r: RutaConSolicitudes): number {
    const salida = this.toDate(
      r.fechaSalida as unknown as string,
      r.horaSalida as unknown as string
    );
    const ahora = new Date();
    return (salida.getTime() - ahora.getTime()) / 60000;
  }

  // ¿Se muestra en la tarjeta "Viaje por iniciar"?
  // - EN_PROGRESO siempre
  // - CONFIRMADO con ≥1 pasajero aceptado, ventana [-10, 30] minutos
  private puedeMostrarseEnViajePorIniciar(r: RutaConSolicitudes): boolean {
    if (r.estadoRuta === EstadoRuta.EN_PROGRESO) return true;

    if (r.estadoRuta !== EstadoRuta.CONFIRMADO) return false;
    if (r.pasajerosAceptados < 1) return false;

    const diff = this.diffMinutosHastaSalida(r);
    // desde 30 min antes hasta 10 min después de la hora de salida
    return diff >= -10 && diff <= 30;
  }

  // Botón "Iniciar viaje":
  // - CONFIRMADO
  // - ≥1 pasajero aceptado
  // - desde la hora de salida hasta 10 min después (diff [-10, 0])
  public puedeIniciar(r: RutaConSolicitudes): boolean {
    if (r.estadoRuta !== EstadoRuta.CONFIRMADO) return false;
    if (r.pasajerosAceptados < 1) return false;

    const diff = this.diffMinutosHastaSalida(r);
    return diff >= -10 && diff <= 0;
  }

  // VIAJE POR INICIAR / EN CURSO
  viajePorIniciar = computed(() => {
    const rutas = this.rutas();

    // 1) Si hay viaje en progreso, ese es el actual
    const enProgreso = rutas.find(
      (r) => r.estadoRuta === EstadoRuta.EN_PROGRESO
    );
    if (enProgreso) return enProgreso;

    // 2) Si no, buscamos uno confirmado en la ventana [-10, 30] min
    const candidato = rutas.find((r) =>
      this.puedeMostrarseEnViajePorIniciar(r)
    );
    return candidato ?? null;
  });

  // PRÓXIMOS VIAJES:
  // - estados PROGRAMADO o CONFIRMADO
  // - salida futura
  // - excluimos el viajePorIniciar
  proximosViajes = computed(() => {
    const ahora = new Date();
    const viajeActual = this.viajePorIniciar();

    return this.rutas().filter((r) => {
      const salida = this.toDate(
        r.fechaSalida as unknown as string,
        r.horaSalida as unknown as string
      );
      const diffMin = (salida.getTime() - ahora.getTime()) / 60000;

      if (diffMin < 0) return false; // ya pasó completamente

      if (
        r.estadoRuta !== EstadoRuta.PROGRAMADO &&
        r.estadoRuta !== EstadoRuta.CONFIRMADO
      ) {
        return false;
      }

      if (viajeActual && viajeActual.idRuta === r.idRuta) {
        return false;
      }

      return true;
    });
  });

  ngOnInit(): void {
    this.cargarRutas();
  }

  // ----------------------------------------------------------------
  // Carga rutas activas y, para cada ruta, consulta sus solicitudes.
  // Cuenta PENDIENTE y ACEPTADO.
  // ----------------------------------------------------------------
  private cargarRutas(): void {
    this.loading.set(true);
    this.error.set(null);

    const conductorId = this.authService.getConductorId();
    console.log('conductorId desde auth:', conductorId);

    if (!conductorId) {
      console.error('Usuario no autenticado');
      this.error.set('No se pudo determinar tu usuario');
      this.toast.show('No se pudo determinar el usuario autenticado.', 'error');
      this.loading.set(false);
      return;
    }

    this.rutaService.getRutasActivasDelConductor(conductorId).subscribe({
      next: (rutas) => {
        if (!rutas || rutas.length === 0) {
          this._rutas.set([]);
          this.loading.set(false);
          return;
        }

        const rutasConSolicitudes: RutaConSolicitudes[] = new Array(rutas.length);
        let respuestasRecibidas = 0;

        rutas.forEach((ruta, index) => {
          this.solicitudService.getSolicitudesPorRuta(ruta.idRuta).subscribe({
            next: (solicitudes: SolicitudViajeResponse[]) => {
              const pendientes = solicitudes.filter(
                (s) => s.estadoSolicitud === EstadoSolicitud.PENDIENTE
              ).length;

              const aceptados = solicitudes.filter(
                (s) => s.estadoSolicitud === EstadoSolicitud.ACEPTADO
              ).length;

              rutasConSolicitudes[index] = {
                ...ruta,
                solicitudesPendientes: pendientes,
                pasajerosAceptados: aceptados,
              };

              respuestasRecibidas++;
              if (respuestasRecibidas === rutas.length) {
                this._rutas.set(rutasConSolicitudes);
                this.loading.set(false);
              }
            },
            error: (err) => {
              console.error(
                `Error cargando solicitudes para ruta ${ruta.idRuta}`,
                err
              );

              rutasConSolicitudes[index] = {
                ...ruta,
                solicitudesPendientes: 0,
                pasajerosAceptados: 0,
              };

              respuestasRecibidas++;
              if (respuestasRecibidas === rutas.length) {
                this._rutas.set(rutasConSolicitudes);
                this.loading.set(false);
              }

              this.toast.show(
                'No se pudieron cargar algunas solicitudes de viaje.',
                'error'
              );
            },
          });
        });
      },
      error: (err) => {
        console.error('Error cargando rutas activas del conductor', err);
        this.error.set('No se pudieron cargar tus rutas');
        this.toast.show(
          err?.error?.message ?? 'No se pudieron cargar tus rutas.',
          'error'
        );
        this.loading.set(false);
      },
    });
  }

  gestionarViaje(ruta: RutaConSolicitudes) {
    this.router.navigate(['/rutas', ruta.idRuta, 'solicitudes']);
  }

  // ----------------------------------------------------------------
  // Acciones sobre el estado del viaje desde "Viaje por iniciar"
  // ----------------------------------------------------------------

  iniciarViaje(ruta: RutaConSolicitudes): void {
    this.rutaService
      .cambiarEstadoRuta(ruta.idRuta, EstadoRuta.EN_PROGRESO)
      .subscribe({
        next: (updated) => {
          this._rutas.update((actual) =>
            actual.map((r) =>
              r.idRuta === updated.idRuta ? { ...r, ...updated } : r
            )
          );
          this.toast.show('Viaje iniciado.', 'success');
        },
        error: (err) => {
          console.error('Error al iniciar viaje', err);
          this.toast.show(
            err?.error?.message ?? 'No se pudo iniciar el viaje.',
            'error'
          );
        },
      });
  }

  finalizarViaje(ruta: RutaConSolicitudes): void {
    this.rutaService
      .cambiarEstadoRuta(ruta.idRuta, EstadoRuta.FINALIZADO)
      .subscribe({
        next: (updated) => {
          this._rutas.update((actual) =>
            actual.map((r) =>
              r.idRuta === updated.idRuta ? { ...r, ...updated } : r
            )
          );
          this.toast.show('Viaje finalizado.', 'success');
        },
        error: (err) => {
          console.error('Error al finalizar viaje', err);
          this.toast.show(
            err?.error?.message ?? 'No se pudo finalizar el viaje.',
            'error'
          );
        },
      });
  }
}
