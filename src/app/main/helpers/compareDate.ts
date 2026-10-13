import { FormGroup } from "@angular/forms";

/** 
 * Compares two Date objects and returns e number value that represents 
 * the result:
 * 0 if the two dates are equal.
 * 1 if the first date is greater than second.
 * -1 if the first date is less than second.
 * @param date1 First date object to compare.
 * @param date2 Second date object to compare.
 */
export function  compareDate(date1: Date, date2: Date): number
{
  // With Date object we can compare dates them using the >, <, <= or >=.
  // The ==, !=, ===, and !== operators require to use date.getTime(),
  // so we need to create a new instance of Date with 'new Date()'
  let d1 = new Date(date1); let d2 = new Date(date2);
  d1.setHours(0,0,0,0);
  d2.setHours(0,0,0,0);
  // Check if the dates are equal
  let same = d1.getTime() === d2.getTime();
  if (same) return 0;

  // Check if the first is greater than second
  if (d1 > d2) return 1;
 
  // Check if the first is less than second
  if (d1 < d2) return -1;
}
export function DateMoreThan(controlName: string, thanControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const thanControl = formGroup.controls[thanControlName];

    if (control.errors && !control.errors.mustBeMoreThan) {
      return;
    }

    const diffTime = Math.abs(control.value - thanControl.value);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    if (diffDays > 31) {
      control.setErrors({ mustBeMoreThan: true });
    } else {
      control.setErrors(null);
    }
  }
}
