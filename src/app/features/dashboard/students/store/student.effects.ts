import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { StudentActions } from './student.actions';
import { StudentsService } from '../../../../core/services/students/students.service';
import { CoursesService } from '../../../../core/services/courses/courses.service';
import { InscriptionsService } from '../../../../core/services/inscriptions/inscriptions.service';


@Injectable()
export class StudentEffects {

  loadStudents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StudentActions.loadStudents),
      concatMap(() =>
        this.studentsService.getStudents().pipe(
          map(data => StudentActions.loadStudentsSuccess({ data })),
          catchError(error => of(StudentActions.loadStudentsFailure({ error }))))
      )
    );
  });

  studentById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StudentActions.studentById),
      switchMap(action => 
        this.studentsService.getStudentById(action.id).pipe(
          map(data => StudentActions.studentByIdSuccess({ data })),
          catchError(error => of(StudentActions.studentByIdFailure({ error })))
        )
      )
    )
  })

  addStudent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StudentActions.addStudent),
      concatMap(action => 
        this.studentsService.addStudent(action.data).pipe(
          map((data) => StudentActions.addStudentSuccess({ data })),
          catchError(error => of(StudentActions.addStudentFailure({ error })))
        )
      )
    )
  })

  deleteStudent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StudentActions.deleteStudent),
      concatMap(action =>
        this.studentsService.deleteStudent(action.id).pipe(
          map((data) => StudentActions.deleteStudentSuccess({ data })),
          catchError(error => of(StudentActions.deleteStudentFailure({ error })))
        )
      )
    )
  })
  
  editStudent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StudentActions.editStudent),
      concatMap(action => 
        this.studentsService.editStudent(action.id, action.courses, action.editingStudent).pipe(
          map((data) =>  StudentActions.editStudentSuccess({ id: data.id, courses: data.courses, editingStudent: data })),
          catchError(error => of(StudentActions.editStudentFailure({ error })))
        )
      )
    )
  })

  unregisterStudent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StudentActions.unregisterStudent),
      switchMap(action => 
        forkJoin([
          this.studentsService.unregisterStudent(action.courseId, action.studentId),
          this.coursesService.deleteStudentFromCourse(action.courseId, action.studentId),
          this.inscriptionsService.cancelInscription(action.courseId, action.studentId)
        ]).pipe(
          map(([unregisterResponse, deleteCourseResponse, cancelInscriptionResponse]) => 
            StudentActions.unregisterStudentSuccess({ 
              courseId: action.courseId, 
              studentId: action.studentId 
            })
          ),
          catchError(error => of(StudentActions.unregisterStudentFailure({ error })))
        )
      )
    );
  })

  addCourseToStudent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StudentActions.addCourseToStudent),
      concatMap(action => 
        this.studentsService.addCourseToStudent(action.courseId, action.studentId).pipe(
          map((data) =>  StudentActions.addCourseToStudentSuccess({ courseId: data.courseId, studentId: data.studentId})),
          catchError(error => of(StudentActions.addCourseToStudentFailure({ error })))
        )
      )
    )
  })

  constructor(private actions$: Actions, private studentsService: StudentsService, private coursesService: CoursesService, private inscriptionsService: InscriptionsService) {}
}
