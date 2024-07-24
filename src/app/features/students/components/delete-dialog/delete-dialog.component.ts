import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Student } from '../../models/student';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent {
  @Output() deleteStudentEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private matDialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public student: Student
  ) { }

  deleteStudent(): void {
    this.matDialogRef.close();
    this.deleteStudentEvent.emit(this.student);
  }
}
