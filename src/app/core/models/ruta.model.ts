export enum EstadoRuta {
    PROGRAMADO = "PROGRAMADO",
    EN_PROGRESO = "EN_PROGRESO",
    CONFIRMADO =  "CONFIRMADO",
    CANCELADO = "CANCELADO"
}

export interface RutaRequest{
    origen: string,
    destino:string,
    fechaSalida:string,
    horaSalida:string,
    tarifa:string,
    asientosDisponibles:string,
    estadoRuta:EstadoRuta,
    conductorId:string
}

export interface RutaResponse{
    idRuta:string,
    origen: string,
    destino:string,
    fechaSalida:string,
    horaSalida:string,
    tarifa:string,
    asientosDisponibles:string,
    estadoRuta:EstadoRuta,
    idConductor:string
}