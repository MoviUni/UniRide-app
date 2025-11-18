// =========================ENUMS=========================
export enum EstadoRuta {
  PROGRAMADO = 'PROGRAMADO',
  EN_PROGRESO = 'EN_PROGRESO',
  CONFIRMADO = 'CONFIRMADO',
  CANCELADO = 'CANCELADO'
}

// =========================REQUEST=========================
export interface RutaRequestDTO {
  origen: string;
  destino: string;
  fechaSalida: string; // ISO date string
  horaSalida: string;  // ISO time string
  tarifa: number;
  asientosDisponibles: number;
  estadoRuta: EstadoRuta; // enum
  conductorId: number;
}

export interface RutaResponse{
    idRuta:number,
    origen: string,
    destino:string,
    fechaSalida:string,
    horaSalida:string,
    tarifa:number,
    asientosDisponibles:number,
    estadoRuta:EstadoRuta,
    idConductor:number
}

export interface RutaCardResponse{
    idRuta:number,
    origen: string,
    destino:string,
    fechaSalida:string,
    horaSalida:string,
    tarifa:number,
    asientosDisponibles:number,
    nombreConductor:string,
    apellidoConductor:number,
}
// =========================RESPONSE=========================

export interface RutaFrecuenteResponseDTO {
  origen: string;
  destino: string;
  fechaSalida: string; // ISO date string
  horaSalida: string;  // ISO time string
  tarifa: number;
  frecuencia: number;
}

export interface RutaResponseDTO {
  idRuta: number;
  origen: string;
  destino: string;
  fechaSalida: string; // ISO date string
  horaSalida: string;  // ISO time string
  tarifa: number;
  asientosDisponibles: number;
  estadoRuta: EstadoRuta; // enum
  idConductor: number;
  capacidadVehiculo: number;
}
