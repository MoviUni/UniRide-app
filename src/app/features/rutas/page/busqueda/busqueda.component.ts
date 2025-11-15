import { Component, ElementRef, Inject, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RutaService } from '../../../../core/services/ruta.service';
import { RutaResponse } from '@core/models/ruta.model';
import { ConductorService } from '@core/services/conductor.service';
import { SolicitudService } from '@core/services/solicitud.service';
import { EstadoSolicitud, SolicitudViajeRequest, SolicitudViajeResponse } from '@core/models/solicitud.model';



@Component({
  selector: 'app-busqueda-rutas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
  <div *ngIf="showSolicitudForm" class="solicitud-exitosa">
    <div class="rectangle-form"></div>
    <div class="form-content">
      <p class="big-text-form"> !La solicitud ha sido enviada con éxito!</p>
      <br>
      <p class="small-text-form"> Revisa los detalles de tus viajes</p>
      <br>
      <input class = "sol-button-form" type="button" value="Ver mis solicitudes">
      <br>

      <button type="button" class = "cerrar-text-form" (click)="closeForm()">Continuar viendo las rutas</button>
    </div>
  </div>

  <div *ngIf="showErrorForm" class="solicitud-error">
    <div class="rectangle-form"></div>
    <div class="form-content">
      <p class="big-text-form"> Ha ocurrido un error al enviar la solictud.</p>
      <br>
      <button type="button" class = "cerrar-text-form" (click)="closeErrorForm()">Continuar viendo las rutas</button>
    </div>
  </div>

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

            <button type="button" class="solicitarunirse_01" (click)="sendForm(tx)">Solicitar Unirse</button>

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
    <div class="inicio"><a routerLink='rutas' class="inicio_span">Inicio</a></div>
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
      <div class="form-group">
        <label for="fecha">Fecha</label><br>
        <div>
          <label>
            <input type="radio" 
            id="fecha1" 
            name="fecha" 
            value="Hoy"
            formControlName = "fecha">
            Hoy
          </label>
        </div>
        <div>
          <label>
            <input type="radio" 
            id="fecha2" 
            name="fecha"
            value="Mañana"
            formControlName = "fecha" 
             >
             Mañana
          </label>
        </div>
        <div>
         <label>
            <input type="radio" 
            id="fecha3"
            name="fecha" 
            value="En 1 semana"
            formControlName = "fecha"checked>
            En 1 semana
          </label>
        </div>
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
  private solicitudService = inject(SolicitudService);
  private fb = inject(FormBuilder);

  showSolicitudForm = false;
  showErrorForm = false;

  allRutas = signal<RutaResponse[]>([]);
  rutas = signal<RutaResponse[]>([]);
  loading = signal(true);

  filterForm: FormGroup = this.fb.group({
    origen: [''],
    destino: [''],
    dia:[''],
    fecha:[''],
    
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
    const fecha = this.filterForm.value.fecha;

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
    }).filter(tx=>{
      const txFecha = this.diferenciaFechas(tx.fechaSalida);
      if(fecha == 'Hoy'){
        return txFecha <= 1;
      }
      if(fecha == 'Mañana'){
        return txFecha == 2;
      }
      if(fecha == 'En 1 semana'){
        return txFecha > 4;
      }
      return true;
    });

    this.rutas.set(filtered);

  }

  reloadPage(){
    window.location.reload();
  }

  closeForm(){
    this.showSolicitudForm = false;
  }
  closeErrorForm(){
    this.showErrorForm = false;
  }

  openForm(){
    this.showSolicitudForm = true;
  }

  openErrorForm(){
    this.showErrorForm = true;
    
  }

  sendForm(dt:RutaResponse){

    this.registerForm(dt)
  }

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  registerForm(dt:RutaResponse){
    const currentDate = formatDate(new Date(), 'yyyy-MM-dd', this.locale);
    const currentTime= new Date().toLocaleTimeString();

    const solicitudReq: SolicitudViajeRequest = {
      estadoSolicitud: EstadoSolicitud.PENDIENTE,
      fecha: currentDate,
      hora: currentTime,
      pasajeroId: 2,
      rutaId: dt.idRuta,
      updatedAt: currentDate
    };

     this.solicitudService.create(solicitudReq).subscribe({
        complete: () =>{
          this.openForm();
          console.error('Exito creando solicitud');
        },
        next: () => {
          
          
        },
        error: (error) => {
          this.openErrorForm();
          console.error('Error creando solicitud de viaje:');
          this.errorMessage.set('Ha ocurrido un error solicitando unirse a este viaje.');
        }
      }); 


    
  }

}