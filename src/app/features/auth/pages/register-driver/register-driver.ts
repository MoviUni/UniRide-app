import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-driver',
  standalone: true,
  templateUrl: './register-driver.html',
  styleUrl: './register-driver.css',
  imports: [RouterModule, CommonModule, FormsModule]
})
export class RegisterDriver {

  constructor(private router: Router) {}

  goToNext() {
    this.router.navigate(['/auth/register/driver/vehicle']); // página paso 2
  }
}
