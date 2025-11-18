import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RoutesService, RutaResponseDto, EstadoRuta }   from '../../../core/services/routes.service';;

interface Passenger {
  id: number;
  name: string;
  career: string;
  district: string;
}

@Component({
  selector: 'app-manage-trip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="breadcrumb">Inicio &gt; Mis rutas &gt; Gestionar viaje</div>

      <h1 class="page-title">Solicitudes de pasajeros</h1>
      <p class="page-subtitle">
        Revisa y gestiona a los pasajeros antes de confirmar o cancelar tu viaje.
      </p>

      <!-- Resumen de la ruta -->
      <section class="card route-summary" *ngIf="ruta">
        <header class="card-header">
          <div>
            <h2>{{ ruta.origen }} &rarr; {{ ruta.destino }}</h2>
            <p>
              Fecha de salida:
              {{ ruta.fechaSalida | date:'dd/MM/yyyy' }}
              &middot; Hora de salida: {{ ruta.horaSalida }}
              &middot;
              Asientos disponibles:
              {{ ruta.asientosDisponibles ?? 0 }}
            </p>
          </div>
          <span
            class="status-pill"
            [ngClass]="ruta.estadoRuta === 'ACTIVA'
              ? 'status-pill-confirmed'
              : 'status-pill-scheduled'"
          >
            {{ statusLabel(ruta) }}
          </span>
        </header>

        <div class="summary-actions">
          <button
            class="btn-primary"
            type="button"
            (click)="confirmTrip()"
            [disabled]="ruta.estadoRuta === 'ACTIVA' || ruta.estadoRuta === 'CANCELADA'"
          >
            Confirmar viaje
          </button>
          <button
            class="btn-danger"
            type="button"
            (click)="cancelTrip()"
            [disabled]="ruta.estadoRuta === 'CANCELADA'"
          >
            Cancelar viaje
          </button>
          <span class="cutoff">
            Habilitado hasta una hora antes de la salida.
          </span>
        </div>

        <div class="feedback" *ngIf="feedbackMessage">
          <div
            class="alert"
            [ngClass]="feedbackType === 'success' ? 'alert-success' : 'alert-error'"
          >
            {{ feedbackMessage }}
          </div>
        </div>
      </section>

      <!-- Listas de pasajeros (mock, aún sin backend de reservas) -->
      <section class="grid">
        <div class="card">
          <header class="card-header">
            <h2>Solicitudes de pasajeros</h2>
          </header>

          <div *ngIf="pendingPassengers.length; else noPending">
            <ul class="passenger-list">
              <li class="passenger" *ngFor="let p of pendingPassengers">
                <div class="passenger-main">
                  <p class="name">{{ p.name }}</p>
                  <p class="meta">
                    Carrera: {{ p.career }} &middot; Distrito: {{ p.district }}
                  </p>
                </div>
                <div class="passenger-actions">
                  <button class="btn-ghost accept" (click)="acceptPassenger(p)">
                    Aceptar
                  </button>
                  <button class="btn-ghost reject" (click)="rejectPassenger(p)">
                    Rechazar
                  </button>
                </div>
              </li>
            </ul>
          </div>

          <ng-template #noPending>
            <p class="empty-message">
              No hay solicitudes pendientes para este viaje.
            </p>
          </ng-template>
        </div>

        <div class="card">
          <header class="card-header">
            <h2>Pasajeros confirmados</h2>
          </header>

          <div *ngIf="confirmedPassengers.length; else noConfirmed">
            <ul class="passenger-list">
              <li class="passenger" *ngFor="let p of confirmedPassengers">
                <div class="passenger-main">
                  <p class="name">{{ p.name }}</p>
                  <p class="meta">
                    Carrera: {{ p.career }} &middot; Distrito: {{ p.district }}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <ng-template #noConfirmed>
            <p class="empty-message">
              Aún no hay pasajeros confirmados.
            </p>
          </ng-template>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      --ur-primary: #242F9B;
      --ur-primary-dark: #2A314B;
      --ur-soft-blue: #CFE4FF;
      --ur-accent: #DE2D4A;
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
      margin: 0 0 1.5rem;
      font-size: 0.95rem;
      color: #6B7280;
    }

    .card {
      background: #FFFFFF;
      border-radius: 24px;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
      padding: 1.9rem 2.2rem 2.2rem;
      margin-bottom: 1.75rem;
    }

    .route-summary {
      background: linear-gradient(140deg, #FFFFFF 40%, #E0ECFF 100%);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.25rem;
      margin-bottom: 1.1rem;
    }

    .card-header h2 {
      margin: 0 0 0.4rem;
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--ur-primary-dark);
    }

    .card-header p {
      margin: 0;
      font-size: 0.9rem;
      color: #4B5563;
    }

    .status-pill {
      padding: 0.35rem 0.9rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .status-pill-scheduled {
      background: var(--ur-soft-blue);
      color: var(--ur-primary);
    }

    .status-pill-confirmed {
      background: #DCFCE7;
      color: #166534;
    }

    .summary-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .btn-primary,
    .btn-danger {
      border-radius: 999px;
      border: none;
      padding: 0.75rem 1.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease, transform 0.07s ease, box-shadow 0.15s ease;
    }

    .btn-primary {
      background: var(--ur-primary);
      color: #FFFFFF;
      box-shadow: 0 10px 24px rgba(36, 47, 155, 0.45);
    }

    .btn-primary:hover:not(:disabled) {
      background: #1F2A88;
      transform: translateY(-1px);
      box-shadow: 0 14px 32px rgba(36, 47, 155, 0.6);
    }

    .btn-danger {
      background: var(--ur-accent);
      color: #FFFFFF;
      box-shadow: 0 10px 24px rgba(222, 45, 74, 0.35);
    }

    .btn-danger:hover:not(:disabled) {
      background: #B91C3A;
      transform: translateY(-1px);
      box-shadow: 0 14px 32px rgba(185, 28, 58, 0.6);
    }

    .btn-primary:disabled,
    .btn-danger:disabled {
      opacity: 0.7;
      box-shadow: none;
      cursor: default;
    }

    .cutoff {
      font-size: 0.85rem;
      color: #6B7280;
    }

    .feedback {
      margin-top: 1rem;
    }

    .alert {
      padding: 0.75rem 1rem;
      border-radius: 16px;
      font-size: 0.85rem;
    }

    .alert-success {
      background: #ECFDF3;
      color: #166534;
      border: 1px solid #86EFAC;
    }

    .alert-error {
      background: #FEF2F2;
      color: #991B1B;
      border: 1px solid #FCA5A5;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.5rem;
      align-items: flex-start;
    }

    .passenger-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    .passenger {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.25rem;
      padding: 0.8rem 1rem;
      border-radius: 18px;
      border: 1px solid var(--ur-border);
      background: #F9FAFB;
    }

    .passenger-main .name {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--ur-primary-dark);
    }

    .passenger-main .meta {
      margin: 0.1rem 0 0;
      font-size: 0.82rem;
      color: #6B7280;
    }

    .passenger-actions {
      display: flex;
      gap: 0.45rem;
      white-space: nowrap;
    }

    .btn-ghost {
      border-radius: 999px;
      border: 1px solid transparent;
      padding: 0.45rem 0.9rem;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      background: #FFFFFF;
      transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    }

    .btn-ghost.accept {
      border-color: #16A34A;
      color: #166534;
    }

    .btn-ghost.accept:hover {
      background: #DCFCE7;
    }

    .btn-ghost.reject {
      border-color: var(--ur-accent);
      color: #B91C1C;
    }

    .btn-ghost.reject:hover {
      background: #FEE2E2;
    }

    .empty-message {
      margin: 0.4rem 0 0;
      font-size: 0.88rem;
      color: #6B7280;
    }

    @media (max-width: 900px) {
      .grid {
        grid-template-columns: 1fr;
      }

      .card {
        padding: 1.7rem 1.6rem 1.9rem;
      }

      .passenger {
        flex-direction: column;
        align-items: flex-start;
      }

      .passenger-actions {
        align-self: stretch;
      }
    }
  `]
})
export class ManageTripComponent implements OnInit {
  private routesService = inject(RoutesService);
  private route = inject(ActivatedRoute);

  ruta: RutaResponseDto | null = null;

  pendingPassengers: Passenger[] = [
    { id: 1, name: 'José Méndez', career: 'Ingeniería Industrial', district: 'San Miguel' },
    { id: 2, name: 'María Torres', career: 'Comunicación y Publicidad', district: 'Santiago de Surco' },
    { id: 3, name: 'Juan Vázquez', career: 'Ciencias de la Computación', district: 'Jesús María' },
    { id: 4, name: 'Ana Castro', career: 'Biología', district: 'Jesús María' },
  ];

  confirmedPassengers: Passenger[] = [];

  feedbackMessage = '';
  feedbackType: 'success' | 'error' | '' = '';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const idRuta = idParam ? Number(idParam) : NaN;
    if (!idRuta || Number.isNaN(idRuta)) {
      this.showFeedback('ID de ruta inválido en la URL.', 'error');
      return;
    }

    this.routesService.getById(idRuta).subscribe({
      next: (ruta) => this.ruta = ruta,
      error: (err) => {
        console.error(err);
        this.showFeedback('No se pudo cargar la información de la ruta.', 'error');
      }
    });
  }

  statusLabel(r: RutaResponseDto): string {
    switch (r.estadoRuta) {
      case 'ACTIVA': return 'Programado';
      case 'PENDIENTE': return 'Pendiente';
      case 'FINALIZADA': return 'Finalizado';
      case 'CANCELADA': return 'Cancelado';
      default: return 'Sin estado';
    }
  }

  private showFeedback(message: string, type: 'success' | 'error') {
    this.feedbackMessage = message;
    this.feedbackType = type;
    setTimeout(() => {
      this.feedbackMessage = '';
      this.feedbackType = '';
    }, 3500);
  }

  confirmTrip(): void {
    if (!this.ruta) return;
    const idRuta = this.ruta.idRuta;
    const nuevoEstado: EstadoRuta = 'ACTIVA';

    this.routesService.updateEstado(idRuta, nuevoEstado).subscribe({
      next: (updated) => {
        this.ruta = updated;
        this.showFeedback('Viaje confirmado con éxito.', 'success');
      },
      error: (err) => {
        console.error(err);
        this.showFeedback('No se pudo confirmar el viaje.', 'error');
      }
    });
  }

  cancelTrip(): void {
    if (!this.ruta) return;
    const idRuta = this.ruta.idRuta;
    const nuevoEstado: EstadoRuta = 'CANCELADA';

    this.routesService.updateEstado(idRuta, nuevoEstado).subscribe({
      next: (updated) => {
        this.ruta = updated;
        this.showFeedback('Viaje cancelado con éxito. No podrá reactivarse.', 'success');
      },
      error: (err) => {
        console.error(err);
        this.showFeedback('No se pudo cancelar el viaje.', 'error');
      }
    });
  }

  acceptPassenger(p: Passenger): void {
    if (!this.ruta) return;
    if ((this.ruta.asientosDisponibles ?? 0) <= 0) {
      this.showFeedback('No hay asientos disponibles para confirmar más pasajeros.', 'error');
      return;
    }

    this.pendingPassengers = this.pendingPassengers.filter(x => x.id !== p.id);
    this.confirmedPassengers = [...this.confirmedPassengers, p];
    this.ruta = {
      ...this.ruta,
      asientosDisponibles: (this.ruta.asientosDisponibles ?? 0) - 1,
    };
    this.showFeedback('Pasajero confirmado con éxito.', 'success');
  }

  rejectPassenger(p: Passenger): void {
    this.pendingPassengers = this.pendingPassengers.filter(x => x.id !== p.id);
    this.showFeedback('La solicitud del pasajero fue rechazada.', 'success');
  }
}
