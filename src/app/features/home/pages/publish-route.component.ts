import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface Vehicle {
  id: number;
  name: string;
  minCapacity: number;
  maxCapacity: number;
}

interface Route {
  id: number;
  origin: string;
  destination: string;
  date: string;           // yyyy-MM-dd
  time: string;           // HH:mm
  capacity: number;
  confirmedPassengers: number;
  vehicleId: number;
  driverId: number;
  active: boolean;
}

@Component({
  selector: 'app-publish-route',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-title">Módulo 2 – Publicar ruta</div>

      <div class="card">
        <div class="card-header">
          <h1>Publicar una ruta como conductor</h1>
          <p>Completa los datos para publicar tu ruta. Todos los campos son obligatorios.</p>
        </div>

        <form class="form" [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="field">
              <label for="origin">Origen</label>
              <input
                id="origin"
                type="text"
                formControlName="origin"
                placeholder="Ej. San Miguel"
              />
              <div class="error" *ngIf="isInvalid('origin')">
                El origen es obligatorio.
              </div>
            </div>

            <div class="field">
              <label for="destination">Destino</label>
              <input
                id="destination"
                type="text"
                formControlName="destination"
                placeholder="Ej. Monterrico – UPC"
              />
              <div class="error" *ngIf="isInvalid('destination')">
                El destino es obligatorio.
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="field">
              <label for="date">Día</label>
              <input
                id="date"
                type="date"
                formControlName="date"
              />
              <div class="error" *ngIf="isInvalid('date')">
                Debes seleccionar una fecha.
              </div>
            </div>

            <div class="field">
              <label for="time">Hora</label>
              <input
                id="time"
                type="time"
                formControlName="time"
              />
              <div class="error" *ngIf="isInvalid('time')">
                Debes seleccionar una hora.
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="field">
              <label for="vehicle">Vehículo</label>
              <select
                id="vehicle"
                formControlName="vehicleId"
                (change)="onVehicleChange()"
              >
                <option value="" disabled>Selecciona un vehículo</option>
                <option
                  *ngFor="let v of vehicles"
                  [value]="v.id"
                >
                  {{ v.name }} ({{ v.maxCapacity }} pasajeros máx.)
                </option>
              </select>
              <div class="error" *ngIf="isInvalid('vehicleId')">
                Debes seleccionar un vehículo.
              </div>
            </div>

            <div class="field">
              <label for="capacity">Capacidad de pasajeros</label>
              <input
                id="capacity"
                type="number"
                formControlName="capacity"
                min="1"
              />
              <div class="helper" *ngIf="selectedVehicle">
                Capacidad permitida: mín. {{ selectedVehicle.minCapacity }},
                máx. {{ selectedVehicle.maxCapacity }} pasajeros.
              </div>
              <div class="error" *ngIf="isInvalid('capacity')">
                La capacidad debe ser un número positivo.
              </div>
            </div>
          </div>

          <div class="alert" *ngIf="timeError">
            {{ timeError }}
          </div>

          <div class="alert" *ngIf="duplicateError">
            {{ duplicateError }}
          </div>

          <button type="submit" class="btn-primary" [disabled]="form.invalid">
            Publicar ruta
          </button>
        </form>
      </div>

      <!-- Lista rápida de rutas creadas en esta pantalla (demo) -->
      <div class="card card-list" *ngIf="routes.length">
        <div class="card-header">
          <h2>Rutas publicadas (demo local)</h2>
          <p>Se muestran solo tus rutas activas.</p>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Origen</th>
              <th>Destino</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Pasajeros</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of routes">
              <td>{{ r.origin }}</td>
              <td>{{ r.destination }}</td>
              <td>{{ r.date | date:'dd/MM/yyyy' }}</td>
              <td>{{ r.time }}</td>
              <td>{{ r.capacity }}</td>
            </tr>
          </tbody>
        </table>
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
      padding: 2.5rem 2.75rem;
      margin-bottom: 2rem;
    }

    .card-header h1 {
      font-size: 1.4rem;
      font-weight: 700;
      margin: 0 0 0.35rem;
      color: #111827;
    }

    .card-header h2 {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0 0 0.25rem;
      color: #111827;
    }

    .card-header p {
      margin: 0;
      font-size: 0.9rem;
      color: #6b7280;
    }

    .form {
      margin-top: 2rem;
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

    .field input,
    .field select {
      border-radius: 999px;
      border: 1px solid #d1d5db;
      padding: 0.7rem 1.1rem;
      font-size: 0.9rem;
      outline: none;
      background: #ffffff;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .field input:focus,
    .field select:focus {
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

    .alert {
      padding: 0.75rem 1rem;
      border-radius: 12px;
      background: #fef2f2;
      color: #991b1b;
      font-size: 0.85rem;
      margin-top: -0.5rem;
    }

    .btn-primary {
      align-self: flex-start;
      margin-top: 0.5rem;
      border-radius: 999px;
      border: none;
      padding: 0.8rem 1.6rem;
      background: #2563eb;
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 10px 20px rgba(37, 99, 235, 0.35);
      transition: background 0.15s ease, transform 0.08s ease, box-shadow 0.15s ease;
    }

    .btn-primary:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
      box-shadow: 0 14px 30px rgba(37, 99, 235, 0.5);
    }

    .btn-primary:disabled {
      opacity: 0.7;
      box-shadow: none;
      cursor: default;
    }

    .card-list {
      padding-top: 1.75rem;
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

    @media (max-width: 900px) {
      .card {
        padding: 1.75rem 1.5rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PublishRouteComponent {
  private fb = inject(FormBuilder);
  private currentDriverId = 1; // demo

  vehicles: Vehicle[] = [
    { id: 1, name: 'Sedán – Toyota Yaris', minCapacity: 1, maxCapacity: 4 },
    { id: 2, name: 'Hatchback – Kia Rio', minCapacity: 1, maxCapacity: 3 },
    { id: 3, name: 'SUV – Hyundai Tucson', minCapacity: 1, maxCapacity: 5 },
  ];

  routes: Route[] = [];
  timeError: string | null = null;
  duplicateError: string | null = null;

  form: FormGroup = this.fb.group({
    origin: ['', Validators.required],
    destination: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    vehicleId: ['', Validators.required],
    capacity: [1, [Validators.required, Validators.min(1)]],
  });

  get selectedVehicle(): Vehicle | undefined {
    const id = this.form.get('vehicleId')?.value;
    return this.vehicles.find(v => v.id === Number(id));
  }

  isInvalid(controlName: string): boolean {
    const ctrl = this.form.get(controlName);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  onVehicleChange(): void {
    const vehicle = this.selectedVehicle;
    if (!vehicle) { return; }
    const ctrl = this.form.get('capacity');
    if (!ctrl) { return; }
    if (ctrl.value < vehicle.minCapacity) {
      ctrl.setValue(vehicle.minCapacity);
    }
    if (ctrl.value > vehicle.maxCapacity) {
      ctrl.setValue(vehicle.maxCapacity);
    }
  }

  onSubmit(): void {
    this.timeError = null;
    this.duplicateError = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { origin, destination, date, time, vehicleId, capacity } = this.form.value;

    const departure = new Date(`${date}T${time}`);
    const now = new Date();

    // RN5: no publicar rutas con horarios pasados
    if (departure <= now) {
      this.timeError = 'No se pueden publicar rutas con horarios pasados.';
      return;
    }

    const vehicle = this.selectedVehicle;
    if (vehicle) {
      // RN6: capacidad mínima según vehículo y número positivo
      if (capacity < vehicle.minCapacity || capacity > vehicle.maxCapacity) {
        this.timeError = `La capacidad debe estar entre ${vehicle.minCapacity} y ${vehicle.maxCapacity} pasajeros.`;
        return;
      }
    }

    // RN5: rutas duplicadas para el mismo conductor
    const duplicate = this.routes.some(r =>
      r.driverId === this.currentDriverId &&
      r.origin.toLowerCase() === String(origin).toLowerCase() &&
      r.destination.toLowerCase() === String(destination).toLowerCase() &&
      r.date === date &&
      r.time === time &&
      r.active
    );

    if (duplicate) {
      this.duplicateError =
        'Ya tienes una ruta publicada con el mismo origen, destino, fecha y hora.';
      return;
    }

    const newRoute: Route = {
      id: this.routes.length + 1,
      origin,
      destination,
      date,
      time,
      capacity,
      confirmedPassengers: 0,
      vehicleId: Number(vehicleId),
      driverId: this.currentDriverId,
      active: true,
    };

    this.routes.push(newRoute);
    this.routes = [...this.routes]; // refrescar referencia para detección de cambios

    this.form.reset({
      origin: '',
      destination: '',
      date: '',
      time: '',
      vehicleId: '',
      capacity: 1,
    });
  }
}
