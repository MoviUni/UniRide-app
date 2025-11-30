import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ConductorService } from '@core/services/conductor.service';
import { AuthService } from '@core/services/auth.service';
import { VehiculoService } from '@core/services/vehiculo.service';

@Component({
  selector: 'app-perfil-conductor',
  templateUrl: './perfil-conductor.html',
  styleUrls: ['./perfil-conductor.css']
})
export class PerfilConductor implements OnInit {

  private conductorService = inject(ConductorService);
  private auth = inject(AuthService);
  private vehiculoService = inject(VehiculoService);
  private cdr = inject(ChangeDetectorRef);

  conductor: any = null;
  vehiculo: any = null;

  ngOnInit(): void {
    const id = this.auth.getConductorId();
    if (!id) return;

    this.conductorService.getById(id).subscribe({
      next: (data) => {
        this.conductor = data,
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
    
    this.vehiculoService.getVehiculoByConductor(id).subscribe({
      next: (data) => {
        this.vehiculo = data,
        this.cdr.detectChanges();
        console.log(data);
      },
      error: (err) => console.error(err)
    });

  }
}
