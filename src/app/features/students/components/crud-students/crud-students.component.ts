import { Component, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Student } from '../../models/student';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { StudentsDialogComponent } from '../students-dialog/students-dialog.component';

@Component({
  selector: 'app-crud-students',
  templateUrl: './crud-students.component.html',
  styleUrl: './crud-students.component.scss'
})
export class CrudStudentsComponent {

  @Input() listStudents: Student[] = [];

  @Output() arrayStudents = new EventEmitter<Student[]>();

  constructor(private matDialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.matDialog.open(StudentsDialogComponent);

    dialogRef.componentInstance.onSubmitStudentEvent.subscribe((student: Student) => {
      this.onSubmitStudent(student);
    })
  }

  onSubmitStudent(student: Student): void{
    const maxId = Math.max(...this.listStudents.map(a => +a.id));
    const newId = (maxId + 1).toString();

    const { id, ...rest } = student;
    const newAlumno: Student = { id: newId, name: rest.name.toUpperCase(), surname: rest.surname.toUpperCase() };

    this.listStudents = [...this.listStudents, newAlumno];

    this.studentsUpdateList();
  }

  deleteStudent(id: string): void {
    const student = this.listStudents.find(student => student.id === id);
    const dialogRef = this.matDialog.open(DeleteDialogComponent, {data: student});
    
    dialogRef.componentInstance.deleteStudentEvent.subscribe((student: Student) => {
      this.listStudents = this.listStudents.filter(student => student.id !== id);
      this.studentsUpdateList();
    })
  }

  updateStudent(editingStudent: Student): void{
    this.matDialog.open(StudentsDialogComponent, {data: editingStudent}).afterClosed().subscribe({
      next: (value) => {
        if(!!value){
          this.listStudents = this.listStudents.map((element) => element.id === editingStudent.id ? {id: editingStudent.id, name: value.name.toUpperCase(), surname: value.surname.toUpperCase()}: element)
          this.studentsUpdateList();
        }
      }
    })
  }

  studentsUpdateList(): void{
    this.arrayStudents.emit(this.listStudents);
  }
}
