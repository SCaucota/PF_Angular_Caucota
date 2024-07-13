import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Alumno } from '../../models/alumno';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alumnos-dialog',
  templateUrl: './alumnos-dialog.component.html',
  styleUrl: './alumnos-dialog.component.scss'
})
export class AlumnosDialogComponent {

  alumnoForm: FormGroup;

  @Input() alumno!: Alumno
  @Input() dialogAddAlumno!: boolean
  @Output() onSubmitAlumnoEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<AlumnosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editingAlumno?: Alumno
  ) {
    this.alumnoForm = this.fb.group({
      nombre: '',
      apellido: ''
    })

    console.log('Se está editando: ', editingAlumno);

    if(this.editingAlumno){
      this.alumnoForm.patchValue(this.editingAlumno)
    }
  }

  onSubmitAlumno(): void {
    console.log(this.alumnoForm.value)
    this.matDialogRef.close(this.alumnoForm.value);
    this.onSubmitAlumnoEvent.emit(this.alumnoForm.value)
    
  }
}
