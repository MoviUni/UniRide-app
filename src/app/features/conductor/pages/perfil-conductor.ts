import { Component, OnInit, inject } from '@angular/core';
import { ConductorService } from '@core/services/conductor.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-perfil-conductor',
  templateUrl: './perfil-conductor.html',
  styleUrls: ['./perfil-conductor.css']
})
export class PerfilConductor implements OnInit {

  private conductorService = inject(ConductorService);
  private auth = inject(AuthService);

  conductor: any = null;

  ngOnInit(): void {
    const id = this.auth.getConductorId();
    if (!id) return;

    this.conductorService.getById(id).subscribe({
      next: (data) => this.conductor = data,
      error: (err) => console.error(err)
    });
  }
}
