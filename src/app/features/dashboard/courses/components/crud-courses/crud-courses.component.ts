import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CoursesService } from '../../../../../core/services/courses/courses.service';
import { StudentsService } from '../../../../../core/services/students/students.service';
import { CoursesDialogComponent } from '../courses-dialog/courses-dialog.component';
import { DeleteDialogComponent } from '../../../../../shared/components/delete-dialog/delete-dialog.component';
import { Course } from '../../models/course';
import { DetailDialogComponent } from '../../../../../shared/components/detail-dialog/detail-dialog.component';
import { InscriptionsService } from '../../../../../core/services/inscriptions/inscriptions.service';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { catchError, filter, forkJoin, map, Observable, of, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { User } from '../../../users/models/user';
import { Student } from '../../../students/models/student';
import { select, Store } from '@ngrx/store';
import { selectCourses, selectCoursesError, selectIsLoadingCourses, selectSingleCourse, selectStudentsForm } from '../../store/course.selectors';
import { CourseActions } from '../../store/course.actions';
import { AlertsService } from '../../../../../core/services/sweetalert/alerts.service';

@Component({
  selector: 'app-crud-courses',
  templateUrl: './crud-courses.component.html',
  styleUrl: './crud-courses.component.scss'
})
export class CrudCoursesComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  courses$: Observable<Course[]>;
  studentsCourse$: Observable<Student[]>;
  singleCourse$: Observable<Course>;
  authUser$: Observable<User | null>;
  error$: Observable<unknown>;
  isLoading$: Observable<boolean>;

  constructor(
    private matDialog: MatDialog,
    private authService: AuthService,
    private alertsService: AlertsService,
    private store: Store
  ) {
    this.authUser$ = this.authService.authUser$;
    this.courses$ = this.store.select(selectCourses);
    this.studentsCourse$ = this.store.select(selectStudentsForm);
    this.singleCourse$ = this.store.select(selectSingleCourse);
    this.error$ = this.store.select(selectCoursesError);
    this.isLoading$ = this.store.select(selectIsLoadingCourses);
  }

  displayedColumns: string[] = ['id', 'name', 'description', 'startDate', 'endDate', 'time', 'actions'];

  dataSource: Course[] = [];

  isAdmin: boolean = false;

  ngOnInit(): void {
    this.store.dispatch(CourseActions.loadCourses());

    this.authService.authUser$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((user: User | null) => {
      this.isAdmin = user?.role === 'ADMIN';
    });
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(CoursesDialogComponent);

    dialogRef.componentInstance.onSubmitCourseEvent.subscribe({
      next: (course: Course) => {
        this.onSubmitCourse(course);
      },
      error: () => this.alertsService.sendError('Error al abrir el formulario de cursos')
    })
  }

  onSubmitCourse(course: Course): void {
    this.store.dispatch(CourseActions.addCourse({ data: course }));
  }

  deleteCourse(id: string): void {
    this.store.dispatch(CourseActions.courseById({ id }));

    this.singleCourse$.pipe(
      filter((course) => !!course && course.id === id),
      take(1)
    ).subscribe(course => {
  
      const dialogRef = this.matDialog.open(DeleteDialogComponent, {
        data: {
          title: 'Eliminar Curso',
          entityName: 'el curso',
          item: course
        }
      });
  
      dialogRef.componentInstance.confirmDeleteEvent.subscribe({
        next: () => this.store.dispatch(CourseActions.deleteCourse({ id })),
        error: () => this.alertsService.sendError('Error al confirmar la eliminación del curso')
      });
    });
  }


  editCourse(editingCourse: Course): void {
    this.store.dispatch(CourseActions.courseById({ id: editingCourse.id}));

    this.singleCourse$.pipe(
      filter(course => !!course && course.id === editingCourse.id),
      take(1)
    ).subscribe(course => {
      this.matDialog.open(CoursesDialogComponent, { data: editingCourse }).afterClosed().subscribe({
        next: (value) => {
          if (!!value) {
            this.store.dispatch(CourseActions.editCourse({ 
              id: editingCourse.id,
              editingStudent: value,
              students: course.students
            }))
          }
        },
        error: () => this.alertsService.sendError('Error al editar el curso')
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
      this.store.dispatch(CourseActions.deleteStudentFromCourse({ courseId, studentId }));
    })
  }

  openDetail(id: string): void {
    this.store.dispatch(CourseActions.clearStudents());
    this.store.dispatch(CourseActions.courseById({id}));

    this.singleCourse$.pipe(
      filter(course => !!course && course.id === id),
      take(1),
      switchMap(course => {
        if (course?.students && course?.students.length > 0) {
          this.store.dispatch(CourseActions.loadStudentsForm({id}));
          return this.studentsCourse$.pipe(
            filter(students => students.length === course.students.length),
            take(1),
            map(students => ({course, students})
          )
        )} else {
          return of({course, students: []})
        }
      })
    ).subscribe(({course, students}) => {
      this.openDetailDialog(course, students);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
