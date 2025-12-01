// src/app/core/models/pasajero.model.ts

export interface PasajeroRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  dni: string;
  edad?: number;
  codigoUni: string;
  distrito?: string;
  carrera?: string;
  fotoPerfil?: string;
}

export interface PasajeroResponse {
  idPasajero: number;
  nombre: string;
  apellido: string;
  dni: string;
  edad?: number;
  codigoUni: string;
  distrito?: string;
  carrera?: string;
  fotoPerfil?: string;
  calificacionPromedio?: number;
  totalCalificaciones?: number;
}

export interface ComentarioResponse {
  idComentario: number;
  nombreUsuario: string;
  calificacion: number;
  comentario: string;
  fecha: string;
}
