// src/app/core/services/calificacion.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CalificacionRequest, CalificacionResponse } from '../models/calificacion.model';

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/calificaciones`;

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('authToken');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
  }

  /**
   * Crear una nueva calificación
   */
  createCalificacion(data: CalificacionRequest): Observable<CalificacionResponse> {
    return this.http.post<CalificacionResponse>(this.apiUrl, data, this.getHeaders());
  }

  /**
   * Obtener una calificación por ID
   */
  getCalificacionById(id: number): Observable<CalificacionResponse> {
    return this.http.get<CalificacionResponse>(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  /**
   * Obtener todas las calificaciones de un pasajero
   */
  getCalificacionesByPasajero(idPasajero: number): Observable<CalificacionResponse[]> {
    return this.http.get<CalificacionResponse[]>(`${this.apiUrl}/pasajero/${idPasajero}`, this.getHeaders());
  }

  /**
   * Obtener todas las calificaciones de un conductor
   */
  getCalificacionesByConductor(idConductor: number): Observable<CalificacionResponse[]> {
    return this.http.get<CalificacionResponse[]>(`${this.apiUrl}/conductor/${idConductor}`, this.getHeaders());
  }

  /**
   * Actualizar una calificación existente
   */
  updateCalificacion(id: number, data: CalificacionRequest): Observable<CalificacionResponse> {
    return this.http.put<CalificacionResponse>(`${this.apiUrl}/${id}`, data, this.getHeaders());
  }

  /**
   * Eliminar una calificación
   */
  deleteCalificacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHeaders());
  }
}
