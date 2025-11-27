// src/app/core/models/pasajero.model.ts

export interface PasajeroRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  dni: string;
  edad?: number;
  codigoUni: string;
}

export interface PasajeroResponse {
  idPasajero: number;
  nombre: string;
  apellido: string;
  dni: string;
  edad?: number;
  codigoUni: string;
}
