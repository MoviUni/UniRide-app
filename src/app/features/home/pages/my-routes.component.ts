import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface Route {
  id: number;
  origin: string;
  destination: string;
  date: string;           // yyyy-MM-dd
  time: string;           // HH:mm
  capacity: number;
  confirmedPassengers: number;
  driverId: number;
  active: boolean;
}

@Component({
  selector: 'app-my-routes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-title">Módulo 2 – Mis rutas como conductor</div>

      <div class="card">
        <div class="card-header">
          <h1>Rutas publicadas</h1>
          <p>Se muestran únicamente tus rutas activas, ordenadas por fecha y hora de salida.</p>
        </div>

        <table class="table" *ngIf="sortedRoutes.length; else emptyState">
          <thead>
            <tr>
              <th>Origen</th>
              <th>Destino</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Pasajeros</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of sortedRoutes">
              <td>{{ r.origin }}</td>
              <td>{{ r.destination }}</td>
              <td>{{ r.date | date:'dd/MM/yyyy' }}</td>
              <td>{{ r.time }}</td>
              <td>{{ r.capacity }}</td>
              <td>
                <button
                  class="link"
                  *ngIf="r.driverId === currentDriverId"
                  (click)="startEdit(r)"
                >
                  Editar
                </button>
                <button
                  class="link link-danger"
                  *ngIf="r.driverId === currentDriverId"
                  (click)="deleteRoute(r)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <ng-template #emptyState>
          <div class="empty">
            Aún no tienes rutas activas publicadas.
          </div>
        </ng-template>
      </div>

      <!-- Panel de edición (solo si hay ruta seleccionada) -->
      <div class="card" *ngIf="editingRoute">
        <div class="card-header">
          <h2>Editar ruta</h2>
          <p>
            Solo puedes editar tus propias rutas. Si hay pasajeros confirmados,
            no podrás reducir la capacidad por debajo de ese número.
          </p>
        </div>

        <form class="form" [formGroup]="editForm" (ngSubmit)="saveEdit()">
          <div class="form-row">
            <div class="field">
              <label>Origen</label>
              <input type="text" formControlName="origin" />
            </div>
            <div class="field">
              <label>Destino</label>
              <input type="text" formControlName="destination" />
            </div>
          </div>

          <div class="form-row">
            <div class="field">
              <label>Fecha</label>
              <input type="date" formControlName="date" />
            </div>
            <div class="field">
              <label>Hora</label>
              <input type="time" formControlName="time" />
            </div>
          </div>

          <div class="form-row">
            <div class="field">
              <label>Capacidad de pasajeros</label>
              <input type="number" formControlName="capacity" min="1" />
              <div class="helper" *ngIf="editingRoute">
                Reservas confirmadas: {{ editingRoute.confirmedPassengers }}.
              </div>
              <div class="error" *ngIf="capacityError">
                {{ capacityError }}
              </div>
            </div>
          </div>

          <div class="buttons">
            <button type="button" class="btn-secondary" (click)="cancelEdit()">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #f3f4f8;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #111827;
    }

    .page {
      max-width: 1080px;
      margin: 2rem auto;
      padding: 0 1.5rem 2.5rem;
    }

    .page-title {
      font-size: 1.4rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: #4b5563;
    }

    .card {
      background: #ffffff;
      border-radius: 24px;
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
      padding: 2.2rem 2.5rem;
      margin-bottom: 2rem;
    }

    .card-header h1,
    .card-header h2 {
      margin: 0 0 0.35rem;
      font-weight: 700;
      color: #111827;
    }

    .card-header h1 { font-size: 1.4rem; }
    .card-header h2 { font-size: 1.2rem; }

    .card-header p {
      margin: 0;
      font-size: 0.9rem;
      color: #6b7280;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1.5rem;
      font-size: 0.88rem;
    }

    .table th,
    .table td {
      text-align: left;
      padding: 0.7rem 0.6rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .table th {
      font-weight: 600;
      color: #4b5563;
    }

    .empty {
      margin-top: 1.75rem;
      font-size: 0.9rem;
      color: #6b7280;
    }

    .link {
      padding: 0;
      border: none;
      background: none;
      color: #2563eb;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      margin-right: 0.75rem;
    }

    .link-danger {
      color: #dc2626;
    }

    .form {
      margin-top: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.5rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }

    .field label {
      font-size: 0.9rem;
      font-weight: 500;
      color: #4b5563;
    }

    .field input {
      border-radius: 999px;
      border: 1px solid #d1d5db;
      padding: 0.7rem 1.1rem;
      font-size: 0.9rem;
      outline: none;
      background: #ffffff;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .field input:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.25);
    }

    .helper {
      font-size: 0.78rem;
      color: #6b7280;
    }

    .error {
      font-size: 0.78rem;
      color: #b91c1c;
    }

    .buttons {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .btn-primary,
    .btn-secondary {
      border-radius: 999px;
      border: none;
      padding: 0.7rem 1.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-primary {
      background: #2563eb;
      color: #ffffff;
      box-shadow: 0 8px 18px rgba(37, 99, 235, 0.35);
      transition: background 0.15s ease, transform 0.08s ease, box-shadow 0.15s ease;
    }

    .btn-primary:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
      box-shadow: 0 12px 26px rgba(37, 99, 235, 0.5);
    }

    .btn-secondary {
      background: #e5e7eb;
      color: #374151;
    }

    @media (max-width: 900px) {
      .card {
        padding: 1.75rem 1.6rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .buttons {
        flex-direction: column-reverse;
        align-items: stretch;
      }

      .btn-primary,
      .btn-secondary {
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class MyRoutesComponent {
  private fb = inject(FormBuilder);
  currentDriverId = 1; // demo

  routes: Route[] = [
    {
      id: 1,
      origin: 'San Miguel',
      destination: 'UPC Monterrico',
      date: '2025-11-20',
      time: '07:30',
      capacity: 3,
      confirmedPassengers: 2,
      driverId: 1,
      active: true,
    },
    {
      id: 2,
      origin: 'La Molina',
      destination: 'UPC Monterrico',
      date: '2025-11-22',
      time: '08:00',
      capacity: 4,
      confirmedPassengers: 0,
      driverId: 1,
      active: true,
    },
    {
      id: 3,
      origin: 'San Isidro',
      destination: 'UPC Monterrico',
      date: '2025-11-25',
      time: '18:00',
      capacity: 2,
      confirmedPassengers: 1,
      driverId: 2,   // otra persona
      active: true,
    },
  ];

  editingRoute: Route | null = null;
  capacityError: string | null = null;

  editForm: FormGroup = this.fb.group({
    origin: ['', Validators.required],
    destination: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    capacity: [1, [Validators.required, Validators.min(1)]],
  });

  get sortedRoutes(): Route[] {
    return this.routes
      .filter(r => r.active && r.driverId === this.currentDriverId) // RN8: solo rutas activas del conductor
      .slice()
      .sort((a, b) => {
        const da = new Date(`${a.date}T${a.time}`).getTime();
        const db = new Date(`${b.date}T${b.time}`).getTime();
        return da - db; // de la más próxima a la más lejana
      });
  }

  startEdit(route: Route): void {
    if (route.driverId !== this.currentDriverId) {
      return; // RN7: solo el conductor que creó la ruta puede editar
    }
    this.editingRoute = { ...route };
    this.capacityError = null;
    this.editForm.setValue({
      origin: route.origin,
      destination: route.destination,
      date: route.date,
      time: route.time,
      capacity: route.capacity,
    });
  }

  cancelEdit(): void {
    this.editingRoute = null;
    this.capacityError = null;
    this.editForm.reset();
  }

  saveEdit(): void {
    if (!this.editingRoute) { return; }

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const { origin, destination, date, time, capacity } = this.editForm.value;
    const routeIndex = this.routes.findIndex(r => r.id === this.editingRoute!.id);

    if (routeIndex === -1) { return; }

    const original = this.routes[routeIndex];

    // RN6: no reducir capacidad por debajo de las reservas confirmadas / valor positivo
    if (capacity < original.confirmedPassengers || capacity <= 0) {
      this.capacityError =
        `La capacidad no puede ser menor a las reservas confirmadas (${original.confirmedPassengers}) ni menor o igual a 0.`;
      return;
    }

    // RN7: cambios notifican (aquí solo simulamos con console.log)
    if (
      origin !== original.origin ||
      destination !== original.destination ||
      date !== original.date ||
      time !== original.time ||
      capacity !== original.capacity
    ) {
      console.log('Notificar automáticamente a pasajeros confirmados de la ruta', original.id);
    }

    this.routes[routeIndex] = {
      ...original,
      origin,
      destination,
      date,
      time,
      capacity,
    };

    this.routes = [...this.routes];
    this.cancelEdit();
  }

  deleteRoute(route: Route): void {
    if (route.driverId !== this.currentDriverId) {
      return; // RN7: solo el creador puede eliminar
    }

    // RN7: ruta eliminada no se reactiva; se marca como inactiva
    this.routes = this.routes.map(r =>
      r.id === route.id ? { ...r, active: false } : r
    );
  }
}
