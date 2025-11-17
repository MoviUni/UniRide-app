import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-driver-vehicle',
  standalone: true,
  templateUrl: './register-driver-vehicle.html',
  styleUrl: './register-driver-vehicle.css',
  imports: [RouterModule, CommonModule, FormsModule]
})
export class RegisterDriverVehicle {
  constructor(private router: Router) {}

  goToNext() {
    this.router.navigate(['/auth/register/driver/account']); // página paso 2
  }
}
