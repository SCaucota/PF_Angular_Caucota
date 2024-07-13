import { AbstractControl } from "@angular/forms";

export function sinUnicamenteEspaciosValidator(control: AbstractControl) {
    if(control.value && control.value.trim().length === 0) {
        return{
            sinUnicamenteEspacios: true
        }
    }
    return null
}

export function sinEspaciosInicioValidator(control: AbstractControl) {
    if(control.value && control.value.trimLeft().length !== control.value.length){
        return{
            sinEspaciosInicio: true
        }
    }
    return null
}