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
    rutaId:number,
    pasajeroId:number,
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

export interface SolicitudEstadoRequest{
    estado: EstadoSolicitud
}

export interface SolicitudEstadoResponse{
    estado: EstadoSolicitud
}

