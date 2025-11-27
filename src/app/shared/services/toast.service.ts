import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

@Injectable({ providedIn: 'root' })
export class ToastService {

  toast = signal<{ message: string, type: ToastType } | null>(null);

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info')
 {
    this.toast.set({ message, type });

    setTimeout(() => {
      this.toast.set(null);
    }, 3500);
  }
}
