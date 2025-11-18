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
    tarifa:number,
    asientosDisponibles:number,
    estadoRuta:EstadoRuta,
    conductorId:number
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