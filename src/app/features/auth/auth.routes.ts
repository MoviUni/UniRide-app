import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { RegisterPassenger } from './pages/register-passenger/register-passenger';
import { RegisterPassengerAccount } from './pages/register-passenger-account/register-passenger-account';
import { RegisterDriver } from './pages/register-driver/register-driver';
import { RegisterDriverVehicle } from './pages/register-driver-vehicle/register-driver-vehicle';
import { RegisterDriverAccount } from './pages/register-driver-account/register-driver-account';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'register/passenger', component: RegisterPassenger },
  { path: 'register/passenger/account', component: RegisterPassengerAccount },
  { path: 'register/driver', component: RegisterDriver },
  { path: 'register/driver/vehicle', component: RegisterDriverVehicle },
  { path: 'register/driver/account', component: RegisterDriverAccount }
];
