import { Injectable, signal } from '@angular/core';

export interface PassengerData {
  nombres: string;
  apellidos: string;
  telefono: string;
  dni: string;
}

export interface PassengerAccountData {
  codigo: string;
  email: string;
  password: string;
  password2: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterPassengerStateService {
  private _data = signal<PassengerData | null>(null);
  private _account = signal<PassengerAccountData | null>(null);

  setPassengerData(data: PassengerData): void {
    this._data.set(data);
  }

  setAccountData(data: PassengerAccountData): void {
    this._account.set(data);
  }

  getPassengerData(): PassengerData | null {
    return this._data();
  }

  getAccountData(): PassengerAccountData | null {
    return this._account();
  }

  clear(): void {
    this._data.set(null);
    this._account.set(null);
  }
}
