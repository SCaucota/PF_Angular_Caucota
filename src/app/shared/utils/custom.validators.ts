import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noOnlySpacesValidator(control: AbstractControl) {
    if(control.value && control.value.trim().length === 0) {
        return{
            noOnlySpaces: true
        }
    }
    return null
}

export function noLeadingSpacesValidator(control: AbstractControl) {
    if(control.value && control.value.trimLeft().length !== control.value.length){
        return{
            noLeadingSpaces: true
        }
    }
    return null
}

export function dateRangeValidator(minDate: Date | null, maxDate: Date | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
  
      const date = new Date(value);
      if (minDate && maxDate && (date < minDate || date > maxDate)) {
        return { dateRange: true };
      }
      return null;
    };
}