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
import { catchError, concat, concatMap, filter, forkJoin, from, Observable, of, switchMap, take, tap } from 'rxjs';
import { User } from '../../../users/models/user';
import { Course } from '../../../courses/models/course';
import { Store } from '@ngrx/store';
import { selectIsLoadingStudents, selectSingleStudent, selectStudents, selectStudentsError } from '../../store/student.selectors';
import { StudentActions } from '../../store/student.actions';
import { AlertsService } from '../../../../../core/services/sweetalert/alerts.service';
import { CourseActions } from '../../../courses/store/course.actions';

@Component({
  selector: 'app-crud-students',
  templateUrl: './crud-students.component.html',
  styleUrl: './crud-students.component.scss'
})
export class CrudStudentsComponent implements OnInit {

  authUser$: Observable<User | null>;
  students$: Observable<Student[]>;
  singleStudent$: Observable<Student>;
  isLoading$: Observable<boolean>;
  error$: Observable<unknown>;

  constructor(
    private matDialog: MatDialog,
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private inscriptionsService: InscriptionsService,
    private authService: AuthService,
    private store: Store,
    private alertService: AlertsService
  ) {
    this.authUser$ = this.authService.authUser$;
    this.students$ = this.store.select(selectStudents);
    this.singleStudent$ = this.store.select(selectSingleStudent);
    this.isLoading$ = this.store.select(selectIsLoadingStudents);
    this.error$ = this.store.select(selectStudentsError);
  }

  displayedColumns: string[] = ['id', 'name', 'surname', 'actions'];

  dataSource: Student[] = []

  isAdmin: boolean = false;

  ngOnInit(): void {
    this.store.dispatch(StudentActions.loadStudents());

    this.authService.authUser$.subscribe((user: User | null) => {
      this.isAdmin = user?.role === 'ADMIN';
    });
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(StudentsDialogComponent);

    dialogRef.componentInstance.onSubmitStudentEvent.subscribe({
      next: (student: Student) => {
        this.onSubmitStudent(student);
      },
      error: () => this.alertService.sendError('Error al abrir el form add de estudiantes')
    })
  }

  onSubmitStudent(student: Student): void {
    this.store.dispatch(StudentActions.addStudent({ data: student }))
  }

  deleteStudent(id: string): void {
    this.store.dispatch(StudentActions.studentById({ id }));

    this.singleStudent$.pipe(
      filter(student => !!student && student.id === id),
      take(1)
    ).subscribe(student => {

      const dialogRef = this.matDialog.open(DeleteDialogComponent, {
        data: {
          title: 'Eliminar Alumno',
          entityName: 'el alumno',
          item: student
        }
      });

      dialogRef.componentInstance.confirmDeleteEvent.subscribe(() => {
        if (student?.courses && student.courses.length > 0) {
          const deleteOperations = student.courses.map((courseId: string) => {
            return this.store.dispatch(StudentActions.unregisterStudent({ courseId, studentId: id }));
          });

          console.log(deleteOperations)

          forkJoin(deleteOperations).pipe(
            concatMap(() => {
              return of(this.store.dispatch(StudentActions.deleteStudent({ id })));
            }),
            tap(() => console.log("Eliminación completada"))
          ).subscribe();

        } else {
          this.store.dispatch(StudentActions.deleteStudent({ id }));
        }
      })
    });
  }

  editStudent(editingStudent: Student): void {
    this.store.dispatch(StudentActions.studentById({ id: editingStudent.id }));

    this.singleStudent$.pipe(
      filter(student => !!student && student.id === editingStudent.id),
      take(1)
    ).subscribe(student => {
      this.matDialog.open(StudentsDialogComponent, { data: editingStudent }).afterClosed().subscribe({
        next: (value) => {
          if (!!value) {
            this.store.dispatch(StudentActions.editStudent({ id: editingStudent.id, courses: student.courses, editingStudent: value }))
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

    dialogRef.componentInstance.confirmUnregistrationEvent.subscribe(({ courseId, studentId }) => {
      this.studentsService.unregisterStudent(courseId, studentId).subscribe(() => {
        this.coursesService.deleteStudentFromCourse(courseId, studentId).subscribe(() => {
          this.inscriptionsService.cancelInscription(courseId, studentId)
            .subscribe()
        })
      })
    })
  }

  openDetail(id: string): void {
    this.store.dispatch(StudentActions.studentById({ id }));

    this.singleStudent$.pipe(
      filter(student => !!student && student.id === id),
      take(1)
    ).subscribe(student => {
      if (student?.courses && student.courses.length > 0) {
        const courseObservable = student.courses.map((courseId: string) =>
          this.coursesService.getCourseById(courseId).pipe(
            catchError(() => of(null))
          )
        );
        forkJoin(courseObservable).subscribe(coursesList => {
          this.openDetailDialog(student, coursesList)
        });
      } else {
        this.openDetailDialog(student, []);
      }
    })

  }

}
