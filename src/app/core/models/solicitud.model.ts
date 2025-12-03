export enum EstadoSolicitud {
    PENDIENTE= "PENDIENTE",
    ACEPTADO= "ACEPTADO",
    RECHAZADO= "RECHAZADO",
    CANCELADO = "CANCELADO",
    CANCELADO_CONDUCTOR = "CANCELADO_CONDUCTOR",
    FINALIZADO = "FINALIZADO"
}

export interface SolicitudViajeRequest{
    estadoSolicitud: EstadoSolicitud,
    fecha:string,
    hora:string,
    pasajeroId:number,
    rutaId:number,
    updatedAt:string
}

export interface SolicitudViajeResponse{
    idSolicitudViaje: number,
    estadoSolicitud: EstadoSolicitud,
    fecha:string,
    hora:string,
    rutaId:number,
    pasajeroId:number,
    updatedAt:string,
    pasajeroNombre: string;
    pasajeroApellido: string;
    pasajeroCarrera: string | null;
    pasajeroDescripcion: string | null;
}

export interface SolicitudCardResponse{
    idSolicitudViaje: number,
    estadoSolicitud: EstadoSolicitud,
    fechaSalida:string,
    horaSalida:string,
    origen:string,
    destino:string,
    tarifa:number,
    asientosDisponibles:number,
    nombreConductor:string,
    apellidoConductor:number,
    vehiculoColor:string,
    vehiculoPlaca:string,
    vehiculoModelo:string,
    idConductor?: number,
    idPasajero?: number
}

export interface SolicitudEstadoRequest{
    estado: EstadoSolicitud
}

export interface SolicitudEstadoResponse{
    estado: EstadoSolicitud
}

