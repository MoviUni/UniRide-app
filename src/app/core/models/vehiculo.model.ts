// src/app/core/models/vehiculo.model.ts

export interface VehiculoRequest {
  placa: string;
  soat: boolean;
  modelo: string;
  marca: string;
  color: string;
  capacidad: number;
}

export interface VehiculoResponse {
  placa: string;
  soat: boolean;
  modelo: string;
  marca: string;
  color: string;
  capacidad: number;
  idVehiculo: number;
  idConductor: number;
}

