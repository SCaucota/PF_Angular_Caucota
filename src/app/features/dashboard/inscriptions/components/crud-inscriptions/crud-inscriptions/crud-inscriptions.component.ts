import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InscriptionsService } from '../../../../../../core/services/inscriptions/inscriptions.service';
import { Inscription } from '../../../models/inscription';
import { DeleteDialogComponent } from '../../../../../../shared/components/delete-dialog/delete-dialog.component';
import { InscriptionsDialogComponent } from '../../inscriptions-dialog/inscriptions-dialog/inscriptions-dialog.component';
import { DetailDialogComponent } from '../../../../../../shared/components/detail-dialog/detail-dialog.component';
import { StudentsService } from '../../../../../../core/services/students/students.service';
import { CoursesService } from '../../../../../../core/services/courses/courses.service';
import { AuthService } from '../../../../../../core/services/auth/auth.service';
import { combineLatest, filter, forkJoin, mergeMap, Observable, of, switchMap, take, tap } from 'rxjs';
import { User } from '../../../../users/models/user';
import { Store } from '@ngrx/store';
import { selectCourseInscription, selectInscriptions, selectInscriptionsError, selectIsLoadingInscriptions, selectSingleInscription, selectStudentInscription } from '../../../store/inscription.selectors';
import { InscriptionActions } from '../../../store/inscription.actions';
import { AlertsService } from '../../../../../../core/services/sweetalert/alerts.service';
import { Course } from '../../../../courses/models/course';
import { selectSingleCourse } from '../../../../courses/store/course.selectors';
import { CourseActions } from '../../../../courses/store/course.actions';
import { Student } from '../../../../students/models/student';

@Component({
  selector: 'app-crud-inscriptions',
  templateUrl: './crud-inscriptions.component.html',
  styleUrl: './crud-inscriptions.component.scss'
})
export class CrudInscriptionsComponent {

  authUser$: Observable<User | null>;
  inscriptions$: Observable<Inscription[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<unknown>;
  singleInscription$: Observable<Inscription>;
  course$: Observable<Course | null>;
  student$: Observable<Student | null>;

  constructor(
    private matDialog: MatDialog,
    private inscriptionsService: InscriptionsService,
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private store: Store,
    private alertsService: AlertsService,
    private authService: AuthService
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

    this.authService.authUser$.subscribe((user: User | null) => {
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
    this.store.dispatch(InscriptionActions.clearInscriptionDetails());
    this.store.dispatch(InscriptionActions.inscriptionById({ id }));
  
    this.singleInscription$.pipe(
      filter(inscription => !!inscription && inscription.id === id),
      take(1)
    ).subscribe(inscription => {
      if (inscription) {
        this.store.dispatch(
          InscriptionActions.loadInscriptionDetails({
            courseId: inscription.courseId,
            studentId: inscription.studentId
          })
        );
  
        this.student$.pipe(
          filter(student => !!student?.id && student.id === inscription.studentId),
          take(1)
        ).subscribe();
        
        this.course$.pipe(
          filter(course => !!course?.id && course.id === inscription.courseId),
          take(1)
        ).subscribe();
  
        combineLatest([this.student$, this.course$]).pipe(
          filter(([student, course]) => !!student && !!course),
          take(1)
        ).subscribe(([student, course]) => {
          console.log(student)
          this.matDialog.open(DetailDialogComponent, {
            data: {
              title: 'Detalles de la inscripción',
              item: inscription,
              subitem: {
                student: student,
                course: course
              }
            }
          });
        });
      }
    });
  }
}
