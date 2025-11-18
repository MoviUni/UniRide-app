import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-driver-account',
  standalone: true,
  templateUrl: './register-driver-account.html',
  styleUrl: './register-driver-account.css',
  imports: [RouterModule, CommonModule, FormsModule]
})
export class RegisterDriverAccount {
  constructor(private router: Router) {}

  goToNext() {
    this.router.navigate(['/auth/register/driver/vehicle']); // página paso 2
  }
}
