// src/app/core/services/auth.service.ts

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

import { 
  LoginRequest, 
  RegisterRequest,
  AuthResponse,      // registro simple
  AuthResponseDTO,   // login + registro conductor/pasajero
  CurrentUser        // usuario en storage
} from '../models/usuario.model';

import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  private _currentUser = signal<CurrentUser | null>(null);
  private _isAuthenticated = signal<boolean>(false);
  private _token = signal<string | null>(null);

  currentUser = this._currentUser.asReadonly();
  isAuthenticated = this._isAuthenticated.asReadonly();
  token = this._token.asReadonly();

  constructor() {
    this.loadAuthData();
  }

  // ======================
  //       LOGIN REAL
  // ======================
  loginWithCredentials(credentials: LoginRequest): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.apiUrl}/login`, credentials).pipe(
      tap((resp) => this.saveLoginData(resp))
    );
  }

  login(email: string, password: string): Observable<AuthResponseDTO> {
    return this.loginWithCredentials({ email, password });
  }

  // ======================
  //      REGISTRO SIMPLE 
  // ======================
  registerWithData(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((resp) => this.saveRegisterData(resp))
    );
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.registerWithData({ name, email, password });
  }

  // ======================
  //     LOGOUT
  // ======================
  logout(): void {
    this.storage.removeItem('token');
    this.storage.removeItem('user');

    this._token.set(null);
    this._currentUser.set(null);
    this._isAuthenticated.set(false);

    this.router.navigate(['/auth/login']);
  }

  // ======================
  //  SAVE LOGIN DATA (LOGIN + REGISTRO CONDUCTOR/PASAJERO)
  // ======================
  private saveLoginData(resp: AuthResponseDTO): void {
    console.log('Login/Registro OK:', resp);

    this.storage.setItem('token', resp.token);
    this._token.set(resp.token);

    const user: CurrentUser = {
      idUsuario: resp.idUsuario,
      idRol: resp.idRol,
      nombre: resp.nombre,
      apellido: resp.apellido,
      rol: resp.rol,
      idConductor: resp.idConductor ?? null,
      idPasajero: resp.idPasajero ?? null,
    };

    this.storage.setItem('user', user);
    this._currentUser.set(user);
    this._isAuthenticated.set(true);
  }

  // ======================
  //  SAVE REGISTER SIMPLE
  // ======================
  private saveRegisterData(resp: AuthResponse): void {
    this.storage.setItem('token', resp.token);
    this._token.set(resp.token);

    // NO guardes UserResponse → ya no existe, guarda como CurrentUser mínimo.
    const user: CurrentUser = {
      idUsuario: resp.idUsuario ?? 0,
      idRol: resp.idRol ?? 0,
      nombre: resp.nombre,
      apellido: resp.apellido,
      rol: resp.rol,
      idConductor: resp.idConductor ?? null,
      idPasajero: resp.idPasajero ?? null,
    };

    this.storage.setItem('user', user);
    this._currentUser.set(user);
    this._isAuthenticated.set(true);
  }

  // ======================
  //     LOAD STORAGE
  // ======================
  private loadAuthData(): void {
    const token = this.storage.getItem<string>('token');
    const user = this.storage.getItem<CurrentUser>('user');

    if (token && user) {
      this._token.set(token);
      this._currentUser.set(user);
      this._isAuthenticated.set(true);
    }
  }

  // ======================
  //  GETTERS
  // ======================
  getToken(): string | null {
    return this._token();
  }

  getUserId(): number | null {
    return this._currentUser()?.idUsuario ?? null;
  }

  getConductorId(): number | null {
    return this._currentUser()?.idConductor ?? null;
  }

  getPasajeroId(): number | null {
    return this._currentUser()?.idPasajero ?? null;
  }

  isAdmin(): boolean {
    const user = this._currentUser();
    if (!user) return false;
    return user.rol === 'ADMIN';
  }

  getUserRole(): 'ADMIN' | 'CONDUCTOR' | 'PASAJERO' | null {
    return this._currentUser()?.rol ?? null;
  }

  getUserIdRol(): number | null {
    return this._currentUser()?.idRol ?? null;
  }

 

  // ======================
  //     REGISTRO CONDUCTOR
  // ======================
  registerDriver(body: any): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.apiUrl}/registro/conductor`, body).pipe(
      tap(resp => this.saveLoginData(resp))
    );
  }

  // ======================
  //     REGISTRO PASAJERO
  // ======================
  registerPassenger(body: any): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.apiUrl}/registro/pasajero`, body).pipe(
      tap(resp => this.saveLoginData(resp))
    );
  }
}
