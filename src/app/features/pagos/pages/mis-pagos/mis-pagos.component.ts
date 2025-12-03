// src/app/features/pagos/pages/mis-pagos/mis-pagos.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PagoService } from '@core/services/pago.service';
import { AuthService } from '@core/services/auth.service';
import { PagoResponse, EstadoPago, MedioPago } from '@core/models/pago.model';

@Component({
  selector: 'app-mis-pagos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-pagos.component.html',
  styleUrls: ['./mis-pagos.component.css']
})
export class MisPagosComponent implements OnInit {
  private pagoService = inject(PagoService);
  private authService = inject(AuthService);

  // Signals
  pagos = signal<PagoResponse[]>([]);
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadPagos();
  }

  loadPagos(): void {
    const pasajeroId = this.authService.getPasajeroId();
    
    if (!pasajeroId) {
      this.errorMessage.set('Usuario no autenticado');
      return;
    }

    this.loading.set(true);
    
    this.pagoService.getByPasajero(pasajeroId).subscribe({
      next: (data) => {
        console.log('💳 Pagos cargados:', data);
        // Ordenar por fecha más reciente
        const pagosOrdenados = data.sort((a, b) => {
          const fechaA = new Date(`${a.fecha} ${a.hora}`);
          const fechaB = new Date(`${b.fecha} ${b.hora}`);
          return fechaB.getTime() - fechaA.getTime();
        });
        this.pagos.set(pagosOrdenados);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando pagos:', err);
        this.errorMessage.set('Error al cargar los pagos');
        this.loading.set(false);
      }
    });
  }

  getEstadoColor(estado: EstadoPago): string {
    const colores: Record<EstadoPago, string> = {
      [EstadoPago.PENDIENTE]: '#FFA500',
      [EstadoPago.COMPLETADO]: '#4CAF50',
      [EstadoPago.FALLIDO]: '#F44336',
      [EstadoPago.REEMBOLSADO]: '#9E9E9E'
    };
    return colores[estado] || '#9E9E9E';
  }

  getEstadoLabel(estado: EstadoPago): string {
    const labels: Record<EstadoPago, string> = {
      [EstadoPago.PENDIENTE]: 'Pendiente',
      [EstadoPago.COMPLETADO]: 'Completado',
      [EstadoPago.FALLIDO]: 'Fallido',
      [EstadoPago.REEMBOLSADO]: 'Reembolsado'
    };
    return labels[estado];
  }

  getMedioPagoLabel(medio: MedioPago): string {
    const labels: Record<MedioPago, string> = {
      [MedioPago.TARJETA]: 'Tarjeta',
      [MedioPago.YAPE]: 'Yape',
      [MedioPago.PLIN]: 'Plin',
      [MedioPago.EFECTIVO]: 'Efectivo',
      [MedioPago.TRANSFERENCIA]: 'Transferencia'
    };
    return labels[medio];
  }

  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  }
}
