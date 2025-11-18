import { Injectable, inject, signal } from '@angular/core';
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

  // token hardcodeado para pruebas
  private token =
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYXJpYW5hLmc1bWV6QGV4YW1wbGUuY29tIiwicm9sZSI6IlJPTEVfQ09ORFVDVE9SIiwiZXhwIjoxNzY1NTYwNzc5fQ.u23huAEkcj49xEAgPhtArJtlDxbB_vxRB-77Ba5mx9vsfc5DogP5JOvxu7PtOdtiZeFm8ZirwVpmXZqmDxZWJw';

  private getHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    };
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

  descargarHistorialPDF(conductorId: number): void {
    this.http
      .get(`${this.apiUrl}/conductor/${conductorId}/historial/pdf`, {
        ...this.getHeaders(),
        responseType: 'blob'
      })
      .subscribe((data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `historial_conductor_${conductorId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
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
