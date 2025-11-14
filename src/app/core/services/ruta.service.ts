import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams, HttpParamsOptions} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RutaRequest, RutaResponse } from '../models/ruta.model';


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
    );
  }

}