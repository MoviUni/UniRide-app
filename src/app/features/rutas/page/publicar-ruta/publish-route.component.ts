import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  RoutesService,
  RutaRequestDto,
  RutaResponseDto
} from '../../../../core/services/routes.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-publish-route',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="breadcrumb">Inicio &gt; Mis rutas &gt; Publicar ruta</div>

      <h1 class="page-title">Publicar ruta como conductor</h1>
      <p class="page-subtitle">
        Completa los datos para compartir tu viaje con otros estudiantes de la UPC.
      </p>

      <section class="card">
        <header class="card-header">
          <div class="card-title-row">
            <h2>Datos de la ruta</h2>
            <span class="brand-pill">UniRide</span>
          </div>
          <p>Esta información será visible para los pasajeros cuando busquen rutas.</p>
        </header>

        <form class="form" [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="field">
              <label for="origin">Origen</label>
              <div class="input-shell">
                <input
                  id="origin"
                  type="text"
                  formControlName="origin"
                  placeholder="Ej. Av. Angamos Este 2102"
                />
              </div>
              <div class="error" *ngIf="isInvalid('origin')">
                Ingresa un origen válido.
              </div>
            </div>

            <div class="field">
              <label for="destination">Destino</label>
              <div class="input-shell">
                <input
                  id="destination"
                  type="text"
                  formControlName="destination"
                  placeholder="Ej. UPC Monterrico"
                />
              </div>
              <div class="error" *ngIf="isInvalid('destination')">
                Ingresa un destino válido.
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="field">
              <label for="date">Día de salida</label>
              <div class="input-shell">
                <input id="date" type="date" formControlName="date" />
              </div>
              <div class="error" *ngIf="isInvalid('date')">
                Selecciona un día de salida.
              </div>
            </div>

            <div class="field">
              <label for="time">Hora de salida</label>
              <div class="input-shell">
                <input id="time" type="time" formControlName="time" />
              </div>
              <div class="error" *ngIf="isInvalid('time')">
                Selecciona una hora de salida.
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="field">
              <label for="vehicle">Vehículo</label>
              <div class="input-shell">
                <input
                  id="vehicle"
                  type="text"
                  formControlName="vehicle"
                  placeholder="Ej. Toyota Yaris 2024"
                />
              </div>
              <div class="error" *ngIf="isInvalid('vehicle')">
                Indica el vehículo que usarás.
              </div>
            </div>

            <div class="field field-small">
              <label for="capacity">Capacidad de pasajeros</label>
              <div class="input-shell">
                <input
                  id="capacity"
                  type="number"
                  formControlName="capacity"
                  min="1"
                />
              </div>
              <div class="hint">
                Mínimo 1 pasajero. La capacidad mínima real dependerá de tu vehículo.
              </div>
              <div class="error" *ngIf="isInvalid('capacity')">
                Ingresa una capacidad válida (mayor o igual a 1).
              </div>
            </div>

            <div class="field field-small">
              <label for="price">Aporte por pasajero (opcional)</label>
              <div class="input-shell">
                <input
                  id="price"
                  type="number"
                  formControlName="price"
                  min="0"
                  step="0.5"
                  placeholder="Ej. 12.50"
                />
              </div>
              <div class="hint">
                Este monto se mostrará como referencia al pasajero.
              </div>
            </div>
          </div>

          <div class="messages" *ngIf="errorMessage || successMessage">
            <div class="alert alert-error" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>
            <div class="alert alert-success" *ngIf="successMessage">
              {{ successMessage }}
            </div>
          </div>

          <button class="btn-primary" type="submit">
            Publicar ruta
          </button>
        </form>
      </section>

      <section class="card card-list" *ngIf="ultimasRutas.length">
        <header class="card-header">
          <h2>Últimas rutas publicadas</h2>
          <p>Se muestran tus rutas más recientes como conductor.</p>
        </header>

        <ul class="route-list">
          <li class="route-item" *ngFor="let r of ultimasRutas">
            <div class="route-main">
              <p class="route-line">
                {{ r.origen }} &rarr; {{ r.destino }}
              </p>
              <p class="route-meta">
                {{ r.fechaSalida | date:'dd/MM/yyyy' }} &middot; {{ r.horaSalida }}
                <span *ngIf="r.asientosDisponibles !== undefined">
                  &middot; Asientos: {{ r.asientosDisponibles }}
                </span>
              </p>
            </div>
            <div class="route-side">
              <span class="price-chip" *ngIf="r.tarifa !== undefined">
                s/. {{ r.tarifa | number:'1.2-2' }}
              </span>
            </div>
          </li>
        </ul>
      </section>
    </div>
  `,
  styles: [`
    :host {
      --ur-primary: #242F9B;
      --ur-primary-dark: #2A314B;
      --ur-accent: #DE2D4A;
      --ur-soft-blue: #CFE4FF;
      --ur-soft-salmon: #FAAB99;
      --ur-bg: #F5F7FF;
      --ur-border: #E5E7EB;

      display: block;
      min-height: 100vh;
      background: var(--ur-bg);
      font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #111827;
    }

    .page {
      max-width: 1120px;
      margin: 2.5rem auto 3rem;
      padding: 0 1.5rem;
    }

    .breadcrumb {
      font-size: 0.8rem;
      color: #9CA3AF;
      margin-bottom: 0.75rem;
    }

    .page-title {
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--ur-primary-dark);
      margin: 0 0 0.25rem;
    }

    .page-subtitle {
      margin: 0 0 1.75rem;
      font-size: 0.95rem;
      color: #6B7280;
    }

    .card {
      background: #FFFFFF;
      border-radius: 24px;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
      padding: 2.25rem 2.5rem 2.5rem;
      margin-bottom: 2rem;
    }

    .card-header {
      margin-bottom: 1.75rem;
    }

    .card-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.35rem;
    }

    .card-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--ur-primary-dark);
    }

    .card-header p {
      margin: 0;
      font-size: 0.9rem;
      color: #6B7280;
    }

    .brand-pill {
      padding: 0.35rem 0.9rem;
      border-radius: 999px;
      background: var(--ur-soft-blue);
      color: var(--ur-primary);
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    .form {
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

    .field-small {
      max-width: 260px;
    }

    .field label {
      font-size: 0.85rem;
      font-weight: 500;
      color: #4B5563;
    }

    .input-shell {
      border-radius: 999px;
      border: 1px solid #D1D5DB;
      background: #FFFFFF;
      padding: 0.7rem 1.1rem;
      display: flex;
      align-items: center;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .input-shell input {
      width: 100%;
      border: none;
      outline: none;
      font-size: 0.9rem;
      color: #111827;
      background: transparent;
    }

    .input-shell input::placeholder {
      color: #9CA3AF;
    }

    .input-shell:focus-within {
      border-color: var(--ur-primary);
      box-shadow: 0 0 0 1px rgba(36, 47, 155, 0.28);
    }

    .hint {
      font-size: 0.78rem;
      color: #6B7280;
    }

    .error {
      font-size: 0.78rem;
      color: #B91C1C;
    }

    .messages {
      margin-top: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .alert {
      padding: 0.7rem 1rem;
      border-radius: 16px;
      font-size: 0.85rem;
    }

    .alert-error {
      background: #FEF2F2;
      color: #991B1B;
      border: 1px solid #FCA5A5;
    }

    .alert-success {
      background: #ECFDF3;
      color: #166534;
      border: 1px solid #86EFAC;
    }

    .btn-primary {
      margin-top: 0.5rem;
      align-self: flex-start;
      border: none;
      border-radius: 999px;
      padding: 0.85rem 1.8rem;
      background: var(--ur-primary);
      color: #FFFFFF;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 12px 30px rgba(36, 47, 155, 0.45);
      transition: background 0.15s ease, transform 0.07s ease, box-shadow 0.15s ease;
    }

    .btn-primary:hover {
      background: #1F2A88;
      transform: translateY(-1px);
      box-shadow: 0 16px 38px rgba(36, 47, 155, 0.6);
    }

    .card-list {
      padding-top: 1.75rem;
    }

    .route-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }

    .route-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding: 0.8rem 1rem;
      border-radius: 16px;
      border: 1px solid var(--ur-border);
      background: #F9FAFB;
    }

    .route-line {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--ur-primary-dark);
    }

    .route-meta {
      margin: 0.15rem 0 0;
      font-size: 0.8rem;
      color: #6B7280;
    }

    .route-side {
      display: flex;
      align-items: center;
    }

    .price-chip {
      display: inline-flex;
      align-items: center;
      padding: 0.35rem 0.7rem;
      border-radius: 999px;
      background: var(--ur-soft-salmon);
      color: #7C1034;
      font-size: 0.8rem;
      font-weight: 600;
    }

    @media (max-width: 900px) {
      .card {
        padding: 1.8rem 1.6rem 2rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .field-small {
        max-width: none;
      }
    }
  `]
})
export class PublishRouteComponent implements OnInit {
  form!: FormGroup;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private routesService: RoutesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      vehicle: ['', Validators.required],
      capacity: [1, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.min(0)]],
    });

    const idConductor = this.getConductorId();
    if (idConductor != null) {
      // Cargar rutas existentes del conductor para mostrar últimas y validar duplicados
      this.routesService.getMisRutas(idConductor).subscribe();
    } else {
      console.warn('No se encontró ID de conductor en el usuario autenticado.');
    }
  }

  /** Últimas 5 rutas del conductor (data viene del servicio, que llama al backend) */
  get ultimasRutas(): RutaResponseDto[] {
    const data = this.routesService.rutas();
    return [...data]
      .sort((a: RutaResponseDto, b: RutaResponseDto) => {
        const da = new Date(`${a.fechaSalida}T${a.horaSalida}`).getTime();
        const db = new Date(`${b.fechaSalida}T${b.horaSalida}`).getTime();
        return db - da;
      })
      .slice(0, 5);
  }

  isInvalid(controlName: string): boolean {
    const ctrl = this.form.get(controlName);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const idConductor = this.getConductorId();
    if (idConductor == null) {
      this.errorMessage = 'No se encontró un usuario autenticado para publicar la ruta.';
      return;
    }

    const value = this.form.value as {
      origin: string;
      destination: string;
      date: string;
      time: string;
      vehicle: string;
      capacity: number;
      price: number | null;
    };

    // RN5 - No horarios pasados
    const departure = new Date(`${value.date}T${value.time}`);
    const now = new Date();
    if (departure <= now) {
      this.errorMessage = 'No se pueden publicar rutas con horarios pasados.';
      return;
    }

    // RN5/RN6 - Capacidad mínima
    if (value.capacity < 1) {
      this.errorMessage =
        'Cada ruta debe tener al menos 1 pasajero como capacidad mínima.';
      return;
    }

    // RN5 - Rutas duplicadas (mismo conductor, origen, destino, fecha, hora)
    const existentes = this.routesService.rutas();
    const duplicada = existentes.some((r: RutaResponseDto) =>
      r.origen.trim().toLowerCase() === value.origin.trim().toLowerCase() &&
      r.destino.trim().toLowerCase() === value.destination.trim().toLowerCase() &&
      r.fechaSalida === value.date &&
      r.horaSalida === value.time
    );

    if (duplicada) {
      this.errorMessage =
        'Ya publicaste una ruta con el mismo origen, destino, fecha y hora.';
      return;
    }

    const dto: RutaRequestDto = {
      origen: value.origin,
      destino: value.destination,
      fechaSalida: value.date,
      horaSalida: value.time,
      tarifa: value.price ?? undefined,
      asientosDisponibles: value.capacity,
      idConductor: idConductor,
    };

    this.routesService.publicar(dto).subscribe({
      next: () => {
        this.successMessage = 'Ruta publicada correctamente.';
        this.form.reset({
          origin: '',
          destination: '',
          date: '',
          time: '',
          vehicle: '',
          capacity: 1,
          price: null,
        });
      },
      error: (err: unknown) => {
        console.error(err);
        this.errorMessage = 'Ocurrió un error al publicar la ruta.';
      },
    });
  }

  /** Saca el ID del conductor desde AuthService.currentUser() de forma segura */
private getConductorId(): number | null {
  // currentUser es un signal, por eso lo llamamos como función
  const rawUser = this.authService.currentUser();

  // Lo casteamos a un tipo que sabemos que puede tener 'id'
  const user = rawUser as { id?: number | string } | null;

  if (!user || user.id == null) {
    return null;
  }

  const parsed = Number(user.id);
  return Number.isNaN(parsed) ? null : parsed;
}
}
