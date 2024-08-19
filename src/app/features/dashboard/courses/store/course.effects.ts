import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CourseActions } from './course.actions';
import { CoursesService } from '../../../../core/services/courses/courses.service';


@Injectable()
export class CourseEffects {

  loadCourses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.loadCourses),
      concatMap(() =>
        this.coursesService.getCourses().pipe(
          map(data => CourseActions.loadCoursesSuccess({ data })),
          catchError(error => of(CourseActions.loadCoursesFailure({ error }))))
      )
    );
  });

  coursesById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.courseById),
      switchMap(action => 
        this.coursesService.getCourseById(action.id).pipe(
          map(data => CourseActions.courseByIdSuccess({ data })),
          catchError(error => of(CourseActions.courseByIdFailure({ error })))
        )
      )
    )
  })

  addCourse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.addCourse),
      concatMap(action => 
        this.coursesService.addCourse(action.data).pipe(
          map((data) => CourseActions.addCourseSuccess({ data })),
          catchError(error => of(CourseActions.addCourseFailure({ error })))
        )
      )
    )
  })

  deleteCourse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.deleteCourse),
      concatMap(action =>
        this.coursesService.deleteCourse(action.id).pipe(
          map((data) => CourseActions.deleteCourseSuccess({ data })),
          catchError(error => of(CourseActions.deleteCourseFailure({ error })))
        )
      )
    )
  })
  
  editCourse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.editCourse),
      concatMap(action => 
        this.coursesService.editCourse(action.id, action.editingStudent, action.students).pipe(
          map((data) =>  CourseActions.editCourseSuccess({ id: data.id, editingStudent: data,  students: data.students})),
          catchError(error => of(CourseActions.editCourseFailure({ error })))
        )
      )
    )
  })

  deleteStudentFromCourse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.deleteStudentFromCourse),
      concatMap(action =>
        this.coursesService.deleteStudentFromCourse(action.courseId, action.studentId).pipe(
          map((data) => CourseActions.deleteStudentFromCourseSuccess({ courseId: data.courseId, studentId: data.studentId })),
          catchError(error => of(CourseActions.deleteStudentFromCourseFailure({ error })))
        )
      )
    )
  })

  addStudentToCourse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.addStudentToCourse),
      concatMap(action =>
        this.coursesService.addStudentToCourse(action.studentId, action.courseId).pipe(
          map((data) => CourseActions.addStudentToCourseSuccess({ studentId: data.studentId, courseId: data.courseId })),
          catchError(error => of(CourseActions.addStudentToCourseFailure({ error })))
        )
      )
    )
  })

  constructor(private actions$: Actions, private coursesService: CoursesService) {}
}
