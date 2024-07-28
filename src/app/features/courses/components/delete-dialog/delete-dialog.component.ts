import { Component, Output, Inject, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../../models/course';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent {
  @Output() deleteCourseEvent = new EventEmitter<any>();

  constructor(
    private matDialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public course: Course
  ){ }

  deleteCourse(): void {
    this.matDialogRef.close();
    this.deleteCourseEvent.emit(this.course);
  }
}
