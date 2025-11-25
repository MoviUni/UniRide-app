// src/app/core/services/vehiculo.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  VehiculoRequest,
  VehiculoResponse,
} from '../models/vehiculo.model';

@Injectable({
  providedIn: 'root',
})
export class VehiculoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/vehiculos`;

  /**
   * GET /vehiculos/conductor/{idConductor}
   * Obtiene el vehículo asignado a un conductor.
   */
  getVehiculoByConductor(
    idConductor: number
  ): Observable<VehiculoResponse> {
    return this.http.get<VehiculoResponse>(
      `${this.apiUrl}/conductor/${idConductor}`
    );
  }

  /**
   * POST /vehiculos/conductor/{idConductor}
   * Registra un vehículo para un conductor dado.
   */
  registrarVehiculo(
    idConductor: number,
    body: VehiculoRequest
  ): Observable<VehiculoResponse> {
    return this.http.post<VehiculoResponse>(
      `${this.apiUrl}/conductor/${idConductor}`,
      body
    );
  }
}
