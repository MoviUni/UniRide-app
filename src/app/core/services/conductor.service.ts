import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@env/environment';
import { ConductorRequest, ConductorResponse } from '@core/models/conductor.model';

@Injectable({
  providedIn: 'root'
})
export class ConductorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/conductor`;

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
  private _items = signal<ConductorResponse[]>([]);
  items = this._items.asReadonly();

  // GET - Obtener todos
  getAll(): Observable<ConductorResponse[]> {
    return this.http.get<ConductorResponse[]>(this.apiUrl, this.getHeaders()).pipe(
      tap(data => this._items.set(data))
    );
  }

  // GET - Obtener por ID
  getById(id: number): Observable<ConductorResponse> {
    return this.http.get<ConductorResponse>(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  // POST - Crear
  create(data: ConductorRequest): Observable<ConductorResponse> {
    return this.http.post<ConductorResponse>(this.apiUrl, data).pipe(
      tap(newItem => {
        this._items.update(current => [...current, newItem]);
      })
    );
  }

}