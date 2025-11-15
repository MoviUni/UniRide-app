import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { RegisterPassenger } from './pages/register-passenger/register-passenger';
import { RegisterPassengerAccount } from './pages/register-passenger-account/register-passenger-account';
import { RegisterDriver } from './pages/register-driver/register-driver/register-driver';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'register/passenger', component: RegisterPassenger },
  { path: 'register/passenger/account', component: RegisterPassengerAccount },
  { path: 'register/driver', component: RegisterDriver }
];
