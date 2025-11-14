import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutaService } from '../../../../core/services/ruta.service';
import { RutaResponse } from '@core/models/ruta.model';
import { ConductorService } from '@core/services/conductor.service';



@Component({
  selector: 'app-busqueda-rutas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="frame-427318940">
  <div class="mi_cuenta_contenido" >
    <div class="ruta-list-box">
    @if (loading()) {
      <p>Cargando rutas...</p>
    } @else if (rutas()) {
      @for (tx of rutas()!; track $index) {
      
        <div class="ruta-box1">
          <div class="rectangle1"></div>

          <div class="hoy_01"><span class="hoy_01_span">{{'Empieza en '+ diferenciaFechas(tx.fechaSalida) + ' días'}} </span></div>
          <div class="btn_solicitar">
            <input type="button" class="solicitarunirse_01" value="Solicitar Unirse">

          </div>
          <div class="conductor-text1"><span>{{getNombreConductorById(tx.idConductor)}}</span></div>

          <div class="origen-text-1">
            <span>{{tx.origen}}</span>
            <span> → </span>
            <span >{{tx.destino}}</span>
          </div>
          
          <div class="hora-salida1"><span>{{'Hora de salida: ' + tx.horaSalida}} </span></div>
          <div class="capacidad-text1"><span>{{'Capacidad: '+ tx.asientosDisponibles +' personas'}}</span></div>
          <div class="precio-text-1"><span>{{ 's/.' +tx.tarifa}}</span></div>


        </div>
        
      }
    }
      
    </div>

    <div class="frame-427318923"></div>
    <div class="inicio"><span class="inicio_span">Inicio</span></div>
    <div class="text-"><span class="fspan">></span></div>
    <div class="bsqueda-de-rutas"><span class="bsquedaderutas_span"> Búsqueda de rutas</span></div>

  </div>
  <div class="filtros_01">
    <div class="rectangle-186"></div>
    <div class="filtros"><span class="filtros_span">Filtros</span></div>

    <form [formGroup]="filterForm" class="filters-form">
      <div class="form-group">
        <label for="origen">Origen</label><br>
        <input 
        id="origen" 
        type="text" 
        placeholder="Ingresar origen" 
        formControlName="origen"
        class="form-control"
        > 
      </div>
      <br>
      <div class="form-group">
        <label for="destino">Destino</label><br>
        <input 
        id="destino" 
        type="text" 
        placeholder="Ingresar destino" 
        formControlName = "destino"
        class="form-control"
        > 
      </div>
      <br>
      <button type="button" class="btn" (click)="applyFilters()">Filtrar</button>

    </form>
  </div>
</div>
  
  `,
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaRutasComponent implements OnInit{


  private rutaService = inject(RutaService);
  private conductorService = inject(ConductorService);
  private fb = inject(FormBuilder);

  allRutas = signal<RutaResponse[]>([]);
  rutas = signal<RutaResponse[]>([]);
  loading = signal(true);

  filterForm: FormGroup = this.fb.group({
    origen: [''],
    destino: ['']
  });
  

   rutaName = this.conductorService.getById(1).subscribe({
      next: (conductor) => {
        return conductor.idConductor;
        
      },
      error: (error) => {
        console.error('Error buscando conductor por ID:', error);
        // Mostrar mensaje informativo en lugar de error
        this.errorMessage.set('No existen con este ID');
      }
    });
  
  errorMessage = signal('');

  ngOnInit() {
    this.loadRutas();
  }

  loadRutas() {
    this.rutaService.get().subscribe({
      next: (rutas) => {
        this.loading.set(false);
        this.rutas.set(rutas);
        this.allRutas.set(rutas);
        
      },
      error: (error) => {
        console.error('Error cargando rutas:', error);
        // Mostrar mensaje informativo en lugar de error
        this.errorMessage.set('No existen rutas bajo los filtros aplicados');
      }
    });

  }

  loadRutasByFilter(origen:string){
    this.rutaService.getByOrigen(origen).subscribe({
      next: (ruta) => {
        this.loading.set(false);
        this.rutas.set(ruta);
        
      },
      error: (error) => {
        console.error('Error cargando rutas:', error);
        // Mostrar mensaje informativo en lugar de error
        this.errorMessage.set('No existen rutas bajo los filtros aplicados');
      }
    });
  }

  diferenciaFechas(date1:string){
    const _date1 = new Date(date1);
    const time1 = _date1.getTime();
    const time2 = Date.now();
    const diffInMs = Math.abs(time2 - time1);
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  }

  getNombreConductorById(id:number){
    this.conductorService.getById(id).subscribe({
      next: (conductor) => {
        
        
      },
      error: (error) => {
        console.error('Error buscando conductor por ID:', error);
        // Mostrar mensaje informativo en lugar de error
        this.errorMessage.set('No existen con este ID');
      }
    });
  }

  applyFilters() {
    const origen = this.filterForm.value.origen;
    const destino = this.filterForm.value.destino;

    if (!origen && !destino) {
      this.rutas.set(this.allRutas());
      return;
    }

    const filtered = this.allRutas().filter(tx => {
      const txOrigen = tx.origen;
      const txDestino = tx.destino;

      if (origen && destino) {
        return txOrigen == origen && txDestino == destino;
      }
      if (origen) {
        return txOrigen == origen;
      }
      if (destino) {
        return txDestino == destino;
      }
      return true;
    });

    this.rutas.set(filtered);

  }

  reloadPage(){
    window.location.reload();
  }

}