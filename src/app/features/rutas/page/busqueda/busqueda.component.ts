import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutaService } from '../../../../core/services/ruta.service';

@Component({
  selector: 'app-busqueda-rutas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaRutasComponent implements OnInit{

  private rutaService = inject(RutaService);

  rutaName = signal("");
  errorMessage = signal('');

  ngOnInit() {
    this.loadRutas();
  }

  loadRutas() {
    this.rutaService.get().subscribe({
      next: (ruta) => {
        this.rutaName.set(ruta[0].origen);
        
      },
      error: (error) => {
        console.error('Error cargando rutas:', error);
        // Mostrar mensaje informativo en lugar de error
        this.errorMessage.set('No existen rutas bajo los filtros aplicados');
      }
    });
  }
}