import { AbstractControl, ValidationErrors } from '@angular/forms';

export class AuthValidators {

  static email(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return { required: true };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : { email: true };
  }

  static password(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return { required: true };

    return value.length >= 6 ? null : { minLength: true };
  }

}
