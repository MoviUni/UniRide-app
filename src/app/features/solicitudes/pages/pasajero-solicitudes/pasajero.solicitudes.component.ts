import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudService } from '@core/services/solicitud.service';
import { EstadoSolicitud, SolicitudCardResponse, SolicitudViajeRequest } from '@core/models/solicitud.model';
import { RutaService } from '@core/services/ruta.service';
import { RutaResponse } from '@core/models/ruta.model';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

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
    } @else if (solicitudes()) {
      @if(solicitudes().length == 0){
          <div class="rectangle2">
            <span class="sin-texto"> No tienes solicitudes de viaje registradas...</span>
            <img class="sin-imagen" src="assets/history.png" />
          </div>
          
        }
      @else{
        @for (tx of solicitudes()!; track $index) {
          @if (tx.estadoSolicitud === "CANCELADO"){
            <div class="ruta-box1">
              <div class="rectangle1"></div>

              <div class="hoy_01"><span class="hoy_01_span">{{'Empieza en '+ diferenciaFechas(tx.fechaSalida) + ' días'}} </span></div>
              
              <div class= "estado-btn" [ngStyle]="{'background-color': getColor($index)}"> {{tx.estadoSolicitud}}</div>
              
              <div class="cancelar-btn"></div>
              
              <div class="origen-text-1">
              <span>{{tx.origen}}</span>
              <span> → </span>
              <span >{{tx.destino}}</span>
              </div>
              
              <div class="hora-salida1"><span>{{'Hora de salida: ' + tx.horaSalida}} </span></div>
              <div class="capacidad-text1"><span>{{'Capacidad personas: '+ tx.asientosDisponibles}}</span></div>
              <div class="precio-text-1"><span>{{ 's/.' + tx.tarifa}}</span></div>
              <div class="conductor-text1"><span>{{tx.nombreConductor + ' ' + tx.apellidoConductor}}</span></div>
              <img class="image-conductor" src="assets/ConductorLogo.png" />
              </div>
          }
          @else{
            <div class="ruta-box1">
              <div class="rectangle1"></div>

              <div class="hoy_01"><span class="hoy_01_span">{{'Empieza en '+ diferenciaFechas(tx.fechaSalida) + ' días'}} </span></div>
              <div class= "estado-btn" [ngStyle]="{'background-color': getColor($index)}"> {{tx.estadoSolicitud}}</div>

              <div class="cancelar-btn">
                <button type="button" class="cancelar" (click)="cancelarSolicitud(tx)">Cancelar Solicitud</button>
              </div>

              <div class="origen-text-1">
                <span>{{tx.origen}}</span>
                <span> → </span>
                <span >{{tx.destino}}</span>
              </div>
              
              <div class="hora-salida1"><span>{{'Hora de salida: ' + tx.horaSalida}} </span></div>
              <div class="capacidad-text1"><span>{{'Capacidad personas: '+ tx.asientosDisponibles}}</span></div>
              <div class="precio-text-1"><span>{{ 's/.' + tx.tarifa}}</span></div>
              <div class="conductor-text1"><span>{{tx.nombreConductor + ' ' + tx.apellidoConductor}}</span></div>
              <img class="image-conductor" src="assets/ConductorLogo.png" />
            </div>
          }
            
        }
      }
    } 
    
      
    </div>

    <div class="frame-427318923"></div>
    <div class="inicio"><a routerLink='/main/pasajero' class="inicio_span">Inicio</a></div>
    <div class="text-"><span class="fspan">></span></div>
    <div class="bsqueda-de-rutas"><span class="bsquedaderutas_span"> Mis solicitudes</span></div>
    

  </div>
  
</div>
  
  `,
  styleUrls: ['./pasajero.solicitudes.component.css']
})
export class PasajeroSolicitudesComponent implements OnInit {

  constructor(
    private solicitudService: SolicitudService, 
    private cdr: ChangeDetectorRef,
    private authService: AuthService) {}
    


    errorMessage = signal('');
    allSolicitudes = signal<SolicitudCardResponse[]>([]);
    solicitudes = signal<SolicitudCardResponse[]>([]);
    rutas = signal<RutaResponse[]>([]);
    loading = signal(true);
    loadingRutas = signal(true);


    ngOnInit() {
      const pasajeroId = this.authService.getPasajeroId();

      if (!pasajeroId) {
      console.error('Usuario no autenticado');
      return;}
      this.loadSolicitudes(pasajeroId);
    }

    
    loadSolicitudes(pasajeroId:number) {
      console.log("cantidad de solicitudes: ",this.solicitudes.length);
      this.solicitudService.getInfo(pasajeroId).subscribe({
      next: (solicitudes) => {
          this.loading.set(false);
          this.solicitudes.set(solicitudes);
          this.allSolicitudes.set(solicitudes);
          console.log("Cargando solicitudes de pasajero ",pasajeroId, " tiene solicitudes: ", this.solicitudes().length);
      },
      error: (error) => {
          console.error('Error cargando solicitudes:', error);
          // Mostrar mensaje informativo en lugar de error
          this.errorMessage.set('No existen solicitudes para este usuario');
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

    
    diferenciaFechas(date1:string){
        const _date1 = new Date(date1);
        const time1 = _date1.getTime();
        const time2 = Date.now();
        const diffInMs = Math.abs(time2 - time1);
        return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    }

    cancelarSolicitud(solicitud:SolicitudCardResponse){
      this.solicitudService.cancelSolicitud(solicitud.idSolicitudViaje).subscribe({
        next: () => {
          
          alert("Solicitud se ha cancelado de manera exitosa");
          window.location.reload();
        },
        error: (error) => {
            alert('Error cancelando la solicitud: ' + error);
            // Mostrar mensaje informativo en lugar de error
            this.errorMessage.set('No se ha podido cancelar la solicitud');
        }
        });
    }

}