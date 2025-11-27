// src/app/features/rutas/page/publish-route/publish-route.component.ts

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
  RutaResponseDto,
  EstadoRuta
} from '../../../../core/services/routes.service';
import { AuthService } from '../../../../core/services/auth.service';
import { VehiculoService } from '../../../../core/services/vehiculo.service';

import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-publish-route',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publish-route.component.html',
  styleUrls: ['./publish-route.component.css'],
})
export class PublishRouteComponent implements OnInit {
  form!: FormGroup;

  // Si aún los usas en el HTML puedes dejarlos,
  // pero ahora los mensajes principales irán por toast.
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private routesService: RoutesService,
    private authService: AuthService,
    private vehiculoService: VehiculoService,
    private toast: ToastService,        // inyectamos toast
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      date: ['', Validators.required],    // <input type="date">
      time: ['', Validators.required],    // <input type="time">
      vehicle: ['', Validators.required], // solo visual
      capacity: [1, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.min(0)]],
    });

    const idConductor = this.authService.getConductorId();

    if (idConductor != null) {
      this.routesService.getMisRutas(idConductor).subscribe();
      this.loadVehicleData(idConductor);
    } else {
      console.warn('No se encontró ID de conductor en el usuario autenticado.');
      this.toast.show(
        'No se encontró un usuario autenticado para cargar tus rutas.',
        'error'
      );
    }
  }

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
      this.toast.show('Revisa los campos resaltados antes de publicar la ruta.', 'error');
      return;
    }

    const idConductor = this.authService.getConductorId();
    if (idConductor == null) {
      const msg = 'No se encontró un usuario autenticado para publicar la ruta.';
      this.errorMessage = msg;
      this.toast.show(msg, 'error');
      return;
    }

    const value = this.form.value as {
      origin: string;
      destination: string;
      date: string;   // 'YYYY-MM-DD'
      time: string;   // 'HH:mm'
      vehicle: string;
      capacity: number;
      price: number | null;
    };

    const departure = new Date(`${value.date}T${value.time}`);
    const now = new Date();
    if (departure <= now) {
      const msg = 'No se pueden publicar rutas con horarios pasados.';
      this.errorMessage = msg;
      this.toast.show(msg, 'error');
      return;
    }

    if (value.capacity < 1) {
      const msg = 'Cada ruta debe tener al menos 1 asiento disponible.';
      this.errorMessage = msg;
      this.toast.show(msg, 'error');
      return;
    }

    const existentes = this.routesService.rutas();
    const duplicada = existentes.some((r: RutaResponseDto) =>
      r.origen.trim().toLowerCase() === value.origin.trim().toLowerCase() &&
      r.destino.trim().toLowerCase() === value.destination.trim().toLowerCase() &&
      r.fechaSalida === value.date &&
      r.horaSalida === value.time
    );

    if (duplicada) {
      const msg = 'Ya publicaste una ruta con el mismo origen, destino, fecha y hora.';
      this.errorMessage = msg;
      this.toast.show(msg, 'warning');
      return;
    }

    const dto: RutaRequestDto = {
      origen: value.origin,
      destino: value.destination,
      fechaSalida: value.date,          // LocalDate en backend
      horaSalida: value.time,           // LocalTime en backend
      tarifa: value.price ?? undefined, // Float (nullable)
      asientosDisponibles: value.capacity,
      estadoRuta: 'PROGRAMADO',         // Estado inicial
      conductorId: idConductor,
    };

    this.routesService.publicar(dto).subscribe({
      next: () => {
        this.successMessage = 'Ruta publicada correctamente.';
        //this.toast.show('Ruta publicada correctamente.', 'success');

        this.form.reset({
          origin: '',
          destination: '',
          date: '',
          time: '',
          vehicle: '',
          capacity: 1,
          price: null,
        });

        // Opcional: refrescar lista de rutas en memoria
        this.routesService.getMisRutas(idConductor).subscribe();
      },
      error: (err: unknown) => {
        console.error(err);
        const msg = 'Ocurrió un error al publicar la ruta.';
        this.errorMessage = msg;
        this.toast.show(
          (err as any)?.error?.message ?? msg,
          'error'
        );
      },
    });
  }

  private loadVehicleData(idConductor: number): void {
    this.vehiculoService.getVehiculoByConductor(idConductor).subscribe({
      next: (vehiculo) => {
        const descripcion = `${vehiculo.marca} ${vehiculo.modelo}`.trim();

        this.form.patchValue({
          vehicle: descripcion,
          capacity: vehiculo.capacidad ?? 1,
        });
      },
      error: (err) => {
        console.warn('No se pudo cargar el vehículo del conductor', err);
        this.toast.show(
          'No se pudo cargar automáticamente la información de tu vehículo.',
          'info'
        );
      }
    });
  }
}
