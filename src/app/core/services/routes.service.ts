// src/app/core/services/routes.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';


export type EstadoRuta = 'PROGRAMADO' | 'EN_PROGRESO' | 'CONFIRMADO' | 'CANCELADO' | 'FINALIZADO' | 'PENDIENTE' | 'ACTIVO';

export interface RutaRequestDto {
  origen: string;
  destino: string;
  fechaSalida: string;      
  horaSalida: string;       
  tarifa?: number;          
  asientosDisponibles: number;
  estadoRuta: EstadoRuta;
  conductorId: number;
}

export interface RutaResponseDto {
  idRuta: number;
  origen: string;
  destino: string;
  fechaSalida: string;
  horaSalida: string;
  tarifa?: number;
  asientosDisponibles: number;
  estadoRuta: EstadoRuta;
  capacidad?: number;
  [key: string]: unknown;
}

export interface RutaFrecuenteResponseDto {
  origen: string;
  destino: string;
  frecuencia: number;
}

export type FrecuenciaViajesResponse = Record<string, number>;

interface RutaEstadoRequestDto {
  estado: EstadoRuta;
}

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/rutas`;

  // token hardcodeado para pruebas
  private token ='eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYXJpYW5hLmc1bWV6QGV4YW1wbGUuY29tIiwicm9sZSI6IlJPTEVfQ09ORFVDVE9SIiwiZXhwIjoxNzY1NTYwNzc5fQ.u23huAEkcj49xEAgPhtArJtlDxbB_vxRB-77Ba5mx9vsfc5DogP5JOvxu7PtOdtiZeFm8ZirwVpmXZqmDxZWJw';

  private getHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };
  }

  // Signals para estado compartido
  private _rutas = signal<RutaResponseDto[]>([]);
  rutas = this._rutas.asReadonly();

  private _rutaSeleccionada = signal<RutaResponseDto | null>(null);
  rutaSeleccionada = this._rutaSeleccionada.asReadonly();

  // POST /rutas/publicar
  publicar(dto: RutaRequestDto): Observable<RutaResponseDto> {
    return this.http
      .post<RutaResponseDto>(`${this.apiUrl}/publicar`, dto, this.getHeaders())
      .pipe(
        tap((nueva: RutaResponseDto) => {
          this._rutas.update((actual: RutaResponseDto[]) => [...actual, nueva]);
        })
      );
  }

  // GET /rutas/mias/{idConductor}
  getMisRutas(idConductor: number): Observable<RutaResponseDto[]> {
    return this.http
      .get<RutaResponseDto[]>(`${this.apiUrl}/mias/${idConductor}`, this.getHeaders())
      .pipe(tap((data: RutaResponseDto[]) => this._rutas.set(data)));
  }

  // GET /rutas/{rutaId}
  getById(idRuta: number): Observable<RutaResponseDto> {
    return this.http
      .get<RutaResponseDto>(`${this.apiUrl}/${idRuta}`, this.getHeaders())
      .pipe(tap((ruta: RutaResponseDto) => this._rutaSeleccionada.set(ruta)));
  }

  // PATCH /rutas/{idRuta}/estado
  updateEstado(idRuta: number, estado: EstadoRuta): Observable<RutaResponseDto> {
    const body: RutaEstadoRequestDto = { estado };
    return this.http
      .patch<RutaResponseDto>(`${this.apiUrl}/${idRuta}/estado`, body, this.getHeaders())
      .pipe(
        tap((updated: RutaResponseDto) => {
          this._rutas.update((actual: RutaResponseDto[]) =>
            actual.map((r: RutaResponseDto) =>
              r.idRuta === idRuta ? { ...r, ...updated } : r
            )
          );
          const actualSeleccionada = this._rutaSeleccionada();
          if (actualSeleccionada && actualSeleccionada.idRuta === idRuta) {
            this._rutaSeleccionada.set(updated);
          }
        })
      );
  }

  // GET /rutas -> disponibles
  getDisponibles(): Observable<RutaResponseDto[]> {
    return this.http
      .get<RutaResponseDto[]>(this.apiUrl, this.getHeaders())
      .pipe(tap((data: RutaResponseDto[]) => this._rutas.set(data)));
  }

  // GET /rutas/buscar?destino=&origen=&hora=&fecha=
  buscarRutas(filters: {
    destino?: string;
    origen?: string;
    hora?: string;
    fecha?: string;
  }): Observable<RutaResponseDto[]> {
    let params = new HttpParams();
    if (filters.destino) params = params.set('destino', filters.destino);
    if (filters.origen) params = params.set('origen', filters.origen);
    if (filters.hora) params = params.set('hora', filters.hora);
    if (filters.fecha) params = params.set('fecha', filters.fecha);

    return this.http
      .get<RutaResponseDto[]>(`${this.apiUrl}/buscar`, {
        params,
        ...this.getHeaders(),
      })
      .pipe(tap((data: RutaResponseDto[]) => this._rutas.set(data)));
  }

  // GET /rutas/historial/{rol}/{idUsuario}
  getHistorial(rol: 'PASAJERO' | 'CONDUCTOR', idUsuario: number)
    : Observable<RutaResponseDto[]> {
    return this.http.get<RutaResponseDto[]>(
      `${this.apiUrl}/historial/${rol}/${idUsuario}`,
      this.getHeaders()
    );
  }

  // GET /rutas/conductor/{conductorId}/total
  getTotalViajes(conductorId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/conductor/${conductorId}/total`,
      this.getHeaders()
    );
  }

  // GET /rutas/conductor/{conductorId}/frecuencia
  getFrecuenciaViajes(conductorId: number): Observable<FrecuenciaViajesResponse> {
    return this.http.get<FrecuenciaViajesResponse>(
      `${this.apiUrl}/conductor/${conductorId}/frecuencia`,
      this.getHeaders()
    );
  }

  // GET /rutas/conductor/{conductorId}/RutaFrecuente
  getRutasFrecuentes(conductorId: number)
    : Observable<RutaFrecuenteResponseDto[]> {
    return this.http.get<RutaFrecuenteResponseDto[]>(
      `${this.apiUrl}/conductor/${conductorId}/RutaFrecuente`,
      this.getHeaders()
    );
  }

  // GET /rutas/conductor/{conductorId}/historial/pdf
  exportHistorialPdf(conductorId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/conductor/${conductorId}/historial/pdf`, {
      responseType: 'blob',
      ...this.getHeaders(),
    });
  }
}
