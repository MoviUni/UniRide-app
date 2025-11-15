import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudService } from '@core/services/solicitud.service';
import { SolicitudViajeResponse } from '@core/models/solicitud.model';
import { RutaService } from '@core/services/ruta.service';
import { RutaResponse } from '@core/models/ruta.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pasajero-solicitudes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <div class="frame-427318940">
  <p class ="title-sol"> Solicitudes realizadas </p>
  <div class="mi_cuenta_contenido" >
    <div class="ruta-list-box">
    @if (loading()) {
      <p>Cargando solicitudes...</p>
    } @else if (solicitudes() && rutas()) {
        @for (tx of rutas()!; track $index) {
            <div class="ruta-box1">
              <div class="rectangle1"></div>

              <div class="hoy_01"><span class="hoy_01_span">{{'Empieza en '+ diferenciaFechas(tx.fechaSalida) + ' días'}} </span></div>
              <div class= "estado-btn" [ngStyle]="{'background-color': getColor($index)}"> {{solicitudes()[$index].estadoSolicitud}}</div>

              <div class="cancelar-btn">
                <button type="button" class="cancelar" >Cancelar Solicitud</button>
              </div>

              <div class="origen-text-1">
                <span>{{tx.origen}}</span>
                <span> → </span>
                <span >{{tx.destino}}</span>
              </div>
              
              <div class="hora-salida1"><span>{{'Hora de salida: ' + tx.horaSalida}} </span></div>
              <div class="capacidad-text1"><span>{{'Capacidad personas: '+ tx.asientosDisponibles}}</span></div>
              <div class="precio-text-1"><span>{{ 's/.' + tx.tarifa}}</span></div>
            </div>
        }
      } 
    
      
    </div>

    <div class="frame-427318923"></div>
    <div class="inicio"><a routerLink='rutas' class="inicio_span">Inicio</a></div>
    <div class="text-"><span class="fspan">></span></div>
    <div class="bsqueda-de-rutas"><span class="bsquedaderutas_span"> Mis solicitudes</span></div>
    

  </div>
  
</div>
  
  `,
  styleUrls: ['./pasajero.solicitudes.component.css']
})
export class PasajeroSolicitudesComponent implements OnInit {

    private solicitudService = inject(SolicitudService);
    private rutaService = inject(RutaService);

    errorMessage = signal('');
    allSolicitudes = signal<SolicitudViajeResponse[]>([]);
    solicitudes = signal<SolicitudViajeResponse[]>([]);
    rutas = signal<RutaResponse[]>([]);
    
    loading = signal(true);
    loadingRutas = signal(true);

    ngOnInit() {
        this.loadSolicitudes();
    }

    pasajeroId = 1;

    loadSolicitudes() {
        this.solicitudService.getByPasajero(this.pasajeroId).subscribe({
        next: (solicitudes) => {
            this.loading.set(false);
            this.solicitudes.set(solicitudes);
            this.getDatosRuta(this.solicitudes());
            this.allSolicitudes.set(solicitudes);
            
        },
        error: (error) => {
            console.error('Error cargando rutas:', error);
            // Mostrar mensaje informativo en lugar de error
            this.errorMessage.set('No existen rutas bajo los filtros aplicados');
        }
        });
    }

    getColor(i:number):string{
      if(!this.solicitudes())return 'gray';

      if(this.solicitudes()[i].estadoSolicitud === 'PENDIENTE')
        return 'gray';
      if(this.solicitudes()[i].estadoSolicitud === 'ACEPTADO')
        return 'green';
      if(this.solicitudes()[i].estadoSolicitud === 'RECHAZADO')
        return 'black';
      if(this.solicitudes()[i].estadoSolicitud === 'CANCELADO')
        return 'red';
      return 'gray';
      
    }

    getDatosRuta (sols:SolicitudViajeResponse[]){
      let arr = [];
      for (let i = 0; i < sols.length; i++) {
        this.rutaService.getById(sols[i].rutaId).subscribe({
        next: (ruta) => {
          this.rutas.update((currentArray) => [...currentArray, ruta]);
          this.loadingRutas.set(false);
            
        },
        error: (error) => {
            console.error('Error buscando ruta por ID:', error);
            // Mostrar mensaje informativo en lugar de error
            this.errorMessage.set('No existen con este ID');
            
        }
        });
      }
    };
    
    diferenciaFechas(date1:string){
        const _date1 = new Date(date1);
        const time1 = _date1.getTime();
        const time2 = Date.now();
        const diffInMs = Math.abs(time2 - time1);
        return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    }

}