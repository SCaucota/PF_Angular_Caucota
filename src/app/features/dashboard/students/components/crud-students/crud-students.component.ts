import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Student } from '../../models/student';
import { DeleteDialogComponent } from '../../../../../shared/components/delete-dialog/delete-dialog.component';
import { StudentsDialogComponent } from '../students-dialog/students-dialog.component';
import { StudentsService } from '../../../../../core/services/students/students.service';
import { CoursesService } from '../../../../../core/services/courses/courses.service';
import { DetailDialogComponent } from '../../../../../shared/components/detail-dialog/detail-dialog.component';
import { InscriptionsService } from '../../../../../core/services/inscriptions/inscriptions.service';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { catchError, forkJoin, Observable, of, switchMap, tap } from 'rxjs';
import { User } from '../../../users/models/user';
import { Course } from '../../../courses/models/course';

@Component({
  selector: 'app-crud-students',
  templateUrl: './crud-students.component.html',
  styleUrl: './crud-students.component.scss'
})
export class CrudStudentsComponent implements OnInit{

  authUser$: Observable<User | null>

  constructor(
    private matDialog: MatDialog,
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private inscriptionsService: InscriptionsService,
    private authService: AuthService
  ) { 
    this.authUser$ = this.authService.authUser$;
  }

  displayedColumns: string[] = ['id', 'name', 'surname', 'actions'];

  dataSource: Student[] = []

  isAdmin: boolean = false;

  loadStudents() {
    this.studentsService.getStudents().subscribe({
      next: (studentsFormDb) => {
        this.dataSource = studentsFormDb
      },
      error: (err) => console.log("Error al cargar los estudiantes: ", err)
    })
  }

  ngOnInit(): void {
   this.loadStudents();
   this.authService.authUser$.subscribe((user: User | null) => {
    this.isAdmin = user?.role === 'ADMIN';
  });
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(StudentsDialogComponent);

    dialogRef.componentInstance.onSubmitStudentEvent.subscribe((student: Student) => {
      this.onSubmitStudent(student);
    })
  }

  onSubmitStudent(student: Student): void{
    this.studentsService.addStudent(student).pipe(
      tap(() => this.loadStudents())
    ).subscribe();
  }

  deleteStudent(id: string): void {
    this.studentsService.getStudentById(id).subscribe(student => {
  
      const dialogRef = this.matDialog.open(DeleteDialogComponent, {
        data: {
          title: 'Eliminar Alumno',
          entityName: 'el alumno',
          item: student
        }
      });
      
      dialogRef.componentInstance.confirmDeleteEvent.subscribe(() => {
        if(student?.courses && student.courses.length > 0) {
          const deleteOperations = student.courses.map((courseId: string) => {
            return this.studentsService.unregisterStudent(courseId, id).pipe(
              switchMap(() => this.coursesService.deleteStudentFromCourse(courseId, id)),
              switchMap(() => this.inscriptionsService.cancelInscription(courseId, id))
            )
          });
          forkJoin(deleteOperations).pipe(
            switchMap(() => this.studentsService.deleteStudent(id)),
            tap(() => this.loadStudents())
          ).subscribe();
        }else {
          this.studentsService.deleteStudent(id).pipe(
            tap(() => this.loadStudents())
          ).subscribe();
        }
      })

    });
  }

  editStudent(editingStudent: Student): void{
    this.studentsService.getStudentById(editingStudent.id).subscribe(student => {
      this.matDialog.open(StudentsDialogComponent, {data: editingStudent}).afterClosed().subscribe({
        next: (value) => {
          if(!!value){
            this.studentsService.editStudent( editingStudent.id, student.courses, value)
            .pipe(tap(() => this.loadStudents()))
            .subscribe();
          }
        },
        error: (err) => console.log("Error al editar el estudiante: ", err)
      })
    })
  }

  openDetailDialog(student: Student, courses: (Course | null)[]): void {
    const dialogRef = this.matDialog.open(DetailDialogComponent, {
      data: {
        title: 'Detalles del Alumno',
        item: student,
        subitem: courses
      }
    });

    dialogRef.componentInstance.confirmUnregistrationEvent.subscribe(({courseId, studentId}) => {
      this.studentsService.unregisterStudent(courseId, studentId).subscribe(() => {
        this.coursesService.deleteStudentFromCourse(courseId, studentId).subscribe(() => {
          this.inscriptionsService.cancelInscription(courseId, studentId)
          .pipe(
            tap(() => this.loadStudents())
          )
          .subscribe()
        })
      })
    })
  }

  openDetail(id: string): void{
    this.studentsService.getStudentById(id).subscribe(student => {
      if(student?.courses && student.courses.length > 0) {
        const courseObservable = student.courses.map((courseId: string) =>
          this.coursesService.getCourseById(courseId).pipe(
            catchError(() => of(null))
          )
        );
        forkJoin(courseObservable).subscribe(coursesList => {
          this.openDetailDialog(student, coursesList)
        });
      }else {
        this.openDetailDialog(student, []);
      }
    })
    
  }

}
