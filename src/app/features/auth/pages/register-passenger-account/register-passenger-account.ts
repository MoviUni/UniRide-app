import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-passenger-account',
  standalone: true,
  templateUrl: './register-passenger-account.html',
  styleUrl: './register-passenger-account.css',
  imports: [RouterModule, CommonModule, FormsModule]
})
export class RegisterPassengerAccount {

  codigo = '';
  email = '';
  password = '';
  password2 = '';

  constructor(private router: Router) {}

  createAccount() {
    // Más adelante aquí llamaremos a tu AuthService
    console.log("Cuenta creada");
  }
}
