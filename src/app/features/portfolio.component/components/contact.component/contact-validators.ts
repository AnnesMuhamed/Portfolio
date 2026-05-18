import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Pflichtfeld nach trim(): Nur-Leerzeichen / leer → required.
 * Danach Mindestlänge auf trim()-Ergebnis (nie Rohdaten).
 */
export function trimmedMinLength(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const t = String(control.value ?? '').trim();
    if (t.length === 0) {
      return { required: true };
    }
    if (t.length < min) {
      return { minlength: { requiredLength: min, actualLength: t.length } };
    }
    return null;
  };
}

/**
 * Pflicht + E-Mail-Format nach trim(): mind. local@domain.tld (Domain mit Punkt).
 */
export function trimmedEmail(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const t = String(control.value ?? '').trim();
    if (t.length === 0) {
      return { required: true };
    }
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
    return ok ? null : { email: true };
  };
}
