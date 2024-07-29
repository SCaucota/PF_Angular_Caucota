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