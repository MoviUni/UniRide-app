import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SolicitudService } from '../../../../core/services/solicitud.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SolicitudCardResponse } from '../../../../core/models/solicitud.model';

@Component({
  selector: 'app-historial-conductor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './historial-conductor.html',
  styleUrls: ['./historial-conductor.css']
})
export class HistorialConductor implements OnInit {

  private solicitudService = inject(SolicitudService);
  private auth = inject(AuthService);

  historial: SolicitudCardResponse[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    const conductorId = this.auth.getConductorId();
    if (!conductorId) {
      this.error = 'No se encontró el id del conductor. Inicia sesión nuevamente.';
      return;
    }

    this.loading = true;

    this.solicitudService.getInfoConductor(conductorId).subscribe({
      next: (data: SolicitudCardResponse[]) => {
        this.historial = data || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Error cargando historial. Intenta más tarde.';
        this.loading = false;
      }
    });
  }

  formatHora(item: SolicitudCardResponse): string {
    return (item as any).horaSalida ?? (item as any).hora ?? '--';
  }

  formatPrice(item: SolicitudCardResponse): string {
    const tarifa = (item as any).tarifa ?? 0;
    return tarifa ? tarifa.toFixed(2) : '0.00';
  }

  avatarUrl(item: SolicitudCardResponse): string {
    return (item as any).fotoPerfilUrl ?? 'assets/default-avatar.png';
  }

  displayPassenger(item: SolicitudCardResponse): string {
    // Para el conductor mostramos el pasajero
    const nombre = (item as any).pasajeroNombre ?? '';
    const apellido = (item as any).pasajeroApellido ?? '';
    return nombre || apellido ? `${nombre} ${apellido}` : 'Pasajero';
  }

  verDetalles(item: SolicitudCardResponse) {
    console.log('Ver detalles conductor:', item);
  }
}
