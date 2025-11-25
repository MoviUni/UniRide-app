import { Injectable, signal } from '@angular/core';

export interface DriverStepData {
  nombres: string;
  apellidos: string;
  edad: string;
  dni: string;
}

export interface DriverAccountData {
  codigo: string;
  email: string;
  password: string;
  password2: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterDriverStateService {
  private _driverData = signal<DriverStepData | null>(null);
  private _accountData = signal<DriverAccountData | null>(null);

  // setters
  setDriverData(data: DriverStepData): void {
    this._driverData.set(data);
  }

  setAccountData(data: DriverAccountData): void {
    this._accountData.set(data);
  }

  // getters
  getDriverData(): DriverStepData | null {
    return this._driverData();
  }

  getAccountData(): DriverAccountData | null {
    return this._accountData();
  }

  clear(): void {
    this._driverData.set(null);
    this._accountData.set(null);
  }
}
