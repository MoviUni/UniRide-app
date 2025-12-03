// src/app/core/services/pago.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagoRequest, PagoResponse } from '../models/pago.model';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pagos`;

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
   * Crear un nuevo pago
   * POST /pagos
   */
  create(data: PagoRequest): Observable<PagoResponse> {
    console.log('📤 Enviando pago:', data);
    return this.http.post<PagoResponse>(this.apiUrl, data, this.getHeaders());
  }

  /**
   * Obtener un pago por ID
   * GET /pagos/{id}
   */
  getById(id: number): Observable<PagoResponse> {
    return this.http.get<PagoResponse>(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  /**
   * Obtener todos los pagos de un pasajero
   * GET /pagos/pasajero/{idPasajero}
   */
  getByPasajero(idPasajero: number): Observable<PagoResponse[]> {
    return this.http.get<PagoResponse[]>(`${this.apiUrl}/pasajero/${idPasajero}`, this.getHeaders());
  }

  /**
   * Obtener todos los pagos de un conductor
   * GET /pagos/conductor/{idConductor}
   */
  getByConductor(idConductor: number): Observable<PagoResponse[]> {
    return this.http.get<PagoResponse[]>(`${this.apiUrl}/conductor/${idConductor}`, this.getHeaders());
  }
}
