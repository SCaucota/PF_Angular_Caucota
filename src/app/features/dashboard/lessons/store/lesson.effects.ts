import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, tap, switchMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { LessonActions } from './lesson.actions';
import { LessonsService } from '../../../../core/services/lessons/lessons.service';
import { Lesson } from '../models/lesson';
import Swal from 'sweetalert2';


@Injectable()
export class LessonEffects {

  showError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          LessonActions.loadLessonsFailure,
          LessonActions.addLessonFailure,
          LessonActions.deleteLessonFailure,
          LessonActions.editLessonFailure,
          LessonActions.lessonByIdFailure
        ),
        tap((action) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al procesar la solicitud. Inténtalo nuevamente.',
          });
        })
      ),
    { dispatch: false }
  );

  loadLessons$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LessonActions.loadLessons),
      concatMap(() =>
        this.lessonsService.getLessons().pipe(
          map(data => LessonActions.loadLessonsSuccess({ data })),
          catchError(error => of(LessonActions.loadLessonsFailure({ error }))))
      )
    );
  });

  lessonById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LessonActions.lessonById),
      switchMap(action => 
        this.lessonsService.getLessonById(action.id).pipe(
          map(data => LessonActions.lessonByIdSuccess({ data })),
          catchError(error => of(LessonActions.lessonByIdFailure({ error })))
        )
      )
    )
  })

  addLesson$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LessonActions.addLesson),
      concatMap(action => 
        this.lessonsService.addLesson(action.lesson).pipe(
          map((lesson: Lesson) => LessonActions.addLessonSuccess({ lesson })),
          catchError(error => of(LessonActions.addLessonFailure({ error })))
        )
      )
    )
  })

  deleteLesson$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LessonActions.deleteLesson),
      concatMap(action =>
        this.lessonsService.deleteLesson(action.id).pipe(
          map((data) => LessonActions.deleteLessonSuccess({ data })),
          catchError(error => of(LessonActions.deleteLessonFailure({ error })))
        )
      )
    )
  })

  editLesson$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LessonActions.editLesson),
      concatMap(action => 
        this.lessonsService.editLesson(action.id, action.editingLesson).pipe(
          map((data: Lesson) =>  LessonActions.editLessonSuccess({ id: data.id, editingLesson: data })),
          catchError(error => of(LessonActions.editLessonFailure({ error })))
        )
      )
    )
  })

  constructor(private actions$: Actions, private lessonsService: LessonsService) {}
}
