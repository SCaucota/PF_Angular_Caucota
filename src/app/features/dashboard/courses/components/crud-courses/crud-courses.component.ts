import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CoursesService } from '../../../../../core/services/courses/courses.service';
import { StudentsService } from '../../../../../core/services/students/students.service';
import { CoursesDialogComponent } from '../courses-dialog/courses-dialog.component';
import { DeleteDialogComponent } from '../../../../../shared/components/delete-dialog/delete-dialog.component';
import { Course } from '../../models/course';
import { DetailDialogComponent } from '../../../../../shared/components/detail-dialog/detail-dialog.component';
import { InscriptionsService } from '../../../../../core/services/inscriptions/inscriptions.service';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { catchError, forkJoin, Observable, of, switchMap, tap } from 'rxjs';
import { User } from '../../../users/models/user';
import { Student } from '../../../students/models/student';

@Component({
  selector: 'app-crud-courses',
  templateUrl: './crud-courses.component.html',
  styleUrl: './crud-courses.component.scss'
})
export class CrudCoursesComponent implements OnInit {

  authUser$: Observable<User | null>

  constructor(
    private matDialog: MatDialog,
    private coursesService: CoursesService,
    private studentsService: StudentsService,
    private inscriptionService: InscriptionsService,
    private authService: AuthService
  ) {
    this.authUser$ = this.authService.authUser$;
  }

  displayedColumns: string[] = ['id', 'name', 'description', 'startDate', 'endDate', 'time', 'actions'];

  dataSource: Course[] = [];

  isAdmin: boolean = false;

  loadCourses() {
    this.coursesService.getCourses().subscribe({
      next: (coursesFormDb) => {
        this.dataSource = [...coursesFormDb]
      },
      error: (err) => console.log("Error al cargar los cursos: ", err)
    })
  }

  ngOnInit(): void {
    this.loadCourses();
    this.authService.authUser$.subscribe((user: User | null) => {
      this.isAdmin = user?.role === 'ADMIN';
    });
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(CoursesDialogComponent);

    dialogRef.componentInstance.onSubmitCourseEvent.subscribe((course: Course) => {
      this.onSubmitCourse(course)
    })
  }

  onSubmitCourse(course: Course): void {
    this.coursesService.addCourse(course).pipe(
      tap(() => this.loadCourses())
    ).subscribe();
  }

  deleteCourse(id: string): void {
    this.coursesService.getCourseById(id).subscribe(course => {
  
      const dialogRef = this.matDialog.open(DeleteDialogComponent, {
        data: {
          title: 'Eliminar Curso',
          entityName: 'el curso',
          item: course
        }
      });
  
      dialogRef.componentInstance.confirmDeleteEvent.subscribe(() => {
        if(course?.students && course.students.length > 0) {
          const deleteOperations = course.students.map((studentId: string) => {
            return this.coursesService.deleteStudentFromCourse(id, studentId).pipe(
              switchMap(() => this.studentsService.unregisterStudent(id, studentId)),
              switchMap(() => this.inscriptionService.cancelInscription(id, studentId))
            )
          });

          forkJoin(deleteOperations).pipe(
            switchMap(() => this.coursesService.deleteCourse(id)),
            tap(() => this.loadCourses())
          ).subscribe();
        }else {
          this.coursesService.deleteCourse(id).pipe(
            tap(() => this.loadCourses())
          ).subscribe()
        }
      });
    });
  }


  editCourse(editingCourse: Course): void {
    this.coursesService.getCourseById(editingCourse.id).subscribe(course => {
      this.matDialog.open(CoursesDialogComponent, { data: editingCourse }).afterClosed().subscribe({
        next: (value) => {
          if (!!value) {
            this.coursesService.editCourse(editingCourse.id, value, course.students)
              .pipe(tap(() => this.loadCourses()))
              .subscribe();
          }
        },
        error: (err) => console.log("Error al editar el curso: ", err)
      })
    });
  }

  openDetailDialog(course: Course, students: (Student | null)[]): void {
    const dialogRef = this.matDialog.open(DetailDialogComponent, {
      data: {
        title: 'Detalles del curso',
        item: course,
        subitem: students
      }
    })

    dialogRef.componentInstance.confirmUnregistrationEvent.subscribe(({ courseId, studentId }) => {
      this.coursesService.deleteStudentFromCourse(courseId, studentId).subscribe(() => {
        this.studentsService.unregisterStudent(courseId, studentId).subscribe(() => {
          this.inscriptionService.cancelInscription(courseId, studentId)
          .pipe(
            tap(() => this.loadCourses())
          )
          .subscribe()
        })
      })
    })
  }

  openDetail(id: string): void {
    this.coursesService.getCourseById(id).subscribe(course => {
      if (course?.students && course?.students.length !== 0) {
        const studentObservables = course.students.map((studentId: string) =>
          this.studentsService.getStudentById(studentId).pipe(
            catchError(() => of(null))
          )
        );
        forkJoin(studentObservables).subscribe(studentsList => {
          this.openDetailDialog(course, studentsList)
        });
      } else {
        this.openDetailDialog(course, []);
      }
    });
  }
}
