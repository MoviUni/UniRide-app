export enum EstadoSolicitud {
    PENDIENTE= "PENDIENTE",
    ACEPTADO= "ACEPTADO",
    RECHAZADO= "RECHAZADO",
    CANCELADO = "CANCELADO"
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
    updatedAt:string
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
}

export interface SolicitudEstadoRequest{
    estadoSolicitud: EstadoSolicitud
}

export interface SolicitudEstadoResponse{
    estadoSolicitud: EstadoSolicitud
}

