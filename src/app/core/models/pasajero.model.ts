// src/app/core/models/pasajero.model.ts

export interface PasajeroRequest {
  nombre: string;
  apellido: string;
  dni: string;
  edad?: number;
  codigoUni: string;
  carrera: string;
}

export interface PasajeroResponse {
  idPasajero: number;
  nombre: string;
  apellido: string;
  dni: string;
  edad?: number;
  codigoUni: string;
  carrera: string;
}
