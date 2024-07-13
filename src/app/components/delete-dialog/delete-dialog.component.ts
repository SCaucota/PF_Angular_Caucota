import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Alumno } from '../../models/alumno';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent {

  @Output() deleteAlumnoEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private matDialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public alumno: Alumno
  ) { }

  deleteAlumno(): void {
    this.matDialogRef.close();
    this.deleteAlumnoEvent.emit(this.alumno);
  }
}
