import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alumnos-dialog',
  templateUrl: './alumnos-dialog.component.html',
  styleUrl: './alumnos-dialog.component.scss'
})
export class AlumnosDialogComponent {

  alumnoForm: FormGroup;

  @Output() onSubmitAlumnoEvent: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder, private matDialogRef: MatDialogRef<AlumnosDialogComponent>) {
    this.alumnoForm = this.fb.group({
      nombre: '',
      apellido: ''
    })
  }
  onSubmitAlumno(): void {
    console.log(this.alumnoForm.value)
    this.matDialogRef.close(this.alumnoForm.value);
    this.onSubmitAlumnoEvent.emit(this.alumnoForm.value)
  }
}
