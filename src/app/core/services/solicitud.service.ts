// src/app/core/services/solicitud.service.ts
import { signal } from '@angular/core';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SolicitudCardResponse, EstadoSolicitud,SolicitudEstadoRequest, SolicitudEstadoResponse, SolicitudViajeRequest, SolicitudViajeResponse } from '../models/solicitud.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  // HttpClient vía inject (igual que en RutaService)
  private http = inject(HttpClient);

  // base URL para solicitudes
  private apiUrl = `${environment.apiUrl}/solicitudes`;

  //token hardcodeado para pruebas
  private token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYXJpYW5hLmc1bWV6QGV4YW1wbGUuY29tIiwicm9sZSI6IlJPTEVfQ09ORFVDVE9SIiwiZXhwIjoxNzY1NTYwNzc5fQ.u23huAEkcj49xEAgPhtArJtlDxbB_vxRB-77Ba5mx9vsfc5DogP5JOvxu7PtOdtiZeFm8ZirwVpmXZqmDxZWJw';

  private getHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    };
  }

  // Signals para ESTADO COMPARTIDO
  private _items = signal<SolicitudViajeResponse[]>([]);
  items = this._items.asReadonly();

  // GET - Obtener todos
  getAll(): Observable<SolicitudViajeResponse[]> {
    return this.http.get<SolicitudViajeResponse[]>(this.apiUrl, this.getHeaders()).pipe(
      tap(data => this._items.set(data))
    );
  }


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
  create(data: SolicitudViajeRequest): Observable<SolicitudViajeResponse> {
    return this.http.post<SolicitudViajeResponse>(this.apiUrl, data, this.getHeaders()).pipe(
      tap(newItem => {
        this._items.update(current => [...current, newItem]);
      })
    );
  }


  // PATCH
  cancelSolicitud(idSolicitud:number){
    return this.http.patch<SolicitudViajeResponse>(`${this.apiUrl}/${idSolicitud}/cancelar`,null,this.getHeaders()).pipe(
      tap(newItem => {
        this._items.update(current => [...current, newItem]);
      })
    );
  }

  updateSolicitud(data:SolicitudEstadoRequest, idSolicitud:number){
    return this.http.patch<SolicitudViajeResponse>(`${this.apiUrl}/${idSolicitud}/estado`, data, this.getHeaders())
  }
  // ----------------------------------------------------------------
  // 1) Crear solicitud (por si la necesitas del lado pasajero)
  // ----------------------------------------------------------------
  crearSolicitud(
    body: SolicitudViajeRequest
  ): Observable<SolicitudViajeResponse> {
    return this.http.post<SolicitudViajeResponse>(
      this.apiUrl,
      body,
      this.getHeaders()
    );
  }

  // ----------------------------------------------------------------
  // 2) Ver solicitudes de una ruta
  //    GET /solicitudes/ruta/{idRuta}
  // ----------------------------------------------------------------
  getSolicitudesPorRuta(
    idRuta: number
  ): Observable<SolicitudViajeResponse[]> {
    return this.http.get<SolicitudViajeResponse[]>(
      `${this.apiUrl}/ruta/${idRuta}`,
      this.getHeaders()
    );
  }

  // ----------------------------------------------------------------
  // 3) Cambiar estado de una solicitud
  //    PATCH /solicitudes/{idSolicitud}/estado
  // ----------------------------------------------------------------
  cambiarEstadoSolicitud(
    idSolicitud: number,
    nuevoEstado: EstadoSolicitud
  ): Observable<SolicitudViajeResponse> {
    const body = { estadoSolicitud: nuevoEstado };

    return this.http.patch<SolicitudViajeResponse>(
      `${this.apiUrl}/${idSolicitud}/estado`,
      body,
      this.getHeaders()
    );
  }

  // (Opcional) Obtener una solicitud por id
  getSolicitudById(
    idSolicitud: number
  ): Observable<SolicitudViajeResponse> {
    return this.http.get<SolicitudViajeResponse>(
      `${this.apiUrl}/${idSolicitud}`,
      this.getHeaders()
    );
  }
}
