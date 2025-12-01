// src/app/core/models/calificacion.model.ts

export interface CalificacionRequest {
  puntaje: number; // 1-5 (nombre que espera el backend)
  comentario: string;
  pasajero?: number; // ID del pasajero calificado (si aplica)
  conductor?: number; // ID del conductor calificado (si aplica)
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
