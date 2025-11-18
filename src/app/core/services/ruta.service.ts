import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RutaFrecuenteResponseDTO } from '../models/ruta.model';

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

  //id hardcodeado para pruebas
  private conductorId = 1;


  // Signals para ESTADO COMPARTIDO
  private _items = signal<any[]>([]);
  items = this._items.asReadonly();

  // GET - Obtener total de viajes de un conductor
  getTotalViajes(conductorId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/conductor/${conductorId}/total`, this.getHeaders());
  }

  // GET - Obtener frecuencia de viajes
  getFrecuenciaViajes(conductorId: number): Observable<{ [pasajero: string]: number }> {
  return this.http.get<{ [pasajero: string]: number }>(`${this.apiUrl}/conductor/${conductorId}/frecuencia`, this.getHeaders());
}

  // GET - Obtener rutas más frecuentes
  getRutasMasFrecuentes(conductorId: number): Observable<RutaFrecuenteResponseDTO[]> {
  return this.http.get<RutaFrecuenteResponseDTO[]>(`${this.apiUrl}/conductor/${conductorId}/RutaFrecuente`, this.getHeaders());
}

  // GET - Exportar historial de rutas en PDF
  descargarHistorialPDF(conductorId: number): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/conductor/${conductorId}/historial/pdf`, {
    ...this.getHeaders(),
    responseType: 'blob'  
  });
}



  
}