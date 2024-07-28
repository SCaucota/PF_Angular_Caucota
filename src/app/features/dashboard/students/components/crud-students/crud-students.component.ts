import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Student } from '../../models/student';
import { DeleteDialogComponent } from '../../../../../shared/components/delete-dialog/delete-dialog/delete-dialog.component';
import { StudentsDialogComponent } from '../students-dialog/students-dialog.component';
import { StudentsService } from '../../../../../core/services/students/students.service';
import { isEntityName } from 'typescript';

@Component({
  selector: 'app-crud-students',
  templateUrl: './crud-students.component.html',
  styleUrl: './crud-students.component.scss'
})
export class CrudStudentsComponent implements OnInit{

  constructor(private matDialog: MatDialog, private studentsService: StudentsService) { }

  displayedColumns: string[] = ['id', 'name', 'surname', 'actions'];

  dataSource: Student[] = []

  loadStudents() {
    this.studentsService.getStudents().subscribe({
      next: (studentsFormDb) => {
        this.dataSource = studentsFormDb
      }
    })
  }

  ngOnInit(): void {
   this.loadStudents()
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(StudentsDialogComponent);

    dialogRef.componentInstance.onSubmitStudentEvent.subscribe((student: Student) => {
      this.onSubmitStudent(student);
    })
  }

  onSubmitStudent(student: Student): void{
    this.studentsService.addStudent(student);
    this.loadStudents()
  }

  deleteStudent(id: string): void {
    const student = this.studentsService.getStudentById(id)
    const dialogRef = this.matDialog.open(DeleteDialogComponent, {
      data: {
        title: 'Eliminar Alumno',
        entityName: 'el alumno',
        item: student
      }
    });
    
    dialogRef.componentInstance.confirmDeleteEvent.subscribe((student: Student) => {
      this.studentsService.deleteStudent(id);
      this.loadStudents()
    })
  }

  editStudent(editingStudent: Student): void{
    this.matDialog.open(StudentsDialogComponent, {data: editingStudent}).afterClosed().subscribe({
      next: (value) => {
        if(!!value){
          this.studentsService.editStudent( editingStudent.id, value);        
          this.loadStudents();
        }
      }
    })
  }

}
