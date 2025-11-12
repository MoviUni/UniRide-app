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
    rutaId:string,
    pasajeroId:string,
    updatedAt:string
}

export interface SolicitudViajeResponse{
    idSolicitudViaje: string,
    estadoSolicitud: EstadoSolicitud,
    fecha:string,
    hora:string,
    rutaId:string,
    pasajeroId:string,
    updatedAt:string
}

export interface SolicitudViajeRequest{
    estadoSolicitud: EstadoSolicitud,
}

export interface SolicitudViajeResponse{
    estadoSolicitud: EstadoSolicitud,
}

