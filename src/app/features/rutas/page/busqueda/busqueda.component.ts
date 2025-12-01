import { ChangeDetectorRef, Component, Inject, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RutaService } from '../../../../core/services/ruta.service';
import { RutaCardResponse } from '@core/models/ruta.model';
import { SolicitudService } from '@core/services/solicitud.service';
import { EstadoSolicitud, SolicitudViajeRequest } from '@core/models/solicitud.model';
import { AuthService } from '@core/services/auth.service';



@Component({
  selector: 'app-busqueda-rutas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `

  <div class="frame-427318940">

  <div class="mi_cuenta_contenido" >
    <div class="ruta-list-box">
    @if (loading()) {
      <p>Cargando rutas...</p>
    } @else if (rutas()) {
      @if(rutas().length == 0){
          <div class="rectangle2">
            <span class="sin-texto"> No se pudieron encontraron rutas... Prueba con otros filtros</span>
            <img class="sin-imagen" src="assets/auto_icon.png" />
          </div>
          
        }
      @else{
          @for (tx of rutas()!; track $index) {

        <button class="ruta-box1" (click)="mostrarMensaje(tx)">
          <div class="rectangle1"></div>

          <div class="hoy_01"><span class="hoy_01_span">{{'Empieza en '+ diferenciaFechas(tx.fechaSalida, tx.horaSalida)}} </span></div>
          <div class="btn_solicitar">

            

          </div>
          <div class="conductor-text1"><span>{{tx.nombreConductor + ' ' + tx.apellidoConductor}}</span></div>
          
          <div class="origen-text-1">
          <span>{{tx.origen}}</span>
          <span> → </span>
          <span >{{tx.destino}}</span>
          </div>
          
          <div class="hora-salida1"><span>{{'Hora de salida: ' + tx.horaSalida}} </span></div>
          <div class="capacidad-text1"><span>{{'Capacidad: '+ tx.asientosDisponibles +' personas'}}</span></div>
          <div class="precio-text-1"><span>{{ 's/.' +tx.tarifa}}</span></div>
          
          <img class="image-conductor" src="assets/ConductorLogo.png" />

        </button>
        <button type="button" class="solicitarunirse_01" (click)="sendForm(tx)">Solicitar Unirse</button>
        
      }
        }
    }
      
    </div>

    <div class="frame-427318923"></div>
    <div class="inicio"><a routerLink='/main/pasajero' class="inicio_span">Inicio</a></div>
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
      
      <div class="form-group">
        <label for="hora">Hora</label><br>
        <div>
          <label>
            <input type="radio" 
            id="hora0" 
            name="hora"
            value="Cualquier"
            formControlName = "hora" 
             >
             Cualquiera
          </label>
        </div>
        <div>
          <label>
            <input type="radio" 
            id="hora1" 
            name="hora"
            value="06:00 - 09:00"
            formControlName = "hora" 
             >
             06:00 - 09:00
          </label>
        </div>
        <div>
         <label>
            <input type="radio" 
            id="hora2"
            name="hora" 
            value="09:00 - 12:00"
            formControlName = "hora"checked>
            09:00 - 12:00
          </label>
        </div>
        <div>
         <label>
            <input type="radio" 
            id="hora3"
            name="hora" 
            value="12:00 - 15:00"
            formControlName = "hora"checked>
            12:00 - 15:00
          </label>
        </div>
        <div>
         <label>
            <input type="radio" 
            id="hora4"
            name="hora" 
            value="15:00 - 18:00"
            formControlName = "hora"checked>
            15:00 - 18:00
          </label>
        </div>
        <div>
         <label>
            <input type="radio" 
            id="hora5"
            name="hora" 
            value="18:00 - 21:00"
            formControlName = "hora"checked>
            18:00 - 21:00
          </label>
        </div>
        <div>
         <label>
            <input type="radio" 
            id="hora6"
            name="hora" 
            value="21:00<"
            formControlName = "hora"checked>
            21:00<
          </label>
        </div>
      </div>
      <br>
      <button type="button" class="btn" (click)="applyFilters()">Filtrar</button>
      <button type="button" class="btn-clear" (click)="clearFilters()">Quitar filtros</button>

    </form>
  </div>
</div>
  @if (mostrarPopup) {
  <div class="popup-overlay">
    <div class="popup-box">
      <div class="popup-close" (click)="mostrarPopup = false">x</div>

      <p class="popup-message">{{ mensajePopup }}</p>
      <div class="rectangle-trayecto">

        <p class="popup-section"> Información del trayecto </p>
        
        <p class="popup-info">{{ "Origen y destino: " + rutaDetails()[0].origen + " -> " + rutaDetails()[0].destino}}</p>
        
        <p class="popup-info">{{"Hora y fecha de salida: " + rutaDetails()[0].horaSalida + " " + rutaDetails()[0].fechaSalida}}</p>
        
        <p class="popup-info">{{ "Precio: s/." + rutaDetails()[0].tarifa}}</p>

        <p class="popup-info">{{ "Capacidad de pasajeros: " + rutaDetails()[0].asientosDisponibles}}</p>
        <img class="trayectoria-img" src="assets/calendar.png" />
      </div>
      <div class="rectangle-conductor">
        <p class="popup-section"> Información sobre el conductor </p>

        <p class="popup-info">{{ "Nombre y apellido: " + rutaDetails()[0].nombreConductor + " " + rutaDetails()[0].apellidoConductor}}</p>

        <p class="popup-section"> Información sobre el vehículo </p>

        <p class="popup-info">{{ "Modelo: " +rutaDetails()[0].vehiculoModelo}}</p>
        <p class="popup-info">{{ "Color: " + rutaDetails()[0].vehiculoColor}}</p>
        <p class="popup-info">{{ "Placa: "+ rutaDetails()[0].vehiculoPlaca}}</p>
        <img class="veh-img" src="assets/search.png" />
      </div>

    </div>
  </div>
}
  @if (mostrarExitoso) {
    <div class="popup-ex-overlay">
      <div class="popup-ex-box">
        <div class="popup-ex-close" (click)="cerrarExito()">x</div>

        <p class="popup-ex-message"> ¡La solicitud ha sido enviada de manera exitosa! </p>
        <img class="trayectoria-ex-img" src="assets/check_mark.png" />

      </div>
    </div>
  }

  `,
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaRutasComponent implements OnInit{
  private rutaService = inject(RutaService);
  private solicitudService = inject(SolicitudService);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  allRutas = signal<RutaCardResponse[]>([]);
  rutas = signal<RutaCardResponse[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  // Popup de detalles
  mensajePopup: string = '';
  mostrarPopup: boolean = false;
  rutaDetails = signal<RutaCardResponse[]>([]);

  // Popup de éxito
  mostrarExitoso: boolean = false;

  filterForm: FormGroup = this.fb.group({
    origen: [''],
    destino: [''],
    hora: [''],
    fecha: [''],
  });

  ngOnInit() {
    const pasajeroId = this.authService.getPasajeroId();

    if (!pasajeroId) {
      console.error('Usuario no autenticado');
      this.errorMessage.set('Usuario no autenticado');
      this.loading.set(false);
      return;
    }
    
    this.loadRutas(pasajeroId);
  }

  loadRutas(pasajeroId: number) {
    this.loading.set(true);
    this.errorMessage.set('');
    
    this.rutaService.getInfo(pasajeroId).subscribe({
      next: (rutas) => {
        console.log('Rutas cargadas desde backend:', rutas);
        this.allRutas.set(rutas);
        this.rutas.set(rutas);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error cargando rutas:', error);
        this.errorMessage.set('Error al cargar las rutas disponibles');
        this.loading.set(false);
        this.rutas.set([]);
        this.allRutas.set([]);
      }
    });
  }

  cerrarPopup() {
    this.mensajePopup = '';
    this.mostrarPopup = false;
  }

  mostrarMensaje(dt:RutaCardResponse){
    this.mensajePopup = 'Detalles de la ruta';
    this.mostrarPopup = true;
    this.rutaDetails.set([dt]);
  }

  mostrarExito() {
    this.mostrarPopup = false;
    this.mostrarExitoso = true;
    this.cdr.detectChanges();
  }

  cerrarExito() {
    this.mostrarExitoso = false;
    this.cdr.detectChanges();
    
    // Recargar rutas en lugar de toda la página
    const pasajeroId = this.authService.getPasajeroId();
    if (pasajeroId) {
      this.loadRutas(pasajeroId);
    }
  }

  diferenciaFechas(date1: string, hour1: string): string {
    const ahora = Date.now();
    const fechaSalida = new Date(date1 + 'T' + hour1);
    const diffInMs = fechaSalida.getTime() - ahora;
    
    if (diffInMs < 0) {
      return 'ya pasó';
    }
    
    const minutos = Math.floor(diffInMs / (1000 * 60));
    const horas = Math.floor(diffInMs / (1000 * 60 * 60));
    const dias = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (dias > 0) {
      return dias === 1 ? '1 día' : `${dias} días`;
    }
    if (horas > 0) {
      return horas === 1 ? '1 hora' : `${horas} horas`;
    }
    if (minutos > 0) {
      return minutos === 1 ? '1 minuto' : `${minutos} minutos`;
    }
    
    return 'pronto';
  }

  diferenciaFechas2(date1: string): number {
    const fecha = new Date(date1);
    const ahora = new Date();
    
    // Resetear las horas para comparar solo fechas
    fecha.setHours(0, 0, 0, 0);
    ahora.setHours(0, 0, 0, 0);
    
    const diffInMs = fecha.getTime() - ahora.getTime();
    const dias = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    
    return dias;
  }

  clearFilters() {
    this.filterForm.reset({
      origen: '',
      destino: '',
      hora: '',
      fecha: ''
    });
    this.rutas.set(this.allRutas());
  }

  applyFilters() {
    const origen = this.filterForm.value.origen?.trim().toLowerCase();
    const destino = this.filterForm.value.destino?.trim().toLowerCase();
    const fecha = this.filterForm.value.fecha;
    const hora = this.filterForm.value.hora;

    let filtered = this.allRutas();

    // Filtro por origen y destino
    if (origen || destino) {
      filtered = filtered.filter(tx => {
        const matchOrigen = !origen || tx.origen.toLowerCase().includes(origen);
        const matchDestino = !destino || tx.destino.toLowerCase().includes(destino);
        return matchOrigen && matchDestino;
      });
    }

    // Filtro por fecha
    if (fecha) {
      filtered = filtered.filter(tx => {
        const diasDiferencia = this.diferenciaFechas2(tx.fechaSalida);
        
        if (fecha === 'Hoy') {
          return diasDiferencia <= 1;
        }
        if (fecha === 'Mañana') {
          return diasDiferencia >= 1 && diasDiferencia <= 2;
        }
        if (fecha === 'En 1 semana') {
          return diasDiferencia <= 7;
        }
        return true;
      });
    }

    // Filtro por hora
    if (hora && hora !== 'Cualquier') {
      filtered = filtered.filter(tx => {
        const horaSalida = tx.horaSalida; // Formato "HH:mm:ss"
        const [hours] = horaSalida.split(':').map(Number);
        
        if (hora === '06:00 - 09:00') return hours >= 6 && hours < 9;
        if (hora === '09:00 - 12:00') return hours >= 9 && hours < 12;
        if (hora === '12:00 - 15:00') return hours >= 12 && hours < 15;
        if (hora === '15:00 - 18:00') return hours >= 15 && hours < 18;
        if (hora === '18:00 - 21:00') return hours >= 18 && hours < 21;
        if (hora === '21:00<') return hours >= 21;
        
        return true;
      });
    }

    this.rutas.set(filtered);
    console.log('Filtros aplicados. Resultados:', filtered.length);
  }

  sendForm(dt: RutaCardResponse) {
    const pasajeroId = this.authService.getPasajeroId();
    
    if (!pasajeroId) {
      alert('Debes iniciar sesión como pasajero para solicitar unirse a un viaje');
      return;
    }

    // Confirmar antes de enviar
    if (!confirm(`¿Deseas solicitar unirse al viaje de ${dt.origen} → ${dt.destino}?`)) {
      return;
    }

    this.registerForm(dt, pasajeroId);
  }

  registerForm(dt: RutaCardResponse, pasajeroId: number) {
    const currentDate = formatDate(new Date(), 'yyyy-MM-dd', this.locale);
    const currentTime = new Date().toLocaleTimeString('es-PE', { hour12: false });
    
    const solicitudReq: SolicitudViajeRequest = {
      estadoSolicitud: EstadoSolicitud.PENDIENTE,
      fecha: currentDate,
      hora: currentTime,
      pasajeroId: pasajeroId,
      rutaId: dt.idRuta,
      updatedAt: currentDate
    };

    console.log('Enviando solicitud:', solicitudReq);

    this.solicitudService.create(solicitudReq).subscribe({
      next: (response) => {
        console.log('Solicitud creada exitosamente:', response);
        this.mostrarExito();
      },
      error: (error) => {
        console.error('Error creando solicitud:', error);
        
        let mensajeError = 'Ha ocurrido un error al solicitar unirse a este viaje.';
        
        if (error.status === 400) {
          mensajeError = 'Ya tienes una solicitud pendiente para este viaje.';
        } else if (error.status === 404) {
          mensajeError = 'La ruta no está disponible.';
        } else if (error.error?.message) {
          mensajeError = error.error.message;
        }
        
        alert(mensajeError);
      }
    });
  }

}