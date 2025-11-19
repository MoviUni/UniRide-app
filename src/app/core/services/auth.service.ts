import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse, UserResponse, RoleType } from '../models/usuario.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  // Signals para ESTADO COMPARTIDO
  private _currentUser = signal<UserResponse | null>(null);
  private _isAuthenticated = signal<boolean>(false);
  private _token = signal<string | null>(null);

  currentUser = this._currentUser.asReadonly();
  isAuthenticated = this._isAuthenticated.asReadonly();
  token = this._token.asReadonly();

  constructor() {
    this.loadAuthData();
  }

  // POST - Login (con objeto)
  loginWithCredentials(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.saveAuthData(response);
      })
    );
  }

  // POST - Login (con parámetros separados)
  login(email: string, password: string): Observable<AuthResponse> {
    return this.loginWithCredentials({ email, password });
  }

  // POST - Register (con objeto)
  registerWithData(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => {
        this.saveAuthData(response);
      })
    );
  }

  // POST - Register (con parámetros separados)
  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.registerWithData({ name, email, password });
  }

  // Logout
  logout(): void {
    this.storage.removeItem('token');
    this.storage.removeItem('user');
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    this._token.set(null);
    this.router.navigate(['/auth/login']); 
  }

  // Helpers privados
// Helpers privados
private saveAuthData(response: AuthResponse): void {
  this.storage.setItem('token', response.token);
  this._token.set(response.token);

  const user: UserResponse = {
    id: '', // si luego el backend te devuelve id, lo usas
    email: '', // <-- de momento lo dejamos vacío
    name: `${response.nombre} ${response.apellido}`,
    role: response.rol as RoleType,   // usamos el rol real
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  this.storage.setItem('user', user);
  this._currentUser.set(user);
  this._isAuthenticated.set(true);
}



  private loadAuthData(): void {
    const token = this.storage.getItem<string>('token');
    const user = this.storage.getItem<UserResponse>('user');

    if (token && user) {
      this._token.set(token);
      this._currentUser.set(user);
      this._isAuthenticated.set(true);
    }
  }

  // Getters para guards
  isAdmin(): boolean {
    return this._currentUser()?.role === RoleType.ROLE_ADMIN;
  }

  getToken(): string | null {
    return this._token();
  }
  
  // 👇 NUEVO: devolver el id del usuario como number
  getUserId(): number | null {
    const user = this._currentUser(); // lo que guardaste en saveAuthData()

    if (!user || user.id == null || user.id === '') {
      return null;
    }

    // En tu UserResponse el id es string, lo convertimos a número
    const idNum = Number(user.id);
    return Number.isNaN(idNum) ? null : idNum;
  }
   // 🔹 Registro de conductor (usa el endpoint /auth/registro/conductor)
  registerDriver(body: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registro/conductor`, body);
  }
    // 🔹 Registro de pasajero
  registerPassenger(body: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registro/pasajero`, body);
  }

}
