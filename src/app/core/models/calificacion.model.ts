// src/app/core/models/calificacion.model.ts

export interface CalificacionRequest {
  calificacion: number; // 1-5
  comentario: string;
  idPasajero?: number; // ID del pasajero calificado (si aplica)
  idConductor?: number; // ID del conductor calificado (si aplica)
  idSolicitudViaje?: number; // ID del viaje asociado
}

export interface CalificacionResponse {
  idCalificacion: number;
  calificacion: number;
  comentario: string;
  idPasajero?: number;
  idConductor?: number;
  idSolicitudViaje?: number;
  fechaCreacion?: string;
  nombreCalificador?: string; // Nombre de quien hizo la calificación
}
