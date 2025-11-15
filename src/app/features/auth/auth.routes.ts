import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { RegisterPassenger } from './pages/register-passenger/register-passenger';
import { RegisterPassengerAccount } from './pages/register-passenger-account/register-passenger-account';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'register/passenger', component: RegisterPassenger },
  { path: 'register/passenger/account', component: RegisterPassengerAccount }
];
