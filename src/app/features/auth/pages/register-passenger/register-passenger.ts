import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-passenger',
  standalone: true,
  templateUrl: './register-passenger.html',
  styleUrl: './register-passenger.css',
  imports: [RouterModule, CommonModule, FormsModule]
})
export class RegisterPassenger {

  constructor(private router: Router) {}

  goToNext() {
    this.router.navigate(['/auth/register/passenger/account']); // página paso 2
  }
}
