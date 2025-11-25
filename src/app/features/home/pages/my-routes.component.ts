import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  RoutesService,
  RutaResponseDto
} from '../../../core/services/routes.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-my-routes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <div class="breadcrumb">Inicio &gt; Mis rutas</div>

      <h1 class="page-title">Mis rutas como conductor</h1>
      <p class="page-subtitle">
        Revisa tu próximo viaje y gestiona las rutas que has publicado.
      </p>

      <div class="grid">
        <!-- Viaje por iniciar -->
        <section class="card main-trip" *ngIf="nextRoute">
          <header class="card-header">
            <h2>Viaje por iniciar</h2>
            <span
              class="status-pill"
              [ngClass]="statusType(nextRoute) === 'confirmed'
                ? 'status-pill-confirmed'
                : 'status-pill-scheduled'"
            >
              {{ statusLabel(nextRoute) }}
            </span>
          </header>

          <div class="trip-body">
            <p class="trip-route">
              {{ nextRoute.origen }} &rarr; {{ nextRoute.destino }}
            </p>
            <p class="trip-meta">
              {{ nextRoute.fechaSalida | date:'dd/MM/yyyy' }}
              a las {{ nextRoute.horaSalida }}
            </p>
            <p class="trip-meta">
              Asientos disponibles:
              <strong>
                {{ availableSeats(nextRoute) }}/{{ totalSeats(nextRoute) }}
              </strong>
            </p>
            <p class="trip-meta muted">
              Estado: {{ statusLabel(nextRoute) }}
            </p>
          </div>

          <div class="trip-actions">
            <button
              class="btn-outline"
              [routerLink]="['/home/gestionar-viaje', nextRoute.idRuta]"
            >
              Gestionar viaje
            </button>
          </div>
        </section>

        <!-- Próximos viajes -->
        <section class="card">
          <header class="card-header">
            <h2>Próximos viajes</h2>
          </header>

          <div *ngIf="upcomingRoutes.length; else noRoutes">
            <ul class="route-list">
              <li class="route-item" *ngFor="let r of upcomingRoutes">
                <div class="route-main">
                  <p class="route-line">{{ r.origen }} &rarr; {{ r.destino }}</p>
                  <p class="route-meta">
                    {{ r.fechaSalida | date:'dd/MM/yyyy' }} &middot;
                    {{ r.horaSalida }} &middot;
                    Asientos: {{ availableSeats(r) }}/{{ totalSeats(r) }}
                  </p>
                </div>
                <div class="route-side">
                  <span
                    class="status-chip"
                    [ngClass]="statusType(r) === 'confirmed'
                      ? 'status-chip-confirmed'
                      : 'status-chip-scheduled'"
                  >
                    {{ statusLabel(r) }}
                  </span>
                  <button
                    class="link-button"
                    [routerLink]="['/home/gestionar-viaje', r.idRuta]"
                  >
                    Gestionar viaje
                  </button>
                </div>
              </li>
            </ul>
          </div>

          <ng-template #noRoutes>
            <p class="empty-message">
              Aún no tienes próximos viajes programados.
            </p>
          </ng-template>
        </section>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --ur-primary: #242F9B;
      --ur-primary-dark: #2A314B;
      --ur-soft-blue: #CFE4FF;
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

    .grid {
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
      gap: 1.5rem;
      align-items: flex-start;
    }

    .card {
      background: #FFFFFF;
      border-radius: 24px;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
      padding: 1.9rem 2.2rem 2.2rem;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .card-header h2 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--ur-primary-dark);
    }

    .main-trip {
      background: linear-gradient(145deg, #FFFFFF 40%, #E0ECFF 100%);
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

    .trip-body {
      margin-bottom: 1.4rem;
    }

    .trip-route {
      margin: 0 0 0.4rem;
      font-size: 1rem;
      font-weight: 600;
      color: var(--ur-primary-dark);
    }

    .trip-meta {
      margin: 0.15rem 0;
      font-size: 0.9rem;
      color: #4B5563;
    }

    .trip-meta.muted {
      color: #9CA3AF;
    }

    .trip-actions {
      display: flex;
      justify-content: flex-start;
      gap: 0.75rem;
    }

    .btn-outline {
      border-radius: 999px;
      border: 1px solid var(--ur-primary);
      background: #FFFFFF;
      color: var(--ur-primary);
      padding: 0.7rem 1.4rem;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
    }

    .btn-outline:hover {
      background: var(--ur-primary);
      color: #FFFFFF;
      box-shadow: 0 10px 24px rgba(36, 47, 155, 0.4);
    }

    .route-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .route-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.25rem;
      padding: 0.85rem 1rem;
      border-radius: 18px;
      border: 1px solid var(--ur-border);
      background: #F9FAFB;
    }

    .route-main {
      min-width: 0;
    }

    .route-line {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--ur-primary-dark);
    }

    .route-meta {
      margin: 0.2rem 0 0;
      font-size: 0.82rem;
      color: #6B7280;
    }

    .route-side {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.4rem;
      white-space: nowrap;
    }

    .status-chip {
      display: inline-flex;
      align-items: center;
      padding: 0.35rem 0.7rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status-chip-scheduled {
      background: var(--ur-soft-blue);
      color: var(--ur-primary);
    }

    .status-chip-confirmed {
      background: #DCFCE7;
      color: #166534;
    }

    .link-button {
      border: none;
      background: none;
      padding: 0;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--ur-primary);
      cursor: pointer;
      text-decoration: underline;
      text-decoration-thickness: 1px;
    }

    .empty-message {
      margin: 0.5rem 0 0;
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

      .route-item {
        align-items: flex-start;
      }

      .route-side {
        align-items: flex-start;
      }
    }
  `]
})
export class MyRoutesComponent implements OnInit {

  // ID de conductor fijo de PRUEBAS.
  // Cuando tu backend devuelva el id real en el login, aquí ya lo cambias.
  private readonly idConductorActual = 1;

  constructor(
    private routesService: RoutesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Carga tus rutas desde el backend y las deja en el signal this.routesService.rutas
    this.routesService.getMisRutas(this.idConductorActual).subscribe();
  }

  private parseFechaHora(r: RutaResponseDto): number {
    const fecha = r.fechaSalida ?? '';
    const hora = r.horaSalida ?? '00:00';
    return new Date(`${fecha}T${hora}`).getTime();
  }

  get nextRoute(): RutaResponseDto | null {
    const list = this.routesService.rutas() as RutaResponseDto[];
    if (!list.length) return null;
    const sorted = [...list].sort(
      (a: RutaResponseDto, b: RutaResponseDto) =>
        this.parseFechaHora(a) - this.parseFechaHora(b)
    );
    return sorted[0];
  }

  get upcomingRoutes(): RutaResponseDto[] {
    const next = this.nextRoute;
    const list = this.routesService.rutas() as RutaResponseDto[];
    if (!next) return [];
    return list
      .filter((r: RutaResponseDto) => r.idRuta !== next.idRuta)
      .sort((a: RutaResponseDto, b: RutaResponseDto) =>
        this.parseFechaHora(a) - this.parseFechaHora(b)
      );
  }

  availableSeats(r: RutaResponseDto): number {
    return r.asientosDisponibles ?? 0;
  }

  totalSeats(r: RutaResponseDto): number {
    return r.capacidad ?? (r.asientosDisponibles ?? 0);
  }

  statusLabel(r: RutaResponseDto): string {
    switch (r.estadoRuta) {
      case 'ACTIVO':
        return 'Programado';
      case 'PENDIENTE':
        return 'Pendiente';
      case 'FINALIZADO':
        return 'Finalizado';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return 'Sin estado';
    }
  }

  statusType(r: RutaResponseDto): 'scheduled' | 'confirmed' {
    if (r.estadoRuta === 'FINALIZADO' || r.estadoRuta === 'CANCELADO') {
      return 'confirmed';
    }
    return 'scheduled';
  }
}

