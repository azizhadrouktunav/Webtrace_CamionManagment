import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function integer(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const error: ValidationErrors = { integer: true };

    if (control.value && control.value !== `${parseInt(control.value, 10)}`) {
      control.setErrors(error);
      return error;
    }

    control.setErrors(null);
    return null;
  };
}
