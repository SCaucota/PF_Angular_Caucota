import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Student } from '../models/student';
import { Course } from '../../courses/models/course';

export const StudentActions = createActionGroup({
  source: 'Student',
  events: {
    'Load Students': emptyProps(),
    'Load Students Success': props<{ data: Student[] }>(),
    'Load Students Failure': props<{ error: unknown }>(),
    'Load Courses Student': props<{ id: string }>(),
    'Load Courses Student Success': props<{ data: Course[] }>(),
    'Load Courses Student Failure': props<{ error: unknown }>(),
    'Clear Courses': emptyProps(),
    'Student By Id': props<{ id: string }>(),
    'Student By Id Success': props<{ data: Student }>(),
    'Student By Id Failure': props<{ error: unknown}>(),
    'Add Student': props<{ data: Student }>(),
    'Add Student Success': props<{ data: Student }>(),
    'Add Student Failure': props<{ error: unknown }>(),
    'Delete Student': props<{ id: string }>(),
    'Delete Student Success': props<{ data: Student }>(),
    'Delete Student Failure': props<{ error: unknown }>(),
    'Edit Student': props<{ id: string, courses: any[], editingStudent: Student }>(),
    'Edit Student Success': props<{ id: string, courses: any[], editingStudent: Student }>(),
    'Edit Student Failure': props<{ error: unknown }>(),
    'Unregister Student': props<{ courseId: string, studentId: string }>(),
    'Unregister Student Success': props<{ courseId: string, studentId: string }>(),
    'Unregister Student Failure': props<{ error: unknown }>(),
    'Add Course To Student': props<{ courseId: string, studentId: string }>(),
    'Add Course To Student Success': props<{ courseId: string, studentId: string }>(),
    'Add Course To Student Failure': props<{ error: unknown }>(),
    'Reset Student State': emptyProps()
  }
});
