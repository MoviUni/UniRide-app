import { Component, OnInit, inject } from '@angular/core';
import { PasajeroService } from '@core/services/pasajero.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-perfil-pasajero',
  templateUrl: './perfil-pasajero.html',
  styleUrls: ['./perfil-pasajero.css']
})
export class PerfilPasajero implements OnInit {

  private pasajeroService = inject(PasajeroService);
  private auth = inject(AuthService);

  pasajero: any = null;

  ngOnInit(): void {
    const id = this.auth.getPasajeroId();
    if (!id) return;

    this.pasajeroService.getById(id).subscribe({
      next: (data) => this.pasajero = data,
      error: (err) => console.error(err)
    });
  }
}
