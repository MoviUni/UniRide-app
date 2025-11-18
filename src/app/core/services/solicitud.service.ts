// src/app/core/services/solicitud.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  EstadoSolicitud,
  SolicitudViajeRequest,
  SolicitudViajeResponse
} from '../models/solicitud.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  // HttpClient vía inject (igual que en RutaService)
  private http = inject(HttpClient);

  // base URL para solicitudes
  private apiUrl = `${environment.apiUrl}/solicitudes`;

  // 🔐 Token hardcodeado solo para pruebas
  private token =
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYXJpYW5hLmc1bWV6QGV4YW1wbGUuY29tIiwicm9sZSI6IlJPTEVfQ09ORFVDVE9SIiwiZXhwIjoxNzY1NTYwNzc5fQ.u23huAEkcj49xEAgPhtArJtlDxbB_vxRB-77Ba5mx9vsfc5DogP5JOvxu7PtOdtiZeFm8ZirwVpmXZqmDxZWJw';

  // headers igual que en RutaService
  private getHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    };
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
