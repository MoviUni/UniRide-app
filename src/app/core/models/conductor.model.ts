// src/app/core/models/conductor.model.ts

export interface ConductorRequest {
  nombre: string;
  apellido: string;
  dni: string;
  edad?: number;
  codigoUni: string;
  carrera: string;
  distrito?: string;
  fotoPerfil?: string;
}

export interface ConductorResponse {
  idConductor: number;
  nombre: string;
  apellido: string;
  edad?: number;
  codigoUni: string;
  carrera: string;
  distrito?: string;
  fotoPerfil?: string;
  calificacionPromedio?: number;
  totalCalificaciones?: number;
}

export interface ComentarioConductorResponse {
  idComentario: number;
  nombreUsuario: string;
  calificacion: number;
  comentario: string;
  fecha: string;
}

export interface SolicitudViajeCardResponse {
  idRuta: number;
  origen: string;
  destino: string;
  fechaSalida: string;
  horaSalida: string;
  capacidad: number;
  tarifa: number;
}

