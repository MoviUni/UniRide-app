import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutaService } from '../../../../core/services/ruta.service';
import { RutaResponse } from '@core/models/ruta.model';

@Component({
  selector: 'app-busqueda-rutas',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="frame-427318940">
  <div class="mi_cuenta_contenido" >

    
    <div class="ruta-list-box">
    @if (loading()) {
      <p>Cargando transacciones...</p>
    } @else if (page()) {
      @for (tx of page()!; track $index) {
      
        <div class="ruta-box1">
          <div class="rectangle1"></div>
          <img class="star_05" src="https://placehold.co/19x31" />
          <img class="star_06" src="https://placehold.co/19x31" />
          <img class="star_07" src="https://placehold.co/19x31" />
          <img class="star_08" src="https://placehold.co/19x31" />
          <img class="star_09" src="https://placehold.co/19x31" />
          <div class="hoy_01"><span class="hoy_01_span">Hoy</span></div>
          <div class="btn_solicitar">
            <input type="button" class="solicitarunirse_01" value="Solicitar Unirse">

          </div>
          <div class="conductor-text1"><span>tx.</span></div>

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
    <div class="quitar"><span class="quitar_span">Quitar</span></div>
    <div class="origen"><span class="origen_span">Origen</span></div>
    <div class="destino"><span class="destino_span">Destino</span></div>
    <div class="da-de-salida"><span class="dadesalida_span">Día de salida</span></div>
    <div class="hoy_04"><span class="hoy_04_span">Hoy</span></div>
    <div class="maana"><span class="maana_span">Mañana</span></div>
    <div class="hora-de-salida"><span class="horadesalida_span">Hora de salida</span></div>
    <div class="line-44"></div>
    <img class="circle-point" src="https://placehold.co/26x26" />
    <div class="text-2-das-a-ms"><span class="fdasams_span">2 días a más</span></div>
    <img class="circle-point_01" src="https://placehold.co/26x26" />
    <img class="circle-point-checked" src="https://placehold.co/26x26" />
    <div class="antes-de-las-0600"><span class="antesdelas0600_span">Antes de las 06:00</span></div>
    <div class="text-0600---0900"><span class="f600-0900_span">06:00 - 09:00</span></div>
    <img class="circle-point_02" src="https://placehold.co/26x26" />
    <div class="text-0900---1200"><span class="f900-1200_span">09:00 - 12:00</span></div>
    <img class="circle-point_03" src="https://placehold.co/26x26" />
    <div class="text-1200---1500"><span class="f200-1500_span">12:00 - 15:00</span></div>
    <img class="circle-point_04" src="https://placehold.co/26x26" />
    <img class="circle-point-checked_01" src="https://placehold.co/26x26" />
    <div class="frame-61variant3">
      <input type="text" placeholder="Ingresar origen" class="filtro-text-origen"> 
    </div>
    <div class="frame-61variant3_01">
      <input type="text" placeholder="Ingresar destino" class="filtro-text-destino"> 
    </div>
    <div class="text-1500---1800"><span class="f500-1800_span">15:00 - 18:00</span></div>
    <img class="circle-point_05" src="https://placehold.co/26x26" />
  </div>
</div>
  
  `,
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaRutasComponent implements OnInit{


  private rutaService = inject(RutaService);

  page = signal<RutaResponse[]>([]);
  loading = signal(true);

  rutaName = signal(0);
  errorMessage = signal('');

  ngOnInit() {
    this.loadRutas();
  }

  loadRutas() {
    this.rutaService.get().subscribe({
      next: (ruta) => {
        this.rutaName.set(ruta.length);
        this.loading.set(false);
        this.page.set(ruta);
        
      },
      error: (error) => {
        console.error('Error cargando rutas:', error);
        // Mostrar mensaje informativo en lugar de error
        this.errorMessage.set('No existen rutas bajo los filtros aplicados');
      }
    });

  }
}