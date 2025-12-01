// src/app/core/models/vehiculo.model.ts

export interface VehiculoRequest {
  placa: string;
  soat: boolean;
  modelo: string;
  marca: string;
  color: string;
  capacidad: number;
  aireAcondicionado?: boolean;
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
  aireAcondicionado?: boolean;
}

