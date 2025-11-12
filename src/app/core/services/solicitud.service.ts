import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SolicitudEstadoRequest, SolicitudEstadoResponse, SolicitudViajeRequest, SolicitudViajeResponse } from '../models/solicitud.model';

@Injectable({
  providedIn: 'root'
})
export class NombreService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/solicitudes`;

  // Signals para ESTADO COMPARTIDO
  private _items = signal<SolicitudViajeResponse[]>([]);
  items = this._items.asReadonly();

  // GET - Obtener todos
  getAll(): Observable<SolicitudViajeResponse[]> {
    return this.http.get<SolicitudViajeResponse[]>(this.apiUrl).pipe(
      tap(data => this._items.set(data))
    );
  }


  private _estados = signal<SolicitudEstadoResponse[]>([]);
  estados = this._estados.asReadonly();
  getEstados(pasajeroId: number): Observable<SolicitudEstadoResponse[]> {
    return this.http.get<SolicitudEstadoResponse[]>(`${this.apiUrl}/usuario/id?id=${pasajeroId}`).pipe(
      tap(data => this._estados.set(data))
    );
  }

  // POST - Crear
  create(data: SolicitudViajeRequest): Observable<SolicitudViajeResponse> {
    return this.http.post<SolicitudViajeResponse>(this.apiUrl, data).pipe(
      tap(newItem => {
        this._items.update(current => [...current, newItem]);
      })
    );
  }

  // PATCH
  cancelSolicitud(data:SolicitudEstadoRequest, idSolicitud:number){
    return this.http.patch<SolicitudViajeResponse>(`${this.apiUrl}/${idSolicitud}/estado`, data)
  }

  updateSolicitud(data:SolicitudEstadoRequest, idSolicitud:number){
    return this.http.patch<SolicitudViajeResponse>(`${this.apiUrl}/${idSolicitud}/estado`, data)
  }

}