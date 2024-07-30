import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Student } from '../../models/student';
import { DeleteDialogComponent } from '../../../../../shared/components/delete-dialog/delete-dialog.component';
import { StudentsDialogComponent } from '../students-dialog/students-dialog.component';
import { StudentsService } from '../../../../../core/services/students/students.service';
import { CoursesService } from '../../../../../core/services/courses/courses.service';
import { DetailDialogComponent } from '../../../../../shared/components/detail-dialog/detail-dialog.component';
import { InscriptionsService } from '../../../../../core/services/inscriptions/inscriptions.service';

@Component({
  selector: 'app-crud-students',
  templateUrl: './crud-students.component.html',
  styleUrl: './crud-students.component.scss'
})
export class CrudStudentsComponent implements OnInit{

  constructor(
    private matDialog: MatDialog,
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private inscriptionsService: InscriptionsService
  ) { }

  displayedColumns: string[] = ['id', 'name', 'surname', 'actions', 'detail'];

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
    const student = this.studentsService.getStudentById(id);

    if(student?.courses && student.courses.length > 0){
      student.courses.forEach((courseId: string) => {
        this.coursesService.deleteStudentFromCourse(courseId, id);
        this.studentsService.unregisterStudent(courseId, id);
        this.inscriptionsService.cancelInscription(courseId, id)
      })
    }

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
          this.studentsService.editStudent( editingStudent.id, editingStudent.courses,value);        
          this.loadStudents();
        }
      }
    })
  }

  openDetail(id: string): void{
    const student = this.studentsService.getStudentById(id);
    const courses = student?.courses.map((courseId: string) => {
      return this.coursesService.getCourseById(courseId)
    });
    const dialogRef = this.matDialog.open(DetailDialogComponent, {
      data: {
        title: 'Detalles del Alumno',
        item: student,
        subitem: courses
      }
    });

    dialogRef.componentInstance.confirmUnregistrationEvent.subscribe(({courseId, studentId}) => {
      this.studentsService.unregisterStudent(courseId, studentId);
      this.coursesService.deleteStudentFromCourse(courseId, studentId);
      this.inscriptionsService.cancelInscription(courseId, studentId)
      this.loadStudents();
    })
  }

}
