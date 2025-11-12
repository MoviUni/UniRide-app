import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RutaRequest, RutaResponse } from '../models/ruta.model';

@Injectable({
  providedIn: 'root'
})
export class RutaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/rutas`;

  // Signals para ESTADO COMPARTIDO
  private _rutas = signal<RutaResponse[]>([]);
  rutas = this._rutas.asReadonly();

  // GET - Obtener todos
  get(): Observable<RutaResponse[]> {
    return this.http.get<RutaResponse[]>(this.apiUrl).pipe(
      tap(data => this._rutas.set(data))
    );
  }

  // GET - Obtener por ID
  getById(id: number): Observable<RutaResponse> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // POST - Crear
  create(data: RutaRequest): Observable<RutaResponse> {
    return this.http.post<RutaResponse>(this.apiUrl, data).pipe(
      tap(newItem => {
        this._rutas.update(current => [...current, newItem]);
      })
    );
  }

}