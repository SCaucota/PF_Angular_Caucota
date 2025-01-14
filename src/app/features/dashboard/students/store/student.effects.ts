import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap, last } from 'rxjs/operators';
import { concat, EMPTY, forkJoin, of } from 'rxjs';
import { StudentActions } from './student.actions';
import { StudentsService } from '../../../../core/services/students/students.service';
import { CoursesService } from '../../../../core/services/courses/courses.service';
import { InscriptionsService } from '../../../../core/services/inscriptions/inscriptions.service';
import { Course } from '../../courses/models/course';


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
      concatMap(action => {
        const studentId = action.id;
        return this.studentsService.getStudentById(studentId).pipe(
          switchMap(student => {
            if (student.courses.length !== 0) {
              const courseActions$ = student.courses.map(courseId => {
                return this.coursesService.deleteStudentFromCourse(courseId, studentId).pipe(
                  switchMap(() => this.inscriptionsService.cancelInscription(courseId, studentId))
                );
              });

              return forkJoin(courseActions$).pipe(
                switchMap(() => {
                  return this.studentsService.deleteStudent(studentId).pipe(
                    map(() => StudentActions.deleteStudentSuccess({ data: student })),
                    catchError(error => of(StudentActions.deleteStudentFailure({ error })))
                  );
                })
              );
            } else {
              return this.studentsService.deleteStudent(studentId).pipe(
                map(() => StudentActions.deleteStudentSuccess({ data: student })),
                catchError(error => of(StudentActions.deleteStudentFailure({ error })))
              );
            }
          }),
          catchError(error => {
            return of(StudentActions.deleteStudentFailure({ error }));
          })
        );
      })
    );
  });
  
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
      concatMap(action => {
        const courseId = action.courseId;
        const studentId = action.studentId;

        return this.studentsService.unregisterStudent(courseId, studentId).pipe(
          switchMap(() => this.coursesService.deleteStudentFromCourse(courseId, studentId)),
          switchMap(() => this.inscriptionsService.cancelInscription(courseId, studentId)),
          map(() => StudentActions.unregisterStudentSuccess({courseId: courseId, studentId: studentId})),
          catchError((error) => of(StudentActions.unregisterStudentFailure({ error })))
        )
      })
    );
  });

  loadCoursesStudent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StudentActions.loadCoursesStudent),
      concatMap(action => {
        const studentId = action.id;

        return this.studentsService.getStudentById(studentId).pipe(
          switchMap(student => {
            const courses$ = student.courses.map((courseId: string) => {
              return this.coursesService.getCourseById(courseId).pipe(
                catchError(() => of(null))
              )
            })
            return forkJoin(courses$).pipe(
              map(courses => courses.filter((course): course is Course => course !== null)),
              map((data: Course[]) => StudentActions.loadCoursesStudentSuccess({ data })),
              catchError(error => of(StudentActions.loadCoursesStudentFailure({ error })))
            )
          })
        )
      })
    );
  });

  constructor(private actions$: Actions, private studentsService: StudentsService, private coursesService: CoursesService, private inscriptionsService: InscriptionsService) {}
}
