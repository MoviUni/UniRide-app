// src/app/features/historial/pages/historial-pasajero/historial-pasajero.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SolicitudService } from '../../../../core/services/solicitud.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SolicitudCardResponse } from '../../../../core/models/solicitud.model';

@Component({
  selector: 'app-historial-pasajero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './historial-pasajero.html',
  styleUrls: ['./historial-pasajero.css']
})
export class HistorialPasajero implements OnInit {
  private solicitudService = inject(SolicitudService);
  private auth = inject(AuthService);

  historial: SolicitudCardResponse[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    const pasajeroId = this.auth.getPasajeroId();
    if (!pasajeroId) {
      this.error = 'No se encontró el id del pasajero. Inicia sesión de nuevo.';
      return;
    }

    this.loading = true;

    this.solicitudService.getInfo(pasajeroId).subscribe({
      next: (data: SolicitudCardResponse[]) => {
        this.historial = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error cargando historial. Intenta más tarde.';
        this.loading = false;
      }
    });
  }

  formatHora(item: SolicitudCardResponse): string {
    // safe access (TS): devuelve '--' si no hay hora
    // usa horaSalida o hora si existen
    // @ts-ignore - algunos objetos pueden tener distinta shape en runtime
    return (item as any).horaSalida ?? (item as any).hora ?? '--';
  }

  formatPrice(item: SolicitudCardResponse): string {
    // @ts-ignore
    const tarifa = (item as any).tarifa ?? (item as any).precio ?? 0;
    return tarifa ? tarifa.toFixed(2) : '0.00';
  }

  displayDriverName(item: SolicitudCardResponse): string {
    // @ts-ignore
    return (item as any).nombreConductor ?? (item as any).nombre ?? 'Conductor';
  }

  avatarUrl(item: SolicitudCardResponse): string {
    // @ts-ignore
    return (item as any).fotoPerfilUrl ?? 'assets/default-avatar.png';
  }

  verDetalles(item: SolicitudCardResponse) {
    console.log('Ver detalles:', item);
    // aquí puedes navegar a detalle si tienes ruta:
    // this.router.navigate(['/solicitudes/detalle', (item as any).idSolicitudViaje]);
  }
}
