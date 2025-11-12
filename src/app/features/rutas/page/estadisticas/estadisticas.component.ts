import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RutaService } from '../../../../core/services/ruta.service';
import { RutaFrecuenteResponseDTO } from '../../../../core/models/ruta.model';
import { ChangeDetectorRef } from '@angular/core'; // fuerza a Angular a detectar y renderizar los cambios inmediatamente

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  //====== TOTAL DE VIAJES ======
  totalViajes: number = 0; // Valor inicial 0

  constructor(private rutaService: RutaService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('ngOnInit ejecutado');
    const conductorId = 1; // ID hardcodeado para ejemplo
    this.obtenerTotalViajes(conductorId);
  }

  obtenerTotalViajes(conductorId: number): void {
    this.rutaService.getTotalViajes(conductorId).subscribe({
      next: (data) => {
        console.log('Respuesta recibida:', data);
        console.log('Respuesta del backend (total viajes):', data); // log para verificar
        this.totalViajes = data ?? 0; // Si es null o undefined, muestra 0
        this.cdr.detectChanges(); // Forzar detección de cambios
      },
      error: (err) => {
        console.error('Error al obtener el total de viajes', err);
        this.totalViajes = 0; // Si hay error, queda 0
      }
    });
  }

  //====== FRECUENCIA DE VIAJES ======
  rutasFrecuentes: RutaFrecuenteResponseDTO[] = [];

  obtenerRutasFrecuentes(conductorId: number): void {
    this.rutaService.getRutasMasFrecuentes(conductorId).subscribe({
      next: (data) => (this.rutasFrecuentes = data),
      error: (err) => {
        console.error('Error al obtener rutas frecuentes', err);
        this.rutasFrecuentes = [];
      },
    });

  //=========== RUTAS FRECUENTES ===========
  


  }
}
