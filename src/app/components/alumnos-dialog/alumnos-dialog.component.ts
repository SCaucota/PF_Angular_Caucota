import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Alumno } from '../../models/alumno';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { sinUnicamenteEspaciosValidator,  sinEspaciosInicioValidator} from '../../utils/custom.validators';

@Component({
  selector: 'app-alumnos-dialog',
  templateUrl: './alumnos-dialog.component.html',
  styleUrl: './alumnos-dialog.component.scss'
})
export class AlumnosDialogComponent {

  alumnoForm: FormGroup;

  @Input() alumno!: Alumno
  @Output() onSubmitAlumnoEvent: EventEmitter<any> = new EventEmitter();

  nombreValidatorPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<AlumnosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editingAlumno?: Alumno
  ) {
    this.alumnoForm = this.fb.group({
      nombre: ['',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(this.nombreValidatorPattern),
            sinUnicamenteEspaciosValidator,
            sinEspaciosInicioValidator
          ],
        }
      ],
      apellido: ['',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(this.nombreValidatorPattern),
            sinUnicamenteEspaciosValidator,
            sinEspaciosInicioValidator
          ]
        }
      ]
    })

    if(this.editingAlumno){
      this.alumnoForm.patchValue(this.editingAlumno)
    }
  }

  get nombreControl() {
    return this.alumnoForm.get('nombre')
  }

  get nombreControlInvalid() {
    return (
      this.nombreControl?.invalid &&
      (this.nombreControl?.touched ||
      this.nombreControl?.dirty)
    )
  }

  get apellidoControl() {
    return this.alumnoForm.get('apellido')
  }

  get apellidoControlInvalid() {
    return (
      this.apellidoControl?.invalid &&
      (this.apellidoControl?.touched ||
      this.apellidoControl?.dirty)
    )
  }

  onSubmitAlumno(): void {
    if(this.alumnoForm.invalid){
      alert('Formulario invalido')
    }else{
      console.log(this.alumnoForm.value)
      this.matDialogRef.close(this.alumnoForm.value);
      this.onSubmitAlumnoEvent.emit(this.alumnoForm.value)
    }
  }
}
