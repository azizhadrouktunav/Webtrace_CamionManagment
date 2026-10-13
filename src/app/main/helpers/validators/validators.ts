import { AbstractControl, ValidatorFn } from '@angular/forms';

export  class Validators_ {

    static positiveNumberValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
          const isNotOk = Number(control.value) <= 0;
          return isNotOk ? { nonPositive: { value: control.value } } : null;
        };
   }
  }

   export function dayDiff(d1:Date, d2:Date)
   {
     var diff = Math.abs(d1.getTime() - d2.getTime());
     var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
     return diffDays;
   }

   export function showSnackBar(msg,_snackBar) {
    _snackBar.open(msg, '' , {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
    
  }