import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Student } from '../../models/student';
import { DeleteDialogComponent } from '../../../../../shared/components/delete-dialog/delete-dialog.component';
import { StudentsDialogComponent } from '../students-dialog/students-dialog.component';
import { DetailDialogComponent } from '../../../../../shared/components/detail-dialog/detail-dialog.component';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { filter, Observable, Subject, take, takeUntil } from 'rxjs';
import { User } from '../../../users/models/user';
import { Course } from '../../../courses/models/course';
import { Store } from '@ngrx/store';
import { selectCoursesStudent, selectIsLoadingStudents, selectSingleStudent, selectStudents, selectStudentsError } from '../../store/student.selectors';
import { StudentActions } from '../../store/student.actions';
import { AlertsService } from '../../../../../core/services/sweetalert/alerts.service';

@Component({
  selector: 'app-crud-students',
  templateUrl: './crud-students.component.html',
  styleUrl: './crud-students.component.scss'
})
export class CrudStudentsComponent implements OnInit, OnDestroy{

  private unsubscribe$ = new Subject<void>

  authUser$: Observable<User | null>;
  students$: Observable<Student[]>;
  coursesStudent$: Observable<Course[]>;
  singleStudent$: Observable<Student>;
  isLoading$: Observable<boolean>;
  error$: Observable<unknown>;

  constructor(
    private matDialog: MatDialog,
    private authService: AuthService,
    private store: Store,
    private alertService: AlertsService
  ) {
    this.authUser$ = this.authService.authUser$;
    this.students$ = this.store.select(selectStudents);
    this.coursesStudent$ = this.store.select(selectCoursesStudent);
    this.singleStudent$ = this.store.select(selectSingleStudent);
    this.isLoading$ = this.store.select(selectIsLoadingStudents);
    this.error$ = this.store.select(selectStudentsError);
  }

  displayedColumns: string[] = ['id', 'name', 'surname', 'actions'];

  dataSource: Student[] = []

  isAdmin: boolean = false;

  ngOnInit(): void {
    this.store.dispatch(StudentActions.loadStudents());

    this.authService.authUser$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((user: User | null) => {
      this.isAdmin = user?.role === 'ADMIN';
    });
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(StudentsDialogComponent);

    dialogRef.componentInstance.onSubmitStudentEvent.subscribe({
      next: (student: Student) => {
        this.onSubmitStudent(student);
      },
      error: () => this.alertService.sendError('Error al abrir el formulario de estudiantes')
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

      dialogRef.componentInstance.confirmDeleteEvent.subscribe({
        next: () => this.store.dispatch(StudentActions.deleteStudent({ id })),
        error: () => this.alertService.sendError('Error al confirmar la eliminación del estudiante')
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
            this.store.dispatch(StudentActions.editStudent({
              id: editingStudent.id, 
              courses: student.courses, 
              editingStudent: value 
            }))
          }
        },
        error: () => this.alertService.sendError('Error al editar estudiante')
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
      this.store.dispatch(StudentActions.unregisterStudent({ courseId, studentId }));
    })
  }

  openDetail(id: string): void {
    this.store.dispatch(StudentActions.studentById({ id }));

    this.store.dispatch(StudentActions.loadCoursesStudent({id}));

    this.singleStudent$.pipe(
      filter(student => !!student && student.id === id),
      take(1)
    ).subscribe(student => {
      if (student?.courses && student.courses.length > 0) {
        this.coursesStudent$.pipe(
          filter(courses => courses.length === student.courses.length),
          take(1)
        ).subscribe(courses => {
          this.openDetailDialog(student, courses);
        })
      } else {
        this.openDetailDialog(student, []);
      }
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
