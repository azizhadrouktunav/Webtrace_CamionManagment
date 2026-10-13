import { AbstractControl, ValidatorFn } from "@angular/forms";

// uniqueValidator(control: AbstractControl) {
//     const name = control.get('name').value;

//     if (control.get('name').valid) {
//       const isNameUnique = this.companies.map(company => company.name).some(value => value === name);

//       if (!isNameUnique) {
//         console.log(isNameUnique);
//         control.get('name').setErrors({unavailable: true});
//       }
//     }
//   }

  export function uniqueValidator<T>(arr: Array<T>) : ValidatorFn {
      return(control: AbstractControl) : { [key: string]: boolean} | null => {
          if(control.value !== undefined)  {
            const isNameUnique = arr.includes(control.value);
            if(isNameUnique) {
                return {unavailable: true}
            }
          }
          return null;
      };
  }