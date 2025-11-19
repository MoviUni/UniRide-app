import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,  // ESTE SE USA PARA REGISTRO (lo de tus compañeros)
  UserResponse, 
  RoleType,
  AuthResponseDTO, // NUEVO: lo que devuelve el login REAL
  CurrentUser      // NUEVO: lo que guardamos en el storage del login
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

  private _currentUser = signal<CurrentUser | UserResponse | null>(null);
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
  //      REGISTRO
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
  //  SAVE LOGIN DATA
  // ======================
  private saveLoginData(resp: AuthResponseDTO): void {

    console.log('RESPUESTA LOGIN:', resp); 
    
    this.storage.setItem('token', resp.token);
    this._token.set(resp.token);

    const user: CurrentUser = {
      idRol: resp.idRol,
      nombre: resp.nombre,
      apellido: resp.apellido,
      rol: resp.rol
    };

    this.storage.setItem('user', user);
    this._currentUser.set(user);
    this._isAuthenticated.set(true);
  }

  // ======================
  //  SAVE REGISTER DATA
  // ======================
  private saveRegisterData(resp: AuthResponse): void {
    this.storage.setItem('token', resp.token);
    this._token.set(resp.token);

    const user: UserResponse = {
      id: '',
      email: '',
      name: `${resp.nombre} ${resp.apellido}`,
      role: resp.rol as RoleType,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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
    const user = this.storage.getItem<CurrentUser | UserResponse>('user');

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

  isAdmin(): boolean {
    const user = this._currentUser();
    if (!user) return false;
    return (user as any).role === RoleType.ROLE_ADMIN || (user as any).rol === 'ADMIN';
  }

  getUserIdRol(): number | null {
    const user = this._currentUser() as CurrentUser | null;
    return user?.idRol ?? null;
  }


    // 🔹 Registro de conductor (usa el endpoint /auth/registro/conductor)
  registerDriver(body: any): Observable<AuthResponseDTO> {
  return this.http.post<AuthResponseDTO>(`${this.apiUrl}/registro/conductor`, body).pipe(
    tap(resp => {
      this.saveLoginData(resp); // guarda token y usuario
    })
  );
}

  // 🔹 Registro de pasajero
 registerPassenger(body: any): Observable<AuthResponseDTO> {
  return this.http.post<AuthResponseDTO>(`${this.apiUrl}/registro/pasajero`, body).pipe(
    tap(resp => {
      this.saveLoginData(resp); // guarda token y usuario
    })
  );
 }
}
