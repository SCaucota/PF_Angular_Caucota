import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { CourseActions } from './course.actions';
import { CoursesService } from '../../../../core/services/courses/courses.service';
import { StudentsService } from '../../../../core/services/students/students.service';
import { InscriptionsService } from '../../../../core/services/inscriptions/inscriptions.service';
import { Student } from '../../students/models/student';


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
      concatMap(action => {
        const courseId = action.id   

        return this.coursesService.getCourseById(courseId).pipe(
          switchMap( course => {
            if(course.students.length !== 0) {
              const studentActions$ = course.students.map(studentId => {
                return this.studentsService.unregisterStudent(courseId, studentId).pipe(
                  switchMap(() => this.inscriptionsService.cancelInscription(courseId, studentId))
                )
              });

              return forkJoin(studentActions$).pipe(
                switchMap(() => {
                  return this.coursesService.deleteCourse(courseId).pipe(
                    map(() => CourseActions.deleteCourseSuccess({ data: course })),
                    catchError(error => of(CourseActions.deleteCourseFailure({ error })))
                  )
                })
              )
            }else {
              return this.coursesService.deleteCourse(courseId).pipe(
                map(() => CourseActions.deleteCourseSuccess({ data: course })),
                catchError(error => of(CourseActions.deleteCourseFailure({ error })))
              )
            }
          }),
          catchError(error => {
            return of(CourseActions.deleteCourseFailure({ error }))
          })
        )
      })
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
      concatMap(action =>{
        const courseId = action.courseId;
        const studentId = action.studentId;

        return this.coursesService.deleteStudentFromCourse(courseId, studentId).pipe(
          switchMap(() => this.studentsService.unregisterStudent(courseId, studentId)),
          switchMap(() => this.inscriptionsService.cancelInscription(courseId, studentId)),
          map(() => CourseActions.deleteStudentFromCourseSuccess({ courseId, studentId })),
          catchError(error => of(CourseActions.deleteStudentFromCourseFailure({ error })))
        )
      })
    )
  })

  lodStudentsCourse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.loadStudentsForm),
      concatMap(action => {
        const courseId = action.id;

        return this.coursesService.getCourseById(courseId).pipe(
          switchMap(course => {
            const students$ = course.students.map(studentId => {
              return this.studentsService.getStudentById(studentId).pipe(
                catchError(() => of(null))
              )
            })
            return forkJoin(students$).pipe(
              map(students => students.filter((student): student is Student => student !== null)),
              map((data: Student[]) => CourseActions.loadStudentsFormSuccess({ data })),
              catchError(error => of(CourseActions.loadStudentsFormFailure({ error })))
            )
          })
        )
      })
    )
  })

  constructor(private actions$: Actions, private coursesService: CoursesService, private studentsService: StudentsService, private inscriptionsService: InscriptionsService) {}
}
