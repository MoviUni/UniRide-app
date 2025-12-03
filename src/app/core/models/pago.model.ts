// src/app/core/models/pago.model.ts

export enum EstadoPago {
  PENDIENTE = 'PENDIENTE',
  COMPLETADO = 'COMPLETADO',
  FALLIDO = 'FALLIDO',
  REEMBOLSADO = 'REEMBOLSADO'
}

export enum MedioPago {
  TARJETA = 'TARJETA',
  YAPE = 'YAPE',
  PLIN = 'PLIN',
  EFECTIVO = 'EFECTIVO',
  TRANSFERENCIA = 'TRANSFERENCIA'
}

export interface PagoRequest {
  monto: number;
  comision: number;
  medioPago: MedioPago;
  estadoPago: EstadoPago;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:mm:ss
  solicitudViajeId: number;
}

export interface PagoResponse {
  idPago: number;
  monto: number;
  comision: number;
  medioPago: MedioPago;
  estadoPago: EstadoPago;
  fecha: string;
  hora: string;
  solicitudViajeId: number;
}

export interface PagoCardResponse extends PagoResponse {
  // Información adicional de la solicitud para mostrar en tarjetas
  origen?: string;
  destino?: string;
  nombreConductor?: string;
  apellidoConductor?: string;
}
