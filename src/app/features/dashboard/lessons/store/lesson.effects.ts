import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, tap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { LessonActions } from './lesson.actions';
import { LessonsService } from '../../../../core/services/lessons/lessons.service';


@Injectable()
export class LessonEffects {

  loadLessons$ = createEffect(() => {
    return this.actions$.pipe(

      ofType(LessonActions.loadLessons),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        this.lessonsService.getLessons().pipe(
          tap(data => console.log("Data form service: ", data)),
          map(data => {
            console.log("data lessons: ", data)
            return LessonActions.loadLessonsSuccess({ data })
          }),
          catchError(error => 
            {
              console.error("error: ", error)
              return of(LessonActions.loadLessonsFailure({ error }))
            }
          ))
      )
    );
  });


  constructor(private actions$: Actions, private lessonsService: LessonsService) {}
}
