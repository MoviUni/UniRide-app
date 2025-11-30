import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { PasajeroService } from '@core/services/pasajero.service';
import { AuthService } from '@core/services/auth.service';
import { CurrentUser } from '@core/models/usuario.model';

@Component({
  selector: 'app-perfil-pasajero',
  templateUrl: './perfil-pasajero.html',
  styleUrls: ['./perfil-pasajero.css']
})
export class PerfilPasajero implements OnInit {

  private pasajeroService = inject(PasajeroService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  pasajero: any = null;
  email: any = null;

  ngOnInit(): void {
    const id = this.auth.getPasajeroId();
    if (!id) return;

    this.pasajeroService.getById(id).subscribe({
      next: (data) => {
        this.pasajero = data,
        this.cdr.detectChanges();},
      error: (err) => console.error(err)
    });
  }

}
