// ===== ENUMS =====
export enum RoleType {
  ROLE_CONDUCTOR = 'CONDUCTOR',
  ROLE_PASAJERO = 'PASAJERO',
  ROLE_ADMIN = 'ADMIN'
}

// ===== REQUESTS =====
export interface LoginRequest {
  email: string;
  password: string;
}

export interface ConductorRequest {
  nombre:string,
  apellido:string,
  email:string,
  password:string,
  dni:string,
  edad:number,
  descripcionConductor:string
  userId:number,
  vehiculoId:number,
}

export interface PasajeroRequest {
  nombre:string,
  apellido:string,
  email:string,
  password:string,
  dni:string,
  edad:number,
  descripcionPasajero:string
}

export interface RegisterRequest {
  name:string,
  email:string,
  password:string,
}


// ===== RESPONSES =====
export interface AuthResponse {
  token: string;
  type: string;
  email: string;
  name: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: RoleType;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConductorResponse{
  idConductor:number,
  nombre:string,
  apellido:string,
  edad:number,
  descripcionConductor:string
}

export interface PasajeroResponse{
  idPasajero:number,
  nombre:string,
  apellido:string,
  dni:string,
  edad:number,
  descripcionPasajero:string
}
