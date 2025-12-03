// src/app/features/pagos/pages/registrar-pago/registrar-pago.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { PagoService } from '@core/services/pago.service';
import { AuthService } from '@core/services/auth.service';
import { SolicitudService } from '@core/services/solicitud.service';
import { PagoRequest, MedioPago, EstadoPago } from '@core/models/pago.model';
import { SolicitudCardResponse } from '@core/models/solicitud.model';

@Component({
  selector: 'app-registrar-pago',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registrar-pago.component.html',
  styleUrls: ['./registrar-pago.component.css']
})
export class RegistrarPagoComponent implements OnInit {
  private pagoService = inject(PagoService);
  private authService = inject(AuthService);
  private solicitudService = inject(SolicitudService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signals
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  solicitudId = signal<number | null>(null);
  solicitud = signal<SolicitudCardResponse | null>(null);

  // Formulario
  pagoForm: FormGroup;

  // Enums para el template
  mediosPago = Object.values(MedioPago);
  estadosPago = Object.values(EstadoPago);

  constructor() {
    this.pagoForm = this.fb.group({
      monto: ['', [Validators.required, Validators.min(0.01)]],
      comision: [0, [Validators.required, Validators.min(0)]],
      medioPago: [MedioPago.YAPE, [Validators.required]],
      estadoPago: [EstadoPago.PENDIENTE, [Validators.required]],
      fecha: [new Date().toISOString().split('T')[0], [Validators.required]],
      hora: [new Date().toTimeString().split(' ')[0], [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Obtener ID de solicitud desde la ruta
    this.route.queryParams.subscribe(params => {
      const idSolicitud = params['solicitudId'];
      if (idSolicitud) {
        this.solicitudId.set(Number(idSolicitud));
        this.loadSolicitudInfo(Number(idSolicitud));
      }
    });
  }

  loadSolicitudInfo(idSolicitud: number): void {
    const pasajeroId = this.authService.getPasajeroId();
    if (!pasajeroId) return;

    this.solicitudService.getInfo(pasajeroId).subscribe({
      next: (solicitudes) => {
        const solicitudEncontrada = solicitudes.find(s => s.idSolicitudViaje === idSolicitud);
        if (solicitudEncontrada) {
          this.solicitud.set(solicitudEncontrada);
          // Pre-llenar el monto con la tarifa de la ruta
          this.pagoForm.patchValue({
            monto: solicitudEncontrada.tarifa
          });
        }
      },
      error: (err) => {
        console.error('❌ Error cargando información de solicitud:', err);
      }
    });
  }

  calcularComision(): void {
    const monto = this.pagoForm.get('monto')?.value;
    if (monto && monto > 0) {
      // Calcular comisión del 10%
      const comision = monto * 0.10;
      this.pagoForm.patchValue({ comision });
    }
  }

  registrarPago(): void {
    if (this.pagoForm.invalid) {
      this.errorMessage.set('Por favor completa todos los campos correctamente');
      return;
    }

    if (!this.solicitudId()) {
      this.errorMessage.set('No se encontró ID de solicitud');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const formData = this.pagoForm.value;

    const pagoRequest: PagoRequest = {
      monto: Number(formData.monto),
      comision: Number(formData.comision),
      medioPago: formData.medioPago,
      estadoPago: formData.estadoPago,
      fecha: formData.fecha,
      hora: formData.hora,
      solicitudViajeId: this.solicitudId()!
    };

    console.log('📤 Registrando pago:', pagoRequest);

    this.pagoService.create(pagoRequest).subscribe({
      next: (response) => {
        console.log('✅ Pago registrado exitosamente:', response);
        this.loading.set(false);
        this.successMessage.set('Pago registrado exitosamente');

        // Redirigir después de 2 segundos
        setTimeout(() => {
          const tipoUsuario = this.authService.getUserRole();
          if (tipoUsuario === 'PASAJERO') {
            this.router.navigate(['/main/pasajero/solicitudes']);
          } else {
            this.router.navigate(['/main/pasajero']);
          }
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Error al registrar pago:', error);
        this.loading.set(false);
        this.errorMessage.set(
          error.error?.message || 'Error al registrar el pago. Intenta nuevamente.'
        );
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/main/pasajero/solicitudes']);
  }

  getMedioPagoLabel(medio: MedioPago): string {
    const labels: Record<MedioPago, string> = {
      [MedioPago.TARJETA]: 'Tarjeta de Crédito/Débito',
      [MedioPago.YAPE]: 'Yape',
      [MedioPago.PLIN]: 'Plin',
      [MedioPago.EFECTIVO]: 'Efectivo',
      [MedioPago.TRANSFERENCIA]: 'Transferencia Bancaria'
    };
    return labels[medio];
  }

  getEstadoPagoLabel(estado: EstadoPago): string {
    const labels: Record<EstadoPago, string> = {
      [EstadoPago.PENDIENTE]: 'Pendiente',
      [EstadoPago.COMPLETADO]: 'Completado',
      [EstadoPago.FALLIDO]: 'Fallido',
      [EstadoPago.REEMBOLSADO]: 'Reembolsado'
    };
    return labels[estado];
  }
}
