import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Inscription } from '../../models/inscription';
import { DeleteDialogComponent } from '../../../../../shared/components/delete-dialog/delete-dialog.component';
import { InscriptionsDialogComponent } from '../inscriptions-dialog/inscriptions-dialog.component';
import { DetailDialogComponent } from '../../../../../shared/components/detail-dialog/detail-dialog.component';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { combineLatest, filter, forkJoin, map, Observable, of, Subject, take, takeUntil, tap } from 'rxjs';
import { User } from '../../../users/models/user';
import { Store } from '@ngrx/store';
import { selectCourseInscription, selectInscriptions, selectInscriptionsError, selectIsLoadingInscriptions, selectSingleInscription, selectStudentInscription } from '../../store/inscription.selectors';
import { InscriptionActions } from '../../store/inscription.actions';
import { AlertsService } from '../../../../../core/services/sweetalert/alerts.service';
import { Course } from '../../../courses/models/course';
import { Student } from '../../../students/models/student';
import { CoursesService } from '../../../../../core/services/courses/courses.service';
import { StudentsService } from '../../../../../core/services/students/students.service';
import { InscriptionsService } from '../../../../../core/services/inscriptions/inscriptions.service';

@Component({
  selector: 'app-crud-inscriptions',
  templateUrl: './crud-inscriptions.component.html',
  styleUrl: './crud-inscriptions.component.scss'
})
export class CrudInscriptionsComponent implements OnDestroy{
  private unsubscribe$ = new Subject<void>();

  authUser$: Observable<User | null>;
  inscriptions$: Observable<Inscription[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<unknown>;
  singleInscription$: Observable<Inscription>;
  course$: Observable<Course | null>;
  student$: Observable<Student | null>;

  constructor(
    private matDialog: MatDialog,
    private store: Store,
    private alertsService: AlertsService,
    private authService: AuthService,
    private coursesService: CoursesService,
    private studentsService: StudentsService,
    private inscriptionsService: InscriptionsService
  ) {
    this.authUser$ = this.authService.authUser$;
    this.inscriptions$ = this.store.select(selectInscriptions);
    this.singleInscription$ = this.store.select(selectSingleInscription);
    this.isLoading$ = this.store.select(selectIsLoadingInscriptions);
    this.error$ = this.store.select(selectInscriptionsError);
    this.course$ = this.store.select(selectCourseInscription);
    this.student$ = this.store.select(selectStudentInscription)
   }

  displayedColumns: string[] = ['id', 'studentId', 'courseId', 'date', 'status', 'actions'];

  dataSource: Inscription[] = [];

  isAdmin: boolean = false;

  ngOnInit(): void {
    this.store.dispatch(InscriptionActions.loadInscriptions());

    this.authService.authUser$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((user: User | null) => {
      this.isAdmin = user?.role === 'ADMIN';
    });
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(InscriptionsDialogComponent);

    dialogRef.componentInstance.onSubmitInscriptionEvent.subscribe({
      next: (inscription: Inscription) => {
        this.onSubmitInscription(inscription);
      },
      error: () => this.alertsService.sendError('Error al abrir el formulario de inscripciones')
    })
  }

  onSubmitInscription(inscription: Inscription): void {
    this.store.dispatch(InscriptionActions.addInscription({ data: inscription }))
  }

  deleteInscription(id: string): void {
    this.store.dispatch(InscriptionActions.inscriptionById({id}));

    this.singleInscription$.pipe(
      filter(inscription => !!inscription && inscription.id === id),
      take(1)
    ).subscribe(inscription => {
      const dialogRef = this.matDialog.open(DeleteDialogComponent, {
        data: {
          title:'Eliminar Inscripción',
          entityName: 'la inscripción',
          item: inscription
        }
      })
  
      dialogRef.componentInstance.confirmDeleteEvent.subscribe({
        next: (inscription: Inscription) => {
          this.store.dispatch(InscriptionActions.deleteInscription({id : inscription.id}))
        },
        error: () => this.alertsService.sendError('Error al eliminar la inscripción')
      })
    })
  }

  editInscription(editingInscription: Inscription): void {
    const originalInscription = { ...editingInscription };

    this.matDialog.open(InscriptionsDialogComponent, {data: editingInscription}).afterClosed().subscribe({
      next: (updatedInscription) => {
        this.store.dispatch(InscriptionActions.editInscription({
          id: editingInscription.id,
          newInscription: updatedInscription !== "" ? updatedInscription : editingInscription,
          oldInscription: originalInscription
        }))
      },
      error: () => this.alertsService.sendError('Error al editar la inscripción')
    });
  }

  openDetail(id: string): void {
    this.store.dispatch(InscriptionActions.clearInscriptionState());
    this.store.dispatch(InscriptionActions.inscriptionById({id}));

    this.singleInscription$.pipe(
      filter(inscription => !!inscription && inscription.id === id),
      take(1)
    ).subscribe(inscription => {
      if(inscription) {
        const studentid = inscription.studentId
        const courseid = inscription.courseId;
        const student$ = studentid ? this.studentsService.getStudentById(studentid) : of(null);
        const course$ = courseid ? this.coursesService.getCourseById(courseid) : of(null);
        forkJoin([student$, course$]).subscribe(([student, course]) => {
          this.matDialog.open(DetailDialogComponent, {
            data: {
              title: 'Detalles de la inscripción',
              item: inscription,
              subitem: {
                student: student,
                course: course
              }
            }
          })
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
