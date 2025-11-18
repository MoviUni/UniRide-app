import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams, HttpParamsOptions} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RutaCardResponse, RutaRequest, RutaResponse } from '../models/ruta.model';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RutaFrecuenteResponseDTO, RutaResponseDTO, EstadoRuta } from '../models/ruta.model';

@Injectable({
  providedIn: 'root'
})
export class RutaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/rutas`;

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
  private _rutas = signal<RutaResponse[]>([]);


  // GET - Obtener todos
  get(): Observable<RutaResponse[]> {
    return this.http.get<RutaResponse[]>(this.apiUrl, this.getHeaders()).pipe(
      tap(data => this._rutas.set(data))
    );
  }


    private _info = signal<RutaCardResponse[]>([]);

  // GET - Obtener todos
  getInfo(): Observable<RutaCardResponse[]> {
    return this.http.get<RutaCardResponse[]>(`${this.apiUrl}/info`, this.getHeaders()).pipe(
      tap(data => this._info.set(data))
    );
  }

    // GET - Obtener todos
  getByOrigen(origen:string): Observable<RutaResponse[]> {
    return this.http.get<RutaResponse[]>(`${this.apiUrl}/origen?origen=${origen}`, this.getHeaders()).pipe(
      tap(data => this._rutas.set(data))
    );
  }


  // GET - Obtener por ID
  getById(id: number): Observable<RutaResponse> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  // POST - Crear
  create(data: RutaRequest): Observable<RutaResponse> {
    return this.http.post<RutaResponse>(this.apiUrl, data, this.getHeaders()).pipe(
      tap(newItem => {
        this._rutas.update(current => [...current, newItem]);
      })
    )
  }

  // id hardcodeado para pruebas
  private conductorId = 1;

  // Signals para ESTADO COMPARTIDO (si los usan en otros componentes)
  private _items = signal<any[]>([]);
  items = this._items.asReadonly();

  // ======== ESTADÍSTICAS =========

  getTotalViajes(conductorId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/conductor/${conductorId}/total`,
      this.getHeaders()
    );
  }

  getFrecuenciaViajes(
    conductorId: number
  ): Observable<{ [pasajero: string]: number }> {
    return this.http.get<{ [pasajero: string]: number }>(
      `${this.apiUrl}/conductor/${conductorId}/frecuencia`,
      this.getHeaders()
    );
  }

  getRutasMasFrecuentes(
    conductorId: number
  ): Observable<RutaFrecuenteResponseDTO[]> {
    return this.http.get<RutaFrecuenteResponseDTO[]>(
      `${this.apiUrl}/conductor/${conductorId}/RutaFrecuente`,
      this.getHeaders()
    );
  }

  descargarHistorialPDF(conductorId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/conductor/${conductorId}/historial/pdf`, {
      ...this.getHeaders(),
      responseType: 'blob'  
    });
  }


  // ======== MIS RUTAS (LISTAR RUTAS VÁLIDAS) =========

  getRutasActivasDelConductor(conductorId: number): Observable<RutaResponseDTO[]> {
    return this.http.get<RutaResponseDTO[]>(
      `${this.apiUrl}/mias/activas/${conductorId}`,
      this.getHeaders()
    );
  }
  // ======== MIS RUTAS (CONFRIMAR/CANCELAR) =========
  cambiarEstadoRuta(
  idRuta: number,
  nuevoEstado: EstadoRuta
): Observable<RutaResponseDTO> {
  const body = { estado: nuevoEstado };

  return this.http.patch<RutaResponseDTO>(
    `${this.apiUrl}/${idRuta}/estado`,
    body,
    this.getHeaders()
  );
}

  // y si no lo tenías aún:
  getRutaById(idRuta: number): Observable<RutaResponseDTO> {
    return this.http.get<RutaResponseDTO>(
      `${this.apiUrl}/${idRuta}`,
      this.getHeaders()
    );
  }
}

