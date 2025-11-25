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

export interface RegisterRequest {
  name:string,
  email:string,
  password:string,
}


// ===== RESPONSES =====
export interface AuthResponse {
  token: string;
  nombre: string;
  apellido: string;
  rol: 'ADMIN' | 'CONDUCTOR' | 'PASAJERO';
  idRol: number;
  idUsuario: number;
  idConductor?: number | null;
  idPasajero?: number | null;
}


/////////////NUEVO/////////////////
// ============RESPONSE============
export interface AuthResponseDTO{
  token: string;
  nombre: string;
  apellido: string;
  rol: 'ADMIN'|'CONDUCTOR' | 'PASAJERO';
  idRol: number;
  idUsuario: number;
  idConductor?: number | null;
  idPasajero?: number | null;
}

// ===== USUARIO GUARDADO EN STORAGE =====
export interface CurrentUser {
  idUsuario: number;                                   
  idRol: number;
  nombre: string;
  apellido: string;
  rol: 'ADMIN' | 'CONDUCTOR' | 'PASAJERO';            
  idConductor?: number | null;
  idPasajero?: number | null;
}
