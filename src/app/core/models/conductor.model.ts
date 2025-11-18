// src/app/core/models/conductor.model.ts

export interface ConductorRequest {
    nombre: String,
    apellido: String,
    email: String,  //NEW
    password: String, //NEW
    dni: String,
    edad?: number,
    descripcionConductor?: String,
    userId: number

}

export interface ConductorResponse {
  idConductor: number;
  nombre: string;
  apellido: string;
  descripcionConductor?: string;
  edad?: number;
}
