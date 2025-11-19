// src/app/features/rutas/page/rutas-conductor/rutas-conductor.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';

import { RutaService } from '../../../../core/services/ruta.service';
import { RutaResponseDTO, EstadoRuta } from '../../../../core/models/ruta.model';
import {
  SolicitudService
} from '../../../../core/services/solicitud.service';
import {
  EstadoSolicitud,
  SolicitudViajeResponse
} from '../../../../core/models/solicitud.model';

import { AuthService } from '@core/services/auth.service';

type RutaConSolicitudes = RutaResponseDTO & { solicitudesPendientes: number };

@Component({
  selector: 'app-rutas-conductor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rutas-conductor.component.html',
  styleUrls: ['./rutas-conductor.component.css'],
})
export class RutasConductorComponent implements OnInit {

  

  // Por ahora hardcodeado igual que en estadísticas
  //private readonly conductorId = 1;

  loading = signal(true);
  error = signal<string | null>(null);
  private _rutas = signal<RutaConSolicitudes[]>([]);

  rutas = this._rutas.asReadonly();

  constructor(
    private rutaService: RutaService,
    private solicitudService: SolicitudService,
    private router: Router,
    private authService: AuthService
  ) {}

  // Helper fecha+hora → Date
  private toDate(fecha: string, hora: string): Date {
    // formato backend: 'YYYY-MM-DD' y 'HH:mm:ss'
    return new Date(`${fecha}T${hora}`);
  }

  // VIAJE POR INICIAR:
  // - estado CONFIRMADO
  // - salida futura
  // - faltan entre 0 y 30 minutos
  viajePorIniciar = computed(() => {
    const ahora = new Date();

    const candidato = this.rutas().find((r) => {
      if (r.estadoRuta !== EstadoRuta.CONFIRMADO) return false;

      const salida = this.toDate(
        r.fechaSalida as unknown as string,
        r.horaSalida as unknown as string
      );
      const diffMin = (salida.getTime() - ahora.getTime()) / 60000;

      return diffMin >= 0 && diffMin <= 30;
    });

    return candidato ?? null;
  });

  // PRÓXIMOS VIAJES:
  // - estados PROGRAMADO o CONFIRMADO
  // - salida futura
  // - excluimos el viajePorIniciar
  proximosViajes = computed(() => {
    const ahora = new Date();

    return this.rutas().filter((r) => {
      const salida = this.toDate(
        r.fechaSalida as unknown as string,
        r.horaSalida as unknown as string
      );
      const diffMin = (salida.getTime() - ahora.getTime()) / 60000;

      if (diffMin < 0) return false; // ya pasó

      if (
        r.estadoRuta !== EstadoRuta.PROGRAMADO &&
        r.estadoRuta !== EstadoRuta.CONFIRMADO
      ) {
        return false;
      }

      if (r.estadoRuta === EstadoRuta.CONFIRMADO && diffMin <= 30) {
        // será viajePorIniciar
        return false;
      }

      return true;
    });
  });

  ngOnInit(): void {
    this.cargarRutas();
  }

  // ----------------------------------------------------------------
  // Carga rutas activas y, para cada ruta, consulta sus solicitudes
  // y cuenta solo las PENDIENTE.
  // ----------------------------------------------------------------
  private cargarRutas(): void {
    this.loading.set(true);
    this.error.set(null);

    const conductorId = this.authService.getUserIdRol(); // ✅ obtenemos el id
    if (!conductorId) {
    console.error('Usuario no autenticado');
    this.error.set('No se pudo determinar tu usuario');
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

              rutasConSolicitudes[index] = {
                ...ruta,
                solicitudesPendientes: pendientes,
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

              // aunque falle, rellenamos con 0 para no romper la UI
              rutasConSolicitudes[index] = {
                ...ruta,
                solicitudesPendientes: 0,
              };

              respuestasRecibidas++;
              if (respuestasRecibidas === rutas.length) {
                this._rutas.set(rutasConSolicitudes);
                this.loading.set(false);
              }
            },
          });
        });
      },
      error: (err) => {
        console.error('Error cargando rutas activas del conductor', err);
        this.error.set('No se pudieron cargar tus rutas');
        this.loading.set(false);
      },
    });
  }

  gestionarViaje(ruta: RutaConSolicitudes) {
    this.router.navigate(['/rutas', ruta.idRuta, 'solicitudes']);
  }
}
