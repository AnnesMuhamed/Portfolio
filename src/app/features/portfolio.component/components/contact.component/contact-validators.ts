import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates a required trimmed value with a minimum length.
 * @param min Minimum number of characters.
 * @returns Angular validator function.
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
 * Validates a required trimmed email value.
 * @returns Angular validator function.
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
