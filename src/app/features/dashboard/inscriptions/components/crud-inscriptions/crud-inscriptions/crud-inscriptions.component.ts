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
import { EMPTY, forkJoin, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { User } from '../../../../users/models/user';

@Component({
  selector: 'app-crud-inscriptions',
  templateUrl: './crud-inscriptions.component.html',
  styleUrl: './crud-inscriptions.component.scss'
})
export class CrudInscriptionsComponent {

  authUser$: Observable<User | null>

  constructor(
    private matDialog: MatDialog,
    private inscriptionsService: InscriptionsService,
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private authService: AuthService
  ) {
    this.authUser$ = this.authService.authUser$;
   }

  displayedColumns: string[] = ['id', 'studentId', 'courseId', 'date', 'status', 'actions'];

  dataSource: Inscription[] = [];

  isAdmin: boolean = false;

  loadInscription() {
    this.inscriptionsService.getInscriptions().subscribe({
      next: (inscriptionFormDb) => {
        this.dataSource = [...inscriptionFormDb]
      },
      error: (err) => console.log("Error al cargar las inscripciones: ", err)
    })
  }

  ngOnInit(): void {
    this.loadInscription();
    this.authService.authUser$.subscribe((user: User | null) => {
      this.isAdmin = user?.role === 'ADMIN';
    });
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(InscriptionsDialogComponent);

    dialogRef.componentInstance.onSubmitInscriptionEvent.subscribe((inscription: Inscription) => {
      this.onSubmitInscription(inscription);
    })
  }

  onSubmitInscription(inscription: Inscription): void {
    this.inscriptionsService.addInscription(inscription).subscribe(newInscription => {
      this.coursesService.addStudentToCourse(newInscription.studentId, newInscription.courseId).subscribe(() => {
        this.studentsService.addCourseToStudent(newInscription.courseId, newInscription.studentId)
        .pipe(
          tap(() => this.loadInscription())
        )
        .subscribe()
      })
    });
  }

  deleteInscription(id: string): void {
    this.inscriptionsService.getInscriptionById(id).subscribe(inscription => {
      const dialogRef = this.matDialog.open(DeleteDialogComponent, {
        data: {
          title:'Eliminar Inscripción',
          entityName: 'la inscripción',
          item: inscription
        }
      })
  
      dialogRef.componentInstance.confirmDeleteEvent.subscribe((inscription: Inscription) => {
        this.loadInscription()
        this.inscriptionsService.deleteInscription(id).pipe(
          mergeMap(() => {
            if(inscription.studentId !== null && inscription.courseId !== null) {
              return this.coursesService.deleteStudentFromCourse(inscription.courseId, inscription.studentId).pipe(
                switchMap(() => this.studentsService.unregisterStudent(inscription.courseId, inscription.studentId))
              )
            }else{
              return of(null).pipe(
                tap(() => this.loadInscription())
              );
            }
          }),
          tap(() => this.loadInscription())
        ).subscribe()
      })
    })
  }

  editInscription(editingInscription: Inscription): void {
    const originalInscription = { ...editingInscription };

    this.matDialog.open(InscriptionsDialogComponent, {data: editingInscription}).afterClosed().subscribe({
      next: (updatedInscription) => {
        if (updatedInscription) {
          this.inscriptionsService.editInscription(editingInscription.id, updatedInscription).pipe(
            switchMap(() => {
              if (originalInscription.studentId !== updatedInscription.studentId || originalInscription.courseId !== updatedInscription.courseId || originalInscription.status !== updatedInscription.status) {
                const tasks = [];

                if (originalInscription.studentId !== updatedInscription.studentId || originalInscription.courseId !== updatedInscription.courseId){
                  tasks.push(
                    this.coursesService.deleteStudentFromCourse(originalInscription.courseId, originalInscription.studentId).pipe(
                      switchMap(() => this.coursesService.addStudentToCourse(updatedInscription.studentId, updatedInscription.courseId))
                    ),
                    this.studentsService.unregisterStudent(originalInscription.courseId, originalInscription.studentId).pipe(
                      switchMap(() => this.studentsService.addCourseToStudent(updatedInscription.courseId, updatedInscription.studentId)
                      )
                    )
                  )
                }else if (originalInscription.status !== updatedInscription.status) {
                  if(updatedInscription.status === true) {
                    tasks.push(
                      this.coursesService.addStudentToCourse(updatedInscription.studentId, updatedInscription.courseId).pipe(
                        switchMap(() => this.studentsService.addCourseToStudent(updatedInscription.courseId, updatedInscription.studentId))
                      )
                    )
                  }else {
                    tasks.push(
                      this.coursesService.deleteStudentFromCourse(originalInscription.courseId, originalInscription.studentId).pipe(
                        switchMap(() => this.studentsService.unregisterStudent(originalInscription.courseId, originalInscription.studentId))
                      )
                    )
                  }
                }
                return forkJoin(tasks);
              } else {
                return of(null);
              }
            })
          ).subscribe({
            next: () => this.loadInscription(),
            error: (err) => console.log("Error al editar la Inscripción: ", err)
          })
        }
      },
      error: (err) => console.log("Error al editar la Inscripción: ", err)
    });
  }

  openDetail(id: string): void {
    this.inscriptionsService.getInscriptionById(id).subscribe(inscription => {
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
}
