// src/app/core/services/solicitud.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
<<<<<<< Updated upstream
import { Observable } from 'rxjs';

import {
  EstadoSolicitud,
  SolicitudViajeRequest,
  SolicitudViajeResponse
} from '../models/solicitud.model';
import { environment } from '../../../environments/environment';
import { SolicitudCardResponse, SolicitudEstadoRequest, SolicitudEstadoResponse, SolicitudViajeRequest, SolicitudViajeResponse } from '../models/solicitud.model';

=======
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  SolicitudCardResponse,
  EstadoSolicitud,
  SolicitudEstadoRequest,
  SolicitudViajeRequest,
  SolicitudViajeResponse
} from '../models/solicitud.model';
import { AuthService } from './auth.service';

>>>>>>> Stashed changes
@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private apiUrl = `${environment.apiUrl}/solicitudes`;
<<<<<<< Updated upstream

  //token hardcodeado para pruebas
  private token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYXJpYW5hLmc1bWV6QGV4YW1wbGUuY29tIiwicm9sZSI6IlJPTEVfQ09ORFVDVE9SIiwiZXhwIjoxNzY1NTYwNzc5fQ.u23huAEkcj49xEAgPhtArJtlDxbB_vxRB-77Ba5mx9vsfc5DogP5JOvxu7PtOdtiZeFm8ZirwVpmXZqmDxZWJw';
=======
>>>>>>> Stashed changes

  private getHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    };
  }

  // -----------------------------
  //  HISTORIAL PASAJERO
  // -----------------------------
  private _info = signal<SolicitudCardResponse[]>([]);
  info = this._info.asReadonly();

  getInfo(pasajeroId: number): Observable<SolicitudCardResponse[]> {
    return this.http
      .get<SolicitudCardResponse[]>(`${this.apiUrl}/info/0?id=${pasajeroId}`, this.getHeaders())
      .pipe(tap(data => this._info.set(data)));
  }

  // -----------------------------
  //  HISTORIAL CONDUCTOR
  // -----------------------------
  getInfoConductor(conductorId: number): Observable<SolicitudCardResponse[]> {
    return this.http
      .get<SolicitudCardResponse[]>(`${this.apiUrl}/info/1?id=${conductorId}`, this.getHeaders())
      .pipe(tap(data => this._info.set(data)));
  }

  // -----------------------------
  //  ESTADOS POR PASAJERO
  // -----------------------------
  private _estados = signal<SolicitudViajeResponse[]>([]);
  estados = this._estados.asReadonly();

  getByPasajero(pasajeroId: number): Observable<SolicitudViajeResponse[]> {
    return this.http
      .get<SolicitudViajeResponse[]>(`${this.apiUrl}/usuario/0?id=${pasajeroId}`, this.getHeaders())
      .pipe(tap(data => this._estados.set(data)));
  }

  // -----------------------------
  // CRUD Y OTROS
  // -----------------------------
  private _items = signal<SolicitudViajeResponse[]>([]);
  items = this._items.asReadonly();

  getAll(): Observable<SolicitudViajeResponse[]> {
    return this.http
      .get<SolicitudViajeResponse[]>(this.apiUrl, this.getHeaders())
      .pipe(tap(data => this._items.set(data)));
  }

<<<<<<< Updated upstream

  private _estados = signal<SolicitudViajeResponse[]>([]);
  estados = this._estados.asReadonly();
  getByPasajero(pasajeroId: number): Observable<SolicitudViajeResponse[]> {
    return this.http.get<SolicitudViajeResponse[]>(`${this.apiUrl}/usuario/id?id=${pasajeroId}`, this.getHeaders()).pipe(
      tap(data => this._estados.set(data))
    );
  }

  private _info = signal<SolicitudCardResponse[]>([]);
  info = this._info.asReadonly();
  // GET - Obtener todos
  getInfo(): Observable<SolicitudCardResponse[]> {
    return this.http.get<SolicitudCardResponse[]>(`${this.apiUrl}/info`, this.getHeaders()).pipe(
      tap(data => this._info.set(data))
    );
  }

  // POST - Crear
=======
>>>>>>> Stashed changes
  create(data: SolicitudViajeRequest): Observable<SolicitudViajeResponse> {
    return this.http
      .post<SolicitudViajeResponse>(this.apiUrl, data, this.getHeaders())
      .pipe(tap(newItem => this._items.update(curr => [...curr, newItem])));
  }

  cancelSolicitud(idSolicitud: number) {
    return this.http
      .patch<SolicitudViajeResponse>(`${this.apiUrl}/${idSolicitud}/cancelar`, null, this.getHeaders())
      .pipe(tap(updated => this._items.update(curr => [...curr, updated])));
  }

  updateSolicitud(data: SolicitudEstadoRequest, idSolicitud: number) {
    return this.http.patch<SolicitudViajeResponse>(
      `${this.apiUrl}/${idSolicitud}/estado`,
      data,
      this.getHeaders()
    );
  }

  getSolicitudesPorRuta(idRuta: number): Observable<SolicitudViajeResponse[]> {
    return this.http.get<SolicitudViajeResponse[]>(
      `${this.apiUrl}/ruta/${idRuta}`,
      this.getHeaders()
    );
  }

  cambiarEstadoSolicitud(idSolicitud: number, nuevoEstado: EstadoSolicitud) {
    return this.http.patch<SolicitudViajeResponse>(
      `${this.apiUrl}/${idSolicitud}/estado`,
      { estadoSolicitud: nuevoEstado },
      this.getHeaders()
    );
  }

  getSolicitudById(idSolicitud: number) {
    return this.http.get<SolicitudViajeResponse>(
      `${this.apiUrl}/${idSolicitud}`,
      this.getHeaders()
    );
  }
}
