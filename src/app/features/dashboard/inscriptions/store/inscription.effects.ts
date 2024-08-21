import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap, mergeMap, tap } from 'rxjs/operators';
import { Observable, EMPTY, of, forkJoin, combineLatest } from 'rxjs';
import { InscriptionActions } from './inscription.actions';
import { InscriptionsService } from '../../../../core/services/inscriptions/inscriptions.service';
import { CoursesService } from '../../../../core/services/courses/courses.service';
import { StudentsService } from '../../../../core/services/students/students.service';


@Injectable()
export class InscriptionEffects {

  loadInscriptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InscriptionActions.loadInscriptions),
      concatMap(() =>
        this.inscriptionsService.getInscriptions().pipe(
          map(data => InscriptionActions.loadInscriptionsSuccess({ data })),
          catchError(error => of(InscriptionActions.loadInscriptionsFailure({ error }))))
      )
    );
  });

  loadInscriptionDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InscriptionActions.loadInscriptionDetails),
      concatMap(({courseId, studentId}) => {
        const course$ = this.coursesService.getCourseById(courseId);
        const student$ = this.studentsService.getStudentById(studentId);
  
        return combineLatest([course$, student$]).pipe(
          tap(([course, student]) => {
            console.log('Loaded course and student:', course, student);
          }),
          map(([course, student]) => InscriptionActions.loadInscriptionDetailsSuccess({course, student})),
          catchError(error => of(InscriptionActions.loadInscriptionDetailsFailure({ error })))
        );
      })
    );
  });

  inscriptionsById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InscriptionActions.inscriptionById),
      switchMap(action => 
        this.inscriptionsService.getInscriptionById(action.id).pipe(
          map(data => InscriptionActions.inscriptionByIdSuccess({ data })),
          catchError(error => of(InscriptionActions.inscriptionByIdFailure({ error })))
        )
      )
    )
  })

  addInscriptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InscriptionActions.addInscription),
      concatMap(action => {
        return this.inscriptionsService.addInscription(action.data).pipe(
          switchMap((createdInscription) => {
            return forkJoin([
              this.coursesService.addStudentToCourse(action.data.courseId, action.data.studentId),
              this.studentsService.addCourseToStudent(action.data.courseId, action.data.studentId)
            ]).pipe(
              map(() => InscriptionActions.addInscriptionSuccess({ data: createdInscription })),
            );
          }),
          catchError(error => of(InscriptionActions.addInscriptionFailure({ error })))
        )
      }
      )
    )
  })

  deleteInscription$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InscriptionActions.deleteInscription),
      concatMap(action => {
        const inscriptionId = action.id   

        return this.inscriptionsService.deleteInscription(inscriptionId).pipe(
          switchMap( inscription => {
            if(inscription.courseId !== null && inscription.studentId !== null) {
              return this.coursesService.deleteStudentFromCourse(inscription.courseId, inscription.studentId).pipe(
                switchMap(() => this.studentsService.unregisterStudent(inscription.courseId, inscription.studentId)),
                map(() => inscription)
              )
            }else {
              return of(inscription)
            }
          }),
          map((inscription) => InscriptionActions.deleteInscriptionSuccess({ data: inscription })),
          catchError(error => {
            return of(InscriptionActions.deleteInscriptionFailure({ error }))
          })
        )
      })
    )
  })
  
  editInscription$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InscriptionActions.editInscription),
      concatMap(action => {
        return this.inscriptionsService.getInscriptionById(action.id).pipe(
          switchMap((inscription) => {
            const oldInscription = action.oldInscription;
            const newInscription = action.newInscription;
            const tasks = [];
            if(
              oldInscription.courseId !== newInscription.courseId ||
              oldInscription.studentId !== newInscription.studentId ||
              oldInscription.status !== newInscription.status
            )
            { 
              if(
                oldInscription.courseId === null || oldInscription.studentId === null
              )
              {
               if(newInscription.status === true) {
                 tasks.push(
                  this.studentsService.addCourseToStudent(newInscription.courseId, newInscription.studentId).pipe(
                    mergeMap(() => this.coursesService.addStudentToCourse(newInscription.courseId, newInscription.studentId))
                  )
                 )
               }else {
                tasks.push(
                  of(null)
                )
               }
              } else if(newInscription.status === false) {
                tasks.push(
                  this.coursesService.deleteStudentFromCourse(oldInscription.courseId, oldInscription.studentId).pipe(
                    mergeMap(() => this.studentsService.unregisterStudent(oldInscription.courseId, oldInscription.studentId),
                  ))
                )
              }else{
                tasks.push(
                  this.coursesService.deleteStudentFromCourse(oldInscription.courseId, oldInscription.studentId).pipe(
                    mergeMap(() => this.coursesService.addStudentToCourse(newInscription.courseId, newInscription.studentId)),
                  ),
                  this.studentsService.unregisterStudent(oldInscription.courseId, oldInscription.studentId).pipe(
                    mergeMap(() => this.studentsService.addCourseToStudent(newInscription.courseId, newInscription.studentId)),
                  )
                )
              }
              return forkJoin(tasks).pipe(
                switchMap(() => {
                  return this.inscriptionsService.editInscription(inscription.id, newInscription).pipe(
                    map((updatedInscription) => InscriptionActions.editInscriptionSuccess({ id: updatedInscription.id, editingInscription: updatedInscription })),
                    catchError(error => of(InscriptionActions.editInscriptionFailure({ error })))
                  )
                })
              )
            } else {
              return EMPTY;
            }
          }),
          catchError(error => of(InscriptionActions.editInscriptionFailure({ error })))
        )
      })
    )
  })

  constructor(private actions$: Actions, private inscriptionsService: InscriptionsService, private coursesService: CoursesService,  private studentsService: StudentsService) {}
}
