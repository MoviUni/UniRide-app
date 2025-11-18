// src/app/core/models/vehiculo.model.ts

export interface VehiculoRequest {
  placa: string;
  soat: boolean;
  modelo: string;
  marca: string;
  color: string;
  capacidadVehiculo: number;
  descripcionVehiculo: string;
}

export interface VehiculoResponse {
  placa: string;
  soat: boolean;
  modelo: string;
  marca: string;
  color: string;
  capacidad: number;
  descripcionVehiculo: string;
  idVehiculo: number;
  idConductor: number;
}

